export default {

  title: "Jsonschema Form Generator Demo",

  properties: {

    // "string": ///////////////////////////////////////////////////

    string: {
      title: "String",
      description: "### String \n- required \n- min-max length \n- placeholder \n\nNote that this popup `description` also accepts [markdown](https://en.wikipedia.org/wiki/Markdown).",
      type: "string",
      minLength: 3,
      maxLength: 10,
      attrs: {
        placeholder: "Your Full Name",
      },
    },
    stringEmail: {
      title: "Email",
      description: "### String - email\n Format email ",
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
      description: "### String - password\n Hidden input",
      type: "string",
      attrs: {
        placeholder: "Enter your password",
        type: "password",
      },
    },
    stringRegEx: {
      title: "Regular Expression",
      description: "### String - regex\n Regular expression: `[a-e]+`",
      type: "string",
      pattern: "[a-e]+",
      attrs: {
        placeholder: "Enter letters between a-e",
      },
    },

    // "number"://////////////////////////////////////////////
    number: {
      title: "Number",
      description: "### Number \n- two decimal places \n- min-max values \n- placeholder \n- automatic rounding",
      type: "number",
      minimum: 10,
      maximum: 100,
      multipleOf: 0.01,
      attrs: {
        placeholder: "Enter amount",
      },
    },
    // "integer"://////////////////////////////////////////////
    integer: {
      title: "Integer",
      description: "### String - integer \n- zero decimal places \n- min-max values \n- placeholder \n- automatic rounding",
      type: "integer",
      minimum: 10,
      maximum: 100,
      attrs: {
        placeholder: "Enter number between 10 and 100",
      },
    },
    // "boolean"://////////////////////////////////////////////
    boolean: {
      title: "Boolean",
      type: "boolean",
    },
    //     property.format === "date-time"
    stringDate: {
      title: "Date",
      description: "### String - date \n Returns date without time/time zone <br>Readonly displays localized format.",
      type: "string",
      format: "date",
      attrs: {
        type: "date",
        placeholder: "Pick a day"
      },
    },
    stringDateTime: {
      title: "Date Time",
      description: "### String - date-time \n Displays date-time in local time zone. <br>Returns ISO date-time in GMT",
      type: "string",
      format: "date-time",
      attrs: {
        format: "YYYY-MM-DD HH:mm",
        placeholder: "Pick a date - time"
      },
    },


    //     mediaType === "text/markdown"
    stringMarkdown: {
      title: "Markdown",
      description: "### String - markdown \nDispaly as markdown",
      type: "string",
      contentMediaType: "text/markdown",
      maxLength: 500,
      attrs: {
        type: "textarea",
        placeholder: "Enter your markdown text hier",
        showWordLimit: true,
      },
    },
    //     contentMediaType.startsWith("image/")
    stringImage: {
      title: "Icon",
      description: "### String - svg icon",
      type: "string",
      contentMediaType: "image/svg"
    },
    //     property.enum
    stringEnumSmall: {
      title: "Enum Small",
      description: "### String - enum \nIf there are less than five permitted values, then display as raidobuttons",
      type: "string",
      enum: ["Tokyo", "New York", "Paris"],
    },
    stringEnumLarge: {
      title: "Enum Large",
      description: "### String - enum \nIf there are more than four permitted values, then display as listbox.",
      type: "string",
      enum: ["Tokyo", "New York", "Paris", "Moskow", "Abu Dhabi", "Canberra"],
    },
    //     property.query
    stringQuerySmall: {
      title: "Query Small",
      description: "### String - query \nExecute the query. If there are less than five items, then display as raidobuttons",
      type: "string",
      query: { select: 'small' }
    },
    stringQueryLarge: {
      title: "Query Large",
      description: "### String - query \nExecute the query. If there are more than four items, then display as listbox.",
      type: "string",
      query: { select: 'large' }
    },

    // multi select
    //     property.items.type === "array"
    //     property.items.argoQuery
    multiSelectSmall: {
      title: "Mutli Select Small",
      description: "### Array - query \nSelect multiple objects checkboxes. Return an array of identifires.",
      type: "array",
      items: {
        type: "string",
        query: { select: 'small' },
      }
    },
    multiSelectLarge: {
      title: "Mutli Select Large",
      description: "### Array - query \nSelect multiple objects from a list. Return an array of identifires.",
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
      description: "### Object \nNested object",
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
          format: "date",
          attrs: {
          },
        },
        nestedObject: {
          title: "Nested Object",
          description: "### Object \nDubble nested object",
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
      title: "Objects in Forms",
      description: "### Array - objects\nDisplay an array of objects in subforms.\nUse Drag and Drop to reorder the objects",
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
              format: "YYYY-MM-DD HH:mm",
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
      description: "### Array - objects\nDisplay an array of objects in a table.\n Use Drag and Drop to reorder the objects",
      type: "array",
      displayAs: "table",
      items: {
        type: "object",
        properties: {
          datetime: {
            title: "Timestamp",
            type: "string",
            format: "date-time",
            default: "now",
            attrs: {
              format: "YYYY-MM-DD HH:mm",
            },
          },
          logEntry: {
            title: "Log Entry",
            description: "### Log Entry\n Describe notable event which took place.",
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
      title: "Code Editor",
      description: "### String\nObject with no properties, displayed as code editor",
      type: "object"
    }
    //     else "StringCodeEditorCtrl";

  },
  required: ['string']
}