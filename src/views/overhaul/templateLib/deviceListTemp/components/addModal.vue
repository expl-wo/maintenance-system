<template>
  <el-dialog draggable
    :title="modalTitle"
    width="50%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <div>
      <el-form ref="templateFrom" :model="templateFrom" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item

              label="模板名称"
              prop="templateName"
              :rules="safeLimit('名称', true)"
            >
              <el-input v-model="templateFrom.templateName" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="device-wrapper">
          <el-row
            v-for="(device, index) in templateFrom.deviceList"
            :key="index"
          >
            <el-col :span="7">
              <el-form-item

                label="设备类型"
                :prop="'deviceList.' + index + '.deviceModelId'"
                :rules="requiredVerify('类型', true)"
              >
                <el-select
                  v-model="device.deviceModelId"
                  filterable
                  placeholder="请选择"
                  @change="deviceModelIdChange($event, index)"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.deviceModelId"
                    :label="item.deviceModelName"
                    :value="item.deviceModelId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item

                label="设备编码"
                :prop="'deviceList.' + index + '.deviceNumber'"
                :rules="requiredVerify('设备编码', true)"
              >
                <el-select
                  v-model="device.deviceNumber"
                  placeholder="请先选择类型"
                  @change="deviceIdChange($event, index)"
                >
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.deviceNumber"
                    :label="item.deviceNumber"
                    :value="item.deviceNumber"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item

                label="设备名称"
                :prop="'deviceList.' + index + '.deviceName'"
              >
                <el-input
                  disabled
                  v-model="device.deviceName"
                  placeholder="根据设备编码自动带出"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button
                class="ml20"

                type="danger"
                @click="removeDevice(index)"
              ><el-icon><Delete /></el-icon></el-button>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" class="center">
            <el-button

              type="primary"
              @click="addDevice"
              ><el-icon class="el-icon--left"><Plus /></el-icon>添加设备</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="handleClose">取 消</el-button>
        <el-button

          type="primary"
          :loading="loading"
          @click="handleConfirm"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { safeLimit, requiredVerify } from "@/common/js/validator";
import {
  addDeviceTemp,
  getDeviceType,
  getDeviceModel,
} from "@/api/overhaul/templateLib";
import {
  Delete,
  Plus,
} from "@element-plus/icons-vue";
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
  components: {Delete,Plus},
  data() {
    return {
      templateFrom: {
        templateId: "",
        templateName: "",
        deviceList: [],
      },
      rules: {
        templateName: safeLimit("名称", true),
      },
      content: "",
      loading: false,
      typeOptions: [],
      modelOptions: [],
      selectLoading: false,
    };
  },
  computed: {
    modalTitle() {
      return `${this.info ? "编辑" : "新增"}设备清单模板`;
    },
    deviceModelObj() {
      let obj = {};
      this.typeOptions.map((item) => {
        obj[item.deviceModelId] = item.deviceModelName;
      });
      return obj;
    },
  },
  watch: {
    async visible(newVal) {
      if (newVal) {
        this.getDevType();
        if (this.info) {
          let { templateName, list } = this.info;
          this.templateFrom.templateName = templateName;
          this.templateFrom.deviceList = list.map((item) => {
            return {
              ...item,
              deviceModelId: item.deviceModelId,
            };
          });
        }
      }
    },
  },
  mounted() {},
  methods: {
    safeLimit,
    requiredVerify,
    // 获取设备类型数据
    async getDevType() {
      let res = await getDeviceType().catch(() => {
        this.typeOptions = [];
      });
      if (res.success && res.data) {
        this.typeOptions = res.data.value || [];
      }
    },
    // 新增设备
    addDevice() {
      this.templateFrom.deviceList.push({
        deviceModelId: "",
        deviceName: "",
        deviceNumber: "",
      });
    },
    // 删除设备
    removeDevice(index) {
      this.templateFrom.deviceList.splice(index, 1);
    },
    // 关闭
    handleClose() {
      this.resetForm();
      this.$emit("closeModal", "add", false);
    },
    // 确定
    handleConfirm() {
      this.$refs.templateFrom.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        let list = this.templateFrom.deviceList.map((item) => {
          return {
            deviceModelId: item.deviceModelId,
            deviceModelName: this.deviceModelObj[item.deviceModelId],
            deviceName: item.deviceName,
            deviceNumber: item.deviceNumber,
          };
        });
        let params = {
          templateId: this.templateFrom.templateId,
          templateName: this.templateFrom.templateName,
          list,
          createrId: localStorage.getItem("userId"),
        };
        addDeviceTemp(params).then((res) => {
          if (res.success) {
            this.$message.success("操作成功");
            this.resetForm();
            this.loading = false;
            this.$emit("closeModal", "add", true);
          }
        });
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.templateFrom.resetFields();
      this.templateFrom.deviceList = [];
    },
    // 设备类型发生变化
    deviceModelIdChange(val, index) {
      // 重置设备编码和名称
      this.templateFrom.deviceList[index].deviceNumber = "";
      this.templateFrom.deviceList[index].deviceName = "";
      let params = { deviceModelId: val };
      getDeviceModel(params)
        .then((res) => {
          if (res.success && res.data) {
            this.modelOptions = res.data.value || [];
          }
        })
        .catch(() => {
          this.modelOptions = [];
        });
    },
    // 设备编码发生变化
    deviceIdChange(val, index) {
      let selectedDevice = this.modelOptions.filter(
        (item) => item.deviceNumber === val
      )[0];
      this.templateFrom.deviceList[index].deviceName =
        selectedDevice.deviceName;
    },
  },
};
</script>
<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
}
.device-wrapper {
  max-height: 500px;
  overflow: auto;
}
.ml20 {
  margin-left: 20px;
}
</style>
