import { Expose } from "class-transformer";
import { PageAble } from "../common/page-able";

export class PatentQueryDto extends PageAble {

    /**
     * 专利名称
     */
    name?: string;

    /**
     * 专利号
     */
    number?: string;

    /**
     * 专利类型
     */
    type?: Array<number>;

    /**
     * 指导价格
     */
    @Expose({ name: 'price_range' })
    price?: string;

    getPriceOfMin(): number | undefined {

        if (!this.price)  return undefined;
        if (this.price.indexOf('-') === -1) return undefined;

        const prices = this.price.split('-');
        if (prices.length !== 2) return undefined;

        return Number(prices[0]);
    }

    getPriceOfMax(): number | undefined {

        if (!this.price)  return undefined;
        if (this.price.indexOf('-') === -1) return undefined;

        const prices = this.price.split('-');
        if (prices.length !== 2) return undefined;

        return Number(prices[1]);
    }
}