import {RouteRecordRaw} from "vue-router";
import {Layout} from "@/_public/layouts";
import {useGlobalConfig} from "element-plus";

export const sysRouter: Array<RouteRecordRaw> = [
    {
        path: '/sys',
        component: Layout,
        meta: {},
        children: [
            {
                path: 'dict',
                component: () => import('@/sys/views/dict/list.vue'),
                name: 'sysDict',
                meta: {title: '字典配置', affix: false}
            },
            {
                path: 'param',
                component: () => import('@/sys/views/param/list.vue'),
                name: 'sysParam',
                meta: {title: '参数配置', affix: false}
            },
            {
                path: 'user',
                component: () => import('@/sys/views/user/list.vue'),
                name: 'user',
                meta: {title: '用户管理', affix: false}
            },
            {
                path: 'permission',
                // component: () => defineAsyncComponent(() => import(`@/sys/views/menu/list.vue`)), 异步方式
                component: () => import(`@/sys/views/permission/list.vue`),
                name: 'sysPermission',
                meta: {title: '菜单管理', affix: false}
            },
            {
                path: 'role',
                component: () => import('@/sys/views/role/list.vue'),
                name: 'role',
                meta: {title: '角色管理', affix: false}
            },
            {
                path: 'loginHistory',
                component: () => import('@/sys/views/loginHistory/list.vue'),
                name: 'loginHistory',
                meta: {title: '用户登录记录', affix: false}
            },
            {
                path: 'organization',
                component: () => import('@/sys/views/organization/list.vue'),
                name: 'organization',
                meta: {title: '部门管理', affix: false}
            },
            {
                path: 'dataPermissionOrg',
                component: () => import('@/sys/views/dataPermissionOrg/list.vue'),
                name: 'dataPermissionOrg',
                meta: {title: '数据归属部门管理', affix: false}
            },
            {
                path: 'log',
                component: () => import('@/sys/views/log/list.vue'),
                name: 'sysLog',
                meta: {title: '日志管理', affix: false}
            },
        ]
]
