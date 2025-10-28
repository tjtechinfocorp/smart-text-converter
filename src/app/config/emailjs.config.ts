// EmailJS Configuration
// You need to set up EmailJS account and replace these values with your actual credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS public key (found in EmailJS dashboard)
  PUBLIC_KEY: '5LiVPcZsYKygH6gL5',

  // Your EmailJS service ID (found in EmailJS dashboard > Email Services)
  SERVICE_ID: 'service_aji1v7d',

  // Your EmailJS template ID (found in EmailJS dashboard > Email Templates)
  TEMPLATE_ID: 'template_qw753ne',

  // Recipient email address
  TO_EMAIL: 'tjtechinfocorp@gmail.com',
};

// EmailJS Setup Instructions:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template with the following variables:
//    - {{from_name}} - sender's name
//    - {{from_email}} - sender's email
//    - {{subject}} - email subject
//    - {{message}} - email message
//    - {{message_type}} - type of inquiry
//    - {{to_email}} - recipient email
// 4. Get your Public Key from Account > API Keys
// 5. Get your Service ID from Email Services
// 6. Get your Template ID from Email Templates
// 7. Replace the placeholder values above with your actual credentials
