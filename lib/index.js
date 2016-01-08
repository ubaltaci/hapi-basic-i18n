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
    available_languages: ["EN", "TR"]

};

exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults(internals.defaults, options);

    // Insert i18n into view context
    var language = options.default_language;

    server.ext("onPreResponse", function (request, reply) {

        if (request.params["language"]) {
            language = request.params["language"];
            request.i18n = i18n(language, options.locale_path);
        }
        else if (request.session && request.session.get) {
            language = request.session.get(options.cookie_name) || language;
            request.i18n = i18n(language, options.locale_path);
        }

        var response = request.response;

        // if response type view!
        if (response.variety === "view") {
            response.source.context = response.source.context || {};
            response.source.context.i18n = request.i18n;
        }
        return reply.continue();
    });

    //// Insert i18n into view context
    server.ext("onPostAuth", function (request, reply) {

        request.i18nWithLanguage = function(language) {
            return i18n(language, options.locale_path);
        };

        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    pkg: require("../package.json")
};