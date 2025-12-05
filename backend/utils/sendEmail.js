import nodemailer from 'nodemailer';

/**
 * Send email using Nodemailer
 * Used for OTP and notifications
 */
const sendEmail = async (options) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email options
        const mailOptions = {
            from: `Job Portal <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully to:', options.email);
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        throw new Error('Email could not be sent');
    }
};

export default sendEmail;
