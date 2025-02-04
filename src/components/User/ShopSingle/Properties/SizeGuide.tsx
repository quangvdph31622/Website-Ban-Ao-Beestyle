import { Modal, Tabs, Table } from "antd";

const SizeGuide = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const { TabPane } = Tabs;

    const columns = [
        {
            title: "Kích thước",
            dataIndex: "size",
            key: "size",
            align: "center",
            className: "font-bold",
        },
        {
            title: "S",
            dataIndex: "s",
            key: "s",
            align: "center",
        },
        {
            title: "M",
            dataIndex: "m",
            key: "m",
            align: "center",
        },
        {
            title: "L",
            dataIndex: "l",
            key: "l",
            align: "center",
        },
        {
            title: "XL",
            dataIndex: "xl",
            key: "xl",
            align: "center",
        },
        {
            title: "2XL",
            dataIndex: "xxl",
            key: "xxl",
            align: "center",
        },
        {
            title: "3XL",
            dataIndex: "xxxl",
            key: "xxxl",
            align: "center",
        },
    ];

    const maleDataSource = [
        {
            key: "1",
            size: "Chiều cao (cm)",
            s: "160-165",
            m: "166-170",
            l: "171-175",
            xl: "176-180",
            xxl: "181-185",
            xxxl: "186-190",
        },
        {
            key: "2",
            size: "Cân nặng (kg)",
            s: "50-60",
            m: "61-70",
            l: "71-80",
            xl: "81-90",
            xxl: "91-100",
            xxxl: "101-110",
        },
        {
            key: "3",
            size: "Rộng vai (cm)",
            s: "41-43",
            m: "44-46",
            l: "47-49",
            xl: "50-52",
            xxl: "53-55",
            xxxl: "56-58",
        },
        {
            key: "4",
            size: "Vòng ngực (cm)",
            s: "82-86",
            m: "87-91",
            l: "92-96",
            xl: "97-101",
            xxl: "102-106",
            xxxl: "107-111",
        },
    ];

    const femaleDataSource = [
        {
            key: "1",
            size: "Chiều cao (cm)",
            s: "150-155",
            m: "156-160",
            l: "161-165",
            xl: "166-170",
            xxl: "171-175",
            xxxl: "176-180",
        },
        {
            key: "2",
            size: "Cân nặng (kg)",
            s: "40-50",
            m: "51-60",
            l: "61-70",
            xl: "71-80",
            xxl: "81-90",
            xxxl: "91-100",
        },
        {
            key: "3",
            size: "Rộng vai (cm)",
            s: "36-38",
            m: "39-41",
            l: "42-44",
            xl: "45-47",
            xxl: "48-50",
            xxxl: "51-53",
        },
        {
            key: "4",
            size: "Vòng ngực (cm)",
            s: "76-80",
            m: "81-85",
            l: "86-90",
            xl: "91-95",
            xxl: "96-100",
            xxxl: "101-105",
        },
    ];

    const unisexDataSource = [
        {
            key: "1",
            size: "Chiều cao (cm)",
            s: "150-160",
            m: "161-170",
            l: "171-180",
            xl: "181-190",
            xxl: "191-200",
            xxxl: "201-210",
        },
        {
            key: "2",
            size: "Cân nặng (kg)",
            s: "45-55",
            m: "56-65",
            l: "66-75",
            xl: "76-85",
            xxl: "86-95",
            xxxl: "96-105",
        },
        {
            key: "3",
            size: "Rộng vai (cm)",
            s: "39-41",
            m: "42-44",
            l: "45-47",
            xl: "48-50",
            xxl: "51-53",
            xxxl: "54-56",
        },
        {
            key: "4",
            size: "Vòng ngực (cm)",
            s: "82-86",
            m: "87-91",
            l: "92-96",
            xl: "97-101",
            xxl: "102-106",
            xxxl: "107-111",
        },
    ];

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            className="size-modal"
            width={900}
        >
            <h2 className="text-lg font-bold mb-4">Bảng kích thước</h2>
            <Tabs defaultActiveKey="1" className="mt-4 text-center">
                <TabPane tab="Nam" key="1">
                    <h3 className="font-semibold mb-4">Áo Nam</h3>
                    <Table
                        dataSource={maleDataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        className="ant-table-custom"
                    />
                </TabPane>
                <TabPane tab="Nữ" key="2">
                    <h3 className="font-semibold mb-4">Áo Nữ</h3>
                    <Table
                        dataSource={femaleDataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        className="ant-table-custom"
                    />
                </TabPane>
                <TabPane tab="Unisex" key="3">
                    <h3 className="font-semibold mb-4">Áo Unisex</h3>
                    <Table
                        dataSource={unisexDataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        className="ant-table-custom"
                    />
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default SizeGuide;
