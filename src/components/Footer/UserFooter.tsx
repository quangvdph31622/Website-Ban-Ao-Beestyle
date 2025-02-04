/* eslint-disable @next/next/no-img-element */
import React, { memo, useState } from "react";
import Link from "next/link";
import { IoHomeOutline, IoMailUnreadOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { FaPhone } from "react-icons/fa6";
import { getAccountInfo } from "@/utils/AppUtil";
import SizeGuide from "../User/ShopSingle/Properties/SizeGuide";

function UserFooter() {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <div className="footer">
                <div className="footer-top pt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-6 col-12">
                                <div className="single-footer about">
                                    <div className="logo">
                                        <Link className="link-no-decoration" href="/">
                                            <img
                                                src="/logo2.png"
                                                alt="BeeStyle"
                                                width={150}
                                                height="auto"
                                            />
                                        </Link>
                                    </div>
                                    <p className="text">
                                        Chúng tôi luôn cập nhật xu hướng, chú trọng chất liệu cao cấp và thiết kế tỉ mỉ,
                                        mang tới cho quý khách hàng những chiếc áo thời thượng, giúp quý khách hàng khẳng định phong cách riêng.
                                    </p>
                                    <p className="call">
                                        <span className="mt-3">
                                            <Link className="flex items-center no-underline hover:underline" href="tel:0352258379">
                                                <FaPhone className="me-2" /> 0352 258 379
                                            </Link>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 col-12">
                                <div className="single-footer links">
                                    <h4>Liên hệ</h4>
                                    <ul className="p-0">
                                        <li><Link className="link-no-decoration" href="/">Giới thiệu</Link></li>
                                        <li><Link className="link-no-decoration" href="/news">Tin thời trang</Link></li>
                                        <li><Link className="link-no-decoration" href="/contact">Trợ giúp</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 col-12">
                                <div className="single-footer links">
                                    <h4>Dịch vụ khách hàng</h4>
                                    <ul className="p-0">
                                        <li>
                                            <Link
                                                className="link-no-decoration"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setVisible(true);
                                                }}
                                            >
                                                Hướng dẫn chọn size
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="link-no-decoration" href={getAccountInfo() ? "/" : "/account"}>
                                                Đăng ký tài khoản
                                            </Link>
                                        </li>
                                        <li><Link className="link-no-decoration" href="/">Chính sách giao hàng</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <div className="single-footer social">
                                    <h4>Thông tin</h4>
                                    <div className="contact">
                                        <ul className="p-0">
                                            <li className="!flex !items-center mb-3">
                                                <IoHomeOutline size={21} className="mr-2" />
                                                Công ty CP Thời Trang BeeStyle
                                            </li>
                                            <li className="!flex !items-center mb-3">
                                                <FiMapPin size={21} className="mr-2" />
                                                Phương Canh, Nam Từ Liêm, Hà Nội
                                            </li>
                                            <li className="!flex !items-center">
                                                <IoMailUnreadOutline size={21} className="mr-2" />
                                                support@beestyle.com
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <div className="container">
                        <div className="inner">
                            <div className="row">
                                <div className="col-lg-6 col-12">
                                    <div className="left">
                                        <p>@ Nhóm SD-60 SUCCESS</p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                    <div className="right d-flex">
                                        <img
                                            src="https://yody.vn/images/identity-badge/bct_v1.png"
                                            alt="#"
                                            width={105}
                                            height="auto"
                                            className="mr-5"
                                        />
                                        <img
                                            src="https://yody.vn/images/identity-badge/dmca_v1.png"
                                            alt="#"
                                            width={80}
                                            height="auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {visible && (
                <SizeGuide visible={visible} onClose={() => setVisible(false)} />
            )}
        </>
    )
}

export default memo(UserFooter);
