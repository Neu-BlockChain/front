import { Modal, Form ,Input, Upload, Button, message} from 'antd';
import React, { PropsWithChildren } from 'react';
import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';

interface BurnFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}



interface result{
  Ok: number;
  Err: Error;
}


  // NNS Canister Id as an example
  const nnsCanisterId = 'epr6w-qyaaa-aaaag-qalia-cai'
  const whitelist = [nnsCanisterId];

  // Initialise Agent, expects no return value
  await window?.ic?.plug?.requestConnect({
    whitelist,
  });

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
        'burn' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const NNSUiActor = await window.ic.plug.createActor({
    canisterId: nnsCanisterId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });



const BurnForm: React.FC<PropsWithChildren<BurnFormProps>> = (props) => {
  const { modalVisible, onCancel } = props;
  const onFinish = async (values) =>{
    const msg: result = await NNSUiActor.burn(Principal.from(values.principal),Number(values.amount));
    
    props.onCancel();
    if(msg.Ok!=null){
      message.info('排放成功');
    }else{
      console.error(msg.Err);
    }
    
    console.log(msg);
    // const msg = await MarketApi.listSell(arg);
    
  };
  const onFinishFailed = () =>{};



  return (
    <Modal
      title="排放执行"
      width={420}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      destroyOnClose
      // okText="添加"
      // cancelText="取消"
    >
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="principal" name="principal" rules={[{required :true , message:"请输入principal"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="amount" name="amount" rules={[{required :true , message:"请输入amount"}]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' >发放</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BurnForm;


