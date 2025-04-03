import React from 'react';
import { Box, Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeContext } from '../themes/theme';
import { PrimaryButton, OutlinedPrimaryButton } from './buttons';
import { StyledTextField } from './inputs';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  onSearch: (searchTerm: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onReset?: () => void;
  filterOptions?: {
    [key: string]: {
      label: string;
      options: FilterOption[];
    };
  };
  searchPlaceholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilter,
  onReset,
  filterOptions = {},
  searchPlaceholder,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const { language } = React.useContext(ThemeContext);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({});
    if (onReset) {
      onReset();
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <StyledTextField
            fullWidth
            placeholder={searchPlaceholder || (language === 'ar' ? 'بحث...' : 'Search...')}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            size="small"
          />
        </Grid>

        {Object.keys(filterOptions).map((field) => (
          <Grid item xs={12} sm={6} md={2} key={field}>
            <StyledTextField
              select
              fullWidth
              size="small"
              label={filterOptions[field].label}
              value={filters[field] || ''}
              onChange={(e) => handleFilterChange(field, e.target.value)}
            >
              <MenuItem value="">
                {language === 'ar' ? 'الكل' : 'All'}
              </MenuItem>
              {filterOptions[field].options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>
        ))}

        <Grid item xs={12} md={Object.keys(filterOptions).length > 0 ? 4 : 8}>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            {Object.keys(filterOptions).length > 0 && (
              <>
                <OutlinedPrimaryButton onClick={handleReset} size="small">
                  {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
                </OutlinedPrimaryButton>
                <PrimaryButton onClick={handleApplyFilters} size="small">
                  {language === 'ar' ? 'تطبيق الفلتر' : 'Apply Filter'}
                </PrimaryButton>
              </>
            )}
            <PrimaryButton onClick={handleSearch} size="small">
              {language === 'ar' ? 'بحث' : 'Search'}
            </PrimaryButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBar;
