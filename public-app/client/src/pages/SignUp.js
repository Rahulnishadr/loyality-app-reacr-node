import React from 'react';
import Button from '../reusable/Buttons';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}
    >
      <Paper elevation={3} sx={{ maxWidth: '800px', borderRadius: '12px' }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          {/* Left Side - Logo and Background */}
          <Box
            sx={{
              backgroundColor: '#007dbd',
              padding: '20px',
              borderRadius: { xs: '12px 12px 0 0', md: '12px 0 0 12px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: { xs: 'auto', md: '100%' },
              backgroundImage: `url(/path-to-your-background-image.png)`,
              backgroundSize: 'cover',
            }}
          >
            <img
              src="/path-to-your-logo.png"
              alt="Rajnigandha Logo"
              style={{ maxWidth: '80%', maxHeight: '200px' }}
            />
          </Box>

          {/* Right Side - Login Form */}
          <Box sx={{ padding: '40px', flex: 1 }}>
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            <Box component="form">
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                type="email"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Keep me logged in"
              />
              <Button
                fullWidth
                type="button"
                color="success"
                label="Login"
                variant="contained"
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
