<template>
  <h1>JSON Forms Vue 3</h1>
  <div class="myform">
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      :uischema="uischema"
      @change="onChange"
    />
  </div>
  <div>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>

<script lang="ts">
import { Schema, JSONSchema } from "@effect/schema";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import { defineComponent } from "vue";

import { VisitorJsonSchema } from "./forms/Visitor.form.ts";

console.log(111, VisitorJsonSchema);
// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

enum ASD {
  qwea,
  asd,
}

const qwe = Schema.struct({
  description: Schema.string.annotations({
    default: "qweqweqweqw",
    description: "qwe",
    title: "Long Description",
  }),
  done: Schema.boolean.pipe(
    Schema.annotations({
      title: "Done",
    })
  ),
  dueDate: Schema.DateFromString.pipe(
    Schema.jsonSchema({
      format: "date-time",
      type: "string",
    }),
    Schema.annotations({
      description: "The task's due date",
      title: "dueDate",
    })
  ),
  name: Schema.string.pipe(
    Schema.minLength(1),
    Schema.annotations({
      default: "qweqweqweqw",
      description: "The task's name",
      examples: ["asdasd"],
      title: "Name",
    })
  ),

  rating: Schema.number.pipe(
    Schema.lessThanOrEqualTo(5),
    Schema.annotations({
      title: "rating",
    })
  ),
  recurrence: Schema.enums(ASD),
}).pipe(Schema.title("MY FORM"));

const asd = JSONSchema.make(qwe);
console.log(qwe);
console.log(asd);

const renderers = [
  ...vanillaRenderers,
  // here you can add custom renderers
];

const schema = {
  properties: {
    description: {
      title: "Long Description",
      type: "string",
    },
    done: {
      type: "boolean",
    },
    dueDate: {
      description: "The task's due date",
      format: "date-time",
      type: "string",
    },
    name: {
      description: "The task's name",
      minLength: 1,
      type: "string",
    },
    rating: {
      maximum: 5,
      type: "integer",
    },
    recurrence: {
      enum: ["Never", "Daily", "Weekly", "Monthly"],
      type: "string",
    },
    recurrenceInterval: {
      description: "Days until recurrence",
      type: "integer",
    },
  },
};

const schema1 = JSONSchema.make(qwe);
console.log(schema1);

console.log(schema);

const uischema = {
  elements: [
    {
      elements: [
        {
          placeholder: "qweqwe",
          scope: "#/properties/name",
          type: "Control",
        },
        {
          options: {
            multi: true,
          },
          scope: "#/properties/description",
          type: "Control",
        },
        {
          scope: "#/properties/done",
          type: "Control",
        },
      ],
      type: "VerticalLayout",
    },
    {
      elements: [
        {
          scope: "#/properties/dueDate",
          type: "Control",
        },
        {
          scope: "#/properties/rating",
          type: "Control",
        },
        {
          options: {
            multi: true,
          },
          scope: "#/properties/recurrence",
          type: "Control",
        },
        {
          scope: "#/properties/recurrenceInterval",
          type: "Control",
        },
      ],
      type: "VerticalLayout",
    },
  ],
  type: "HorizontalLayout",
};

export default defineComponent({
  name: "App",
  components: {
    JsonForms,
  },
  data() {
    return {
      data: {
        name: "",
        description: "Confirm if you have passed the subject\nHereby ...",
        done: true,
        recurrence: "Daily",
        rating: 3,
      },
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      schema: schema1,
      uischema, 
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.data = event.data;
    },
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 120px;
  margin-right: 120px;
}

.mylabel {
  color: darkslategrey;
}

.vertical-layout {
  margin-left: 10px;
  margin-right: 10px;
}

.myform {
  width: 640px;
  margin: 0 auto;
}

.text-area {
  min-height: 80px;
}
</style>
