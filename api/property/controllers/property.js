'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async search(ctx) {

    try {
      var pagination = await this.getPaginationData(ctx);

      let data = await this.searchQry(ctx, null, pagination);

      var propertiesId = [];

      data.forEach(function (val, key) {
        propertiesId.push(val.id)
      });
      let entities = await strapi.services.property.find({id_in: propertiesId});
      entities.map(entity => {
        delete entity.created_by;
        delete entity.updated_by;
        return entity;
      });

      var xdata = (entities && entities.length) ? {success: true, data: entities, pagination} : {
        success: true,
        data: []
      };

      ctx.send(xdata)
    } catch (e) {
      console.log(e)
    }
  },
  async searchCount(ctx) {

    try {
      let data = await this.searchQry(ctx, true);
      var xdata = (data && data.length) ? {success: true, count: data} : {success: true, data: []};

      ctx.send(xdata)
    } catch (e) {
      console.log(e)
    }
  },

  async getPaginationData(ctx,) {
    let param = ctx.request.query;

    var pagination = {};
    var per_page = param.per_page || 5;
    var page = parseInt(param.page) || 1;
    if (page < 1) page = 1;
    var offset = (page - 1) * per_page;

    let countData = await this.searchQry(ctx, true);
    let cnt = (countData && countData.length) ? countData[0].cnt : 0

    pagination.total = cnt;
    pagination.page = page;
    pagination.per_page = per_page;
    pagination.offset = offset;
    pagination.prev_page = page ? page - 1 : 0;
    pagination.last_page = Math.ceil(cnt / per_page);
    pagination.next_page = page + 1 <= pagination.last_page ? page + 1 : 0;

    return pagination;
  },
  async searchQry(ctx, returnCount, pagination) {

    let param = ctx.request.query;
    const knex = strapi.connections.default;
    var query = knex('properties')
    /*  .join('project_statuses', 'properties.project_status', 'project_statuses.id')
      .join('property_types', 'properties.property_type', 'property_types.id')*/

    if (returnCount)
      query.count('properties.id as cnt')
    else
      query.select('properties.id')

    if (param.location)
      query.where('properties.location', param.location)
    if (param.completion)
      query.where('properties.project_status', param.completion)
    if (param.property)
      query.where('properties.property_type', param.property)
    if (param.category)
      query.where('properties.property_status', param.category)

    if (param.min_price && param.max_price)
      query.whereBetween('properties.price', [param.min_price, param.max_price])
    else {
      if (param.min_price)
        query.where('properties.price', param.min_price)
      if (param.max_price)
        query.where('properties.price', param.max_price)

    }
    if (typeof pagination === 'object')
      query.limit(pagination.per_page).offset(pagination.offset)

    return query;

  },

};
