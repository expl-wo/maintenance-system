<template>
  <hr />
  <el-row>
    <el-col :span="10">
      <span class="el-descriptions__title" style="font-size: 14px">{{
        contentLabel
      }}</span>
    </el-col>
    <el-col :span="6" class="work-content-title">
      <el-date-picker
        v-model="form.date"
        type="date"
        placeholder="日期"
        :clearable="false"
        :value-format="COMMON_FORMAT"
        :cell-class-name="setCellClassName"
        :disabled-date="disabledDate"
        @panel-change="panelChange"
        @change="searchChange"
        style="width: 100%"
      />
      <el-select
        v-model="form.time"
        class="mgl12"
        placeholder="时间"
        @change="searchChange"
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
      <el-form-item label="反馈内容">
        <el-input
          v-if="contentType === 1"
          v-model="form.contentData"
          clearable
        />
        <el-input
          v-else-if="contentType === 6"
          v-model="form.contentData"
          autosize
          type="textarea"
          clearable
        />
        <el-input-number
          v-else-if="contentType === 2"
          v-model="form.contentData"
          :min="1"
          :max="10"
        />
        <el-date-picker
          v-else-if="contentType === 3"
          v-model="form.contentData"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
        <el-radio-group
          v-model="form.contentData"
          v-else-if="contentType === 4"
        >
          <el-radio :label="3">Option A</el-radio>
          <el-radio :label="6">Option B</el-radio>
          <el-radio :label="9">Option C</el-radio>
        </el-radio-group>
        <el-checkbox-group
          v-model="form.contentData"
          v-else-if="contentType === 5"
        >
          <el-checkbox label="Option A" />
          <el-checkbox label="Option B" />
          <el-checkbox label="Option C" />
          <el-checkbox label="disabled" />
          <el-checkbox label="selected and disabled" />
        </el-checkbox-group>
      </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <el-form-item label="附件">
        <multi-upload-vue
          :limit="3"
          :fileUrl="fileUrl"
          :fileName="fileName"
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
export default {
  components: {
    multiUploadVue,
  },
  props: {
    contentType: {
      type: Number,
      default: 1, //1为文本 2为数字 3为时间 4为radio 5为checkbox 6文本域
    },
    contentLabel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fileUrl: "",
      fileName: "",
      timeOptions: [],
      form: {
        date: dayjs().format(COMMON_FORMAT),
        time: "00:00",
        contentData: "",
        fileUrl: "",
        fileName: "",
      },
    };
  },
  created() {
    this.getTimeOptions();
  },
  methods: {
    panelChange(data, mode) {
      debugger;
    },
    searchChange() {
      console.log("筛选发生变化");
    },
    //禁用时间主要用于禁止开始时间早于结束时间
    disabledDate(Date) {
      return dayjs(Date).isAfter(dayjs());
    },
    getTimeOptions() {
      this.timeOptions = [];
      new Array(24).fill(1).forEach((item, index) => {
        this.timeOptions.push({
          label: `${String(index).padStart(2, "0")}:00`,
          value: `${String(index).padStart(2, "0")}:00`,
          status: 0,
        });
      });
      this.form.time = dayjs().startOf("hour").format("HH:mm"); //设置临近的时间点
    },
    uploadSuccess(fileName, fileList) {
      this.form.fileName = fileName;
      this.form.fileUrl = fileList.map((item) => item.fileUrl || []).join("|");
    },
    setCellClassName(data) {
      const successList = ["2023-12-03", "2023-12-02"];
      const failList = ["2023-12-01"];
      let time = dayjs(data).format("YYYY-MM-DD");
      if (successList.includes(time)) {
        return "success-pick";
      } else if (failList.includes(time)) {
        return "warn-pick";
      } else {
        return "";
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
  width: 8px;
  height: 8px;
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
  width: 8px;
  height: 8px;
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