import Product from "../features/product/Product";
import ProductCategories from "../features/product/ProductCategories";
import ProductSlider from "../features/product/ProductSlider";

function HomePage() {
  return (
    <div>
      <ProductCategories />
      <ProductSlider />
      <Product />
    </div>
  );
}

export default HomePage;
