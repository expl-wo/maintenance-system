<template>
  <div class="upload-operator" :style="{ width }">
    <div
      class="upload-operator-item"
      v-for="item in aiAppendixDTOList"
      :key="item.id"
    >
      <div>
        <template v-if="unusualFlagList.length">
          <el-tooltip
            v-if="getUnusualFlagInfo(item.appendixUrl).flag"
            effect="dark"
            content="附件智能校验异常！"
            placement="top"
          >
            <el-icon class="unusual-flag" color="red"><WarningFilled /></el-icon
          ></el-tooltip>
        </template>

        <overhaul-download
          :href="item.appendixUrl"
          :fileName="item.appendixName"
        ></overhaul-download>
      </div>
      <div>
        <el-popover
          ref="popoverRef"
          placement="right"
          :width="400"
          trigger="click"
          :hide-after="0"
          @show="getInfoByAi(item.appendixUrl)"
        >
          <template #reference>
            <el-button style="margin-right: 16px">详情</el-button>
          </template>
          <!-- <div class="content-info"></div> -->
          <el-descriptions title="附件详情" :column="1" v-if="currentData">
            <el-descriptions-item label="附件预览：">
              <video
                v-if="currentData.appendixType === 1"
                style="width: 100%"
                height="220px"
                controls="controls"
                :src="this.dealUrl(item.appendixUrl)"
              ></video>
              <el-image
                v-else
                style="width: 100%; height: 220px"
                :preview-src-list="[this.dealUrl(item.appendixUrl)]"
                :src="this.dealUrl(item.appendixUrl)"
                fit="cover"
              />
            </el-descriptions-item>
            <el-descriptions-item label="人工校验结果：">
              <el-radio-group v-model="flag" class="ml-4" @change="radioChange">
                <el-radio :label="0" size="large">正常</el-radio>
                <el-radio :label="1" size="large">异常</el-radio>
              </el-radio-group>
            </el-descriptions-item>
            <el-descriptions-item label="人工校验异常说明：" v-if="+flag === 1">
              <el-input
                v-model="flagDesc"
                type="textarea"
                :maxlength="500"
                :rows="2"
                placeholder="请输入问题描述"
              />
            </el-descriptions-item>
            <el-descriptions-item label="图片智能校验结果："  v-if="currentData.appendixType === 2"
              ><el-tag
                size="small"
                :type="appendixFlagName === '正常' ? '' : 'danger'"
                >{{ appendixFlagName }}</el-tag
              ></el-descriptions-item
            >
          </el-descriptions>
          <el-row justify="end">
            <el-col :span="4">
              <el-button
                v-if="isCanDelete"
                type="primary"
                @click="aiAppendixDTOListChange(item.appendixUrl)"
                >保存</el-button
              ></el-col
            >
          </el-row>
        </el-popover>
        <el-button
          v-if="isCanDelete"
          class="delete-btn"
          @click="handleDelete(item)"
          type="danger"
          >删除</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import OverhaulDownload from "@/views/overhaul/overhaulCommon/download.vue";
export default {
  props: {
    isCanDelete: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "unset",
    },
    //是否开启异常信息标识 通过url来进行判断
    unusualFlagList: {
      type: Array,
      default() {
        return [];
      },
    },
    //ai识别信息 仅工步使用
    aiAppendixDTOList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    OverhaulDownload,
  },
  emits: ["aiAppendixDTOListChange"],
  data() {
    return {
      flag: 0,
      flagDesc: "",
      appendixFlagName: "正常",
      currentData: undefined,
    };
  },
  methods: {
    //获取当前点击的信息
    async getInfoByAi(url) {
      const target = this.aiAppendixDTOList.find(
        (item) => item.appendixUrl === url
      );
      if (!target) {
        this.$message.error("暂无详情！");
      }
      this.currentData = target;
      this.flag = this.currentData.flag;
      this.flagDesc = this.currentData.flagDesc;
      this.appendixFlagName =
        this.currentData.appendixFlag === 0 ? "正常" : "异常";
    },
    //单选框变为正常时重置备注
    radioChange(val) {
      if (val === 0) {
        this.flagDesc = "";
      }
    },
    //回传数据
    async aiAppendixDTOListChange(val) {
      const targetIndex = this.aiAppendixDTOList.findIndex(
        (item) => item.appendixUrl === val
      );
      if (targetIndex > -1) {
        this.$refs.popoverRef[targetIndex].hide(); //手动关闭当前的popover
        this.$emit(
          "aiAppendixDTOListChange",
          {
            ...this.aiAppendixDTOList[targetIndex],
            flagDesc: this.flagDesc,
            flag: this.flag,
          },
          targetIndex
        );
      }
    },
    dealUrl(url) {
      if (!url) return "";
      if (url.indexOf("minioServer") < 0) {
        url = "minioServer/" + url;
      }
      return url;
    },
    //获取异常信息
    getUnusualFlagInfo(url) {
      let result = {
        flag: true,
      };
      let target = this.unusualFlagList.find(
        (item) => item.appendixUrl === url
      );
      result.flag = !!target
      return result;
    },
    handleDelete(item) {
      this.$emit("onDelete", {
        fileName: item.appendixName,
        fileUrl: item.appendixUrl,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-operator {
  max-height: 200px;
  overflow-y: auto;
}
.content-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.upload-operator-item {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .unusual-flag {
    margin-right: 5px;
    &:hover {
      cursor: pointer;
    }
  }
  .delete-btn {
    margin-right: 10px;
    margin-left: 4px;
    margin-top: -2px;
  }
}
</style>