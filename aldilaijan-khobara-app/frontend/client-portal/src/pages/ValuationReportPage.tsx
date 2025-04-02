import React from 'react';
import { Box, Typography, Paper, Container, Grid, Button, Chip, TextField, MenuItem, Tabs, Tab } from '@mui/material';
import { useAuth } from '../services/auth-context';
import { ThemeContext } from '../contexts/theme-context';
import { StatusMessage, LoadingIndicator } from '../components/feedback';
import ClientLayout from '../components/layouts/ClientLayout';
import { Section } from '../components/layout-elements';
import { ValuationReport } from '../components/ValuationReport';
import { MapComponent } from '../components/MapComponent';

const ValuationReportPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = React.useContext(ThemeContext);
  const [report, setReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState(0);

  // Fetch report data
  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockReport = { 
          id: 1, 
          reference: 'KV-2023-1234',
          title: 'Valuation Report - Commercial Building in Kuwait City', 
          status: 'Completed',
          completionDate: '2023-09-20T14:45:00Z',
          requestDate: '2023-09-15T10:30:00Z',
          client: {
            name: 'National Bank of Kuwait',
            type: 'Corporate',
            contactPerson: 'Mohammed Al-Sager',
            email: 'mohammed@nbk.com',
            phone: '+965 2222 3333',
          },
          property: {
            type: 'Commercial',
            subType: 'Office Building',
            address: 'Block 3, Plot 24, Sharq, Kuwait City, Kuwait',
            area: 2500,
            landArea: 1200,
            yearBuilt: 2015,
            description: 'A modern 8-story office building located in the heart of Kuwait City\'s financial district. The building features high-quality finishes, central air conditioning, smart building systems, and underground parking for 50 cars. The ground floor includes retail spaces, while the upper floors are dedicated to office spaces with flexible layouts.',
            location: {
              latitude: 29.3759,
              longitude: 47.9774,
            },
            images: [
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            ],
          },
          valuation: {
            purpose: 'Mortgage',
            approaches: [
              {
                name: 'Income Approach',
                method: 'Discounted Cash Flow',
                value: 4850000,
                weight: 60,
                details: {
                  annualRentalIncome: 350000,
                  occupancyRate: 0.92,
                  operatingExpenses: 80000,
                  capitalizationRate: 0.07,
                  discountRate: 0.09,
                  projectionPeriod: 10,
                }
              },
              {
                name: 'Market Approach',
                method: 'Comparable Sales',
                value: 5100000,
                weight: 30,
                details: {
                  comparables: [
                    {
                      address: 'Block 2, Sharq, Kuwait City',
                      salePrice: 4800000,
                      area: 2300,
                      pricePerSqm: 2087,
                      adjustmentFactor: 1.05,
                    },
                    {
                      address: 'Block 5, Sharq, Kuwait City',
                      salePrice: 5500000,
                      area: 2700,
                      pricePerSqm: 2037,
                      adjustmentFactor: 0.98,
                    },
                    {
                      address: 'Block 1, Sharq, Kuwait City',
                      salePrice: 4600000,
                      area: 2200,
                      pricePerSqm: 2091,
                      adjustmentFactor: 1.03,
                    },
                  ]
                }
              },
              {
                name: 'Cost Approach',
                method: 'Replacement Cost',
                value: 4950000,
                weight: 10,
                details: {
                  landValue: 2400000,
                  constructionCost: 2800000,
                  depreciation: 250000,
                }
              }
            ],
            finalValue: 4920000,
            currency: 'KWD',
            valuePerSqm: 1968,
            confidenceLevel: 'High',
            limitingConditions: [
              'This valuation is valid as of the valuation date only.',
              'The valuation assumes that all information provided by the client is accurate and complete.',
              'No legal verification of the property title has been undertaken.',
              'The valuation assumes that there are no environmental issues affecting the property.',
              'The valuation is based on current market conditions and may change with market fluctuations.',
            ],
          },
          appraiser: {
            name: 'Ahmad Al-Mutawa',
            license: 'KV-2015-078',
            signature: 'https://example.com/signatures/ahmad-al-mutawa.png',
          },
          marketAnalysis: 'The commercial real estate market in Kuwait City has shown stability over the past year, with a slight increase in demand for high-quality office spaces in prime locations. The subject property is located in a desirable area with good accessibility and visibility. The current occupancy rates for similar properties in the area range from 85% to 95%, with an average rental rate of KWD 12-15 per square meter per month. The outlook for the commercial real estate market in Kuwait City remains positive, with expected steady growth in the coming years due to government initiatives to diversify the economy and attract foreign investments.',
          attachments: [
            {
              name: 'Full Valuation Report.pdf',
              url: 'https://example.com/reports/KV-2023-1234-full.pdf',
              size: '4.2 MB',
            },
            {
              name: 'Property Photos.zip',
              url: 'https://example.com/reports/KV-2023-1234-photos.zip',
              size: '15.8 MB',
            },
            {
              name: 'Market Analysis Data.xlsx',
              url: 'https://example.com/reports/KV-2023-1234-market-data.xlsx',
              size: '1.3 MB',
            },
          ],
        };
        
        setReport(mockReport);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch valuation report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Calculate weighted average value
  const calculateWeightedValue = (approaches: any[]) => {
    let weightedValue = 0;
    let totalWeight = 0;
    
    approaches.forEach(approach => {
      weightedValue += approach.value * approach.weight;
      totalWeight += approach.weight;
    });
    
    return totalWeight > 0 ? weightedValue / totalWeight : 0;
  };

  if (loading || authLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <ClientLayout 
        title={language === 'ar' ? 'خطأ' : 'Error'}
        businessType="khobara"
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'خطأ' : 'Error'} 
            message={error} 
          />
        </Container>
      </ClientLayout>
    );
  }

  if (!report) {
    return (
      <ClientLayout 
        title={language === 'ar' ? 'تقرير التقييم غير موجود' : 'Valuation Report Not Found'}
        businessType="khobara"
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <StatusMessage 
            type="error" 
            title={language === 'ar' ? 'تقرير التقييم غير موجود' : 'Valuation Report Not Found'} 
            message={language === 'ar' 
              ? 'لم يتم العثور على تقرير التقييم المطلوب. قد يكون قد تم حذفه أو نقله.'
              : 'The requested valuation report could not be found. It may have been deleted or moved.'
            } 
          />
        </Container>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout 
      title={report.title}
      businessType="khobara"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {report.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
              {language === 'ar' ? 'رقم المرجع:' : 'Reference:'} {report.reference}
            </Typography>
            <Chip 
              label={report.status} 
              size="small" 
              color={report.status === 'Completed' ? 'success' : 'warning'} 
              sx={{ mr: 1 }}
            />
          </Box>
          
          <Typography variant="h5" color="primary" gutterBottom>
            {language === 'ar' ? 'القيمة السوقية:' : 'Market Value:'} {report.valuation.currency} {report.valuation.finalValue.toLocaleString()}
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {/* Report Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{ mb: 3 }}
              >
                <Tab label={language === 'ar' ? 'ملخص التقييم' : 'Valuation Summary'} />
                <Tab label={language === 'ar' ? 'تفاصيل العقار' : 'Property Details'} />
                <Tab label={language === 'ar' ? 'منهجية التقييم' : 'Valuation Methodology'} />
                <Tab label={language === 'ar' ? 'تحليل السوق' : 'Market Analysis'} />
              </Tabs>
              
              {/* Valuation Summary Tab */}
              {activeTab === 0 && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'القيمة السوقية' : 'Market Value'}
                        </Typography>
                        <Typography variant="h6">
                          {report.valuation.currency} {report.valuation.finalValue.toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'القيمة لكل متر مربع' : 'Value per Square Meter'}
                        </Typography>
                        <Typography variant="h6">
                          {report.valuation.currency} {report.valuation.valuePerSqm.toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'تاريخ التقييم' : 'Valuation Date'}
                        </Typography>
                        <Typography variant="h6">
                          {new Date(report.completionDate).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'الغرض من التقييم' : 'Purpose of Valuation'}
                        </Typography>
                        <Typography variant="h6">
                          {report.valuation.purpose}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'طرق التقييم المستخدمة' : 'Valuation Approaches Used'}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    {report.valuation.approaches.map((approach: any, index: number) => (
                      <Paper variant="outlined" sx={{ p: 2, mb: 2 }} key={index}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                              {approach.name} ({approach.weight}%)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {approach.method}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="h6" align="right">
                              {report.valuation.currency} {approach.value.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'الشروط والقيود' : 'Limiting Conditions'}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {report.valuation.limitingConditions.map((condition: string, index: number) => (
                      <Typography component="li" variant="body1" key={index} paragraph>
                        {condition}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Property Details Tab */}
              {activeTab === 1 && (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'نوع العقار' : 'Property Type'}
                        </Typography>
                        <Typography variant="h6">
                          {report.property.type} - {report.property.subType}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'المساحة المبنية' : 'Built-up Area'}
                        </Typography>
                        <Typography variant="h6">
                          {report.property.area} m²
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'مساحة الأرض' : 'Land Area'}
                        </Typography>
                        <Typography variant="h6">
                          {report.property.landArea} m²
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {language === 'ar' ? 'سنة البناء' : 'Year Built'}
                        </Typography>
                        <Typography variant="h6">
                          {report.property.yearBuilt}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'وصف العقار' : 'Property Description'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {report.property.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'موقع العقار' : 'Property Location'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {report.property.address}
                  </Typography>
                  <Box sx={{ height: 400, mb: 3 }}>
                    <MapComponent 
                      latitude={report.property.location.latitude} 
                      longitude={report.property.location.longitude} 
                    />
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'صور العقار' : 'Property Images'}
                  </Typography>
                  <Grid container spacing={2}>
                    {report.property.images.map((image: string, index: number) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Box 
                          component="img"
                          src={image}
                          alt={`Property image ${index + 1}`}
                          sx={{ 
                            width: '100%', 
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* Valuation Methodology Tab */}
              {activeTab === 2 && (
                <Box>
                  {report.valuation.approaches.map((approach: any, index: number) => (
                    <Box key={index} sx={{ mb: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        {approach.name} ({approach.weight}%)
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {language === 'ar' 
                          ? `تم استخدام طريقة ${approach.method} لتقييم العقار.`
                          : `The ${approach.method} method was used to value the property.`
                        }
                      </Typography>
                      
                      {approach.name === 'Income Approach' && (
                        <Box>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {language === 'ar' ? 'الدخل السنوي من الإيجار' : 'Annual Rental Income'}
                                </Typography>
                                <Typography variant="body1">
                                  {report.valuation.currency} {approach.details.annualRentalIncome.toLocaleString()}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {language === 'ar' ? 'معدل الإشغال' : 'Occupancy Rate'}
                                </Typography>
                                <Typography variant="body1">
                                  {(approach.details.occupancyRate * 100).toFixed(0)}%
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {language === 'ar' ? 'مصاريف التشغيل' : 'Operating Expenses'}
                                </Typography>
                                <Typography variant="body1">
                                  {report.valuation.currency} {approach.details.operatingExpenses.toLocaleString()}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {language === 'ar' ? 'معدل الرسملة' : 'Capitalization Rate'}
                                </Typography>
                                <Typography variant="body1">
                                  {(approach.details.capitalizationRate * 100).toFixed(2)}%
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                      
                      {approach.name === 'Market Approach' && (
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>
                            {language === 'ar' ? 'العقارات المقارنة' : 'Comparable Properties'}
                          </Typography>
                          {approach.details.comparables.map((comparable: any, idx: number) => (
                            <Paper variant="outlined" sx={{ p: 2, mb: 2 }} key={idx}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2">
                                    {comparable.address}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    {language === 'ar' ? 'سعر البيع' : 'Sale Price'}
                                  </Typography>
                                  <Typography variant="body1">
                                    {report.valuation.currency} {comparable.salePrice.toLocaleString()}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    {language === 'ar' ? 'المساحة' : 'Area'}
                                  </Typography>
                                  <Typography variant="body1">
                                    {comparable.area} m²
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    {language === 'ar' ? 'السعر لكل متر مربع' : 'Price per sqm'}
                                  </Typography>
                                  <Typography variant="body1">
                                    {report.valuation.currency} {comparable.pricePerSqm.toLocaleString()}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2" color="text.secondary">
                                    {language === 'ar' ? 'معامل التعديل' : 'Adjustment Factor'}
                                  </Typography>
                                  <Typography variant="body1">
                                    {comparable.adjustmentFactor.toFixed(2)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Paper>
                          ))}
                        </Box>
                      )}
                      
                      {approach.name === 'Cost Approach' && (
                        <Box>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={4}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {language === 'ar' ? 'قيمة الأرض' : 'Land Value'}
                                </Typography>
                                <Typography variant="body1">
                                  {report.valuation.currency} {approach.details.landValue.toLocaleString()}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {language === 'ar' ? 'تكلفة البناء' : 'Construction Cost'}
                                </Typography>
                                <Typography variant="body1">
                                  {report.valuation.currency} {approach.details.constructionCost.toLocaleString()}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {language === 'ar' ? 'الإهلاك' : 'Depreciation'}
                                </Typography>
                                <Typography variant="body1">
                                  {report.valuation.currency} {approach.details.depreciation.toLocaleString()}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="h6">
                          {language === 'ar' ? 'القيمة:' : 'Value:'} {report.valuation.currency} {approach.value.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  
                  <Box sx={{ mt: 3, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {language === 'ar' ? 'القيمة النهائية (المرجحة)' : 'Final (Weighted) Value'}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {language === 'ar' 
                        ? 'تم حساب القيمة النهائية باستخدام المتوسط المرجح لطرق التقييم المختلفة، مع مراعاة الأوزان المخصصة لكل طريقة.'
                        : 'The final value was calculated using the weighted average of the different valuation approaches, taking into account the weights assigned to each approach.'
                      }
                    </Typography>
                    <Typography variant="h5" color="primary" align="right">
                      {report.valuation.currency} {report.valuation.finalValue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* Market Analysis Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {language === 'ar' ? 'تحليل السوق العقاري' : 'Real Estate Market Analysis'}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {report.marketAnalysis}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Client Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'معلومات العميل' : 'Client Information'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'اسم العميل' : 'Client Name'}
                </Typography>
                <Typography variant="body1">
                  {report.client.name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'نوع العميل' : 'Client Type'}
                </Typography>
                <Typography variant="body1">
                  {report.client.type}
                </Typography>
              </Box>
              {report.client.type === 'Corporate' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {language === 'ar' ? 'الشخص المسؤول' : 'Contact Person'}
                  </Typography>
                  <Typography variant="body1">
                    {report.client.contactPerson}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Typography>
                <Typography variant="body1">
                  {report.client.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </Typography>
                <Typography variant="body1">
                  {report.client.phone}
                </Typography>
              </Box>
            </Paper>
            
            {/* Appraiser Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'معلومات المقيم' : 'Appraiser Information'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'اسم المقيم' : 'Appraiser Name'}
                </Typography>
                <Typography variant="body1">
                  {report.appraiser.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {language === 'ar' ? 'رقم الترخيص' : 'License Number'}
                </Typography>
                <Typography variant="body1">
                  {report.appraiser.license}
                </Typography>
              </Box>
            </Paper>
            
            {/* Report Attachments */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'ar' ? 'المرفقات' : 'Attachments'}
              </Typography>
              {report.attachments.map((attachment: any, index: number) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: index < report.attachments.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <Box>
                    <Typography variant="body1">
                      {attachment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {attachment.size}
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined"
                    size="small"
                    href={attachment.url}
                    target="_blank"
                  >
                    {language === 'ar' ? 'تحميل' : 'Download'}
                  </Button>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ClientLayout>
  );
};

export default ValuationReportPage;
