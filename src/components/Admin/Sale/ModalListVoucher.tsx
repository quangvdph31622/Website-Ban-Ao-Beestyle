import React, {useState, useEffect, memo, useContext, useRef} from "react";
import {Modal, List, Card, Avatar, Space, Typography, Button, Checkbox, Pagination, Flex} from "antd";
import {findVouchersByTotalAmount} from "@/services/VoucherService";
import {HandleSale} from "@/components/Admin/Sale/SaleComponent";
import {IVoucher} from "@/types/IVoucher";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import {FORMAT_NUMBER_WITH_COMMAS} from "@/constants/AppConstants";
import {DISCOUNT_TYPE} from "@/constants/DiscountType";

const {Text, Title} = Typography;

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleVoucherSelect: (voucherSelected: IVoucher) => void;
}

const ModalListVoucher: React.FC<IProps> = (props) => {
    const {isModalOpen, setIsModalOpen, handleVoucherSelect} = props;
    const handleSale = useContext(HandleSale);

    // drag modal
    const draggleRef = useRef<HTMLDivElement>(null);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
    const [position, setPosition] = useState({x: 0, y: 0});

    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedVouchers = vouchers.slice(startIndex, endIndex);

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const totalAmount = handleSale?.totalAmountCart ?? 0;
            const data = await findVouchersByTotalAmount(totalAmount);

            const sortedData = data.sort((a: any, b: any) => {
                const discountValueA =
                    a.discountType === DISCOUNT_TYPE.CASH.key
                        ? Math.min((a.discountValue * totalAmount) / 100, a.maxDiscount)
                        : Math.min(a.discountValue, a.maxDiscount);
                const discountValueB =
                    b.discountType === DISCOUNT_TYPE.PERCENTAGE.key
                        ? Math.min((b.discountValue * totalAmount) / 100, b.maxDiscount)
                        : Math.min(b.discountValue, b.maxDiscount);
                return discountValueB - discountValueA;
            });

            setVouchers(sortedData);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách voucher:", error);
        } finally {
            setLoading(false);
        }
    };

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    const onStop = (_event: DraggableEvent, uiData: DraggableData) => {
        setPosition({x: uiData.x, y: uiData.y});
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    useEffect(() => {
        if (isModalOpen) {
            fetchVouchers();
        }
    }, [isModalOpen]);

    const handleVoucherSelection = (checked: boolean, voucher: IVoucher) => {
        setSelectedVoucher(checked ? voucher : undefined);
    };

    const handleOk = () => {
        if (selectedVoucher) {
            handleVoucherSelect(selectedVoucher);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPosition({x: 0, y: 0});
        setBounds({left: 0, top: 0, bottom: 0, right: 0});
    }

    return (
        <Modal
            title={
                <div
                    style={{width: '100%', cursor: 'move'}}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}
                >
                    Voucher
                </div>
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCloseModal}
            width={600}
            footer={
                <Flex align="center" justify="space-between">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={vouchers.length}
                        onChange={handlePageChange}
                    />
                    <div>
                        <Button key="cancel" onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button key="ok" type="primary" onClick={handleOk} style={{marginLeft: "10px"}}>
                            Xác nhận
                        </Button>
                    </div>
                </Flex>
            }
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    nodeRef={draggleRef}
                    onStart={(event, uiData) => onStart(event, uiData)}
                    onStop={(event, uiData) => onStop(event, uiData)}
                    position={isModalOpen ? position : {x: 0, y: 0}}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
            style={{
                top: "40px",
            }}
            styles={{
                body: {
                    maxHeight: 520,
                    minHeight: 520,
                    overflowY: "auto",
                }
            }}
        >
            <List
                loading={loading}
                style={{width: "100%"}}
                dataSource={paginatedVouchers}
                renderItem={(item: IVoucher) => (
                    <List.Item style={{borderBottom: "none", padding: "5px 0px"}}>
                        <Card
                            style={{flex: "1", cursor: "pointer"}}
                            styles={{body: {padding: 8}}}
                            onClick={() => handleVoucherSelection(false, item)}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        shape="square"
                                        src="/red-gift-square-box.png"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                        }}
                                    />
                                }
                                title={
                                    <Flex align="center" justify="space-between">
                                        <Flex align="center" justify="space-between">
                                            <div style={{textAlign: "left", marginLeft: "auto"}}>
                                                <Text strong>{item.voucherName}</Text>
                                                <Title level={5} style={{margin: 0}}>
                                                    {item.discountType === DISCOUNT_TYPE.PERCENTAGE.key
                                                        ? `Giảm ${item.discountValue || 0}% tối đa ${
                                                            item.maxDiscount
                                                                ? `${item.maxDiscount}`.replace(FORMAT_NUMBER_WITH_COMMAS, ",")
                                                                : 0}đ`
                                                        : `Giảm ${item.discountValue
                                                            ? `${item.discountValue}`.replace(FORMAT_NUMBER_WITH_COMMAS, ",")
                                                            : 0}đ`}
                                                </Title>
                                            </div>
                                        </Flex>
                                    </Flex>
                                }
                                description={
                                    <Flex align="end" justify="space-between">
                                        <div>
                                           <span>
                                               Cho đơn từ {item.minOrderValue
                                                   ? `${item.minOrderValue}`.replace(FORMAT_NUMBER_WITH_COMMAS, ",")
                                                   : 0}đ
                                            </span> <br />
                                            <span>Hạn sử dụng: {new Date(item.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <Checkbox
                                            checked={selectedVoucher && selectedVoucher.id === item.id}
                                            onChange={(e) => handleVoucherSelection(e.target.checked, item)}
                                        />
                                    </Flex>
                                }
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </Modal>
    );

};

export default memo(ModalListVoucher);
