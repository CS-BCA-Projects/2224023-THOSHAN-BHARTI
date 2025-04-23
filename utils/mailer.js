const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'thoshansbg2005@gmail.com',     // Your Gmail
//     pass: 'flxd qllm cmkg ifam'        // App password (not regular login)
//   }
// });
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
function sendOTP(to, otp) {
  return transporter.sendMail({
    from: '"Nature Vibes Support" <thoshansbg2005@gmail.com>',
    to,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It expires in 30 seconds.`,
  });
}




module.exports = { sendOTP };
