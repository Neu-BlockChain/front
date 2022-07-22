import { Modal, Form ,Input, Upload, Button, message} from 'antd';
import React, { PropsWithChildren } from 'react';
import MarketApi from '@/api/Market';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

interface ListArgs {
  amount: number;
  price: number;
  delta: number;
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
    const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : Error });
    const ListArgs = IDL.Record({
      'price' : IDL.Nat,
      'amount' : IDL.Nat,
      'delta' : IDL.Nat,
    });
    return IDL.Service({
      'listSell' : IDL.Func([ListArgs], [Result_1], []),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const NNSUiActor = await window.ic.plug.createActor({
    canisterId: nnsCanisterId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });



const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, onCancel } = props;
  const onFinish = async (values) =>{
    const arg: ListArgs= {
          amount: Number(values.amount),
          price: Number(values.price),
          delta: Number(values.delta)
        };
    const msg: result = await NNSUiActor.listSell(arg);
    props.onCancel();
    if(msg.ok!=null){
      message.info('添加成功');
    }else{
      message.info('添加失败'+msg.err);
    }
    
    console.log(msg);
    // const msg = await MarketApi.listSell(arg);
    
  };
  const onFinishFailed = () =>{};

  const notify = () => toast("Waiting..");

  interface result{
    ok: number;
    err: Error;
  }

  return (
    <Modal
      title="添加挂单"
      width={420}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
      // okText="添加"
      // cancelText="取消"
    >
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="amount" name="amount" rules={[{required :true , message:"请输入数量"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="price" name="price" rules={[{required :true , message:"请输入价格"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="delta" name="delta" rules={[{required :true , message:"请输入差价"}]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' onClick={notify}>添加</Button>
          <ToastContainer
            position="top-center"
            autoClose={20000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;


