<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Plus" @click="onAdd('')">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe highlight-current-row
              :data="tableData"
              row-key="id"
              border
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" width="400" label="菜单名称"/>
      <el-table-column prop="code" width="200" label="权限编号" align="center"/>
      <el-table-column prop="type" label="类型" align="center">
        <template v-slot:default="scope">
          <span v-if="scope.row.type === 1">菜单</span>
          <span v-if="scope.row.type === 2">按钮</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="后端功能路径" align="center"/>
      <el-table-column prop="showOrder" label="显示顺序号" align="center"/>
      <el-table-column label="是否可用" prop="enabled" width="90" align="center">
        <template #default="{row}">
          <div v-if="row.enabled == '0'" class="xui-content__fail">
            <xui-dictionary item-code="flag01" :code="row.enabled"></xui-dictionary>
          </div>
          <div v-else  class="xui-content__success">
            <xui-dictionary  item-code="flag01" :code="row.enabled"></xui-dictionary>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="method" label="请求方式" align="center" />
      <el-table-column prop="type" label="物料名称" align="center">
        <template  #default="scope">
          <span v-if="scope.row.enabled == 1">可用</span>
          <span v-if="scope.row.enabled == 0">不可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="后端功能路径" align="center" />
      <el-table-column prop="viewPath" label="前端视图组件路径" align="center" ></el-table-column>
      <el-table-column prop="iconName" label="图标" align="center" ></el-table-column> -->
      <el-table-column header-align="center" align="center" width="140" label="操作">
        <template v-slot:default="scope">
          <el-button-group>
            <el-button title="添加" v-if="scope.row.type !== 2" type="primary" icon="Plus" @click="onAdd(scope.row.id)">
              <i icon="Plus"></i>
            </el-button>
            <el-button title="编辑" type="primary" icon="Edit" @click="onUpdate(scope.row)">
              <i icon="Edit"></i>
            </el-button>
            <!-- <el-button title="删除" type="danger" icon="Delete" @click="handleDeleteDict(scope.row)" /> -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!--弹窗新增或修改角色定义-->
    <el-dialog draggable :close-on-click-modal="false" width="600px" :title="textMap[dialogStatus]" v-model="dialogFormVisible"
               class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="160px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="权限名称:" prop="name">
          <el-input v-model="listUpdate.name" placeholder="权限名称" style="width: 360px;" class="filter-item"/>
        </el-form-item>
        <el-form-item label="权限编号:" prop="code">
          <el-input v-model="listUpdate.code" placeholder="权限编号" style="width: 360px;" class="filter-item"/>
        </el-form-item>
        <el-form-item label="权限类型:" prop="type">
          <el-select v-model="listUpdate.type" placeholder="请选择权限类型" style="width: 360px;" :disabled="listUpdate.id">
            <el-option label="菜单" value="1"/>
            <el-option label="按钮" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="权限服务端功能路径:" prop="url">
          <el-input v-model="listUpdate.url" placeholder="权限服务端功能路径" style="width: 360px;" class="filter-item"/>
        </el-form-item>
        <el-form-item label="权限对应的视图组件路径:">
          <el-input v-model="listUpdate.viewPath" placeholder="权限对应的视图组件路径" style="width: 360px;" class="filter-item"/>
        </el-form-item>
        <el-form-item label="图标:" prop="iconName">
          <el-input v-model="listUpdate.iconName" placeholder="图标" style="width: 360px;" class="filter-item"/>
        </el-form-item>
        <el-form-item label="请求方式:" prop="method">
          <el-select v-model="listUpdate.method" placeholder="请选择权限类型" style="width: 360px;">
            <el-option label="GET" value="GET"/>
            <el-option label="POST" value="POST"/>
            <el-option label="DELETE" value="DELETE"/>
            <el-option label="PUT" value="PUT"/>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序号:" prop="showOrder">
          <el-input-number min="0" v-model="listUpdate.showOrder" style="width: 360px;"/>
        </el-form-item>
        <el-form-item label="是否可用:" prop="enabled">
          <el-select v-model="listUpdate.enabled" placeholder="请选择是否可用" style="width: 360px;">
            <el-option label="是" value="1"/>
            <el-option label="否" value="0"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveData('listUpdate')">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
/**
 * 1.父菜单选择查询
 * 2.菜单新增或编辑
 */
import {getPermissiontreeList, getPermissiontreeUpdate} from '@/api/permission'
import XuiDictionary from "@/components/xui/dictionary/dictionary";

export default {
  name: 'Table',
  components: {XuiDictionary},
  data() {
    return {
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        name: '', // 模糊匹配，用户姓名
        py: '', // 模糊匹配，员工编号
        gsbmName: '' // 模糊匹配，归属部门名称
      },
      tableData: [], // 表格数据
      // 检验规则
      submitRules: {
        name: [{required: true, trigger: 'change', message: '该项为必填项'}],
        code: [{required: true, trigger: 'change', message: '该项为必填项'}],
        type: [{required: true, trigger: 'change', message: '该项为必填项'}],
        method: [{required: true, trigger: 'change', message: '该项为必填项'}],
        enabled: [{required: true, trigger: 'change', message: '该项为必填项'}],
        showOrder: [{required: true, trigger: 'change', message: '该项为必填项'}],
        url: [{required: true, trigger: 'change', message: '该项为必填项'}]
      },
      listUpdate: { // 弹窗
        code: '', // 是 权限编号,唯一，新增时填写，编辑时不可修改
        name: '', // 是 权限名称
        type: '1', // 是 权限类型 枚举 1：菜单 2：按钮
        url: '', // 否 权限服务端功能路径
        viewPath: '', // 否 权限对应的视图组件路径
        method: 'GET', // 是 用方法，GET, POST, PUT等
        iconName: '', // 否 权限图标名称
        fid: '', // 是 父权限ID
        enabled: '1', // 是 本功能权限是否可用 枚举 0：否 1：是
        showOrder: '1' // 是 显示顺序
      }
    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    // 查询
    onQuery() {
      getPermissiontreeList().then(response => {
        this.tableData = response.data
        console.log(this.tableData)
        this.tableData.forEach(element => {
          if (element.sub && element.sub.length > 0) {
            element.children = element.sub
            select(element.sub)
          } else {
            element.children = []
          }
        })

        function select(subFather) {
          subFather.forEach(element => {
            if (element.sub && element.sub.length > 0) {
              element.children = element.sub
              select(element.sub)
            } else {
              element.children = []
            }
          })
        }
      })
    },
    // 分页数据发生变化
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },
    // 添加
    onAdd(fid) {
      this.clearData(fid) // 清空添加的数据
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 清空添加的数据
    clearData(fid) {
      this.listUpdate = { // 弹窗
        code: '', // 是 权限编号,唯一，新增时填写，编辑时不可修改
        name: '', // 是 权限名称
        type: '1', // 是 权限类型 枚举 1：菜单 2：按钮
        url: '', // 否 权限服务端功能路径
        viewPath: '', // 否 权限对应的视图组件路径
        method: 'GET', // 是 用方法，GET, POST, PUT等
        iconName: '', // 否 权限图标名称
        fid: fid, // 是 父权限ID
        enabled: '1', // 是 本功能权限是否可用 枚举 0：否 1：是
        showOrder: '1' // 是 显示顺序
      }
    },
    onUpdate(row) {
      this.listUpdate = { // 弹窗
        id: row.id,
        code: row.code, // 是 权限编号,唯一，新增时填写，编辑时不可修改
        name: row.name, // 是 权限名称
        type: row.type ? row.type.toString() : '', // 是 权限类型 枚举 1：菜单 2：按钮
        url: row.url, // 否 权限服务端功能路径
        viewPath: row.viewPath, // 否 权限对应的视图组件路径
        method: row.method, // 是 用方法，GET, POST, PUT等
        iconName: row.iconName ? row.iconName.toString() : '', // 否 权限图标名称
        fid: row.fid, // 是 父权限ID
        enabled: (row.enabled !== undefined && row.enabled !== null) ? row.enabled.toString() : '', // 是 本功能权限是否可用 枚举 0：否 1：是
        showOrder: row.showOrder // 是 显示顺序
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 保存
    saveData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = {...this.listUpdate}
          getPermissiontreeUpdate(req).then(response => {
            this.dialogFormVisible = false
            this.$message({message: this.dialogStatus == 'create' ? '添加成功' : '修改成功', type: 'success'})
            this.onQuery() // 查询
          })
        } else {
          this.$message({message: '请填写必填项', type: 'warning'})
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>
