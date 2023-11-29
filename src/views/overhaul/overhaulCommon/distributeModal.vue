<template>
  <el-dialog draggable
    :title="modalTitle"
    append-to-body
    :model-value="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="120px"
    >
      <el-row
        type="flex"
        align="middle"
        justify="space-between"
        v-if="operateRow === 1"
      >
        <el-col :span="24">
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
      </el-row>
      <el-row
        type="flex"
        align="middle"
        justify="space-between"
        v-if="operateRow === 2"
      >
        <el-col :span="24">
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
        <el-col :span="24">
          <el-form-item label="标记类型">
            <el-radio-group v-model="form.remind">
              <el-radio :label="1">立即</el-radio>
              <el-radio :label="2">2小时</el-radio>
              <el-radio :label="3">4小时</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        justify="space-between"
        v-if="operateRow === 3"
      >
        <el-col :span="24">
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
        <el-col :span="24">
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
        <el-col :span="24">
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
        <el-col :span="24">
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
      <el-row
        type="flex"
        align="middle"
        justify="space-between"
        v-if="operateRow === 4"
      >
        <el-col :span="24">
          <el-form-item label="大件设备" prop="taskTeamPerson">
            <el-cascader
              v-model="form.taskTeamPerson"
              :options="devOptions"
              :show-all-levels="false"
              max-collapse-tags="3"
              filterable
              :props="{ multiple: true }"
              collapse-tags
              collapse-tags-tooltip
              clearable
            >
              <template #default="{ node, data }">
                <span>{{ data.label }}</span>

                <el-popover
                  v-if="node.isLeaf"
                  placement="bottom"
                  :width="200"
                  trigger="click"
                >
                  <template #reference>
                    <el-icon
                      class="position-icon"
                      @click.stop="showLocation(data)"
                      ><QuestionFilled
                    /></el-icon>
                  </template>
                  <span>{{ devUserInfo }}</span>
                </el-popover>
              </template>
            </el-cascader>
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
import { bindWorkInfo } from "@/api/overhaul/workOrderApi.js";
import { QuestionFilled } from "@element-plus/icons-vue";
const OPERATE_MAP = {
  1: { title: "视频绑定配置" },
  2: { title: "复核人员配置" },
  3: { title: "派工配置" },
  4: { title: "大件设备配置" },
};
const devOptions = [
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
  components: {
    QuestionFilled,
  },
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    operateRow: {
      type: Number,
      default: 1, //1为视频 2为复核 3为派工
    },
    //工单类型
    workOrderType: {
      type: Number,
      default: 1,
    },
    //点击的tab
    onlyTabName: {
      type: String,
      default: "",
    },
    modalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      devOptions,
      personArea: "",
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
  computed: {
    modalTitle() {
      return OPERATE_MAP[this.operateRow].title;
    },
    //是否厂内
    isFactoryIn() {
      return ![
        "processInfo",
        "siteOverhaul-processInfo",
        "siteDismantle-processInfo",
      ].includes(this.onlyTabName);
    },
  },
  methods: {
    /**
     * 显示当前选择人员的位置
     */
    showLocation(data) {
      this.$nextTick(() => {
        this.devUserInfo = data;
      });
      //获取位置
    },
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
<style lang="scss" scoped>
:deep(.el-input-number .el-input--small .el-input__inner) {
  width: inherit;
}
.position-icon {
  vertical-align: middle;
  margin-left: 5px;
}
</style>
