import React, { useState, useEffect, useContext } from 'react';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  BlockStack,
  InlineStack,
  Banner,
  Text,
} from '@shopify/polaris';
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';
import LoaderSpiner from '../reusable/LoaderSpiner';
import { HeaderContext } from '../reusable/HeaderContext';
import { apiCall } from '../api/Api';
import msg from '../reusable/msg.json';
import { HTTP_METHODS, HTTP_RESPONSE } from '../reusable/constants';

function Shopify() {
  const [showLoader, setShowLoader] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [apiVersion, setApiVersion] = useState('');
  const { selectedValue } = useContext(HeaderContext);
  const [validationError, setValidationError] = useState('');
  const [count, setCount] = useState(0);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccessData();
  }, [selectedValue]);

  const fetchAccessData = async () => {
    setShowLoader(true);
    try {
      const response = await apiCall(`/access/list?store=${selectedValue}`, HTTP_METHODS.GET);
      if (response.status === HTTP_RESPONSE.SUCCESS && Array.isArray(response.data) && response.data.length > 0) {
        const { id: resId, shopname, access_token, apiVersion: ver } = response?.data?.[0] || {};
        setId(resId);
        setSecretKey(shopname || '');
        setAccessToken(access_token || '');
        setApiVersion(ver || '');
        setCount(response?.data?.length);
        showPopup('success', msg.fetchedSuccessfully);
      } else {
        showPopup('success', response.message || msg.noDataFound);
      }
    } catch (error) {
      setId('');
      setSecretKey('');
      setAccessToken('');
      showPopup('error', error.message || msg.faildedToLoad);
    } finally {
      setShowLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.endsWith('.myshopify.com')) {
      setValidationError('Please enter a valid Shopify store name (e.g., mystore.myshopify.com)');
      return;
    }
    setValidationError('');
    const payload = { store: selectedValue, shopname: secretKey, access_token: accessToken, apiVersion };
    try {
      const response = await apiCall('/access/create', HTTP_METHODS.POST, payload);
      setLoading(true);
      if (response.status === HTTP_RESPONSE.CREATED) {
        const { id: resId, shopname, access_token, apiVersion: ver } = response.data;
        setId(resId);
        setSecretKey(shopname || '');
        setAccessToken(access_token || '');
        setApiVersion(ver || '');
        showPopup('success', response.message);
      } else {
        showPopup('error', response.message);
      }
    } catch (error) {
      showPopup('error', msg.failedToCreateAccess);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!id) {
      showPopup('warning', msg.notRecordFound);
      return;
    }
    setLoading(true);
    try {
      const response = await apiCall('/access/update', HTTP_METHODS.PUT, {
        id,
        store: selectedValue,
        apiVersion,
        access_token: accessToken,
        shopname: secretKey,
      });
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        showPopup('success', response.message);
      } else {
        showPopup('error', response.message);
      }
    } catch (error) {
      showPopup('error', msg.failedToUpdateAccess);
    } finally {
      setLoading(false);
    }
  };

  const data = {};
  const canSave = data?.role_permissions?.Redeem_History?.read;
  const disableUpdate = () => showPopup('warning', msg.readOnly);

  return (
    <>
      {(showLoader || loading) && <LoaderSpiner text="Loading ..." />}
      <Page title="Shopify Integration" narrowWidth>
        <BlockStack gap="400">
          {validationError && (
            <Banner tone="critical" onDismiss={() => setValidationError('')}>
              {validationError}
            </Banner>
          )}
          <Card>
            <BlockStack gap="400">
              <Text as="p" variant="bodyMd" tone="subdued">
                Connect your Shopify store by entering your store URL, access token, and API version.
              </Text>
              <form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    label="Shopify store name"
                    value={secretKey}
                    onChange={setSecretKey}
                    placeholder="mystore.myshopify.com"
                    type="text"
                    autoComplete="off"
                    helpText="Your store must end with .myshopify.com"
                    error={validationError}
                  />
                  <TextField
                    label="Access token"
                    value={accessToken}
                    onChange={setAccessToken}
                    placeholder="Enter your access token"
                    type="password"
                    autoComplete="off"
                  />
                  <TextField
                    label="API version"
                    value={apiVersion}
                    onChange={setApiVersion}
                    placeholder="e.g. 2024-01"
                    type="text"
                    autoComplete="off"
                  />
                  <InlineStack gap="300">
                    {canSave ? (
                      <Button
                        variant="primary"
                        onClick={count === 0 ? handleSubmit : handleUpdate}
                        loading={loading}
                      >
                        {count === 0 ? 'Create' : 'Update'}
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={disableUpdate}>
                        {count === 0 ? 'Create' : 'Update'}
                      </Button>
                    )}
                  </InlineStack>
                </FormLayout>
              </form>
            </BlockStack>
          </Card>
        </BlockStack>
      </Page>
      <Toast />
    </>
  );
}

export default Shopify;
