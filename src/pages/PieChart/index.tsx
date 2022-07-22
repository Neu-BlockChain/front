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
// const whitelist = [ch4CanisterId,marketCanisterId];

// // Initialise Agent, expects no return value
// await window?.ic?.plug?.requestConnect({
//   whitelist,
// });

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

const getOption1 = () => {
  const option: charts.EChartsOption = {
    title: {
      text: '甲烷来源图',
      left: 'center'  
    },
     legend:{
      data:['政府派发','用户购入'],
      bottom:-5
    },
    series:[
      {
        type: 'pie',
        label: {
          formatter: `{d}%`,
        },
        data: [
          {
            name:'政府派发',
            value: Number(mintedBalance),
          },
          {
            name:'用户购入',
            value:Number(buyBalance)
          }
        
        ]
      }
    ]
  }
  return option
};
const getOption2 = () => {
  const option: charts.EChartsOption = {
    title: {
      text: '甲烷消耗图',
      left: 'center'  
    },
     legend:{
      data:['用户燃烧','用户卖出','当前余额'],
      bottom:-5
    },
    series:[
      {
        type: 'pie',
        label: {
          formatter: `{d}%`,
        },
        data: [
          {
            name:'用户燃烧',
            value: Number(burnedBalance)
          },
          {
            name:'用户卖出',
            value:Number(sellBalance)
          },
          {
            name:'当前余额',
            value:Number(balance)
          }
        
        ]
      }
    ]
  }
  return option
};
loadData();
console.log(mintedBalance);
console.log(burnedBalance);
console.log(balance);
console.log(buyBalance);
console.log(sellBalance);
  return (
    <PageContainer
      header={{
        title: '个人甲烷消耗',
      }}
    >
    <div>
      <div style={{ width:300,height:400,marginTop:100,marginLeft:100}}>
          <ReactEcharts option={getOption1()}/>   
          
        </div>
    </div>       
    <div>
      <div style={{ width:1500,height:400,marginTop:-400,marginRight:100}}>
           <ReactEcharts option={getOption2()}/>  
        </div>
    </div>
    </PageContainer>

    );
  
};


export default Chart;