import { Footer } from "antd/es/layout/layout";

function FooterLayout() {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      &copy; by Nguyễn Huy Tùng - MobileMart {new Date().getFullYear()}
    </Footer>
  );
}

export default FooterLayout;
