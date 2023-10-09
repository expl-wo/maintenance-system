import {createRouter, createWebHashHistory} from "vue-router";
import {toolRouter} from "@/tool/router";
import {sysRouter} from "@/router/router";
import {Layout, mapTwoLevelRouter} from "@/layouts";
import {RouteRecordRaw} from 'vue-router'

/**
 * 这里存放一些系统必要的路由，不需要权限控制。如：登录、重定向、404等，可以根据自己的实际情况进行修改
 */
export const constantRoutes = [
    {
        path: '/showdashboard',
        component: () => import("@/views/dashboard/outindex.vue"),
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            component: () => import("@/views/dashboard/index.vue"),
            name: 'Dashboard',
            meta: {
                title: '首页',
                icon: 'em_002_002',
                affix: true
            }
        }]
    },
    {
        path: "/main",
        name: "main",
        component: () => import("@/views/index/home.vue"),
        meta: {}
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login/index.vue"),
        meta: {}
    },
    {
        path: '/ps_025_nodeData',
        name: 'mesND50054',
        component: () => import('@/views/ps/ps_025_nodeData.vue'),
        meta: {
            title: '节点基础数据',
            icon: 'ps_011'
        }
    },
    {
        path: "/loginUserCode",
        name: "loginUserCode",
        component: () => import("@/views/login/indexUserCode.vue"),
        meta: {}
    },
    {
        path: "/405",
        name: "405",
        component: (): any => import("@/views/exception/404.vue"),
        meta: {}
    },
    ...sysRouter,
    ...toolRouter,

]

const router = createRouter({
    history: createWebHashHistory(),
    routes: mapTwoLevelRouter(constantRoutes),
});

export default router;
