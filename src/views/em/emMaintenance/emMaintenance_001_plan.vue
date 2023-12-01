  <template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="保养名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="保养名称" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item label="设备名称"  size="small">
          <el-input v-model="listQuery.eqpName" placeholder="设备名称" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item label="周期保养类型"  size="small">
          <el-radio-group v-model="listQuery.cycleType">
            <el-radio :label="99">全部</el-radio>
            <el-radio :label="2">日常保养</el-radio>
            <el-radio :label="1">定期保养</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否绑定设备"  size="small">
          <el-radio-group v-model="listQuery.isLinked">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Plus" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onExport"><svg-icon icon-class="qrcode" /> 导出</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-upload2" @click="uploadDialogVisible = true">导入</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary"  @click="generateMaintainTask">生成保养任务</el-button>
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
      @expand-change="handleExpendRow"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
      <el-table-column type="expand" prop="name" width="60" align="center" label="">
        <template #default="props">

          <!--第二层表格 开始-->
          <el-table stripe  highlight-current-row  :data="props.row.dicts" v-loading="vItemloading" style="font-size:0.7rem;">
            <el-table-column prop="step" width="60" align="center" label="步骤" />
            <el-table-column prop="name" align="center" width="250" label="保养项名称" />
            <el-table-column prop="description" align="center" label="保养项内容" />
            <!-- 子表格操作列 -->
            <el-table-column header-align="center" align="center" width="180" label="操作">
              <template  #default="scope">
                <el-button-group>
                  <el-button  size="small" title="编辑" type="primary" icon="Edit" @click="handleItemUpdateDict(props.row,scope.row)" />
                  <el-button  size="small" title="删除" type="danger" icon="Delete" @click="handleItemDeleteDict(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <!--第二层表格 结束-->

        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="保养名称" />
      <el-table-column prop="safetyMeasure" align="center" label="安全措施" />
      <el-table-column prop="type" align="center" width="120" label="保养类型">
        <template #default="scope">
          <div v-if="scope.row.cycleType == 1">定期保养</div>
          <div v-if="scope.row.cycleType == 2">日常保养</div>
        </template>
      </el-table-column>
      <el-table-column prop="cycle" align="center" width="120" label="保养周期" />
      <el-table-column prop="cycleUnit" align="center" width="120" label="保养周期单位">
        <template  #default="scope">
          <div v-if="scope.row.cycleUnit == 0">日</div>
          <div v-if="scope.row.cycleUnit == 1">月</div>
          <div v-if="scope.row.cycleUnit == 2">年</div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="295" label="操作">
        <template  #default="scope">
          <el-button-group>
            <el-button  size="small" title="编辑" type="primary" icon="Edit" @click="handleEditDict(scope.row)">
              <i icon="Edit"></i>
            </el-button>
            <el-button  size="small" title="删除" type="danger" icon="Delete" @click="handleDeleteDict(scope.row)" />
            <el-button  size="small" title="新增保养规则" type="primary" icon="Plus" @click="handleItemAddDict(scope.row)">
              新增保养规则
            </el-button>
            <el-button  size="small" title="选择保养设备" type="primary" @click="handleCheck(scope.row)">
              选择保养设备
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" @pagination="getList" class="searchCon" />

    <!--查看日常保养绑定设备-->
    <el-dialog draggable :close-on-click-modal="false" title="编辑保养设备"  v-model="dialogEqpFormVisible" class="roleBigDialog">
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
              <el-button type="primary" icon="Search" @click="onBtnEqpQuery">查询</el-button>
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
        <el-button  size="small" @click="dialogEqpFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!--弹窗新增或修改保养计划-->
    <el-dialog draggable :close-on-click-modal="false" :title="textMap[dialogStatus]"  v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="150px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="保养计划名称:" prop="name"  size="small">
          <el-input v-model="listUpdate.name" placeholder="保养计划名称" style="width: 290px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="安全措施:"  size="small">
          <el-input v-model="listUpdate.safetyMeasure" placeholder="安全措施" type="textarea" :rows="3" style="width: 290px;" class="filter-item"  size="small" />
        </el-form-item>
        <!-- <el-form-item label="保养类型:" prop="type"  size="small">
          <el-select v-model="listUpdate.type" placeholder="请选择" style="width: 160px;">
            <el-option label="按计划保养" value="0" />
            <el-option label="按周期保养" value="1" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="周期保养类型:" prop="cycleType"  size="small" >
          <el-select v-model="listUpdate.cycleType" placeholder="请选择" style="width: 160px;">
            <el-option label="日常保养" value="2" />
            <!-- <el-option label="一级保养" value="0" /> -->
            <el-option label="定期保养" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="保养周期:" prop="cycle"  size="small"  >
          <el-input-number v-model="listUpdate.cycle" label="保养周期" :min="0" style="width: 160px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="保养周期单位:" prop="cycleUnit"  size="small"  >
          <el-select v-model="listUpdate.cycleUnit" placeholder="请选择" style="width: 160px;">
            <el-option label="日" value="0" />
            <el-option label="月" value="1" />
            <el-option label="年" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="保养提前提示期(日):" prop="adReminderDate"  size="small" v-show="listUpdate.cycleType==1" >
          <el-input-number v-model="listUpdate.adReminderDate" label="保养提前提示期(日)" :min="0" style="width: 160px;" class="filter-item" size="small"></el-input-number>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData('listUpdate', '添加成功'):updateData('listUpdate', '修改成功')"  size="small">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--弹窗新增或修改点检计划-->
    <el-dialog draggable :close-on-click-modal="false" :title="textMap[dialogStatus]+'(保养项)'"  v-model="dialogItemFormVisible" class="roleDialog">
      <el-form ref="listItemUpdate" :inline="true" label-position="right" label-width="100px" :rules="submitItemRules" :model="listItemUpdate">
        <el-form-item label="步骤:" prop="step"  size="small">
          <el-input v-model="listItemUpdate.step" placeholder="步骤" style="width: 350px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="保养项名称:" prop="name"  size="small">
          <el-input v-model="listItemUpdate.name" placeholder="保养项名称" style="width: 350px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="保养内容:" prop="description"  size="small">
          <el-input v-model="listItemUpdate.description" placeholder="保养内容" type="textarea" :rows="3" style="width: 350px;" class="filter-item"  size="small" />
        </el-form-item>
        <el-form-item label="拍照检查:"  size="small">
          <el-select v-model="listItemUpdate.needPhoto" placeholder="请选择" style="width: 100px;">
            <el-option label="不需要" value="0" />
            <el-option label="需要" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="文字描述:"  size="small">
          <el-select v-model="listItemUpdate.needText" placeholder="请选择" style="width: 100px;">
            <el-option label="不需要" value="0" />
            <el-option label="需要" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogItemFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createItemData('listItemUpdate', '添加成功'):updateItemData('listItemUpdate', '修改成功')"  size="small">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--选择保养设备-->
    <el-dialog draggable :close-on-click-modal="false" title="选择保养设备"  v-model="dialogCheckFormVisible" class="roleDialog800">
      <chooseEquip ref="equipAction" :equipRowSelected="equipRowSelected"></chooseEquip>
      <div   class="dialog-footer">
        <el-button @click="dialogCheckFormVisible = false"  size="small">关 闭</el-button>
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
    <EquipBoundDialog ref="EquipBoundDialog"></EquipBoundDialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 保养配置查询,保养配置新增与编辑,保养配置删除,保养项配置查询,保养项新增与编辑,保养项删除,保养项图示保存
import { eqpConfDaily,genMaintainTask,eqpConfDailyUpdate,getMainConfList,getMainConfUpdate, deleteMainConf, getItemConfList, getItemConfUpdate, deleteItemConf, getPicUpdate, importMtc } from '@/api/em/eqpMtc'
import chooseEquip from './emMaintenance_001_plan_children/chooseEquip'
import EquipBoundDialog from "@/views/em/common/equipBoundDialog.vue";
// 单文件上传操作
import { getSingleUpload } from '@/api/endpoint'
// 浏览器获取访问文件的根路径
import { getRooturl } from '@/api/endpoint'
export default {
  name: 'Table',
  components: { Pagination, chooseEquip,EquipBoundDialog },
  data() {
    return {
      urlPath: '', // 接口前缀
      vItemloading: false, // 控制子表格表格加载
      tableKey: 0,
      transferNoData:[],
      transferData:[],
      dialogEqpFormVisible: false,
      total: 0, // 总个数
      list: null,
      mainId:'',
      listQueryEqp:{
        id:'',
        name:''
      },
      listQuery: {
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        name: '',
        eqpName:'', // 设备名称
        isLinked:0, //是否只查询绑定了设备的配置
        cycleType:99
      },
      dataTree: [],
      tableData: [], // 点检配置查询（第一层）
      textMap: { // 控制弹窗提示字(点检计划)
        update: '修改',
        create: '添加'
      },
      dialogFormVisible: false, // 弹窗显示隐藏(点检计划)
      listUpdate: { // 弹窗(保养计划)
        name: '', // 保养类型、枚举
        type: 1, // 保养类型、枚举
        cycleUnit: '0', // 保养周期单位、枚举
        cycle: 0, // 保养周期
        adReminderDate: 0, // 保养提前提示期
        cycleType:'2', //保养周期类型
        safetyMeasure:'' //安全措施
      },
      // 检验规则(点检计划)
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
        value: 'k', // ID字段名
        label: 'v', // 显示名称
        children: 'sub' // 子级字段名
      },
      submitRules: {
        name: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        cycleType: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        type: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        cycle: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        cycleUnit: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        adReminderDate: [
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
        id: '', // 新增时无id，编辑时需填写对应数据id
        mtcId: '', // 保养计划id
        step: 1, // 该保养项为第几步
        name: '', // 保养项名称
        description: '', // 保养项描述
        needPhoto:'0',
        needText:'0',
        type:'0'
      },
      expands: [], // 控制表格左侧伸缩箭头打开关闭
      expandedRowData: [], // 控制点击向下箭头,展开时有数据，不展开没有数据
      dialogCheckFormVisible: false, // 查看保养设备显示隐藏
      equipRowSelected: [], // 选中哪条数据
      uploadDialogVisible: false,
      fileList: [],
    }
  },
  mounted() {
    this.onQuery()
    this.onRooturlQuery() // 浏览器获取访问文件的根路径
  },
  methods: {
    onBtnQuery(){
      this.listQuery.pg_pagenum=1
      this.onQuery()
    },
    // 点检配置查询（第一层）,identifier为delete时，为删除调用。其他时候没有特殊限制
    onQuery(identifier) {
      getMainConfList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
        this.isDropItem(identifier) // 判断有没有展开的下拉项，有的话重新查找
        this.expands = [];
      })
    },
    // 浏览器获取访问文件的根路径
    onRooturlQuery() {
      getRooturl().then(response => {
        this.urlPath = response.data // 访问服务器的根路径，直接放在data属性上。
      })
    },

    onBtnEqpQuery(){
      eqpConfDaily({ mainId: this.eqpMainId, eqpId:this.listQueryEqp.id,eqpName:this.listQueryEqp.name }).then(response => {
        this.transferNoData = response.data.notLinked // 未绑定数据
        this.transferData = response.data.linkedEqp // 已绑定数据
      })
    },

    rightClick(){
      const data = this.$refs.dataTree.getCheckedNodes()
      const req = { mainId: this.equipRowSelected.id, eqps: [] }
      if (data.length == 0) {
        this.$message({ message: '请选择右侧设备', type: 'warning' })
      } else {
        data.forEach(res => {
          req.eqps.push({ 'eqpId': res.k })
        })
        this.updateTransferData(req)
      }
    },
    leftClick(){
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
      eqpConfDailyUpdate(req).then(response => {
        // this.dialogCheckFormVisible = false
        this.handleCheck(this.equipRowSelected)
        this.$message({ message: response.data, type: 'success' })
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
    // input框及下拉框输入值触发查询
    handleFilterChange() {
      this.listQuery.pg_pagenum = 1
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
        id: item.id,
        name: item.name, // 保养类型、枚举
        //type: item.type.toString(), // 保养类型、枚举
        cycleUnit: item.cycleUnit.toString(), // 保养周期单位、枚举
        cycle: item.cycle, // 保养周期
        adReminderDate: item.adReminderDate, // 保养提前提示期
        cycleType: item.cycleType.toString(), //周期保养类型
        safetyMeasure: item.safetyMeasure //安全措施
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
        name: '', // 保养类型、枚举
        type: '1', // 保养类型、枚举
        cycleUnit: '0', // 保养周期单位、枚举
        cycle: 0, // 保养周期
        adReminderDate: 0, // 保养提前提示期
        cycleType: '2', //周期保养类型
        safetyMeasure:'' //安全措施
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
          req.type = parseInt(req.type)
          req.cycleUnit = parseInt(req.cycleUnit)
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
      expandedRows.forEach(item =>{
        if(item.id == row.id){
          checkInt ++
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
      this.vItemloading = true
      getItemConfList({mainId: row.id}).then(response => {
        this.vItemloading = false
        const index = this.tableData.findIndex(data => data.id === row.id) // 首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
        if (!identifier) {
          this.tableData[index].dicts = response.data
           // 这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
        }
      })
    },
    // 新增保养规则
    handleItemAddDict(item) {
      this.listItemUpdate = { // 点检项
        id: '',
        mtcId: item.id,
        step: 1,
        name: '',
        description: '',
        needPhoto:'1',
        needText:'0',
        type:item.cycleType.toString()
      }
      this.dialogItemFormVisible = true
      this.dialogStatus = 'create'
    },
    handleItemUpdateDict(item, row) {
      this.listItemUpdate = JSON.parse(JSON.stringify(row))
      this.listItemUpdate.needPhoto = row.needPhoto.toString()
      this.listItemUpdate.needText = row.needText.toString()
      this.listItemUpdate.type = item.cycleType.toString()
      this.dialogItemFormVisible = true
      this.dialogStatus = 'update'
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
          this.dialogItemFormVisible = false
          const req = { ...this.listItemUpdate }
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
    // 点击查看
    handleCheck(row) {
      this.equipRowSelected = row // 选中哪条数据
      if(row.cycleType == 2){
        let selectedData = {
          mainId:row.id,
          typeOfDialog:'maintain'
        }
        this.$refs.EquipBoundDialog.initData(selectedData)
      }else{
        this.dialogCheckFormVisible = true
        this.$nextTick(() => {
          this.$refs.equipAction.onQuery()
        })
      }

    },
    changeFile(e, row) {
      let file = e.target.files[0]
      let param = new FormData()  // 创建form对象
      param.append('file', file)  // 通过append向form对象添加数据
      param.append('appid', 'mesupload') // 添加form表单中其他数据
      // 上传图标
      getSingleUpload(param).then(response => {
        // 点检项图示更新
        getPicUpdate({ k: row.id, v: response.path}).then(responseUp => {
          this.$message({ message: '更新成功', type: 'success' })
          this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
        })
      })
    },
    onExport() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/mtcqr'
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
        importMtc(file).then(res=>{
          if (res.err_code === 10000) {
              this.$message.success("上传成功！");
              this.handleClose();
          } else this.$message.error("上传失败"+res.err_msg)
        })
      } else {
        this.$message.error("请选取一个文件！");
      }
    },
    generateMaintainTask(){
      genMaintainTask().then(response => {
        this.$message({ message: response.data, type: 'success' })
      })
    },
    handleClose() {
      this.fileList = [];
      this.onBtnQuery();
      this.uploadDialogVisible = false;
    },
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
.el-dialog__body{
  padding-top: 5px;
}
</style>
