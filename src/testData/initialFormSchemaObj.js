export default {

  title: "Jsonschema Form Generator Demo",
  description: "#Dispaly as markdown\nNote that the also description accepts markdown",

  properties: {

    // "string": ///////////////////////////////////////////////////

    string: {
      title: "String",
      description: "Required string with min-max length and placeholder",
      type: "string",
      minLength: 3,
      maxLength: 10,
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
    number: {
      title: "Number",
      description: "Number with min - max values and two decimal places",
      type: "number",
      minimum: 10,
      maximum: 100,
      multipleOf: 0.01,
    },
    // "integer"://////////////////////////////////////////////
    integer: {
      title: "Integer",
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
        format: "YYYY-MM-DD HH:mm",
        placeholder: "Pick a date - time"
      },
    },


    //     mediaType === "text/markdown"
    stringMarkdown: {
      title: "Markdown",
      description: "#Dispaly as markdown\nNote that the also description accepts markdown",
      type: "string",
      contentMediaType: "text/markdown",
      maxLength: 500,
      attrs: {
        type: "textarea",
        placeholder: "Enter your markdown text hier",
        showWordLimit: true,
      },
    },
    //     mediaType.startsWith("image/")
    stringImage: {
      title: "StringIconCtrl",
      description: "Svg or bse64",
      type: "string",
      mediaType: "image/url"
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
    //     property.query
    stringQuerySmall: {
      title: "Query Small",
      description: "Execute the query. If there are less than items, then display as raidobuttons",
      type: "string",
      query: { select: 'small' }
    },
    stringQueryLarge: {
      title: "Query Large",
      description: "Execute the query. If there are more than four items, then display as listbox.",
      type: "string",
      query: { select: 'large' }
    },

    // multi select
    //     property.items.type === "array"
    //     property.items.argoQuery
    multiSelectSmall: {
      title: "Mutli Select Small",
      description: "Select multiple objects checkboxes. Return an array of identifires.",
      type: "array",
      items: {
        type: "string",
        query: { select: 'small' },
      }
    },
    multiSelectLarge: {
      title: "Mutli Select Large",
      description: "Select multiple objects from a list. Return an array of identifires.",
      type: "array",
      items: {
        type: "string",
        query: { select: 'large' },
      }
    },



    // "object"://////////////////////////////////////////////
    //     property.properties
    object: {
      title: "Nested Objects",
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
        nestedObject: {
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
    // "array"://////////////////////////////////////////////
    //     property.items.type === "object" && property.items.properties
    //     property.displayAs === "Table" // objects in a table
    //     else "ArrayObjects"; // objects in a subform
    objectsArray: {
      title: "Array of Objects",
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
    objectsTable: {
      title: "Objects in Table",
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
    //     else "StringCodeEditorCtrl";
    objectJson: {
      title: "StringCodeEditorCtrl",
      description: "Object with no properties, displayed as StringCodeEditorCtrl",
      type: "object"
    }
    //     else "StringCodeEditorCtrl";

  },
  required: ['string']
}