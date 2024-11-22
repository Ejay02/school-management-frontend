import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index.js";
import { setupCalendar, Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

// Use plugin defaults (optional)
app.use(setupCalendar, {});

// Use the components

app.component("VCalendar", Calendar);
app.component("VDatePicker", DatePicker);

app.mount("#app");
