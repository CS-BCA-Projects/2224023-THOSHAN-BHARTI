require('dotenv').config();
const nodemailer = require('nodemailer');

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send an email
async function sendEmail(to, subject, text, html) {
    try {
        const info = await transporter.sendMail({
            from: `"Healing Music" <${process.env.EMAIL_USER}>`,
            to: to, // Use recipient email dynamically
            subject: subject,
            text: text,
            html: html
        });

        console.log("Email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(" Error sending email:", error);
        return { success: false, error: error.message };
    }
    try {
        await sendEmail(email, "Welcome!", "Thank you for signing up!", "<h2>Welcome!</h2>");
    } catch (emailError) {
        console.error("Email Error:", emailError);
    }
    
}

module.exports = sendEmail;
