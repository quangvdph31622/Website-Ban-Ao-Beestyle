import { Row, Col } from "antd";
import Image from "next/image";
import { LiaShippingFastSolid } from "react-icons/lia";
import { LuAlarmClock } from "react-icons/lu";
import { CgArrowsExchange } from "react-icons/cg";
import { MdOutlineLocalOffer } from "react-icons/md";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const InfoSection = () => {
    return (
        <>
            <Row gutter={[16, 16]} className="mt-5">
                <Col span={24}>
                    <ul
                        className="list-none space-y-2 text-gray-600 p-0 ms-1"
                        style={{ fontSize: "13px" }}
                    >
                        <li className="d-flex justify-between">
                            <div className="flex-1">
                                <LiaShippingFastSolid size={21} className="mr-2 d-inline" />
                                <b>Miễn phí vận chuyển: </b>
                                <span>Đơn hàng từ 500k</span>
                            </div>

                            <div className="flex-1">
                                <LuAlarmClock size={21} className="mr-2 d-inline" />
                                <b>Giao hàng: </b>
                                Từ 3 - 5 ngày trên cả nước
                            </div>
                        </li>
                        <li className="d-flex justify-between">
                            <div className="flex-1">
                                <MdOutlineLocalOffer size={21} className="mr-2 d-inline" />
                                Sử dụng mã giảm giá 0 bước thanh toán
                            </div>
                            <div className="flex-1">
                                <IoShieldCheckmarkOutline size={21} className="mr-2 d-inline" />
                                Thông tin bảo mật và mã hóa
                            </div>
                        </li>
                    </ul>
                </Col>

                {/* <Col span={24}>
                    <div className="text-sm text-gray-600 mt-3">
                        <b>*</b> Một thiết kế áo sơ mi basic, thanh lịch. Sản phẩm được dệt
                        từ các sợi Nano - polyester siêu mịn, mềm mại, hạn chế nhăn nhau
                        tốt. Đơn giản nhưng không nhàm chán, chiếc áo này sẽ giúp chị em
                        sáng tạo thật nhiều cách mix & match.
                    </div>
                </Col> */}
            </Row>
        </>
    );
};

export default InfoSection;
