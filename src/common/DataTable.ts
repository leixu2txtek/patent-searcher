class DataTable {

    header: Array<String>;
    data: Array<Array<any>>;

    constructor(header: string[], data: Array<Array<any>>) {

        this.header = header;
        this.data = [];

        data.forEach(items => {

            if (items.length === 0) return;
            this.data.push(items);
        });
    }

    getColumnValueWithKey(key: string): Array<any> {

        const index = this.header.findIndex((x) => x === key);
        if (index === -1) throw new Error('No column with key');

        const result: Array<any> = [];
        this.data.forEach((item: Array<Array<any>>) => {

            result.push(item[index] || null);
        });

        return result;
    }

    getColumnValueWithKeyAndRowIndex(columnKey: string, rowIndex: number): any {

        if (this.data.length <= rowIndex) throw new Error('Row index out of range');
        
        // 获取行数据
        const result = this.data[rowIndex];

        // 根据 key 查找列索引
        const columnIndex = this.header.findIndex((x) => x === columnKey);
        if (columnIndex === -1) throw new Error('No column with key');

        return result[columnIndex];
    }

    updateValueWithColumnKey(columnKey: string, rowIndex: number, value: any): void {

        if (this.data.length <= rowIndex) throw new Error('Row index out of range');

        // 获取行数据
        const result = this.data[rowIndex];

        // 根据 key 查找列索引
        const columnIndex = this.header.findIndex((x) => x === columnKey);
        if (columnIndex === -1) throw new Error('No column with key');

        Object.assign(result, { [columnIndex]: value });
    }
}

export default DataTable;