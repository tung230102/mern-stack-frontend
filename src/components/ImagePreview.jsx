import { Image } from "antd";

function ImagePreview({
  preview = false,
  src,
  alt = "image preview",
  size = 80,
  objectFit = "cover",
  border = "1px solid var(--color-grey-100)",
  borderRadius,
  margin = 4,
  ...rests
}) {
  return (
    <Image
      preview={preview}
      src={src}
      alt={alt}
      style={{
        height: size,
        width: size,
        objectFit: objectFit,
        border: border,
        borderRadius: borderRadius,
        margin: margin,
        ...rests,
      }}
    />
  );
}

export default ImagePreview;
