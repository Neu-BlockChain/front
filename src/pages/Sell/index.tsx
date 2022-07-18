import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import moment from 'moment';
// interface Status{
//   open: number;
//   done: number;
//   cancel: number;
// }

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
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   key:'status',
  // },
  {
    title: 'createAt',
    dataIndex: 'createAt',
    key:'createAt',
  },
  
];

// const data: DataType[] = [
//   {
//     // buyer: 'ss',
//     // seller: 'dd',
//     sellOrderIndex: 123,
//     buyOrderIndex: '345',
//     amount: '3',
//     price: '4',
//     sum: '12',
//     dealTime: '1223',
//   },
// ];


    //处理数组


const Sell: React.FC<unknown> = () => {

  const [dataSource,setDataSource]=useState<Array<DataType>>([]);

  const loadData = async()=>{
    const data : DataType[]= await MarketApi.GetSellList();
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
        title: '卖方挂单',
      }}
    >
      <Table columns={columns} dataSource={dataSource} rowKey='index'/>

    </PageContainer>
    
    );
  
};

export default Sell;