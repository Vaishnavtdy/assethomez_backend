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
    let entity;
    try {
    if (ctx.is('multipart')) {
      const {data, files} = parseMultipartData(ctx);
      entity = await strapi.services['property-listing'].create(data, {files});
    } else {
      entity = await strapi.services['property-listing'].create(ctx.request.body);
    }

    // get captcha value from form data
   var responseData =ctx.request.body.data;
   var personJSON=JSON.parse(responseData);
   var captchaValue=personJSON['g-recaptcha-response'];

    var captcahResp = await this.checkForm(captchaValue);
    if (!captcahResp.success)
    return ctx.send({sucess: false, message: 'Captcha Error', ...captcahResp}, 400); // Set status to 200.


    //return sanitizeEntity(entity, { model: strapi.models['property-listing'] });
    entity = sanitizeEntity(entity, {model: strapi.models['property-listing']});



    const emailTemplate = {
      subject: 'Property Listing Request',
      text: `text`,
      html: `<table>
      <tr>
          <th>Property Type</th>
          <td><%= data.property_type %></td>
      </tr>
      <tr>
          <th>Development name</th>
          <td><%= data.development_name %></td>
      </tr>
      <tr>
          <th>property location</th>
          <td><%= data.property_location %></td>
      </tr>
      <tr>
          <th>Number of beds</th>
          <td><%= data.number_of_beds %></td>
      </tr>
      <tr>
          <th>Number of bathrooms</th>
          <td><%= data.number_of_bathrooms %></td>
      </tr>
      <tr>
          <th>Area</th>
          <td><%= data.area %></td>
      </tr>
      <tr>
          <th>Full name</th>
          <td><%= data.fullname %></td>
      </tr>
      <tr>
          <th>Email</th>
          <td><%= data.emailid %></td>
      </tr>
      <tr>
          <th>Mobile</th>
          <td><%= data.mobile %></td>
      </tr>
      <tr>
          <th>Office number</th>
          <td><%= data.office_number %></td>
      </tr>
      <tr>
          <th>Passport Copy</th>
          <td>`+process.env.ADMIN_URL+`<%=data.passport.url %></td>
      </tr>
      <tr>
      <th>Floor Plan </th>
      <td>`+process.env.ADMIN_URL+`<%=data.floor_plan %></td>
     </tr>
     <tr>
     <th>Title Deed </th>
     <td>`+process.env.ADMIN_URL+`<%=data.title_deed%></td>
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
        data: entity,
      }
    );

    return entity;
    }
    catch (err) {
      console.log('Error= from', err)
      return ctx.send({success: false, message: err}, 400); // Set status to 200.
    }
  },


//check validation
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
