/*──────────────────────────────────────────────*
 |                                              |
 |    _____  _                                  |
 |   | ____|(_)                                 |
 |   |  _|  | |                                 |
 |   | |___ | |                                 |
 |   |_____|/ |                                 |
 |        |__/                                  |
 |                                              |
 |    🔧 Crafted with 🖤 by Ej                  |
 |    🔗 github.com/Ejay02                      |
 |    🚀 Clean. Scalable. Sharp.                |
 |                                              |
 *──────────────────────────────────────────────*/
import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import VueApolloComponents from "@vue/apollo-components";
import { apolloClient } from "../apollo-client";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index.js";
import { setupCalendar, Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";
import draggable from "vuedraggable";
import socketPlugin from "./socket/socket.plugin.js";

// const app = createApp(App);

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.use(VueApolloComponents);

app.use(setupCalendar, {});

app.use(socketPlugin);

app.component("VCalendar", Calendar);
app.component("draggable", draggable);
app.component("VDatePicker", DatePicker);

app.mount("#app");
