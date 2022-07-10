import { GetAgent } from '@/utils/getAgent';
import { idlFactory as marketIDL } from '@/did/market.did';
import { Principal } from "@dfinity/principal";

interface ListArgs {
    amount: number;
    price: number;
    delta: number;
}

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

    async GetBuyList() {
        return await (await this.getActor()).getBuyList();
    }

    async GetSellList() {
        return await (await this.getActor()).getSellList();
    }

    async listSell(args: ListArgs) {
        return await (await this.getActor()).listSell(args);
    }

    async getSomebodySellList(principal: Principal) {
        return await (await this.getActor()).getSomebodySellList(principal);
    }

}

const MarketApi = new Market();
export default MarketApi