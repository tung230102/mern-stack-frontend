import { useState } from "react";

import { SearchOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Search from "antd/es/input/Search";
import { useDispatch } from "react-redux";
import { searchProduct } from "../../redux/slices/productSlide";

import styled from "styled-components";

const StyledButton = styled(Button)`
  background-color: var(--color-brand-600);
  color: var(--color-grey-0) !important;

  &:hover {
    background-color: var(--color-brand-700);
    border-style: none !important;
  }
`;

function SearchProduct() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  function handleSearchProduct(e) {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  }

  function onSearch() {}

  return (
    <div style={{ display: "flex" }}>
      <Search
        onChange={handleSearchProduct}
        placeholder="Nhập tìm kiếm"
        allowClear
        enterButton={
          <StyledButton icon={<SearchOutlined />}>Tìm kiếm</StyledButton>
        }
        size="large"
        onSearch={onSearch}
      />
    </div>
  );
}

export default SearchProduct;
