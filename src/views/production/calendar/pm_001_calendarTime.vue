<template>
  <div class="app-container">

    <el-row :gutter="12" class="hp">
      <el-col :span="11" class="hp">
        <el-card shadow="hover" class="hp">
          <div   class="clearfix">
            <span>日工作模板名称定义</span>
            <el-button style="float: right;" size="small" type="primary" icon="Plus" @click="onAdd"></el-button>
          </div>
          <table-simple
            :data="tableData"
            :row-header="rowHeader"
            stripe="true"
            :total="total"
            @handleClick="handleDblclick"
            :hidePage="true"
          />

        </el-card>
      </el-col>
      <el-col :span="13" class="hp">
        <el-card shadow="hover" class="hp">
          <div   class="clearfix">
            <span>模板时间设定</span>
            <el-button style="float: right;" size="small" type="primary" icon="Plus" @click="onNapeAdd"></el-button>
          </div>
          <table-simple
            :data="tableTimeData"
            :row-header="rowTimeHeader"
            :total="total"
            :hidePage="true"
          />
        </el-card>
      </el-col>
    </el-row>

    <!--日工作模板新增或修改角色定义-->
    <el-dialog draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="90px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="模板名称:" prop="tempName" size="small">
          <el-input v-model="listUpdate.tempName" placeholder="模板名称" style="width: 360px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="模板描述:" size="small">
          <el-input v-model="listUpdate.tempDesc" placeholder="模板描述" style="width: 360px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveData('listUpdate')" size="small">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

    <!--日工作模板时间新增或修改角色定义-->
    <el-dialog draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogTimeFormVisible" class="roleDialog">
      <el-form ref="listTimeUpdate" label-position="right" label-width="90px" :rules="submitTimeRules" :model="listTimeUpdate">
        <el-form-item label="开始时间:" prop="startDate" size="small">
          <el-time-select v-model="listTimeUpdate.startDate" :picker-options="pickerOptions" placeholder="开始时间" style="width: 360px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="结束时间:" prop="endDate" size="small">
          <el-time-select v-model="listTimeUpdate.endDate" :picker-options="pickerOptions" placeholder="结束时间" style="width: 360px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogTimeFormVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveTimeData('listTimeUpdate')" size="small">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import TableSimple from '@/components/Table/index'
/**
 * 1.日工作模板查询
 * 2.日工作模板新增编辑
 * 3.日工作模板删除
 * 4.日工作模板时间查询
 * 5.日工作模板时间新增编辑
 * 6.日工作模板时间逻辑删除
 */
import { getDailyWorkTempList, getDailyWorkTempUpdate, deleteDailyWorkTemp, getTempTimeList, getTempTimeUpdate, deleteTempTime } from '@/api/factoryCalendar'
import { $confirm } from '@/utils/common.js'

export default {
  name: 'Table',
  components: { TableSimple },
  data() {
    return {
      tableData: [], // 表格2（日工作模板名称定义）
      rowHeader: [], // 表格2（表头）
      total: 0, // 表格2（总条数）
      dialogStatus: '', // 日工作模板列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      listUpdate:{
        tempName: '', // 模板名称
        tempDesc: '' // 模板描述
      },
      submitRules: {
        tempName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      handleDblclickItem: '', // 点击日工作模板
      dialogFormVisible: false, // 日工作模板
      tableTimeData: [], // 表格3（异常升级提醒）
      rowTimeHeader: [], // 表格3（表头）
      listTimeUpdate:{
        startDate: '', // 开始时间
        endDate: '' // 结束时间
      },
      pickerOptions: { start: '00:00', step: '00:15', end: '23:59'},
      submitTimeRules: {
        startDate: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        endDate: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      dialogTimeFormVisible: false, // 日工作模板时间弹窗
      rowTimeUpdata: '' // 修改日工作模板时间查询数据
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      const self = this
      self.rowHeader = [
        // 未做任何格式化处理的数据
        { prop: 'index', width: 50, align: 'center', label: '序号'},
        { prop: 'tempName', align: 'center', label: '模板名称' },
        { prop: 'tempDesc', align: 'center', label: '模板描述' },
        { prop: 'reapt', width: 100, align: 'center', label: '操作',
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', { type: 'primary', size: 'small', icon:"Edit",
                on: {
                  click: function() {
                    self.listUpdate = {
                      id: params.row.id,
                      tempName: params.row.tempName, // 模板名称
                      tempDesc: params.row.tempDesc // 模板描述
                    }
                    self.dialogStatus = 'update'
                    self.dialogFormVisible = true
                  }
                }
              }, ''), // 修改
              h('el-button', { type: 'danger', size: 'small', icon: "Delete",
                on: {
                  click: function() {
                    $confirm('此操作将永久删除该条信息, 是否继续?','取消').then(response =>{
                      deleteDailyWorkTemp({tempId: params.row.id }).then(res =>{
                        self.$message({ message: '操作成功', type: 'success' })
                        self.onQuery() // 查询日工作模板查询
                      })
                    })
                  }
                }
              }, '') // 删除
            ])
          }
        }
      ]
      self.onTimeload()
      self.onQuery() // 查询日工作模板查询
    },
    onTimeload() {
      const self = this
      self.rowTimeHeader = [
        // 未做任何格式化处理的数据
        { prop: 'index', width: 50, align: 'center', label: '序号' },
        { prop: 'startTime', align: 'center', label: '开始时间'},
        { prop: 'endTime', align: 'center', label: '结束时间'},
        { prop: 'reapt', width: 100, align: 'center', label: '操作',
          render: (h, params) => {
            return h('el-button-group', [
              h('el-button', { type: 'primary', size: 'small', icon:"Edit",
                on: {
                  click: function() {
                    self.rowTimeUpdata = params.row
                    self.listTimeUpdate = {
                      startDate: params.row.startTime, // 开始时间
                      endDate: params.row.endTime // 结束时间
                    }
                    self.dialogStatus = 'update'
                    self.dialogTimeFormVisible = true
                  }
                }
              }, ''), // 修改
              h('el-button', { type: 'danger', size: 'small', icon: "Delete",
                on: {
                  click: function() {
                    $confirm('此操作将永久删除该条信息, 是否继续?','取消').then(response =>{
                      deleteTempTime({ids: [params.row.id] }).then(res =>{
                        self.$message({ message: '操作成功', type: 'success' })
                        self.onTimeQuery() // 查询日工作模板查询
                      })
                    })
                  }
                }
              }, '') // 删除
            ])
          }
        }
      ]
    },
    // 查询日工作模板查询
    onQuery() {
      this.tableData = []
      this.tableTimeData = []
      this.handleDblclickItem = ''
      getDailyWorkTempList().then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    // 查询日工作模板查询
    onTimeQuery() {
      this.tableTimeData = []
      getTempTimeList({tempId: this.handleDblclickItem.id}).then(response => {
        this.tableTimeData = response.data
      })
    },
    // 日工作模板保存
    saveData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          getDailyWorkTempUpdate(this.listUpdate).then(response => {
            this.$message({ message: this.dialogStatus == 'create' ? '添加成功' : '修改成功', type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 日工作模板时间保存
    saveTimeData(listTimeUpdate) {
      this.$refs[listTimeUpdate].validate((valid) => {
        if (valid) {
          this.dialogTimeFormVisible = false
          const req = {
            tempId: this.handleDblclickItem.id, // 模板主键id
            times: [{ "k": this.listTimeUpdate.startDate, "v": this.listTimeUpdate.endDate}] // 设定的时间数组
          }
          if(this.dialogStatus == 'update') {
            req.id = this.rowTimeUpdata.id // 主键id,修改编辑时必填且times里只能有一个对象(一个主键对应一条数据)
          }
          getTempTimeUpdate(req).then(response => {
            this.$message({ message: this.dialogStatus == 'create' ? '添加成功' : '修改成功', type: 'success' })
            this.onTimeQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 添加 日工作模板
    onAdd() {
      this.listUpdate = {
        tempName: '', // 模板名称
        tempDesc: '' // 模板描述
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 日工作模板
    handleDblclick(val) {
      this.handleDblclickItem = val.item //  点击的日工作模板
      this.onTimeQuery()
    },
    // 添加 模板时间
    onNapeAdd() {
      if(this.handleDblclickItem) {
        this.listTimeUpdate = {
          startDate: '', // 开始时间
          endDate: '' // 结束时间
        }
        this.dialogStatus = 'create'
        this.dialogTimeFormVisible = true
      }else{
        this.$message({ message: '请选择日工作模板', type: 'warning' })
      }

    }
  }
}
</script>

<style scoped>

</style>

