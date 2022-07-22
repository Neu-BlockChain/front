import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import TestApi from '@/api/Test';
const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};

(async () => {
  // NNS Canister Id as an example
  const marketId = 'ngtm2-tyaaa-aaaan-qahpa-cai'
  const ch4Id = 'epr6w-qyaaa-aaaag-qalia-cai'
  const cnyId = 'eiqyc-5aaaa-aaaag-qaliq-cai'
  const whitelist = [ch4Id,cnyId,marketId];


  // Initialise Agent, expects no return value
  await window?.ic?.plug?.requestConnect({
    whitelist,
  });

  // A partial Interface factory
  // for the NNS Canister UI
  // Check the `plug authentication - nns` for more
  const nnsPartialInterfaceFactory = ({ IDL }) => {
    
    
    return IDL.Service({
      'getPrincipal' : IDL.Func([], [IDL.Text], ['query']),
      
    });
  };

  const marketActor = await window.ic.plug.createActor({
    canisterId: marketId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  

  const principalId = await window.ic.plug.agent.getPrincipal();
  console.log(`Plug's user principal Id is ${principalId}`);


})()


export default HomePage;
