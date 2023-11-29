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
          :key="'item_' + index"
          :content="item.content"
          :timestamp="item.timestamp"
          :isShowLine="item.isShowLine"
          :otherInfo="item.otherInfo"
          :isActive="item.isActive"
        ></time-line>
      </div>
      <div class="detail-box-base-info" id="surveyBaseInfoId">
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
              <el-tag :type="WORK_ORDER_STATUS[item.value].tagType">{{
                WORK_ORDER_STATUS[item.value].text
              }}</el-tag>
            </template>
            <template v-else-if="item.key === 'attachmentUrl'">
              <file-list
                width="270px"
                :fileList="tmpFileList"
                :isCanDelete="false"
              ></file-list>
            </template>
            <template v-else> {{ item.value }} </template>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 审批完成之前均不能进行下一步 -->
      <div
        class="detail-box-survey"
        id="surveyProcessInfo"
        v-if="![WORK_ORDER_MAP['createOrder'].value].includes(info.orderStatus)"
      >
        <div class="el-descriptions__title" style="fontsize: 14px">
          现场勘查
          <el-button
            v-if="[WORK_ORDER_MAP['check'].value].includes(info.orderStatus)"
            title="工序指派"
            type="primary"
            @click="openModal(row, 'showAppoint')"
          >
            <el-icon class="el-icon--left"><Pointer /></el-icon> 工序指派
          </el-button>
        </div>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          v-if="![WORK_ORDER_MAP['check'].value].includes(info.orderStatus)"
        >
          <el-tab-pane
            v-for="item in tabList"
            :label="item.label"
            :key="item.name"
            :name="item.name"
            lazy
            ><component
              :is="item.components"
              :workOrderInfo="info"
              :onlyTabName="item.name"
              :workType="item.workType"
          /></el-tab-pane>
        </el-tabs>
      </div>
    </section>
    <dispatch-modal
      v-if="showAppoint"
      :operateRow="operateRow"
      workClazzType="survey"
      modalName="showAppoint"
      @closeModal="closeModal"
    ></dispatch-modal>
  </div>
</template>

<script>
import { WORK_ORDER_STATUS, TIME_LINE, WORK_ORDER_MAP } from "../config.js";
import FileList from "@/views/overhaul/overhaulCommon/fileList.vue";
import ProcessInfo from "@/views/overhaul/overhaulCommon/processInfo.vue"; //工序信息
import TimeLine from "@/components/TimeLine/index.vue";
import MarkerRecord from "@/views/overhaul/overhaulCommon/markerRecord.vue"; //标记记录
import DispatchModal from "@/views/overhaul/overhaulCommon/dispatchModal"; //指派
import VideoMark from "@/views/overhaul/overhaulCommon/videoMark.vue";
import { findWorkOrder } from "@/api/overhaul/workOrderApi.js";
import SurveyReport from "@/views/overhaul/overhaulCommon/templateReport.vue";
import IssueTable from "@/views/overhaul/workIssueCommon/issueTable";
import { Pointer, Expand, Fold } from "@element-plus/icons-vue";
import { COMMON_FORMAT } from "@/views/overhaul/constants.js";
import AffixAnchor from "@/views/overhaul/overhaulCommon/affixAnchor";
import dayjs from "dayjs";
export default {
  components: {
    ProcessInfo,
    TimeLine,
    MarkerRecord,
    AffixAnchor,
    DispatchModal,
    VideoMark,
    SurveyReport,
    IssueTable,
    Pointer,
    Expand,
    Fold,
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
      isOpen: true, //是否展开
      WORK_ORDER_STATUS,
      baseInfo: [],
      tmpFileList: [], //附件信息
      showAppoint: false, //指派弹窗
      activeName: "processInfo", //选项卡
      tabList: [
        {
          label: "工序信息",
          name: "processInfo",
          components: "ProcessInfo",
          menuCode: "2004_survey_btn_info",
        },
        //IssueTable
        {
          label: "工序问题查看",
          name: "issueTable",
          components: "IssueTable",
          menuCode: "2004_survey_btn_issue",
        },
        {
          label: "勘查报告",
          name: "report",
          components: "SurveyReport",
          workType: 1,
          menuCode: "2004_survey_btn_report",
        },
        // { label: "录像标记", name: "videoAndImg", components: "videoMark" },
        // { label: "标记记录", name: "markRecord", components: "MarkerRecord" },
      ],
      timeLineData: TIME_LINE,
      info: {},
      WORK_ORDER_MAP,
      menuList: [],
    };
  },
  async mounted() {
    this.init();
  },
  computed: {
    affixTreeData() {
      let surveyChildren = this.tabList.map((item) => {
        return {
          label: item.label,
          tabName: item.name,
          anchorId: "surveyProcessInfo",
        };
      });
      return [
        {
          label: "基本信息",
          anchorId: "surveyBaseInfoId",
        },
        {
          label: "现场勘查",
          anchorId: "surveyProcessInfo",
          children: surveyChildren,
        },
      ];
    },
  },
  methods: {
    async init() {
      try {
        const { data } = await findWorkOrder(this.operateRow.id);
        this.info = { ...data };
        this.menuList = JSON.parse(sessionStorage.getItem("btnList")) || [];
        this.tabList = this.tabList.filter((item) =>
          this.menuList.includes(item.menuCode)
        );
        this.initBaseInfo(data);
        this.dealProcess(data.timelineList);
      } catch (error) {
        // this.handleClose(true);
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
          key: "businessOrderName",
          label: "商机订单",
          value: targetData["businessOrderName"],
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
    openModal(row, modalName) {
      this[modalName] = true;
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
// :deep(.el-input--small .el-input__inner) {
//   width: 220px;
// }
:deep(el-descriptions__body) {
  margin-left: 20px;
}
:deep(.el-tabs__content) {
  min-height: 660px;
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