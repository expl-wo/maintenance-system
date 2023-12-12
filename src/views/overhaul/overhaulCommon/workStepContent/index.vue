<template>
  <el-empty
    description="暂无工作内容数据！"
    style="height: 100%"
    v-if="!dataList.length"
  />
  <div class="work-content-box" v-else v-loading="loading">
    <el-descriptions title="基础信息" :column="4" :style="{ width: '800px' }">
      <template #extra>
        <el-button
          v-if="isEditAuth"
          type="primary"
          title="开工"
          :disabled="workStatus !== 2"
          @click="editStatus('isStart')"
          >开工</el-button
        >
        <el-button
          v-if="isEditAuth"
          type="primary"
          title="完工"
          :disabled="workStatus !== 1"
          @click="editStatus('isFinished')"
          >完工</el-button
        >
        <el-button
          v-if="isCheckAuth"
          type="primary"
          :disabled="recheckStatus === 1 || [0, 2, 1].includes(workStatus)"
          title="复核"
          @click="check"
          >复核</el-button
        >
      </template>
      <el-descriptions-item label="工作内容名称">{{
        contentInfo.workProcedureName
      }}</el-descriptions-item>
      <el-descriptions-item label="组长">{{
        contentInfo.leaderName
      }}</el-descriptions-item>
      <el-descriptions-item label="副组长">{{
        contentInfo.deputyLeaderName
      }}</el-descriptions-item>
      <el-descriptions-item label="成员">{{
        contentInfo.memberName
      }}</el-descriptions-item>
      <el-descriptions-item label="开工时间">{{
        contentInfo.workBeginDate || "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="完工时间">{{
        contentInfo.workFinishDate || "-"
      }}</el-descriptions-item>
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
          :isEditAuth="isEditAuth"
          :workOrderInfo="workOrderInfo"
          :sceneType="sceneType"
          :currentSelectNode="currentSelectNode"
          @searchChange="searchChange"
        ></content-item>
      </template>
    </el-form>
    <div class="operate-wrap" v-if="isEditAuth">
      <el-button type="primary" title="保存" @click="save"> 保存 </el-button>
      <el-button
        type="primary"
        title="报工"
        :disabled="![1].includes(workStatus)"
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
      :contentInfo="contentInfo"
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
    //是否能编辑
    isEditAuth: {
      type: Boolean,
      default: false,
    },
    //是否能复核
    isCheckAuth: {
      type: Boolean,
      default: false,
    },
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
      contentInfo: {},
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
          this.getWorkSteoInfoList();
          this.getList();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getWorkSteoInfoList() {
      getWorkStepInfo({
        workCode: this.workOrderInfo.id,
        procedureCode: this.currentSelectNode.procedureCode,
        workProcedureType: this.currentSelectNode.procedureType,
        workOrderSceneType: this.sceneType,
      }).then((res) => {
        this.contentInfo = res.data;
        this.recheckStatus = this.contentInfo.reviewStatus;
        this.workStatus = this.contentInfo.workStatus;
      });
    },
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      if (isSearch) {
        this.getWorkSteoInfoList();
        this.getList();
      }
    },
    //获取列表
    getList() {
      this.loading = true;
      let parmas = {
        craftId: this.currentSelectNode.procedureCode,
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
    searchChange(operationCode) {
      if (!this.dataList.length) return;
      let resultList = this.dataList.filter(
        (item) => item.operationCode === operationCode
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
          workCode: this.workOrderInfo.id,
          craftCode: this.currentSelectNode.procedureCode,
          operationCode: item.operationCode,
          workScene: this.sceneType,
          executionFrequency: item.executionFrequency,
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
            if (this.$refs[`contentItemRef${item.operationCode}`]) {
              if (+item.operationType === 4) {
                //多选框
                item.contentInfo = item.contentInfo
                  ? item.contentInfo.split(",")
                  : [];
              }
              this.$refs[
                `contentItemRef${item.operationCode}`
              ][0].form.contentData = item.contentInfo;
              this.$refs[
                `contentItemRef${item.operationCode}`
              ][0].opearationId = item.id; //赋值ID
              const fileNameStr= item.fileList.map((item) => item.fileName).join("|");
              const fileUrlStr = item.fileList.map((item) => item.fileUrl).join("|");
              this.$refs[`contentItemRef${item.operationCode}`][0].fileName =fileNameStr;   
              this.$refs[`contentItemRef${item.operationCode}`][0].form.fileName =fileNameStr;
              this.$refs[`contentItemRef${item.operationCode}`][0].fileUrl =fileUrlStr
              this.$refs[`contentItemRef${item.operationCode}`][0].form.fileUrl =fileUrlStr
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
        workCode: this.workOrderInfo.id,
        workProcedureCode: this.currentSelectNode.procedureCode,
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
          this.getWorkSteoInfoList();
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
          upperLimit: item.upperLimit ? +item.upperLimit : undefined,
          lowerLimit: item.lowerLimit ? +item.lowerLimit : undefined,
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
        if (+item.operationType === 4) {
          //多选处理为字符串
          item.contentInfo = (item.contentInfo || []).join(",");
        }
        if (!item.contentInfo && !!+item.isRequired) {
          //检验必填项
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
        workCode: this.workOrderInfo.id,
        craftCode: this.currentSelectNode.procedureCode,
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