import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import * as charts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
declare const window: Window & { ic: any }



// NNS Canister Id as an example
const ch4CanisterId = 'epr6w-qyaaa-aaaag-qalia-cai'
const marketCanisterId = 'ngtm2-tyaaa-aaaan-qahpa-cai'
const whitelist = [ch4CanisterId,marketCanisterId];

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
    'fromBuy_balanceof' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'toSell_balanceof' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'minted_balanceof' : IDL.Func([IDL.Principal], [IDL.Nat],['query']),
    'burned_balanceof': IDL.Func([IDL.Principal], [IDL.Nat],['query']),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
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

const Chart: React.FC<unknown> = () => {

//总共被政府派发的限额
const [mintedBalance,setMintedBalance] = useState<Number>();
//用户燃烧排放的限额
const [burnedBalance,setBurnedBalance] = useState<Number>();
//用户购入的限额
const [buyBalance,setBuyBalance] = useState<Number>();
//用户卖出的限额
const [sellBalance,setSellBalance] = useState<Number>();
//用户当前的余额
const [balance,setBalance] = useState<Number>();


const loadData = async()=>{
    const principalId = await window.ic.plug.agent.getPrincipal();

    const mintedBalance = await ch4Actor.minted_balanceof(principalId);
    setMintedBalance(Number(mintedBalance));

    const burnedBalance = await ch4Actor.burned_balanceof(principalId);
    setBurnedBalance(Number(burnedBalance));

    const balance = await ch4Actor.balanceOf(principalId);
    setBalance(Number(balance));

    const buyBalance =  await marketActor.fromBuy_balanceof(principalId);
    setBuyBalance(Number(buyBalance));

    const sellBalance =  await marketActor.toSell_balanceof(principalId);
    setSellBalance(Number(sellBalance));
}

loadData();
console.log(mintedBalance);
console.log(burnedBalance);
console.log(balance);
console.log(buyBalance);
console.log(sellBalance);
  return (
    <PageContainer
      header={{
        title: '交易图表',
      }}
    >
      
    </PageContainer>

    );
  
};


export default Chart;