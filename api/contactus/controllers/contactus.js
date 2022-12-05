'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const {parseMultipartData, sanitizeEntity} = require('strapi-utils');
const request = require('request');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity, body;

    try {
      if (ctx.is('multipart')) {
        const {data} = parseMultipartData(ctx);
        entity = await strapi.services.contactus.create(data, { files });
        body = data;
      } else {
        entity = await strapi.services.contactus.create(ctx.request.body);
        body = ctx.request.body;
      }
       var captcahResp = await this.checkForm(body.recaptcha);
      if (!captcahResp.success)
      return ctx.send({sucess: false, message: 'Captcha Error', ...captcahResp}, 400); // Set status to 200.

      entity = sanitizeEntity(entity, {model: strapi.models.contactus});

      const emailTemplate = {
        subject: 'Contact from <%= data.full_name %>',
        text: `text`,
        html: `<table>
            <tr>
                <th>Full name</th>
                <td><%= data.full_name %></td>
            </tr>
            <tr>
                <th>Email</th>
                <td><%= data.email %></td>
            </tr>
            <tr>
                <th>Phone</th>
                <td><%= data.mobile %></td>
            </tr>
          </table>`,
      };

      strapi.plugins.email.services.email.sendTemplatedEmail(
        {
           to: process.env.ADMIN_EMAIL,
          // from: is not specified, so it's the defaultFrom that will be used instead
        },
        emailTemplate,
        {
          data: ctx.request.body,
        }
      );

      return entity;

    } catch (err) {
      console.log('Error=', err)
      return ctx.send({success: false, message: err}, 400); // Set status to 200.
    }


  },
  checkForm(recaptchaKey) {
    return new Promise((resolve, reject) => {

      let response = {};

      request.post(' https://www.google.com/recaptcha/api/siteverify', {
        form: {
          secret: process.env.CAPTCHA_SECRET,
          response: recaptchaKey
        }
      }, (err, resp, body) => {
        if (!JSON.parse(body).success) {
          // response.success = false;
          response.message = 'You did not fill out the recaptcha or resubmitted the form.';
        } else {
          response.success = true;
          response.message = 'success';
        }
        resolve(response);

      });

    });
  }

};

