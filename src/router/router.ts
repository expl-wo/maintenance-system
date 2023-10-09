import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/layouts";

export const sysRouter: Array<RouteRecordRaw> = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/outsideInterfaceListConfig',
    name: '02_systemGL',
    meta: {
      title: '系统管理',
      icon: 'xiTong'
    },
    children: [
      {
        path: 'menu',
        name: '0201_muneEdit',
        component: () => import('@/views/system/menu.vue'),
        meta: {
          title: '菜单编辑管理',
          icon: 'sys_005',
          keepAlive: true
        }
      },
      {
        path: 'dict',
        name: '0202_dict',
        component: () => import('@/views/system/dict/list.vue'),
        meta: {
          title: '字典管理',
          icon: 'sys_007',
          keepAlive: true
        }
      },
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/roleCateConfig',
    name: '01_permissionGL',
    meta: {
      title: '权限管理',
      icon: 'quanXian'
    },
    children: [{
      path: 'roleCate',
      name: '0101_roleCate',
      component: () => import('@/views/permission/roleCate.vue'),
      meta: {
        title: '角色分类',
        icon: 'qx_001',
        keepAlive: true
      }
    },
      {
        path: 'roleList',
        name: '0102_role',
        component: () => import('@/views/permission/roleList.vue'),
        meta: {
          title: '角色管理',
          icon: 'qx_002',
          keepAlive: true
        }
      },
      {
        path: 'roleDist',
        name: '0103_userRole',
        component: () => import('@/views/permission/roleDist.vue'),
        meta: {
          title: '角色分配',
          icon: 'qx_003',
          keepAlive: true
        }
      }
    ]
  },
]
