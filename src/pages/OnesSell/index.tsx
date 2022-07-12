import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { PageContainer,ProTable,ActionType,ProDescriptionsItemProps, } from '@ant-design/pro-components';
import React, { useRef, useState ,useEffect} from 'react';
// import { Access, useAccess } from '@umijs/max';
import { Button, Popconfirm } from 'antd';
import { Space, Table, Tag ,message, Modal, Divider} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';


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
      const CancelArgs = IDL.Record({ 'index' : IDL.Nat });
      const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : Error });
      return IDL.Service({
        'cancelSell' : IDL.Func([CancelArgs], [Result_1], []),
      });
    };
  
    // Create an actor to interact with the NNS Canister
    // we pass the NNS Canister id and the interface factory
    const NNSUiActor = await window.ic.plug.createActor({
      canisterId: nnsCanisterId,
      interfaceFactory: nnsPartialInterfaceFactory,
    });

    interface result{
      ok: number;
      err: Error;
    }
    
    interface cancelArgs {
      index: number;
    }

    interface UpdateArgs{
      index: number;
      newAmount: number;
      newPrice: number;
      newDelta: number;
    }
    
    interface DataType {
      // buyer: Principal;
      // seller: Principal;
      index: number;
      amount: number;
      delta: number;
      price: number;
      // status: number;
      createAt: number;
    }

    const state = {
      // dataSource: [] as DataType[],
      updateData: [] as UpdateArgs[],
    };

    


const OnesSell: React.FC<unknown> = () => {
    const [dataSource,setDataSource] = useState<Array<DataType>>([]);
  
    // 删除挂单
    const handleDelete = async(id)=>{
      
      const arg: cancelArgs = {index: Number(id)};
      const msg : result= await NNSUiActor.cancelSell(arg);
      if(msg.ok!=null){
        message.info("删除成功"+msg.ok);
      }else{
        console.error(msg.err);
      }
        
      loadData();
      
    }
  




const loadData = async()=>{
  const principalId = await window.ic.plug.agent.getPrincipal();
  const data = await MarketApi.getSomebodySellList(principalId);
  const elements: DataType[]= [];
  //处理数组
  data.forEach((item)=>{
    const trans: DataType = {index:Number(item.index),
      amount:Number(item.amount),
      price:Number(item.price),
      // status:Number(item.status),
      delta:Number(item.delta),
      createAt:Number(item.createAt),
    };
    elements.push(trans);
  });
  setDataSource(elements);
}

//获取要修改的数据
const handleUpdate = (values)=>{
  const data :UpdateArgs = {index: Number(values.index),
    newAmount: Number(values.amount),
    newPrice: Number(values.price),
    newDelta: Number(values.delta)}
  state.updateData=[];
  state.updateData.push(data);
  state.updateData.push(data);
  state.updateData.push(data);
  state.updateData.push(data);
  handleUpdateModalVisible(true);
  console.log(data);
  console.log(state.updateData);
}


//展示要编辑的挂单窗口
const showUpdateDialog = (flag: boolean) =>{
  if(flag){
    return(
      <UpdateForm
      onCancel={() => handleUpdateModalVisible(false)}
      modalVisible={updateModalVisible}
      data={state.updateData}
    >
    </UpdateForm>
    )
  }
}

const columns: ProDescriptionsItemProps[] = [
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
  {
    title:'操作',
    valueType: 'option',
    render: (_,record) => (
      <>
        
        <Button onClick={() => (
          handleUpdate(record)
          )}
          >
            修改
        </Button>
        
        <Divider type="vertical" />
        <Popconfirm title='确定要删除该挂单？' okText="确认" cancelText="取消" 
        onConfirm={()=>{handleDelete(record.index)}}
        >
          <Button type='primary'>删除</Button>
        </Popconfirm>
        
      </>
    ),
  },
  

  
];

    loadData();
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    // const actionRef = useRef<ActionType>();
  return (
    
    <PageContainer
      header={{
        title: '卖方挂单',
      }}
    >
      <Table columns={columns} dataSource={dataSource} rowKey='index'/>

      <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            添加挂单
      </Button>
      
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
      </CreateForm>
      {showUpdateDialog(updateModalVisible)}
      

    </PageContainer>
    
    );
  
};

export default OnesSell;