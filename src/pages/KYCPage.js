import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, TextField, Button, Stepper, Step, StepLabel, 
  Paper, Alert, Card, Grid, MenuItem, Avatar,
  useTheme, useMediaQuery
} from '@mui/material';
import { 
  School as SchoolIcon, Work as WorkIcon, Home as HomeIcon,
  Person as PersonIcon, Phone as PhoneIcon, FamilyRestroom as FamilyRestroomIcon,
  ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Kenyan counties array
const kenyanCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", 
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado", 
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", 
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", 
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", 
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", 
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", 
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", 
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", 
  "Wajir", "West Pokot"
];

// Education levels
const educationLevels = [
  "Primary School",
  "Secondary School",
  "Certificate",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other"
];

function KYCPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [employmentType, setEmploymentType] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [county, setCounty] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [nextOfKinName, setNextOfKinName] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('');
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = ['Personal Details', 'Employment', 'Next of Kin'];

  useEffect(() => {
    // Load saved data if exists
    const savedData = JSON.parse(localStorage.getItem('kycData') || '{}');
    if (savedData.employmentType) setEmploymentType(savedData.employmentType);
    if (savedData.monthlyIncome) setMonthlyIncome(savedData.monthlyIncome);
    if (savedData.county) setCounty(savedData.county);
    if (savedData.educationLevel) setEducationLevel(savedData.educationLevel);
    if (savedData.nextOfKinName) setNextOfKinName(savedData.nextOfKinName);
    if (savedData.nextOfKinPhone) setNextOfKinPhone(savedData.nextOfKinPhone);
    if (savedData.nextOfKinRelationship) setNextOfKinRelationship(savedData.nextOfKinRelationship);
    
    // Mark completed steps
    const completed = [];
    if (savedData.educationLevel && savedData.county) completed.push(0);
    if (savedData.employmentType && savedData.monthlyIncome) completed.push(1);
    if (savedData.nextOfKinName && savedData.nextOfKinPhone && savedData.nextOfKinRelationship) completed.push(2);
    setCompletedSteps(completed);
  }, []);

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && (!educationLevel || !county)) {
      setError('Please fill all personal details');
      return;
    }
    if (activeStep === 1 && (!employmentType || !monthlyIncome)) {
      setError('Please fill all employment details');
      return;
    }
    if (activeStep === 2 && (!nextOfKinName || !nextOfKinPhone || !nextOfKinRelationship)) {
      setError('Please fill all next of kin details');
      return;
    }
    
    setError('');
    setCompletedSteps([...new Set([...completedSteps, activeStep])]);
    
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save KYC data to localStorage
    const kycData = {
      employmentType,
      monthlyIncome,
      county,
      educationLevel,
      nextOfKinName,
      nextOfKinPhone,
      nextOfKinRelationship,
      kycCompleted: true
    };
    
    localStorage.setItem('kycData', JSON.stringify(kycData));
    setIsSubmitting(false);
    setSuccess('KYC verification completed successfully!');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const handleStepClick = (step) => {
    if (completedSteps.includes(step)) {
      setActiveStep(step);
    }
  };

  return (
    <Container maxWidth="md" sx={{ 
      py: isMobile ? 2 : 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4f0ff 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        background: 'white',
        borderRadius: '16px',
        p: isMobile ? 2 : 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/dashboard')}
            sx={{ 
              mr: 2,
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          >
            Back
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>
            Complete Your Profile
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Help us serve you better by completing your profile. This information helps us personalize your loan experience.
        </Typography>
        
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root': {
              cursor: 'pointer',
            },
          }}
        >
          {steps.map((label, index) => (
            <Step 
              key={label} 
              completed={completedSteps.includes(index)}
              onClick={() => handleStepClick(index)}
            >
              <StepLabel 
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: activeStep === index ? 700 : 400,
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ 
            mb: 3,
            borderRadius: '8px',
            background: 'rgba(253, 237, 237, 0.9)'
          }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ 
            mb: 3,
            borderRadius: '8px',
            background: 'rgba(237, 247, 237, 0.9)'
          }}>
            {success}
          </Alert>
        )}
      </Box>
      
      <Paper elevation={0} sx={{ 
        p: isMobile ? 2 : 4,
        borderRadius: '16px',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        mb: 4
      }}>
        {activeStep === 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.light', 
                mr: 2,
                background: 'linear-gradient(45deg, #3f51b5, #2196f3)'
              }}>
                <PersonIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Personal Information
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Education Level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                >
                  {educationLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="County of Residence"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: <HomeIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                >
                  {kenyanCounties.map((county) => (
                    <MenuItem key={county} value={county}>{county}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ 
                  p: 2, 
                  borderRadius: '12px',
                  background: 'rgba(63, 81, 181, 0.05)',
                  borderColor: 'rgba(63, 81, 181, 0.3)'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    <CheckCircleIcon color="primary" sx={{ 
                      fontSize: '1rem', 
                      mr: 1, 
                      verticalAlign: 'middle' 
                    }} />
                    Your information is secure and will only be used to improve your experience.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.light', 
                mr: 2,
                background: 'linear-gradient(45deg, #ff9800, #ffc107)'
              }}>
                <WorkIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Employment Information
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Employment Type"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: <WorkIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select employment type</em></MenuItem>
                  <MenuItem value="employed">Employed</MenuItem>
                  <MenuItem value="self-employed">Self Employed</MenuItem>
                  <MenuItem value="unemployed">Unemployed</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="casual-worker">Casual Worker</MenuItem>
                  <MenuItem value="business-owner">Business Owner</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Income (KES)"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body1" sx={{ mr: 1 }}>KES</Typography>
                    ),
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ 
                  p: 2, 
                  borderRadius: '12px',
                  background: 'rgba(255, 152, 0, 0.05)',
                  borderColor: 'rgba(255, 152, 0, 0.3)'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    <CheckCircleIcon color="warning" sx={{ 
                      fontSize: '1rem', 
                      mr: 1, 
                      verticalAlign: 'middle' 
                    }} />
                    Your income information helps us determine the best loan offers for you.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.light', 
                mr: 2,
                background: 'linear-gradient(45deg, #4caf50, #8bc34a)'
              }}>
                <FamilyRestroomIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Next of Kin Information
              </Typography>
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please provide details of someone we can contact in case we can't reach you.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Relationship"
                  value={nextOfKinRelationship}
                  onChange={(e) => setNextOfKinRelationship(e.target.value)}
                  margin="normal"
                  InputProps={{
                    sx: {
                      borderRadius: '12px',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select relationship</em></MenuItem>
                  <MenuItem value="spouse">Spouse</MenuItem>
                  <MenuItem value="parent">Parent</MenuItem>
                  <MenuItem value="sibling">Sibling</MenuItem>
                  <MenuItem value="child">Child</MenuItem>
                  <MenuItem value="friend">Friend</MenuItem>
                  <MenuItem value="colleague">Colleague</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ 
                  p: 2, 
                  borderRadius: '12px',
                  background: 'rgba(76, 175, 80, 0.05)',
                  borderColor: 'rgba(76, 175, 80, 0.3)'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    <CheckCircleIcon color="success" sx={{ 
                      fontSize: '1rem', 
                      mr: 1, 
                      verticalAlign: 'middle' 
                    }} />
                    We will only contact your next of kin if we're unable to reach you directly.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        background: 'white',
        borderRadius: '16px',
        p: isMobile ? 2 : 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            borderRadius: '12px', 
            px: 3,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
          disabled={isSubmitting}
          sx={{ 
            borderRadius: '12px', 
            px: 4,
            textTransform: 'none',
            fontWeight: 500,
            background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #303f9f, #1976d2)',
            }
          }}
        >
          {isSubmitting ? 'Saving...' : activeStep === steps.length - 1 ? 'Complete Profile' : 'Continue'}
        </Button>
      </Box>
    </Container>
  );
}

export default KYCPage;