<template>
  <el-dialog
    title="工序配置"
    append-to-body
    :model-value="true"
    :destroy-on-close="true"
    class="distribute-modal"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :model="form"
      :rules="rules"
      label-position="right"
      size="small"
      label-width="120px"
    >
      <div class="el-descriptions__title">通道选择</div>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="视频通道选择" prop="channelCodes">
            <el-select
              v-model="form.channelCodes"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in channelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>
      <div class="el-descriptions__title">工序复核</div>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="审批人员" prop="approvalPerson">
            <el-select
              v-model="form.approvalPerson"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in approvalPersonlOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标记类型">
            <el-radio-group v-model="form.remind">
              <el-radio :label="1">立即</el-radio>
              <el-radio :label="2">2小时</el-radio>
              <el-radio :label="3">4小时</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="el-descriptions__title">派工选择</div>
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="12">
          <el-form-item label="组长" prop="groupLeader">
            <el-select
              v-model="form.groupLeader"
              class="filter-item"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in groupLeaderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="副组长" prop="assistantGroupLeader">
            <el-select
              v-model="form.assistantGroupLeader"
              class="filter-item"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in assistantGroupLeaderOptions"
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
          <el-form-item label="成员" prop="members">
            <el-select v-model="form.members" multiple placeholder="请选择">
              <el-option
                v-for="item in membersOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
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
import dayjs from "dayjs";
import { requiredVerify } from "@/common/js/validator";
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
        channelCodes: [],
        approvalPerson: [], //标记名称
        remind: 1, //标记类型
        members: [],
        assistantGroupLeader: [],
        groupLeader: [],
        date: dayjs(),
      },
      rules: {
        channelCodes: requiredVerify(),
        approvalPerson: requiredVerify(),
        members: requiredVerify(),
        assistantGroupLeader: requiredVerify(),
        groupLeader: requiredVerify(),
        date: requiredVerify(),
      },
      assistantGroupLeaderOptions: [{ label: "张学友", value: 1 }],
      approvalPersonlOptions: [{ label: "张学友", value: 1 }],
      membersOptions: [{ label: "四大天王", value: 1 }],
      groupLeaderOptions: [{ label: "四大天王", value: 1 }],
      channelOptions: [{ label: "视频通道1", value: 1 }],
    };
  },
  methods: {
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.saveLoading = true;
        //请求保存接口
      });
    },
    handleClose(isSearch = false) {
      this.$emit("closeModal", this.modalName, isSearch);
    },
  },
};
</script>
<style lang="scss">
div .distribute-modal {
  width: 50%;
}
</style>
<style lang="scss" scoped>
::v-deep(.el-input-number .el-input--small .el-input__inner) {
  width: inherit;
}
</style>