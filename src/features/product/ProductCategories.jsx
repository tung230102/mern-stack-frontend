import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as ProductService from "../../services/ProductService";

const StyledUl = styled.ul`
  padding: 0 40px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
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

function ProductCategories() {
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
    <div>
      <StyledUl>
        {typeProducts?.map((item) => (
          <StyledLi key={item} onClick={() => handleClick(item)}>
            {item}
          </StyledLi>
        ))}
      </StyledUl>
    </div>
  );
}

export default ProductCategories;
