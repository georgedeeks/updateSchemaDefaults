#!/usr/bin/env node

var fetch = require('node-fetch');
var fs = require('fs');
var Ajv = require('ajv');
var _ = require('lodash');

exports.getJsonFromFile = function (filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

exports.getJsonFromUrl = function (url) {
      return new Promise(function(resolve, reject) {
          fetch(url, {timeout: 4000})
              .then(function(res){

                  if (res.ok) {

                      resolve(res.json());
                  } else {
                      reject(res.statusText);
                  }
              })
              .catch(function(e) {
                  reject(e);
              });
      });
}

exports.writeJsonToFile = function (filepath, json) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, JSON.stringify(json), (err, data) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

// runs the program
exports.run = function (argv) {
    var getUJsonMethod;
    var getUJsonArg;

    if (argv.u) {
        getUJsonMethod = exports.getJsonFromFile;
        getUJsonArg = argv.u;
    } else {
        getUJsonMethod = exports.getJsonFromUrl;
        getUJsonArg = argv.d + argv.p;
    }

    return Promise.all([exports.getJsonFromFile(argv.o), exports.getJsonFromFile(argv.s), getUJsonMethod(getUJsonArg)])
    .then(vals => {
        exports.compare(vals[0], vals[1], vals[2], argv); // i.e. oJson, sJson, uJson
        return exports;
    })
}

// continues to run program, once json objects have been received
exports.compare = function (oJson, sJson, uJson, argv) {

    // must have comparative schema
    if (!exports.validateJsonWithSchema(sJson, [uJson, oJson])) {
        throw new Error('Problem validating JSON');
    }

    // comparison and update function
    exports.updateSchemaDefaults(uJson, oJson)
    .then(newJson => {
        exports.writeJsonToFile(argv.o, newJson)
    })
    .then(res => {
        // only log changes if we're not on quiet mode/flag
        if (!argv.q) {
            exports.logChangesToExistingTranslations();
        }
    })
    .catch(e => console.error('Problem found processing JSON data.', e));
};

// check uploaded & output & schema are json
exports.isJsonString = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

exports.validateJsonWithSchema = function (schema, jsonObjs) {
    var ajv = new Ajv();
    var validate = ajv.compile(schema);

    jsonObjs.forEach(function (json) {
        var valid = validate(json);
        if (!valid) {
            return false;
        }
    });

    return true;
}

// in case we need to autofill new translation contents
exports.createTranslationContents = function (uJson, topic, translationName) {
    var newTransDefault = uJson['en-US'][topic][translationName];

    // Add sufficient description if translation is blank

    // All received new translations will have no title or description, so
    // auto-generate them based on default

    var newTransBlank;

    if (!newTransDefault) {
        newTransDefault = '';
        newTransBlank = '[blank]'
    } else {
        newTransBlank = newTransDefault;
    }
    newTransBlank += " [Auto-generated]";

    return {
        "type": "string",
        "default": newTransDefault,
        "title": newTransBlank,
        "description": newTransBlank
    }
}

// counters for logging and testing purposes
exports.newTopics = 0;
exports.newTopicsTranslations = 0;
exports.newTranslations = 0;
exports.editedTranslations = 0;

// create new Json
exports.updateSchemaDefaults = function (uJson, oJson) {
    return new Promise((resolve, reject) => {
        // prepare to compare
        var uTopicKeys = Object.keys(uJson['en-US']);
        var oTopicKeys = Object.keys(oJson.definitions.namespaces.properties);

        // create entire new object out of current JSON translations
        var newJson = JSON.parse(JSON.stringify(oJson));

        // keep a count of stuff changed
        var editedTranslations = 0;
        var newTranslations = 0;
        var newTopics = 0;
        var newTopicsTranslations = 0;

        uTopicKeys.forEach(function (topic) {
            var uTransKeys = Object.keys(uJson['en-US'][topic]);

            var existingTopic = _.includes(oTopicKeys, topic);

            if (existingTopic) {
                var oTransKeys = Object.keys(oJson.definitions.namespaces.properties[topic].properties);

                uTransKeys.forEach(function (translation) {
                    var existingTrans = _.includes(oTransKeys, translation);

                    if (existingTrans) {
                        var uDefault = uJson['en-US'][topic][translation] || '[blank]';
                        var oDefault = oJson.definitions.namespaces.properties[topic].properties[translation].default || '';

                        if (uDefault != oDefault) {
                            newJson.definitions.namespaces.properties[topic].properties[translation].default = uDefault;
                            exports.editedTranslations++;
                        } // else {no change}

                    } else {
                        newJson.definitions.namespaces.properties[topic].properties[translation] = exports.createTranslationContents(uJson, topic, translation)
                        exports.newTranslations++;
                    }
                })
            } else {
                // add new topic
                var topicTranslationsProperties = {};

                _.map(_.keys(uJson['en-US'][topic]), function (key) {
                    topicTranslationsProperties[key] = exports.createTranslationContents(uJson, topic, key);
                    exports.newTopicsTranslations++;
                });

                var topicTranslations = {
                    type: 'object',
                    properties: topicTranslationsProperties
                };

                newJson.definitions.namespaces.properties[topic] = topicTranslations;
                exports.newTopics++;
            }
        })
        resolve(newJson);
    });
}

// Log any changes made
exports.logChangesToExistingTranslations = function () {
    var output;
    if (exports.newTopics || exports.newTopicsTranslations || exports.newTranslations || exports.editedTranslations) {
        var output = 'Changes made:'
        output += exports.newTopics && ('\n- ' + exports.newTopics + ' new topics added');
        output += exports.newTopicsTranslations && ('\n- ' + exports.newTopicsTranslations + ' new translations added to newly-created topics')
        output += exports.newTranslations && ('\n- ' + exports.newTranslations + ' new translations added to existing topics')
        output += exports.editedTranslations && ('\n- ' + exports.editedTranslations + ' existing translations edited')
    } else {
        output = 'Up to date already. No changes made.'
    }
    console.log(output);
}

module.export = exports;
