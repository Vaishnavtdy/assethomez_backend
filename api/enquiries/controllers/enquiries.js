"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const request = require("request");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity, body;

    try {
      if (ctx.is("multipart")) {
        const { data } = parseMultipartData(ctx);
        entity = await strapi.services.enquiries.create(data, { files });
        body = data;
      } else {
        entity = await strapi.services.enquiries.create(ctx.request.body);
        body = ctx.request.body;
      }
      // var captcahResp = await this.checkForm(body.recaptcha);
      // if (!captcahResp.success)
      //   return ctx.send(
      //     { sucess: false, message: "Captcha Error", ...captcahResp },
      //     400
      //   );

      entity = sanitizeEntity(entity, { model: strapi.models.enquiries });

      const emailTemplate = {
        subject: " From <%= data.page_title %> - <%= data.full_name %>",
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
            <tr>
                <th>Home Type</th>
                <td><%= data.home_type %></td>
            </tr>
            <tr>
                <th>Budget</th>
                <td><%= data.budget %></td>
            </tr>
            <tr>
                <th>Salary scale</th>
                <td><%= data.salary_scale %></td>
            </tr>
            <tr>
                <th>city</th>
                <td><%= data.city %></td>
            </tr>
          </table>`,
      };

      strapi.plugins.email.services.email.sendTemplatedEmail(
        {
          to: process.env.ENQ_EMAIL,
          cc: [
            process.env.ADMIN_EMAIL,
            process.env.CC1_EMAIL,
            process.env.CC2_EMAIL,
            process.env.CC3_EMAIL,
          ],

          // from: is not specified, so it's the defaultFrom that will be used instead
        },
        emailTemplate,
        {
          data: ctx.request.body,
        }
      );

      return entity;
    } catch (err) {
      console.log("Error=", err);
      return ctx.send({ success: false, message: err }, 400); // Set status to 200.
    }
  },
  // checkForm(recaptchaKey) {
  //   return new Promise((resolve, reject) => {
  //     let response = {};

  //     request.post(
  //       " https://www.google.com/recaptcha/api/siteverify",
  //       {
  //         form: {
  //           secret: process.env.CAPTCHA_SECRET,
  //           response: recaptchaKey,
  //         },
  //       },
  //       (err, resp, body) => {
  //         if (!JSON.parse(body).success) {
  //           // response.success = false;
  //           response.message =
  //             "You did not fill out the recaptcha or resubmitted the form.";
  //         } else {
  //           response.success = true;
  //           response.message = "success";
  //         }
  //         resolve(response);
  //       }
  //     );
  //   });
  // },
};
