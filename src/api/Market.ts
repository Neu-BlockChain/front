import { GetAgent } from '@/utils/getAgent';
import { idlFactory as marketIDL } from '@/did/market.did';


class Market {
    canisterId :string= 'ngtm2-tyaaa-aaaan-qahpa-cai';

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


    async GetDeals() {
        return await (await this.getActor()).getDeals();
    }

}

const MarketApi = new Market();
export default MarketApi