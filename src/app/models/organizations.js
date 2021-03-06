var Backbone = require('backbone'),
    _ = require('lodash'),
    numeral = require('numeral'),
    settings = require('../settings');

var Organizations = {};

Organizations.Model = Backbone.Model.extend({
  url: function() {
    return settings.api.baseurl + '/orgs/' + this.id + ".jsonp/?callback=?";
  },

  parse: function(data){
    // Format dollar amounts nicely
    if (data && data.org_grants_funded) {
      data.amount_funded = numeral(data.org_grants_funded).format('0,0[.]00');
    }
    if (data && data.org_grants_received) {
      data.amount_received = numeral(data.org_grants_received).format('0,0[.]00');
    }

    return data;
  }
});

Organizations.Collection = Backbone.Collection.extend({
  model: Organizations.Model,
  url: settings.api.baseurl + "/orgs.jsonp/?callback=?",

  initialize: function(options) {
    _.bindAll(this, 'parse');
  },

  search: function(options) {
    if (options && options.title) {
      this.url += '&filters[title]=' + options.title;
    }

    if (options && options.limit) {
      this.url += '&limit=' + options.limit;
    }

    if (options && options.sort) {
      this.url += '&' + $.param({ sort: options.sort });
    }

    this.fetch({ reset: true });
  },

  parse: function(response) {
    console.log("Got orgs", response.orgs);
    return response.orgs;
  }
});

module.exports = Organizations;
