import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
// @ts-expect-error
// import locale from 'element-plus/dist/locale/en.min.js'
import locale from 'element-plus/dist/locale/nl.min.js'
import JsonschemaForm from "./JsonschemaFormPlugin.ts";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'

const app = createApp(App);
app.use(ElementPlus, { locale })
app.use(JsonschemaForm);
app.mount("#app");
