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
  sellOrderIndex: any;
  buyOrderIndex: string;
  amount: string;
  price: string;
  sum: string;
  dealTime: string;
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
    title: '买方订单ID',
    dataIndex: 'buyOrderIndex',
    key:'buyOrderIndex',
  },
  {
    title: '卖方订单ID',
    dataIndex: 'sellOrderIndex',
    key:'sellOrderIndex',
  },
  {
    title: '数量',
    dataIndex: 'amount',
    key:'amount',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key:'price',
  },
  {
    title: '总价',
    dataIndex: 'sum',
    key:'sum',
  },
  {
    title: '成交时间',
    dataIndex: 'dealTime',
    key:'dealTime',
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
console.log(11111);
const data : DataType[]= await MarketApi.GetDeals();
console.log(data);

const Record: React.FC<unknown> = () => {
  return (
    <PageContainer
      header={{
        title: '交易记录 示例',
      }}
    >
      <Table columns={columns} dataSource={data} rowKey='buyOrderIndex'/>

    </PageContainer>
    
    );
  
};

export default Record;
