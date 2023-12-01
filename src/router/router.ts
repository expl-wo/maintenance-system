import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/layouts";

export const sysRouter : Array<RouteRecordRaw> = [
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
			{
				path: 'element',
				name: '0203_element',
				component: () => import('@/views/system/element/list.vue'),
				meta: {
					title: '参数管理',
					icon: 'sys_004',
					keepAlive: true
				}
			},
			{
				path: 'userLoginStatistics',
				name: '0204_userLogin',
				component: () => import('@/views/system/userLoginStatistics.vue'),
				meta: {
					title: '用户登录统计',
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
				//试验计划审批
				path: 'ps_041_mainApproval',
				name: '0406ExperimentApproval',
				component: () => import('@/views/ps/planExperiment/ps_041_main.vue'),
				meta: {
					title: '试验计划审批',
					icon: 'ps_011',
				}
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
			},
			{
				//生产主计划编制
				path: 'ps_050_main_arrange',
				name: 'ps_050_main_arrange',
				component: () => import('@/views/ps/planMainArrange/mainArrange.vue'),
				meta: {
					title: '生产主计划编制',
					icon: 'ps_011',
					keepAlive: true
				}
			},
			{
				//生产主计划审批
				path: 'ps_051_main_approval',
				name: 'ps_051_main_approval',
				component: () => import('@/views/ps/planMainArrange/mainArrange.vue'),
				meta: {
					title: '生产主计划审批',
					icon: 'ps_011',
					keepAlive: true,
					keepAliveName: ['ps_050_main_arrange']
				}
			},
			{
				//生产主计划查看
				path: 'ps_052_main_view',
				name: 'ps_052_main_view',
				component: () => import('@/views/ps/planMainArrange/mainArrange.vue'),
				meta: {
					title: '生产主计划查看',
					icon: 'ps_011',
					keepAlive: true,
					keepAliveName: ['ps_050_main_arrange']
				}
			},
			{
				//入炉计划
				path: '0404planFurnace',
				name: '0404planFurnace',
				component: () => import('@/views/ps/planFurnace/ps_040_entryFurnace.vue'),
				meta: {
					title: '入炉计划',
					icon: 'ps_011'
				}
			},
			{
				//入炉计划审批
				path: '0405planFurnaceApproval',
				name: '0405planFurnaceApproval',
				component: () => import('@/views/ps/planFurnace/ps_040_entryFurnace.vue'),
				meta: {
					title: '入炉计划审批',
					icon: 'ps_011'
				}
			},
			{
				//试验计划
				path: 'ps_041_main',
				name: '0406Experiment',
				component: () => import('@/views/ps/planExperiment/ps_041_main.vue'),
				meta: {
					title: '试验计划查看',
					icon: 'ps_011',
					keepAlive: true
				}
			},
			{
				//试验计划审批
				path: 'ps_041_mainApproval',
				name: '0406ExperimentApproval',
				component: () => import('@/views/ps/planExperiment/ps_041_main.vue'),
				meta: {
					title: '试验计划审批',
					icon: 'ps_011',
					keepAlive: true
				}
			},
			{
				//试验计划(新)
				path: 'ps_041_mainTentative',
				name: '0406ExperimentTentative',
				component: () => import('@/views/ps/planExperiment/ps_041_main.vue'),
				meta: {
					title: '试验计划编制',
					icon: 'ps_011',
					keepAlive: true
				}
			},
			// {
			// 	//工单二维码
			// 	path: 'ps_020_workOrderQRCode',
			// 	name: '0403qrCode',
			// 	component: () => import('@/views/ps/ps_020_workOrderQRCode.vue'),
			// 	meta: {
			// 		title: '工单二维码',
			// 		icon: 'ps_011'
			// 	}
			// },
		{
        //拆解计划
        path: '0407dismantling_plan',
        name: '0407DismantlingPlan',
        component: () => import('@/views/ps/planDismantle/ps_dismant_main.vue'),
        meta: {
          title: '拆解计划',
          icon: 'ps_011',
          keepAlive: true
        }
      },
      {
        //拆解计划审批
        path: '0407dismantling_plan_approval',
        name: '0406DismantlingApproval',
        component: () => import('@/views/ps/planDismantle/ps_dismant_main.vue'),
        meta: {
          title: '拆解计划审批',
          icon: 'ps_011',
          keepAlive: true
        }
      },
			{
				path: 'ps_004_mbom',
				name: 'mbom',
				component: () => import('@/views/ps/ps_004_mbom.vue'),
				meta:{
					title: 'MBOM管理',
					icon: 'ps_011'
				}
			},
      ],
  },
  {
    path: '/api/equipment/overHaul',
    component: Layout,
    redirect: '/api/equipment/overHaul/survey',
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
        redirect: '/api/equipment/overHaul/templateLib/safetyInstruction',
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
        redirect: '/api/equipment/overHaul/log/operation',
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
        redirect: '/api/equipment/overHaul/profile/myNotice',
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
	{
		path: '/baseData',
		component: Layout,
		redirect: '/baseData/baseDataConfig',
		name: '06_BaseDataGL',
		meta: {
			title: '基础数据',
			icon: 'qx_003'
		},
		children: [
			{
				path: 'plan_baseData',
				name: 'plan_baseData',
				component: () => import('@/views/ps/baseData/index.vue'),
				meta: {
					title: '计划',
					icon: 'qx_001',
					keepAlive: true
				},
				children: [
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
						path: 'ps_051_freezeReason',
						component: () => import('@/views/ps/baseData/freezeReason/index.vue'),
						name: 'mesGYBD50051',
						meta: {
							title: '冻结原因管理',
							icon: 'ps_011',
							keepAlive: true
						}
					},
				]
			},
			{
				path: 'process_baseData',
				name: 'process_baseData',
				component: () => import('@/views/ps/baseData/index.vue'),
				meta: {
					title: '工艺',
					icon: 'qx_001',
					keepAlive: true
				},
				children: [
					{
						path: 'ps_029_nodeAndPlm',
						name: '040312_nodeAnd',
						component: () => import('@/views/ps/ps_029_nodeAndPlm.vue'),
						meta:{
							title: '生产节点与标准工序',
							icon: 'ps_011'
						}
					},
					{
						path: 'classIndex',
						name: '040317_classIndex',
						component: () => import('@/views/ps/baseData/baseDataType/classIndex.vue'),
						meta: {
							title: '中工序需求数据配置',
							icon: 'ps_011'
						}
					},
					{
						path: 'ps_30_childProcessTemplateHead',
						name: '040313_childProcessTemplate',
						component: () => import('@/views/ps/baseData/ps30ChildProcessTemplateHead/index.vue'),
						meta:{
							title: '标准工序与中工序',
							icon: 'ps_011'
						}
					},
					{
						path: 'ps_31_childProcessTemplateHeadContact',
						name: '040316_TemplateHeadContact',
						component: () => import('@/views/ps/baseData/ps31ChildProcessTemplateHeadContact/index.vue'),
						meta:{
							title: '中工序与工步',
							icon: 'ps_011'
						}
					},
					{
						//工步管理
						path: 'ps_50_workContent',
						name: 'workContent',
						component: () => import('@/views/ps/baseData/ps50WorkContent/list.vue'),
						meta: {
							title: '工步与工作内容',
							icon: 'ps_011'
						}
					},
					{
						path: 'ps34ProcessTemplateHngc',
						name: '040307_mesProcessModel',
						component: () => import('@/views/ps/baseData/ps34ProcessTemplateHngc/index.vue'),
						meta:{
							title: 'MES工艺模板',
							icon: 'ps_011'
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
				]
			},
			{
				path: 'Andon_baseData',
				name: 'Andon_baseData',
				component: () => import('@/views/ps/baseData/index.vue'),
				meta: {
					title: '安灯',
					icon: 'qx_001',
					keepAlive: true
				},
				children: [
					{
						path: 'AndonBasisConfig',
						name: 'AndonBasisConfig',
						component: () => import('@/views/andon/pm_001_andonBasisConfig.vue'),
						meta:{
							title: 'Andon基础配置',
							icon: 'ps_011'
						}
					},
				]
			},
			{
				path: 'production_baseData',
				name: 'production_baseData',
				component: () => import('@/views/ps/baseData/index.vue'),
				meta: {
					title: '生产',
					icon: 'qx_001',
					keepAlive: true
				},
				children: [
					{
						path: 'factoryCalendar',
						name: 'factoryCalendar',
						meta:{
							title: '工厂日历',
							icon: 'ps_011'
						},
						children: [{
							path: 'factoryCalendarTime',
							name: 'factoryCalendarTime',
							component: () => import('@/views/production/calendar/pm_001_calendarTime.vue'),
							meta: {
								title: '日工作时间模板',
								icon: 'pm_002_001',
								keepAlive: true
							}
						},
							{
								path: 'factoryCalendarConfig',
								name: 'factoryCalendarConfig',
								component: () => import('@/views/production/calendar/pm_002_calendarConfig.vue'),
								meta: {
									title: '日历设置',
									icon: 'pm_002_002',
									keepAlive: true
								}
							},
						]
					},
				]
			},
		],
	},

	{
		path: '/equip',
		component: Layout,
		name: '03_equipmentGL',
		meta: {
			title: '设备管理',
			icon: 'sheBei'
		},
		children: [
			{
				path: 'baseData',
				component: Layout,
				name: '0301_baseData',
				meta: {
					title: '基础数据',
					icon: 'em_001',
					keepAlive: true
				},
				children: [{
					path: 'equipParameter',
					component: () => import('@/views/em/emBasicData/equipParameter.vue'),
					name: '030101_equipParameter',
					meta: {
						title: '设备台账',
						icon: 'em_002_001',
						keepAlive: true
					},
				}, {
					path: 'equipDetail',
					component: () => import('@/views/em/emBasicData/equipDetail.vue'),
					name: '030102_equipDetail',
					meta: {
						title: '运维记录',
						icon: 'em_002_001',
						keepAlive: false
					},
				},
				{
					path: 'equipPrint',
					component: () => import('@/views/em/emBasicData/equipPrint.vue'),
					name: '030103_equipPrint',
					meta: {
						title: '二维码打印'
					},
				},
				{
					path: 'classIndex',
					component: () => import('@/views/em/emBasicData/classIndex.vue'),
					name: '030104_classIndex',
					meta: {
						title: '设备分类',
						icon: 'em_002_002',
						keepAlive: true
					}
				},{
					path: 'equipLevel',
					component: () => import('@/views/em/emBasicData/levelIndex.vue'),
					name: '030105_equipLevel',
					meta: {
						title: '设备分类',
						icon: 'em_002_002',
						keepAlive: true
					}
				}]
			},{
				path: 'check',
				component: Layout,
				name: '0302_check',
				meta: {
					title: '设备点检',
					icon: 'em_002',
					keepAlive: true
				},
				children : [{
					path: 'checkPlan',
					component: () => import('@/views/em/emCheck/emCheck_001_Plan.vue'),
					name: '030201_checkPlan',
					meta: {
						title: '点检配置',
						icon: 'em_002_001',
						keepAlive: true
					},
				},{
					path: 'checkRecord',
					component: () => import('@/views/em/emCheck/emCheck_002_Record.vue'),
					name: '030202_checkRecord',
					meta: {
						title: '点检记录',
						icon: 'em_002_002',
						keepAlive: true
					},
				}]
			},{
				path: 'maintenance',
				component: Layout,
				name: '0303_maintenance',
				meta: {
					title: '设备保养',
					icon: 'em_002',
					keepAlive: true
				},
				children : [{
					path: 'plan',
					component: () => import('@/views/em/emMaintenance/emMaintenance_001_plan.vue'),
					name: '030301_maintenancePlan',
					meta: {
						title: '保养配置',
						icon: 'em_002_001',
						keepAlive: true
					},
				},{
					path: 'order',
					component: () => import('@/views/em/emMaintenance/emMaintenance_002_repairOrder.vue'),
					name: '030302_order',
					meta: {
						title: '保养派工',
						icon: 'em_002_002',
						keepAlive: true
					},
				},{
					path: 'record',
					component: () => import('@/views/em/emMaintenance/emMaintenance_003_record.vue'),
					name: '030303_record',
					meta: {
						title: '保养记录',
						icon: 'em_002_002',
						keepAlive: true
					},
				}]
			},{
				path: 'repair',
				component: Layout,
				name: '0304_repair',
				meta: {
					title: '设备维修',
					icon: 'em_004',
					keepAlive: true
				},
				children : [{
					path: 'basicData',
					component: () => import('@/views/em/emRepair/emRepair_001_basicData.vue'),
					name: '030401_basicData',
					meta: {
						title: '设备维修基础数据管理',
						icon: 'em_004_001',
						keepAlive: true
					},
				},{
					path: 'record',
					component: () => import('@/views/em/emRepair/emRepair_002_record.vue'),
					name: '030402_repairRecord',
					meta: {
						title: '维修记录',
						icon: 'em_004_002',
						keepAlive: true
					},
				}]
			},{
				path: 'integrityAppraisal',
				component: Layout,
				name: '0305_integrityAppraisal',
				meta: {
					title: '设备鉴定',
					icon: 'em_005',
					keepAlive: true
				},
				children : [{
					path: 'plan',
					component: () => import('@/views/em/emIntegrityAppraisal/integrityAppraisal.vue'),
					name: '030501_plan',
					meta: {
						title: '鉴定配置',
						icon: 'em_005_001',
						keepAlive: true
					},
				},{
					path: 'record',
					component: () => import('@/views/em/emIntegrityAppraisal/appraisalTask.vue'),
					name: '030502_record',
					meta: {
						title: '鉴定记录',
						icon: 'em_005_002',
						keepAlive: true
					},
				}]
			}
		]
	},
	{
		path: '/andon',
		component: Layout,
		name: '08_andonGL',
		meta: {
			title: 'Andon管理',
			icon: 'qx_003'
		},
		children: [
			{
				path: 'andonEventList',
				name: 'andonEventList',
				component: () => import('@/views/ps/baseData/index.vue'),
				meta:{
					title: 'Andon事件列表',
					icon: 'ps_011'
				}
			},
		]
	},
]
