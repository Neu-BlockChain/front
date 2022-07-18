import { Principal } from '@dfinity/principal';
import { PageContainer,ProTable,ActionType,ProDescriptionsItemProps, } from '@ant-design/pro-components';
import React, { useRef, useState ,useEffect} from 'react';
// import { Access, useAccess } from '@umijs/max';
import { Button, Popconfirm } from 'antd';
import { Space, Table, Tag ,message, Modal, Divider} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import moment from 'moment';
import { Alert } from 'antd';


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
      const OrderStatus = IDL.Variant({
        'done' : IDL.Nat,
        'open' : IDL.Nat,
        'cancel' : IDL.Nat,
      });
      const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : Error });
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
        'cancelBuy' : IDL.Func([CancelArgs], [Result_1], []),
        'getSomebodyBuyList' : IDL.Func(
          [IDL.Principal],
          [IDL.Vec(OrderExt)],
          ['query'],
        ),
        'warning' : IDL.Func([], [IDL.Text], []),
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
      createAt: string;
    }

    const state = {
      // dataSource: [] as DataType[],
      updateData: [] as UpdateArgs[],
    };


const OnesBuy: React.FC<unknown> = () => {
  const [dataSource,setDataSource] = useState<Array<DataType>>([]);
  const [msg,setMsg] = useState();


    const loadMsg = async()=>{
      const m = await NNSUiActor.warning();
      setMsg(m);
    }
  
    // 删除挂单
    const handleDelete = async(id)=>{
      
      const arg: cancelArgs = {index: Number(id)};
      const msg : result= await NNSUiActor.cancelBuy(arg);
      if(msg.ok!=null){
        message.info("删除成功");
      }else{
        console.error(msg.err);
      }
        
      // loadData();
      
    }
  




const loadData = async()=>{
  const principalId = await window.ic.plug.agent.getPrincipal();
  const data = await NNSUiActor.getSomebodyBuyList(principalId);
  const elements: DataType[]= [];
  //处理数组
  data.forEach((item)=>{
    const trans: DataType = {index:Number(item.index),
      amount:Number(item.amount),
      price:Number(item.price),
      delta:Number(item.delta),
      createAt: (moment(Number(item.createAt)/1000000).format("YYYY-MM-DD HH:mm:ss")),
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

useEffect(()=>{
  loadData();
  loadMsg();
},[dataSource])

  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log(e, 'I was closed.');
  };
  
    
    
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    // const actionRef = useRef<ActionType>();
  return (
  
    <PageContainer
      header={{
        title: '买方挂单',
      }}
    >
      <Alert
      message={"余额预警："+msg}
      type="warning"
      closable
      onClose={onClose}
      />
      <Table columns={columns} dataSource={dataSource} rowKey='index'/ >

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
  


export default OnesBuy;