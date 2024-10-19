import { Expose, Type } from "class-transformer";

export abstract class PageAble {
    /**
     * 页码， 默认为1
     */
    @Expose({ name: 'pageIndex' })
    @Type(() => Number)
    page: number = 1;

    /**
     * 分页大小
     */
    @Expose({ name: 'pageSize' })
    @Type(() => Number)
    size: number = 10;
}