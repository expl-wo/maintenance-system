import { createApp } from "vue";
import App from "./App.vue";
import router from "./_public/router";
import "./_public/utils/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "dayjs/locale/zh-cn";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "@/_public/icons/iconfont/iconfont.css";
import "@/_public/icons/iconfont/iconfont.js";
import "@/_public/styles/main.scss";
import "@/_public/styles/el-reset.scss";
import "@/_public/styles/xui/xui.scss"

import LayoutStore from "@/_public/layouts";
import http from "@/_public/utils/http";
import * as Icons from "@element-plus/icons-vue";
import pinia from "./_public/store/pinia";
import {install} from '@/_public/components/xui'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import {isAuth} from "@/_public/utils/control";

import "./_public/setting";

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
app.config.globalProperties.$isAuth = isAuth;
app.use(pinia).use(router);
app.use(ElementPlus, {
  locale: zhCn,
  size: 'small'
});
app.use(http);
app.mount("#app");
