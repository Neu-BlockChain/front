import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

interface DataType {
  buyer: string;
  seller: string;
  sellOrderIndex: string;
  buyOrderIndex: string;
  amount: string;
  price: string;
  sum: string;
  dealTime: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '买方',
    dataIndex: 'buyer',
  },
  {
    title: '卖方',
    dataIndex: 'seller',
  },
  {
    title: '买方订单ID',
    dataIndex: 'buyOrderIndex',
  },
  {
    title: '卖方订单ID',
    dataIndex: 'sellOrderIndex',
  },
  {
    title: '数量',
    dataIndex: 'amount',
  },
  {
    title: '单价',
    dataIndex: 'price',
  },
  {
    title: '总价',
    dataIndex: 'sum',
  },
  {
    title: '成交时间',
    dataIndex: 'dealTime',
  },
  
];

// const data: DataType[] = [
//   {
//     buyer: 'ss',
//     seller: 'dd',
//     sellOrderIndex: '123',
//     buyOrderIndex: '345',
//     amount: '3',
//     price: '4',
//     sum: '12',
//     dealTime: '1223',
//   },
// ];
console.log(11111);
const data : any= await MarketApi.GetDeals();
console.log(11111);
console.log(data);

const App: React.FC<unknown> = () => {
  return (
    <PageContainer
      header={{
        title: '交易记录 示例',
      }}
    >
      <Table columns={columns} dataSource={data} />

    </PageContainer>
    
    );
  
};

export default App;
