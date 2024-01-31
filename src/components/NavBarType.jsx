import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import * as ProductService from "../services/ProductService";

const StyledSpan = styled.span`
  font-weight: bold;
  font-size: 1.6rem;
  cursor: pointer;
  &:hover {
    color: var(--color-brand-600);
  }
`;

const StyledUl = styled.ul`
  margin-top: 12px;
`;

const StyledLi = styled.li`
  padding: 8px 8px;
  cursor: pointer;
  &:hover {
    background-color: var(--color-brand-600);
    color: var(--color-grey-0);
    border-radius: 4px;
  }
`;

function NavBarType() {
  const navigate = useNavigate();
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  function handleClick(item) {
    navigate(
      `/product/${item
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: item }
    );
  }

  return (
    <>
      <StyledSpan onClick={() => navigate("/")}>Trang chủ</StyledSpan>
      <span>/Loại sản phẩm</span>

      <StyledUl>
        {typeProducts?.map((item) => (
          <StyledLi key={item} onClick={() => handleClick(item)}>
            {item}
          </StyledLi>
        ))}
      </StyledUl>
    </>
  );
}

export default NavBarType;
