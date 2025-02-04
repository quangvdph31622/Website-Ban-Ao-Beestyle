"use client"
import React, {memo, useEffect, useMemo, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {
    Checkbox, Col, Collapse, Input, Radio, RadioChangeEvent, Row, Space, Tree, TreeDataNode, TreeProps, Typography
} from "antd";
import type {GetProp} from 'antd';
import {GENDER_PRODUCT} from "@/constants/GenderProduct";
import styles from "./css/product.module.css";
import useCategory from "@/components/Admin/Category/hooks/useCategory";
import useBrand from "@/components/Admin/Brand/hooks/useBrand";
import StatusFilter from "@/components/Filter/StatusFilter";
import useMaterial from "@/components/Admin/Material/hooks/useMaterial";
import {DownOutlined} from "@ant-design/icons";

const {Title} = Typography;
const {Search} = Input;

let dataList: { key: React.Key; title: string }[] = [];

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey!;
};

interface IProps {
    error?: Error;
}

const ProductFilter: React.FC<IProps> = (props) => {
    const {error} = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const params = new URLSearchParams(searchParams);

    const {dataTreeSelectCategory, error: errorDataTreeSelectCategory, isLoading: isLoadingDataTreeSelectCategory}
        = useCategory(error ? false : true);
    const {dataOptionBrand, error: errorDataOptionBrand, isLoading: isLoadingDataOptionBrand}
        = useBrand(error ? false : true);
    const {dataOptionMaterial, error: errorDataOptionMaterial, isLoading: isLoadingDataOptionMaterial}
        = useMaterial(error ? false : true);

    const [isErrorNetWork, setErrorNetWork] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const generateList = (data: TreeDataNode[]) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const {key, title} = node;
            dataList.push({key, title: (title as string)?.toLowerCase()});
            if (node.children) {
                generateList(node.children);
            }
        }
    };

    useEffect(() => {
        dataList = [];
        if (!errorDataTreeSelectCategory) {
            generateList(dataTreeSelectCategory);
        }
    }, [dataTreeSelectCategory]);

    useEffect(() => {
        if (error) setErrorNetWork(true);
        else setErrorNetWork(false);
    }, [error]);

    const onChangeGenderProductFilter = (e: RadioChangeEvent) => {
        const value = e.target.value;
        if (value) {
            params.set("gender", value);
            params.set("page", "1");
        } else {
            params.delete("gender");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onChangeBrandFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        if (checkedValues.length > 0 && checkedValues.length < dataOptionBrand.length) {
            params.set("brand", checkedValues.toString());
            params.set("page", "1");
        } else {
            params.delete("brand");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onChangeMaterialFilter: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        if (checkedValues.length > 0 && checkedValues.length < dataOptionMaterial.length) {
            params.set("material", checkedValues.toString());
            params.set("page", "1");
        } else {
            params.delete("material");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onChangeStatusFilter = (e: RadioChangeEvent) => {
        const value = e.target.value;
        if (value) {
            params.set("status", value);
            params.set("page", "1");
        } else {
            params.delete("status");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onSelectCategory: TreeProps['onSelect'] = (selectedKeysValue, info) => {
        if (selectedKeysValue.length > 0) {
            params.set("category", selectedKeysValue.toString());
            params.set("page", "1");
        } else {
            params.delete("category");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const onExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };

    const onChangeSearchCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        const newExpandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value.toLowerCase()) > -1) {
                    return getParentKey(item.key, dataTreeSelectCategory);
                }
                return null;
            })
            .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
        console.log(newExpandedKeys);
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    const treeData = useMemo(() => {
        const loop = (data: TreeDataNode[]): TreeDataNode[] =>
            data.map((item) => {
                const strTitle = item.title as string;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span key={item.key}>
                            {beforeStr}
                            <span className={styles.siteTreeSearchValue}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span key={item.key}>{strTitle}</span>
                    );

                if (item.children) {
                    return {title, key: item.key, children: loop(item.children)};
                }

                return {title, key: item.key,};
            });

        return loop(dataTreeSelectCategory);
    }, [dataTreeSelectCategory, searchValue]);

    return (
        <Space direction="vertical" style={{minWidth: 256}}>
            <Collapse size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256,}}
                items={[
                    {
                        key: 'category',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Danh mục</Title>,
                        children: (
                            <div>
                                <Search style={{marginBottom: 10}} placeholder="Search"
                                        onChange={onChangeSearchCategory}
                                        disabled={isErrorNetWork || errorDataTreeSelectCategory} enterButton={false}
                                />
                                <Tree
                                    blockNode
                                    switcherIcon={<DownOutlined />}
                                    disabled={isErrorNetWork || errorDataTreeSelectCategory}
                                    onExpand={onExpand}
                                    onSelect={onSelectCategory}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    treeData={treeData}
                                    height={400}
                                    style={{maxWidth: '100%'}}
                                />
                            </div>
                        ),
                    },
                ]}
            />

            <Collapse size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256}}
                items={[
                    {
                        key: 'gender-product',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Giới tính</Title>,
                        children: (
                            <Radio.Group onChange={onChangeGenderProductFilter} disabled={isErrorNetWork}>
                                <Row>
                                    <Col key={"ALL"} span={24} style={{marginBottom: 10}}>
                                        <Radio value={undefined} style={{marginLeft: 10}}>Tất cả</Radio>
                                    </Col>
                                    {Object.keys(GENDER_PRODUCT).map((key) => (
                                        <Col key={key} span={24} style={{marginBottom: 10}}>
                                            <Radio value={key} style={{marginLeft: 10}}>
                                                {GENDER_PRODUCT[key as keyof typeof GENDER_PRODUCT]}
                                            </Radio>
                                        </Col>
                                    ))}
                                </Row>
                            </Radio.Group>
                        ),
                    },
                ]}
            />

            <Collapse size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256,}}
                items={[
                    {
                        key: 'brand',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Thương hiệu</Title>,
                        children: (
                            <div style={{maxHeight: 400, overflow: "auto"}}>
                                <Checkbox.Group onChange={onChangeBrandFilter}
                                                disabled={isErrorNetWork || errorDataOptionBrand}
                                >
                                    <Row>
                                        {dataOptionBrand.map((item: any) => (
                                            <Col key={item.key} span={24} style={{marginBottom: 10}}>
                                                <Checkbox value={item.value} style={{marginLeft: 10}}>
                                                    {item.label}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        ),
                    },
                ]}
            />

            <Collapse size="small" className="w-full bg-white" ghost expandIconPosition="end" collapsible="icon"
                style={{borderRadius: 8, boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)', maxWidth: 256}}
                items={[
                    {
                        key: 'material',
                        label: <Title level={5} style={{margin: '0px 10px'}}>Chất liệu</Title>,
                        children: (
                            <div style={{maxHeight: 400, overflow: "auto"}}>
                                <Checkbox.Group onChange={onChangeMaterialFilter}
                                                disabled={isErrorNetWork || errorDataOptionMaterial}
                                >
                                    <Row>
                                        {dataOptionMaterial.map((item) => (
                                            <Col key={item.key} span={24} style={{marginBottom: 10}}>
                                                <Checkbox value={item.value} style={{marginLeft: 10}}>
                                                    {item.label}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        ),
                    },
                ]}
            />

            <StatusFilter
                onChange={onChangeStatusFilter}
                disabled={isErrorNetWork}
            />
        </Space>
    );
}
export default memo(ProductFilter);