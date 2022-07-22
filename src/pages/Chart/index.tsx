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
interface DataType {
  sum: number;//纵坐标
  dealTime: string;//横坐标
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

const [sum,setSum] = useState<Array<number>>([]);
const [dealTime,setDealTime] = useState<Array<string>>([]);

const transform = async()=>{
    const sumList: number[]=[];
    const dealTimeList: string[]=[];
    dataSource.forEach((item)=>{
      sumList.push(item.sum);
      dealTimeList.push(item.dealTime);
    });
    setSum(sumList);
    setDealTime(dealTimeList);
  }
const loadData = async()=>{
    const data =  await NNSUiActor.getRecentMonthDeals();
    const elements: DataType[]= [];
    data.forEach((item)=>{
        const trans: DataType = {sum:Number(item.sum),
          dealTime: moment(Number(item.dealTime)/1000000).format("YYYY-MM-DD HH:mm:ss"),
        };
        elements.push(trans);
      });
      setDataSource(elements);
}

const getOption = () => {
  
  const option: charts.EChartsOption = {
    title: {
      text: '交易量表',
      left: 'center'  
    },
    legend:{
      data:['交易量'],
      right:'50'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' }
    },
    xAxis: [
      {
        type: 'category',
        name: '交易时间',
        data: dealTime,
        axisLabel: {
          rotate:15  //旋转角度
        },
        axisLine: {  
          lineStyle: {
           // type: 'dashed'
          }
        },
        axisTick: {
          length: -6
        }
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '交易量',
        axisLine: {
          show:true,
        },
        
      }

    ],
    series: [
      {
        type: 'line',
        name:'交易量',
        data: sum,
        smooth: true,  //柱条宽度
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
    grid:[
      {
        top:50,
        bottom:200,
        height:200
      },
    ],
  };
  return option;
};

//console.log(dataSource);
useEffect(()=>{
    loadData();
    transform();
    
  },[dataSource])
    
  return (
    <PageContainer
      header={{
        title: '交易图表',
      }}
    >
      <div>
        <div style={{ width: 800,height:600,marginLeft:50}}>
            <ReactEcharts option={getOption()}/>
          </div>
      </div>
    </PageContainer>

    );
  
};


export default Chart;