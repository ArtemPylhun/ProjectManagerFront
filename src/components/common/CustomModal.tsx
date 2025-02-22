import React from "react";
import { Modal } from "antd";
import "../../styles/styles.css"; // Ensure this file contains the new modal styles

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
      title={<div className="modal-header">{title}</div>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      className="custom-modal"
      closeIcon={null}
      okButtonProps={{
        danger: isDanger,
        className: isDanger ? "modal-button danger" : "modal-button",
      }}
      cancelButtonProps={{ className: "modal-button cancel" }}
      styles={{ body: { padding: "1rem 1.5rem" } }}
    >
      <div className="modal-content">{children}</div>
    </Modal>
  );
};

export default CustomModal;
