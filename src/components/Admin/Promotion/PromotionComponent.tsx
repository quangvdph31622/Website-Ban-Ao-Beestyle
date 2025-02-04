"use client";
import {Flex, Layout, notification, TableColumnsType, Tooltip, Modal, Tag} from "antd";
import {EditTwoTone, DeleteTwoTone, PercentageOutlined, DollarCircleOutlined} from "@ant-design/icons";
import type {IPromotion} from "@/types/IPromotion";
import TablePagination from "@/components/Table/TablePagination";
import {getPromotions, URL_API_PROMOTION} from "@/services/PromotionService";
import useSWR from "swr";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import HeaderPromotion from "@/components/Admin/Promotion/HeaderPromotion";
import {DatePicker, Typography} from "antd";
import {STATUS} from "@/constants/Status";
import {DISCOUNT_TYPE} from "@/constants/DiscountType";
import {useSearchParams} from "next/navigation";
import useAppNotifications from "../../../hooks/useAppNotifications";
import UpdatePromotion from "./UpdatePromotion";
import {deletePromotion} from "../../../services/PromotionService";

import PromotionFilter from "./PromotionFilter";
import {DISCOUNT_STATUS} from "../../../constants/DiscountStastus";
import Link from "next/link";


const {Content} = Layout;
const {Title} = Typography;

const PromotionComponent: React.FC<any> = (props: any) => {

    const [api, contextHolder] = notification.useNotification();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IPromotion | null>(null);
    const [promotions, setPromotions] = useState<any[]>([]);

    const {showNotification} = useAppNotifications();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());


    const {data, error, isLoading, mutate} =
        useSWR(`${URL_API_PROMOTION.get}${params.size !== 0 ? `?${params.toString()}` : ''}`,
            getPromotions,
            {
                revalidateOnFocus: false,
                revalidateOnReconnect: false
            }
        );
    useEffect(() => {
        if (data) {
            console.log("Data received from API:", data);
            setPromotions(data.data.items || []); // Cập nhật vouchers
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            showNotification("error", {
                message: error?.message || "Error fetching promotions",
                description: error?.response?.data?.message || "Có lỗi xảy ra!",
            });

        }
    }, [error]);

    let result: any;
    if (!isLoading && data) {
        result = data?.data;
        console.log(result);
    }
    const handleDeletePromotion = async (id: number) => {
        try {
            const result = await deletePromotion(id);
            if (result.code === 200) {
                showNotification("success", {message: 'Xóa thành công!', description: result.message,});

                mutate(); // Gọi lại dữ liệu sau khi xóa
            } else {
                showNotification("error", {
                    message: 'Xóa không thành công!',
                    description: result.message || 'Không có thông tin thêm.',
                });
            }
        } catch (error) {
            showNotification("error", {
                message: 'Có lỗi xảy ra!',
                description: error.message,
            });
        }
    };

    const onDelete = (record: IPromotion) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa phiếu giảm giá này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                handleDeletePromotion(record.id); // Gọi hàm xóa record
            }
        });
    };
    const columns: TableColumnsType<IPromotion> = [
        {title: 'Tên chương trình', dataIndex: 'promotionName', key: 'promotionName'},

        {
            title: ' Giá trị giảm',
            dataIndex: 'discountValue',
            key: 'discountValue',
            width: 100,
            align: 'center',
            render: (value: number) => `${value}`,
        },
        {
            title: 'Loại giảm',
            dataIndex: 'discountType',
            key: 'discountType',
            width: 100,
            align: 'center',
            render: (value: keyof typeof DISCOUNT_TYPE) => {
                const icons = {
                    PERCENTAGE: <PercentageOutlined style={{ color: '#52c41a',fontSize: '18px' }} />,
                    CASH: <DollarCircleOutlined style={{ color: '#faad14',fontSize: '18px' }} />,
                };

                return (
                    <Tooltip title={DISCOUNT_TYPE[value].description}>
                        {icons[value] || <QuestionOutlined style={{ color: '#ff4d4f',fontSize: '18px' }} />}
                    </Tooltip>
                );
            },
        },

        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        },

        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render(value: keyof typeof DISCOUNT_STATUS, record, index) {
                let color: string;

                if (value === 'UPCOMING') {
                    color = 'blue';
                } else if (value === 'ACTIVE') {
                    color = 'green';
                } else if (value === 'EXPIRED') {
                    color = 'red';
                }

                return (
                    <div style={{ textAlign: 'center' }}>
                        <Tag color={color} key={record.id}>{DISCOUNT_STATUS[value]}</Tag>
                    </div>
                );
            },
        },

        {
            title: 'Hành động',
            align: 'center',
            render: (record: IPromotion) => (
                <>
                    {/*<Tooltip placement="top" title="Chỉnh sửa">*/}
                    {/*    <EditTwoTone*/}
                    {/*        twoToneColor={"#f57800"}*/}
                    {/*        style={{*/}
                    {/*            cursor: "pointer",*/}
                    {/*            padding: "5px",*/}
                    {/*            border: "1px solid #f57800",*/}
                    {/*            borderRadius: "5px",*/}
                    {/*            marginRight: "8px"*/}
                    {/*        }}*/}
                    {/*        onClick={() => {*/}
                    {/*            setIsUpdateModalOpen(true);*/}
                    {/*            setDataUpdate(record);*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Tooltip>*/}
                    <Tooltip placement="top" title="Chỉnh sửa">
                        <Link href ={`/admin/promotion/${record.id}/update`} style={{ textDecoration: 'none' }}>
                            <EditTwoTone
                                twoToneColor={"#f57800"}
                                style={{
                                    cursor: "pointer",
                                    padding: "5px",
                                    border: "1px solid #f57800",
                                    borderRadius: "5px",
                                    marginRight: "8px"
                                }}
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip placement="top" title="Xóa">
                        <DeleteTwoTone
                            twoToneColor={"#ff4d4f"}
                            style={{
                                cursor: "pointer",
                                padding: "5px",
                                border: "1px solid #ff4d4f",
                                borderRadius: "5px"
                            }}
                            onClick={() => onDelete(record)}
                        />
                    </Tooltip>
                </>
            )
        },
    ];
    return (
        <>
            {contextHolder}
            <HeaderPromotion setIsCreateModalOpen={setIsCreateModalOpen}/>
            <Flex align={'flex-start'} justify={'flex-start'} gap={'middle'}>
                <PromotionFilter error={error}/>
                <Content
                    className="min-w-0 bg-white"
                    style={{
                        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.15)',
                        flex: 1,
                        minWidth: 700,
                        borderRadius: '8px 8px 0px 0px',
                    }}
                >
                    <TablePagination
                        loading={isLoading}
                        columns={columns}
                        data={result?.items ? result.items : []}
                        current={result?.pageNo}
                        pageSize={result?.pageSize}
                        total={result?.totalElements}
                    >
                    </TablePagination>
                </Content>
            </Flex>
        </>
    );


};

export default PromotionComponent;