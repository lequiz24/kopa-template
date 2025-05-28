import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Button, Card, CardContent, Grid, 
  Avatar, Chip, Divider, Paper, Stack, useMediaQuery
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  CreditScore as CreditScoreIcon,
  Payments as PaymentsIcon,
  Help as HelpIcon,
  VerifiedUser as VerifiedUserIcon,
  EmojiEvents as EmojiEventsIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';
import KopaExtraLogo from '../assets/logo.png';

function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const userPhone = localStorage.getItem('userPhone');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
  const loanData = JSON.parse(localStorage.getItem('loanData') || 'null');
  
  const [creditScore, setCreditScore] = useState(650);
  const [eligibleAmount, setEligibleAmount] = useState(0);
  //const [activeLoans, setActiveLoans] = useState(0);

  useEffect(() => {
    // Simulate credit score calculation based on KYC
    if (kycData.kycCompleted) {
      const baseScore = 600;
      const incomeScore = kycData.monthlyIncome ? Math.min(kycData.monthlyIncome / 5000, 100) : 0;
      const employmentScore = kycData.employmentType === 'employed' ? 50 : 30;
      setCreditScore(Math.min(baseScore + incomeScore + employmentScore, 850));
      
      // Calculate eligible amount
      const maxAmount = kycData.monthlyIncome ? kycData.monthlyIncome * 3 : 0;
      setEligibleAmount(Math.min(maxAmount, 200000)); // Cap at 200K
    }
  }, [kycData]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userPhone');
    navigate('/');
  };

  const getLoanStatus = () => {
    if (!loanData) return 'No active loan';
    if (loanData.status === 'Pending') return 'Under review';
    if (loanData.status === 'Approved') return 'Active';
    return loanData.status;
  };

  // Gradient colors
  const primaryGradient = 'linear-gradient(135deg, #3f51b5, #2196f3)';
  const secondaryGradient = 'linear-gradient(135deg, #ff9800, #ff5722)';
  const successGradient = 'linear-gradient(135deg, #4caf50, #8bc34a)';
  const warningGradient = 'linear-gradient(135deg, #ffc107, #ff9800)';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f5f7fa',
      pb: 6
    }}>
      {/* App Bar */}
      <Box sx={{
        background: primaryGradient,
        color: 'white',
        py: 2,
        px: isMobile ? 2 : 4,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        mb: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={KopaExtraLogo} alt="Kopa Extra" style={{ height: '36px', marginRight: '12px' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Kopa Extra
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                mr: 1,
                width: 36,
                height: 36,
                fontSize: '0.875rem'
              }}>
                {userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}
              </Avatar>
              {!isMobile && (
                <Box sx={{ mr: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {userData.firstName} {userData.lastName}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {userPhone}
                  </Typography>
                </Box>
              )}
              <Button 
                variant="outlined" 
                color="inherit"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ 
                  borderRadius: '20px',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white'
                  }
                }}
              >
                {isMobile ? '' : 'Logout'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Welcome Card */}
        <Card sx={{ 
          mb: 3,
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          borderLeft: '4px solid',
          borderColor: 'primary.main'
        }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Welcome back, {userData.firstName}!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {kycData.kycCompleted ? 
                    'Your profile is complete and you qualify for loans up to KES 200,000' : 
                    'Complete your KYC to unlock higher loan amounts and better rates'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate(kycData.kycCompleted ? '/apply-loan' : '/kyc')}
                  sx={{
                    borderRadius: '20px',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {kycData.kycCompleted ? 'Apply for Loan' : 'Complete KYC'}
                </Button>
              </Grid>
              {!isMobile && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <SavingsIcon sx={{ 
                      fontSize: 80, 
                      color: 'primary.light',
                      opacity: 0.8
                    }} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              background: primaryGradient,
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(63, 81, 181, 0.15)'
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}>
                    <CreditScoreIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Credit Score
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {creditScore}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {creditScore > 700 ? 'Excellent' : creditScore > 600 ? 'Good' : 'Fair'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              background: secondaryGradient,
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)'
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}>
                    <PaymentsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Eligible Amount
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      KES {eligibleAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {kycData.kycCompleted ? 'Verified limit' : 'Complete KYC to increase'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%',
              background: successGradient,
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)'
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Loan Status
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {getLoanStatus()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {loanData?.status === 'Approved' ? 'Ready for disbursement' : ' '}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Apply for Loan Card */}
            <Card sx={{ 
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Apply for a Loan
                  </Typography>
                  <Chip 
                    label="Fast Approval" 
                    color="success" 
                    size="small"
                    icon={<VerifiedUserIcon fontSize="small" />}
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Get instant access to funds with competitive rates starting at 1.2% monthly.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      border: '1px solid', 
                      borderColor: 'divider',
                      background: 'linear-gradient(135deg, rgba(63,81,181,0.03), rgba(33,150,243,0.03))',
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccountCircleIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Personal Loan
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Up to KES 200,000 • 1-12 months
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        p: '4px 8px',
                        borderRadius: '4px',
                        width: 'fit-content'
                      }}>
                        <EmojiEventsIcon sx={{ 
                          fontSize: '16px', 
                          color: 'success.main',
                          mr: 0.5
                        }} />
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
                          Most Popular
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="small"
                        onClick={() => navigate('/apply-loan')}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          mt: 1,
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Apply Now
                      </Button>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      border: '1px solid', 
                      borderColor: 'divider',
                      background: 'linear-gradient(135deg, rgba(255,152,0,0.03), rgba(255,87,34,0.03))',
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccountCircleIcon color="warning" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Emergency Loan
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Up to KES 50,000 • Instant approval
                      </Typography>
                      <Box sx={{ height: '24px' }} /> {/* Spacer for alignment */}
                      <Button
                        variant="contained"
                        color="warning"
                        fullWidth
                        size="small"
                        onClick={() => navigate('/apply-loan')}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          mt: 1,
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Quick Apply
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Loan Status */}
            {loanData && (
              <Card sx={{ 
                mb: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Current Loan Application
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Loan Amount
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        KES {parseInt(loanData.loanAmount).toLocaleString()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          bgcolor: loanData.status === 'Approved' ? 'success.main' : 
                                   loanData.status === 'Rejected' ? 'error.main' : 'warning.main',
                          mr: 1
                        }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {loanData.status}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Purpose
                      </Typography>
                      <Typography variant="body1">
                        {loanData.loanPurpose}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Repayment Period
                      </Typography>
                      <Typography variant="body1">
                        {loanData.repaymentPeriod} months
                      </Typography>
                    </Grid>
                    
                    {loanData.status === 'Approved' && (
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          sx={{ 
                            mt: 2,
                            borderRadius: '8px',
                            py: 1.5,
                            fontWeight: 600
                          }}
                          onClick={() => alert('Pay commitment fee to complete disbursement')}
                        >
                          Pay Commitment Fee (KES {loanData.processingFee.toLocaleString()})
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Disbursement within 24 hours after payment
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Profile Completion */}
            <Card sx={{ 
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Profile Completion
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Basic Information</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {userData.firstName ? '100%' : '60%'}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: '8px', bgcolor: 'divider', borderRadius: '4px' }}>
                    <Box sx={{ 
                      width: userData.firstName ? '100%' : '60%', 
                      height: '100%', 
                      background: primaryGradient, 
                      borderRadius: '4px' 
                    }} />
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">KYC Verification</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {kycData.kycCompleted ? '100%' : '30%'}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: '8px', bgcolor: 'divider', borderRadius: '4px' }}>
                    <Box sx={{ 
                      width: kycData.kycCompleted ? '100%' : '30%', 
                      height: '100%', 
                      background: kycData.kycCompleted ? successGradient : warningGradient, 
                      borderRadius: '4px' 
                    }} />
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  color={kycData.kycCompleted ? 'primary' : 'warning'}
                  fullWidth
                  onClick={() => navigate('/kyc')}
                  sx={{ 
                    borderRadius: '8px',
                    py: 1.5,
                    fontWeight: 600
                  }}
                >
                  {kycData.kycCompleted ? 'Update KYC' : 'Complete KYC'}
                </Button>
                {!kycData.kycCompleted && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Complete KYC to increase your loan limit
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card sx={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Actions
                </Typography>
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    mb: 1.5, 
                    justifyContent: 'flex-start',
                    py: 1.5,
                    borderRadius: '8px',
                    borderColor: 'divider',
                    color: 'text.primary',
                    fontWeight: 500
                  }}
                  startIcon={<HistoryIcon color="primary" />}
                >
                  Loan History
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    mb: 1.5, 
                    justifyContent: 'flex-start',
                    py: 1.5,
                    borderRadius: '8px',
                    borderColor: 'divider',
                    color: 'text.primary',
                    fontWeight: 500
                  }}
                  startIcon={<CheckCircleIcon color="success" />}
                >
                  Check Eligibility
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    justifyContent: 'flex-start',
                    py: 1.5,
                    borderRadius: '8px',
                    borderColor: 'divider',
                    color: 'text.primary',
                    fontWeight: 500
                  }}
                  startIcon={<HelpIcon color="info" />}
                >
                  Help Center
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;