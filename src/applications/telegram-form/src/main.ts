import "@jsonforms/vue-vanilla/vanilla.css";

import { createApp } from "vue";

import App from "./App.vue";
import Start from "./Start.vue";
import NotFound from "./NotFound.vue";
import VisitorForm from "./forms/Visitor.form.vue";

import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";
import { URLSearchParamsEnv } from "./forms/Env.schema";

const routes = [
  { path: "/visitor", component: VisitorForm },
  { path: "/", component: Start },
  { path: "/404", component: NotFound },
  { path: "/:pathMatch(.*)*", component: NotFound },
] satisfies ReadonlyArray<RouteRecordRaw>;

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const URLEnv = URLSearchParamsEnv.fromURL(new URL(window.location.href));

console.log(URLEnv);

createApp(App, {
  apiURL: "asdasd22",
})
  .use(router)
  .mount("#app");
