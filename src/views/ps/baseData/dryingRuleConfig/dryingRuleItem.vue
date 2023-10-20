<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-button @click="handleAdd" size="mini" type="primary">新增</el-button>
    </div>
    <div class="panel-menu-list app-container app-containerC otherCon wp">
      <el-table stripe  ref="tableRef" highlight-current-row border :data="dataList"
                  style="font-size: 0.7rem"
        >
          <el-table-column
            header-align="center"
            align="center"
            label="序号"
            width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="干燥罐炉号"
            property="dryingTankCode"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="第一次工艺时长(小时)"
            property="firstTime"
            width="150"
          >
            <template v-slot="scope">
              <el-input-number v-model="scope.row.firstTime" :min="1" style="width: 100%;"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="器身整理(小时)"
            property="arrangeTime"
            width="130"
          >
            <template v-slot="scope">
              <el-input-number v-model="scope.row.arrangeTime" :min="0" style="width: 100%;"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="第二次工艺时长(小时)"
            property="secondTime"
            width="150"
          >
            <template v-slot="scope">
              <el-input-number v-model="scope.row.secondTime" :min="0" style="width: 100%;"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button-group>
                <el-button  type="primary" size="mini"
                            @click="handleEdit(scope.row)">保存
                </el-button>
                <el-button type="danger" size="mini"
                           @click="handleDelete(scope.row)">删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
    </div>
      <el-dialog v-dialogDrag  appendToBody :title="model.id? '编辑': '新增'"
               v-model="dialogVisible" modal width="600"
    >
      <el-form :model="model" ref="formRef" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="dryingTankId" label="干燥罐炉号" size="mini">
              <el-select value-key="k" v-model="model.dryingTankId" :clearable="false" style="width: 100%;">
                <el-option v-for="item in canSelectedDryingTankList" :key="item.k" :value="item.k" :label="item.v"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="firstTime" label="第一次工艺时长(小时)" size="mini">
              <el-input-number v-model="model.firstTime" :min="1" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="arrangeTime" label="器身整理(小时)" size="mini">
              <el-input-number v-model="model.arrangeTime" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="secondTime" label="第二次工艺时长(小时)" size="mini">
              <el-input-number v-model="model.secondTime" :min="0" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dryingRuleConfig from '@/api/plan/dryingRuleConfig'
import dryingManage from '@/api/plan/dryingManage'
import Constants from "../../../../utils/constants";

export default {
  name: 'dryingRuleItem',
  data() {
    return {
      dialogVisible: false,
      initModel:{
        dryingTankId:'',
        firstTime:'',
        arrangeTime:'',
        secondTime:'',
        id:'',
      },
      timeLimitId: '',
      model:{},
      rules:{
        dryingTankId: [{
          required: true, message: '干燥罐不能为空'
        }],
      },
      dataList: [],
      dryingTankList: [],
      canSelectedDryingTankList: []
    }
  },
  methods: {
    // initData(data) {
    initData() {
      // this.timeLimitId = data.id;
      dryingManage.findAllDryingTank({
        dryingTankCode: '',
        dryingMethod: '',
        pageNum: 1,
        pageSize: 10
      }).then(response => {
        this.dryingTankList = response.data.map(item => {
          return {
            k: item.id,
            v: item.dryingTankCode
          }
        })
        this.getDataList()
      })
    },
    handleAdd(){
      this.formatCanSelectDrying();
      this.model = {
        ...this.initModel
      }
      this.$nextTick(()=>{
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      })
      this.dialogVisible  = true;
    },
    //获取
    formatCanSelectDrying(){
      let data = this.dryingTankList.filter(item=>{
        let hasUsed = this.dataList.find(subItem=>{
          return item.k == subItem.dryingTankId
        })
        return !hasUsed;
      })
      this.canSelectedDryingTankList  = data;
    },
    getDataList() {
      let params = this.getParams()
      dryingRuleConfig.findTankTime(params).then(response => {
        if (response.err_code === Constants.respCode.success) {
          this.dataList = response.data
        } else {
          this.$message.error(response.err_msg)
        }
      })
    },
    handleSubmit() {
      this.$refs.formRef.validate((val)=>{
        if(!val){
          return;
        }
        let data = {
          ...this.model,
          timeLimitId: this.timeLimitId
        }
        dryingRuleConfig.insertTankTime(data).then(response=>{
          if (response.err_code === Constants.respCode.success) {
            this.$message.success('数据保存成功')
            this.getDataList()
            this.dialogVisible =false;
          } else {
            this.$message.error(response.err_msg)
          }
        })
      })
    },
    getParams() {
      return {
        ...this.listQuery,
        timeLimitId: this.timeLimitId,
        pageNum: 1,
        pageSize: this.$constants.pageEntryCount
      }
    },
    handleDelete(rowData){
      this.$confirm('是否删除此数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dryingRuleConfig.deleteTankTime({
          id: rowData.id
        }).then(response=>{
          if (response.err_code === Constants.respCode.success) {
            this.$message.success('数据删除成功')
            this.getDataList()
          } else {
            this.$message.error(response.err_msg)
          }
        })
      })
    },
    handleEdit(rowData){
      dryingRuleConfig.insertTankTime(rowData).then(response=>{
        if (response.err_code === Constants.respCode.success) {
          this.$message.success('数据保存成功')
          this.getDataList()
        } else {
          this.$message.error(response.err_msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
