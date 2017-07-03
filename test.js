#!/usr/bin/env node

/* --- DEPENDENCIES --- */

var tape = require('tape')
var _test = require('tape-promise').default // <---- notice 'default'
var test = _test(tape) // decorate tape

var UpdateSchemaDefaults = require('./exports.js');

/* --- MOCK OBJECTS --- */

var mockArgv = {
    d: "https://m.133a.lolacloud.com",
    p: "/services/translations/sub_project_translations/mobileBooking.json",
    u: "./mock-data/mock_uploaded_translations.json",
    s: "./mock-data/mock_schema.json",
    o: "./mock-data/mock_current_translations.json",
    q: true
}

var uMockJson = {
    "en-US": {
        "common": {
            "airportPickerCancelButton": "CANCEL",
            "textAlternativeForZeroPrice": "No Charge",
            "valueSelectedAriaLabel": "Value selected",
            "clickTaxesFeesLabel": "Jonjo Shelvey",
            "suffixPickerTitle": "Suffix"
        },
        "analytics": {
            "trackingTravelersValidationErrorLabelPrefix": "",
            "trackingSuffix": "What if blank?"
        }
    }
};

var newMockJson = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "version": "5.3.1",
    "type": "object",
    "required": [
        "resources"
    ],
    "properties": {
        "resources": {
            "type": "object",
            "required": [
                "en-US"
            ],
            "properties": {
                "en-US": {
                    "$ref": "#/definitions/namespaces",
                    "default": {}
                }
            },
            "default": {}
        }
    },
    "definitions": {
        "namespaces": {
            "type": "object",
            "properties": {
                "common": {
                    "type": "object",
                    "properties": {
                        "airportPickerCancelButton": {
                            "type": "string",
                            "default": "CANCEL",
                            "title": "Cancel Button",
                            "description": "Cancel button to dismiss the picker"
                        },
                        "clickTaxesFeesLabel": {
                            "type": "string",
                            "default": "Jonjo Shelvey",
                            "title": "Taxes fees click label",
                            "description": "Label to use when the user clicks on taxes, carrier charges and govt fees link or (info)"
                        },
                        "textAlternativeForZeroPrice": {
                            "type": "string",
                            "default": "No Charge",
                            "title": "No Charge [Auto-generated]",
                            "description": "No Charge [Auto-generated]"
                        },
                        "valueSelectedAriaLabel": {
                            "type": "string",
                            "default": "Value selected",
                            "title": "Value selected [Auto-generated]",
                            "description": "Value selected [Auto-generated]"
                        },
                        "suffixPickerTitle": {
                            "type": "string",
                            "default": "Suffix",
                            "title": "Suffix [Auto-generated]",
                            "description": "Suffix [Auto-generated]"
                        }
                    },
                    "default": {}
                },
                "ssr": {
                    "type": "object",
                    "properties": {
                        "categoriesPageTitle": {
                            "type": "string",
                            "default": "Special Services",
                            "title": "Special services title",
                            "description": "Special services main page title"
                        },
                        "clickTravelersContinueLabel": {
                            "type": "string",
                            "default": "Continue",
                            "title": "Click Continue Button label",
                            "description": "The label to use when clicking on Continue Button"
                        }
                    },
                    "default": {}
                },
                "analytics": {
                    "type": "object",
                    "properties": {
                        "trackingTravelersValidationErrorLabelPrefix": {
                            "type": "string",
                            "default": "",
                            "title": "[blank] [Auto-generated]",
                            "description": "[blank] [Auto-generated]"
                        },
                        "trackingSuffix": {
                            "type": "string",
                            "default": "What if blank?",
                            "title": "What if blank? [Auto-generated]",
                            "description": "What if blank? [Auto-generated]"
                        }
                    }
                }
            }
        }
    }
};

var sMockJson = {
    "id": "http://json-schema.org/draft-04/schema#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "Core schema meta-schema",
    "definitions": {
        "schemaArray": {
            "type": "array",
            "minItems": 1,
            "items": { "$ref": "#" }
        },
        "positiveInteger": {
            "type": "integer",
            "minimum": 0
        },
        "positiveIntegerDefault0": {
            "allOf": [ { "$ref": "#/definitions/positiveInteger" }, { "default": 0 } ]
        },
        "simpleTypes": {
            "enum": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        },
        "stringArray": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 1,
            "uniqueItems": true
        }
    },
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "format": "uri"
        },
        "$schema": {
            "type": "string",
            "format": "uri"
        },
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "default": {},
        "multipleOf": {
            "type": "number",
            "minimum": 0,
            "exclusiveMinimum": true
        },
        "maximum": {
            "type": "number"
        },
        "exclusiveMaximum": {
            "type": "boolean",
            "default": false
        },
        "minimum": {
            "type": "number"
        },
        "exclusiveMinimum": {
            "type": "boolean",
            "default": false
        },
        "maxLength": { "$ref": "#/definitions/positiveInteger" },
        "minLength": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "pattern": {
            "type": "string",
            "format": "regex"
        },
        "additionalItems": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "items": {
            "anyOf": [
                { "$ref": "#" },
                { "$ref": "#/definitions/schemaArray" }
            ],
            "default": {}
        },
        "maxItems": { "$ref": "#/definitions/positiveInteger" },
        "minItems": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "uniqueItems": {
            "type": "boolean",
            "default": false
        },
        "maxProperties": { "$ref": "#/definitions/positiveInteger" },
        "minProperties": { "$ref": "#/definitions/positiveIntegerDefault0" },
        "required": { "$ref": "#/definitions/stringArray" },
        "additionalProperties": {
            "anyOf": [
                { "type": "boolean" },
                { "$ref": "#" }
            ],
            "default": {}
        },
        "definitions": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "properties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "patternProperties": {
            "type": "object",
            "additionalProperties": { "$ref": "#" },
            "default": {}
        },
        "dependencies": {
            "type": "object",
            "additionalProperties": {
                "anyOf": [
                    { "$ref": "#" },
                    { "$ref": "#/definitions/stringArray" }
                ]
            }
        },
        "enum": {
            "type": "array",
            "minItems": 1,
            "uniqueItems": true
        },
        "type": {
            "anyOf": [
                { "$ref": "#/definitions/simpleTypes" },
                {
                    "type": "array",
                    "items": { "$ref": "#/definitions/simpleTypes" },
                    "minItems": 1,
                    "uniqueItems": true
                }
            ]
        },
        "allOf": { "$ref": "#/definitions/schemaArray" },
        "anyOf": { "$ref": "#/definitions/schemaArray" },
        "oneOf": { "$ref": "#/definitions/schemaArray" },
        "not": { "$ref": "#" }
    },
    "dependencies": {
        "exclusiveMaximum": [ "maximum" ],
        "exclusiveMinimum": [ "minimum" ]
    },
    "default": {}
}

var oMockJson = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "version": "5.3.1",
    "type": "object",
    "required": [
        "resources"
    ],
    "properties": {
        "resources": {
            "type": "object",
            "required": [
                "en-US"
            ],
            "properties": {
                "en-US": {
                    "$ref": "#/definitions/namespaces",
                    "default": {}
                }
            },
            "default": {}
        }
    },
    "definitions": {
        "namespaces": {
            "type": "object",
            "properties": {
                "common": {
                    "type": "object",
                    "properties": {
                        "airportPickerCancelButton": {
                            "type": "string",
                            "default": "CANCEL",
                            "title": "Cancel Button",
                            "description": "Cancel button to dismiss the picker"
                        },
                        "clickTaxesFeesLabel": {
                            "type": "string",
                            "default": "View Taxes, Fees {{amp}} Charges",
                            "title": "Taxes fees click label",
                            "description": "Label to use when the user clicks on taxes, carrier charges and govt fees link or (info)"
                        }
                    },
                    "default": {}
                },
                "ssr": {
                    "type": "object",
                    "properties": {
                        "categoriesPageTitle": {
                            "type": "string",
                            "default": "Special Services",
                            "title": "Special services title",
                            "description": "Special services main page title"
                        },
                        "clickTravelersContinueLabel": {
                            "type": "string",
                            "default": "Continue",
                            "title": "Click Continue Button label",
                            "description": "The label to use when clicking on Continue Button"
                        }
                    },
                    "default": {}
                }
            }
        }
    }
}
;

var mockNewTopics = 1;
var mockNewTopicsTranslations = 2;
var mockNewTranslations = 3;
var mockEditedTranslations = 1;

/* --- TESTS --- */

// helper/wrapper function that returns a Promise
function asyncTestWrapper (func, args) {
  return new Promise(function (resolve, reject) {
    resolve(func.apply(this, args));
  })
}

test('Complete walkthrough test', function (t) {
    t.plan(4);

    return new Promise(function (resolve, reject) {
        return asyncTestWrapper(UpdateSchemaDefaults.run, [mockArgv])
        .then(function (final) {

          // run assertions
          t.equal(final.newTopics, 1);
          t.equal(final.newTopicsTranslations, 2);
          t.equal(final.newTranslations, 3);
          t.equal(final.editedTranslations, 1);

          // wait to allow hard reset (file was overwritten during execution)
          // TODO make this better (setTimeout is bad)
          setTimeout(function () {
              final.writeJsonToFile(mockArgv.o, oMockJson);
          }, 50) // 10 works
    })
})})

test('Get JSON from url', function (t) {
    t.plan(2);

    var mockUrl = mockArgv.d + mockArgv.p;

    return asyncTestWrapper(UpdateSchemaDefaults.getJsonFromUrl, [mockUrl])
    .then(json => {
        // check if we receive a json-like object back from the url
        t.equal(typeof json, 'object');
        t.deepLooseEqual(Object.keys(json), ['en-US'])
    })
});

/* --- COMMENTS --- */

/* test ideas
- detect a bad schema
- detect a bad json according to a good schema
- correctly read a file's contents
- correctly write to a file
*/
