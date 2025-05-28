import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Paper, Typography, Tabs, Tab, TextField, Button, Alert, 
  Grid, Link, Divider, IconButton, InputAdornment, useMediaQuery, ThemeProvider, createTheme
} from '@mui/material';
import { 
  Phone as PhoneIcon, Lock as LockIcon, Person as PersonIcon, 
  Fingerprint as FingerprintIcon, Visibility, VisibilityOff,
  ArrowForward as ArrowForwardIcon, VerifiedUser, LocalAtm, Speed, Shield,
  Security, Payment, AccountBalance
} from '@mui/icons-material';
import KopaExtraLogo from '../assets/logo.png';

// Custom theme with modern tech/finance colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#6e45e2', // Purple
    },
    secondary: {
      main: '#88d3ce', // Teal
    },
    background: {
      default: 'linear-gradient(135deg,rgb(69, 179, 226) 0%, #89d4cf 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '-0.2px',
    },
  },
});

function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !pin) {
      setError('Please enter your phone number and PIN');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userPhone', phone);
    setIsLoading(false);
    navigate('/dashboard');
  };


  const handleSignup = async (e) => {
  e.preventDefault();
  if (!phone || !firstName || !lastName || !idNumber || !pin || !confirmPin) {
    setError('Please fill in all fields');
    return;
  }

  if (pin !== confirmPin) {
    setError('PINs do not match');
    return;
  }

  if (pin.length < 4) {
    setError('PIN must be at least 4 digits');
    return;
  }

  setIsLoading(true);
  
  try {
    // Save to local storage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userData', JSON.stringify({
      firstName,
      lastName,
      idNumber,
      phone,
    }));
    
    // Save to Vercel Postgres
    const response = await fetch('/api/save-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        idNumber,
        phone,
        pin, // Note: In a real app, you should hash the PIN before storing
        signupDate: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save user to database');
    }

    setSuccess('Account created successfully! Redirecting...');
    setTimeout(() => navigate('/kyc'), 2000);
  } catch (err) {
    console.error('Signup error:', err);
    setError('Failed to create account. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (!phone || !firstName || !lastName || !idNumber || !pin || !confirmPin) {
//       setError('Please fill in all fields');
//       return;
//     }

//     if (pin !== confirmPin) {
//       setError('PINs do not match');
//       return;
//     }

//     if (pin.length < 4) {
//       setError('PIN must be at least 4 digits');
//       return;
//     }

//     setIsLoading(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     localStorage.setItem('isAuthenticated', 'true');
//     localStorage.setItem('userPhone', phone);
//     localStorage.setItem('userData', JSON.stringify({
//       firstName,
//       lastName,
//       idNumber,
//       phone,
//     }));
    
//     setSuccess('Account created successfully! Redirecting...');
//     setIsLoading(false);
//     setTimeout(() => navigate('/kyc'), 2000);
//   };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSuccess('Password reset instructions sent to your phone');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        background: 'linear-gradient(135deg,rgb(28, 12, 73) 0%,rgb(4, 71, 67) 100%)',
        minHeight: '100vh',
        pt: isMobile ? 2 : 6,
        pb: 6,
        backgroundAttachment: 'fixed',
      }}>
        <Container maxWidth="sm">
          {/* Header with logo and gradient text */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            position: 'relative',
          }}>
            <Box sx={{
              display: 'inline-block',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: '-3px',
                background: 'linear-gradient(45deg, #6e45e2, #89d4cf)',
                borderRadius: '50%',
                zIndex: -1,
                animation: 'rotate 4s linear infinite',
              },
              '@keyframes rotate': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              }
            }}>
              <img 
                src={KopaExtraLogo} 
                alt="KopaExtra" 
                style={{ 
                  height: isMobile ? '50px' : '70px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  background: 'white',
                }} 
              />
            </Box>
            
            <Typography variant="h4" sx={{ 
              mt: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff, #d4d4d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              Instant Loans When You Need Them
            </Typography>
            
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 500,
              fontSize: isMobile ? '1rem' : '1.1rem',
              mt: 1,
              color: 'rgba(255,255,255,0.9)'
            }}>
              Get up to KES 200,000 in minutes
            </Typography>
            
            {/* Trust badges with glassmorphism effect */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mt: 3,
              '& .MuiBox-root': {
                display: 'flex',
                alignItems: 'center',
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '20px',
                px: 2,
                py: 1,
                backdropFilter: 'blur(8px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                }
              }
            }}>
              <Box><VerifiedUser sx={{ fontSize: '1rem', mr: 0.5 }} /> CBK Licensed</Box>
              <Box><Security sx={{ fontSize: '1rem', mr: 0.5 }} /> 256-bit Encryption</Box>
              <Box><Speed sx={{ fontSize: '1rem', mr: 0.5 }} /> Instant Approval</Box>
            </Box>
          </Box>
          
          {/* Benefits section with glassmorphism */}
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            p: 2,
            mb: 3,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Grid container spacing={2}>
              {[
                { icon: <LocalAtm sx={{ color: 'white' }} />, text: 'Low Rates' },
                { icon: <Payment sx={{ color: 'white' }} />, text: 'Flexible Terms' },
                { icon: <AccountBalance sx={{ color: 'white' }} />, text: 'No Collateral' },
                { icon: <Shield sx={{ color: 'white' }} />, text: 'Secure' }
              ].map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'white'
                  }}>
                    {item.icon}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Main auth card with animated border */}
          <Box sx={{
            position: 'relative',
            borderRadius: '16px',
            padding: '2px',
            background: 'linear-gradient(45deg, #6e45e2, #89d4cf)',
            backgroundSize: '200% 200%',
            animation: 'gradient 6s ease infinite',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            }
          }}>
            <Paper elevation={0} sx={{ 
              p: isMobile ? 2 : 3,
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)'
            }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: '3px',
                  }
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Register" />
                {/* <Tab label="Reset PIN" /> */}
              </Tabs>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
              
              <Box sx={{ mt: 3 }}>
                {error && (
                  <Alert severity="error" sx={{ 
                    mb: 2,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ 
                    mb: 2,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {success}
                  </Alert>
                )}
                
                {activeTab === 0 && (
                  <form onSubmit={handleLogin}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="e.g. 254712345678"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="PIN"
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPin(!showPin)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPin ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isLoading}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(110, 69, 226, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(110, 69, 226, 0.4)',
                        }
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Link 
                        href="#" 
                        onClick={() => setActiveTab(2)} 
                        sx={{ 
                          fontSize: '0.875rem',
                          color: 'primary.main',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'none',
                            color: 'primary.dark',
                          }
                        }}
                      >
                        Forgot your PIN?
                      </Link>
                    </Box>
                  </form>
                )}
                
                {activeTab === 1 && (
                  <form onSubmit={handleSignup}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: 'primary.main' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '& fieldset': {
                                borderColor: 'rgba(0,0,0,0.1)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'primary.main',
                              },
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: 'primary.main' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '& fieldset': {
                                borderColor: 'rgba(0,0,0,0.1)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'primary.main',
                              },
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                    
                    <TextField
                      fullWidth
                      label="National ID Number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FingerprintIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="e.g. 254712345678"
                      sx={{ 
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Create PIN (4 digits)"
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPin(!showPin)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPin ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Confirm PIN"
                      type={showConfirmPin ? 'text' : 'password'}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPin(!showConfirmPin)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showConfirmPin ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isLoading}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(110, 69, 226, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(110, 69, 226, 0.4)',
                        }
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      {isLoading ? 'Creating Account...' : 'Register Now'}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Link 
                          href="#" 
                          onClick={() => setActiveTab(0)} 
                          sx={{ 
                            color: 'primary.main',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'none',
                              color: 'primary.dark',
                            }
                          }}
                        >
                          Sign In
                        </Link>
                      </Typography>
                    </Box>
                  </form>
                )}
                
                {activeTab === 2 && (
                  <form onSubmit={handleForgotPassword}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="e.g. 254712345678"
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isLoading}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(110, 69, 226, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(110, 69, 226, 0.4)',
                        }
                      }}
                    >
                      {isLoading ? 'Sending...' : 'Reset PIN'}
                    </Button>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Remember your PIN?{' '}
                        <Link 
                          href="#" 
                          onClick={() => setActiveTab(0)} 
                          sx={{ 
                            color: 'primary.main',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'none',
                              color: 'primary.dark',
                            }
                          }}
                        >
                          Sign In
                        </Link>
                      </Typography>
                    </Box>
                  </form>
                )}
              </Box>
            </Paper>
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              By continuing, you agree to our{' '}
              <Link 
                href="#" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  }
                }}
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link 
                href="#" 
                underline="hover" 
                sx={{ 
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  }
                }}
              >
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AuthPage;