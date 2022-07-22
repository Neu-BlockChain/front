import { Principal } from '@dfinity/principal';
import { Modal, Form ,Input, Upload, Button, message} from 'antd';
import React, { PropsWithChildren } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

interface ListArgs {
  name: string;
  desc: string;
  webLink: string;
  principal: Principal;
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
    const Company = IDL.Record({
      'principal' : IDL.Principal,
      'desc' : IDL.Text,
      'name' : IDL.Text,
      'webLink' : IDL.Text,
    });
    return IDL.Service({
      'addCompany' : IDL.Func([Company], [IDL.Bool], []),
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
    const principalId = await window.ic.plug.agent.getPrincipal();
    const arg: ListArgs= {
          name: String(values.name),
          desc: String(values.desc),
          webLink: String(values.webLink),
          principal: principalId,
    };
    
    const msg = await NNSUiActor.addCompany(arg);
    props.onCancel();
    if(msg){
      message.info('注册成功');
    }else{
      message.info('注册失败'+msg.err);
    }
    console.log(msg);
    
    // const msg = await MarketApi.listSell(arg);
    
  };

  const onFinishFailed = () =>{};

  interface result{
    ok: number;
    err: Error;
  }

  const notify = () => toast("Waiting..");

  return (
    <Modal
      title="公司注册"
      width={420}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
      // okText="添加"
      // cancelText="取消"
    >
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="name" name="name" rules={[{required :true , message:"请输入公司名称"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="desc" name="desc" rules={[{required :true , message:"请输入公司描述"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="webLink" name="webLink" rules={[{required :true , message:"请输入公司链接"}]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' onClick={notify}>注册</Button>
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
        {/* <Form.Item>
          <Button onClick={notify}>测试</Button>
          <ToastContainer
              position="top-center"
              autoClose={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
          />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default CreateForm;


