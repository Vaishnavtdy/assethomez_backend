/* simple validation routine, returns an array of errors */
function validate(code) {
  return new Promise((resolve, reject) => {

    let errors = [];

    request.post(' https://www.google.com/recaptcha/api/siteverify', {
      form: {
        secret: process.env.CAPTCHA_SECRET,
        response: code
      }
    }, (err, resp, body) => {
      if (!JSON.parse(body).success) {
        errors.push('You did not fill out the recaptcha or resubmitted the form.');
      }
      resolve({errors: errors});

    });

  });
}

module.exports = validate;
