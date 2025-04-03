import React from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const PageButton = styled(Button)(({ theme }) => ({
  minWidth: 40,
  height: 40,
  margin: theme.spacing(0, 0.5),
  borderRadius: '50%',
}));

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const { language } = React.useContext(ThemeContext);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxPagesToShow + 2);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  return (
    <PaginationContainer>
      <PageButton 
        variant="outlined" 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        {language === 'ar' ? '«' : '‹'}
      </PageButton>
      
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <Typography variant="body2" sx={{ mx: 1 }}>...</Typography>
          ) : (
            <PageButton
              variant={currentPage === page ? 'contained' : 'outlined'}
              color={currentPage === page ? 'primary' : 'inherit'}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
            >
              {page}
            </PageButton>
          )}
        </React.Fragment>
      ))}
      
      <PageButton 
        variant="outlined" 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        {language === 'ar' ? '»' : '›'}
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
