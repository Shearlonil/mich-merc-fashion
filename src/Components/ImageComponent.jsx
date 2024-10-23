import { Suspense, useState } from "react";
import { Blurhash } from "react-blurhash";
import httpService from "../axios/http-service";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";

/*  refs: 
        https://hamon.in/blog/blurhash/
        https://github.com/ipenywis/img-lazy-loading/tree/master/src    OR  https://www.youtube.com/watch?v=8viWcH5bUE4
    */

const ImageWrapper = styled.div`
  position: relative;
`;

const StyledBlurhash = styled(Blurhash)`
  z-index: 20;
  position: absolute !important;
  top: 0;
  left: 0;
`;

const ImageComponent = ({ image, width, height }) => {
  const [isLoaded, setLoaded] = useState(false);
  const [isLoadStarted, setLoadStarted] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleLoadStarted = () => {
    setLoadStarted(true);
  };
  return (
    <ImageWrapper>
      <LazyLoadImage
        key={image?.id}
        src={`${httpService.baseURL()}/items/imgs/${image?.file_name}`}
        width={width || "100%"}
        height={height || 200}
        onLoad={handleLoad}
        beforeLoad={handleLoadStarted}
      />
      {!isLoaded && isLoadStarted && (
        <StyledBlurhash
          hash={image.blur_hash}
          width={width || "100%"}
          height={height || 200}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
    </ImageWrapper>
  );
};

export default ImageComponent;
