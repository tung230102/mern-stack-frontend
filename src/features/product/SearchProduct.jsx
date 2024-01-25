import { useState } from "react";
import InputSearch from "../../ui/InputSearch";
import { useDispatch } from "react-redux";
import { searchProduct } from "../../redux/slices/productSlide";

function SearchProduct() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  function handleSearchProduct(e) {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  }

  return <InputSearch onChange={handleSearchProduct} />;
}

export default SearchProduct;
