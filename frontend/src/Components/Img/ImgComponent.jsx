import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";

const ImgComponent = ({ src, alt, width, height, hash,lazyLoad }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsImageLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <>
      <div className={isImageLoaded ? "d-none" : ""} style={{width:width,height:height}}>
        <Blurhash
          hash={hash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </div>

      <img
        className={isImageLoaded ? "" : "d-none"}
        src={src}
        loading={lazyLoad?"lazy":"eager"}
        alt={alt ? alt : "Img"}
      />
    </>
  );
};

export default ImgComponent;
