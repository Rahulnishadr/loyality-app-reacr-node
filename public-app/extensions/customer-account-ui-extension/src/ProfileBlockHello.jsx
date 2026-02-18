import '@shopify/ui-extensions/preact';
import { render } from 'preact';

export default async () => {
  render(<ProfileBlockHello />, document.body);
};

function ProfileBlockHello() {
  const i18n = shopify.i18n;
  return (
    <s-section heading={i18n.translate('loyaltyHeading')}>
      <s-stack direction="block" gap="base" paddingBlockStart="base">
        <s-grid gridTemplateColumns="1fr 1fr" gap="large">
          <s-stack direction="block" gap="small">
            <s-text color="subdued">{i18n.translate('customerNameLabel')}</s-text>
            <s-text type="strong">{i18n.translate('customerName')}</s-text>
          </s-stack>
          <s-stack direction="block" gap="small">
            <s-text color="subdued">{i18n.translate('totalPointsLabel')}</s-text>
            <s-text type="strong">{i18n.translate('totalPoints')}</s-text>
          </s-stack>
          <s-stack direction="block" gap="small">
            <s-text color="subdued">{i18n.translate('usedPointsLabel')}</s-text>
            <s-text type="strong">{i18n.translate('usedPoints')}</s-text>
          </s-stack>
          <s-stack direction="block" gap="small">
            <s-text color="subdued">{i18n.translate('availablePointsLabel')}</s-text>
            <s-text type="strong">{i18n.translate('availablePoints')}</s-text>
          </s-stack>
        </s-grid>
      </s-stack>
    </s-section>
  );
}
