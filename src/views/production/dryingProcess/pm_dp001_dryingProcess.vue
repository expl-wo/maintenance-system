<template>
  <div class="app-container">
    <el-row :gutter="12" class="hp">
      <el-col :span="12" class="hp p-lf">
        <el-card shadow="hover" class="height-60">
          <div class="wp hp app-containerC" id="psMainPlan">
            <div class="filter-container">
              <el-form :inline="true" class="demo-form-inline demo-form-zdy">
                <el-form-item label="方案编号" size="small">
                  <el-input v-model="listQuery.planCode" placeholder="方案编号" style="width: 130px;" class="filter-item" clearable />
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="primary" icon="search" @click="getList">查询</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="primary" icon="plus" @click="addOrUpdate('parent',null,true)">新增</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="danger" icon="delete" @click="delHander('parent')">删除</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-table highlight-current-row
              :data="tableData"
              class="otherCon wp"
              stripe
              style="width: 100%;font-size:0.7rem;"
              row-key="id"
              border
              :row-class-name="clickStyle"
              @row-click="rowClick"
            >
              <el-table-column prop="planCode" align="center" width="120" label="工艺方案编号"/>
              <el-table-column prop="planName" align="center" width="120" label="工艺方案名称"/>
              <el-table-column prop="dryingTank" align="center" label="干燥罐"/>
              <el-table-column prop="estimatedTotalTime" align="center" width="150" label="预定干燥总时间(h)"/>
              <el-table-column header-align="center" align="center" width="80" label="操作">
                <template #default="scope">
                  <el-button size="small" type="primary" icon="edit" @click="addOrUpdate('parent',scope.row,false)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination :total="listQuery.total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getList"/>

          </div>
        </el-card>

        <el-card shadow="hover" class="height-40">
          <div class="wp hp app-containerC">
            <div class="filter-container">
              <el-form :inline="true" class="demo-form-inline demo-form-zdy">
                <el-form-item size="small">
                  <el-button type="primary" icon="plus" @click="addOrUpdateVoltage('add')">新增</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="danger" icon="delete" @click="delVoltageHandle">删除</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-table highlight-current-row
              :data="voltageTableData"
              class="otherCon wp"
              stripe
              style="width: 100%;font-size:0.7rem;"
              row-key="id"
              border
              @selection-change="selectionVoltageChange"
            >
              <el-table-column align="center" type="selection" width="50"></el-table-column>
              <el-table-column prop="voltageLevelMin" align="center" label="电压等级下限(kV)"/>
              <el-table-column prop="voltageLevelMax" align="center" label="电压等级上限(kV)"/>
              <el-table-column header-align="center" align="center" width="80" label="操作">
                <template #default="scope">
                  <el-button size="small" type="primary" icon="edit" @click="addOrUpdateVoltage('edit',scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-card>

      </el-col>


      <el-col :span="12" class="hp p-rf">
        <el-card shadow="hover" class="hp">
          <div class="wp hp app-containerC">
            <div class="filter-container">
              <el-form :inline="true" class="demo-form-inline demo-form-zdy">
                <el-form-item size="small">
                  <el-button type="primary" icon="plus" @click="addOrUpdate('children',null,true)">新增</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="danger" icon="delete" @click="delHander('children')">删除</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-table highlight-current-row
              :data="detailData"
              class="otherCon wp"
              stripe
              style="width: 100%;font-size:0.7rem;"
              row-key="id"
              border
              @selection-change="selectionChange"
            >
              <el-table-column align="center" type="selection" width="50"></el-table-column>
              <el-table-column prop="stepIndex" align="center" width="50" label="顺序"/>
              <el-table-column prop="stageName" align="center" width="100" label="阶段"/>
              <el-table-column prop="requirementName" align="center" label="要求"/>
              <el-table-column prop="requirementValueLimit" align="center" width="100" label="要求类型"/>
              <el-table-column prop="requirementValue" align="center" width="100" label="要求值"/>
              <el-table-column prop="requirementUnit" align="center" width="100" label="要求单位"/>
              <el-table-column header-align="center" align="center" width="80" label="操作">
                <template #default="scope">
                  <el-button size="small" type="primary" icon="edit" @click="addOrUpdate('children',scope.row,false)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增/修改工艺方案弹窗 -->
    <el-dialog draggable  :close-on-click-modal="false" :title="title" @close="resetForm()" v-model="dialogVisible">
      <div class="app-container">
        <el-form ref="planForm" label-position="right" label-width="110px" :rules="rules" :model="planForm">
          <el-form-item label="工艺方案编号:" prop="planCode" size="small">
            <el-input v-model="planForm.planCode" placeholder="工艺方案编号" style="width: 320px;" class="filter-item" size="small"/>
          </el-form-item>
          <el-form-item label="工艺方案名称:" prop="planCode" size="small">
            <el-input v-model="planForm.planName" placeholder="工艺方案编号" style="width: 320px;" class="filter-item" size="small"/>
          </el-form-item>
          <el-form-item label="干燥罐" prop="choseTank" size="small">
            <el-select v-model="planForm.choseTank" multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="item in allTank"
                :key="item.id"
                :label="item.dryingTankCode"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div  class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('parent','planForm')">确认</el-button>
      </div>
    </el-dialog>

    <!-- 新增/修改工艺方案详情弹窗 -->
    <el-dialog draggable :close-on-click-modal="false" :title="title" @close="resetDeForm()" v-model="deDialogVisible">
      <div class="app-container">
        <el-form ref="planDeForm" label-position="right" label-width="110px" :rules="rules" :model="planDeForm">
          <el-form-item label="顺序:" prop="stepIndex" size="small">
            <el-input-number v-model="planDeForm.stepIndex" placeholder="顺序" :min="1" :max="20" label="顺序"></el-input-number>
          </el-form-item>
          <el-form-item label="阶段:" prop="stageCode" size="small">
            <el-select v-model="planDeForm.stageCode" @change="getRequirement('change')" clearable placeholder="请选择">
              <el-option
                v-for="item in stageInfo"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="要求:" prop="requirementId" size="small">
            <el-select v-model="planDeForm.requirementId" @change="getRequirementProperty()" clearable placeholder="请选择">
              <el-option
                v-for="item in requirementInfo"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值:" prop="requirementValue" size="small">
            <el-input v-model="planDeForm.requirementValue" placeholder="要求值" style="width: 320px;" class="filter-item" size="small">
              <template #prepend>{{ this.planDeForm.requirementValueLimit }}</template>
              <template #append>{{ this.planDeForm.requirementUnit }}</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div  class="dialog-footer">
        <el-button size="small" @click="deDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('children','planDeForm')">确认</el-button>
      </div>
    </el-dialog>

    <!-- 新增/修改电压等级详情弹窗 -->
    <el-dialog draggable :close-on-click-modal="false" :title="title" v-model="voltageDialogVisible">
      <div class="app-container">
        <el-form ref="voltageForm" label-position="right" label-width="110px" :rules="rules" :model="voltageForm">
          <el-form-item label="电压等级:" required size="small">
            <el-col :span="8">
              <el-form-item prop="voltageLevelMin">
                <el-input v-model="voltageForm.voltageLevelMin" placeholder="最小值" style="width: 130px;" class="filter-item" size="small"/>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">

            </el-col>
            <el-col :span="12">
              <el-form-item prop="voltageLevelMax">
                <el-input v-model="voltageForm.voltageLevelMax" placeholder="最大值" style="width: 130px;" class="filter-item" size="small"/>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="small" @click="voltageDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitVoltageForm">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dryingProcess from '@/api/pm/dryingProcess'
import Dict from "@/api/sys/dict";
import dryingManage from "@/api/plan/dryingManage";

export default {
  name: 'dryingProcess',
  components: {Pagination},
  data() {
    return {
      tableData: [],
      detailData: [],
      selectData: [],
      voltageTableData: [],
      selectVoltageData: [],
      allTank:[],
      listQuery: {
        total: 0,
        planCode:null,
        pg_pagenum: 1,
        pg_pagesize: 20
      },
      dialogVisible: false,
      deDialogVisible: false,
      voltageDialogVisible: false,
      stageInfo: [],
      requirementInfo: [],
      planForm: {
        id:null,
        planCode: null,
        planName: null,
        choseTank:[]
      },
      tankList:[],
      planDeForm: {
        id:null,
        planId: null,
        stageCode: null,
        stageName: null,
        requirementId: null,
        requirementName: null,
        stepIndex: null,
        requirementType: null,
        requirementValueLimit: null,
        requirementUnit: null,
        requirementValue: null,
      },
      voltageForm: {
        voltageLevelMin: null,
        voltageLevelMax: null,
      },
      selectedRequirement: {},
      selectedStage: {},
      rules: {
        planCode: [{required: true, message: '请输入工艺方案编号', trigger: 'blur'}],
        planName: [{required: true, message: '请输入工艺方案名称', trigger: 'blur'}],
        voltageLevelMin: [{required: true, message: '请输入电压等级最小值', trigger: 'blur'}],
        voltageLevelMax: [{required: true, message: '请输入电压等级最大值', trigger: 'blur'}],
        choseTank: [{required: true, message: '请选择干燥罐', trigger: 'blur'}],
        stageCode: [{required: true, message: '请选择阶段', trigger: 'blur'}],
        requirementId: [{required: true, message: '请选择要求', trigger: 'blur'}],
        requirementValue: [{required: true, message: '请输入要求值', trigger: 'blur'}],
        stepIndex: [{required: true, message: '请输入工步顺序号', trigger: 'blur'}],
      },
      title: null,
      row: null,
    }
  },
  mounted() {
    this.getTableDate()
    this.getStageInfo()
    this.getTankInfo()
  },
  methods: {
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.getTableDate();
    },
    getTableDate() {
      dryingProcess.planList(this.listQuery).then(res => {
        res.data.forEach(item => {
          item.dryingTank = ''
          item.tankList.forEach(tank=>{
            item.dryingTank = item.dryingTank + tank.dryingTankCode + ',';
          })
          console.log(item.planCode +"  1 "+item.dryingTank)
        })
        this.listQuery.total = res.total_count
        this.tableData = res.data
      })
    },
    getListDe(val) {
      this.getDetail();
    },
    getDetail() {
      if (this.row == null) {
        this.$message.error("请选择一条工艺方案！")
        return
      }
      dryingProcess.planDeList({planId: this.row.id}).then(res => {
        this.detailData = res.data
      })
    },
    getVoltage() {
      if (this.row == null) {
        this.$message.error("请选择一条工艺方案！")
        return
      }
      dryingProcess.voltageList({planId: this.row.id}).then(res => {
        this.voltageTableData = res.data
      })
    },
    selectionChange(select) {
      this.selectData = select
    },
    selectionVoltageChange(select) {
      this.selectVoltageData = select
    },
    clickStyle({row, rowIndex}) {
      if (this.row == row) {
        return "selected-row";
      }
    },
    rowClick(row) {
      this.row = row
      this.getDetail()
      this.getVoltage()
    },
    addOrUpdate(type, row, isAdd) {
      if (!isAdd) {
        this.title = '编辑'
        if (type == 'parent') {
          let choseTanks = []
          row.tankList.forEach(item=>{
            choseTanks.push(item.tankId)
          })
          this.planForm = {
            id:row.id,
            planCode: row.planCode,
            planName: row.planName,
            estimatedTotalTime: row.estimatedTotalTime,
            choseTank: choseTanks
          }
          this.dialogVisible = true
        } else if (type == 'children') {
          this.planDeForm = {
            id:row.id,
            planId: row.planId,
            stageCode: row.stageCode,
            stageName: row.stageName,
            requirementId: row.requirementId,
            requirementName: row.requirementName,
            stepIndex: row.stepIndex,
            requirementType: row.requirementType,
            requirementValueLimit: row.requirementValueLimit,
            requirementUnit: row.requirementUnit,
            requirementValue: row.requirementValue,
          }
          this.getRequirement()
          if (this.row == null) {
            this.$message.error("请选择一条工艺方案！")
            return;
          }
          this.deDialogVisible = true
        }
      } else {
        this.title = '新增'
        if (type == 'parent') {
          this.resetForm()
          this.dialogVisible = true
        } else if (type == 'children') {
          this.resetDeForm()
          if (this.row == null) {
            this.$message.error("请选择一条工艺方案！")
            return;
          }
          this.deDialogVisible = true
        }
      }
    },
    resetForm() {
      this.planForm = {
        id:null,
        planCode: null,
        planName: null,
        estimatedTotalTime: null
      }
    },
    resetDeForm() {
      this.planDeForm = {
        id:null,
        planId: null,
        stageCode: null,
        stageName: null,
        requirementId: null,
        requirementName: null,
        stepIndex: null,
        requirementType: null,
        requirementValueLimit: null,
        requirementUnit: null,
        requirementValue: null,
      }
    },
    delHander(type) {
      let arr = []
      if (this.row == null && this.selectData.length == 0) {
        this.$message.error("请至少选择一条数据！")
        return;
      }
      if (type == 'parent') {
        arr.push(this.row)
      } else if (type == 'children') {
        arr = this.selectData
      }
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type == 'parent') {
          dryingProcess.planDelete(arr).then(res => {
            this.$message.success("删除成功！")
            this.getTableDate()
            this.getDetail()
          })
        } else if (type == 'children') {
          dryingProcess.planDeDelete(arr).then(res => {
            this.$message.success("删除成功！")
            this.getTableDate()
            this.getDetail()
          })
        }

      });
    },
    submitForm(type, formName) {
      this.$refs[formName].validate((valid) => {
        try {
          if (valid) {
            if (type == 'parent') {
              this.tankList = []
              let filteredData = this.allTank.filter(item => this.planForm.choseTank.includes(item.id));
              filteredData.forEach(item=>{
                this.tankList.push({
                  planId:this.row?this.row.id:'',
                  tankId:item.id,
                  dryingTankCode:item.dryingTankCode
                })
              })
              dryingProcess.planAddOrUpdt({process:this.planForm,tankList:this.tankList}).then(res => {
                this.$message.success("操作成功！");
                this.getTableDate()
                if (this.row != null) this.getDetail()
                this.resetForm()
                this.dialogVisible = false
                this.deDialogVisible = false
              })
            } else if (type == 'children') {
              this.planDeForm.planId = this.row.id
              dryingProcess.planDeAddOrUpdt(this.planDeForm).then(res => {
                this.$message.success("操作成功！");
                this.getTableDate()
                if (this.row != null) this.getDetail()
                this.resetForm()
                this.dialogVisible = false
                this.deDialogVisible = false
              })
            }

          } else {
            return false;
          }
        } catch (e) {
          this.$message.error(this.title + "失败"+e.message)
        }
      });
    },
    getStageInfo() {
      Dict.getDetail({itemCode: 'dryingProcessStage'}).then(res => {
        this.stageInfo = res.data
      })
    },
    getRequirement(type) {
      let selectStages = this.stageInfo.filter(item => item.code == this.planDeForm.stageCode)
      this.selectedStage = selectStages[0]
      this.planDeForm.stageName = this.selectedStage.name
      this.getRequirementInfo(type, this.planDeForm.stageCode)
    },
    getRequirementInfo(type, stageCode) {
      if (type == 'change') {
        this.planDeForm.requirementId = null
      }
      Dict.getDetail({itemCode: stageCode}).then(res => {
        this.requirementInfo = res.data
      })
    },
    getRequirementProperty() {
      let selectedRequirements = this.requirementInfo.filter(item => item.id == this.planDeForm.requirementId)
      this.selectedRequirement = selectedRequirements[0]
      this.planDeForm.requirementName = this.selectedRequirement.name
      this.planDeForm.requirementType = this.selectedRequirement.code
      this.planDeForm.requirementValueLimit = this.selectedRequirement.remark
      this.planDeForm.requirementUnit = this.selectedRequirement.remark2
    },
    addOrUpdateVoltage(type, row) {
      if (type == 'add') {
        this.voltageForm = {
          id:null,
          voltageLevelMin: null,
          voltageLevelMax: null,
        }
      } else if (type == 'edit') {
        this.voltageForm = {
          id:row.id,
          voltageLevelMin: row.voltageLevelMin,
          voltageLevelMax: row.voltageLevelMax,
        }
      }
      this.voltageDialogVisible = true
    },
    submitVoltageForm() {
      this.$refs["voltageForm"].validate((valid) => {
        try {
          if (valid) {
            this.voltageForm.planId = this.row.id
            dryingProcess.voltageAddOrUpdt(this.voltageForm).then(res => {
              this.$message.success("操作成功！");
              this.getTableDate()
              if (this.row != null) this.getVoltage()
              this.voltageDialogVisible = false
            })
          } else {
            return false;
          }
        } catch (e) {
          this.$message.error(this.title + "失败")
        }
      });
    },
    delVoltageHandle() {
      let arr = this.selectVoltageData
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dryingProcess.voltageDelete(arr).then(res => {
          this.$message.success("删除成功！")
          this.getTableDate()
          this.getVoltage()
        })
      });
    },
    getTankInfo(){
      let param = {pageSize:1000, pageNum: 1,dryingTankCode:''}
      dryingManage.findAllDryingTank(param).then(res=>{
        this.allTank = res.data
      })
    }
  }
}
</script>
<style scoped>
.border {
  border: 1px solid #ebebeb;
  border-radius: 8px;
  -webkit-box-shadow: 0 0 15px 0 rgba(232, 237, 250, .6), 0 7px 11px 0 rgba(232, 237, 250, .5);
  box-shadow: 0 0 15px 0 rgba(232, 237, 250, .6), 0 7px 11px 0 rgba(232, 237, 250, .5);
  height: 600px;
}

.p-10 {
  padding: 0 10px 10px 10px
}

.placeholderDiv {
  font-size: 12px;
  color: red;
}

/deep/ .selected-row {
  background: rgb(223, 232, 246);
  /*     background: rgb(36,154,219); */
}

.height-60 {
  height: 60%;
}

.height-40 {
  height: 40%;
}

</style>
