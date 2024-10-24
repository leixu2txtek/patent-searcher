import { Expose } from "class-transformer";
import { PageAble } from "../common/page-able";
import { PatentCategory, PatentType } from "../entities/patent";

export class PatentQueryDto extends PageAble {

    // 关键字，模糊匹配
    keyword?: string;

    /**
     * 专利名称
     */
    name?: string;

    /**
     * 专利号
     */
    number?: string;

    /**
     * 专利类别
     */
    type?: PatentType;

    /**
     * 指导价格
     */
    @Expose({ name: 'price_range' })
    price?: string;

    /**
     * 专利类型
     */
    category?: PatentCategory;

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