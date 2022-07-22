import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
// import { Access, useAccess } from '@umijs/max';
import { Button, Modal, Form, Input} from 'antd';
import { Space, Table, Tag } from 'antd';
import { useState } from 'react';
import CH4Form from './components/CH4Form';
import BurnForm from './components/BurnForm';
import CreateForm from './components/CreateForm';



const Govern: React.FC<unknown> = () => {
    const [ModalVisible, handleModalVisible] = useState<boolean>(false);
    const [BurnVisible, handleBurnVisible] = useState<boolean>(false);
    const [Visible, handleVisible] = useState<boolean>(false);

  return (
    <PageContainer ghost>
    <div  style={{height:120,fontSize:30,marginTop:30}}>政府发放甲烷排放限额
                    
    <Button  type="primary" size="large" style={{width:120,height:50,fontSize:25,marginLeft:120}}
            onClick={() => handleModalVisible(true)}>发放</Button>
    <CH4Form
        onCancel={() => handleModalVisible(false)}
        modalVisible={ModalVisible}
      >
      </CH4Form>
      </div>
      <line style={{fontSize:30}}>----------------------------</line>
      <div  style={{height:120,fontSize:30,marginTop:30}}>政府执行甲烷排放

      <Button  type="primary" size="large" style={{width:120,height:50,fontSize:25,marginLeft:180}}
            onClick={() => handleBurnVisible(true)}>排放</Button>
      <BurnForm
        onCancel={() => handleBurnVisible(false)}
        modalVisible={BurnVisible}
      >
      </BurnForm>
      </div>
      <line style={{fontSize:30}}>----------------------------</line>
      <div  style={{height:120,fontSize:30,marginTop:30}}>政府发放人民币
      <Button  type="primary" size="large" style={{width:120,height:50,fontSize:25,marginLeft:220}}
            onClick={() => handleVisible(true)}>发放</Button>
      <CreateForm
        onCancel={() => handleVisible(false)}
        modalVisible={Visible}
      >
      </CreateForm>
      </div>
    </PageContainer>
    
    
    );
  
};

export default Govern;