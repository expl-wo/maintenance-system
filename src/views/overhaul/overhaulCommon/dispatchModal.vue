<template>
  <el-dialog
    title="任务指派"
    :model-value="true"
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
          <el-form-item label="任务班组"  prop="taskTeam">
            <el-select-v2
              v-model="form.taskTeam"
              class="filter-item"
              placeholder="请选择"
              :options="taskTeamOptions"
            >
            </el-select-v2>
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
        <el-button type="primary" @click="handleOk"> 保存 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { requiredVerify, safeLimit } from "@/common/js/validator";
import {
  getConfiguredWorkClazz,
  getWorkClazzList,
  getPersonByWorkClazz,
} from "@/api/overhaul/workClazzApi.js";
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
  data() {
    return {
      form: {
        projectManager: undefined,
        phuocManager: undefined,
        taskTeam: undefined,
        // taskDescription: "",
      },
      rules: {
        projectManager: safeLimit("", true),
        taskTeam: safeLimit("", true),
      },
      projectManagerOptions: [{ label: "刘德华", value: 1 }],
      phuocManagerOptions: [{ label: "张学友", value: 1 }],
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
      const res = await getConfiguredWorkClazz();
      let test = [
        {
          busId: "29784ff7-a8b5-4495-9294-9ed5df76a8c5",
          workClazzType: "survey",
          workClazzId: "111",
          workClazzName: "班组1",
          accountSuiteId: "C06",
        },
        {
          busId: "668ff44b-edba-47b8-9edf-56835e6bb789",
          workClazzType: "overhaulGroup",
          workClazzId: "222",
          workClazzName: "班组1",
          accountSuiteId: "C06",
        },
        {
          busId: "5bfd2ae4-6cb6-4829-8965-f06df208e096",
          workClazzType: "assembleGroup",
          workClazzId: "333",
          workClazzName: "班组3",
          accountSuiteId: "C06",
        },
        {
          busId: "189773b5-fda1-471f-a838-5de1d93b1092",
          workClazzType: "prodDeptGroup",
          workClazzId: "444",
          workClazzName: "班组4",
          accountSuiteId: "C06",
        },
        {
          busId: "762423d1-ab84-4f68-8be2-1c7718b03bf9",
          workClazzType: "experimentalGroup",
          workClazzId: "555",
          workClazzName: "班组5",
          accountSuiteId: "C06",
        },
      ];
      console.log(this.workClazzType);
      const targetWork = test.find(
        (item) => item.workClazzType === this.workClazzType
      );
      if (targetWork && targetWork.busId) {
        let personList = await getPersonByWorkClazz(targetWork.busId);
        debugger;
        return;
      }
      this.$message.error("未检测到配置班组，请前往业务配置进行班组配置！");
    },
    handleOk() {
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