<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="设计型号">
          <el-input v-model="listQuery.model" placeholder="设计型号" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="产品期量">
          <el-input v-model="listQuery.limitName" placeholder="产品期量" style="width: 180px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="queryUnBound">查询未匹配型号</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Edit" @click="unBound">解绑期量</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe
        id="psMainPlan"
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        border
        highlight-current-row
        v-loading="loadingData"
        @selection-change="selectChange"
        :cell-class-name="cellClassName"
        @cell-click="cellClick"
        height="100%"
        >
        <el-table-column align="center" type="selection" :selectable="checkBoxT" width="60"></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column
          prop="model"
          label="设计型号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="limitName"
          label="产品期量"
          align="center">
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pg_pagenum"
        :page-sizes="[10, 20, 30, 50, 200, 1000]"
        :page-size="listQuery.pg_pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <el-dialog draggable  :close-on-click-modal="false" title="期量绑定" v-model="dialogVisible" class="roleDialog">
        <el-form label-position="right" label-width="160px" :model="limitModel" :rules="rules" ref="limitModel">
          <el-form-item label="设计型号:" prop="model">
            <el-input v-model="limitModel.model" placeholder="设计型号" style="width: 180px;" class="filter-item" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="节点类型:" prop="timeLimitId">
            <el-select v-model="limitModel.timeLimitId" clearable placeholder="请选择期量">
                <el-option
                  v-for="item in limitOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
          <el-button @click="resetForm('limitModel')">取 消</el-button>
          <el-button type="primary" @click="submitForm('limitModel')">
            保存
          </el-button>
        </div>
        </template>
      </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { queryModelList, queryMainList, insertLimitModel, unBound } from '@/api/timeLimit';
export default {
  name: 'timeLimitModel',
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        model: null, // 模糊匹配，工艺类型
        limitName: null // 期量表名称
      },
      tableData: [],
      loadingData: true,
      selectList: [],
      dialogVisible: false,
      limitModel: {
        id: null,
        model: null,
        timeLimitId: null,
        isUnBound: false,
      },
      limitOptions: null,
      rules: {
        model: [{required: true, message: '请输入型号', trigger: 'blur'}],
        timeLimitId: [{required: true, message: '请选择期量', trigger: 'change'}],
      },
    }
  },
  mounted() {
    this.queryTableData();
    this.queryLimit();
  },
  computed:{
  },
  watch:{
  },
  methods: {
    queryTableData() {
      queryModelList(this.listQuery).then(res=>{
        this.tableData = res.data;
        this.total = res.total_count;
        this.loadingData = false;
      })
    },
    onQuery(){
      this.listQuery.isUnBound = false;
      this.queryTableData();
    },
    queryLimit(){
      queryMainList({pg_pagesize: 1000}).then(response => {
        this.limitOptions = response.data
      })
    },
    selectChange(selection) {
      this.selectList = selection;
    },
    handleCurrentChange(newPage) {
      this.listQuery.pg_pagenum = newPage;
      this.queryTableData();
    },
    handleSizeChange(newSize) {
      this.listQuery.pg_pagesize = newSize;
      this.queryTableData();
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if(row.limitName === null && column.property == "limitName")
        return 'binding'
    },
    cellClick(row, column, cell, event) {
      if(row.limitName === null && column.property == "limitName") {
        this.dialogVisible = true;
        console.log(this.dialogVisible)
        this.limitModel.id = row.id;
        this.limitModel.model = row.model;
        this.limitModel.timeLimitId = row.timeLimitId;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          insertLimitModel(this.limitModel).then(res=>{
            if(res.err_code === 10000) {
              this.$message.success("绑定成功");
              this.dialogVisible = false;
            }
            else this.$message.error("绑定失败，"+res.err_msg);
            this.queryTableData();
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields();
    },
    unBound(){
      this.$confirm('此操作将解绑选中工艺类型的期量, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.selectList.length === 0) {
          this.$message.error("请选择数据！");
        } else {
          const req = JSON.parse(JSON.stringify([...this.selectList]))
          unBound(req).then(res=>{
            if(res.err_code===10000){
              this.$message.success("解绑成功！");
              this.queryTableData();
            } else this.$message.error("解绑失败，"+res.err_msg);
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    checkBoxT(row, rowIndex) {
      if(row.limitName) return true;
      else return false;
    },
    queryUnBound(){
      this.listQuery.isUnBound = 1;
      this.queryTableData();
    }
  },
}
</script>

<style lang="scss">
.line{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}
#psMainPlan{
  .binding{
    background-color: #f4984e;
  }
}

</style>
