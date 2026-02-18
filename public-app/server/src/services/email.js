import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!config.smtp.host || !config.smtp.user) return null;
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
  return transporter;
}

/**
 * Send email to admin when a shop installs the app.
 * @param {string} to - Admin email (e.g. shop email from Shopify)
 * @param {string} shopDomain - Installed shop domain
 */
export async function sendInstallNotification(to, shopDomain) {
  const transport = getTransporter();
  if (!transport) {
    console.warn('Email not configured (SMTP). Skip sending install notification.');
    return;
  }
  try {
    await transport.sendMail({
      from: config.smtp.from,
      to,
      subject: `App installed: ${shopDomain}`,
      text: `Your store ${shopDomain} has successfully installed the app. You can now use it from Shopify Admin.`,
      html: `<p>Your store <strong>${shopDomain}</strong> has successfully installed the app.</p><p>You can now use it from Shopify Admin.</p>`,
    });
    console.log(`Install notification sent to ${to} for ${shopDomain}`);
  } catch (err) {
    console.error('Failed to send install email:', err);
  }
}
