import { useEffect} from "react";

const ImgPreloader = ({ src, alt, classes,lazyLoad }) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;
  }, [src]);

  return (
    <>
      <img
        className={classes}
        src={src}
        loading={lazyLoad ? "lazy" : "eager"}
        alt={alt ? alt : "Img"}
      />
    </>
  );
};

export default ImgPreloader;
