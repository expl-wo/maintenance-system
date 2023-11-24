<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="用户姓名">
          <el-input v-model="listQuery.uName" placeholder="用户姓名" style="width: 120px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="用户姓名拼音">
          <el-input v-model="listQuery.uPy" placeholder="用户姓名拼音" style="width: 120px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input v-model="listQuery.userId" placeholder="员工编号" style="width: 120px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="归属部门名称">
          <el-select v-model="listQuery.gsbmId" placeholder="请选择归属部门"  style="width:200px" @clear="setGsbmNull" clearable ref="selectGsbm">
            <el-option :value="listQuery.gsbmId" :label="listQuery.gsbmName"
             style="width:200px;height:200px;overflow: auto;background-color:#fff">
              <el-tree
                :data="dataTree"
                :props="gsbmProps"
                @node-click="gsbmNodeClick"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="dialogFormVisible2 = true">更新单用户</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      class="otherCon wp"
      :data="tableData"
      :border="true"
      header-cell-class-name="bgblue"
      style="width: 100%"
      stripe
      row-key="id"
    >
      <el-table-column
        prop="index"
        label="序号"
        align="center"
        min-width="5%"
      >
        <template v-slot:default="scope">
          <span>{{(scope.$index + 1)}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userId"
        label="用户员工编号"
        align="center"
        min-width="15%"
      />
      <el-table-column
        prop="uName"
        align="center"
        label="用户姓名"
        min-width="15%"
      />
      <el-table-column
        prop="uGrade"
        align="center"
        label="用户类型"
        min-width="15%"
      >
        <template v-slot:default="scope">
          <el-tag v-if="scope.row.uGrade ==0 ">内部员工</el-tag>
          <el-tag v-else-if="scope.row.uGrade ==1 ">外部客户</el-tag>
          <el-tag v-else-if="scope.row.uGrade ==3 ">系统管理员</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="lgnStatus"
        align="center"
        label="是否可用"
        min-width="15%"
      >
        <template v-slot:default="scope">
          <el-tag v-if="scope.row.lgnStatus ==1 ">是</el-tag>
          <el-tag v-else-if="scope.row.lgnStatus !==1 ">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="gsbmName"
        align="center"
        label="归属部门名称"
        min-width="15%"
      />
    </el-table>
    <el-pagination
      :current-page="listQuery.pg_pagenum"
      :page-sizes="[100, 200, 500]"
      :page-size="listQuery.pg_pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-dialogDrag  :close-on-click-modal="false" title="更新单用户" v-model="dialogFormVisible2" class="roleDialog">
      <el-form ref="userUpdate" label-position="right" label-width="100px" :model="userUpdate">
        <el-form-item label="员工编号" prop="itemRequest">
          <el-input v-model="userUpdate.userid" placeholder="综合平台员工编号[userid]" style="width: 360px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="saveData('userUpdate')">确定</el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 分页获取用户列表
import { getUserAll, updateUser, setNonLocal } from '@/api/user'
import { getOrgAlltree } from '@/api/org'

export default {
  name: 'Table',
  data() {
    return {
      gsbmProps: { // 组织结构树默认格式
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub' // 子级字段名
      },
      dataTree: [], // 组织结构树数据
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      dialogFormVisible2:false, // 用户更新
      userUpdate:{
        userid:'',  //综合平台的userid
      },
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        uName: '', // 模糊匹配，用户姓名
        uPy: '', // 模糊匹配，员工编号
        gsbmId: '',
        gsbmName: '' // 模糊匹配，归属部门名称
      },
      tableData: [], // 表格数据
      rowHeader: []
    }
  },
  mounted() {
    this.onload()
  },
  methods: {
    onload() {
      this.onQueryOrgAlltree() // 查询组织机构树
      this.onQuery() // 查询
    },
    setGsbmNull(){
      this.listQuery.gsbmId = '' // 角色拥有者的归属部门主键
      this.listQuery.gsbmName = '' // 角色拥有者的归属部门名称
    },
    // 组织机构树点击事件
    gsbmNodeClick(data, node) {
      this.listQuery.gsbmId = data.id // 角色拥有者的归属部门主键
      this.listQuery.gsbmName = data.name // 角色拥有者的归属部门名称
      this.$refs.selectGsbm.blur()
    },
    // 查询组织机构树
    onQueryOrgAlltree() {
      this.dataTree = []
      getOrgAlltree().then(response => {
        this.dataTree = response.data
      })
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getUserAll(this.listQuery).then(response => {
        this.tableData = response.data
        console.log("用户信息,",this.tableData)
        this.total = response.total_count
      })
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val
      this.onQuery() // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val
      this.onQuery() // 查询
    },
    saveData(userUpdate) {
      this.$refs[userUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.userUpdate }
          console.log(req);
          if(!req.userid){
            this.$message({message:'用户员工编号不能为空！',type:'warning'})
            return false;
          }
          updateUser(req).then(res=>{
            this.dialogFormVisible2=false
            this.$message({ message: '更新单用户成功!', type: 'success' })
          })
        }
      })
    },
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-form-item{
  margin-bottom: 10px;
}
</style>

