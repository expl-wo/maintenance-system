<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="设备分类"  size="small">
          <el-select v-model="listQuery.eqpClazz"  size="small" placeholder="设备分类" style="width: 120px;" filterable default-first-option>
            <el-option v-for="(items,index) in eqCateData" :key="index" :label="items.ecName" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称"  size="small">
          <el-input v-model="listQuery.name" placeholder="设备名称" style="width: 180px;" class="filter-item"  size="small" clearable />
        </el-form-item>
        <el-form-item label="设备编号"  size="small">
          <el-input v-model="listQuery.number" placeholder="设备编号" style="width: 180px;" class="filter-item"  size="small" clearable />
        </el-form-item>
        <el-form-item label="使用部门"  size="small">
          <el-select v-model="listQuery.usingDepId"  size="small" placeholder="使用部门" clearable style="width: 120px;" filterable default-first-option>
            <el-option v-for="(items) in usingDepData" :key="items.k" :label="items.v" :value="items.k" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否限制部门"  size="small">
          <el-select v-model="listQuery.isLimit"  size="small" style="width: 120px;" filterable default-first-option>
            <el-option v-for="(items) in options" :key="items.value " :label="items.label" :value="items.value" />
          </el-select>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onExport"><svg-icon icon-class="qrcode" /> 导出</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="setWorkTime">设置工作时间</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onConfirmResponser">确定责任人</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" @click="onConfirmResponser2">确定保养责任人</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Printer" @click="handlePrint()">二维码打印</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Upload" @click="uploadDialogVisible = true">责任人导入</el-button>
        </el-form-item>
      </el-form>
    </div>

    <table-check-all
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      :check-all-fun="checkAllFun"
      :show-check-fun="showFun"
      :checkbox-change="checkboxChange"
      @pagination="getList"
      @changeUploadFile="changeUploadFile"
    />

    <!--弹窗新增或修改角色定义-->
    <el-dialog draggable :close-on-click-modal="false" :title="textMap[dialogStatus]"  v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="130px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="异常名称:" prop="name" size="small">
          <el-input v-model="listUpdate.name" placeholder="异常名称" style="width: 320px;" class="filter-item" size="small" />
        </el-form-item>
        <el-form-item label="异常描述:" size="small">
          <el-input v-model="listUpdate.description" placeholder="异常描述" style="width: 320px;" class="filter-item" size="small" />
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData('listUpdate', '添加成功'):updateData('listUpdate', '修改成功')">
          保存
        </el-button>
      </div>
    </el-dialog>

    <!--查看二维码-->
    <el-dialog draggable :close-on-click-modal="false" title="查看二维码"  v-model="dialogQRCodeFormVisible" class="roleDialog">
      <el-card shadow="hover" class="wp qrcode app-containerC cc">
        <div id="qrcode" class="wp hp" />
      </el-card>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogQRCodeFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--查看文件或图片-->
   <el-dialog draggable :close-on-click-modal="false" title="查看"  v-model="dialogFileFormVisible" class="roleDialog">
     <span style = "width: 150px">
       <el-button style="margin-left: -20px;"  size="small" type="primary" icon="Plus" class="el-icon-upload" ></el-button>
       <input name="file" type="file" class="fileCls"  @change="changeUploadFile($event, scope.row)"/>
     </span>

      <table-simple
        :height-table="heightTable"
        :data="tableFileData"
        :row-header="roweFileHeader"
        :total="totalFile"
        :hide-page="true"
      />
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogFileFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--设备备件信息-->
    <el-dialog draggable title="设备备件查看"  v-model="dialogSparePartsFormVisible"  width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <spareParts ref="child"></spareParts>
      <div   class="dialog-footer">
        <el-button  size="small" @click="dialogSparePartsFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--工作时间确定-->
    <el-dialog draggable :close-on-click-modal="false" :before-close="onCancelDialog" title="查看"  v-model="dialogWorkTimeFormVisible" class="roleDialog">
      <el-form ref="workRef" label-position="right" label-width="130px" :rules="submitRules" :model="listResponse">
        <el-form-item label="工作时间"  size="small">
          <el-input-number v-model="listResponse.workTime"  :min="0" :max="24"></el-input-number>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="onCancelDialog()">取 消</el-button>
        <el-button type="primary" @click="responseConfirm3()">
          保存
        </el-button>
      </div>
    </el-dialog>


    <!--责任人确定-->
    <el-dialog draggable :close-on-click-modal="false" :before-close="onCancelDialog" title="查看"  v-model="dialogResponserFormVisible" class="roleDialog">
      <el-form ref="listResponse" label-position="right" label-width="130px" :rules="submitRules" :model="listResponse">
        <el-form-item label="责任人:" prop="userName"  size="small">
          <el-input v-model="listResponse.userName" placeholder="" :disabled="true" style="width: 130px;" />
          <el-button type="primary" icon="Plus" @click="choosePeople">请选择人员</el-button>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="onCancelDialog()">取 消</el-button>
        <el-button type="primary" @click="responseConfirm()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <!--责任人确定-->
    <el-dialog draggable :close-on-click-modal="false" :before-close="onCancelDialog" title="查看"  v-model="dialogResponserFormVisible2" class="roleDialog">
      <el-form ref="listResponse" label-position="right" label-width="130px" :rules="submitRules" :model="listResponse">
        <el-form-item label="责任人:" prop="userName"  size="small">
          <el-input v-model="listResponse.userName" placeholder="" :disabled="true" style="width: 130px;" />
          <el-button type="primary" icon="Plus" @click="choosePeople">请选择人员</el-button>
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="onCancelDialog()">取 消</el-button>
        <el-button type="primary" @click="responseConfirm2()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog draggable :close-on-click-modal="false" title="请选择责任人"  v-model="dialogTablePeopleVisible" class="" append-to-body>
      <el-form label-position="right" label-width="110px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy" >
        <el-form-item label="" prop="name"  size="small">
          <el-input v-model="listPeopleQuery.uName" placeholder="员工姓名" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.userId" placeholder="员工编号" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro"  size="small">
          <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门名称" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onPeopleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-tag v-show="owner.ownerNameArray.length > 0" v-for="(item,i) in owner.ownerNameArray" :key="i" closable @close="tagClose(i)">{{ item }}</el-tag>
      <table-simple
        :heightTable="heightTable"
        :data="tablePeopleData"
        :row-header="rowPeoplesHeader"
        :total="totalPeople"
        :page="listPeopleQuery.pg_pagenum"
        :limit="listPeopleQuery.pg_pagesize"
        @pagination="getPeopleList"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogTablePeopleVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="createTablePeopleData()"  size="small">
          确 认
        </el-button>
      </div>
    </el-dialog>

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
              @click="download"
              style="margin-left: 20px;"
              >模板下载
            </el-button>
            <el-button
              size="medium"
              type="success"
              @click="submitUpload"
              style="margin-left: 20px;"
              >上传
            </el-button>
            <div   class="el-upload__tip">只能选取xls/xlsx文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>


  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'
// 设备台账查询、设备文件查询、设备文件删除、设备图片查询、设备图片删除
import {
  getInfoList,
  getEqCateList,
  getPicUpdate,
  responseConfirm,
  getFileUpdate,
  getFileList,
  deleteFile,
  getPicList,
  deletePic,
  importManager,
  finEqpDep,
  setWorkTime,
  equipExport
} from '@/api/em/eqpLedger'
import spareParts from "./equipParamete_childrem/spareParts.vue"
// 单文件上传操作
import { getSingleUpload } from '@/api/endpoint'
import QRCode from 'qrcodejs2'
import { $rooturl, $confirm } from '@/utils/common.js'
import TableCheckAll from '@/components/Table/tableCheckAll'
import { getUser } from '@/api/user'
import { getAndonAbnormalList } from '@/api/andonConfig'
import {
  exportData
} from '@/utils'
import { ElButton,ElButtonGroup,ElImage,ElCheckbox } from "element-plus";
export default {
  name: 'Table',
  components: { TableSimple, TableCheckAll,spareParts },
  data() {
    return {
      eqCateData: [], // 工序计划下拉列表
      heightTable: '300px',
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加'
      },
      checkboxData: [], // 表格选中哪条
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        eqpClazz: '', // 设备分类
        name: '', // 模糊匹配，设备名称
        number: '', // 设备编号
        isLimit: true,
        usingDepId: null
      },
      listUpdate: { // 弹窗
        description: '', // 模糊匹配，故障分类描述
        name: '' // 模糊匹配，故障分类名称
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      // 检验规则
      submitRules: {
        name: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        userName: [{ required: true, trigger: 'change', message: '该项为必填项' }],
        abnormalId: [{ required: true, trigger: 'change', message: '该项为必填项' }],
        cateId: [{ required: true, trigger: 'change', message: '该项为必填项' }],
        workTime: [
          { type:'number', required: true, trigger: 'change', message: '该项为必填项' },
          { min: 1, max: 24, message: '大小在1到24之间' }
        ],
      },
      dialogQRCodeFormVisible: false, // 二维码
      rooturl: '', // 路径
      dialogFileFormVisible: false, // 文件
      dialogWorkTimeFormVisible: false,
      dialogResponserFormVisible: false, // 责任人
      dialogResponserFormVisible2: false, // 责任人
      tableFileData: [],
      roweFileHeader: [],
      dialogSparePartsFormVisible:false,
      totalFile: 0,
      previewList: [],
      currentRow: {}, // 临时保存当前行ID
      listResponse: {
        eqps: [],
        type: null,
        userName: '',
        workTime: 1,
      },
      dialogTablePeopleVisible: false, // 人员表格显示隐藏
      listTablePeopleUpdate: {
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        name: '' // 姓名
      },
      tablePeopleData: [], // 人员表格内容
      totalPeople: 0, // 人员表格数量
      rowTablePeopleHeader: [], // 人员表格标题
      checkedData: {},
      cateName: '设备点检异常',
      abnormalName: [],
      abnormalSub: [],
      abnormalSubItem: {},
      options:[
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      uploadDialogVisible: false,
      fileList: [],
      usingDepData:[],
      listPeopleQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        uName: '', // 模糊匹配，用户姓名
        userId: '', // 模糊匹配，员工编号
        gsbmName: '', // 模糊匹配，归属部门名称
      },
      rowPeoplesHeader:[],
      owner: {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
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
    onload() {
      const self = this
      self.rowHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'check',
          width: 50,
          align: 'center',
          type: 'selection'
        },
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'name',
          align: 'center',
          label: '设备名称及型号规格',
          width: 150
        },
        {
          prop: 'number',
          align: 'center',
          label: '设备编号'
        },
        // {
        //   prop: 'model',
        //   align: 'center',
        //   label: '型号规格'
        // },
        {
          prop: 'manufactor',
          align: 'center',
          label: '制造厂家'
        },
        {
          prop: 'clazzName',
          align: 'center',
          label: '设备分类'
        },
        {
          prop: 'levelName',
          align: 'center',
          label: '设备等级'
        },
        {
          prop: 'purchaseDate',
          align: 'center',
          label: '购买年月'
        },
        {
          prop: 'enableDate',
          align: 'center',
          label: '启用年月'
        },
        {
          prop: 'assetNumber',
          align: 'center',
          label: 'ERP编号'
        },
        {
          prop: 'managerName',
          align: 'center',
          label: '责任人'
        },
        {
          prop: 'maintainPerson',
          align: 'center',
          label: '保养责任人'
        },
        {
          prop: '',
          align: 'center',
          label: '查看',
          width: 180,
          render: (h, params) => {
            return h(ElButtonGroup, () => [
              h(ElButton, {
                link : true,type: 'primary', size: 'small',
                onClick: function() {
                  self.dialogQRCodeFormVisible = true
                  self.$nextTick(function() {
                    document.getElementById('qrcode').innerHTML = ''
                    const qrcode = new QRCode('qrcode', {
                      width: 300,
                      height: 300,
                      text: params.row.id,
                      colorDark: '#000000', // 前景色
                      colorLight: '#ffffff', // 背景色
                      correctLevel: QRCode.CorrectLevel.H// 降低容错级别
                    })
                  })
                }
              }, () => '二维码'),
              h(ElButton, {
                 link : true,type: 'primary', size: 'small',
                 onClick: function() {
                    self.onFileload()
                    self.onFileQuery(params.row)
                    self.dialogFileFormVisible = true
                 }

              },() => '技术文件'),
              h(ElButton, {
                 link : true,type: 'primary', size: 'small',
                 onClick: function() {
                    self.onPictureload()
                    self.onPictureQuery(params.row)
                    self.dialogFileFormVisible = true
                 }
              },() => '图片'),
              h(ElButton, {
                link : true,type: 'primary', size: 'small',
                onClick: function() {
                  self.onDetailQuery(params.row)
                }
              },() => '运维记录'),
              h(ElButton, {
                link : true,type: 'primary', size: 'small',
                 onClick: function() {
                    self.dialogSparePartsFormVisible = true
                    self.onSparePart(params.row)
                  }

              },() => '备件')]
            )
          }
        },
        {
          prop: 'upload',
          align: 'center',
          label: '上传',
          width: 75
        },
        {
          prop: 'usingDepId',
          align: 'center',
          label: '使用部门'
        },
        {
          prop: 'installSite',
          align: 'center',
          label: '安装地点'
        },
        {
          prop: 'status',
          align: 'center',
          label: '使用状态',
          render: (h, params) => {
            var statusHtml = ''
            switch (params.row.status) {
              case 1:
                statusHtml = '在用'
                break
              case 2:
                statusHtml = '已转卖'
                break
              case 3:
                statusHtml = '封存'
                break
              case 4:
                statusHtml = '报废'
                break
            }
            return h('div' , [
              statusHtml
            ])
          }
        },
        {
          prop: 'remark',
          align: 'center',
          label: '备注'
        },
        {
          prop: 'workTime',
          align: 'center',
          label: '工作时间'
        }
      ]
      self.onQuery() // 查询
      self.onEqCateQuery()
      self.getEqpDpt()
    },
    onSparePart(row){
      this.$nextTick(()=>{
        this.$refs.child.init({
          eqpId:row.id,
          eqpName:row.name,
          usingDep:row.usingDepId
        });
      })
    },
    // 按时间倒序分页查询工序计划列表的简单信息，主用于在下拉列表中显示
    onEqCateQuery() {
      this.eqCateData = [{ 'id': '', 'ecName': '全部' }]
      getEqCateList().then(response => {
        response.data.forEach((dd) => {
          this.eqCateData.push(dd)
        })
        this.eqCateData.push({ 'id': '-1', 'ecName': '未分类' })
      })
    },
    onFileload() {
      const self = this
      self.roweFileHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'fileName',
          align: 'center',
          label: '文件名称'
        },
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 120,
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'primary', size: 'small',

                 onClick: function() {
                    window.location.href = self.rooturl + params.row.filePath
                  }

              },()=> '查看'),
              h(ElButton,  {
                type: 'danger', size: 'small', icon: "Delete",

                 onClick: function() {
                    $confirm('确定删除, 是否继续?', '取消').then(response => {
                      deleteFile({ id: params.row.id }).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onFileQuery(self.currentRow)
                      })
                    })
                  }

              }, ()=> '')

            ])
          }
        }
      ]
    },
    onPictureload() {
      this.previewList = []
      const self = this
      self.roweFileHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'picPath',
          align: 'center',
          label: '图片',
          render: (h, params) => {
            return h(ElImage, {
              style: 'width: auto; height: 50px',
              src: params.row.picPath, previewSrcList: [params.row.picPath],
              previewTeleported:true
            })
          }
        },
        {
          prop: 'picDesc',
          align: 'center',
          label: '图片描述'
        },
        {
          prop: '',
          align: 'center',
          label: '操作',
          width: 80,
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'danger', size: 'small', icon: "Delete",

                 onClick: function() {
                    $confirm('确定删除, 是否继续?', '取消').then(response => {
                      deletePic({ id: params.row.id }).then(response => {
                        self.$message({ message: '删除成功', type: 'success' })
                        self.onPictureQuery(self.currentRow)
                      })
                    })
                  }

              },()=> '')

            ])
          }
        }
      ]
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.onQuery()
    },
    // 查询
    onQuery() {
      this.tableData = []
      getInfoList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
      })
      this.checkboxData = []
    },
    onDetailQuery(row){
      console.log(row)
      this.$router.push({
        name: "030102_equipDetail",
        query: {row: JSON.stringify(row)},
      });
    },
    onFileQuery(row) {
      this.currentRow = row
      this.tableFileData = []
      getFileList({ id: row.id }).then(response => {
        this.tableFileData = response.data
      })
    },
    onPictureQuery(row) {
      this.currentRow = row
      this.tableFileData = []
      getPicList({ id: row.id }).then(response => {
        const rData = response.data
        for (let i = 0; i < rData.length; i++) {
          rData[i].picPath = this.rooturl + rData[i].picPath
        }
        this.tableFileData = rData
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
    // 添加 角色新增与编辑的保存操作
    onAdd() {
      this.clearData() // 清空添加的数据
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        description: '', // 模糊匹配，故障分类描述
        name: '' // 模糊匹配，故障分类名称
      }
    },
    // 角色新增保存数据
    createData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    // 角色修改保存数据
    updateData(listUpdate, message) {
      this.saveData(listUpdate, message)
    },
    // 保存
    saveData(listUpdate, message) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          const req = { ...this.listUpdate }
          getFactorUpdate(req).then(response => {
            this.$message({ message: message, type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 上传文档
    changeUploadFile(val) {
      const e = val.e
      const row = val.row
      const file = e.target.files[0]
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      param.append('appid', 'mesupload') // 添加form表单中其他数据
      // 上传图标
      this.$prompt('请输入文件描述：', '上传文件内容描述', { confirmButtonText: '确定',
        inputPattern: /^.{1,}$/,
        closeOnClickModal: false,
        type: 'info' }).then(value => {
        getSingleUpload(param).then(response => {
          const path = response.data.filePath
          const index = path.lastIndexOf('.')
          const pathNew = path.substring(index + 1, path.length).toLowerCase()
          const picname = 'jpeg|jpg|png|bmp|gif|'
          if (picname.indexOf(pathNew) > -1) {
            getPicUpdate({ eqpId: row.id, picPath: path, picDesc: value.value }).then(responseUp => {
              this.$message({ message: '更新成功', type: 'success' })
              this.onQuery()
            })
          } else {
            getFileUpdate({ eqpId: row.id, filePath: path, fileName: value.value }).then(responseUp => {
              this.$message({ message: '更新成功', type: 'success' })
              this.onQuery()
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    onExport() {
      equipExport(this.listQuery).then(res => {
        exportData(res, `设备台账数据.xls`)
      })
    },
    checkAllFun(checkAllVal) {
      if (checkAllVal && checkAllVal.length > 0) {
        this.checkboxData = checkAllVal
      } else {
        this.checkboxData = []
      }
    },
    showFun(order) {
      return true
    },
    // 选中哪条
    checkboxChange(event, item) {
      if (event) {
        this.checkboxData.push(item)
      } else if (item) {
        const items = this.checkboxData
        if (items && items.length > 0) {
          this.checkboxData = []
          items.forEach(oldi => {
            if (item.id !== oldi.id) {
              this.checkboxData.push(oldi)
            }
          })
        }
      }
    },
    setWorkTime(){
      if (this.checkboxData.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择设备'
        })
      } else {
        this.dialogWorkTimeFormVisible = true
      }
    },
    onConfirmResponser() {
      if (this.checkboxData.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择设备'
        })
      } else {
        this.dialogResponserFormVisible = true

      }
    },
    onConfirmResponser2() {
      if (this.checkboxData.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择设备'
        })
      } else {
        this.dialogResponserFormVisible2 = true
      }
    },
    // 选择人员
    choosePeople() {
      this.dialogTablePeopleVisible = true
      this.dialogTableStatus = 'choosePeople'
      this.owner = {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      this.onQueryPeoples() // 查询人员表格
    },
    // 查询人员（表格）
    onPeopleQuery() {
      this.tablePeopleData = []
      getUser(this.listPeopleQuery).then(response => {
        this.tablePeopleData = response.data
        this.totalPeople = response.total_count
      })
    },
    getPeopleList(val) {
      this.listTablePeopleUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listTablePeopleUpdate.pg_pagesize = val.limit
      }
      this.onPeopleQuery() // 查询
    },
    // 确认选择的人员
    createTablePeopleData() {
      if (this.owner.ownerIdArray.length === 0) {
        this.$message({ type: 'warning', message: '请选择人员!' })
      } else {
        this.listResponse.userName = this.owner.ownerNameArray.join(',')
        this.dialogTablePeopleVisible = false
      }
    },
    rowClick(row) {
      this.checkedData = row
    },
    responseConfirm() {
      if(this.owner.ownerIdArray.length === 0){
        this.$message({
          type: 'warning', message: '请选择责任人!'
        })
      } else {
        this.listResponse.eqps = []
        this.listResponse.type = 0
        this.checkboxData.forEach(item => {
          this.owner.ownerIdArray.forEach(owner =>{
            const eqp = { eqpId: item.id, eqpName: item.name, managerId: owner }
            this.listResponse.eqps.push(eqp)
          })
        })
        responseConfirm(this.listResponse).then(response => {
          this.$message({ type: 'success', message: '确认责任人成功' })
          this.dialogResponserFormVisible = false
          this.onQuery()
          this.listResponse = { eqps: [],type:null, userName: '',workTime:null}
          this.checkboxData = []
        })
      }
    },
    responseConfirm2() {
      if(this.owner.ownerIdArray.length === 0){
        this.$message({
          type: 'warning', message: '请选择保养责任人!'
        })
      } else {
        this.listResponse.eqps = []
        this.listResponse.type = 1
        this.checkboxData.forEach(item => {
          this.owner.ownerIdArray.forEach(owner =>{
            const eqp = { eqpId: item.id, eqpName: item.name, managerId: owner }
            this.listResponse.eqps.push(eqp)
          })
        })
        responseConfirm(this.listResponse).then(response => {
          this.$message({ type: 'success', message: '确认责任人成功' })
          this.dialogResponserFormVisible2 = false
          this.onQuery()
          this.listResponse = { eqps: [],type:null, userName: '',workTime:null}
          this.checkboxData = []
        })
      }
    },
    responseConfirm3() {
      this.$refs.workRef.validate( (valid) =>{
        if(this.listResponse.workTime == null || this.listResponse.workTime == ''){
          this.$message({
            type: 'warning', message: '请填写工作时间!'
          })
        } else {
          var ids = []
          this.checkboxData.forEach(item =>{
            ids.push(item.id)
          })

          setWorkTime({eqpIds: ids, workTime: this.listResponse.workTime}).then(response => {
            this.$message({ type: 'success', message: '设置工作时间成功' })
            this.dialogWorkTimeFormVisible = false
            this.onQuery()
            this.listResponse = { eqps: [],type:null, userName: '',workTime:null}
            this.checkboxData = []
          })
        }
      })

    },
    onCancelDialog() {
      this.dialogResponserFormVisible = false
      this.dialogResponserFormVisible2 = false
      this.dialogWorkTimeFormVisible = false
      this.onQuery()
    },
    handlePrint() {
      if (this.checkboxData.length < 1) {
        this.$message.error("请选择要打印的数据");
      } else {
        this.$router.push({
          name: "030103_equipPrint",
          query: { row: JSON.stringify(this.checkboxData) },
        });
      }
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
        importManager(file).then(res=>{
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
    download(){
      window.location.href = "http://10.16.9.107/reso_mes/设备责任人.xlsx"
    },
    getEqpDpt() {
      finEqpDep().then(res=>{
        this.usingDepData = res.data
      })
    },
    onQueryPeoples() {
      const self = this
      self.rowPeoplesHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 80,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'uName',
          align: 'center',
          label: '员工姓名'
        },
        {
          prop: 'userId',
          align: 'center',
          label: '员工编号'
        },
        {
          prop: 'gsbmName',
          align: 'center',
          label: '归属部门名称'
        },
        // 添加操作按钮
        {
          prop: '',
          label: '操作',
          width: 110,
          align: 'center',
          render: (h, params) => {
            const ownerIdArray = self.owner.ownerIdArray
            var ownerIdChecked = false
            if (ownerIdArray.indexOf(params.row.id) !== -1) {
              ownerIdChecked = true
            }
            return h('div', [
              h(ElCheckbox, {
                type: 'primary', size: 'small', checked: ownerIdChecked,
                onChange: function(event) {
                  // 选中
                  if (event) {
                    self.owner.ownerIdArray.push(params.row.id)
                    self.owner.ownerNameArray.push(params.row.uName)
                  } else {
                    for (var i = 0; i < self.owner.ownerIdArray.length; i++) {
                      if (self.owner.ownerIdArray[i] === params.row.id) {
                        self.owner.ownerIdArray.splice(i, 1)
                        self.owner.ownerNameArray.splice(i, 1)
                      }
                    }
                  }
                }

              },()=> '')
            ])
          }
        }
      ]
    },
    tagClose(i){
      this.owner.ownerIdArray.splice(i,1);
      this.owner.ownerNameArray.splice(i,1);
      this.onPeopleQuery();
      return true;
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
.fileCls {
  height: 26px;
  width: 30px;
  position: absolute;
  filter: alpha(opacity = 0);
 -moz-opacity: 0;
  opacity: 0;
  z-index: 110;
  cursor: pointer;
  float: left;
  /* margin-top: -26px; */
  position: relative;
  left: 10px;
}

</style>
