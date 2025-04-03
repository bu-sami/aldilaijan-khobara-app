import React from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
}));

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    isPrimary?: boolean;
  }[];
  onImageClick?: (index: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImageClick,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(
    images.findIndex(img => img.isPrimary) !== -1 
      ? images.findIndex(img => img.isPrimary) 
      : 0
  );

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    if (onImageClick) {
      onImageClick(index);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: 400,
          overflow: 'hidden',
          borderRadius: 1,
          mb: 2,
          position: 'relative',
        }}
      >
        <img
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 1,
            pb: 1,
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                width: 80,
                height: 60,
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: index === selectedIndex ? '2px solid' : 'none',
                borderColor: 'primary.main',
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageGallery;
