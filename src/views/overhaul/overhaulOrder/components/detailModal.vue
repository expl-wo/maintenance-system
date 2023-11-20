<template>
  <div class="detail-box">
    <!-- 固定锚点 -->
    <el-affix :offset="280" class="affix-box">
      <div class="affix-anchor-box">
        <div class="affix-anchor" v-if="isOpen">
          <el-tree
            :data="affixTreeData"
            @node-click="toViewMenu"
            highlight-current
            default-expand-all
          />
        </div>
        <el-button style="margin-right: 80px"
         @click="isOpen = !isOpen"
          ><el-icon v-if="!isOpen" size="22"><Expand /></el-icon>
          <el-icon v-else size="22"> <Fold /></el-icon>
        </el-button>
      </div>
    </el-affix>
    <header class="detail-box-header">
      <img
        src="@/icons/svg/back.svg"
        class="detail-svg"
        @click="handleClose"
      /><span>工单详情</span>
    </header>

    <section class="detail-box-content">
      <div class="time-line">
        <time-line
          class="tiem-line-item"
          v-for="(item, index) in timeLineData"
          :key="index"
          :content="item.content"
          :timestamp="item.timestamp"
          :isShowLine="item.isShowLine"
          :otherInfo="item.otherInfo"
          :isActive="item.isActive"
        ></time-line>
      </div>
      <div class="detail-box-base-info" id="overhaulBaseInfoId">
        <el-descriptions
          title="基本信息"
          labelClassName="detail-box-base-info--label"
          size="small"
        >
          <el-descriptions-item
            v-for="item in baseInfo"
            :key="item.key"
            :label="item.label"
          >
            <template v-if="item.key === 'orderStatus'">
              <el-tag
                size="small"
                :type="WORK_ORDER_STATUS[item.value].tagType"
                >{{ WORK_ORDER_STATUS[item.value].text }}</el-tag
              >
            </template>
            <template v-else> {{ item.value }} </template>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="detail-box-survey" id="overhaulProcessInfo">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabList"
            :key="item.name"
            :name="item.name"
            :label="item.label"
            lazy
          >
            <el-button
              v-if="!item.hiddenAssign"
              size="small"
              title="工序指派"
              type="primary"
              @click="openModal(item, 'showAppoint')"
            >
              <el-icon class="el-icon--left"><Pointer /></el-icon> 工序指派
            </el-button>
            <!-- <span slot="label"
              >{{ item.label }}
              <i
                v-if="!item.hiddenAssign"
                class="el-icon-thumb"
                title="派工"
                @click.stop="openModal(item, 'showAppoint')"
              ></i>
            </span> -->
            <!-- 中间件 -->
            <middle-ware
              v-else
              v-bind="item"
              :workOrderType="2"
              :workOrderInfo="info"
              :tabList="TAB_LIST_MAP[item.name]"
            ></middle-ware>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
    <dispatch-modal
      v-if="showAppoint"
      :operateRow="operateRow"
      :workClazzType="workClazzType"
      modalName="showAppoint"
      @closeModal="closeModal"
      @onSave="dispatchOnsave"
    ></dispatch-modal>
  </div>
</template>

<script>
import { WORK_ORDER_STATUS, TIME_LINE } from "../config.js";
import TimeLine from "@/components/TimeLine/index.vue";
import DispatchModal from "@/views/overhaul/overhaulCommon/dispatchModal"; //指派
import MiddleWare from "../modules/middleWare.vue";
import { findWorkOrder } from "@/api/overhaul/workOrderApi.js";
import { TAB_LIST_MAP } from "../config";
import { Pointer, Expand, Fold } from "@element-plus/icons-vue";
import { COMMON_FORMAT } from "@/views/overhaul/constants.js";
import dayjs from "dayjs";
//外层tab 配置项  其中 name修改时需要注意与config.js中的TAB_LIST_MAP的 key对应
const TAB_LIST = [
  {
    label: "现场勘查",
    name: "surveyItem",
    workClazzType: "survey", //班组字段
    hiddenAssign: true,
  },
  {
    label: "现场检修",
    name: "siteOverhaul",
    hiddenAssign: false,
    workClazzType: "overhaulGroup",
  },
  {
    label: "返厂检修-现场拆解",
    name: "siteDismantle",
    hiddenAssign: false,
    workClazzType: "overhaulGroup",
  },
  {
    label: "返厂检修-厂内拆解",
    name: "factoryDismantle",
    workClazzType: "assembleGroup",
    hiddenAssign: false,
  },
  {
    label: "返厂检修-厂内生产",
    name: "factoryCreate",
    workClazzType: "prodDeptGroup",
    hiddenAssign: false,
  },
  {
    label: "返厂检修-试验",
    name: "experiment",
    workClazzType: "experimentalGroup",
    hiddenAssign: false,
  },
  {
    label: "返厂检修-检修报告",
    name: "finishReport",
    hiddenAssign: true,
  },
];
export default {
  components: {
    MiddleWare,
    TimeLine,
    DispatchModal,
    Pointer,
    Expand,
    Fold,
  },
  props: {
    //操作行
    operateRow: {
      type: Object,
      default() {
        return null;
      },
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isOpen: true, //是否展开
      WORK_ORDER_STATUS: Object.freeze(WORK_ORDER_STATUS),
      TAB_LIST_MAP: Object.freeze(TAB_LIST_MAP),
      baseInfo: [],
      showAppoint: false, //指派弹窗
      activeName: "surveyItem", //选项卡
      tabList: [], //外层tab
      //时间轴详情
      timeLineData: [],
      workClazzType: "", //工序指派字段
      overhaulType: 1, //检修类型
      info: {},
    };
  },
  async mounted() {
    try {
      const { data } = await findWorkOrder(this.operateRow.id);
      this.info = data;
      //根据不同的检修类型定义不同的时间轴
      this.overhaulType = 2; //现场检修
      this.timeLineData = TIME_LINE[this.overhaulType];

      this.initBaseInfo(data);
      this.dealProcess(data.timelineList);
    } catch (error) {
      this.handleClose(true);
    }
    this.dealTabList(); //获取当前用户的工序权限
  },
  computed: {
    affixTreeData() {
      let surveyChildren = this.tabList.map((item) => {
        return {
          label: item.label,
          tabName: item.name,
          anchorId: "overhaulProcessInfo",
        };
      });
      return [
        {
          label: "基本信息",
          anchorId: "overhaulBaseInfoId",
        },
        {
          label: "工序执行",
          anchorId: "overhaulProcessInfo",
          children: surveyChildren,
        },
      ];
    },
  },
  methods: {
    /**
     * 锚点定位
     */
    toViewMenu(node) {
      let dom = document.querySelector(`#${node.anchorId}`);
      if (dom) {
        dom.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        if (node.tabName) {
          this.activeName = node.tabName;
        }
      }
    },
    /**
     * 获取当前用户的工序权限
     */
    dealTabList() {
      //现场检修
      if (this.overhaulType === 1) {
        this.tabList = TAB_LIST.slice(0, 2);
      } else {
        //返厂检修
        this.tabList = TAB_LIST.filter((item) => item.name !== "siteOverhaul");
      }
    },
    /**
     * 处理事件轴顺序
     */
    dealProcess(targetList = []) {
      this.timeLineData.forEach((item) => {
        const arr = targetList.find(
          (ele) => ele.processState === item.processState
        );
        item.isActive = false;
        if (!arr) return;
        item.timestamp = dayjs(arr.editTime).format(COMMON_FORMAT);
        item.otherInfo = arr.appointee;
        item.isActive = true;
      });
    },
    /**
     * 初始化基础信息
     */
    initBaseInfo(targetData) {
      this.baseInfo = [
        {
          key: "orderStatus",
          label: "工单状态",
          value: targetData["orderStatus"],
        },
        { key: "prodNumber", label: "生产号", value: targetData["prodNumber"] },
        { key: "prodModel", label: "产品型号", value: targetData["prodModel"] },
        {
          key: "prodCategory",
          label: "产品大类",
          value: targetData["prodCategory"],
        },
        { key: "projName", label: "项目名称", value: targetData["projName"] },
        {
          key: "businessOrder",
          label: "商机订单",
          value: targetData["businessOrder"],
        },
        { key: "remark", label: "备注信息", value: targetData["remark"] },
        {
          key: "manufacturer",
          label: "厂商",
          value: targetData["manufacturer"],
        },
        {
          key: "submitterName",
          label: "创建人",
          value: targetData["submitterName"],
        },
        {
          key: "createTime",
          label: "提交时间",
          value: targetData["createTime"],
        },
        {
          key: "customName",
          label: "客户名称",
          value: targetData["customName"],
        },
        {
          key: "voltageLevel",
          label: "电压等级",
          value: targetData["voltageLevel"],
        },
        {
          key: "planStartTime",
          label: "计划开工时间",
          value: targetData["planStartTime"],
        },
        {
          key: "planEndTime",
          label: "计划完工时间",
          value: targetData["planEndTime"],
        },
        {
          key: "actualStartTime",
          label: "实际开工时间",
          value: targetData["actualStartTime"],
        },
        {
          key: "actualEndTime",
          label: "实际完工时间",
          value: targetData["actualEndTime"],
        },
        {
          key: "attachmentUrl",
          label: "附件",
          value: targetData["attachmentUrl"],
        },
      ];
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleOk() {},
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
    openModal(row, modalName) {
      this.workClazzType = row.workClazzType; //班组字段
      this.activeName = row.name;
      this.$nextTick(() => {
        this[modalName] = true;
      });
    },
    /**
     * 指派弹窗指派完成时的回调
     */
    dispatchOnsave() {
      this.tabList = this.tabList.map((item) => {
        if (item.name === this.activeName) {
          item.hiddenAssign = true;
        }
        return item;
      });
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$conent-padding: 15px;
// ::v-deep(.el-input--small .el-input__inner) {
//   width: 220px;
// }
::v-deep(.el-descriptions__body) {
  margin-left: 20px;
}
::v-deep(.el-tabs__content) {
  min-height: 660px;
}
.affix-box {
  height: 0;
  text-align: right;
  .affix-anchor-box {
    position: relative;
  }
  .affix-anchor {
    display: inline-block;
    position: absolute;
    width: 170px;
    height: fit-content;
    top: 25px;
    right: 75px;
    background-color: #ffffff;
    box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.32);
    border-radius: 4px;
  }
}
.detail-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #eceef1;
  &-header {
    height: 52px;
    line-height: 52px;
    padding: 0 0 0 15px;
    font-size: 20px;
    font-weight: 700;
    background: #fff;
    .detail-svg {
      cursor: pointer;
      margin-right: 5px;
      width: 1em;
      height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
  &-content {
    margin: $conent-padding;
  }

  &-base-info {
    width: 100%;
    background: #fff;
    padding: 15px;
    ::v-deep(.el-descriptions-item__container .el-descriptions-item__label) {
      display: inline-block;
      width: 110px;
      text-align: right;
    }
  }
  &-survey {
    width: 100%;
    height: 780px;
    background: #fff;
    padding: 15px;
    margin-top: $conent-padding;
  }
  &-body {
    margin-left: 15px;
  }
}
.time-line {
  display: flex;
  flex-direction: row;
  padding-left: 50px;
  height: 124px;
  background: url("../../../../assets/background.png");
  &-item {
    padding-top: 20px;
  }
}
</style>