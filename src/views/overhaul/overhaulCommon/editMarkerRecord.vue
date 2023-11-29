<template>
  <el-dialog
    draggable
    title="标记信息编辑"
    append-to-body
    :model-value="true"
    width="800px"
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
          <el-form-item label="标记类型">
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
        v-if="form.markType === 2"
        type="flex"
        align="middle"
        justify="start"
      >
        <el-form-item label="录像前后时间" required>
          <el-input-number
            v-model="form.beforeTime"
            :step="1"
            :min="0"
            :max="20"
          ></el-input-number
          >秒
        </el-form-item>
        <el-form-item label-width="20" required>
          <el-input-number
            v-model="form.affterTime"
            :step="1"
            :min="0"
            :max="20"
          ></el-input-number
          >秒
        </el-form-item>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="工序关联">
            <el-select v-model="form.process" placeholder="请选择">
              <el-option
                v-for="item in processOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="demo">
            <el-input
              v-model="form.demo"
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
import { safeLimit } from "@/common/js/validator";
import { addVideoMarker, updateVideoMarker } from "@/api/overhaul/videoApi.js";

const markTypeOptions = [
  { label: "图片", value: 1 },
  { label: "视频", value: 2 },
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
        process: undefined,
        affterTime: "",
        beforeTime: "",
        demo: "",
      },
      rules: {
        markName: safeLimit("", true),
        markType: safeLimit("", true),
        process: safeLimit("", true),
        demo: safeLimit("", false),
      },
      markTypeOptions,
      phuocManagerOptions: [{ label: "张学友", value: 1 }],
      processOptions: [{ label: "四大天王", value: 1 }],
    };
  },
  methods: {
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.saveLoading = true;
        if (Reflect.has(this.operateRow, "id")) {
          updateVideoMarker();
        } else {
          addVideoMarker();
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
