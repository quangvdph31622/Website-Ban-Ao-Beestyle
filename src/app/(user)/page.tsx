import { Metadata } from "next";
import React, { Suspense } from "react";
import UserLoader from "@/components/Loader/UserLoader";
import Slider from "@/components/User/Home/Slider/UserSlider";
import { Content } from "antd/es/layout/layout";
import ProductArea from "@/components/User/Home/Products/ProductArea";
import MediumBanner from "@/components/User/Home/Slider/MidiumBanner";
import MostPopularProduct from "@/components/User/Home/Products/MostPopularProduct";
import ShopHome from "@/components/User/Home/Products/ShopHome";
import CowndownArea from "@/components/User/Home/Slider/CownDown";
import ShopBlog from "@/components/User/Home/Products/ShopBlog";
import ShopServices from "@/components/Footer/ShopServices";

export const metadata: Metadata = {
    title: "Trang chủ",
    description: "home",
    icons: {
        icon: '/b_icon.png'
    }
};

export default function HomeUser() {
    return (
        <>
            <Suspense fallback={<UserLoader />}>
                <Slider />
                <Content>
                    <ProductArea />
                    <MediumBanner />
                    <MostPopularProduct />
                    <ShopHome />
                    <CowndownArea />
                    <ShopBlog />
                </Content>
                <ShopServices />
            </Suspense>
        </>
    );
}
