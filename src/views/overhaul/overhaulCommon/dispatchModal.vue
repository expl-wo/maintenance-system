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
      
      label-width="100px"
    >
      <el-form-item label="项目经理" prop="projectManager">
        <el-select-v2
          v-model="form.projectManager"
          class="filter-item"
          placeholder="请选择"
          :options="projectManagerOptions"
        >
        </el-select-v2>
      </el-form-item>
      <el-form-item label="项目副经理">
        <el-select-v2
          v-model="form.phuocManager"
          class="filter-item"
          placeholder="请选择"
          :options="phuocManagerOptions"
        >
        </el-select-v2>
      </el-form-item>
      <el-form-item
        v-if="['survey', 'overhaulGroup'].includes(workClazzType)"
        label="任务人员"
        prop="taskTeamPerson"
      >
        <el-cascader
          v-model="form.taskTeamPerson"
          :options="options"
          :show-all-levels="false"
          max-collapse-tags="3"
          filterable
          :props="{ multiple: true, emitPath: false }"
          collapse-tags
          collapse-tags-tooltip
          clearable
        >
          <template #default="{ node, data }">
            <span>{{ data.label }}</span>
            <el-popover
              v-if="node.isLeaf"
              placement="bottom"
              effect="dark"
              :width="200"
              trigger="click"
            >
              <template #reference>
                <el-icon class="position-icon" @click.stop="showLocation(data)"
                  ><QuestionFilled
                /></el-icon>
              </template>
              <div>打卡地:{{ personArea.inProjAddress }}</div>
            </el-popover>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="任务班组" v-else prop="taskTempClazzName">
        <el-input v-model="form.taskTempClazzName" disabled style="width:220px" />
      </el-form-item>
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
import { requiredVerify, safeLimit } from "@/common/js/validator";
import {
  getConfiguredWorkClazz,
  getWorkClazzList,
  getPersonByWorkClazz,
} from "@/api/overhaul/workClazzApi.js";
import { INPLAN_OR_OUT } from "@/views/overhaul/constants.js";
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
    //对应后端的场景字段
    sceneType: {
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
        taskGroupId: "",
        taskTempClazzName: "",
      },
      rules: {
        projectManager: safeLimit("", true),
        taskTeamPerson: safeLimit("", true),
        taskTempClazzName: requiredVerify(),
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
    /**
     * 显示当前选择人员的位置
     */
    showLocation(data) {
      this.personArea = data;
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
          taskTempClazzId = item.workClazzId;
          this.form.taskGroupId = item.workClazzId;
          this.form.taskTempClazzName = item.workClazzName;
        }
      });
      //获取项目经理和项目副经理
      this.getManagerOptions(targetWorkId);
      //获取任务人员
      this.getTaskPersonOptions(taskTempClazzId);
    },
    //获取任务人员
    async getTaskPersonOptions(workClazzId) {
      if (workClazzId) {
        const { data } = await getPersonStatusByBusId(workClazzId);
        this.options.forEach((item) => {
          item.children = (data[item.value] || []).map((a) => ({
            ...a,
            label: a.userName,
            value: a.userId,
          }));
        });
      }
    },
    //获取项目经理和项目副经理的人选
    async getManagerOptions(workClazzId) {
      if (workClazzId) {
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
        let params = {
          orderId: this.operateRow.id,
          sceneType: this.sceneType,
          projManagerId: this.form.projectManager,
          deputyManagerId: this.form.phuocManager,
          taskUserIds: this.form.taskTeamPerson,
          taskGroupId: this.form.taskGroupId,
          appointType: ["survey", "overhaulGroup"].includes(this.workClazzType)
            ? 1
            : 2,
        };
        dispatchWorkOrder(params).then((res) => {
          this.$emit("onSave", this.modalName);
          this.$emit("closeModal", this.modalName);
          this.$message.success("操作成功!");
        });
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>

<style lang="scss" scoped>
// :deep(.el-input--small .el-input__inner) {
//   width: 220px;
// }
</style>