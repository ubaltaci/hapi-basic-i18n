/**
 *
 * @File: index.js
 * @Reference: http://hapijs.com/api#plugin-interface
 *
 */

var path = require("path");
var Hoek = require("hoek");
var i18n = require("./i18n");

var internals = {};
internals.defaults = {
    locale_path: "./config/language"
};

exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults(internals.defaults, options);

    plugin.ext("onPreResponse", function (request, cb) {
        var language = "EN";
        if ( request.session && request.session.get ) {
            language = request.session.get("language") || "EN";
        }

        var response = request.response;

        // if response type view!
        if ( response.variety && response.variety === 'view' ) {
            response.source.context = response.source.context || {};
            response.source.context.__ = i18n(language, options.locale_path);
        }
        return cb();
    });

    next();
};

exports.register.attributes = {
    name: "hapi-basic-i18n",
    version: "0.0.1",
    multiple: false
};