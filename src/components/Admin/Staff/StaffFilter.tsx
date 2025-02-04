import {
  Checkbox,
  Col,
  Collapse,
  GetProp,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Typography,
} from "antd";
import { STATUS } from "@/constants/Status";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { GENDER } from "@/constants/Gender";
import StatusFilter from "@/components/Filter/StatusFilter";
import GenderFilter from "@/components/Filter/GenderFilter";

const { Title } = Typography;

interface IProps {
  error?: Error;
}

const StaffFilter = (props: IProps) => {
  const [isErrorNetWork, setErrorNetWork] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { error } = props;

  useEffect(() => {
    if (error) setErrorNetWork(true);
    else setErrorNetWork(false);
  }, [error]);

  const onChangeStatus = (e: RadioChangeEvent) => {
    const params = new URLSearchParams(searchParams);
    const value = e.target.value;
    if (value) {
      params.set("status", value);
      params.set("page", "1");
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const onChangeGender = (e: RadioChangeEvent) => {
    const params = new URLSearchParams(searchParams);
    const value = e.target.value;
    if (value) {
      params.set("gender", value);
      params.set("page", "1");
    } else {
      params.delete("gender");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Space direction="vertical" style={{ minWidth: 256 }}>
        <StatusFilter onChange={onChangeStatus} disabled={isErrorNetWork}/>
        <GenderFilter onChange={onChangeGender} disabled={isErrorNetWork} />
    </Space>
  );
};
export default memo(StaffFilter);
