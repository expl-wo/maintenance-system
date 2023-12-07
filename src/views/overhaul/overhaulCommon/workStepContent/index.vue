<template>
  <el-empty description="暂无工作内容数据！" v-if="!dataList.length" />
  <div class="work-content-box" v-else v-loading="loading">
    <el-descriptions title="基础信息" :column="4" :style="{ width: '800px' }">
      <template #extra>
        <el-button
          type="primary"
          title="开工"
          :disabled="workStatus !== 1"
          @click="editStatus('isStart')"
          >开工</el-button
        >
        <el-button
          type="primary"
          title="完工"
          :disabled="workStatus !== 2"
          @click="editStatus('isFinished')"
          >完工</el-button
        >
        <el-button
          type="primary"
          :disabled="recheckStatus === 1"
          title="复核"
          @click="check"
          >复核</el-button
        >
        <!-- <el-button
          type="primary"
          title="报工"
          :disabled="workStatus !== 2"
          @click="reportWorkModal = true"
          >报工</el-button
        > -->
      </template>
      <el-descriptions-item label="工作内容名称名称"
        >工作内容1</el-descriptions-item
      >
      <el-descriptions-item label="组长">张山</el-descriptions-item>
      <el-descriptions-item label="副组长">里斯</el-descriptions-item>
      <el-descriptions-item label="成员">王麻子</el-descriptions-item>
      <el-descriptions-item label="复核状态">{{
        REVIEW_STATUS_ENUM[recheckStatus]
      }}</el-descriptions-item>
      <el-descriptions-item label="当前状态">{{
        WORK_STATUS_ENUM[workStatus]
      }}</el-descriptions-item>
    </el-descriptions>
    <div
      class="el-descriptions__title"
      style="font-size: 14px; margin-bottom: 12px"
    >
      执行项
    </div>
    <el-form label-width="120px" class="work-centent-body">
      <template v-for="(item, index) in contentList" :key="index">
        <content-item
          :ref="`contentItemRef${item.id}`"
          v-bind="item"
          :workOrderInfo="workOrderInfo"
          :sceneType="sceneType"
          :currentSelectNode="currentSelectNode"
          @searchChange="searchChange"
        ></content-item>
      </template>
    </el-form>
    <div class="operate-wrap">
      <el-button type="primary" title="保存" @click="save"> 保存 </el-button>
      <el-button
        type="primary"
        title="报工"
        :disabled="workStatus !== 2"
        @click="reportWorkModal = true"
        >报工</el-button
      >
    </div>
    <recheck-modal
      v-if="recheckModal"
      :operateRow="currentSelectNode"
      modalName="recheckModal"
      :sceneType="sceneType"
      :workOrderInfo="workOrderInfo"
      @closeModal="closeModal"
    ></recheck-modal>
    <!-- 报工 -->
    <report-work-modal
      v-if="reportWorkModal"
      :operateRow="currentSelectNode"
      modalName="reportWorkModal"
      :sceneType="sceneType"
      :workOrderInfo="workOrderInfo"
      @closeModal="closeModal"
    ></report-work-modal>
  </div>
</template>
<script>
import {
  WORK_STATUS_ENUM,
  REVIEW_STATUS_ENUM,
  COMMON_FORMAT,
} from "@/views/overhaul/constants.js";
import ContentItem from "./content.vue";
import {
  getWorkContent,
  editWorkStatus,
  saveWorkContent,
  batchWorkContent,
  getWorkStepInfo,
} from "@/api/overhaul/workOrderApi.js";
import RecheckModal from "../recheckModal.vue";
import ReportWorkModal from "./reportWorkModal.vue";
import dayjs from "dayjs";
export default {
  components: {
    ContentItem,
    RecheckModal,
    ReportWorkModal,
  },
  props: {
    currentSelectNode: {
      type: Object,
      default() {
        return {};
      },
    },
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    sceneType: {
      type: String,
      default: "",
    },
    onlyTabName: {
      type: String,
      default: "",
    },
    templateChoose: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      recheckModal: false,
      reportWorkModal: false,
      REVIEW_STATUS_ENUM,
      WORK_STATUS_ENUM,
      recheckStatus: 1, //复核状态
      workStatus: 1,
      dataList: [{}],
      activeIndex: 0,
      loading: false,
      contentList: [],
    };
  },
  watch: {
    currentSelectNode: {
      handler(val) {
        if (+val.type === 3) {
          this.getList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
    },
    //获取列表
    getList() {
      this.loading = true;
      let parmas = {
        // craftId: this.currentSelectNode.procedureCode,
        craftId: "20231125",
        workScene: this.sceneType,
      };
      getWorkContent(parmas)
        .then((res) => {
          const { value } = res.data;
          this.dataList = value || [];
          this.createdContentList(); //形成操作项
          this.batchSearchContent(this.dataList);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //取消之后会恢复
    cancel() {
      this.getList();
    },
    //分页查询内容
    searchChange(operationCode, beginTime) {
      if (!this.dataList.length) return;
      let resultList = this.dataList.filter(
        (item) => +item.operationCode === +operationCode
      );
      this.batchSearchContent(resultList);
    },
    //批量查询工作内容
    async batchSearchContent(targetList) {
      await this.$nextTick();
      let params = [];
      targetList.forEach((item) => {
        const beginTime = this.$refs[`contentItemRef${item.operationCode}`][0]
          ? this.$refs[`contentItemRef${item.operationCode}`][0].beginTime
          : dayjs().format(COMMON_FORMAT);
        params.push({
          // workCode: this.workOrderInfo.id,
          // craftId: this.currentSelectNode.procedureCode,
          workCode: "20220705093359824311000301954583",
          craftCode: "20231125",
          operationCode: "5",
          executionFrequency: "0",
          // operationCode: item.operationCode,
          workScene: this.sceneType,
          // executionFrequency: item.executionFrequency,
          // beginTime: "2023-12-05 19:30:47",
          beginTime,
        });
      });
      if (!params.length) return;
      batchWorkContent(params).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          const value = res.data.value || [];
          value.forEach((item) => {
            item.operationCode = "7";
            if (this.$refs[`contentItemRef${item.operationCode}`]) {
              this.$refs[
                `contentItemRef${item.operationCode}`
              ][0].form.contentData = item.contentInfo;
              this.$refs[
                `contentItemRef${item.operationCode}`
              ][0].opearationId = item.id; //赋值ID
              this.$refs[`contentItemRef${item.operationCode}`][0].fileName =
                item.fileList.map((item) => item.fileName).join("|");
              this.$refs[`contentItemRef${item.operationCode}`][0].fileUrl =
                item.fileList.map((item) => item.fileUrl).join("|");
            }
          });
        }
      });
    },
    //复核
    check() {
      this.recheckModal = true;
    },
    editStatus(type) {
      let params = {
        // workCode: this.workOrderInfo.id,
        // craftId: this.currentSelectNode.procedureCode,
        workCode: "20220705093359824311000301954583",
        workProcedureCode: "20231125",
        workScene: this.sceneType,
        isStart: Number(type === "isStart"),
        isFinished: Number(type === "isFinished"),
        operator: localStorage.getItem("userId"),
      };
      editWorkStatus(params).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("保存成功！");
          this.handleClose();
        }
      });
    },
    //生成内容列表
    createdContentList() {
      this.contentList = [];
      this.dataList.forEach((item, index) => {
        let target = {
          id: item.operationCode,
          contentType: +item.operationType,
          contentHeader: `${index + 1}.${item.operationName}`,
          contentLabel: item.operationDescription,
          requireImageFile: !!item.requireImageFile,
          maximumContentLength: +item.maximumContentLength,
          dataUnit: item.dataUnit,
          isRequired: !!+item.isRequired,
          upperLimit: +item.upperLimit,
          lowerLimit: +item.lowerLimit,
          executionFrequency: +item.executionFrequency,
          dictionaryContent: item.dictionaryContent,
        };
        if (+item.isMultiline && +item.operationType === 0) {
          target.contentType = 5; //文本域
        }
        this.contentList.push(target);
      });
    },
    getFileList(url, name) {
      let result = [];
      if (url) {
        const urlList = url.split("|");
        const urlName = name.split("|");
        result = urlList.map((item, index) => {
          return {
            type: item.slice(item.lastIndexOf(".") + 1),
            name: urlName[index],
            url: item,
          };
        });
      }
      return result;
    },
    //收集工作内容
    save() {
      let result = [];
      let validFlag = true;
      this.dataList.forEach((item) => {
        let refObj = this.$refs[`contentItemRef${item.operationCode}`][0];
        item.contentInfo = refObj.form.contentData;
        if (!item.contentInfo && [0, 2, 5].includes(+item.operationType)) {
          validFlag = false;
        }
        item.workPlanTime = refObj.beginTime;
        item.id = refObj.opearationId;
        item.fileList = this.getFileList(
          refObj.form.fileUrl,
          refObj.form.fileName
        );
        result.push(item);
      });
      if (!validFlag) {
        this.$message.error("请填写必填项！");
        return;
      }
      saveWorkContent({
        workCode: "20220705093359824311000301954583",
        craftCode: "20231125",
        // workCode: this.workOrderInfo.id,
        // craftId: this.currentSelectNode.procedureCode,
        contentCode: "",
        workScene: this.sceneType,
        list: result,
      }).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("保存成功！");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content-wrap {
  margin-bottom: 12px;
}
.mgl12 {
  margin-left: 12px;
}
.marb {
  margin-bottom: 20px;
}

.work-centent-body {
  height: 440px;
  overflow-y: auto;
}
.work-content-box {
  padding: 20px;
  height: 100%;
  position: relative;
  .operate-wrap {
    position: absolute;
    bottom: 0;
    left: 20px;
    height: 36px;
    line-height: 36px;
  }
}
</style>