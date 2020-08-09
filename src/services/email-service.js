'use strict';

const config = require('../config');

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendgridKey);

exports.send = async (to, subject, html) => {
    await sgMail.send({
        to,
        from: 'EMAIL',
        subject,
        html
    })
}