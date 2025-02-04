import React, {CSSProperties, memo} from "react";
import NormalSaleTab from "@/components/Admin/Sale/TypeSale/NormalSale";


interface IProps {

}

const tabBarStyle: CSSProperties = {};

const ContentTabPanelSale: React.FC<IProps> = (props) => {
    const {} = props;

    // const itemsTabSale = [
    //     {
    //         key: "ban-thuong",
    //         label: (
    //             <span style={{margin: '0px 20px'}}>
    //             <ClockCircleOutlined style={{marginInlineEnd: 10}}/>
    //             Bán thường
    //         </span>
    //         ),
    //         children: (<NormalSaleTab/>)
    //
    //     },
    //     {
    //         key: "ban-giao-hang",
    //         label: (
    //             <span style={{margin: '0px 20px'}}>
    //             <PhoneOutlined style={{marginInlineEnd: 10}}/>
    //             Bán giao hàng
    //         </span>
    //         ),
    //         children: (
    //             <DeliverySaleTab/>
    //         ),
    //     }
    // ];

    return (
        <>
            <NormalSaleTab/>
        </>
    );
}
export default memo(ContentTabPanelSale);