<template>
  <div class="app-container">
    <el-row :gutter="12" class="hp">
      <el-col :span="6" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>班组</span>
          </div>
          <el-tree
            ref="Treetransfer"
            highlight-current
            :data="dataTree"
            node-key="id"
            :props="props"
            :default-expanded-keys="[2, 3]"

            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :span="18" class="hp p-rf">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>员工信息</span>
          </div>
          <div class="wp hp app-containerC">
            <div class="filter-container">
              <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
                <el-form-item label="班组：">
                  <el-input v-model="wkcName" placeholder="点击左侧班组列表选择" style="width: 180px;" class="filter-item" clearable @input="setWkcNull" @clear="setWkcNull" />
                </el-form-item>
                <el-form-item label="员工姓名/编号">
                  <el-input v-model="listQuery.userName" placeholder="员工姓名/编号" style="width: 180px;" class="filter-item" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
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
              height="700"
              @changeUploadFile="changeUploadFile"
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
                prop="wkName"
                align="center"
                label="班组名称"
                min-width="15%"
              />
              <el-table-column
                prop="lsbmName"
                align="center"
                label="归属部门名称"
                min-width="15%"
              />
              <el-table-column
                prop="upload"
                align="center"
                label="上传"
                min-width="5%"
              >
                <template v-slot="scope">
                <el-button type="primary" icon="UploadFilled">
                  <input name="file" type="file" class="fileCls" :accept="acceptFormat" style="display: none;" @change="changeUploadFile($event, scope.row)"/>
                </el-button>
                </template>
              </el-table-column>
              <el-table-column
                min-width="6%"
                align="center"
                label="人员图片"
              >
                <template v-slot="scope">
                  <el-button

                    plain
                    type="primary"
                    @click = "lookPicture(scope.row)"
                  >查看
                  </el-button>
                </template>
              </el-table-column>
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

          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--查看文件或图片-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" title="查看" v-model="dialogFileFormVisible" class="roleDialog">

      <el-table
        class="otherCon wp"
        :data="tableFileData"
        :border="true"
        header-cell-class-name="bgblue"
        style="width: 100%"
        stripe
        row-key="id"
        height="700"
        @changeUploadFile="changeUploadFile"
      >
        <el-table-column
          prop="picPath"
          label="图片"
          align="center"
          min-width="15%"
        >
          <template v-slot:default="scope">
            <el-image :src="scope.row.picPath" :preview-src-list="[scope.row.picPath]"></el-image>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogFileFormVisible = false">关闭</el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 组织机构树查询、组织机构列表查询
import { getWkClazzAlltree, getWkcUser, getUsrPic, upLoadUserPic } from '@/api/org'
import { $confirm, $rooturl } from '@/utils/common'
import { getSingleUpload } from '@/api/endpoint'

export default {
  data() {
    return {
      heightTable: '300px',
      props: { // 组织结构树默认格式
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub' // 子级字段名
      },
      dataTree: [], // 组织结构树数据
      rowHeader: [], // 用户列表
      tableData: [], // 表格数据
      total: 0,
      wkcName: '',
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        userName: '', // 用户名称
        wkcId: '' // 班组ID
      },
      tableFileData: [],
      roweFileHeader: [],
      totalFile: 0,
      currentRow: {}, // 临时保存当前行ID
      dialogFileFormVisible: false,
      rooturl: '',
      // 上传格式
      acceptFormat: {
        type: String,
        default: ''
      },
    }
  },
  mounted() {
    $rooturl().then(response => {
      this.rooturl = response.data
    })
    this.onload()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    onload() {
      this.onWkClazzAlltree() // 查询组织机构树
      this.onQuery() // 查询
    },
    // 查询组织机构树
    onWkClazzAlltree() {
      this.dataTree = []
      getWkClazzAlltree().then(response => {
        this.dataTree = response.data
      })
    },
    // 组织机构树点击事件
    handleNodeClick(obj, node, data) {
      this.listQuery.pg_pagenum = 1
      this.listQuery.wkcId = obj.id // 班组主键
      this.wkcName = obj.name // 班组名称
      this.onQuery() // 查询
    },
    setWkcNull() {
      this.listQuery.wkcId = '' // 角色拥有者的归属部门主键
      this.wkcName = '' // 角色拥有者的归属部门名称
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getWkcUser(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
    },
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val
      this.onQuery() // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val
      this.onQuery() // 查询
    },
    onPictureQuery(row) {
      this.currentRow = row
      this.tableFileData = []
      getUsrPic({ userId: row.userid }).then(response => {
        let rData = response.data
        rData = this.rooturl + rData
        const pic = { picPath: rData }
        this.tableFileData.push(pic)
        this.totalFile = this.tableFileData.length
        console.log(this.tableFileData)
      })
    },
    // 上传文档
    changeUploadFile(e,row) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      param.append('appid', 'mesupload') // 添加form表单中其他数据
      // 上传图片
      getSingleUpload(param).then(response => {
        const path = response.path
        const index = path.lastIndexOf('.')
        const pathNew = path.substring(index + 1, path.length).toLowerCase()
        const picname = 'jpeg|jpg|png|bmp|gif|'
        if (picname.indexOf(pathNew) > -1) {
          upLoadUserPic({ userId: row.userid, picPath: response.path }).then(responseUp => {
            this.$message({ message: '更新成功', type: 'success' })
            this.onQuery()
          })
        } else {
          this.$message({ message: '图片格式错误', type: 'warnning' })
        }
      })
    },
    lookPicture(row){
      this.onPictureQuery(row)
      this.dialogFileFormVisible = true
    }
  }
}
</script>

