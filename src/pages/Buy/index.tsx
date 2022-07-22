import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import moment from 'moment';

interface DataType {
  // buyer: Principal;
  // seller: Principal;
  index: number;
  amount: number;
  delta: number;
  price: number;
  // status: Status;
  createAt: string;
}

  // NNS Canister Id as an example
  const nnsCanisterId = 'ngtm2-tyaaa-aaaan-qahpa-cai'
  // const whitelist = [nnsCanisterId];

  // // Initialise Agent, expects no return value
  // await window?.ic?.plug?.requestConnect({
  //   whitelist,
  // });

  // A partial Interface factory
  // for the NNS Canister UI
  // Check the `plug authentication - nns` for more
  const nnsPartialInterfaceFactory = ({ IDL }) => {
    const OrderStatus = IDL.Variant({
      'done' : IDL.Nat,
      'open' : IDL.Nat,
      'cancel' : IDL.Nat,
    });
    const OrderExt = IDL.Record({
      'status' : OrderStatus,
      'createAt' : IDL.Int,
      'owner' : IDL.Principal,
      'index' : IDL.Nat,
      'price' : IDL.Nat,
      'amount' : IDL.Nat,
      'delta' : IDL.Nat,
    });
    return IDL.Service({
      'getBuyList' : IDL.Func([], [IDL.Vec(OrderExt)], ['query']),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const NNSUiActor = await window.ic.plug.createActor({
    canisterId: nnsCanisterId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });

const columns: ColumnsType<DataType> = [
  // {
  //   title: '买方',
  //   dataIndex: 'buyer',
  //   key:'buyer',
  // },
  // {
  //   title: '卖方',
  //   dataIndex: 'seller',
  //   key:'seller',
  // },
  {
    title: '挂单ID',
    dataIndex: 'index',
    key:'index',
  },
  {
    title: '数量',
    dataIndex: 'amount',
    key:'amount',
  },
  {
    title: '最大差价',
    dataIndex: 'delta',
    key:'delta',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key:'price',
  },
  {
    title: 'createAt',
    dataIndex: 'createAt',
    key:'createAt',
  },
  
];



const Buy: React.FC<unknown> = () => {
  const [dataSource,setDataSource]=useState<Array<DataType>>([]);

  const loadData = async()=>{
    const data : DataType[]= await NNSUiActor.getBuyList();
    const elements: DataType[]= [];
    //处理数组
    data.forEach((item)=>{
      const trans: DataType = {index:Number(item.index),
        amount:Number(item.amount),
        price:Number(item.price),
        delta:Number(item.delta),
        createAt:(moment(Number(item.createAt)/1000000).format("YYYY-MM-DD HH:mm:ss")),
      };
      elements.push(trans);
      
    });
    setDataSource(elements);
  }
  loadData();


  return (
    <PageContainer
      header={{
        title: '买方挂单',
      }}
    >
      <Table columns={columns} dataSource={dataSource} rowKey='index'/>

    </PageContainer>
    
    );
  
};

export default Buy;