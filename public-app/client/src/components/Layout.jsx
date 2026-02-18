import { Frame, Box } from '@shopify/polaris';
import { Outlet } from 'react-router-dom';

/**
 * Layout for Shopify embedded app.
 * s-app-nav + s-link are used so the sidebar appears in the Shopify Admin
 * when the app is embedded in the admin iframe.
 */
export default function Layout() {
  return (
    <Frame>
      <s-app-nav>
        <s-link href="/dashboard" rel="home">Home</s-link>
        <s-link href="/rule-set">Rule Set</s-link>
        <s-link href="/transaction">Customer Benefits</s-link>
        <s-link href="/PayWithRewards">Pay with Rewards</s-link>
        <s-link href="/customer-redeem-management">Customer Redeem</s-link>
        <s-link href="/transaction-management">Transaction Management</s-link>
        <s-link href="/customer-list">Customer List</s-link>
        <s-link href="/membership-management">Membership</s-link>
        <s-link href="/campaign">Campaign</s-link>
        <s-link href="/shopify">Shopify</s-link>
        <s-link href="/coupons-list">Coupons</s-link>
        <s-link href="/generate-coupons">Generate Coupons</s-link>
        <s-link href="/pin-list">Pin List</s-link>
        <s-link href="/notification">Notification</s-link>
      </s-app-nav>
      <Box padding="400" paddingBlockEnd="800">
        <Outlet />
      </Box>
    </Frame>
  );
}
