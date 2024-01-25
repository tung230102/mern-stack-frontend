import Product from "../features/product/Product";
import SimpleSlider from "../features/product/ProductSlider";
import ProductCategories from "../features/product/ProductCategories";

function HomePage() {
  return (
    <div>
      <ProductCategories />
      <SimpleSlider />
      <div style={{ padding: "0 120px" }}>
        <Product />
      </div>
    </div>
  );
}

export default HomePage;
