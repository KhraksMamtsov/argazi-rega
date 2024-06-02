<template>
  <h1>{{ title }}</h1>
  <div class="myform">
    <form @submit.prevent="onSubmit">      
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      :uischema="uischema"
      @change="onChange"
    />
    <button type="submit">DONE</button>
    </form>
  </div>
  <div>
    <pre>{{ JSON.stringify(data, null, 1) }}</pre>
    <pre>{{ JSON.stringify(schema, null,1) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { Either } from "effect";
import { JsonForms, type JsonFormsChangeEvent } from "@jsonforms/vue";
import { 
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import {  markRaw, ref } from "vue";

import * as VisitorForm from "./Visitor.form.ts";

const schema = markRaw(VisitorForm.JSONSchema);
const renderers = markRaw([
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  ...vanillaRenderers,
  // here you can add custom renderers
]);

if (!("type" in schema)) {
  // eslint-disable-next-line functional/no-throw-statements
  throw new Error("should be object");
}

if (schema.type !== "object") {
  // eslint-disable-next-line functional/no-throw-statements
  throw new Error("should be object");
}

const uischema = markRaw({
  elements: Object.keys(schema.properties).map((prop) => ({
    scope: "#/properties/" + prop,
    type: "Control",
  })),
  type: "VerticalLayout",
});

const data = ref<Record<string, string>>({})
const title = schema.title ?? "Форма"

const emit = defineEmits({
  done: (payload: VisitorForm.VisitorForm) => VisitorForm.is(payload),
})

const onSubmit = () => {
  VisitorForm.decode(data.value).pipe(
    Either.match({
      onLeft: (error) => {
        console.log(456,error)
      },
      onRight: (type) => {
        console.log(123,type)
      }
    })
  )
}
const onChange = (event: JsonFormsChangeEvent) =>{
  Object.keys(data.value).forEach((k) => {
    delete data.value[k]
  })
  Object.entries(event.data).forEach(([k, v]) => {
    data.value[k] = v as string
  })
}
</script>
