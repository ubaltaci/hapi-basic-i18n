
var path = require("path");

function formatLocalization(localeString, REPLACEMENTS) {

    REPLACEMENTS = REPLACEMENTS || [];
    REPLACEMENTS.forEach(function (replacement, index) {
        localeString = localeString.replace("{" + index + "}", REPLACEMENTS[index]);
    });
    return localeString;
}

module.exports = function(LANG_CODE, locale_path) {
    LANG_CODE = LANG_CODE || "EN";
    var lang_file = require(path.join(locale_path, LANG_CODE.toLocaleLowerCase() + ".js"));

    return function(STRING_CODE, REPLACEMENTS) {
        if ( REPLACEMENTS && !Array.isArray(REPLACEMENTS) ) {
            REPLACEMENTS = [REPLACEMENTS];
        }
        return formatLocalization(lang_file[STRING_CODE], REPLACEMENTS);
    }
};