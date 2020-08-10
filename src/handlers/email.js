const nodemailer = require('nodemailer');
require('dotenv').config({ path: 'variables.env' });

exports.enviarEmail = async ( options ) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    await transporter.sendMail({
        from: 'Movieapp <no-reply@uptask.com>',
        to: options.user.email,
        subject: options.subject,
        text: options.text,
        html:  `<h1>Reset password</h1>
                <p>Hi ${ options.user.username }, to reset password please visit the next link: 
                    <a href="${ options.resetUrl }">${ options.resetUrl }</a>
                </p> 
        `
    });
}