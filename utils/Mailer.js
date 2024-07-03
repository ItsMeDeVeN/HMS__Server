const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'letzspam1@gmail.com',
        pass: 'nbpi qmde mdtr uxiz'
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'letzspam1@gmail.com',
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendMail;