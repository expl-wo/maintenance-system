<template>
  <hr />
  <el-row>
    <el-col :span="10">
      <span class="el-descriptions__title" style="font-size: 14px">{{
        contentHeader
      }}</span>
    </el-col>
    <el-col :span="8" class="work-content-title">
      <el-date-picker
        v-model="form.date"
        v-if="[0, 1].includes(executionFrequency)"
        type="date"
        placeholder="日期"
        :clearable="false"
        :value-format="COMMON_FORMAT"
        :cell-class-name="setCellClassName"
        :disabled-date="disabledDate"
        @panel-change="panelChange"
        @change="searchValChange"
        @focus="focusChange"
        style="width: 200px"
      />
      <el-select
        v-if="[0].includes(executionFrequency)"
        v-model="form.time"
        class="mgl12"
        placeholder="时间"
        style="width: 200px"
        @change="searchValChange"
        @visible-change="visibleChange"
      >
        <template #prefix
          ><el-icon><Clock /></el-icon
        ></template>
        <el-option
          v-for="item in timeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <template #default
            >{{ item.label }}
            <el-icon
              class="mgl12"
              color="#67c23a"
              title="已执行"
              v-if="item.status"
              ><CircleCheck
            /></el-icon>
            <el-icon class="mgl12" color="#f56c6c" title="待执行" v-else
              ><Warning /></el-icon
          ></template>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <el-form-item label="填写内容" :required="isRequired">
        <el-input
          v-if="contentType === 0"
          v-model="form.contentData"
          :maxlength="maximumContentLength"
          clearable
        />
        <el-input
          v-else-if="contentType === 5"
          v-model="form.contentData"
          :maxlength="maximumContentLength"
          autosize
          type="textarea"
          clearable
        />
        <template v-else-if="contentType === 1">
          <el-input-number
            v-model="form.contentData"
            :min="lowerLimit"
            :max="upperLimit"
          />
          {{ dataUnit }}
        </template>
        <el-date-picker
          v-else-if="contentType === 2"
          v-model="form.contentData"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          type="datetime"
          time-format="HH:mm"
          style="width: 100%"
        />
        <el-radio-group
          v-model="form.contentData"
          v-else-if="contentType === 3"
        >
          <el-radio
            v-for="(item, index) in dictionaryContent"
            :key="index"
            :label="item.code"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
        <el-checkbox-group
          v-model="form.contentData"
          v-else-if="contentType === 4"
        >
          <el-checkbox
            v-for="(item, index) in dictionaryContent"
            :key="index"
            :label="item.name"
            :value="item.code"
          />
        </el-checkbox-group>
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item label="操作描述">{{ contentLabel }}</el-form-item>
  <el-row v-if="requireImageFile">
    <el-col :span="12">
      <el-form-item label="附件">
        <multi-upload-vue
          :limit="3"
          :fileUrl="fileUrl"
          :disabled="!isEditAuth || ![1].includes(workStatus)"
          :fileName="fileName"
          accept="video/*,.jpg,.png,.jpeg"
          @uploadSuccess="uploadSuccess"
        ></multi-upload-vue>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import multiUploadVue from "@/views/overhaul/overhaulCommon/multi-upload.vue";
import dayjs from "dayjs";
import { COMMON_FORMAT } from "@/views/overhaul/constants.js";
import { getWorkStatusByTime } from "@/api/overhaul/workOrderApi.js";
export default {
  components: {
    multiUploadVue,
  },
  props: {
    workStatus:{
      type: Number,
      default: 0,
    },
    //是否能编辑
    isEditAuth: {
      type: Boolean,
      default: false,
    },
    currentSelectNode: {
      type: Object,
      default() {
        return {};
      },
    },
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    sceneType: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    lowerLimit: {
      type: Number,
      default: undefined,
    },
    dictionaryContent: {
      type: Array,
      default() {
        return [];
      },
    },
    executionFrequency: {
      type: Number,
      default: 0,
    },
    upperLimit: {
      type: Number,
      default: undefined,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    contentType: {
      type: Number,
      default: 1, //0为文本 1为数字 2为时间 3为radio 4为checkbox 5文本域
    },
    dataUnit: {
      type: String,
      default: "",
    },
    maximumContentLength: {
      type: [String, Number],
      default: "1000",
    },
    requireImageFile: {
      type: Boolean,
      default: true,
    },
    contentHeader: {
      type: String,
      default: "",
    },
    contentLabel: {
      type: String,
      default: "",
    },
  },
  emits: ['searchChange'],
  data() {
    return {
      COMMON_FORMAT,
      fileUrl: "",
      fileName: "",
      timeOptions: [],
      opearationId: "",
      successList: [],
      form: {
        date: dayjs().format(COMMON_FORMAT),
        time: "01:00",
        contentData: undefined,
        fileUrl: "",
        fileName: "",
      },
    };
  },
  created() {
    this.getTimeOptions();
  },
  // watch: {
  //   dictionaryContent: {
  //     handler(val) {
  //       if (
  //         Array.isArray(val) &&
  //         val.length &&
  //         !this.form.contentData &&
  //         +this.contentType === 3
  //       ) {
  //         this.form.contentData = val[0].code;
  //       }
  //     },
  //     immediate: true,
  //   },
  // },
  computed: {
    beginTime() {
      let beginTime = "";
      if (this.executionFrequency === 0) {
        beginTime = dayjs(this.form.date)
          .hour(this.form.time.split(":")[0])
          .minute(0)
          .second(0)
          .format(COMMON_FORMAT);
      } else if (this.executionFrequency === 1) {
        beginTime = dayjs(this.form.date).endOf("day").format(COMMON_FORMAT);
      }
      return beginTime;
    },
  },
  methods: {
    resetContent() {
      this.form.contentData = "";
      this.form.fileUrl = "";
      this.form.fileName = "";
      this.fileUrl = "";
      this.fileName = "";
      this.opearationId = "";
    },
    visibleChange(open) {
      if (open) {
        let params = {
          beginTime: dayjs(this.form.date).startOf("day").format(COMMON_FORMAT),
          endTime: dayjs(this.form.date).endOf("day").format(COMMON_FORMAT),
        };
        this.getStatus(params.beginTime, params.endTime);
      }
    },
    focusChange() {
      this.panelChange(this.form.date, "month");
    },
    panelChange(data, mode) {
      if (mode === "month") {
        let params;
        //每小时
        if (this.executionFrequency === 0) {
          params = {
            beginTime: dayjs(data).startOf("day").format(COMMON_FORMAT),
            endTime: dayjs(data).endOf("day").format(COMMON_FORMAT),
          };
        } else {
          params = {
            beginTime: dayjs(data)
              .startOf("month")
              .startOf("day")
              .format(COMMON_FORMAT),
            endTime: dayjs(data)
              .endOf("month")
              .endOf("day")
              .format(COMMON_FORMAT),
          };
        }
        this.getStatus(params.beginTime, params.endTime);
      }
    },
    getStatus(beginTime, endTime) {
      getWorkStatusByTime({
        workCode: this.workOrderInfo.id,
        craftCode: this.currentSelectNode.procedureCode,
        operationCode: this.id,
        beginTime,
        endTime,
        workScene: this.sceneType,
      }).then((res) => {
        const result = res.data.value;
        if (this.executionFrequency === 0) {
          const success = result.map((item) => {
            return dayjs(item).startOf("hour").format("HH:mm");
          });
          this.getTimeOptions(false, success);
        } else {
          this.successList = [];
          this.successList = result.map((item) => {
            return dayjs(item).format("YYYY-MM-DD");
          });
        }
      });
    },
    //查询条件
    searchValChange() {
      this.resetContent();
      this.$emit("searchChange", this.id, this.beginTime);
    },
    //禁用时间主要用于禁止开始时间早于结束时间
    disabledDate(Date) {
      return dayjs(Date).isAfter(dayjs());
    },
    getTimeOptions(isSetTime = true, targetStatus = []) {
      this.timeOptions = [];
      new Array(24).fill(1).forEach((item, index) => {
        this.timeOptions.push({
          label: `${String(index).padStart(2, "0")}:00 ~ ${String(
            index + 1
          ).padStart(2, "0")}:00`,
          value: `${String(index).padStart(2, "0")}:00`,
          status: targetStatus.includes(
            `${String(index).padStart(2, "0")}:00`
          ),
        });
      });
      if (isSetTime) {
        this.form.time = dayjs().startOf("hour").format("HH:mm"); //设置临近的时间点
      }
    },
    uploadSuccess(fileName, fileList) {
      this.form.fileName = fileName;
      this.form.fileUrl = fileList.map((item) => item.fileUrl || []).join("|");
    },
    setCellClassName(data) {
      let time = dayjs(data).format("YYYY-MM-DD");
      if (dayjs(data).isAfter(dayjs()) || this.executionFrequency === 0) {
        return "";
      } else if (this.successList.includes(time)) {
        return "success-pick";
      } else {
        return "warn-pick";
      }
    },
  },
};
</script>
<style>
.success-pick::after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  background-color: #67c23a;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translateX(-50%);
}
.warn-pick::after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  background-color: #f56c6c;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translateX(-50%);
}
</style>
<style lang="scss" scoped>
.mgl12 {
  margin-left: 12px;
}
.marb {
  margin-bottom: 20px;
}
.work-content-title {
  display: flex;
  justify-content: flex-end;
}
hr {
  display: block;
  height: 1px;
  width: 100%;
  margin: 12px 0;
  border: none;
  border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>