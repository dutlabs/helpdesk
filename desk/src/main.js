import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import {
  frappeRequest,
  resourcesPlugin,
  setConfig,
  Badge,
  Button,
  Dialog,
  ErrorMessage,
  FeatherIcon,
  FormControl,
  Input,
  Tooltip,
  TextInput,
} from "frappe-ui";
import App from "./App.vue";
import "./index.css";
import { router } from "./router";
import { socket } from "./socket";
import { createToast } from "@/utils";
import translationPlugin from "./translation";
import { messages as en_messages } from "@/locale/en";
import { messages as pt_messages } from "@/locale/pt";

const globalComponents = {
  Badge,
  Button,
  Dialog,
  ErrorMessage,
  FeatherIcon,
  FormControl,
  Input,
  Tooltip,
  TextInput,
};

setConfig("resourceFetcher", frappeRequest);
setConfig("fallbackErrorHandler", (error) => {
  createToast({
    title: error.exc_type || __("Error"),
    text: (error.messages || []).join(", "),
    icon: "alert-triangle",
    iconClasses: "text-red-500",
  });
});

const i18n = createI18n({
  legacy: false,
  locale: "pt-BR", // fetch from settings
  fallbackLocale: "en",
  messages: {
    en: en_messages,
    pt: pt_messages,
  },
});
const pinia = createPinia();
const app = createApp(App);

app.use(resourcesPlugin);
app.use(i18n);
app.use(pinia);
app.use(router);
app.use(translationPlugin);

for (const c in globalComponents) {
  app.component(c, globalComponents[c]);
}

app.config.globalProperties.$socket = socket;
app.config.globalProperties.$toast = createToast;

if (import.meta.env.DEV) {
  frappeRequest({
    url: "/api/method/helpdesk.www.helpdesk.index.get_context_for_dev",
  }).then((values) => {
    for (let key in values) {
      window[key] = values[key];
    }
    app.mount("#app");
  });
} else {
  app.mount("#app");
}
