import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Box,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from 'emailjs-com';

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    qualification: '',
    mobileNumber: '',
    country: '',
    state: '',
    city: '',
    role: '',
    secretAnswer: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    mobileNumber: '',
    country: '',
    state: '',
    city: '',
    role: '',
  });

  const handleTogglePasswordVisibility = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      showPassword: !prevFormData.showPassword,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, dob, mobileNumber, country, state, city, role } = formData;
    const newErrors = {};

    if (firstName.trim() === '') {
      newErrors.firstName = 'First Name is required';
    }

    if (lastName.trim() === '') {
      newErrors.lastName = 'Last Name is required';
    }

    if (email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (password.trim() === '') {
      newErrors.password = 'Password is required';
    }

    if (confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (dob.trim() === '') {
      newErrors.dob = 'Date of Birth is required';
    }

    if (mobileNumber.trim() === '') {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Mobile Number is invalid';
    }

    if (country.trim() === '') {
      newErrors.country = 'Country is required';
    }

    if (state.trim() === '') {
      newErrors.state = 'State is required';
    }

    if (city.trim() === '') {
      newErrors.city = 'City is required';
    }

    if (role.trim() === '') {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password and Confirm Password do not match');
      return;
    }
  
    try {
      const response = await fetch('https://localhost:7095/api/Auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Handle successful registration
        console.log('Data inserted into the database successfully');
        toast.success('Registration Successful');
        sendEmail(); // Send email after successful registration
      } else {
        // Handle registration error
        if (response.status === 400) {
          const errorText = await response.text();
          if (errorText.includes('Account already exists')) {
            toast.error('Account already exists');
          } else {
            toast.error('Error: ' + errorText);
          }
        } else {
          throw new Error('Error inserting data into the database');
        }
      }
    } catch (error) {
      console.error('Error occurred during registration:', error);
    }
  };
  

  const sendEmail = () => {
    const templateParams = {
      to_name: formData.firstName, // Use the user's first name as the recipient's name
      to_email: formData.email, // Use the user's email as the recipient's email address
      username: formData.email, // Use the user's email as the username
      password: formData.password, // Use the user's password
      status: 'Active', // Set the account status as active
    };
  
    emailjs.send('service_mrv60om', 'template_2ngfl3i', templateParams, 'NWVqgTqbhm7k38nrA')
      .then((response) => {
        console.log('Email sent successfully!', response.text);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };
  

  const handleResetForm = () => {
    setFormData({
      salutation: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dob: '',
      qualification: '',
      mobileNumber: '',
      country: '',
      state: '',
      city: '',
      role: '',
      secretAnswer: '',
      showPassword: false,
    });

    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dob: '',
      mobileNumber: '',
      country: '',
      state: '',
      city: '',
      role: '',
    });
  };

  const countryOptions = [
    { value: 'India', label: 'India' },
    { value: '', label: 'Select Country' },
    { value: 'USA', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
  ];

  const stateOptions = [
    { value: '', label: 'Select State' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
  ];

  const cityOptions = {
    'Andhra Pradesh': [
      { value: 'Visakhapatnam', label: 'Visakhapatnam' },
      { value: 'Vijayawada', label: 'Vijayawada' },
      { value: 'Guntur', label: 'Guntur' },
    ],
    'Arunachal Pradesh': [
      { value: 'Itanagar', label: 'Itanagar' },
      { value: 'Naharlagun', label: 'Naharlagun' },
      { value: 'Pasighat', label: 'Pasighat' },
    ],
    'Assam': [
      { value: 'Guwahati', label: 'Guwahati' },
      { value: 'Silchar', label: 'Silchar' },
      { value: 'Dibrugarh', label: 'Dibrugarh' },
    ],
    'Bihar': [
      { value: 'Patna', label: 'Patna' },
      { value: 'Gaya', label: 'Gaya' },
      { value: 'Muzaffarpur', label: 'Muzaffarpur' },
    ],
    'Chhattisgarh': [
      { value: 'Raipur', label: 'Raipur' },
      { value: 'Bhilai', label: 'Bhilai' },
      { value: 'Bilaspur', label: 'Bilaspur' },
    ],
    'Goa': [
      { value: 'Panaji', label: 'Panaji' },
      { value: 'Margao', label: 'Margao' },
      { value: 'Vasco da Gama', label: 'Vasco da Gama' },
    ],
    'Gujarat': [
      { value: 'Ahmedabad', label: 'Ahmedabad' },
      { value: 'Surat', label: 'Surat' },
      { value: 'Vadodara', label: 'Vadodara' },
    ],
    'Haryana': [
      { value: 'Chandigarh', label: 'Chandigarh' },
      { value: 'Faridabad', label: 'Faridabad' },
      { value: 'Gurgaon', label: 'Gurgaon' },
    ],
    'Himachal Pradesh': [
      { value: 'Shimla', label: 'Shimla' },
      { value: 'Manali', label: 'Manali' },
      { value: 'Dharamshala', label: 'Dharamshala' },
    ],
    'Jharkhand': [
      { value: 'Ranchi', label: 'Ranchi' },
      { value: 'Jamshedpur', label: 'Jamshedpur' },
      { value: 'Dhanbad', label: 'Dhanbad' },
    ],
    'Karnataka': [
      { value: 'Bengaluru', label: 'Bengaluru' },
      { value: 'Mysuru', label: 'Mysuru' },
      { value: 'Hubli', label: 'Hubli' },
    ],
    'Kerala': [
      { value: 'Thiruvananthapuram', label: 'Thiruvananthapuram' },
      { value: 'Kochi', label: 'Kochi' },
      { value: 'Kozhikode', label: 'Kozhikode' },
    ],
  };

  const salutationOptions = [
    { value: '', label: 'Select Salutation' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
  ];

  const handleClose = () => {
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
      <Card>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" component="h2" gutterBottom>
                Registration Form
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose} style={{ color: 'red' }}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <br />
          <form onSubmit={handleSubmit}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Salutation</InputLabel>
                <Select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleInputChange}
                  required
                >
                  {salutationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.salutation && <Typography color="error">{errors.salutation}</Typography>}
            </Grid>
            <br />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                {errors.firstName && <Typography color="error">{errors.firstName}</Typography>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                {errors.lastName && <Typography color="error">{errors.lastName}</Typography>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                {errors.email && <Typography color="error">{errors.email}</Typography>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <TextField
                    type={formData.showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                {errors.password && <Typography color="error">{errors.password}</Typography>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <TextField
                    type={formData.showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                {errors.confirmPassword && <Typography color="error">{errors.confirmPassword}</Typography>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {errors.dob && <Typography color="error">{errors.dob}</Typography>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Qualification</InputLabel>
                  <Select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Select Qualification</MenuItem>
                    <MenuItem value="High School">High School</MenuItem>
                    <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                    <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                    <MenuItem value="Doctorate">Doctorate</MenuItem>
                    <MenuItem value="MBBS">MBBS</MenuItem>
                    <MenuItem value="MD">MD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                {errors.mobileNumber && <Typography color="error">{errors.mobileNumber}</Typography>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Country</InputLabel>
                  <Select name="country" value={formData.country} onChange={handleInputChange}>
                    {countryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.country && <Typography color="error">{errors.country}</Typography>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select name="state" value={formData.state} onChange={handleInputChange}>
                    {stateOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.state && <Typography color="error">{errors.state}</Typography>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>City</InputLabel>
                  <Select name="city" value={formData.city} onChange={handleInputChange}>
                    {cityOptions[formData.state]?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.city && <Typography color="error">{errors.city}</Typography>}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select name="role" value={formData.role} onChange={handleInputChange}>
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="DOCTOR">DOCTOR</MenuItem>
                    <MenuItem value="PATIENT">PATIENT</MenuItem>
                  </Select>
                </FormControl>
                {errors.role && <Typography color="error">{errors.role}</Typography>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Magic Word"
                  id="magicword"
                  name="magicWord"
                  fullWidth
                  value={formData.magicWord}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <Button variant="contained" color="success" type="submit" style={{ marginRight: '20px' }}>
                    Register
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleResetForm} style={{ width: '110px', marginLeft: '20px' }}>
                    Reset
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover draggable pauseOnVisibilityChange />
    </Box>
  );
};

export default RegistrationForm;
