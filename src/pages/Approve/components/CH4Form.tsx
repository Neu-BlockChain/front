import { Modal, Form ,Input, Upload, Button, message} from 'antd';
import React, { PropsWithChildren } from 'react';
import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}



interface result{
  Ok: number;
  Err: Error;
}


  // NNS Canister Id as an example
  const nnsCanisterId = 'epr6w-qyaaa-aaaag-qalia-cai'
  // const whitelist = [nnsCanisterId];

  // // Initialise Agent, expects no return value
  // await window?.ic?.plug?.requestConnect({
  //   whitelist,
  // });

  // A partial Interface factory
  // for the NNS Canister UI
  // Check the `plug authentication - nns` for more
  const nnsPartialInterfaceFactory = ({ IDL }) => {
    const TxReceipt = IDL.Variant({
      'Ok' : IDL.Nat,
      'Err' : IDL.Variant({
        'InsufficientAllowance' : IDL.Null,
        'InsufficientBalance' : IDL.Null,
        'ErrorOperationStyle' : IDL.Null,
        'Unauthorized' : IDL.Null,
        'LedgerTrap' : IDL.Null,
        'ErrorTo' : IDL.Null,
        'Other' : IDL.Text,
        'BlockUsed' : IDL.Null,
        'AmountTooSmall' : IDL.Null,
      }),
    });
    return IDL.Service({
        'approve' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const NNSUiActor = await window.ic.plug.createActor({
    canisterId: nnsCanisterId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });



const CH4Form: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {

  const marketId = 'ngtm2-tyaaa-aaaan-qahpa-cai';
  const { modalVisible, onCancel } = props;
  const onFinish = async (values) =>{
    const msg: result = await NNSUiActor.approve(Principal.from(marketId),Number(values.amount));
    
    props.onCancel();
    if(msg.Ok!=null){
      message.info('授权成功');
    }else{
      message.info('授权失败'+msg.Err);
    }
    
    console.log(msg);
    
  };
  const onFinishFailed = () =>{};

  const notify = () => toast("Waiting..");


  return (
    <Modal
      title="甲烷授权"
      width={420}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
      // okText="添加"
      // cancelText="取消"
    >
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="amount" name="amount" rules={[{required :true , message:"请输入amount"}]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' onClick={notify}>发放</Button>
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

export default CH4Form;


