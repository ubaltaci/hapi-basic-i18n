
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

        if (!((typeof STRING_CODE == "string") || (STRING_CODE instanceof String))) {
            return JSON.stringify(STRING_CODE);
        }

        if ( REPLACEMENTS && !Array.isArray(REPLACEMENTS) ) {
            REPLACEMENTS = [REPLACEMENTS];
        }

        if ( lang_file[STRING_CODE] ) {
            return formatLocalization(lang_file[STRING_CODE], REPLACEMENTS);
        }
        else {
            return formatLocalization(STRING_CODE, REPLACEMENTS);
        }
    }
};