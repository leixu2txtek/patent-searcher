import { Expose } from "class-transformer";

export abstract class PageAble {
    /**
     * 页码， 默认为1
     */
    @Expose({ name: 'pageIndex' })
    page: number = 1;

    /**
     * 分页大小
     */
    @Expose({ name: 'pageSize' })
    size: number = 10;
}