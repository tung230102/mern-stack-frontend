import Slider from "react-slick";

import { Image } from "antd";

function ProductSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const imageSlider = ["slider1.webp", "slider2.webp", "slider3.webp"];

  return (
    <div
      id="container"
      style={{ backgroundColor: "#efefef", padding: "0 120px" }}
    >
      <Slider {...settings}>
        {imageSlider.map((image) => (
          <Image
            key={image}
            src={image}
            alt={image}
            preview={false}
            width="100%"
            height="280px"
          />
        ))}
      </Slider>
    </div>
  );
}

export default ProductSlider;
