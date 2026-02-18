import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import Button from '../reusable/Buttons';
import InputText from '../reusable/InputText';
import PasswordInput from '../reusable/PasswordInput';
import { apiCall } from "../api/Api";
import { useNavigate } from 'react-router-dom';
import adminLoginImage from "../assets/rajnigandha.png"
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';

const Login = () => {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // Loading state for the button
  const [keepMeLoggedIn, setKeepMeLoggedIn] = React.useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === "email" ? value.toLowerCase() : value // Convert to lowercase for the email field
    });
  };


  const validateForm = () => {
    const errors = {};

    if (!formValues.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Email format is invalid';
    }

    if (!formValues.password) {
      errors.password = 'Password is required';
    } else if (formValues.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (validateForm()) {
      setLoading(true); // Show loader
      try {
        const response = await apiCall("/auth/login", "post", formValues);
        if (response.status === 201) {
          localStorage.setItem("token", response?.data);
          showPopup("success", "Login Successful");
          let data = {};
          try {
            if (response?.data && typeof response.data === "string") {
              const payload = response.data.split(".")[1];
              if (payload) data = JSON.parse(atob(payload));
            }
          } catch (_) {}
          localStorage.setItem("Values", data?.website || "rajnigandha");
          localStorage.setItem("hastoken", true)
          window.location.reload();

          setTimeout(() => {
                navigate('/dashboard');
              }, 1500);
          

          if (keepMeLoggedIn) {
            localStorage.setItem("token", response?.data);
          } else {
            sessionStorage.setItem("token", response?.data);
          }

        }
      } catch (error) {
        showPopup("error", error?.response?.data?.message?.errors || error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      <Paper elevation={3} style={{ maxWidth: '800px', borderRadius: '12px' }}>
        <Grid container>
          {/* Left Side - Logo and Background */}
          <Grid item xs={12} md={6} style={{ backgroundColor: '#007dbd', padding: '20px', borderRadius: '12px 0 0 12px' }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{ height: '100%', background: `url(/path-to-your-background-image.png)`, backgroundSize: 'cover' }}
            >
              <img src={adminLoginImage} alt="Rajnigandha Logo" style={{ maxWidth: '80%', maxHeight: '250px' }} />
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6} style={{ padding: '40px' }}>
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <InputText
                label="Email"
                placeholder="Enter email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                fullWidth
                required
              />


              <PasswordInput
                label="Password"
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                fullWidth
                required
                margin="normal"
              />
 
              <label>
                <input
                  type="checkbox"
                  checked={keepMeLoggedIn}
                  onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
                />
                &nbsp;Keep Me Logged In
              </label>
               <div className='mt-2'>
              <Button
                fullWidth
                type="submit"
                color="success"
                label={loading ? 'Loading...' : 'Login'}
                variant="contained"
                disabled={loading} // Disable button when loading
                style={{ marginTop: '20px' }}
              />
              </div>
            </Box>
            <Toast />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Login;
