import axios from 'axios';

// Khobara-specific API services
const khobaraAPI = {
  // Property Types
  propertyTypes: {
    getAll: (params) => 
      axios.get('/api/khobara/property-types', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/property-types/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/property-types', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/property-types/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/property-types/${id}`),
  },
  
  // Properties
  properties: {
    getAll: (params) => 
      axios.get('/api/khobara/properties', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/properties/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/properties', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/properties/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/properties/${id}`),
  },
  
  // Clients
  clients: {
    getAll: (params) => 
      axios.get('/api/khobara/clients', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/clients/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/clients', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/clients/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/clients/${id}`),
  },
  
  // Valuation Requests
  valuationRequests: {
    getAll: (params) => 
      axios.get('/api/khobara/valuation-requests', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/valuation-requests/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/valuation-requests', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/valuation-requests/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/valuation-requests/${id}`),
    
    updateStatus: (id, statusId) => 
      axios.put(`/api/khobara/valuation-requests/${id}/status`, { statusId }),
    
    getByClient: (clientId) => 
      axios.get(`/api/khobara/clients/${clientId}/valuation-requests`),
  },
  
  // Valuation Request Types
  valuationRequestTypes: {
    getAll: (params) => 
      axios.get('/api/khobara/valuation-request-types', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/valuation-request-types/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/valuation-request-types', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/valuation-request-types/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/valuation-request-types/${id}`),
  },
  
  // Valuation Statuses
  valuationStatuses: {
    getAll: (params) => 
      axios.get('/api/khobara/valuation-statuses', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/valuation-statuses/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/valuation-statuses', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/valuation-statuses/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/valuation-statuses/${id}`),
  },
  
  // Valuation Reports
  valuationReports: {
    getAll: (params) => 
      axios.get('/api/khobara/valuation-reports', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/valuation-reports/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/valuation-reports', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/valuation-reports/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/valuation-reports/${id}`),
    
    getByRequest: (requestId) => 
      axios.get(`/api/khobara/valuation-requests/${requestId}/report`),
    
    generatePdf: (id) => 
      axios.get(`/api/khobara/valuation-reports/${id}/pdf`, {
        responseType: 'blob',
      }),
  },
  
  // Valuation Approaches
  valuationApproaches: {
    getAll: (params) => 
      axios.get('/api/khobara/valuation-approaches', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/valuation-approaches/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/valuation-approaches', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/valuation-approaches/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/valuation-approaches/${id}`),
  },
  
  // Market Data
  marketData: {
    getAll: (params) => 
      axios.get('/api/khobara/market-data', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/market-data/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/market-data', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/market-data/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/market-data/${id}`),
    
    getByLocation: (locationId) => 
      axios.get(`/api/khobara/locations/${locationId}/market-data`),
  },
  
  // Property Documents
  propertyDocuments: {
    getByPropertyId: (propertyId) => 
      axios.get(`/api/khobara/properties/${propertyId}/documents`),
    
    upload: (propertyId, formData) => 
      axios.post(`/api/khobara/properties/${propertyId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    
    delete: (id) => 
      axios.delete(`/api/khobara/property-documents/${id}`),
    
    download: (id) => 
      axios.get(`/api/khobara/property-documents/${id}/download`, {
        responseType: 'blob',
      }),
  },
  
  // Valuation Report Templates
  reportTemplates: {
    getAll: (params) => 
      axios.get('/api/khobara/report-templates', { params }),
    
    getById: (id) => 
      axios.get(`/api/khobara/report-templates/${id}`),
    
    create: (data) => 
      axios.post('/api/khobara/report-templates', data),
    
    update: (id, data) => 
      axios.put(`/api/khobara/report-templates/${id}`, data),
    
    delete: (id) => 
      axios.delete(`/api/khobara/report-templates/${id}`),
  },
  
  // Dashboard
  dashboard: {
    getSummary: () => 
      axios.get('/api/khobara/dashboard/summary'),
    
    getRecentRequests: () => 
      axios.get('/api/khobara/dashboard/recent-requests'),
    
    getRecentReports: () => 
      axios.get('/api/khobara/dashboard/recent-reports'),
    
    getValuationStats: () => 
      axios.get('/api/khobara/dashboard/valuation-stats'),
  },
};

export default khobaraAPI;
