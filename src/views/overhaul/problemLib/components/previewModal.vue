<template>
  <div class="drawer">
    <el-drawer
      title="查看"
      width="50%"
      :model-value="visible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="handleClose"
    >
      <div v-if="contentInfoList.length" class="content-box">
        <div
          v-for="(item, index) in contentInfoList"
          :key="item.id"
          class="content-item"
        >
          <div class="title">{{ index + 1 }}、{{ item.operationName }}</div>
          <div class="content">
            <div class="info-item">
              <span class="label">执行项:</span>
              <span>{{ item.operationName }}</span>
            </div>
            <div class="info-item">
              <span class="label">执行结果:</span>
              <span>{{ item.contentInfo }}</span>
            </div>
            <div class="file-box" v-if="item.aiAppendixDTOList.length">
              <div class="label">附件内容:</div>
              <div
                v-for="file in item.aiAppendixDTOList"
                :key="file.id"
                class="file-item"
              >
                <video
                  v-if="file.appendixType === 1"
                  :src="this.dealUrl(file.appendixUrl)"
                  class="file"
                  @click="showVideoModal(file.appendixUrl)"
                ></video>
                <el-image
                  v-else
                  class="file"
                  :preview-src-list="[this.dealUrl(file.appendixUrl)]"
                  :src="this.dealUrl(file.appendixUrl)"
                  fit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-empty description="暂无数据" v-else />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClose">确 定</el-button>
        </span>
      </template>
      <el-dialog
        v-model="dialogVisible"
        title="视频"
        width="30%"
        @close="dialogVisible = false"
      >
        <div class="video-box">
          <video
            style="width: 400px; height: 300px"
            controls="controls"
            :src="currentVideoUrl"
          ></video>
        </div>
      </el-dialog>
    </el-drawer>
  </div>
</template>
<script>
import { getExecutionResult } from "@/api/overhaul/problemLabApi";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      contentInfoList: [],
      // 弹窗
      dialogVisible: false,
      currentVideoUrl: "",
    };
  },
  watch: {
    visible(newVal) {
      if (newVal && this.info) {
        this.queryContent();
      }
    },
  },
  methods: {
    // 关闭
    handleClose() {
      this.$emit("closeModal", "preview", false);
    },
    // 查询工作内容
    queryContent() {
      let { workCode, workProcedureId: craftCode, workScene } = this.info;
      let params = {
        workCode,
        craftCode,
        workScene,
        executionFrequency: 2,
      };
      getExecutionResult(params).then((res) => {
        if (res.success && res.data && Array.isArray(res.data.value)) {
          const list = res.data.value || [];
          list.forEach((r) => {
            // 根据返回code，回显中文
            if (r.operationType === "3") {
              r.dictionaryContent &&
                r.dictionaryContent.forEach((d) => {
                  if (d.code === r.contentInfo || d.name === r.contentInfo) {
                    r.contentInfo = d.name;
                  }
                });
            } else if (r.operationType === "4") {
              const list = r.contentInfo && r.contentInfo.split(",");
              const nameList = [];
              r.dictionaryContent &&
                r.dictionaryContent.forEach((d) => {
                  if (list && list.length && list.includes(d.code)) {
                    nameList.push(d.name);
                  }
                });
              r.contentInfo = nameList && nameList.join(",");
            }
          });
          this.contentInfoList = list;
        }
      });
    },
    dealUrl(url) {
      if (!url) return "";
      if (url.indexOf("minioServer") < 0) {
        url = "minioServer/" + url;
      }
      return url;
    },
    showVideoModal(url) {
      this.currentVideoUrl = this.dealUrl(url);
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.drawer {
  .content-box {
    height: 100%;
    overflow-y: auto;
    .content-item {
      margin-bottom: 10px;
      .title {
        margin-bottom: 10px;
        font-weight: bolder;
      }
      .content {
        &:not(:last-child) {
          border-bottom: 1px solid #000;
        }
        margin-left: 25px;
        .file-box {
          display: flex;
          flex-wrap: wrap;
          .file-item {
            width: 60px;
            height: 40px;
            margin: 2px 2px;
            .file {
              width: 60px;
              height: 40px;
            }
          }
        }
      }
      .label {
        display: inline-block;
        width: 80px;
      }
      .info-item {
        margin-bottom: 5px;
      }
    }
  }
  :deep(.el-drawer__header) {
    margin-bottom: 0px !important;
  }
}
</style>
