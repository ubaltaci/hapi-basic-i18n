/**
 *
 * @File: index.js
 * @Reference: http://hapijs.com/api#plugin-interface
 *
 */

var Hoek = require("hoek");
var i18n = require("./i18n");

var internals = {};
internals.defaults = {
    locale_path: "./config/languages",
    cookie_name: "language",
    default_language: "EN",
    available_languages: ["EN"]

};

exports.register = function (plugin, options, next) {

    options = Hoek.applyToDefaults(internals.defaults, options);


    // Insert i18n into view context
    var language = options.default_language;

    plugin.ext("onPreResponse", function (request, cb) {

        if ( request.session && request.session.get ) {
            language = request.session.get(options.cookie_name) || language;
        }

        var response = request.response;

        // if response type view!
        if ( response.variety && response.variety === "view" ) {
            response.source.context = response.source.context || {};
            response.source.context.i18n = request.i18n;
        }
        return cb();
    });

    // Insert i18n into view context
    plugin.ext("onPreHandler", function (request, cb) {

        if ( request.session && request.session.get ) {
            language = request.session.get(options.cookie_name) || language;
        }

        if ( options.available_languages.indexOf(language) == -1) {
            language = options.default_language;
        }

        request.i18n = i18n(language, options.locale_path);

        return cb();
    });

    next();
};

exports.register.attributes = {
    pkg: require("./../package.json")
};