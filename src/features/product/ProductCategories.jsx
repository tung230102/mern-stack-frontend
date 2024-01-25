import styled from "styled-components";
import * as ProductService from "../../services/ProductService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledUl = styled.ul`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  border-bottom: 1px solid red;
  height: 48px;
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
    <div style={{ padding: "0 120px", cursor: "pointer" }}>
      <StyledUl>
        {typeProducts?.map((item) => (
          <li key={item} onClick={() => handleClick(item)}>
            {item}
          </li>
        ))}
      </StyledUl>
    </div>
  );
}

export default ProductCategories;
