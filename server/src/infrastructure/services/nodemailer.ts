import nodemailer from 'nodemailer';
import { config } from '../../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.pass_email,
    pass: config.pass_key,
  },
});

export const SendOtpMail = async (to: string, otp: number) => {
  // Format OTP for display
  const formattedOTP = String(otp).split('').join(' ');
  
  const mailOptions = {
    from: `"GreenBasket" <${config.pass_email}>`,
    to,
    subject: 'Your Verification Code | GreenBasket',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Poppins', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            -webkit-font-smoothing: antialiased;
          }
          
          .email-wrapper {
            background-color: #f4f4f4;
            padding: 30px 0;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
          }
          
          .email-header {
            padding: 25px 0;
            text-align: center;
            background-color: #ffffff;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #00783E;
            display: block;
            margin: 0 auto;
          }
          
          .logo span {
            color: #FF8A00;
          }
          
          .header-image {
            width: 100%;
            height: 180px;
            background-image: url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000');
            background-size: cover;
            background-position: center;
            position: relative;
          }
          
          .header-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5));
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .header-text {
            color: white;
            font-size: 28px;
            font-weight: 600;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }
          
          .email-body {
            padding: 35px 30px;
          }
          
          .greeting {
            font-size: 22px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 15px;
          }
          
          .message {
            color: #555555;
            font-size: 16px;
            margin-bottom: 25px;
            font-weight: 300;
          }
          
          .highlight {
            font-weight: 500;
            color: #00783E;
          }
          
          .otp-container {
            background-color: #F8FBFA;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
            border: 1px solid #E3F1EB;
          }
          
          .otp-title {
            font-size: 14px;
            color: #00783E;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .otp-code {
            font-size: 40px;
            letter-spacing: 5px;
            color: #00783E;
            font-weight: 700;
            margin: 5px 0 15px;
            font-family: 'Courier New', monospace;
          }
          
          .otp-divider {
            width: 50px;
            height: 5px;
            background-color: #00783E;
            margin: 0 auto 15px;
            border-radius: 5px;
            opacity: 0.3;
          }
          
          .expiry-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #FFF9ED;
            padding: 12px 15px;
            border-radius: 10px;
            margin-top: 20px;
            border-left: 4px solid #FF8A00;
          }
          
          .expiry-icon {
            margin-right: 10px;
            font-size: 18px;
            color: #FF8A00;
          }
          
          .expiry-text {
            color: #D97706;
            font-size: 14px;
            font-weight: 500;
          }
          
          .info-section {
            background-color: #F8FBFA;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
          }
          
          .info-title {
            font-size: 16px;
            font-weight: 600;
            color: #00783E;
            margin-bottom: 10px;
          }
          
          .info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          
          .info-icon {
            color: #00783E;
            font-size: 18px;
            margin-right: 10px;
            min-width: 24px;
            text-align: center;
          }
          
          .info-text {
            font-size: 14px;
            color: #555555;
          }
          
          .help-text {
            font-size: 14px;
            color: #777777;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #EEEEEE;
          }
          
          .email-footer {
            background-color: #F8FBFA;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #E3F1EB;
          }
          
          .social-links {
            margin-bottom: 15px;
          }
          
          .social-icon {
            display: inline-block;
            margin: 0 10px;
            width: 32px;
            height: 32px;
            background-color: #00783E;
            border-radius: 50%;
            color: white;
            text-align: center;
            line-height: 32px;
            font-size: 16px;
          }
          
          .footer-links {
            margin: 15px 0;
          }
          
          .footer-link {
            color: #00783E;
            text-decoration: none;
            margin: 0 10px;
            font-size: 13px;
          }
          
          .copyright {
            color: #999999;
            font-size: 12px;
            margin-top: 10px;
          }
          
          .app-badges {
            margin-top: 20px;
          }
          
          .app-badge {
            display: inline-block;
            background-color: #333333;
            color: white;
            border-radius: 5px;
            padding: 8px 12px;
            margin: 0 5px;
            font-size: 12px;
            text-decoration: none;
          }
          
          .apple {
            background-color: #000000;
          }
          
          .android {
            background-color: #689F38;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="email-header">
              <div class="logo">Green<span>Basket</span></div>
            </div>
            
            <div class="header-image">
              <div class="header-overlay">
                <div class="header-text">Verify Your Account</div>
              </div>
            </div>
            
            <div class="email-body">
              <h2 class="greeting">Welcome to GreenBasket</h2>
              
              <p class="message">
                Thank you for choosing <span class="highlight">GreenBasket</span> for your premium vegetable delivery. Please verify your account to access <span class="highlight">farm-fresh produce</span>, exclusive deals, and convenient delivery options.
              </p>
              
              <div class="otp-container">
                <div class="otp-title">Your Verification Code</div>
                <div class="otp-divider"></div>
                <div class="otp-code">${formattedOTP}</div>
                
                <div class="expiry-notice">
                  <span class="expiry-icon">⏱️</span>
                  <span class="expiry-text">This code will expire in 5 minutes</span>
                </div>
              </div>
              
              <div class="info-section">
                <h3 class="info-title">What's next?</h3>
                
                <div class="info-item">
                  <div class="info-icon">✓</div>
                  <div class="info-text">Complete your profile and delivery preferences</div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">✓</div>
                  <div class="info-text">Browse our selection of seasonal and organic produce</div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">✓</div>
                  <div class="info-text">Schedule your first delivery with flexible time slots</div>
                </div>
              </div>
              
              <p class="help-text">
                If you didn't request this verification code, please ignore this email or contact our customer support team.
              </p>
            </div>
            
            <div class="email-footer">
              <div class="social-links">
                <a href="#" class="social-icon">f</a>
                <a href="#" class="social-icon">t</a>
                <a href="#" class="social-icon">in</a>
                <a href="#" class="social-icon">ig</a>
              </div>
              
              <div class="footer-links">
                <a href="#" class="footer-link">Help Center</a>
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Terms of Service</a>
              </div>
              
              <div class="app-badges">
                <a href="#" class="app-badge apple">App Store</a>
                <a href="#" class="app-badge android">Google Play</a>
              </div>
              
              <p class="copyright">
                &copy; ${new Date().getFullYear()} GreenBasket. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};