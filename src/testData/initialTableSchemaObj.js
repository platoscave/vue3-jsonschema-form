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
    //     property.enum

    stringEnumLarge: {
      title: "Enum Large",
      description: "### String - enum \nIf there are more than four permitted values, then display as listbox.",
      type: "string",
      enum: ["Tokyo", "New York", "Paris", "Moskow", "Abu Dhabi", "Canberra"],
    },


  },
  required: ['string']
}