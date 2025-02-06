import { Input } from "antd";

interface SearchInputProps {
  query: string;
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ query, onQueryChange }) => {
  return (
    <Input
      placeholder="Search"
      allowClear
      style={{ margin: "10px 0px" }}
      value={query}
      onChange={onQueryChange}
    />
  );
};

export default SearchInput;
