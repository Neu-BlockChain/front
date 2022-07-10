import { GetAgent } from '@/utils/getAgent';
import { idlFactory as marketIDL } from '@/did/cny.did';
import { Principal } from "@dfinity/principal";

class Test {
    canisterId :string= 'eiqyc-5aaaa-aaaag-qaliq-cai';

    async getActor() {
        return await GetAgent.createActor(marketIDL, this.canisterId);
    }

    async getNoIdentityActor() {
        return await GetAgent.noIdentityActor(marketIDL, this.canisterId);
    }

    async getCanisters(): Promise<any> {
        const res = await (await this.getActor()).getCanisters();
        console.log('canisters', res);
        return res;
    }

    async getPrincipal(){
        return await (await this.getActor()).getPrincipal();
    }
    


    

}

const TestApi = new Test();
export default TestApi