import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Paper, Alert,
  Card, Grid, Avatar, Divider, Chip, Radio,
  RadioGroup, FormControlLabel, FormControl, FormLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  InputAdornment, Tooltip, Snackbar, useMediaQuery, useTheme
} from '@mui/material';
import {
  Person as PersonIcon, Phone as PhoneIcon,
  //CreditCard as CreditCardIcon,
   ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon, ContentCopy as ContentCopyIcon,
  Payment as PaymentIcon, Verified as VerifiedIcon,
  Star as StarIcon, StarHalf as StarHalfIcon, StarBorder as StarBorderIcon,
  Savings as SavingsIcon, TrendingUp as TrendingUpIcon,
  RocketLaunch as RocketLaunchIcon, Lock as LockIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
//import MuiAlert from '@mui/material/Alert';

// Sample testimonials
const testimonials = [
  {
    name: "James M.",
    location: "Nairobi",
    amount: "25,000",
    rating: 5,
    comment: "Quick process and low savings requirement. Got my loan in minutes!"
  },
  {
    name: "Sarah W.",
    location: "Mombasa",
    amount: "50,000",
    rating: 4,
    comment: "The savings plan actually helped me build better financial habits."
  },
  {
    name: "Peter K.",
    location: "Kisumu",
    amount: "15,000",
    rating: 5,
    comment: "Best loan app I've used. Verification was instant after payment."
  },
  {
    name: "Grace N.",
    location: "Nakuru",
    amount: "30,000",
    rating: 4,
    comment: "App is very mobile-friendly. Completed everything on my phone."
  },
];

// Loan amounts with base savings percentages (will be randomized slightly)
const loanOptions = [
  { amount: 5000, baseSavingsPercent: 2.5 },
  { amount: 10000, baseSavingsPercent: 2.5 },
  { amount: 15000, baseSavingsPercent: 2.5 },
  { amount: 20000, baseSavingsPercent: 2.0 },
  { amount: 25000, baseSavingsPercent: 2.0, popular: true }, // Added 'Most Popular' tag
  { amount: 30000, baseSavingsPercent: 2.0 },
  { amount: 40000, baseSavingsPercent: 1.8 },
  { amount: 50000, baseSavingsPercent: 1.8 },
  { amount: 75000, baseSavingsPercent: 1.5 },
  { amount: 100000, baseSavingsPercent: 1.5 },
  { amount: 150000, baseSavingsPercent: 1.2 },
  { amount: 200000, baseSavingsPercent: 1.0 }
];

const interestRates = {
  '1': 15,
  '3': 12,
  '6': 10,
  '12': 8
};

const TILL_NUMBER = "5297501"; // Example till number

function LoanApplication() {
  const [activeStep, setActiveStep] = useState(0);
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
 // const [guarantorId, setGuarantorId] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [repaymentPeriod, setRepaymentPeriod] = useState('3');
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [savingsPlan, setSavingsPlan] = useState({});
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Enhanced Mobile Responsiveness

  const steps = ['Guarantor Details', 'Select Loan', 'Verify Payment'];

  // Personalized Welcome Message (assuming user name is available from context/auth)
  const userName = "Customer"; // Replace with actual user name if available (e.g., from user context)

  // Generate random savings amounts (but consistent for the same loan amount in a session)
  useEffect(() => {
    const savedSavingsPlan = sessionStorage.getItem('savingsPlan');
    if (savedSavingsPlan) {
      setSavingsPlan(JSON.parse(savedSavingsPlan));
    }
  }, []);

  // When loan amount changes, calculate or retrieve savings amount
  useEffect(() => {
    if (loanAmount || customAmount) {
      const amount = parseInt(customAmount || loanAmount);

      // Check if we already have a savings plan for this amount
      if (savingsPlan[amount]) {
        setSavingsAmount(savingsPlan[amount]);
        return;
      }

      // Find base savings percentage
      const option = loanOptions.find(opt => amount >= opt.amount) ||
                     { baseSavingsPercent: 2.5 }; // Default if not found

      // Calculate random variation (between -0.5% and +0.5% of base)
      const variation = (Math.random() - 0.5) * 1;
      const finalPercent = Math.max(1, Math.min(option.baseSavingsPercent + variation, 3));

      const calculatedSavings = Math.max(
        100, // Minimum savings
        Math.floor(amount * finalPercent / 100)
      );

      // Save this amount for the session
      const newSavingsPlan = { ...savingsPlan, [amount]: calculatedSavings };
      setSavingsPlan(newSavingsPlan);
      sessionStorage.setItem('savingsPlan', JSON.stringify(newSavingsPlan));
      setSavingsAmount(calculatedSavings);
    }
  }, [loanAmount, customAmount, savingsPlan]);

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && (!guarantorName || !guarantorPhone)) {
      setError('Please fill all guarantor details.');
      return;
    }
    if (activeStep === 1 && (!loanPurpose || (!loanAmount && !customAmount) || (customAmount && (parseInt(customAmount) < 5000 || parseInt(customAmount) > 200000)))) {
      setError('Please select a loan purpose and a valid loan amount (KES 5,000 - 200,000).');
      return;
    }

    setError('');
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
    if (!verificationSuccess) {
      setError('Please verify your payment first.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save loan application data
    const loanData = {
      loanPurpose,
      loanAmount: customAmount || loanAmount,
      repaymentPeriod,
      guarantorName,
      guarantorPhone,
     // guarantorId,
      savingsAmount,
      interestRate: interestRates[repaymentPeriod],
      status: 'Pending',
      applicationDate: new Date().toISOString()
    };

    localStorage.setItem('loanData', JSON.stringify(loanData));
    setIsSubmitting(false);
    navigate('/dashboard', { state: { success: 'Loan application submitted successfully!' } });
  };

  const handleAmountChange = (amount) => {
    setLoanAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const amount = e.target.value;
    setCustomAmount(amount);
    setLoanAmount('');
  };

  const calculateRepayment = () => {
    if (!loanAmount && !customAmount) return 0;
    const amount = parseInt(customAmount || loanAmount);
    const rate = interestRates[repaymentPeriod] / 100;
    const periods = parseInt(repaymentPeriod);
    return Math.floor(amount + (amount * rate * periods));
  };

  const calculateMonthlyPayment = () => {
    const total = calculateRepayment();
    if (!total) return 0;
    return Math.floor(total / parseInt(repaymentPeriod));
  };

  const verifyPayment = () => {
    // Simple verification - check if message contains the savings amount
    if (mpesaMessage.includes(savingsAmount.toString())) {
      setVerificationSuccess(true);
      setError('');
      setOpenPaymentDialog(false);
    } else {
      setError('Payment verification failed. Please ensure you paste the correct M-Pesa message containing amount KES ' + savingsAmount.toLocaleString() + '.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TILL_NUMBER);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIcon key={i} color="primary" fontSize="small" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalfIcon key={i} color="primary" fontSize="small" />);
      } else {
        stars.push(<StarBorderIcon key={i} color="primary" fontSize="small" />);
      }
    }
    return stars;
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}> {/* Adjusted padding for mobile */}
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: { xs: 2, md: 3 },
        flexDirection: isMobile ? 'column' : 'row', // Simplified header for mobile
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: isMobile ? 0 : 1, mb: isMobile ? 1 : 0 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700, flexGrow: 1 }}>
          Loan Application
        </Typography>
        {/* Personalized Welcome Message */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: isMobile ? 1 : 0 }}>
          Welcome, {userName}!
        </Typography>
      </Box>

      {/* Trust-Building: Testimonial Carousel */}
      {activeStep === 0 && (
        <Carousel
          autoPlay
          interval={5000}
          animation="slide" // Changed animation for a smoother feel
          indicators={false}
          navButtonsAlwaysInvisible={isMobile}
          sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} // Subtle shadow, rounded corners
        >
          {testimonials.map((testimonial, index) => (
            <Card key={index} sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'background.paper', border: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2, width: 48, height: 48 }}>
                  {testimonial.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                    {testimonial.name.split(' ')[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.location} • Loan: KES {testimonial.amount.toLocaleString()}
                  </Typography>
                </Box>
                {/* Trust-Building: Verification Badge */}
                <Chip
                  label="Verified"
                  icon={<VerifiedIcon />}
                  color="success"
                  size="small"
                  sx={{ ml: 'auto', borderRadius: '4px', bgcolor: 'success.light', color: 'success.dark', fontWeight: 600 }}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                {renderStars(testimonial.rating)}
              </Box>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                "{testimonial.comment}"
              </Typography>
            </Card>
          ))}
        </Carousel>
      )}

      {/* Improved User Engagement: Progress Indicators (Visual Feedback) */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: { xs: 3, md: 4 },
        position: 'relative',
        '&::before': { // Horizontal line for progress bar
          content: '""',
          position: 'absolute',
          top: '12px',
          left: '5%',
          right: '5%',
          height: '4px',
          backgroundColor: 'grey.300',
          borderRadius: '2px',
          zIndex: 0,
        },
        '&::after': { // Gradient progress bar fill
          content: '""',
          position: 'absolute',
          top: '12px',
          left: '5%',
          width: `${(activeStep / (steps.length - 1)) * 90}%`, // Dynamically set width
          height: '4px',
          background: 'linear-gradient(to right, #4CAF50, #2196F3)', // Vibrant gradient
          borderRadius: '2px',
          zIndex: 1,
          transition: 'width 0.3s ease-in-out',
        }
      }}>
        {steps.map((label, index) => (
          <Box key={label} sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 1,
            zIndex: 2, // Ensure steps are above the bar
          }}>
            <Box sx={{
              width: 30, // Increased size
              height: 30, // Increased size
              borderRadius: '50%',
              backgroundColor: activeStep >= index ? 'primary.main' : 'grey.300',
              color: activeStep >= index ? 'white' : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              fontWeight: 700, // Stronger font weight
              boxShadow: activeStep >= index ? '0 2px 8px rgba(0,0,0,0.2)' : 'none', // Subtle shadow
              transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            }}>
              {index + 1}
            </Box>
            <Typography
              variant="caption"
              sx={{
                textAlign: 'center',
                color: activeStep >= index ? 'primary.main' : 'text.secondary',
                fontWeight: activeStep >= index ? 600 : 400,
                fontSize: isMobile ? '0.65rem' : '0.75rem', // Adjusted for mobile
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* Main Content Area */}
      <Paper elevation={0} sx={{
        p: { xs: 2, md: 4 }, // Adjusted padding for mobile
        borderRadius: '16px', // More rounded corners
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', // Subtle shadow for depth
      }}>
        {activeStep === 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}> {/* Vibrant gradient */}
                <PersonIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}> {/* Stronger font weight */}
                Guarantor Information
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please provide details of one guarantor who meets our requirements to proceed with your application.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Guarantor Full Name"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  margin="normal"
                  size="medium" // Slightly larger size
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Guarantor Phone Number"
                  value={guarantorPhone}
                  onChange={(e) => setGuarantorPhone(e.target.value)}
                  margin="normal"
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Guarantor National ID Number"
                  value={guarantorId}
                  onChange={(e) => setGuarantorId(e.target.value)}
                  margin="normal"
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid> */}
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)' }}> {/* Vibrant gradient */}
                <PaymentIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Select Loan & Savings Plan
              </Typography>
            </Box>

            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ mb: 1.5, fontWeight: 600, fontSize: '0.95rem' }}>
                What do you need the loan for?
              </FormLabel>
              <RadioGroup
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
              >
                <Grid container spacing={1.5}>
                  {['Business', 'Emergency', 'Education', 'Health', 'Home Improvement', 'Other'].map((purpose) => (
                    <Grid item xs={6} sm={4} key={purpose}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: { xs: 1, sm: 1.5 },
                          borderRadius: '10px',
                          borderColor: loanPurpose === purpose.toLowerCase() ? 'primary.main' : 'grey.300',
                          boxShadow: loanPurpose === purpose.toLowerCase() ? '0 2px 8px rgba(33, 150, 243, 0.2)' : 'none',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: 'primary.light',
                          }
                        }}
                      >
                        <FormControlLabel
                          value={purpose.toLowerCase()}
                          control={<Radio size="small" />}
                          label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{purpose}</Typography>}
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }, width: '100%', m: 0 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
              Choose Your Desired Loan Amount (KES)
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {loanOptions.map((option) => (
                <Grid item xs={6} sm={4} md={3} key={option.amount}>
                  <Card
                    variant={loanAmount === option.amount.toString() ? 'elevation' : 'outlined'}
                    elevation={loanAmount === option.amount.toString() ? 4 : 0}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: '10px',
                      borderColor: loanAmount === option.amount.toString() ? 'primary.main' : 'divider',
                      backgroundColor: loanAmount === option.amount.toString() ? 'primary.lightest' : 'background.paper',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      position: 'relative', // For "Most Popular" chip
                      '&:hover': {
                        borderColor: 'primary.light',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }
                    }}
                    onClick={() => handleAmountChange(option.amount.toString())}
                  >
                    {option.popular && ( // Trust-Building: "Most Popular" tag
                      <Chip
                        label="Most Popular"
                        color="success"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          backgroundColor: 'success.main',
                          color: 'white',
                          fontWeight: 700,
                          borderRadius: '6px',
                          px: 1,
                          py: 0.5,
                          height: 'auto',
                          fontSize: '0.65rem'
                        }}
                      />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      KES {option.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Savings: KES {savingsPlan[option.amount] ? savingsPlan[option.amount].toLocaleString() : '...'}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2, fontWeight: 500 }}>
              OR
            </Typography>

            <TextField
              fullWidth
              label="Enter Custom Amount (KES 5,000 - 200,000)"
              type="number"
              value={customAmount}
              onChange={handleCustomAmountChange}
              margin="normal"
              size="medium"
              variant="outlined"
              inputProps={{ min: 5000, max: 200000 }}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
              Select Repayment Period
            </Typography>

            <RadioGroup
              row
              value={repaymentPeriod}
              onChange={(e) => setRepaymentPeriod(e.target.value)}
              sx={{ justifyContent: 'space-around', mb: 3 }}
            >
              {Object.keys(interestRates).map((period) => (
                <Tooltip key={period} title={`${interestRates[period]}% total interest`}>
                  <FormControlLabel
                    value={period}
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0.5 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{period} mo</Typography>
                        <Typography variant="caption" color="text.secondary">{interestRates[period]}%</Typography>
                      </Box>
                    }
                    sx={{
                      mx: 0,
                      p: 1,
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: repaymentPeriod === period ? 'primary.main' : 'transparent',
                      backgroundColor: repaymentPeriod === period ? 'primary.lightest' : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      }
                    }}
                  />
                </Tooltip>
              ))}
            </RadioGroup>

            {(loanAmount || customAmount) && (
              <Card variant="outlined" sx={{
                p: { xs: 2, md: 3 },
                borderRadius: '12px',
                mb: 2,
                // Modern Visual Design: Vibrant color gradients
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', // Soft blue gradient
                borderColor: 'primary.light',
                boxShadow: '0 6px 15px rgba(33,150,243,0.1)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.dark' }}>
                  YOUR SMART SAVINGS PLAN
                </Typography>

                <Box sx={{
                  backgroundColor: 'white',
                  p: { xs: 2, md: 2.5 },
                  borderRadius: '8px',
                  mb: 2.5,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  textAlign: 'center'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    To access your loan of:
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
                    KES {(customAmount || loanAmount).toLocaleString()}
                  </Typography>

                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    You need to make a one-time saving of:
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'success.dark', mb: 1.5 }}>
                    KES {savingsAmount.toLocaleString()}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                  This savings empowers your financial journey and will be fully available for withdrawal after your first successful repayment.
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Why this savings plan benefits you:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 0, '& li': { mb: 1, fontSize: '0.9rem', color: 'text.secondary' } }}>
                  <li><RocketLaunchIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: 'info.main' }} /><strong>Accelerated Loan Approval:</strong> Demonstrates your commitment and helps in faster processing.</li>
                  <li><TrendingUpIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: 'warning.main' }} /><strong>Build Strong Credit:</strong> Establishes a positive repayment habit for future, larger loans.</li>
                  <li><SavingsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: 'success.main' }} /><strong>Financial Empowerment:</strong> Your savings grow and are accessible, fostering better financial habits.</li>
                  <li><LockIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: 'error.main' }} /><strong>Security & Trust:</strong> A transparent way to ensure responsible lending and borrowing.</li>
                </Box>
              </Card>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{
                bgcolor: verificationSuccess ? 'success.main' : 'primary.main',
                background: verificationSuccess ? 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)' : 'linear-gradient(45deg, #FFC107 30%, #FFEB3B 90%)', // Yellow gradient for pending
                mr: 2
              }}>
                {verificationSuccess ? <VerifiedIcon sx={{ color: 'white' }} /> : <PaymentIcon sx={{ color: 'white' }} />}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {verificationSuccess ? 'Payment Confirmed! Your Loan is Ready.' : 'Complete Your Savings Payment'}
              </Typography>
            </Box>

            {!verificationSuccess ? (
              <>
                <Card variant="outlined" sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: '12px',
                  mb: 2,
                  borderColor: 'warning.main', // Color-coded status indicator
                  background: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)', // Soft yellow gradient
                  boxShadow: '0 6px 15px rgba(255,193,7,0.1)'
                }}>
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: 'warning.dark'
                  }}>
                    ACTION REQUIRED: MAKE YOUR SAVINGS PAYMENT
                  </Typography>

                  <Box sx={{
                    backgroundColor: 'white',
                    p: { xs: 2, md: 2.5 },
                    borderRadius: '8px',
                    mb: 2.5,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Please pay your one-time savings of:
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.dark', mb: 2 }}>
                      KES {savingsAmount.toLocaleString()}
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Via M-Pesa to our Till Number:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1.5,
                      borderRadius: '4px',
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.lightest',
                      mb: 2
                    }}>
                      <Typography variant="h5" sx={{
                        fontFamily: 'monospace',
                        letterSpacing: 1.5,
                        fontWeight: 800,
                        color: 'primary.dark'
                      }}>
                        {TILL_NUMBER}
                      </Typography>
                      <IconButton
                        onClick={copyToClipboard}
                        size="small"
                        sx={{ ml: 1, color: 'primary.main' }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <Snackbar
                        open={copySuccess}
                        autoHideDuration={2000}
                        onClose={() => setCopySuccess(false)}
                        message="Till Number copied!"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      />
                    </Box>

                     <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                       Account Name:
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 800, color: 'success.dark', mb: 1 }}>
                      CHEPWISE TECHNOLOGIES
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      Follow these simple steps on your phone:
                    </Typography>
                    <Box component="ol" sx={{
                      pl: 2,
                      mb: 0,
                      '& li': {
                        mb: 1,
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                        '& strong': {
                          color: 'primary.dark'
                        }
                      }
                    }}>
                      <li>Go to <strong>M-Pesa</strong> on your phone</li>
                      <li>Select <strong>Lipa na M-Pesa</strong> then <strong>Buy Goods & Services</strong></li>
                      <li>Enter the Till Number: <strong>{TILL_NUMBER}</strong></li>
                      <li>Enter Amount: <strong>KES {savingsAmount.toLocaleString()}</strong> (ensure exact amount)</li>
                      <li>Enter your <strong>M-Pesa PIN</strong> to complete the transaction</li>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setOpenPaymentDialog(true)}
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      borderRadius: '10px',
                      py: 1.8, // Larger button
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Vibrant gradient
                      boxShadow: '0 4px 10px rgba(33,150,243,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #19A9D2 90%)',
                        boxShadow: '0 6px 15px rgba(33,150,243,0.4)',
                      }
                    }}
                  >
                    I've Made Payment - Verify Now
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 1.5 }}>
                    Click above to confirm your transaction after payment.
                  </Typography>
                </Card>
              </>
            ) : (
              <Card variant="outlined" sx={{
                p: { xs: 2, md: 3 },
                borderRadius: '12px',
                mb: 2,
                borderColor: 'success.main', // Color-coded status indicator
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', // Soft green gradient
                boxShadow: '0 6px 15px rgba(76,175,80,0.1)'
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <VerifiedIcon color="success" sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 700,
                    color: 'success.dark',
                  }}>
                    PAYMENT VERIFIED! APPLICATION READY.
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  Fantastic! Your savings payment of <strong style={{ color: theme.palette.success.dark }}>KES {savingsAmount.toLocaleString()}</strong> has been successfully confirmed.
                </Typography>

                <Box sx={{
                  backgroundColor: 'white',
                  p: { xs: 2, md: 2.5 },
                  borderRadius: '8px',
                  mb: 2.5,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                  <Typography variant="subtitle1" sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.dark',
                    textAlign: 'center'
                  }}>
                    YOUR LOAN DETAILS
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Loan Amount Applied
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        KES {(customAmount || loanAmount).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Repayment Period
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {repaymentPeriod} months
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Monthly Installment
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        KES {calculateMonthlyPayment().toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Total Repayment
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        KES {calculateRepayment().toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* More descriptive status message */}
                <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                  Your loan application is now complete and will be processed within <strong>24 business hours</strong>. You'll receive an SMS confirmation once your funds are disbursed to your M-Pesa.
                </Typography>
              </Card>
            )}
          </Box>
        )}
      </Paper>

      {/* Navigation Buttons (Consistent Button Styles) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: '10px', px: { xs: 2, md: 3 }, py: { xs: 1, md: 1.2 } }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={isSubmitting || (activeStep === 2 && !verificationSuccess)}
          sx={{
            borderRadius: '10px',
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.2 },
            fontWeight: 600,
            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', // Green gradient for "Continue/Submit"
            boxShadow: '0 4px 10px rgba(76,175,80,0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
              boxShadow: '0 6px 15px rgba(76,175,80,0.4)',
            }
          }}
        >
          {isSubmitting ? 'Processing...' : activeStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
        </Button>
      </Box>

      {/* Payment Verification Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.dark', pb: 1.5 }}>Verify Your M-Pesa Payment</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            To instantly verify your payment of <strong style={{ color: theme.palette.success.dark }}>KES {savingsAmount.toLocaleString()}</strong>, please paste the full M-PESA confirmation message received from Safaricom below:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="E.g., 'Confirmed. KES 500.00 sent to JANE DOE 0712345678 for account A1B2C3D4E5 on 2023-01-01 10:30:00. New M-PESA balance is KES 1234. Transaction cost, KES 22.00.'"
            value={mpesaMessage}
            onChange={(e) => setMpesaMessage(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            <InfoOutlinedIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Please paste the *entire* message, including the transaction code and amount, for successful verification.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenPaymentDialog(false)} sx={{ borderRadius: '8px' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={verifyPayment}
            color="primary"
            disabled={mpesaMessage.length < 20} // Simple validation for message length
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #FFC107 30%, #FFEB3B 90%)', // Yellow gradient for verify
              color: 'primary.dark',
              boxShadow: '0 4px 10px rgba(255,193,7,0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFA000 30%, #FFD700 90%)',
                boxShadow: '0 6px 15px rgba(255,193,7,0.4)',
              }
            }}
          >
            Verify Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default LoanApplication;