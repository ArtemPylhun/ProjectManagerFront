import { useEffect } from "react";
import { Form, Input, Select } from "antd";
import { validateName } from "../../hooks/useRoleValidators";

interface RoleFormProps {
  form: any;
  roleData: { name?: string; roleGroup?: number };
  setRoleData: (data: any) => void;
  roleGroups: { id: number; name: string }[] | null;
}

const RoleForm: React.FC<RoleFormProps> = ({
  form,
  roleData,
  setRoleData,
  roleGroups,
}) => {
  useEffect(() => {
    form.setFieldsValue(roleData);
  }, [roleData]);

  const handleFinish = async () => {
    try {
      await form.validateFields();
      console.log("Validation passed!");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="user-form"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, validator: validateName }]}
      >
        <Input
          placeholder="Name"
          onChange={(e) =>
            setRoleData((prev: any) => ({ ...prev, name: e.target.value }))
          }
        />
      </Form.Item>

      <Form.Item
        label="Role group"
        name="roleGroup"
        rules={[{ required: true }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Role group"
          value={roleData.roleGroup}
          onChange={(value) =>
            setRoleData((prev: any) => ({ ...prev, roleGroup: value }))
          }
          className="glassy-select"
        >
          {roleGroups?.map((group) => (
            <Select.Option key={group.id} value={group.id}>
              {group.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
