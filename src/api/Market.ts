import { GetAgent } from '@/utils/getAgent';
import { idlFactory as marketIDL } from '../';


class Market {
    canisterId = 'ngtm2-tyaaa-aaaan-qahpa-cai';

    async getActor() {
        return await GetAgent.createActor(marketIDL, this.canisterId);
    }

    async getCanisters() {
        const res = await (await this.getActor()).getCanisters();
        console.log('canisters', res);
        return res;
    }


    async GetDeals() {
        return await (await this.getActor()).getDeals();
    }

}

const MarketApi = new Market();
console.log(MarketApi);
export default MarketApi