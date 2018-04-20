'use strict';

module.exports = function(Mymodel) {

  Mymodel.remoteMethod('load', {
    http: { path: '/load', verb: 'post' },
    accepts: [{
      arg: 'data',
      type: 'object',
      http: { source: 'body' }
    }],
    returns: { arg: 'data', type: 'object', http: { source: 'body' }, root: true }
  });

  Mymodel.load = function(data, callback) {

    let filterFromDate = {};
    if (data.fromDate) {
      filterFromDate = {date : {gte: data.fromDate}};
    }
    let filterToDate = {};
    if (data.toDate) {
      filterToDate = {date : {lte: data.toDate}};
    }
    let filterKeyword = {};
    if (data.keyword && data.keyword.trim().length > 0) {
      var pattern = new RegExp('.*'+data.keyword+'.*', "i");
      //filterKeyword = {keyword : {like: '.*'+data.keyword+'.*'}};
      filterKeyword = {keyword : {like: pattern}};
    }

    let filter = {where: { and: [ filterKeyword, filterFromDate, filterToDate]}};
    Mymodel.find(filter, function(err, items) {
      if (err) {
        console.log('Get all Mymodel from cloudant with error >>>> ', err);
        callback(err, null);
        return;
      }

      console.log("Get all Mymodel from cloudant successfully" + JSON.stringify(items));

      let response = {
        data: items
      };
      callback(null,response);
    });
  }
};
