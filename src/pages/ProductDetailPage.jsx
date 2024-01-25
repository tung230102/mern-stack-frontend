import { useNavigate } from "react-router-dom";
import ProductDetail from "../features/product/ProductDetail";

function ProductDetailPage() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", background: "#efefef", height: "100%" }}>
      <div style={{ width: "1270px", height: "100%", margin: "0 auto" }}>
        <h5>
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => {
              navigate("/");
            }}
          >
            Trang chủ
          </span>{" "}
          - Chi tiết sản phẩm
        </h5>
        <ProductDetail />
      </div>
    </div>
  );
}

export default ProductDetailPage;
