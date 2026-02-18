import React, { useState } from 'react';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  BlockStack,
  Checkbox,
  Text,
  InlineStack,
  Box,
} from '@shopify/polaris';
import { apiCall } from '../api/Api';
import { useNavigate } from 'react-router-dom';
import adminLoginImage from '../assets/rajnigandha.png';
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';

const Login = () => {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    const newValue = field === 'email' ? value.toLowerCase() : value;
    setFormValues((prev) => ({ ...prev, [field]: newValue }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formValues.email)) errors.email = 'Email format is invalid';
    if (!formValues.password) errors.password = 'Password is required';
    else if (formValues.password.length < 6) errors.password = 'Password must be at least 6 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await apiCall('/auth/login', 'post', formValues);
      if (response.status === 201) {
        localStorage.setItem('token', response?.data);
        showPopup('success', 'Login Successful');
        let data = {};
        try {
          if (response?.data && typeof response.data === 'string') {
            const payload = response.data.split('.')[1];
            if (payload) data = JSON.parse(atob(payload));
          }
        } catch (_) {}
        localStorage.setItem('Values', data?.website || 'rajnigandha');
        localStorage.setItem('hastoken', true);
        if (keepMeLoggedIn) localStorage.setItem('token', response?.data);
        else sessionStorage.setItem('token', response?.data);
        window.location.reload();
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      showPopup('error', error?.response?.data?.message?.errors || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Login" narrowWidth>
      <Box paddingBlockStart="800">
        <InlineStack align="center" blockAlign="center" gap="800">
          <div style={{ maxWidth: 320, flexShrink: 0 }}>
            <img src={adminLoginImage} alt="Logo" style={{ width: '100%', height: 'auto' }} />
          </div>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Sign in
              </Text>
              <form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    label="Email"
                    type="email"
                    value={formValues.email}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="Enter email"
                    autoComplete="email"
                    error={formErrors.email}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={formValues.password}
                    onChange={(value) => handleInputChange('password', value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    error={formErrors.password}
                  />
                  <Checkbox
                    label="Keep me logged in"
                    checked={keepMeLoggedIn}
                    onChange={setKeepMeLoggedIn}
                  />
                  <Button variant="primary" submit loading={loading} fullWidth>
                    {loading ? 'Loading...' : 'Login'}
                  </Button>
                </FormLayout>
              </form>
            </BlockStack>
          </Card>
        </InlineStack>
      </Box>
      <Toast />
    </Page>
  );
};

export default Login;
