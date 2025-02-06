import { Spin } from "antd";
import { ReactNode } from "react";

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
      <Spin size="large" />
    </div>
  );
};

const LoaderComponent = ({ loading, children }: LoaderComponentProps) => {
  return <>{loading ? <Loader /> : children}</>;
};

export default LoaderComponent;
