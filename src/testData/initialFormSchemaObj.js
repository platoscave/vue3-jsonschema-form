export default {

  title: "Jsonschema Form Generator Demo",
  description: "#Dispaly as markdown\nNote that the also description accepts markdown",

  properties: {

    // "string": ///////////////////////////////////////////////////

    string: {
      title: "String",
      description: "String with min-max length and placeholder",
      type: "string",
      minLength: 3,
      maxLength: 10,
      title: "Full Name",
      attrs: {
        placeholder: "Your Full Name",
      },
    },
    stringEmail: {
      title: "Email",
      description: "Enter valid email address",
      type: "string",
      format: "email",
      maxLength: 120,
      attrs: {
        type: "email",
        placeholder: "name@provider.com",
      },
    },
    stringPassword: {
      title: "Password",
      description: "Hidden input",
      type: "string",
      attrs: {
        placeholder: "Enter your password",
        type: "password",
      },
    },
    stringRegEx: {
      title: "Regular Expression",
      description: "String with regular expression",
      type: "string",
      pattern: "[a-e]+",
      attrs: {
        placeholder: "Enter letters between a-e",
      },
    },

    // "number"://////////////////////////////////////////////
    numberDecimal: {
      title: "Two Decimal",
      description: "Number with min - max values and two decimal places",
      type: "number",
      minimum: 10,
      maximum: 100,
      multipleOf: 0.01,
    },
    // "integer"://////////////////////////////////////////////
    integerMinMax: {
      title: "Integer Min Max",
      description: "Integer with min - max values",
      type: "integer",
      minimum: 10,
      maximum: 100,
    },
    // "boolean"://////////////////////////////////////////////
    boolean: {
      title: "Boolean",
      type: "boolean",
    },


    //     mediaType === "text/markdown"
    stringMarkdown: {
      title: "Markdown",
      description: "#Dispaly as markdown\nNote that the also description accepts markdown",
      type: "string",
      mediaType: "text/markdown",
      maxLength: 500,
      attrs: {
        type: "textarea",
        placeholder: "Enter your markdown text hier",
        showWordLimit: true,
      },
    },
    //     mediaType.startsWith("image/")
    stringImage: {
      title: "Image",
      description: "Svg or bse64",
      type: "string",
    },
    //     property.query
    stringQuery: {
      title: "Listbox",
      description: "If there are less than five permitted values, then display as raidobuttons. Otherwise display as listbox.",
      type: "string",
    },
    //     property.enum
    stringEnumSmall: {
      title: "Enum Small",
      description: "If there are less than five permitted values, then display as raidobuttons",
      type: "string",
      enum: ["Tokyo", "New York", "Paris"],
    },
    stringEnumLarge: {
      title: "Enum Large",
      description: "If there are more than four permitted values, then display as listbox.",
      type: "string",
      enum: ["Tokyo", "New York", "Paris", "Moskow", "Abu Dhabi", "Canberra"],
    },
    //     property.format === "date-time"
    stringDate: {
      title: "Date",
      description: "Dispaly localized date",
      type: "string",
      format: "date-time",
      attrs: {
        type: "date",
        placeholder: "Pick a day"
      },
    },
    stringDateTime: {
      title: "Date Time",
      description: "Display localized date-time",
      type: "string",
      format: "date-time",
      attrs: {
        type: "datetime",
        placeholder: "Pick a date - time"
      },
    },



    // "object"://////////////////////////////////////////////
    //     property.properties
    object: {
      title: "Object",
      description: "Nested object",
      type: "object",
      properties: {
        first: {
          title: "First Name",
          type: "string",
          maxLength: 80,
        },
        last: {
          title: "Last Name",
          type: "string",
          maxLength: 80,
        },
        birthday: {
          title: "Date of Birth",
          type: "string",
          format: "date-time",
          attrs: {
            type: "date",
          },
        },
        nestedSubFormObj: {
          title: "Nested Object",
          type: "object",
          properties: {
            petName: {
              title: "Pet Name",
              type: "string",
              maxLength: 80,
            },
            petType: {
              title: "Pet Type",
              type: "string",
              enum: ["Cat", "Dog", "Gold Fish"],
            },
          },
          required: ["petName", "petType"],
        },
      },
    },
    //     else "CodeEditor";
    objectJson: {
      title: "CodeEditor",
      description: "Object with no properties, displayed as CodeEditor",
      type: "object"
    },
    // "array"://////////////////////////////////////////////
    //     property.items.type === "object" && property.items.properties
    //     property.displayAs === "Table" // objects in a table
    objectsTable: {
      title: "Objects Table",
      description: "Display an array objects in a table",
      type: "array",
      displayAs: "Table",
      items: {
        type: "object",
        properties: {
          datetime: {
            title: "Timestamp",
            type: "string",
            format: "date-time",
            default: "now",
            attrs: {
              type: "datetime",
            },
          },
          logEntry: {
            title: "Log Entry",
            type: "string",
            maxLength: 500,
            attrs: {
              type: "textarea",
              placeholder: "What happend?",
            },
          },
        },
      },
      required: ["logEntry", "datetime"],
      additionalItems: true,
    },
    //     else "ObjectsArray"; // objects in a subform
    objectsArray: {
      title: "Array of Subforms",
      description: "Display an array of objects as subforms",
      type: "array",
      items: {
        type: "object",
        properties: {
          datetime: {
            type: "string",
            format: "date-time",
            title: "Timestamp",
            default: "now",
            attrs: {
              type: "datetime",
            },
          },
          logEntry: {
            type: "string",
            maxLength: 500,
            title: "Log",
            attrs: {
              type: "textarea",
              placeholder: "What happend?",
            },
          },
        },
      },
      required: ["logEntry", "datetime"],
      additionalItems: true,
    },
    // multi select
    //     property.items.type === "string"
    //     property.items.argoQuery
    multiSelect: {
      title: "Mutli Select",
      description: "Select multiple objects from a list. Return an array of identifires.",
      type: "object",
      query: {

      }
    }
    //     else "CodeEditor";

  },
  required: ['string']
}