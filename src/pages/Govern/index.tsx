import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
import Guide from '@/components/Guide';
import styles from './index.less';
import { useModel } from '@umijs/max';
import { trim } from '@/utils/format';
// import { Access, useAccess } from '@umijs/max';
import { Button, Modal, Form, Input} from 'antd';
import { Space, Table, Tag } from 'antd';
import { useState } from 'react';
import CreateForm from './components/CreateForm';
import BurnForm from './components/BurnForm';



const Govern: React.FC<unknown> = () => {
    const [ModalVisible, handleModalVisible] = useState<boolean>(false);
    const [BurnVisible, handleBurnVisible] = useState<boolean>(false);

    const { name } = useModel('global');
  return (
    <PageContainer ghost>
    <div>政府发放甲烷排放限额</div>
                    
    <Button  type="primary"
            onClick={() => handleModalVisible(true)}>发放</Button>
    <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={ModalVisible}
      >
      </CreateForm>
    <div>政府执行甲烷排放记录</div>

      <Button  type="primary"
            onClick={() => handleBurnVisible(true)}>排放</Button>
      <BurnForm
        onCancel={() => handleBurnVisible(false)}
        modalVisible={BurnVisible}
      >
      </BurnForm>
    </PageContainer>
    
    );
  
};

export default Govern;