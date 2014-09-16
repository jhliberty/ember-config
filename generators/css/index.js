'use strict';
var util    = require('util');
var fs      = require('fs-extra');
var yeoman  = require('yeoman-generator');
require('sugar');

var helper = require ('../../lib/aid');
var aid;

var selected, isSelected;

var EmberConfigCssGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    this.appname = pjson.name;
    if (!this.appname)
        throw new Error("Missing name in package.json");

    this.appName = this._.classify(this.appname);
    aid = helper(this);

    selected = aid.matchSelector(this, 'css');
    isSelected = aid.eqSelector(this, 'fileExt');
    // selectedAny = aid.anySelector(this, 'css', isSelected);
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'css',
      message: 'Choose your css compiler:',
      choices: ['css', 'less', 'sass', 'stylus', 'compass (sass)'],
      default: 'css'
    }];

    this.prompt(prompts, function (props) {
      this.css = props.css;
      this.fileExt = this.css;

      if ((this.css).has('sass'))
        this.fileExt = 'scss';

      if ((this.css).has('stylus'))
        this.fileExt = 'styl';

      this.appCssFile = 'app/styles/app.' + this.fileExt;

      done();
    }.bind(this));
  },

  writing: {
    removeOldFiles: function() {
      aid.removeFiles('app/styles/app.*', aid.excludeOpt(this.appCssFile));
    },

    // only copy if not present!
    copyFiles: function () {
      if (aid.fileExists(this.appCssFile)) return;
      this.copy(fileName, this.appCssFile);
    }
  },

  install: {
    installLessCompiler: function () {
      if (!selected('less')) return;
      aid.install('less', 'broccoli-less-single');
    },

    installSassCompiler: function () {
      if (selected('compass')) return;
      if (!isSelected('scss')) return; // fileExt

      aid.install('sass', 'broccoli-sass');
    },

    installStylusCompiler: function () {
      if (!selected('stylus')) return;
      aid.install('stylus', 'broccoli-stylus-single');
    },

    installCompass: function () {
      if (!selected('compass')) return;
      aid.install('compass', 'ember-cli-compass-compiler');
    }
  }
});

module.exports = EmberConfigCssGenerator
