<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="请选择数据源:" prop="dbName">
          <el-select size="small" class="filter-item" v-model="listQuery.dbName" @change="handleFilter"
                     style="margin-right:10px">
            <el-option v-for="item in  dbsOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名:" prop="tableName">
          <el-input size="small" @keyup.enter="handleFilter" style="width: 200px;margin-right:10px" class="filter-item"
                    v-model="listQuery.tableName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
          <el-button size="small" class="filter-item" type="primary" @click="handlerGenerator">生成代码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" ref="tableRef" size="small" stripe highlight-current-row border
              style="width: 100%" @selection-change="handlerSelect">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="表名">
        <template #default="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="表备注">
        <template #default="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog :title="dialogProjectName" v-model="dialogProjectFormVisible">
      <el-form :model="buildProjectForm" :rules="buildProjectFormRules" ref="buildProjectForm" label-width="100px">
        <el-form-item label="package" prop="package">
          <el-input v-model="buildProjectForm.package" placeholder="请输入代码包路径"></el-input>
        </el-form-item>
        <el-form-item label="移除表前缀" prop="tablePrefix">
          <el-input v-model="buildProjectForm.tablePrefix" placeholder="请输入移除表前缀"></el-input>
        </el-form-item>
        <el-form-item label="前端模块名">
          <el-input v-model="buildProjectForm.mainModule" placeholder="请输入前端模块名"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="buildProjectForm.author" placeholder="请输入作者"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel('buildProjectForm')">取 消</el-button>
          <el-button type="primary" @click="buildProject('buildProjectForm')">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {dbs, page} from '@/tool/api/generator'
import {getToken} from "@/utils/auth";

export default {
  name: 'toolGenerator',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        dbName: undefined
      },
      buildProjectForm: {
        package: 'com.hb.digital.ltc',
        tablePrefix: '',
        author: 'fp',
        mainModule: ''
      },
      buildProjectFormRules: {
        package: [{
          required: true,
          message: '请输入合法的包路径',
          trigger: 'blur'
        },
          {
            min: 3,
            message: '长度在 3个字符以上',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableKey: 0,
      tables: [],
      dialogProjectName: '代码生成',
      dialogProjectFormVisible: false,
      dbsOptions: []
    }
  },
  created() {
    this.getDbs()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        const data = response.data;
        this.list = data.rows
        this.total = parseInt(data.total)
        this.listLoading = false
      }).finally(()=>{
        this.listLoading = false;
      })
    },
    getDbs() {
      dbs().then(response => {
        this.dbsOptions = response.data.rows
        this.listQuery.dbName = response.data.rows[0]
      })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handlerGenerator() {
      this.dialogProjectFormVisible = true
    },
    handlerSelect(val) {
      this.tables = val.map(item=>{
        return  item.tableName;
      })
    },
    cancel(formName) {
      this.dialogProjectFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    buildProject(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          const elink = document.createElement('a')
          elink.style.display = 'none'
          elink.target = '_blank'
          elink.href = '/api/generator/code/generator/build?tables=' + this.tables.concat() + '&author=' + this.buildProjectForm.author +
              '&path=' + this.buildProjectForm.package + '&mainModule=' + this.buildProjectForm.mainModule + '&dbName='
              + this.listQuery.dbName + '&tablePrefix=' + this.buildProjectForm.tablePrefix + '&token=' + getToken()
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      })
    }
  }
}
</script>
