import { Breadcrumb, Flex, GetProps, Input, Space, Typography } from "antd";
import Search from "antd/es/input/Search";
import ColorButton from "@/components/Button/ColorButton";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { memo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { param } from "ts-interface-checker";
import { URL_API_MATERIAL } from "@/services/MaterialService";

type SearchProps = GetProps<typeof Input.Search>;
const { Title } = Typography;

interface IProps {
  setIsCreateModalOpen: (value: boolean) => void;
}

const HeaderCustomer = (props: IProps) => {
  // console.log("HeaderCustomer render");
  const { setIsCreateModalOpen } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    if (info?.source === "input" && value) {
      params.set("keyword", value);
      params.set("page", "1");
      replace(`${pathname}?${params.toString()}`);
    } else {
      params.delete("keyword");
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { href: "/admin", title: <HomeOutlined /> },
          { title: "Nhân viên" },
        ]}
      />
      <Flex align={"flex-start"} justify={"flex-start"} gap={"small"}>
        <Title
          level={3}
          style={{ margin: "0px 0px 20px 10px", minWidth: 256, flexGrow: 1 }}
        >
          Nhân viên
        </Title>
        <div className="w-full">
          <Flex justify={"space-between"} align={"center"}>
            <div className="flex-grow max-w-96">
              <Search
                placeholder="Nhập tên, số điện thoại hoặc email nhân viên"
                allowClear
                onSearch={onSearch}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <Space>
                <ColorButton
                  bgColor="#00b96b"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Thêm nhân viên
                </ColorButton>
                {/*<Dropdown menu={{items}} trigger={['click']}>*/}
                {/*    <ColorButton*/}
                {/*        bgColor="#00b96b"*/}
                {/*        type="primary"*/}
                {/*        icon={<MenuOutlined/>}*/}
                {/*    >*/}
                {/*        <CaretDownOutlined/>*/}
                {/*    </ColorButton>*/}
                {/*</Dropdown>*/}
              </Space>
            </div>
          </Flex>
        </div>
      </Flex>
    </>
  );
};

export default memo(HeaderCustomer);
