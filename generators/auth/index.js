'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var helper = require('../../lib/aid');
var aid;
var selected;
var index_file = require('../../lib/index_file');

var EmberConfigAuthGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    aid = helper(this);   
    selected = aid.eqSelector(this, 'auth'); 
  },

  // Choose Auth framework
  prompting: function () {
    var done = this.async();

    // https://github.com/jpadilla/ember-cli-simple-auth-token

    var prompts = [{
      type: 'list',
      name: 'auth',
      message: 'Choose your auth framework:',
      choices: ['simple-auth', 'simple-auth-token', 'torii', 'simple-auth-torii'],
      default: 'simple-auth'
    }];

    this.prompt(prompts, function (props) {
      this.auth = props.auth;

      done();
    }.bind(this));
  },

  writing: {
    configureSimpleAuth: function () {
      // TODO: ...

      // aid.addRoute('login');
    },
    configureSimpleAuthToken: function () {
      if (!selected('simple-auth-token')) return;

      aid.addRoute('login');
      aid.template('login_template.hbs', 'app/templates/login.hbs')
      aid.template('login_controller.js', 'app/controllers/login.js')

      var authorizeJs = this.read('authorizer.js');
      var envMatchExpr = /window\..* = .*ENV;/
      index_file(function() {
        return this.last(envMatchExpr).append(authorizeJs);
      }).write();      
    }    
  },

  install: {
    simpleAuth: function () {
      if (!selected('simple-auth')) return;

      aid.install('simple-auth');
    },
    simpleAuthToken: function () {
      if (!selected('simple-auth-token')) return;

      aid.install('simple-auth-token');
    },

    toriiAuth: function () {
      if (!selected('torii')) return;
      aid.installBower('torii');
      aid.install('torii');
    },

    simpleAuthTorii: function() {
      if (!selected('simple-auth-torii')) return;
      aid.install('simple-auth-torii')
    }  
  },
  end: {
    simpleAuthTorii: function() {
      aid.generate('ember', ['ember-cli-simple-auth-torii']); 
    }
  }
});

module.exports = EmberConfigAuthGenerator;
