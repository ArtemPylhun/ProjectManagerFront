import React from "react";
import { Modal } from "antd";

interface CustomModalProps {
  visible: boolean;
  title: string;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  isDanger?: boolean;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  isDanger = false,
  children,
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger: isDanger }}
      styles={{ body: { padding: "1rem 1.5rem" } }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
