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

    // "boolean"://////////////////////////////////////////////
    boolean: {
      title: "Boolean",
      type: "boolean",
    },
    //     property.format === "date-time"
    stringDateTime: {
      title: "Date Time",
      description: "### String - date-time \n Display localized date-time",
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