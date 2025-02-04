"use client"
import {Table, TableColumnsType, TablePaginationConfig, TableProps} from "antd";
import React, {memo} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface ITablePaginationProps {
    columns?: TableColumnsType<any>,
    data?: any[] | [],
    current?: number,
    pageSize?: number,
    total?: number,
    loading?: boolean,
    onRow?: (record: any) => { [key: string]: (event: React.MouseEvent<HTMLElement>) => void },
    rowSelection?: TableProps<any>['rowSelection'];
    onChangePagination?: (pagination: TablePaginationConfig, filters: any, sorter: any, extra: any) => void;
}

const rowSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
};

const TablePagination: React.FC<ITablePaginationProps> = (props) => {
    const tbl: ITablePaginationProps = props;

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter()

    const onChange = (pagination: TablePaginationConfig, filters: any, sorter: any, extra: any) => {
        if (pagination?.current) {
            const params = new URLSearchParams(searchParams);
            params.set("page", `${pagination.current}`);
            params.set("size", `${pagination.pageSize ?? 10}`);
            replace(`${pathname}?${params.toString()}`);
        }
    };

    return (
        <>
            <div>
                <Table
                    rowKey={"id"}
                    size="small"
                    loading={tbl.loading}
                    columns={tbl.columns ? tbl.columns : props.columns}
                    dataSource={tbl.data}
                    onChange={tbl.onChangePagination ? tbl.onChangePagination : onChange}
                    rowSelection={rowSelection}
                    pagination={{
                        current: tbl.current || 1,
                        pageSize: tbl.pageSize || 10,
                        total: tbl.total,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 25, 35, 50],
                        responsive: true,
                        style: {marginRight: 10},
                        showTotal: (total, range) => `${range[0]}-${range[1]} trong số ${total} mục`,
                    }}
                    scroll={{y: 'calc(100vh - 270px)', scrollToFirstRowOnChange: true }}
                />
            </div>
        </>
    );
}

export default memo(TablePagination);