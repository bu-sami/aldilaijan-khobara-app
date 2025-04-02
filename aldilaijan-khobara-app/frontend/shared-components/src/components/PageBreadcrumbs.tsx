import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ThemeContext } from '../themes/theme';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({ items }) => {
  const { language, direction } = React.useContext(ThemeContext);
  
  return (
    <StyledBreadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />} 
      aria-label="breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return isLast ? (
          <Typography key={index} color="text.primary" fontWeight="medium">
            {item.label}
          </Typography>
        ) : (
          <Link 
            key={index} 
            color="inherit" 
            href={item.href || '#'} 
            underline="hover"
          >
            {item.label}
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export default PageBreadcrumbs;
