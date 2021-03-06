import { Principal } from '@dfinity/principal';
import { PageContainer } from '@ant-design/pro-components';
// import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useState } from 'react';
import CH4Form from './components/CH4Form';
import CNYForm from './components/CNYForm';


interface DataType {
  name: string;
  amount: number;
  approve: number;
}

  // NNS Canister Id as an example
  const ch4Id = 'epr6w-qyaaa-aaaag-qalia-cai'
  const cnyId = 'eiqyc-5aaaa-aaaag-qaliq-cai'
  // const whitelist = [ch4Id,cnyId];

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
        'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
        'allowance' : IDL.Func(
            [IDL.Principal, IDL.Principal],
            [IDL.Nat],
            ['query'],
          ),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const ch4Actor = await window.ic.plug.createActor({
    canisterId: ch4Id,
    interfaceFactory: nnsPartialInterfaceFactory,
  });

  const cnyActor = await window.ic.plug.createActor({
    canisterId: cnyId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });





const Approve: React.FC<unknown> = () => {
    
    const columnsCH4: ColumnsType<DataType> = [
        {
          title: '????????????',
          dataIndex: 'name',
          key:'name',
        },
        {
          title: '??????',
          dataIndex: 'amount',
          key:'amount',
        },
        {
          title: '????????????',
          dataIndex: 'approve',
          key:'approve',
        },
        {
          title:'??????',
          render: () => (
            <>
              
              <Button onClick={() => (
                  handleCH4Visible(true)
              )}
                >
                  ??????
              </Button>
              
              
            </>
          ),
        }
      ];
      
      const columnsCNY: ColumnsType<DataType> = [
          {
            title: '????????????',
            dataIndex: 'name',
            key:'namec',
          },
          {
            title: '??????',
            dataIndex: 'amount',
            key:'amountc',
          },
          {
            title: '????????????',
            dataIndex: 'approve',
            key:'approvec',
          },
          {
            title:'??????',
            render: () => (
              <>
                
                <Button onClick={() => (
                    handleCNYVisible(true)
                )}
                  >
                    ??????
                </Button>
                
                
              </>
            ),
          }
        ];

  const [ch4Visible, handleCH4Visible] = useState<boolean>(false);
  const [cnyVisible, handleCNYVisible] = useState<boolean>(false);

  const [ch4Source,setCH4Source]=useState<Array<DataType>>([]);
  const [cnySource,setCNYSource]=useState<Array<DataType>>([]);
  const marketId = 'ngtm2-tyaaa-aaaan-qahpa-cai'
  
  
  const loadDataCH4 = async()=>{
    
    const principalId = await window.ic.plug.agent.getPrincipal();
    const m = await ch4Actor.balanceOf(principalId)
    const a = await ch4Actor.allowance(principalId,Principal.from(marketId));
    const elements: DataType[]= [];
    const data: DataType = {
        name: '??????',
        amount: Number(m),
        approve: Number(a),
    }
    elements.push(data);
    setCH4Source(elements);
  }

  const loadDataCNY = async()=>{
    
    const principalId = await window.ic.plug.agent.getPrincipal();
    const m = await cnyActor.balanceOf(principalId)
    const a = await cnyActor.allowance(principalId,Principal.from(marketId));
    const elements: DataType[]= [];
    const data: DataType = {
        name: '?????????',
        amount: Number(m),
        approve: Number(a),
    }
    elements.push(data);
    setCNYSource(elements);
  }

  loadDataCH4();
  loadDataCNY();


  return (
    <PageContainer
      header={{
        title: '????????????',
      }}
    >
      <Table columns={columnsCH4} dataSource={ch4Source} rowKey='name'/>
      <Table columns={columnsCNY} dataSource={cnySource} rowKey='namec'/>

      <CH4Form
        onCancel={() => handleCH4Visible(false)}
        modalVisible={ch4Visible}
      >
      </CH4Form>
      <CNYForm
        onCancel={() => handleCNYVisible(false)}
        modalVisible={cnyVisible}
      >
      </CNYForm>

    </PageContainer>
    

    
    
    );
  
};

export default Approve;