<template>
  <div class="full-content">
    <div class="config-wrapper">
      <!-- <div class="tip-wrapper">
                <span class="h40 tip-label">备注：</span>
                <span calss="h40">班组选项数据由MES系统维护，如需修改，请在MES系统中修改</span>
            </div> -->
      <el-form ref="configForm" :model="configForm" label-width="260px">
        <el-form-item v-for="item in configList" :key="item.key" :label="item.label + ':'">
          <el-select v-model="configForm[item.key]" placeholder="请选择">
            <el-option
              v-for="item in directorList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm" class="mr12" :loading="loading">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getListData, getSysConfig, configWorkClazz } from '@/api/overhaul/sysConfig';

export default {
  data() {
    return {
      configList: Object.freeze([
        {label: '勘查技术负责人组', key: 'survey'},
        {label: '运检项目经理组', key: 'overhaulGroup'},
        {label: '运检部班组', key: 'transportationGroup'},
        {label: '生产部总装项目经理组', key: 'assembleGroup'},
        {label: '生产部班组', key: 'productionGroup'},
        {label: '厂区生产-生产部项目经理组', key: 'prodDeptGroup'},
        {label: '质量部实验主管组', key: 'experimentalGroup'}
      ]),
      configForm: {
        survey: '',
        overhaulGroup: '',
        assembleGroup: '',
        prodDeptGroup: '',
        experimentalGroup: '',
      },
      directorList: [],
      // 记录
      revData: [],
      loading: false
    };
  },
  async mounted() {
    let  res = await getListData();
    if (res.success && res.data) {
      this.directorList = res.data.value || [];
    }
    let configRes = await getSysConfig();
    if (configRes.success && configRes.data) {
      this.revData = configRes.data.value || [];
      if (this.revData.length) {
        this.revData.map(item => {
          this.configForm[item.workClazzType] = item.workClazzId;
        })
      }
    }
  },
  methods: {
    // 确定
    confirm() {
      this.loading = true;
      let params;
      if (!this.revData.length) {
        params = this.configList.map(item => {
          return {
            busId: '',
            workClazzId: this.configForm[item.key],
            workClazzType: item.key
          }
        })
      } else {
        params = this.revData.map(item => {
          return {
            ...item,
            workClazzId: this.configForm[item.workClazzType]
          }
        })
      }
      configWorkClazz(params)
      .then(res => {
        if (res.success) {
          this.$message.success('操作成功');
        }
      })
      .catch(err => {
        this.$message.error('操作失败');
      })
      .finally(() => {
        this.loading = false;
      })
    },
    // 取消
    cancel() {
      this.revData.map(item => {
        this.configForm[item.workClazzType] = item.workClazzId;
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.full-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  .config-wrapper {
    padding-top: 40px;
  }
}
:deep(.el-select){
  width: 500px;
}
.mr12 {
  margin-right: 12px;
}
</style>
