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
              :defaultSelectVal="defaultSelectVal"
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
              clearable
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
        :props="{ multiple: true, emitPath: false }"
      >
        <template #default="{ data }">
          <span>{{ data.label }}</span>

          <el-popover
            v-if="data.equipmentModel"
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
  getBindDev,
  getBindReview,
  getBindDispatch,
} from "@/api/overhaul/workOrderApi.js";
import { getChannelList } from "@/api/overhaul/deviceListApi.js";
import { getPersonByWorkClazz } from "@/api/overhaul/workClazzApi.js";
const OPERATE_MAP = {
  1: { title: "视频绑定配置" },
  2: { title: "复核人员配置" },
  3: { title: "派工配置" },
  4: { title: "设备配置" },
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
      //设备
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
      defaultSelectVal: [],
      channelOptions: [],
      taskPersonOptions: [], //任务人员
      allBigList: [],
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
  async mounted() {
    let infoParams;
    let work = this.getProcedureInfoList(3);
    this.vlidateStep();
    if (work.length === 1) {
      infoParams = {
        workCode: this.workOrderInfo.id,
        workOrderSceneType: this.sceneType,
        procedureCode: work[0].procedureCode,
        procedureType: work[0].procedureType,
      };
    }
    if (this.operateRow === 4) {
      this.allBigList = [];
      this.getDevOptions();
      const middleId = this.devOptions.map((item) => item.value);
      getBigComponent(middleId).then(({ data }) => {
        this.devOptions.forEach((element) => {
          const target = data[+element.value];
          element.disabled = true;
          if (!target) return;
          element.children = element.children.map((el) => {
            const chil = target[el.value].map((item) => ({
              ...item,
              label: item.equipmentModel,
              value: item.equipmentNumber + "_" + item.middleCode,
            }));
            this.allBigList.push(...chil);
            return {
              ...el,
              children: chil,
              disabled: !chil.length,
            };
          });
          element.disabled = !element.children.length;
        });
        console.log(this.devOptions);
      });
    } else if (this.operateRow === 3) {
      //派工
      await this.getPersonOptions(this.appointInfo.taskGroupId);
      if (infoParams) {
        getBindDispatch(infoParams).then((res) => {
          const {
            teamLeaderUserInfoList,
            memberUserInfoList,
            deputyTeamLeaderUserInfoList,
          } = res.data;
          this.form.groupLeader = teamLeaderUserInfoList.length
            ? teamLeaderUserInfoList[0].userId
            : undefined;
          this.form.assistantGroupLeader = deputyTeamLeaderUserInfoList.length
            ? deputyTeamLeaderUserInfoList[0].userId
            : undefined;
          this.form.members = memberUserInfoList.map((item) => item.userId);
        });
      }
    } else if (this.operateRow === 2) {
      //复核
      await this.getPersonOptions(this.appointInfo.taskGroupId);
      if (infoParams) {
        getBindReview(infoParams).then((res) => {
          const { checkType, reviewUserInfoList } = res.data;
          this.form.checkType = checkType || "NOW";
          this.form.approvalPerson = reviewUserInfoList.length
            ? reviewUserInfoList[0].userId
            : undefined;
        });
      }
    } else {
      //视频
      if (infoParams) {
        getBindDev(infoParams).then((res) => {
          const { channelInfoList } = res.data;
          this.form.channelCodes = channelInfoList.map(
            (item) => item.channelCode
          );
          this.defaultSelectVal = channelInfoList.map((item) => ({
            label: item.channelName,
            value: item.channelCode,
          }));
        });
      }
    }
  },
  methods: {
    vlidateStep() {
      let work = this.getProcedureInfoList(3);
      if (!work.length && [1, 2, 3].includes(this.operateRow)) {
        this.$message.warning("请检查所选工序节点是否包含工步！");
        return false;
      }
      return true;
    },
    /**获取设备选项 */
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
              children: [],
            },
            {
              value: "FREE",
              label: "空闲",
              children: [],
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
    getChannelOptions(pageOptions) {
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
            options: res.data.pageData.map((item) => ({
              ...item,
              label: item.channelName,
              value: item.channelCode,
            })),
            totalPage: res.data.totalPage,
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
        this.taskPersonOptions = (value || [])
          .map((item) => ({
            value: item.userId,
            label: item.userName,
          }))
          .filter(
            (item) => this.isFactoryIn || taskUserIds.includes(item.value)
          );
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
          if (!this.vlidateStep()) {
            this.saveLoading = false;
            return;
          }
          //视频
          bindDev({
            workCode: this.workOrderInfo.id,
            workOrderSceneType: this.sceneType,
            procedureInfoList: this.getProcedureInfoList(3),
            deviceInfoList: this.form.channelList,
          }).then((res) => {
            this.saveLoading = false;
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
            } else {
              this.$message.success("保存成功！");
              this.handleClose(true);
            }
          });
        } else if (this.operateRow === 2) {
          if (!this.vlidateStep()) {
            this.saveLoading = false;
            return;
          }
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
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
            } else {
              this.$message.success("保存成功！");
              this.handleClose(true);
            }
          });
        } else if (this.operateRow === 3) {
          if (!this.vlidateStep()) {
            this.saveLoading = false;
            return;
          }
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
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
            } else {
              this.$message.success("保存成功！");
              this.handleClose(true);
            }
          });
        } else {
          if (!this.form.taskTeamPerson.length) {
            this.saveLoading = false;
            this.$message.error("请确认设备是否存在！");
            return;
          }
          const reuslt = this.allBigList
            .filter((item) => {
              return this.form.taskTeamPerson.includes(item.value);
            })
            .map((el) => {
              return {
                ...el,
                workCode: this.workOrderInfo.id,
                scene: this.sceneType,
                receivePerson: this.appointInfo.projManagerId,
              };
            });
          //设备
          bindBigComponent(reuslt).then((res) => {
            this.saveLoading = false;
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
            } else {
              this.$message.success("保存成功！");
              this.handleClose(true);
            }
          });
        }
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
