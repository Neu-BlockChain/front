import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';

interface DataType {
  sum: number;//纵坐标
  dealTime: number;//横坐标
}


// NNS Canister Id as an example
const nnsCanisterId = 'ngtm2-tyaaa-aaaan-qahpa-cai'
const whitelist = [nnsCanisterId];

// Initialise Agent, expects no return value
await window?.ic?.plug?.requestConnect({
  whitelist,
});

// A partial Interface factory
// for the NNS Canister UI
// Check the `plug authentication - nns` for more
const nnsPartialInterfaceFactory = ({ IDL }) => {
  const DealOrder = IDL.Record({
    'sum' : IDL.Nat,
    'seller' : IDL.Principal,
    'buyOrderIndex' : IDL.Nat,
    'buyer' : IDL.Principal,
    'price' : IDL.Nat,
    'amount' : IDL.Nat,
    'dealTime' : IDL.Int,
    'sellOrderIndex' : IDL.Nat,
  });
  return IDL.Service({
    'getRecentMonthDeals' : IDL.Func([], [IDL.Vec(DealOrder)], ['query']),
  });
};

// Create an actor to interact with the NNS Canister
// we pass the NNS Canister id and the interface factory
const NNSUiActor = await window.ic.plug.createActor({
  canisterId: nnsCanisterId,
  interfaceFactory: nnsPartialInterfaceFactory,
});


const Chart: React.FC<unknown> = () => {

const [dataSource,setDataSource] = useState<Array<DataType>>([]);

const loadData = async()=>{
    const data =  await NNSUiActor.getRecentMonthDeals();
    const elements: DataType[]= [];
    data.forEach((item)=>{
        const trans: DataType = {sum:Number(item.sum),
          dealTime: Number(item.dealTime),
        };
        elements.push(trans);
      });
      setDataSource(elements);
}

loadData();
console.log(dataSource);
    
  return (
    <div>这里放图</div>
    
    );
  
};

export default Chart;