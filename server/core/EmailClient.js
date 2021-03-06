const fs = require('fs');
const nodemailer = require('nodemailer');
const HtmlEntities = require('html-entities').XmlEntities;
const errors = use('core/errors.json');

/**
 * Email class for sending emails
 */
class EmailClient {

  /**
   * Create new instance
   */
  constructor() {
    this.transportConfig = {
      host: process.env.FSTACK_MAIL_HOST,
      port: parseInt(process.env.FSTACK_MAIL_PORT, 10),
      tls: {
        rejectUnauthorized: !!process.env.FSTACK_MAIL_REJECT_UNAUTH
      },
      secure: !!process.env.FSTACK_MAIL_SECURE,
      auth: {
        user: process.env.FSTACK_MAIL_USER,
        pass: process.env.FSTACK_MAIL_PASS
      }
    };
  }

  /**
   * Composes the message boby using a template and data object
   * 
   * @param {String} template 
   * @param {*} data 
   */
  composeMessage(template, data = {}) {
    let message = this.loadTemplate(template);
    for (let key in data) {
        let regex = new RegExp('\\['+key+'\\]', "g")
        message = message.replace(regex, data[key])
    }
    const entities = new HtmlEntities();
    message = entities.decode(message);
    message = message.replace(/\r?\n/g, "<br />"); // Add breack lines
    return message;
  }

  /**
   * Validates template name
   * and returns template file content
   * 
   * @param {String} template 
   */
  loadTemplate(template) {
    const templatesPath = process.env.FSTACK_TEMPLATES_PATH;
    const filename = templatesPath + template;
    if (!fs.existsSync(filename)) throw new Error(errors["020"]);
    return fs.readFileSync(filename, 'utf8');
  }

  /**
   * Send email
   * @param  {String} recipients  The recipients
   * @param  {String} message     The message
   * @param  {String} subject     The subject
   * @param  {Array}  attachments The attachments
   */
  async send(recipients, message, subject = '', attachments = []) {

    // Validate recipients
    if (!recipients) throw new Error(errors["022"]);

    // Validate body
    if (!message) throw new Error(errors["021"]);

    // Set transporter
    const transporter = nodemailer.createTransport(this.transportConfig);

    // setup email data
    const text = message.replace(/<\/?[^>]+(>|$)/g, ""); // Remove html tags
    const mailOptions = {
        from: process.env.FSTACK_MAIL_FROM,
        to: recipients,
        subject: subject,
        text,
        html: message
    };

    // send mail with defined transport object
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          if (process.env.FSTACK_DEBUG) console.log(error);
          return resolve(false);
        }
        if (process.env.FSTACK_DEBUG) console.log('Message info: ', info);
        resolve(true);
      });
    });
  }
}

module.exports = EmailClient;
