import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import en from '@shopify/polaris/locales/en.json';
import Login from './pages/Login';
// import Layout from './Layout/index.js';
import Layout from './components/Layout.jsx';
import AddPermission from './pages/AddPermission.js';
import CustomerRedeemManagement from './pages/CustomerRedeemManagement.js';
import PinList from './pages/PinList.js';
import RuleSet from './pages/RuleSet.js';
import Membershipmanagement from './pages/Membershipmanagement.js';
import AddProduct from './pages/AddProduct.js';
import CategoryList from './pages/CategoryList.js';
import TagList from './pages/TagList.js';
import GenerateCoupons from './pages/GenerateCoupons.js';
import CouponsList from './pages/CouponsList.js';
import TransactionManagement from './pages/TransactionManagement.js';
import RewardPointExpiryList from './pages/RewardPointExpiryList.js';
import Customer from './pages/Customer.js';
import PendingRequestList from './pages/PendingRequestList.js';
import RejectList from './pages/RejectList.js';
import ApproveList from './pages/ApproveList.js';
import ZillionList from './pages/ZillionList.js';
import ProductRedeemList from './pages/ProductRedeemList.js';
import OrderShipment from './pages/OrderShipment.js';
import Campaign from './pages/Campaign.js';
import CampaignList from './pages/CampaignList.js';
import CustomerManagement from './pages/CustomerManagement.js';
import CustomerListInfo from './pages/CustomerListInfo.js';
import Transaction from './pages/RuleSet/Transaction.js';
import PayWithRewards from './pages/RuleSet/PayWithRewards.js';
import Notification from './pages/Notification.js';
import Shopify from './pages/Shopify.js';
import UsedCouponList from './pages/UsedCouponList.js';
import ExpiredCoupon from './pages/ExpiredCoupon.js';
import UpdateProduct from './pages/UpdateProduct.js';
import OrderTracking from './pages/OrderTracking.js';
import { HeaderProvider } from './reusable/HeaderContext.js';
import CouponBatch from './pages/CouponBatch.js';
import Dashboard from './pages/Dashboard.js';
import MigratedCustomers from './pages/MigratedCustomers.js';

function App() {
  return (
    <AppProvider i18n={en}>
      <HeaderProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route path="/MigratedCustomers" element={<MigratedCustomers />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pin-list" element={<PinList />} />
              <Route path="/AddPermission" element={<AddPermission />} />
              <Route path="/customer-list" element={<CustomerManagement />} />
              <Route path="/seller-details/:id" element={<CustomerListInfo />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/category-list" element={<CategoryList />} />
              <Route path="/tag-list" element={<TagList />} />
              <Route path="/rule-set" element={<RuleSet />} />
              <Route path="/coupons-list" element={<CouponsList />} />
              <Route path="/transaction" element={<Transaction />} />
              <Route path="/PayWithRewards" element={<PayWithRewards />} />
              <Route path="/customer-redeem-management" element={<CustomerRedeemManagement />} />
              <Route path="/generate-coupons" element={<GenerateCoupons />} />
              <Route path="/membership-management" element={<Membershipmanagement />} />
              <Route path="/campaign" element={<Campaign />} />
              <Route path="/campaign/:id" element={<Campaign />} />
              <Route path="/campaign-List" element={<CampaignList />} />
              <Route path="/transaction-management" element={<TransactionManagement />} />
              <Route path="/reward-point-expiry-list" element={<RewardPointExpiryList />} />
              <Route path="/customer-reminder" element={<Customer />} />
              <Route path="/order-shipment/:orderId/:awb_id" element={<OrderTracking />} />
              <Route path="/pending-request-list" element={<PendingRequestList />} />
              <Route path="/reject-list" element={<RejectList />} />
              <Route path="/approve-list" element={<ApproveList />} />
              <Route path="/zillion-transaction" element={<ZillionList />} />
              <Route path="/product-redeem-list" element={<ProductRedeemList />} />
              <Route path="/order-shipment" element={<OrderShipment />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/shopify" element={<Shopify />} />
              <Route path="/used-coupon-list" element={<UsedCouponList />} />
              <Route path="/expired-coupon" element={<ExpiredCoupon />} />
              <Route path="/coupon-batch" element={<CouponBatch />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/shopify" element={<Shopify />} />
            </Route>
            <Route path="*" element={<Navigate to="/customer-list" replace />} />
          </Routes>
        </Router>
      </HeaderProvider>
    </AppProvider>
  );
}

export default App;
