import { Image } from "antd";
import Slider from "react-slick";
import styled from "styled-components";

const WrapperSliderStyle = styled(Slider)`
  & .slick-arrow.slick-prev {
    left: 12px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: var(--color-grey-0);
    }
  }
  & .slick-arrow.slick-next {
    right: 28px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: var(--color-grey-0);
    }
  }
  & .slick-dots {
    z-index: 10;
    bottom: -2px !important;
    li {
      button {
        &::before {
          color: var(--color-grey-0);
        }
      }
    }
    li.active {
      button {
        &::before {
          color: var(--color-grey-0);
        }
      }
    }
  }
`;

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

  const imageSlider = ["/slider1.webp", "/slider2.webp", "/slider3.webp"];

  return (
    <div style={{ padding: "0 40px" }}>
      <WrapperSliderStyle {...settings}>
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
      </WrapperSliderStyle>
    </div>
  );
}

export default ProductSlider;
