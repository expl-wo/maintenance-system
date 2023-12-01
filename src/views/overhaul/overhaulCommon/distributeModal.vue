<template>
  <el-dialog
    draggable
    :title="modalTitle"
    append-to-body
    :model-value="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :width="operateRow === 4 ? '800px' : '500px'"
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
            <select-page
              ref="selectRef"
              v-model="form.channelCodes"
              :getOptions="getChannelOptions"
              multiple
              @change="channelChange"
            />
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
          <el-form-item label="复核人员" prop="approvalPerson">
            <el-select-v2
              v-model="form.approvalPerson"
              placeholder="请选择"
              :options="taskPersonOptions"
            >
            </el-select-v2>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标记类型">
            <el-radio-group v-model="form.checkType">
              <el-radio label="NOW">立即</el-radio>
              <el-radio label="TWO_HOURS">2小时</el-radio>
              <el-radio label="FOUR_HOURS">4小时</el-radio>
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
            <el-select-v2
              v-model="form.groupLeader"
              class="filter-item"
              placeholder="请选择"
              :options="taskPersonOptions"
            >
            </el-select-v2>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="副组长" prop="assistantGroupLeader">
            <el-select-v2
              v-model="form.assistantGroupLeader"
              class="filter-item"
              placeholder="请选择"
              :options="taskPersonOptions"
            >
            </el-select-v2>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="成员" prop="members">
            <el-select-v2
              v-model="form.members"
              multiple
              style="width: 220px"
              :multiple-limit="20"
              placeholder="请选择"
              class="filter-item"
              :options="taskPersonOptions"
            >
            </el-select-v2>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-cascader-panel
        v-if="operateRow === 4"
        v-model="form.taskTeamPerson"
        :options="devOptions"
        :props="{ multiple: true }"
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
              <el-icon class="position-icon" @click.stop="showLocation(data)"
                ><QuestionFilled
              /></el-icon>
            </template>
            <span>{{ devUserInfo }}</span>
          </el-popover>
        </template>
      </el-cascader-panel>
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
import SelectPage from "@/components/SelectPage/selectPage.vue";
import {
  bindDev,
  bindReview,
  bindDispatch,
  bindBigComponent,
  getBigComponent,
} from "@/api/overhaul/workOrderApi.js";
import { getChannelList } from "@/api/overhaul/deviceListApi.js";
import { getPersonByWorkClazz } from "@/api/overhaul/workClazzApi.js";
const OPERATE_MAP = {
  1: { title: "视频绑定配置" },
  2: { title: "复核人员配置" },
  3: { title: "派工配置" },
  4: { title: "大件设备配置" },
};
export default {
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
    currentNode: {
      type: Array,
      default() {
        return [];
      },
    },
    sceneType: {
      type: String,
      default: "",
    },
    //指派人员信息
    appointInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    SelectPage,
  },
  data() {
    return {
      //大件设备
      devOptions: [],
      personArea: "",
      saveLoading: false,
      form: {
        channelCodes: [],
        approvalPerson: undefined, //复核人员
        checkType: "NOW", //复核及时性
        members: [],
        assistantGroupLeader: undefined,
        groupLeader: undefined,
        date: dayjs(),
        channelList: [],
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
      taskPersonOptions: [], //任务人员
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
  mounted() {
    if (this.operateRow === 4) {
      getBigComponent().then(({ data }) => {
        this.getDevOptions(data);
        // this.devOptions.forEach((element) => {
        //   element.children = data[element.value].map((item) => ({
        //     ...item,
        //     label: item.equipmentModel,
        //     value: item.equipmentTypeId,
        //   }));
        // });
      });
    }

    this.getPersonOptions(this.appointInfo.taskGroupId || "120");
  },
  methods: {
    /**获取大件设备选项 */
    getDevOptions() {
      const workList = this.currentNode
        .filter((el) => +el.procedureType === 2)
        .map((item) => ({
          value: item.procedureCode,
          label: item.procedureName,
          children: [
            {
              value: "BUSY",
              label: "占用",
              children: [
                {
                  value: "1",
                  label: "设备1",
                },
              ],
            },
            {
              value: "FREE",
              label: "空闲",
              children: [
                {
                  value: "2",
                  label: "设备2",
                },
              ],
            },
          ],
        }));
      this.devOptions = workList;
    },
    channelChange(val) {
      if (!val.length) {
        this.form.channelList = [];
        return;
      }
      const options = this.$refs.selectRef.selectOptions;
      this.form.channelList = options.filter((item) => {
        return val.includes(item.value);
      });
    },
    /**
     * 获取通道list
     */
    getChannelOptions() {
      const { pageNum, pageSize, searchKey } = pageOptions;
      let queryParms = {
        pageNum,
        pageSize,
        searchKey,
        types: [],
      };
      return new Promise((resolve, reject) => {
        getChannelList(queryParms).then((res) => {
          resolve({
            options: res.data.pageList.map((item) => ({
              label: item.projName,
              value: item.rowId,
            })),
            totalPage: res.data.allPageNum,
          });
        });
      });
    },
    async getPersonOptions(workClazzId) {
      if (workClazzId) {
        let {
          data: { value },
        } = await getPersonByWorkClazz(workClazzId);
        const taskUserIds = this.appointInfo.taskUserIds || [];
        this.taskPersonOptions = (value || []).map((item) => ({
          value: item.userId,
          label: item.userName,
        }));
        // .filter((item) => taskUserIds.includes(item.value));
        debugger;
      } else {
        this.$message.error("未检测到配置班组，请前往业务配置进行班组配置！");
      }
    },
    /**
     * 显示当前选择人员的位置
     */
    showLocation(data) {
      this.$nextTick(() => {
        this.devUserInfo = data;
      });
      //获取位置
    },
    //获取选中的组织节点
    getProcedureInfoList(procedureType = 2) {
      return this.currentNode
        .filter((el) => +el.procedureType === procedureType)
        .map((item) => ({
          procedureCode: item.procedureCode,
          procedureType: item.procedureType,
        }));
    },
    handleOk() {
      this.$refs["dataForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.saveLoading = true;
        if (this.operateRow === 1) {
          //视频
          bindDev({
            workCode: this.workOrderInfo.id,
            workOrderSceneType: this.sceneType,
            procedureInfoList: this.getProcedureInfoList(3),
            deviceInfoList: this.form.channelList,
          }).then((res) => {
            debugger;
          });
        } else if (this.operateRow === 2) {
          //复核
          bindReview({
            workCode: this.workOrderInfo.id,
            workOrderSceneType: this.sceneType,
            procedureInfoList: this.getProcedureInfoList(3),
            reviewInfo: {
              personCode: this.form.approvalPerson,
              checkType: this.form.checkType,
            },
          }).then((res) => {
            this.saveLoading = false;
            if (res.code === "0") {
              this.$message.success("操作成功！");
              this.handleClose();
            }
          });
        } else if (this.operateRow === 3) {
          //派工
          bindDispatch({
            workCode: this.workOrderInfo.id,
            workOrderSceneType: this.sceneType,
            procedureInfoList: this.getProcedureInfoList(3),
            dispatchInfo: {
              leaderPersonCodes: [this.form.groupLeader],
              deputyLeaderPersonCodes: this.form.assistantGroupLeader
                ? [this.form.assistantGroupLeader]
                : [],
              memberPersonCodes: this.form.members,
            },
          }).then((res) => {
            this.saveLoading = false;
            if (res.code === "0") {
              this.$message.success("操作成功！");
              this.handleClose();
            }
          });
        } else {
          //大件设备
          bindBigComponent({
            workCode: this.workOrderInfo.id,
            workOrderSceneType: this.sceneType,
            procedureInfoList: this.getProcedureInfoList(2),
            deviceInfoList: [],
          }).then((res) => {
            debugger;
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
:deep(.el-input-number .el-input--small .el-input__inner) {
  width: inherit;
}
.position-icon {
  vertical-align: middle;
  margin-left: 5px;
}
</style>
