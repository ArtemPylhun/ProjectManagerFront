import { ReactNode } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
interface LoaderComponentProps {
  loading: boolean;
  children: ReactNode;
}

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Spin size="large" indicator={<LoadingOutlined spin />} />
    </div>
  );
};

const LoaderComponent = ({ loading, children }: LoaderComponentProps) => {
  return <>{loading ? <Loader /> : children}</>;
};

export default LoaderComponent;
