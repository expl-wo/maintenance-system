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
      {
        path: 'user',
        name: 'yongHuLB20003',
        component: () => import('@/views/system/user.vue'),
        meta: {
          title: '用户列表',
          icon: 'sys_003',
          keepAlive: true
        }
      },
      {
        path: 'organization',
        name: 'zuZhiJGLB20004',
        component: () => import('@/views/system/organization.vue'),
        meta: {
          title: '组织结构列表',
          icon: 'sys_004',
          keepAlive: true
        }
      },
      {
        path: 'wkclazz',
        name: 'bzshezhi20010',
        component: () => import('@/views/system/wkclazz.vue'),
        meta: {
          title: '班组信息',
          icon: 'sys_004',
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
  {
    path: '/ps',
    component: Layout,
    redirect: '/ps/productConfig',
    name: '04_planGL',
    meta: {
      title: '计划管理',
      icon: 'qx_003'
    },
    children: [
      {
        path: 'baseData',
        name: '0403_basedata',
        component: () => import('@/views/ps/baseData/index.vue'),
        meta: {
          title: '基础数据管理',
          icon: 'qx_001',
          keepAlive: true
        },
        children: [
          //期量配置
          // {
          //   //电压等级月产能
          //   path: 'ps_037_transformerClass',
          //   name: 'mesGYBD50054',
          //   hidden: true,
          //   component: () => import('@/views/ps/ps_037_transformerClass'),
          //   meta: {
          //     title: '电压等级月产能',
          //     icon: 'ps_011'
          //   }
          // },
          {
            //期量表配置
            path: 'timeLimitConfig',
            name: '040301_limitSet',
            component: () => import('@/views/ps/timeLimit/timeLimitConfig.vue'),
            meta: {
              title: '期量表配置',
              icon: 'ps_011'
            }
          },
          {
            //设计型号与工艺类型
            path: 'timeLimitModel',
            name: 'mesLIMIT_MODEL',
            component: () => import('@/views/ps/timeLimit/timeLimitModel.vue'),
            meta: {
              title: '设计型号与期量表匹配',
              icon: 'ps_011'
            }
          },
          {
            path: 'ps_050_dryingManage',
            component: () => import('@/views/ps/baseData/dryingManage/index.vue'),
            name: 'mesGYBD50050',
            meta: {
              title: '干燥罐管理',
              icon: 'ps_011',
              keepAlive: true
            }
          },
          {
            path: 'ps_052_DryingRuleConfig',
            component: () => import('@/views/ps/baseData/dryingRuleConfig/index.vue'),
            name: 'mesGYBD50052',
            meta: {
              title: '入炉规则管理',
              icon: 'ps_011',
              keepAlive: true
            }
          },
          // {
          //   path: 'ps_052_FlipTable',
          //   component: () => import('@/views/ps/baseData/flipTable/index'),
          //   hidden: true,
          //   name: 'mesGYBD50053',
          //   meta: {
          //     title: '翻转台管理',
          //     icon: 'ps_011',
          //     keepAlive: true
          //   }
          // },
          {
            path: 'ps_051_freezeReason',
            component: () => import('@/views/ps/baseData/freezeReason/index.vue'),
            name: 'mesGYBD50051',
            meta: {
              title: '冻结原因管理',
              icon: 'ps_011',
              keepAlive: true
            }
          },
          {
            path: 'ps_025_nodeData',
            name: '040304_nodeBasedata',
            component: () => import('@/views/ps/ps_025_nodeData.vue'),
            meta: {
              title: '节点基础数据',
              icon: 'ps_011'
            }
          },
          {
            path: 'ps_027_NodeSetConditions',
            name: '040305_nodeRelation',
            component: () => import('@/views/ps/ps_027_NodeSetConditions.vue'),
            meta: {
              title: '节点先后逻辑关系',
              icon: 'ps_011'
            }
          },
          {
            path: 'ps_33_nodeCoordinate',
            name: '040306_nodePosition',
            component: () => import('@/views/ps/ps_33_nodeCoordinate.vue'),
            meta: {
              title: '节点坐标管理',
              icon: 'ps_011'
            }
          },
          // {
          //   path: 'ps_028_nodeWeekYield',
          //   name: 'mesJDCL50028',
          //   hidden: true,
          //   component: () => import('@/views/ps/ps_028_nodeWeekYield'),
          //   meta: {
          //     title: '节点周产量',
          //     icon: 'ps_011'
          //   }
          // },
          {
            path: 'ps_023_classifyAndNodeContact',
            name: 'mesWLFLYGJJDGX50023',
            component: () => import('@/views/ps/ps_023_classifyAndNodeContact.vue'),
            meta: {
              title: '物料分类与采购节点',
              icon: 'ps_011'
            }
          },
          {
            path: 'ps_024_featureNumberAndNodeContact',
            name: 'mesTZTZHYGXJDGX50024',
            component: () => import('@/views/ps/ps_024_featureNumberAndNodeContact.vue'),
            meta: {
              title: '图纸特征号与设计节点',
              icon: 'ps_011'
            }
          },
          // {
          //   path: 'ps_29_nodeAndPlm',
          //   name: 'mesSYJH50029',
          //   hidden: true,
          //   component: () => import('@/views/ps/ps_29_nodeAndPlm'),
          //   meta: {
          //     title: 'PLM工序对应节点',
          //     icon: 'ps_011'
          //   }
          // },
          // {
          //   path: 'ps_034_processTemplateHb',
          //   name: 'mesGYMBHB50034',
          //   hidden: true,
          //   component: () => import('@/views/ps/ps_034_processTemplateHb'),
          //   meta: {
          //     title: 'MES工艺模板(本部)',
          //     icon: 'ps_011'
          //   }
          // },
          // {
          //   path: 'ps_30_childProcessTemplateHead',
          //   name: 'mesCPTH50030',
          //   hidden: true,
          //   component: () => import('@/views/ps/ps_30_childProcessTemplateHead'),
          //   meta: {
          //     title: 'PLM工序对应子工艺模板头',
          //     icon: 'ps_011'
          //   }
          // },
          // {
          //   path: 'ps_31_childProcessTemplateHeadContact',
          //   name: 'mesCPTHC50031',
          //   hidden: true,
          //   component: () => import('@/views/ps/ps_31_childProcessTemplateHeadContact'),
          //   meta: {
          //     title: '子工艺模板头先后关系',
          //     icon: 'ps_011'
          //   }
          // },
        ]
      },
      {
        path: 'MesOrderPool',
        name: '0401_orderPools',
        component: () => import('@/views/ps/timeLimit/HNGCMesOrderPool.vue'),
        meta: {
          title: '计划工单池',
          icon: 'qx_002',
          keepAlive: true
        }
      },
      {
        //生产主计划
        path: 'ps_031_main',
        name: '0402_mainPlan',
        component: () => import('@/views/ps/planMain/ps_031_main.vue'),
        meta: {
          title: '生产主计划',
          icon: 'ps_011'
        }
      }],
  },
  {
    path: '/overhaul',
    component: Layout,
    redirect: '/overhaul/survey',
    name: 'overhaul',
    meta: {
      title: '检修管理',
      icon: 'xiTong'
    },
    children: [
      {
        path: 'device',
        name: 'deviceList',
        component: () => import('@/views/overhaul/device/index.vue'),
        meta: {
          title: '视频设备列表',
          icon: 'sys_005',
          keepAlive: true
        }
      },
      {
        path: 'templateLib',
        component: Layout,
        redirect: '/overhaul/templateLib/safetyInstruction',
        name: '模板库管理',
        meta: {
          title: '模板库管理',
          icon: 'excel'
        },
        children: [
          {
            path: 'safetyInstruction',
            component: () => import('@/views/overhaul/templateLib/safetyInstruction/index.vue'),
            name: '安全须知模板',
            meta: {
              title: '安全须知模板', icon: 'sys_005',
              keepAlive: true
            }
          },
          {
            path: 'doc',
            component: () => import('@/views/overhaul/templateLib/docTemp/index.vue'),
            name: '文档模板',
            meta: {
              title: '文档模板', icon: 'sys_005',
              keepAlive: true
            }
          },
          {
            path: 'deviceListTemp',
            component: () => import('@/views/overhaul/templateLib/deviceListTemp/index.vue'),
            name: '设备清单模板',
            meta: {
              title: '设备清单模板', icon: 'sys_005',
              keepAlive: true
            }
          },
          {
            path: 'bomTemp',
            component: () => import('@/views/overhaul/templateLib/bomTemp/index.vue'),
            name: '拆解BOM模板',
            meta: {
              title: '拆解BOM模板', icon: 'sys_005',
              keepAlive: true
            }
          },
        ]
      },
      {
        path: 'sysConfig',
        name: 'businessTeamConfig',
        component: () => import('@/views/overhaul/sysConfig/businessTeamConfig/index.vue'),
        meta: {
          title: '业务班组配置',
          icon: 'sys_005',
          keepAlive: true
        }
      },
      {
        path: 'survey',
        name: 'survey',
        component: () => import('@/views/overhaul/survey/index.vue'),
        meta: {
          title: '勘察工单管理',
          icon: 'sys_005',
          keepAlive: true
        }
      },
      {
        path: 'overhaulOrder',
        name: 'overhaulOrder',
        component: () => import('@/views/overhaul/overhaulOrder/index.vue'),
        meta: {
          title: '检修工单管理',
          icon: 'sys_005',
          keepAlive: true
        }
      },
      // 日志管理
      {
        path: 'log',
        name: 'log',
        redirect: '/overhaul/log/operation',
        meta: {
          title: '日志管理',
          icon: 'el-icon-notebook-2'
        },
        children: [
          {
            path: 'operation',
            name: '操作日志',
            component: () => import('@/views/overhaul/log/operation/index.vue'),
            meta: {
              title: '操作日志', icon: 'sys_005',
              keepAlive: true
            },
          },
          {
            path: 'clockIn',
            name: '打卡日志',
            component: () => import('@/views/overhaul/log/clockIn/index.vue'),
            meta: {
              title: '打卡日志', icon: 'sys_005',
              keepAlive: true
            },
          }
        ]
      },
       // 个人中心
       {
        path: 'profile',
        name: 'profile',
        redirect: '/overhaul/profile/myNotice',
        meta: {
          title: '个人中心',
          icon: 'el-icon-notebook-2'
        },
        children: [
          {
            path: 'myNotice',
            name: '我的通知',
            component: () => import('@/views/overhaul/profile/myNotice/index.vue'),
            meta: {
              title: '我的通知', icon: 'sys_005',
              keepAlive: true
            },
          },
          {
            path: 'myTask',
            name: '我的任务',
            component: () => import('@/views/overhaul/profile/myTask/index.vue'),
            meta: {
              title: '我的任务', icon: 'sys_005',
              keepAlive: true
            },
          }
        ]
      },
      //检修问题库
      {
        path: 'problemLib',
        name: 'problemLib',
        component: () => import('@/views/overhaul/problemLib/index.vue'),
        meta: {
          title: '检修问题库',
          icon: 'sys_005',
          keepAlive: true
        }
      }
    ]
  },
]
