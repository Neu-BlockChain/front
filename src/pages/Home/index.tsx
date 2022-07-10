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
  const nnsCanisterId = 'eiqyc-5aaaa-aaaag-qaliq-cai'
  const whitelist = [nnsCanisterId];

  // Initialise Agent, expects no return value
  await window?.ic?.plug?.requestConnect({
    whitelist,
  });

  // A partial Interface factory
  // for the NNS Canister UI
  // Check the `plug authentication - nns` for more
  const nnsPartialInterfaceFactory = ({ IDL }) => {
    const BlockHeight = IDL.Nat64;
    const Stats = IDL.Record({
      'latest_transaction_block_height' : BlockHeight,
      'seconds_since_last_ledger_sync' : IDL.Nat64,
      'sub_accounts_count' : IDL.Nat64,
      'hardware_wallet_accounts_count' : IDL.Nat64,
      'accounts_count' : IDL.Nat64,
      'earliest_transaction_block_height' : BlockHeight,
      'transactions_count' : IDL.Nat64,
      'block_height_synced_up_to' : IDL.Opt(IDL.Nat64),
      'latest_transaction_timestamp_nanos' : IDL.Nat64,
      'earliest_transaction_timestamp_nanos' : IDL.Nat64,
    });
    
    return IDL.Service({
      'getPrincipal' : IDL.Func([], [IDL.Text], ['query']),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  const NNSUiActor = await window.ic.plug.createActor({
    canisterId: nnsCanisterId,
    interfaceFactory: nnsPartialInterfaceFactory,
  });

  const principalId = await window.ic.plug.agent.getPrincipal();


})()


export default HomePage;
