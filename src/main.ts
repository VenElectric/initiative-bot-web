import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Tooltip from "primevue/tooltip";
import store from "./data/store";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

createApp(App)
  .provide("store", store)
  .directive("tooltip", Tooltip)
  .use(PrimeVue)
  .use(ConfirmationService)
  .use(ToastService)
  .use(router)
  .mount("#app");
