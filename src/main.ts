import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./utils/router";
import ElementPlus from "element-plus";
import '@/styles/index.scss' // global css
import '@/styles/x6.scss' // global css
import "element-plus/dist/index.css";
import "dayjs/locale/zh-cn";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import 'normalize.css/normalize.css'
import "@/icons/iconfont/iconfont.css";
import "@/icons/iconfont/iconfont.js";
import "@/styles/xui/xui.scss"
import "@/styles/main.scss";
import "@/styles/el-reset.scss";
import Constants from '@/utils/constants'
// import Print from 'vue-print-nb'
import LayoutStore from "@/layouts";
import http from "@/utils/http";
import * as Icons from "@element-plus/icons-vue";
import pinia from "./store/pinia";
import {install} from '@/components/xui'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import {isAuth} from "@/utils/control";


import "./setting";

const app = createApp(App);
//注册xui组件
install(app);
Object.keys(Icons).forEach((it) => {
  app.component(it, (Icons as any)[it]);
});
app.use(LayoutStore, {
  state: {
    layoutMode: "ltr",
  },
  actions: {
    onPersonalCenter() {
      router.push({ path: "/personal", query: { uid: 1 } });
    },
    onLogout() {
      router.replace({ path: "/login"}).then(() => {
        window.location.reload();
      });
    },
  },
});
//app.use(Print)
app.config.globalProperties.$isAuth = isAuth;
app.config.globalProperties.$constants = Constants;
app.use(pinia).use(router);
app.use(ElementPlus, {
  locale: zhCn,
  size: 'small'
});
app.use(http);
app.mount("#app");
