import {RouteRecordRaw} from "vue-router";
import {Layout} from "@/_public/layouts";

export const toolRouter: Array<RouteRecordRaw> = [
    {
        path: '/tool',
        component: Layout,
        meta: {},
        children: [{
            path: 'generator',
            component: () => import('@/tool/views/generator/index.vue'),
            name: 'toolGenerator',
            meta: {title: '代码生成管理', affix: false, keepAlive: true}
        },
            {
                path: 'file',
                component: () => import('@/tool/views/file/index.vue'),
                name: 'toolFile',
                meta: {title: '上传文件', affix: false, keepAlive: true}
            }
        ]
]
