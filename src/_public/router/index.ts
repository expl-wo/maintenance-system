import {createRouter, createWebHashHistory} from "vue-router";
import {sysRouter} from '@/sys/router'
import {toolRouter} from "@/tool/router";
import {Layout, mapTwoLevelRouter} from "@/_public/layouts";
import {RouteRecordRaw} from 'vue-router'

/**
 * 这里存放一些系统必要的路由，不需要权限控制。如：登录、重定向、404等，可以根据自己的实际情况进行修改
 */
export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/main',
    },
    {
        path: "/main",
        name: "main",
        component: () => import("@/_public/views/index/home.vue"),
        meta: {}
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/_public/views/login/index.vue"),
        meta: {}
    },
    {
        path: "/loginUserCode",
        name: "loginUserCode",
        component: () => import("@/_public/views/login/indexUserCode.vue"),
        meta: {}
    },
    {
        path: "/405",
        name: "405",
        component: (): any => import("@/_public/views/exception/404.vue"),
        meta: {}
    },
    ...sysRouter,
    ...toolRouter,
    {
        path: '/:pathMatch(.*)*',
        component: Layout,
        redirect: '/404',
        meta: {},
        children: [
            {
                path: '/404',
                component: () => import('@/_public/views/exception/404.vue'),
                name: '404',
                meta: {title: '404', affix: false}
            },
        ]
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: mapTwoLevelRouter(constantRoutes),
});

export default router;
