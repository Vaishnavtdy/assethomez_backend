'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const request = require('request');
module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    try {
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services['careers-listing'].create(data, { files });
    } else {
      entity = await strapi.services['careers-listing'].create(ctx.request.body);
    }
    // var recaptchaValue=ctx.request.body;
    // console.log("recap--->>",recaptchaValue);

    var responseData =ctx.request.body.data;
    var personJSON=JSON.parse(responseData);
    var captchaValue=personJSON['g-recaptcha-response'];

    var captcahResp = await this.checkForm(captchaValue);
    if (!captcahResp.success)
    return ctx.send({sucess: false, message: 'Captcha Error', ...captcahResp}, 400); // Set status to 200.

    //return sanitizeEntity(entity, { model: strapi.models['careers-listing'] });
    entity = sanitizeEntity(entity, { model: strapi.models['careers-listing'] });

    const emailTemplate = {
      subject: 'Careers',
      text: `text`,
      html: `<table>
      <tr>
          <th>Full name</th>
          <td><%= data.fullname %></td>
      </tr>
      <tr>
          <th>Email</th>
          <td><%= data.email %></td>
      </tr>
      <tr>
          <th>Mobile</th>
          <td><%= data.mobile %></td>
      </tr>
      <tr>
          <th>Country</th>
          <td><%= data.country %></td>
      </tr>
      <tr>
          <th>Address</th>
          <td><%= data.address %></td>
      </tr>
      <tr>
          <th>School</th>
          <td><%= data.school %></td>
      </tr>
      <tr>
          <th>Degree</th>
          <td><%= data.degree %></td>
      </tr>
      <tr>
          <th>Post Graduation</th>
          <td><%= data.post_graduation %></td>
      </tr>
      <tr>
          <th>Additional Certification</th>
          <td><%= data.additional_certification %></td>
      </tr>
      <tr>
          <th>Resume</th>
          <td>`+process.env.ADMIN_URL+`<%= data.resume.url %></td>
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
        data:entity,
      }
    );

    return entity;
    }
    catch (err) {
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
