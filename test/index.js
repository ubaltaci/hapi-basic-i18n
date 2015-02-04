// Load modules

var Code = require('code');
var Hapi = require('hapi');
var Hoek = require('hoek');
var Lab = require('lab');
var Path = require("path");

// Declare internals

var internals = {};

// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = Code.expect;

describe("Hapi Basic i18n", function () {
    var server;

    beforeEach(function (done) {
        server = new Hapi.Server();
        server.connection();
        done();
    });

    it("returns valid localized strings for EN", function (done) {
        server.register({
            register: require("../"),
            options: {
                locale_path: "../test/languages",
                default_language: "EN",
                available_languages: ["EN", "TR"]
            }
        }, function (err) {
            expect(err).to.not.exist();

            server.route({
                method: 'GET',
                path: '/',
                config: {
                    handler: function (request, reply) {
                        expect(request.i18n).to.exist();
                        var localized = {
                            hello: request.i18n("Hello"),
                            say_hello_to: request.i18n("Say Hello To", "Isaac"),
                            number: request.i18n("1"),
                            number_not_exist: request.i18n(198),
                            xxx: request.i18n("XXX"),
                            not_exist: request.i18n("Hohoho")
                        };
                        return reply({localized: localized});
                    }
                }
            });

            server.inject("/", function (res) {
                expect(res.result).to.exist();
                expect(res.result.localized).to.exist();
                var localized = res.result.localized;
                expect(localized.hello).to.equal("Hello!");
                expect(localized.say_hello_to).to.equal("Hello Isaac!");
                expect(localized.number).to.equal("Number 1");
                expect(localized.xxx).to.equal("EN XX");
                expect(localized.number_not_exist).to.equal("198");
                expect(localized.not_exist).to.equal("Hohoho");
                done();
            });
        });
    });

    it("returns valid localized strings from default language when avaiable languages mismatch with default one", function (done) {
        server.register({
            register: require("../"),
            options: {
                locale_path: "../test/languages",
                default_language: "EN",
                available_languages: ["TR"]
            }
        }, function (err) {
            expect(err).to.not.exist();

            server.route({
                method: 'GET',
                path: '/',
                config: {
                    handler: function (request, reply) {
                        expect(request.i18n).to.exist();
                        var localized = {
                            hello: request.i18n("Hello")
                        };
                        return reply({localized: localized});
                    }
                }
            });

            server.inject("/", function (res) {
                expect(res.result).to.exist();
                expect(res.result.localized).to.exist();
                var localized = res.result.localized;
                expect(localized.hello).to.equal("Hello!");
                done();
            });
        });
    });

    it("returns valid localized strings for TR", function (done) {
        server.register({
            register: require("../"),
            options: {
                locale_path: "../test/languages",
                default_language: "TR",
                available_languages: ["EN", "TR"]
            }
        }, function (err) {
            expect(err).to.not.exist();

            server.route({
                method: 'GET',
                path: '/',
                config: {
                    handler: function (request, reply) {
                        expect(request.i18n).to.exist();
                        var localized = {
                            hello: request.i18n("Hello"),
                            say_hello_to: request.i18n("Say Hello To", "Isaac"),
                            number: request.i18n("1"),
                            xxx: request.i18n("XXX"),
                            not_exist: request.i18n("Hohoho")
                        };
                        return reply({localized: localized});
                    }
                }
            });

            server.inject("/", function (res) {
                expect(res.result).to.exist();
                expect(res.result.localized).to.exist();
                var localized = res.result.localized;
                expect(localized.hello).to.equal("Merhaba!");
                expect(localized.say_hello_to).to.equal("Selam Isaac!");
                expect(localized.number).to.equal("1 Numara");
                expect(localized.xxx).to.equal("XXX");
                expect(localized.not_exist).to.equal("Hohoho");
                done();
            });
        });
    });

    it("returns ..", function (done) {
        server.views({
            engines: {
                html: require("handlebars") // means .ext is .html
            },
            path: Path.join(__dirname, 'views'),
            isCached: false
        });

        server.register({
            register: require("../"),
            options: {
                locale_path: "../test/languages",
                default_language: "EN",
                available_languages: ["EN", "TR"]
            }
        }, function (err) {
            expect(err).to.not.exist();

            server.route({
                method: 'GET',
                path: '/',
                config: {
                    handler: function (request, reply) {
                        expect(request.i18n).to.exist();
                        var localized = {
                            hello: request.i18n("Hello")
                        };
                        return reply.view("index");
                    }
                }
            });

            server.inject("/", function (res) {
                var tokens = res.result.split("\n");

                expect(tokens[2]).to.equal("Hello!");
                expect(tokens[3]).to.equal("Hello Isaac!");
                done();
            });
        });
    });
});