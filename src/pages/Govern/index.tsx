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



const Govern: React.FC<unknown> = () => {
    const [ModalVisible, handleModalVisible] = useState<boolean>(true);

    const { name } = useModel('global');
  return (
    <PageContainer ghost>
    <div className={styles.container}>
        <Guide name={trim(name)} />
    </div>
                    
    <Button className={styles.button} type="primary"
            onClick={() => handleModalVisible(true)}>发放</Button>
    <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={ModalVisible}
      >
      </CreateForm>
    </PageContainer>
    
    );
  
};

export default Govern;