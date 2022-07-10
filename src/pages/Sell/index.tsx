import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

interface DataType {
  // buyer: Principal;
  // seller: Principal;
  index: number;
  amount: number;
  delta: number;
  price: number;
  status: number;
  createAt: number;
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
  {
    title: '状态',
    dataIndex: 'status',
    key:'status',
  },
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

const data : DataType[]= await MarketApi.GetSellList();
console.log(data);
    //处理数组
    const elements: any=[];
    data.forEach((item)=>{
      const trans: DataType = {index:Number(item.index),
        amount:Number(item.amount),
        price:Number(item.price),
        status:Number(item.status),
        delta:Number(item.delta),
        createAt:Number(item.createAt),
      };
      elements.push(trans)
    });

const Sell: React.FC<unknown> = () => {
  return (
    <PageContainer
      header={{
        title: '卖方挂单',
      }}
    >
      <Table columns={columns} dataSource={elements} rowKey='index'/>

    </PageContainer>
    
    );
  
};

export default Sell;