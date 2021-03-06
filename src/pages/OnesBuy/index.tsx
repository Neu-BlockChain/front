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
    const ch4Id = 'epr6w-qyaaa-aaaag-qalia-cai'
    // const whitelist = [nnsCanisterId];
  
    // // Initialise Agent, expects no return value
    // await window?.ic?.plug?.requestConnect({
    //   whitelist,
    // });
  
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
        'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
      });
    };
  
    // Create an actor to interact with the NNS Canister
    // we pass the NNS Canister id and the interface factory
    const NNSUiActor = await window.ic.plug.createActor({
      canisterId: nnsCanisterId,
      interfaceFactory: nnsPartialInterfaceFactory,
    });
    const ch4Actor = await window.ic.plug.createActor({
      canisterId: ch4Id,
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
  const [msg,setMsg] = useState<string>();


  const loadMsg = async()=>{
    const principalId = await window.ic.plug.agent.getPrincipal();
    const balance = await ch4Actor.balanceOf(principalId);
    if(Number(balance)>10){
      setMsg("????????????????????????????????????"+balance);
    }else{
      setMsg("????????????????????????????????????"+balance);
    }
    
  }
  
    // ????????????
    const handleDelete = async(id)=>{
      
      const arg: cancelArgs = {index: Number(id)};
      const msg : result= await NNSUiActor.cancelBuy(arg);
      if(msg.ok!=null){
        message.info("????????????");
      }else{
        console.error(msg.err);
      }
        
      // loadData();
      
    }
  




const loadData = async()=>{
  const principalId = await window.ic.plug.agent.getPrincipal();
  const data = await NNSUiActor.getSomebodyBuyList(principalId);
  const elements: DataType[]= [];
  //????????????
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

//????????????????????????
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


//??????????????????????????????
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
    title: '??????ID',
    dataIndex: 'index',
    key:'index',
  },
  {
    title: '??????',
    dataIndex: 'amount',
    key:'amount',
  },
  {
    title: '????????????',
    dataIndex: 'delta',
    key:'delta',
  },
  {
    title: '??????',
    dataIndex: 'price',
    key:'price',
  },
  // {
  //   title: '??????',
  //   dataIndex: 'status',
  //   key:'status',
  // },
  {
    title: 'createAt',
    dataIndex: 'createAt',
    key:'createAt',
  },
  {
    title:'??????',
    valueType: 'option',
    render: (_,record) => (
      <>
        
        <Button onClick={() => (
          handleUpdate(record)
          )}
          >
            ??????
        </Button>
        
        <Divider type="vertical" />
        <Popconfirm title='???????????????????????????' okText="??????" cancelText="??????" 
        onConfirm={()=>{handleDelete(record.index)}}
        >
          <Button type='primary' >??????</Button>
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
        title: '????????????',
      }}
    >
      <Alert
      message={"???????????????"+msg}
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
            ????????????
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