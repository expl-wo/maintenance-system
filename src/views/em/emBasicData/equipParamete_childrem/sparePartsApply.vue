<template>
  <div class="app-container">
    <el-form label-position="right" label-width="70px" :inline="true" class="demo-form-inline demo-form-zdy">
      <el-form-item  size="small">
        设备编号:{{eqpId}}
      </el-form-item>
      <el-form-item  size="small">
        设备名称:{{eqpName}}
      </el-form-item>
      <el-form-item  size="small">
        使用部门:{{usingDep}}
      </el-form-item>
      <el-form-item  size="small">
        <el-button type="primary" icon="Close" @click="clearEqp()">清除设备</el-button>
      </el-form-item>
      <el-form-item  size="small">
        <el-button type="primary" icon="Plus" @click="selectEquip()">选择使用设备</el-button>
      </el-form-item>
      <el-form-item  size="small">
        <el-button type="primary" icon="Plus" @click="addColumn()">添加请购项</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe  highlight-current-row  :data="tableData" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"
      border>

      <el-table-column label="配件名称" :width="150">
        <template  #default="scope">
          <el-input v-model="scope.row.spName" :disabled="scope.row.id != null"  size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="配件编码" :width="150">
        <template  #default="scope">
          <el-input v-model="scope.row.materialCode" :disabled="scope.row.id != null"  size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="配件型号" :width="150">
        <template  #default="scope">
          <el-input v-model="scope.row.spModel" :disabled="scope.row.id != null"  size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="配件类型" :width="200" >
        <template  #default="scope">
          <el-radio-group v-model="scope.row.spType"   size="small">
            <el-radio :label="0">机械配件</el-radio>
            <el-radio :label="1">电气配件</el-radio>
          </el-radio-group>

        </template>
      </el-table-column>
      <el-table-column label="单位" :width="90">
        <template  #default="scope">
          <el-input v-model="scope.row.unit" :disabled="scope.row.id != null"  size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" :width="120">
        <template  #default="scope">
          <el-input-number v-model="scope.row.quantity" :controls="false" :min="1"  size="small" style="width: 80px;">
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="单价" :width="120">
        <template  #default="scope">
          <el-input-number v-model="scope.row.price" :controls="false" :min="1"  size="small" style="width: 80px;">
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="指定厂家">
        <template  #default="scope">
          <el-input v-model="scope.row.factory"  size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="期望到货时间" :width="200">
        <template  #default="scope">
          <el-date-picker v-model="scope.row.expectedArrivalTime" style=" width: 130px;"  size="small" align="right" type="date"
            placeholder="选择日期" :picker-options="pickerOptions" value-format="YYYY-MM-DD">
          </el-date-picker>
        </template>
      </el-table-column>

      <el-table-column :width="50" label="操作" fixed="right">
        <template  #default="scope">
          <el-button type="danger"  size="small" icon="Delete" @click.prevent="deleteRow(scope.$index, tableData)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--选择设备-->
    <el-dialog draggable:close-on-click-modal="false" title="选择设备"  v-model="dialogEquipFormVisible"
      :append-to-body="true" class="roleDialog800">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQueryEqp" class="demo-form-inline demo-form-zdy">
          <el-form-item label="设备编号"  size="small">
            <el-input v-model="listQueryEqp.eqpId" placeholder="设备编号" style="width: 180px;" class="filter-item"
              clearable />
          </el-form-item>
          <el-form-item label="设备名称"  size="small">
            <el-input v-model="listQueryEqp.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item"
              clearable />
          </el-form-item>
          <el-form-item  size="small">
            <el-button type="primary" icon="Search" @click="onEquipQuery()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tree ref="dataTreeNo" class="otherCon wp" :data="tableEquipData" :props="props" default-expand-all
        highlight-current :expand-on-click-node="false" @node-click="handleNodeClick" />
      <div   class="dialog-footer">
        <el-button @click="dialogEquipFormVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    applySpareParts,
    getSparePartsApplyRecord
  } from '@/api/em/sparePart'
  import { queryTreeEqp} from '@/api/em/inspectionPlan.js'
  export default {
    data() {
      return {
        tableData: [],
        dialogEquipFormVisible: false,
        listQueryEqp: {
          eqpId: '',
          eqpName: ''
        },
        tableEquipData: [],
        props: {
          value: 'id',
          label: 'name',
          children: 'sub'
        },
        pickerOptions: {
          disabledDate(time) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return time.getTime() < date;
          }
        },
        eqpId: '',
        eqpName: '',
        usingDep: '',
      }
    },
    methods: {
      submit() {
        var canSubmit = true
        //参数校验
        console.log(this.tableData);
        this.tableData.forEach(item => {
          if (!item.materialCode || !item.spName ||
            !item.spModel || !item.unit ||
            !item.quantity) {
            this.$message.error("请输入必填项");
            canSubmit = false
            return 0;
          }
          if (item.quantity <= 0) {
            this.$message.error("请输入的值不在合理的范围");
            canSubmit = false
            return 0;
          }
        })
        if (canSubmit) {
          applySpareParts({
            data: this.tableData,
            eqpId: this.eqpId
          }).then(res => {
            if (res.err_code == 10000) {
              this.$message.success("提交采购成功！");
              this.$emit('closeApply')
            } else {
              this.$message.error(res.err_msg);
            }
          })
        }
      },
      selectEquip() {
        this.onEquipQuery()
        this.dialogEquipFormVisible = true
      },
      // 查询设备
      onEquipQuery() {
        this.tableEquipData = []
        queryTreeEqp(this.listQueryEqp).then(res => {
          this.tableEquipData = res.data
        })
      },
      addColumn() {
        let item = {spType:0}
        this.tableData.push(item);
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleNodeClick(data) {
        if (data.sub == null) {
          this.$confirm('确定选择设备' + data.name + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let item = this.tableEquipData.find(e => e.id == data.fid)
            this.eqpId = data.id
            this.eqpName = data.name
            this.usingDep = item.name
            this.dialogEquipFormVisible = false
          })
        }
      },
      clearEqp() {
        this.eqpId = null
        this.eqpName = null
        this.usingDep = null
      },
      init(params, list) {
        this.eqpId = params.eqpId
        this.eqpName = params.eqpName
        this.usingDep = params.usingDep
        this.tableData = list
      },
      init2() {
        this.eqpId = null
        this.eqpName = null
        this.usingDep = null
        this.tableData = []
      }
    },

  }
</script>

<style scoped>
</style>
