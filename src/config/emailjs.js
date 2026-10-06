// ============================================================
// EmailJS configuration for the "Forgot Password" real email send.
//
// SESA is a front-end-only app (no backend server), so the standard
// way to send a REAL email straight from the browser is EmailJS -
// a free service that connects to your own Gmail/Outlook account.
//
// TO MAKE FORGOT PASSWORD ACTUALLY SEND EMAILS (takes ~5 minutes):
//   1. Create a free account at https://www.emailjs.com
//   2. Email Services -> Add New Service -> connect your Gmail/Outlook.
//      Copy the "Service ID" it gives you.
//   3. Email Templates -> Create New Template. Use these variable
//      names in the template body: {{to_email}} and {{reset_link}}.
//      Copy the "Template ID".
//   4. Account -> General -> copy your "Public Key".
//   5. Paste all three values below.
//
// Until you do this, the values below are placeholders and
// ForgotPassword.jsx will show a clear "email isn't configured yet"
// message instead of silently pretending an email was sent.
// ============================================================

export const EMAILJS_SERVICE_ID = 'service_x2dnn7o';
export const EMAILJS_TEMPLATE_ID = 'template_t2ki8pa';
export const EMAILJS_PUBLIC_KEY = 'o33eFobJw_rW8YIx1';

export const isEmailJsConfigured =
  EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
  EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
