<template>
  <el-dialog
    draggable
    title="标记信息编辑"
    append-to-body
    :model-value="true"
    width="800px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"
      label-width="120px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="标记名称" prop="markName">
            <el-input v-model="form.markName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标记类型" prop="markType">
            <el-select v-model="form.markType" placeholder="请选择">
              <el-option
                v-for="item in markTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="form.markType === 1"
        type="flex"
        align="middle"
        justify="start"
      >
        <el-form-item label="录像前后时间" required>
          <el-input-number
            v-model="form.capBefore"
            :step="1"
            :min="0"
            :max="20"
          ></el-input-number
          >秒
        </el-form-item>
        <el-form-item label-width="20" required>
          <el-input-number
            v-model="form.capAfter"
            :step="1"
            :min="0"
            :max="20"
          ></el-input-number
          >秒
        </el-form-item>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="关联工序" prop="workProcedureId">
            <el-select v-model="form.workProcedureId" placeholder="请选择">
              <el-option
                v-for="item in workOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="memo">
            <el-input
              v-model="form.memo"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleOk">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { safeLimit,requiredVerify } from "@/common/js/validator";
import {
  updateVideoMarker,
  getVideoMarker,
  getWorkByChannel,
} from "@/api/overhaul/videoApi.js";

const markTypeOptions = [
  { label: "图片", value: 0 },
  { label: "视频", value: 1 },
];
export default {
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
      saveLoading: false,
      form: {
        markName: "", //标记名称
        markType: 1, //标记类型
        workProcedureId: undefined,
        capAfter: "",
        capBefore: "",
        memo: "",
      },
      rules: {
        markName: safeLimit("", true),
        markType: requiredVerify(),
        workProcedureId: requiredVerify(),
        memo: safeLimit("", false),
      },
      markTypeOptions,
      workOptions: [],
    };
  },
  mounted() {
    getVideoMarker(this.operateRow.id).then((res) => {
      this.form = res.data;
      this.getChannelCodesOptions(res.data.workId,res.data.sceneType);
    });
  },
  methods: {
    /**
     * 获取通道选项
     */
    getChannelCodesOptions(workId,sceneType) {
      getWorkByChannel({
        workId,
        sceneType,
        channelCode: this.form.channelCode,
        // channelCode:'10087@1'
      }).then((res) => {
        this.workOptions = (res.data.value || []).map((item) => ({
          label: item.workProcedureName,
          value: item.workProcedureId,
        }));
      });
    },
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.saveLoading = true;
        let target =  this.workOptions.find(item=>item.value===this.form.workProcedureId)
        if(target){
          this.form.workProcedureName = target.label
        }
        if (Reflect.has(this.operateRow, "id")) {
          updateVideoMarker(this.form)
            .then((res) => {
              if (res.code !== "0") {
                this.$message.error(res.errMsg);
                return;
              }
              this.handleClose(true);
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
        //请求保存接口
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
// :deep(.el-input-number .el-input--small .el-input__inner) {
//   width: inherit;
// }
</style>
