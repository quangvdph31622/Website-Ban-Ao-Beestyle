import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function MediumBanner() {
    return (
        <section className="midium-banner">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="single-banner">
                            <Image
                                src="https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/categories/menu_man.webp"
                                alt="IMG"
                                width={600} height={370}
                                unoptimized
                            />
                            <div className="content">
                                <p>Thời trang nam</p>
                                <h3>Giảm giá<br />Lên đến<span> 50%</span></h3>
                                <Link href={"/product"} className="link-no-decoration">Mua ngay</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="single-banner">
                            <Image
                                src="https://yody.vn/images/menu-desktop/menu_woman.png"
                                alt="#" width={600} height={370}
                                unoptimized
                            />
                            <div className="content">
                                <p>Thời trang nữ</p>
                                <h3>Giảm giá <br /> lên đến <span>70%</span></h3>
                                <Link href={"/product"} className="btn">Mua ngay</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
