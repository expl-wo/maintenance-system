<template>
  <div class="detail-box">
    <affix-anchor
      :affixTreeData="affixTreeData"
      v-model:activeName="activeName"
    />
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
        >
          <el-descriptions-item
            v-for="item in baseInfo"
            :key="item.key"
            :label="item.label"
          >
            <template v-if="item.key === 'orderStatus'">
              <el-tag
                v-if="item.value"
                :type="WORK_ORDER_STATUS[item.value].tagType"
                >{{ WORK_ORDER_STATUS[item.value].text }}</el-tag
              >
            </template>
            <template v-else-if="item.key === 'attachmentUrl'">
              <file-list
                :fileList="tmpFileList"
                :isCanDelete="false"
                width="270px"
              ></file-list>
            </template>
            <template v-else> {{ item.value }} </template>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="detail-box-survey" id="overhaulProcessInfo">
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="item in tabList"
            :key="item.name"
            :name="item.name"
            :label="item.label"
            lazy
          >
            <el-button
              v-if="!item.hiddenAssign"
              title="工序指派"
              :disabled="
                [
                  COMMOM_WORK_ORDER_MAP['pause'].value,
                  COMMOM_WORK_ORDER_MAP['finish'].value,
                ].includes(operateRow.orderStatus)
              "
              type="primary"
              @click="openModal(item, 'showAppoint')"
            >
              <el-icon class="el-icon--left"><Pointer /></el-icon> 工序指派
            </el-button>
            <!-- 如果检修工单未关联勘查工单就不显示 -->
            <el-empty
              v-else-if="isNotSurvey"
              style="height: 100%"
              description="暂无关联的勘查工单数据"
            />
            <middle-ware
              v-else-if="item.name === 'surveyItem'"
              v-bind="item"
              :key="item.name"
              :workOrderType="2"
              :workOrderInfo="overHaulSurveyData"
              :sceneType="sceneType"
              :appointInfo="appointInfo"
              :tabList="TAB_LIST_MAP[item.name]"
            ></middle-ware>
            <!-- 中间件 -->
            <template v-else>
              <middle-ware
                v-if="item.isRefrsh"
                v-bind="item"
                :key="item.name"
                :workOrderType="2"
                :workOrderInfo="info"
                :sceneType="sceneType"
                :appointInfo="appointInfo"
                :tabList="TAB_LIST_MAP[item.name]"
              ></middle-ware>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
    <dispatch-modal
      v-if="showAppoint"
      :operateRow="operateRow"
      :workClazzType="workClazzType"
      :sceneType="sceneType"
      modalName="showAppoint"
      @closeModal="closeModal"
      @onSave="init"
    ></dispatch-modal>
  </div>
</template>

<script>
import { WORK_ORDER_STATUS, TIME_LINE } from "../config.js";
import TimeLine from "@/components/TimeLine/index.vue";
import DispatchModal from "@/views/overhaul/overhaulCommon/dispatchModal"; //指派
import MiddleWare from "../modules/middleWare.vue";
import FileList from "@/views/overhaul/overhaulCommon/fileList.vue";
import { findWorkOrder, getAppiontInfo } from "@/api/overhaul/workOrderApi.js";
import { TAB_LIST_MAP, TAB_LIST_OUT } from "../config";
import {
  COMMON_FORMAT,
  COMMOM_WORK_ORDER_MAP,
} from "@/views/overhaul/constants.js";
import AffixAnchor from "@/views/overhaul/overhaulCommon/affixAnchor.vue";
import dayjs from "dayjs";
export default {
  components: {
    AffixAnchor,
    MiddleWare,
    TimeLine,
    DispatchModal,
    FileList,
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
      COMMOM_WORK_ORDER_MAP,
      WORK_ORDER_STATUS: Object.freeze(WORK_ORDER_STATUS),
      TAB_LIST_MAP: Object.freeze(TAB_LIST_MAP),
      baseInfo: [],
      tmpFileList: [],
      showAppoint: false, //指派弹窗
      activeName: "surveyItem", //选项卡
      tabList: [], //外层tab
      //时间轴详情
      timeLineData: [],
      workClazzType: "", //工序指派字段
      sceneType: "", //场景值
      overhaulType: 0, //检修类型 0时现场 1 是返厂
      info: {},
      appointInfo: {},
      overHaulSurveyData: {}
    };
  },
  async mounted() {
    this.init();
  },
  computed: {
    //检修工单未关联勘查工单
    isNotSurvey() {
      // this.info && this.info.surveyID;
      return (
        this.activeName === "surveyItem" && this.info && !this.info.overHaulId
      );
    },
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
  watch: {
    activeName: {
      handler(val) {
        this.tabList.some((item) => {
          if (item.name === val) {
            item.isRefrsh = false;
            this.$nextTick(() => {
              this.getAppointSetting();
              item.isRefrsh = true;
            });
            return true;
          }
        });
      },
    },
  },
  methods: {
    //初始化详情
    async init() {
      try {
        const { data } = await findWorkOrder(this.operateRow.id);
        this.info = data;
        //根据不同的检修类型定义不同的时间轴
        this.overhaulType =
          this.info.retFactory === null ? null : +this.info.retFactory;
        this.timeLineData =
          this.overhaulType === null ? [] : TIME_LINE[this.overhaulType];

        this.initBaseInfo(data);
        this.dealProcess(data.timelineList);
      } catch (error) {
        // this.handleClose(true);
      }
      this.dealTabList(); //获取当前用户的工序权限
      this.getAppointSetting();
    },
    //获取配置信息
    async getAppointSetting() {
      const targetTabIndex = this.tabList.findIndex(
        (item) => item.name === this.activeName
      );
      if (targetTabIndex === -1) return;
      this.sceneType = this.tabList[targetTabIndex].sceneType;
      //如果是勘查则回显勘查数据
      let orderId = this.operateRow.id;
      if (this.activeName === "surveyItem" && !this.isNotSurvey) {
        orderId = this.info.overHaulId;
        const { data } = await findWorkOrder(orderId);
        this.overHaulSurveyData = { ...data, workOrderType: 2 };
      }
      getAppiontInfo({
        sceneType: this.sceneType,
        orderId,
      }).then(({ data }) => {
        this.appointInfo = data;
        if (data.projManagerId) {
          this.tabList[targetTabIndex].hiddenAssign = true;
        }
        //  else {
        //   this.tabList[targetTabIndex].hiddenAssign = false;
        // }
      });
    },
    /**
     * 获取当前用户的工序权限
     */
    dealTabList() {
      //现场检修
      if (this.overhaulType === 0) {
        this.tabList = TAB_LIST_OUT.slice(0, 2).filter((item) => {
          return this.$isAuth(item.menuCode);
        });
      } else if (this.overhaulType === 1) {
        //返厂检修
        this.tabList = TAB_LIST_OUT.filter((item) => {
          return item.name !== "siteOverhaul" && this.$isAuth(item.menuCode);
        });
      } else {
        this.tabList = TAB_LIST_OUT.slice(0, 1).filter((item) => {
          return this.$isAuth(item.menuCode);
        });
      }
    },
    /**
     * 处理事件轴顺序
     */
    dealProcess(targetList = []) {
      this.timeLineData.forEach((item) => {
        const arr = targetList.findLast(
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
          value: targetData["prodCategoryName"],
        },
        { key: "projName", label: "项目名称", value: targetData["projName"] },
        {
          key: "businessOrderName",
          label: "商机订单",
          value: targetData["businessOrderName"],
        },
        // { key: "remark", label: "备注信息", value: targetData["remark"] },
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
      this.tmpFileList = [];
      let fileUrlArr = (targetData.attachmentUrl || "")
        .split("|")
        .filter(Boolean);
      let fileNameArr = (targetData.attachmentName || "")
        .split("|")
        .filter(Boolean);
      for (let i = 0; i < fileUrlArr.length; i++) {
        this.tmpFileList.push({
          fileUrl: fileUrlArr[i],
          fileName: fileNameArr[i],
        });
      }
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
    openModal(row, modalName) {
      this.workClazzType = row.workClazzType; //班组字段
      this.sceneType = row.sceneType;
      this.activeName = row.name;
      this.$nextTick(() => {
        this[modalName] = true;
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
::v-deep(.el-descriptions__body) {
  margin-left: 20px;
}
:deep(.el-tabs__content) {
  min-height: 700px;
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
    :deep(.el-descriptions-item__container .el-descriptions-item__label) {
      display: inline-block;
      width: 110px;
      text-align: right;
    }
  }
  &-survey {
    width: 100%;
    height: 850px;
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