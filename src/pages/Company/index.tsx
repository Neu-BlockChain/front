import MarketApi from '@/api/Market';
import { Principal } from '@dfinity/principal';
import { PageContainer,ProTable,ActionType,ProDescriptionsItemProps, } from '@ant-design/pro-components';
import React, { useRef, useState ,useEffect} from 'react';
// import { Access, useAccess } from '@umijs/max';
import { Button, Popconfirm } from 'antd';
import { Space, Table, Tag ,message, Modal, Divider} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import CreateForm from './components/CreateForm';
import moment from 'moment';
import { Alert } from 'antd';

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
      const Result_2 = IDL.Variant({ 'ok' : Company, 'err' : IDL.Null });
      return IDL.Service({
        
        'getCompanyInfo' : IDL.Func([IDL.Principal], [Result_2], ['query']),
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
    

    interface DataType {
      name: string;
      principal: string;
      webLink: string;
      desc: string;

    }



    


const Company: React.FC<unknown> = () => {
    const [dataSource,setDataSource] = useState<Array<DataType>>([]);

  




const loadData = async()=>{
  const principalId = await window.ic.plug.agent.getPrincipal();
  const data = await NNSUiActor.getCompanyInfo(principalId);
  const elements: DataType[]= [];
  //处理数组

    const trans: DataType = {name: String(data.ok.name),
      principal: `${principalId}`,
      desc: String(data.ok.desc),
      webLink: String(data.ok.webLink),

    };
    elements.push(trans);

  setDataSource(elements);

}






const columns: ProDescriptionsItemProps[] = [
  {
    title: '公司名称',
    dataIndex: 'name',
    key:'name',
  },
  {
    title: '公司描述',
    dataIndex: 'desc',
    key:'desc',
  },
  {
    title: '公司principal',
    dataIndex: 'principal',
    key:'principal',
  },
  {
    title: '公司链接',
    dataIndex: 'webLink',
    key:'webLink',
  },
  
];



useEffect(()=>{
  loadData();
},[dataSource])

  

    
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  return (
    
    <PageContainer
      header={{
        title: '公司信息',
      }}
    >
      <Table columns={columns} dataSource={dataSource} rowKey='name'/>

      <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            注册
      </Button>
      
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
      </CreateForm>
      

    </PageContainer>
    
    );
  
};

export default Company;