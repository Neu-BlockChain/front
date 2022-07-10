import { Modal, Form ,Input, Upload, Button, message} from 'antd';
import React, { PropsWithChildren } from 'react';

interface UpdateArgs{
    index: number;
    newAmount: number;
    newPrice: number;
    newDelta: number;
  }

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  data : UpdateArgs[];
}

interface UpdateArgs{
    index: number;
    newAmount: number;
    newPrice: number;
    newDelta: number;
  }




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
    const UpdateArgs = IDL.Record({
        'newAmount' : IDL.Nat,
        'index' : IDL.Nat,
        'newPrice' : IDL.Nat,
        'newDelta' : IDL.Nat,
      });
    const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : Error });
    return IDL.Service({
        'updateSell' : IDL.Func([UpdateArgs], [Result], []),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const NNSUiActor = await window.ic.plug.createActor({
    canisterId: nnsCanisterId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });

const UpdateForm: React.FC<PropsWithChildren<UpdateFormProps>> = (props) => {


  const { modalVisible, onCancel , data} = props;
  const index = Number(props.data.pop()?.index);
  const newAmount = Number(props.data.pop()?.newAmount);
  const newPrice = Number(props.data.pop()?.newPrice);
  const newDelta = Number(props.data.pop()?.newDelta);
  console.log(props);


  const onFinish = async (values) =>{
    const arg: UpdateArgs= {
        index: Number(values.index),
        newAmount: Number(values.newAmount),
        newPrice: Number(values.newPrice),
        newDelta: Number(values.newDelta)
      };
    console.log(arg);
  const msg: result = await NNSUiActor.updateSell(arg);
  props.onCancel();
  if(msg.ok!=null){
    message.info('修改成功');
  }else{
    console.error(msg.err);
  }
  
  console.log(msg);
    
  };
  const onFinishFailed = () =>{};

  interface result{
    ok: number;
    err: Error;
  }

  return (
    <Modal
      title="修改挂单"
      width={420}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      // okText="添加"
      // cancelText="取消"
    >
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} >
        <Form.Item label="index" name="index"  initialValue={index} rules={[{required :true , message:"请输入index"}]} >
          <Input />
        </Form.Item>
        <Form.Item label="newAmount" name="newAmount" initialValue={newAmount} rules={[{required :true , message:"请输入数量"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="newPrice" name="newPrice" initialValue={newPrice} rules={[{required :true , message:"请输入价格"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="newDelta" name="newDelta" initialValue={newDelta} rules={[{required :true , message:"请输入差价"}]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' >提交</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
