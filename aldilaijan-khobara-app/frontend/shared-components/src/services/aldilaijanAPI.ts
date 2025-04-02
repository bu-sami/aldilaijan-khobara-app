import axios from 'axios';

// Aldilaijan-specific API services
const aldilaijanAPI = {
  // Property Types
  propertyTypes: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/property-types', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/property-types/${id}`),
    
    create: (data) => 
      axios.post('/api/aldilaijan/property-types', data),
    
    update: (id, data) => 
      axios.put(`/api/aldilaijan/property-types/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/property-types/${id}`),
  },
  
  // Properties
  properties: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/properties', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/properties/${id}`),
    
    create: (data) => 
      axios.post('/api/aldilaijan/properties', data),
    
    update: (id, data) => 
      axios.put(`/api/aldilaijan/properties/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/properties/${id}`),
    
    search: (params) => 
      axios.get('/api/aldilaijan/properties/search', { params }),
    
    getFeatured: () => 
      axios.get('/api/aldilaijan/properties/featured'),
  },
  
  // Property Statuses
  propertyStatuses: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/property-statuses', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/property-statuses/${id}`),
    
    create: (data) => 
      axios.post('/api/aldilaijan/property-statuses', data),
    
    update: (id, data) => 
      axios.put(`/api/aldilaijan/property-statuses/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/property-statuses/${id}`),
  },
  
  // Clients
  clients: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/clients', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/clients/${id}`),
    
    create: (data) => 
      axios.post('/api/aldilaijan/clients', data),
    
    update: (id, data) => 
      axios.put(`/api/aldilaijan/clients/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/clients/${id}`),
  },
  
  // Property Images
  propertyImages: {
    getByPropertyId: (propertyId) => 
      axios.get(`/api/aldilaijan/properties/${propertyId}/images`),
    
    upload: (propertyId, formData) => 
      axios.post(`/api/aldilaijan/properties/${propertyId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/property-images/${id}`),
    
    setPrimary: (id) => 
      axios.put(`/api/aldilaijan/property-images/${id}/set-primary`),
  },
  
  // Property Features
  propertyFeatures: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/property-features', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/property-features/${id}`),
    
    create: (data) => 
      axios.post('/api/aldilaijan/property-features', data),
    
    update: (id, data) => 
      axios.put(`/api/aldilaijan/property-features/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/property-features/${id}`),
  },
  
  // Transactions
  transactions: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/transactions', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/transactions/${id}`),
    
    create: (data) => 
      axios.post('/api/aldilaijan/transactions', data),
    
    update: (id, data) => 
      axios.put(`/api/aldilaijan/transactions/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/transactions/${id}`),
  },
  
  // Transaction Types
  transactionTypes: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/transaction-types', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/transaction-types/${id}`),
    
    create: (data) => 
      axios.post('/api/aldilaijan/transaction-types', data),
    
    update: (id, data) => 
      axios.put(`/api/aldilaijan/transaction-types/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/transaction-types/${id}`),
  },
  
  // MOJ Transactions
  mojTransactions: {
    getAll: (params) => 
      axios.get('/api/aldilaijan/moj-transactions', { params }),
    
    getById: (id) => 
      axios.get(`/api/aldilaijan/moj-transactions/${id}`),
    
    import: (formData) => 
      axios.post('/api/aldilaijan/moj-transactions/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    
    delete: (id) => 
      axios.delete(`/api/aldilaijan/moj-transactions/${id}`),
  },
  
  // Dashboard
  dashboard: {
    getSummary: () => 
      axios.get('/api/aldilaijan/dashboard/summary'),
    
    getRecentProperties: () => 
      axios.get('/api/aldilaijan/dashboard/recent-properties'),
    
    getRecentTransactions: () => 
      axios.get('/api/aldilaijan/dashboard/recent-transactions'),
    
    getPropertyStats: () => 
      axios.get('/api/aldilaijan/dashboard/property-stats'),
  },
};

export default aldilaijanAPI;
