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
      prefix={<SearchOutlined style={{ color: "#888" }} />}
      className="search-input"
      value={query}
      onChange={onQueryChange}
    />
  );
};

export default SearchInput;
