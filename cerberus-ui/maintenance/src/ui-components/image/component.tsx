import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import {SvgIcon} from '@mui/material';
import {useState} from 'react';

export const ImageComponent = (props: {
  src: string;
  alt: string;
  className?: string;
  size?: string;
}) => {
  const {src, alt, className} = props;
  const [hasError, setHasError] = useState(false);
  const handleError = () => {
    setHasError(true);
  };

  return (
    <>
      {hasError ? (
        <ErrorComponent className={className} size={props.size} />
      ) : (
        <img src={src} alt={alt} className={className} onError={handleError} />
      )}
    </>
  );
};

const ErrorComponent = (props: {className?: string; size?: string}) => {
  return (
    <div
      className={`flex w-full bg-[#8e8e8e] items-center justify-center ${props.className}`}>
      <SvgIcon
        className={`${
          props.size === 'small' ? 'image-icon-small' : 'image-icon'
        }`}>
        <ImageNotSupportedOutlinedIcon width='100%' />
      </SvgIcon>
    </div>
  );
};
