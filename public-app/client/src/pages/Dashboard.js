import React from 'react';
import { Page, Card, BlockStack, Text, Image } from '@shopify/polaris';
import banner from '../assets/banner.jpg';

function Dashboard() {
  return (
    <Page title="Dashboard" backAction={null}>
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="300">
            <Text as="p" variant="bodyMd" tone="subdued">
              Welcome to your loyalty dashboard.
            </Text>
            <Image
              source={banner}
              alt="Dashboard banner"
              loading="lazy"
            />
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

export default Dashboard;