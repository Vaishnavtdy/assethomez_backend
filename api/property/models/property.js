'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      //this.validateRelation(data)
    },
    async beforeUpdate(params, data) {
      //this.validateRelation(data)
    },
    validateRelation(data) {
      var errorMessage = [];
      if (data.property_type === undefined || data.property_type === null || data.project_status === undefined || data.project_status === null || data.property_status === undefined || data.property_status === null) {
        if (data.property_type === undefined || data.property_type === null)
          errorMessage.push('Property type is required')
        if (data.project_status === undefined || data.project_status === null)
          errorMessage.push('Project status is required')
        if (data.property_status === undefined || data.property_status === null)
          errorMessage.push('Property status is required')
        const Boom = require('boom');
        const err = new Error(errorMessage);
        const boomError = Boom.boomify(err, {
          statusCode: 422,
        });
        throw(boomError);
      }
    }
  },
};
