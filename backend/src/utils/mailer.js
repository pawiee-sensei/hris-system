const nodemailer = require("nodemailer");

const sendResetEmail = async (toEmail, resetToken) => {
    // Create a fake Ethereal test account on the fly.
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    const info = await transporter.sendMail({
        from: '"HRIS Support" <no-reply@hris.com>',
        to: toEmail,
        subject: "Password Reset Request",
        html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    });

    // This link shows you the "sent" email in your browser.
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

module.exports = sendResetEmail;