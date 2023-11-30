<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="点检名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="点检名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="设备名称"  size="small">
          <el-input v-model="listQuery.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="点检类型"  size="small">
          <el-select v-model="listQuery.type"  size="small" placeholder="设备分类" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in eqType" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否绑定设备"  size="small">
          <el-radio-group v-model="listQuery.isLinked">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onExport"><svg-icon icon-class="qrcode" /> 导出</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-upload2" @click="uploadDialogVisible = true">导入</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="generateCheckTask">生成点检任务</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe  highlight-current-row
      :data="tableData"
      class="otherCon wp"

      style="width: 100%;font-size:0.7rem;"
      row-key="id"
      border
      :expand-row-keys="expands"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @expand-change="handleExpendRow"
    >
      <el-table-column type="expand" prop="name" width="60" align="center" label="详细">
        <template #default="props">

          <!--第二层表格-->
          <el-table stripe  highlight-current-row  :data="props.row.dicts"  style="font-size:0.7rem;">
            <el-table-column prop="step" width="60" align="center" label="步骤" />
            <el-table-column prop="name" align="center" width="250" label="点检项名称" />
            <el-table-column prop="description" align="center" label="点检内容" />
            <el-table-column prop="itemCategory" align="center" width="100" label="点检项类型">
              <template  #default="scope">
                <div v-if="scope.row.itemCategory == 0">安全部位类</div>
                <div v-if="scope.row.itemCategory == 1">核心部件类</div>
                <div v-if="scope.row.itemCategory == 2">其他</div>
              </template>
            </el-table-column>
            <el-table-column prop="sort" width="200" align="center" label="要求值上限 | 要求值下限">
              <template v-if="scope.row.type==1"  #default="scope">
                {{ scope.row.upperLimit }} | {{ scope.row.lowerLimit }} 【{{ scope.row.unit }}】
              </template>
            </el-table-column>
            <!-- 子表格操作列 -->
            <el-table-column header-align="center" align="center" width="120" label="点检项二维码">
              <template  #default="scope">
                <el-button-group>
                  <el-button  size="small" title="编辑" type="text" @click="handleQRCode(scope.row)">
                    查看二维码
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="120" label="操作">
              <template  #default="scope">
                <el-button-group>
                  <el-button  size="small" title="编辑" type="primary" icon="el-icon-edit" @click="handleItemUpdateDict(props.row,scope.row)" />
                  <el-button  size="small" title="删除" type="danger" icon="el-icon-delete" @click="handleItemDeleteDict(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" width="250" label="点检名称" />
      <el-table-column prop="description" align="center" label="点检描述" />
      <el-table-column prop="type" align="center" width="200" label="点检类型">
        <template  #default="scope">
          <div v-if="scope.row.type == 0">日常点检</div>
          <div v-if="scope.row.type == 1">专业点检</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" width="80" label="点检设备">
        <template  #default="scope">
          <el-button  size="small" title="查看" type="text" @click="checkEqp(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="260" label="操作">
        <template  #default="scope">
          <el-button-group>
            <el-button  size="small" title="编辑" type="primary" icon="el-icon-edit" @click="handleEditDict(scope.row)">
              <i icon="el-icon-edit" />
            </el-button>
            <el-button  size="small" title="删除" type="danger" icon="el-icon-delete" @click="handleDeleteDict(scope.row)" />
            <el-button  size="small" title="添加点检规则" type="primary" icon="el-icon-plus" @click="handleItemAddDict(scope.row)">
              添加点检规则
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon" @pagination="getList" />

    <!--弹窗新增或修改点检计划-->
    <el-dialog v-draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]"  v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="110px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="点检名称:" prop="name"  size="small">
          <el-input v-model="listUpdate.name" placeholder="点检名称" style="width: 320px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="点检描述:"  size="small">
          <el-input v-model="listUpdate.description" placeholder="点检描述" style="width: 320px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="点检类型:" prop="type"  size="small">
          <el-select v-model="listUpdate.type" placeholder="请选择" style="width: 100px;" @change="typeChange">
            <el-option label="日常点检" value="0" />
            <el-option label="专业点检" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item  label="点检周期:" prop="type"  size="small">
          <el-input-number v-model="listUpdate.cycle" label="点检周期" :min="0" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item  label="点检周期单位:" prop="type"  size="small">
          <el-select v-model="listUpdate.cycleUnit" placeholder="请选择" style="width: 100px;">
            <el-option label="日" value="0" />
            <el-option label="月" value="1" />
            <el-option label="年" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  size="small" @click="dialogStatus==='create'?createData('listUpdate', '添加成功'):updateData('listUpdate', '修改成功')">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--弹窗新增或修改点检计划-->
    <el-dialog v-draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]+'(点检规则)'"  v-model="dialogItemFormVisible" class="roleDialog">
      <el-form ref="listItemUpdate" label-position="right" label-width="100px" :rules="submitItemRules" :model="listItemUpdate">
        <el-form-item label="步骤:" prop="step"  size="small">
          <el-input-number v-model="listItemUpdate.step" label="步骤" :min="1" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="点检项名称:" prop="name"  size="small">
          <el-input v-model="listItemUpdate.name" placeholder="点检项名称" style="width: 350px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="点检内容:" prop="description"  size="small">
          <el-input v-model="listItemUpdate.description" placeholder="点检内容" type="textarea" :rows="3" style="width: 350px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="点检项类型:" prop="itemCategory"  size="small">
          <el-select v-model="listItemUpdate.itemCategory" placeholder="请选择" style="width: 120px;">
            <el-option label="安全部位类" value='0' />
            <el-option label="核心部位类" value='1' />
            <el-option label="其他" value='2' />
          </el-select>
        </el-form-item>
        <el-form-item label="拍照检查:" prop="needPhoto"  size="small">
          <el-select v-model="listItemUpdate.needPhoto" placeholder="请选择" style="width: 100px;">
            <el-option label="不需要" value="0" />
            <el-option label="需要" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="文字描述:" v-if="listItemUpdate.checkType==='1'"  size="small">
          <el-select v-model="listItemUpdate.needText" placeholder="请选择" style="width: 100px;">
            <el-option label="不需要" value="0" />
            <el-option label="需要" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="点检类别:" prop="type"  size="small">
          <el-select v-model="listItemUpdate.type" placeholder="请选择" style="width: 100px;">
            <el-option label="常规检查" value="0" />
            <el-option label="数据检查" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="listItemUpdate && listItemUpdate.type == 1" label="数据上限:"  size="small">
          <el-input-number v-model="listItemUpdate.upperLimit" label="数据上限" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item v-show="listItemUpdate && listItemUpdate.type == 1" label="数据下限:"  size="small">
          <el-input-number v-model="listItemUpdate.lowerLimit" label="数据下限" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item v-show="listItemUpdate && listItemUpdate.type == 1" label="数据单位:"  size="small">
          <el-input v-model="listItemUpdate.unit" label="数据单位" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <!-- <el-form-item label="点检图标:" size="small">
        </el-form-item> -->
      </el-form>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogItemFormVisible = false">取 消</el-button>
        <el-button type="primary"  size="small" @click="dialogStatus==='create'?createItemData('listItemUpdate', '添加成功'):updateItemData('listItemUpdate', '修改成功')">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--查看点检设备-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="编辑点检设备"  v-model="dialogCheckFormVisible" class="roleBigDialog">
      <div>
        <div class="filter-container searchCon">
          <el-form :inline="true" :model="listQueryEqp" class="demo-form-inline demo-form-zdy">
            <el-form-item label="设备编号"  size="small">
              <el-input v-model="listQueryEqp.id" placeholder="设备编号" style="width: 180px;" class="filter-item" clearable />
            </el-form-item>
            <el-form-item label="设备名称"  size="small">
              <el-input v-model="listQueryEqp.name" placeholder="设备名称" style="width: 180px;" class="filter-item" clearable />
            </el-form-item>
            <el-form-item  size="small">
              <el-button type="primary" icon="el-icon-search" @click="onBtnEqpQuery">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="app-containerR wp" style="height:350px;">
          <div class="hp otherCon">
            <el-card shadow="hover" class="hp">
              <div  class="clearfix">
                <span>未绑定设备</span>
              </div>
              <div class="wp hp app-containerC">
                <el-tree
                  ref="dataTreeNo"
                  class="otherCon wp"
                  :data="transferNoData"
                  :props="props"
                  show-checkbox
                  default-expand-all
                  highlight-current
                  :expand-on-click-node="false"
                />
              </div>
            </el-card>
          </div>
          <div class="hp leftSmallRCon app-containerC cc">
            <el-button type="primary" size="small" plain icon="el-icon-arrow-left" @click="rightClick()" />
            <el-button type="primary" size="small" plain icon="el-icon-arrow-right" style="margin: 10px 0 0;" @click="leftClick()" />
          </div>
          <div class="hp otherCon">
            <el-card shadow="hover" class="hp">
              <div  class="clearfix">
                <span>已绑定设备</span>
              </div>
              <div class="wp hp app-containerC">
                <el-tree
                  ref="dataTree"
                  class="otherCon wp"
                  :data="transferData"
                  :props="props2"
                  show-checkbox
                  default-expand-all
                  highlight-current
                  :expand-on-click-node="false"
                />
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogCheckFormVisible = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="updateTransferData()"  size="small">
          保存
        </el-button> -->
      </div>
    </el-dialog>

    <!--查看二维码-->
    <el-dialog v-draggable  :close-on-click-modal="false" title="查看二维码"  v-model="dialogQRCodeFormVisible" class="roleDialog">
      <el-card shadow="hover" class="wp qrcode app-containerC cc">
        <div id="qrcode" class="wp hp" />
      </el-card>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogQRCodeFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
      title="导入"
       v-model="uploadDialogVisible"
      width="400px"
      @close="handleClose"
    >
      <el-row>
        <el-col>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            accept=".xls,.xlsx"
          >
            <el-button  size="medium" type="primary">
              选取文件
            </el-button>
            <el-button
              size="medium"
              type="success"
              @click="submitUpload"
              style="margin-left: 70px;"
              >上传
            </el-button>
            <div   class="el-upload__tip">只能选取xls/xlsx文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog v-draggable  :close-on-click-modal="false" title="选择点检设备"  v-model="dialogProCheckFormVisible" class="roleDialog800">
      <proCheckEquip ref="equipAction" :checkDataSelected="checkDataSelected"></proCheckEquip>
      <div   class="dialog-footer">
        <el-button @click="dialogProCheckFormVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>

    <EquipBoundDialog ref="EquipBoundDialog"></EquipBoundDialog>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 点检配置查询,点检配置新增与编辑,点检配置删除,点检项目配置查询,点检配置新增与编辑, 点检项删除,点检配置设备挂接,点检项图示上传,点检项目配置查询
import { getMainConfList, getMainConfUpdate, deleteMainConf, getItemConf, getItemConfUpdate, deleteItemConf, getEqpConfUpdate, getPicUpLoad, getEqpConf, genCheckTask, importCheck } from '@/api/em/eqpCheck'
// 点检设备配置查询(已绑定)
import { getEqpConfList } from '@/api/em/eqpMtc'
// 点检设备配置查询(所有)
import { getEqpInitList } from '@/api/em/eqpCommon'
// 单文件上传操作
import { getSingleUpload } from '@/api/endpoint'
// 浏览器获取访问文件的根路径
import { getRooturl } from '@/api/endpoint'
import { getEqCateList } from '@/api/em/eqpLedger'
import proCheckEquip from '@/views/em/emCheck/emCheckEqp/proCheckEquip.vue'
import EquipBoundDialog from "@/views/em/common/equipBoundDialog.vue";
import frozenDialog from "@/views/ps/planMain/dialog/frozenDialog.vue";
export default {
  name: 'Table',
  components: {frozenDialog, Pagination,proCheckEquip,EquipBoundDialog },
  data() {
    return {
      eqType: [{ 'id': 100, 'name': '全部' }, { 'id': 0, 'name': '日常点检' }, { 'id': 1, 'name': '专业点检' }],
      urlPath: '', // 接口前缀
      tableKey: 0,
      total: 0, // 总个数
      list: null,
      listQuery: {
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        eqpName: '', // 设备名称
        type: 100, // 点检类型
        name: '',
        isLinked:0
      },
      tableData: [], // 点检配置查询（第一层）
      textMap: { // 控制弹窗提示字(点检计划)
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 弹窗显示隐藏(点检计划)
      listUpdate: { // 弹窗(点检计划)
        description: '', // 点检计划描述
        name: '', // 模糊匹配，角色名称
        type: '0',
        cycle: 1, // 点检周期、仅技术鉴定填写
        cycleUnit: '0'// 点检周期单位、枚举、仅技术鉴定填写 0：日 1：月 2：年
      },
      // 检验规则(点检计划)
      submitRules: {
        name: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        type: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      submitItemRules: {
        step: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        name: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        description: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      dialogItemFormVisible: false, // 点检规则弹窗显示隐藏
      listItemUpdate: { // 点检项
        id: '',
        checkId: '',
        step: 1,
        type: '0',
        name: '',
        description: '',
        lowerLimit: '',
        upperLimit: '',
        unit: '',
        needPhoto:'1',
        itemCategory: '2',
        needText:'0',
        checkType:'0'
      },
      expands: [], // 控制表格左侧伸缩箭头打开关闭
      expandedRowData: [], // 控制点击向下箭头,展开时有数据，不展开没有数据
      dialogCheckFormVisible: false, // 查看点检设备显示隐藏
      dialogProCheckFormVisible: false, // 查看专业点检设备显示隐藏
      equipRowSelected: [], // 选中哪条数据
      dataTree: [],
      props: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub', // 子级字段名
        disabled: function(data, node) {
          if (data.fid == null && data.sub.length == 0) {
            return true
          }
          return false
        }
      },
      props2: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'sub' // 子级字段名
      },
      transferNoData: [], // 未绑定数据
      transferData: [], // 已绑定数据
      dialogQRCodeFormVisible: false, // 二维码
      uploadDialogVisible: false,
      fileList: [],
      listQueryEqp:{
        id:'',
        name:''
      },
      eqpMainId:'',
      checkDataSelected:[]
    }
  },
  mounted() {
    this.onQuery()
    this.onRooturlQuery() // 浏览器获取访问文件的根路径
  },
  methods: {
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 点检配置查询（第一层）,identifier为delete时，为删除调用。其他时候没有特殊限制
    onQuery(identifier) {
      // console.log(JSON.stringify(this.listQuery))
      getMainConfList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
        this.isDropItem(identifier) // 判断有没有展开的下拉项，有的话重新查找
        this.expands = []
      })
    },
    // 浏览器获取访问文件的根路径
    onRooturlQuery() {
      getRooturl().then(response => {
        this.urlPath = response.data // 访问服务器的根路径，直接放在data属性上。
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
    // 新增点检计划（第一层表格）
    onAdd() {
      this.clearData() // 清空添加的数据
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 修改点检计划（第一层表格）
    handleEditDict(item) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.listUpdate = { // 弹窗
        description: item.description, // 点检计划描述
        name: item.name, // 模糊匹配，角色名称
        type: item.type ? item.type.toString() : '0',
        id: item.id,
        cycle: item.cycle,
        cycleUnit: item.cycleUnit ? item.cycleUnit.toString() : '0'
      }
    },
    // 删除点检计划（第一层表格）
    handleDeleteDict(item) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const req = { ids: [item.id] }
        deleteMainConf(req).then(response => {
          this.expands = []
          this.$message({ message: '删除成功', type: 'success' })
          this.onQuery('delete') // 查询
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        description: '', // 点检计划描述
        name: '', // 模糊匹配，角色名称
        type: '0',
        cycle: 1, // 点检周期、仅技术鉴定填写
        cycleUnit: '0'// 点检周期单位、枚举、仅技术鉴定填写 0：日 1：月 2：年
      }
    },
    createData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    updateData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    // 保存
    saveData(listUpdate, message) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          const req = { ...this.listUpdate }
          req.type = parseInt(this.listUpdate.type)
          req.cycleUnit = parseInt(this.listUpdate.cycleUnit)
          getMainConfUpdate(req).then(response => {
            this.$message({ message: message, type: 'success' })
            this.onQuery() // 查询
            this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 判断有没有展开的下拉项，有的话重新查找
    isDropItem(identifier) {
      if (this.expandedRowData.length > 0) {
        this.handleExpendRow(this.expandedRowData[0], this.expandedRowData, identifier)
      }
    },
    // 点击向下箭头
    handleExpendRow(row, expandedRows, identifier) {
      // 判断有没有展开的点检项
      var checkInt = 0
      expandedRows.forEach(item => {
        if (item.id == row.id) {
          checkInt++
          this.expandedRowData = [item]
        }
      })
      checkInt == 0 ? this.expandedRowData = [] : this.expandedRowData
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
      } else {
        this.expands = []
      }
      this.queryDictData(row, row.labelType, identifier) // 关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息
    },
    queryDictData(row, labelType, identifier) {
      getItemConf({ mainId: row.id }).then(response => {
        const index = this.tableData.findIndex(data => data.id === row.id) // 首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
        if (!identifier) {
          this.$set(this.tableData[index], 'dicts', response.data) // 这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
        }
      })
    },
    // 新增点检规则
    handleItemAddDict(item, tableKey) {
      this.listItemUpdate = { // 点检项
        id: '',
        checkId: item.id,
        step: 1,
        type: '0',
        name: '',
        description: '',
        lowerLimit: '',
        upperLimit: '',
        needPhoto: '1',
        itemCategory: '2',
        needText:'0',
        checkType: item.type.toString()
      }
      this.dialogItemFormVisible = true
      this.dialogStatus = 'create'
    },
    handleItemUpdateDict(item, row) {
      this.listItemUpdate = JSON.parse(JSON.stringify(row))
      this.listItemUpdate.type = this.listItemUpdate.type.toString()
      this.listItemUpdate.needPhoto = this.listItemUpdate.needPhoto.toString()
      this.listItemUpdate.itemCategory = this.listItemUpdate.itemCategory.toString()
      this.listItemUpdate.needText = this.listItemUpdate.needText.toString()
      this.listItemUpdate.checkType = item.type.toString()
      this.dialogItemFormVisible = true
      this.dialogStatus = 'update'
    },
    // 点检计划第一层 点检类型 切换
    typeChange(val) {
      // if(val == 1) {

      // }
    },
    // 点击添加点检规则
    createItemData(listItemUpdate, message) {
      this.saveItemData(listItemUpdate, message)
    },
    updateItemData(listItemUpdate, message) {
      this.saveItemData(listItemUpdate, message)
    },
    // 保存
    saveItemData(listItemUpdate, message) {
      this.$refs[listItemUpdate].validate((valid) => {
        if (valid) {
          console.log(this.listItemUpdate)
          this.dialogItemFormVisible = false
          const req = { ...this.listItemUpdate }
          req.type = parseInt(this.listItemUpdate.type)
          getItemConfUpdate(req).then(response => {
            this.$message({ message: message, type: 'success' })
            this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 删除点检项
    handleItemDeleteDict(row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItemConf({ ids: [row.id] }).then(response => {
          this.$message({ message: '删除成功', type: 'success' })
          this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    checkEqp(row){
      if(row.type === 1){
        this.dialogProCheckFormVisible = true
        this.checkDataSelected = row
        this.$nextTick(() => {
          this.$refs.equipAction.onQuery()
        })
      }else {
        let selectedData = {
          mainId:row.id,
          typeOfDialog:'check'
        }
        this.$refs.EquipBoundDialog.initData(selectedData)
      }
    },
    // 点击查看
    handleCheck(row) {
      this.equipRowSelected = row // 选中哪条数据
      this.eqpMainId = row.id
      getEqpConf({ pg_pagesize: 1000, pg_pagenum: 1, mainId: row.id }).then(response => {
        this.transferNoData = response.data.notLinked // 未绑定数据
        this.transferData = response.data.linkedEqp // 已绑定数据
      })
    },
    changeFile(e, row) {
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      param.append('appid', 'mesupload') // 添加form表单中其他数据
      // 上传图标
      getSingleUpload(param).then(response => {
        // 点检项图示更新
        getPicUpLoad({ k: row.id, v: response.path }).then(responseUp => {
          this.$message({ message: '更新成功', type: 'success' })
          this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
        })
      })
    },
    // 设备解绑
    rightClick() {
      const data = this.$refs.dataTree.getCheckedNodes()
      const req = { mainId: this.equipRowSelected.id, eqps: [] }
      if (data.length == 0) {
        this.$message({ message: '请选择右侧设备', type: 'warning' })
      } else {
        // transferData  // 已绑定
        // this.transferData.forEach(response =>{
        //   var int = 0
        //   data.forEach(response2 =>{
        //     if(response.k == response2.k) {
        //       int ++
        //     }
        //   })
        //   if(int == 0) {
        //     req.eqpIds.push(response.k)
        //   }
        // })
        data.forEach(res => {
          req.eqps.push({ 'eqpId': res.k })
        })
        this.updateTransferData(req)
      }
    },
    // 绑定设备
    leftClick() {
      const dataNo = this.$refs.dataTreeNo.getCheckedNodes()
      const req = { mainId: this.equipRowSelected.id, eqps: [] }
      if (dataNo.length == 0) {
        this.$message({ message: '请选择左侧设备', type: 'warning' })
      } else {
        if (this.transferData && this.transferData.length > 0) {
          // 现有已绑定的
          this.transferData.forEach(response => {
            req.eqps.push({ 'eqpId': response.k, 'eqpName': response.v })
          })
        }

        // 新添加的
        dataNo.forEach(response => {
          if (!(response.fid == null)) {
            req.eqps.push({ 'eqpId': response.id, 'eqpName': response.name })
          }
        })
        this.updateTransferData(req)
      }
    },
    // 保存修改点检设备
    updateTransferData(req) {
      // mainId 点检主数据表主键id,eqpIds 设备id
      // const req = { mainId: this.equipRowSelected.id, eqpIds: this.transferValue }
      // // 点检配置设备挂接
      getEqpConfUpdate(req).then(response => {
        // this.dialogCheckFormVisible = false
        this.handleCheck(this.equipRowSelected)
        this.$message({ message: response.data, type: 'success' })
      })
    },
    // 查看二维码
    handleQRCode(row) {
      this.dialogQRCodeFormVisible = true
      this.$nextTick(function() {
        document.getElementById('qrcode').innerHTML = ''
        const qrcode = new QRCode('qrcode', {
          width: 300,
          height: 300,
          text: row.id,
          // mode: 'Numeric',//由于我这个是纯数字，这里改下模式
          colorDark: '#000000', // 前景色
          colorLight: '#ffffff', // 背景色
          correctLevel: QRCode.CorrectLevel.L// 降低容错级别
        })
      })
    },
    onExport() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/checkqr'
    },
    generateCheckTask(){
      genCheckTask().then(response => {
        this.$message({ message: response.data, type: 'success' })
      })
    },
    handleChange(file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
    },
    handleRemove() {
      this.fileList = [];
    },
    async submitUpload() {
      if (this.fileList.length > 0) {
        let file = new FormData();
        file.append("file", this.fileList[0].raw);
        importCheck(file).then(res=>{
          if (res.err_code === 10000) {
              this.$message.success("上传成功！");
              this.handleClose();
          } else this.$message.error("上传失败"+res.err_msg)
        })
      } else {
        this.$message.error("请选取一个文件！");
      }
    },
    handleClose() {
      this.fileList = [];
      this.onBtnQuery();
      this.uploadDialogVisible = false;
    },
    onBtnEqpQuery(){
      getEqpConf({ mainId: this.eqpMainId,eqpId:this.listQueryEqp.id,eqpName:this.listQueryEqp.name }).then(response => {
        this.transferNoData = response.data.notLinked // 未绑定数据
        this.transferData = response.data.linkedEqp // 已绑定数据
      })
    }
  }
}
</script>

<style scoped>
.imgIcon{
  width:30px;
  height:30px;
  border-radius: 3px;
}
.fileCls {
  height: 26px;
  width: 30px;
  position: absolute;
  filter: alpha(opacity = 0);
  -moz-opacity: 0;
  opacity: 0;
  z-index: 110;
  cursor: pointer;
  float: right;
  margin-top: -26px;
  position: relative;
  left: 0;
}
.qrcode{
  height:320px;
}
</style>
