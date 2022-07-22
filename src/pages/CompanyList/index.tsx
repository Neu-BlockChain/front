import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useState, useEffect} from 'react';
import moment from 'moment';

interface DataType {

  principal: string;
  name: string;
  initAmount: number;
  burn: number;
  amount: number;
  buy: number;
  sell: number;
}

  // NNS Canister Id as an example
  const ch4CanisterId = 'epr6w-qyaaa-aaaag-qalia-cai'
  const marketCanisterId = 'ngtm2-tyaaa-aaaan-qahpa-cai'
  // const whitelist = [nnsCanisterId];

  // // Initialise Agent, expects no return value
  // await window?.ic?.plug?.requestConnect({
  //   whitelist,
  // });

  // A partial Interface factory
  // for the NNS Canister UI
  // Check the `plug authentication - nns` for more
  const nnsPartialInterfaceFactory = ({ IDL }) => {
    const Company = IDL.Record({
      'principal' : IDL.Principal,
      'desc' : IDL.Text,
      'name' : IDL.Text,
      'webLink' : IDL.Text,
    });
    const Result_2 = IDL.Variant({ 'ok' : Company, 'err' : IDL.Null });
    return IDL.Service({
        'getAllCompanyPr' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
        'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
        'fromBuy_balanceof' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
        'toSell_balanceof' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
        'minted_balanceof' : IDL.Func([IDL.Principal], [IDL.Nat],['query']),
        'burned_balanceof': IDL.Func([IDL.Principal], [IDL.Nat],['query']),
        'getCompanyInfo' : IDL.Func([IDL.Principal], [Result_2], ['query']),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const ch4Actor = await window.ic.plug.createActor({
    canisterId: ch4CanisterId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });
  
  const marketActor = await window.ic.plug.createActor({
      canisterId: marketCanisterId,
      interfaceFactory: nnsPartialInterfaceFactory,
  });

const columns: ColumnsType<DataType> = [
  {
    title: '企业principal',
    dataIndex: 'principal',
    key:'principal',
  },
  {
    title: '企业名称',
    dataIndex: 'name',
    key:'name',
  },
  {
    title: '政府发放额',
    dataIndex: 'initAmount',
    key:'initAmount',
  },
  {
    title: '已排放额',
    dataIndex: 'burn',
    key:'burn',
  },
  {
    title: '当前余额',
    dataIndex: 'amount',
    key:'amount',
  },
  {
    title: '购入限额',
    dataIndex: 'buy',
    key:'buy',
  },
  {
    title: '卖出限额',
    dataIndex: 'sell',
    key:'sell',
  },
  
];



const CompanyList: React.FC<unknown> = () => {
  const [dataSource,setDataSource]=useState<Array<DataType>>([]);

  const loadData = async()=>{
    const data = await marketActor.getAllCompanyPr();
    // console.log(data);
    const elements: DataType[]= [];
    //处理数组
    data.length
    for(var i=0;i<data.length;i++){
        const d = await marketActor.getCompanyInfo(data[i]);
        const name = d.ok.name;
        const principal = String(`${data[i]}`);
        const initAmount = await ch4Actor.minted_balanceof(data[i]);
        const burn = await ch4Actor.burned_balanceof(data[i]);
        const amount = await ch4Actor.balanceOf(data[i]);
        const buy = await marketActor.fromBuy_balanceof(data[i]);
        const sell = await marketActor.toSell_balanceof(data[i]);

      const trans: DataType = {
        principal: principal,
        name: name,
        initAmount: Number(initAmount),
        burn: Number(burn),
        amount: Number(amount),
        buy:  Number(buy),
        sell: Number(sell),
      };
      elements.push(trans);

    }
    setDataSource(elements);

  }
  useEffect(()=>{
    loadData();
  },[dataSource])

  return (
    <PageContainer
      header={{
        title: '公司列表',
      }}
    >
      <Table columns={columns} dataSource={dataSource} rowKey='principal'/>

    </PageContainer>
    
    );
  
};

export default CompanyList;