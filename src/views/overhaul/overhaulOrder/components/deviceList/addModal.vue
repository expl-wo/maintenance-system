<template>
  <el-dialog draggable
    title="新增"
    :model-value="true"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"

      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="form.deviceType"
              class="filter-item"
              placeholder="请选择"
              clearable
              @change="deviceTypeChange"
            >
              <el-option
                v-for="item in deviceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号">
            <el-select
              v-model="form.deviceId"
              class="filter-item"
              placeholder="请选择"
              clearable
              @change="deviceIdChange"
            >
              <el-option
                v-for="item in deviceIdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model="form.deviceName"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleOk"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { requiredVerify } from "@/common/js/validator";
import { getAllDevType, geDevUnitType } from "@/api/overhaul/devListApi.js";
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
      form: {
        deviceType: undefined,
        deviceId: undefined,
        deviceName: "",
      },
      rules: {
        deviceType: requiredVerify(),
        deviceId: requiredVerify(),
      },
      deviceTypeOptions: [],
      deviceIdOptions: [],
    };
  },
  mounted() {
    this.getAllDevTypeList();
  },
  methods: {
    /**设备类型改变时 */
    deviceTypeChange(val) {
      if (!val) {
        this.form.deviceId = undefined;
        this.deviceIdOptions = [];
      }
      geDevUnitType(val).then((res) => {
        const {data:{value}} = res;
        this.deviceIdOptions = value.map((item) => ({
          label: item.deviceName,
          value: item.deviceId,
        }));
      });
    },
    /**
     * 获取所有设备列表
     */
    getAllDevTypeList() {
      getAllDevType().then((res) => {
        const {data:{value}} = res;
        this.deviceTypeOptions = value.map((item) => ({
          label: item.deviceModelName,
          value: item.deviceModelId,
        }));
      });
    },
    /**
     * 设备型号改变时
     */
    deviceIdChange(val) {
      if (!val) {
        this.form.deviceName = "";
      }
      let target = this.deviceIdOptions.find((item) => {
        item.value === val;
      });
      this.form.deviceName = target ? target.label : "";
    },
    handleOk() {
      this.$refs["dataForm"].validate(async (valid) => {
        this.$emit("closeModal", this.modalName);
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
