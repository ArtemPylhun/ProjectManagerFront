import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchInputProps {
  query: string;
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ query, onQueryChange }) => {
  return (
    <Input
      placeholder="Search..."
      allowClear
      prefix={<SearchOutlined style={{ color: "#888" }} />}
      style={{
        width: "100%" /* Ensures it takes up the full width of its container */,
        height: "40px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        fontSize: "16px",
        background: "#f4f7fc",
        display: "flex",
        alignItems: "center",
      }}
      value={query}
      onChange={onQueryChange}
    />
  );
};

export default SearchInput;
