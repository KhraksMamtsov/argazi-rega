<template>
  <h1>{{ title }}</h1>
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
import { JSONSchema, AST } from "@effect/schema";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import { Option } from "effect";
import { defineComponent } from "vue";

import { VisitorJson } from "./Visitor.form.ts";
// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

const schema = JSONSchema.make(VisitorJson);

console.log("schema: ", schema);

const renderers = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  ...vanillaRenderers,
  // here you can add custom renderers
];
if (!("type" in schema)) {
  // eslint-disable-next-line functional/no-throw-statements
  throw new Error("should be object");
}

if (schema.type !== "object") {
  // eslint-disable-next-line functional/no-throw-statements
  throw new Error("should be object");
}

const uischema = {
  elements: Object.keys(schema.properties).map((prop) => ({
    scope: "#/properties/" + prop,
    type: "Control",
  })),
  type: "VerticalLayout",
};

export default defineComponent({
  name: "VisitorForm",
  components: {
    JsonForms,
  },
  data() {
    return {
      title: Option.getOrElse(
        AST.getTitleAnnotation(VisitorJson.ast),
        () => "www"
      ),
      data: {},
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      schema,
      uischema,
    };
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
