<template>
  <el-dialog
    title="工序指派"
    :model-value="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="500"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="form"
      label-position="right"
      size="small"
      label-width="100px"
    >
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="项目经理" prop="projectManager">
            <el-select-v2
              v-model="form.projectManager"
              class="filter-item"
              placeholder="请选择"
              :options="projectManagerOptions"
            >
            </el-select-v2>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="项目副经理">
            <el-select-v2
              v-model="form.phuocManager"
              class="filter-item"
              placeholder="请选择"
              :options="phuocManagerOptions"
            >
            </el-select-v2>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="24">
          <el-form-item label="任务人员" prop="taskTeamPerson">
            <el-cascader
              v-model="form.taskTeamPerson"
              :options="options"
              :show-all-levels="false"
              max-collapse-tags="3"
              filterable
              :props="{ multiple: true }"
              collapse-tags
              collapse-tags-tooltip
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="任务描述" prop="taskDescription">
            <el-input
              v-model="form.taskDescription"
              type="textarea"
              :rows="2"
              placeholder="请输入任务描述"
            />
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click.stop="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleOk"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { safeLimit } from "@/common/js/validator";
import {
  getConfiguredWorkClazz,
  getWorkClazzList,
  getPersonByWorkClazz,
} from "@/api/overhaul/workClazzApi.js";
import { INPLAN_OR_OUT } from "@/views/overhaul/constants.js";
const options = [
  {
    value: 1,
    label: "空闲人员",
    children: [
      {
        value: 2,
        label: "张三",
        children: [],
      },
      {
        value: 6,
        label: "李四",
        children: [],
      },
      {
        value: 10,
        label: "王五",
        children: [],
      },
    ],
  },
  {
    value: 14,
    label: "繁忙人员",
    children: [
      {
        value: 15,
        label: "陈奕迅",
        children: [],
      },
      {
        value: 19,
        label: "周杰伦",
        children: [],
      },
    ],
  },
  {
    value: 23,
    label: "请假人员",
    children: [
      {
        value: 24,
        label: "刘德华",
        children: [],
      },
      {
        value: 28,
        label: "张学友",
        children: [],
      },
    ],
  },
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
    //所属班组的字段
    workClazzType: {
      type: String,
      default: "",
    },
  },
  computed: {
    //厂内场外编号
    taskTempClazzType() {
      return ["survey", "overhaulGroup"].includes(this.workClazzType)
        ? INPLAN_OR_OUT.OUT
        : INPLAN_OR_OUT.IN;
    },
  },
  data() {
    return {
      options,
      form: {
        projectManager: undefined,
        phuocManager: undefined,
        taskTeamPerson: [],
        // taskDescription: "",
      },
      rules: {
        projectManager: safeLimit("", true),
        taskTeamPerson: safeLimit("", true),
      },
      projectManagerOptions: [],
      phuocManagerOptions: [],
      taskTeamOptions: [],
    };
  },
  mounted() {
    this.initData();
    this.getTaskTeamOptions();
  },
  methods: {
    //获取所有任务班组
    async getTaskTeamOptions() {
      try {
        const {
          data: { value },
        } = await getWorkClazzList();
        this.taskTeamOptions = (value || []).map((item) => ({
          label: item.name,
          value: item.id,
        }));
      } catch (error) {
        this.taskTeamOptions = [];
      }
    },
    /**
     * 获取所有的已配置的班组
     */
    async initData() {
      const {
        data: { value },
      } = await getConfiguredWorkClazz();
      let targetWorkBusId, taskTempClazzBusId;
      value.forEach((item) => {
        if (item.workClazzType === this.workClazzType) {
          targetWorkBusId = item.busId;
        }
        if (item.workClazzType === this.taskTempClazzType) {
          taskTempClazzBusId = item.busId;
        }
      });
      console.log("taskTempClazzBusId:", taskTempClazzBusId);
      if (targetWorkBusId) {
        let {
          data: { value },
        } = await getPersonByWorkClazz(targetWorkBusId);
        this.phuocManagerOptions = (value || []).map((item) => ({
          value: item.id,
          name: item.name,
        }));
        this.projectManagerOptions = this.phuocManagerOptions;
        return;
      }
      this.$message.error("未检测到配置班组，请前往业务配置进行班组配置！");
    },
    handleOk() {
        this.$emit("onSave", this.modalName);
      this.$refs["dataForm"].validate((valid) => {
        if (!valid) return;
        debugger;
        this.$emit("onSave", this.modalName);
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
// ::v-deep(.el-input--small .el-input__inner) {
//   width: 220px;
// }
</style>