const nodeMailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
const juice = require('juice');
const Promise = require('bluebird');
const path = require('path');

const TEMPLATE_FOLDER_PATH = path.join(__dirname, '../', 'mailTemplates');

const transporterSettings = {
  host: process.env.MAILSERVICE_HOST,
  port: process.env.MAILSERVICE_PORT,
  auth: {
    user: process.env.MAILSERVICE_USERNAME,
    pass: process.env.MAILSERVICE_PASSWORD
  }
};

const transport = nodeMailer.createTransport(transporterSettings);

/**
 * Generates html from given template filename
 * @param template Template name to use
 */
const generateHtmlFromTemplateFile = (template) => {
  const { name, data } = template;
  const html = pug.renderFile(`${TEMPLATE_FOLDER_PATH}/${name}/index.pug`, data);
  return juice(html);
};

/**
 * Generates html with given data from file and sends it to user
 * @param options Options for html template and for mail options for transporter
 */
exports.sendMail = (options) => {
  const { to, subject, template } = options;
  const html = generateHtmlFromTemplateFile(template);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: options.from || `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER}>`,
    to,
    subject,
    html,
    text
  };

  const nodemailerSendMail = Promise.promisify(transport.sendMail, { context: transport });
  return nodemailerSendMail(mailOptions);
};
