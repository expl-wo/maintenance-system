<template>
  <div class="app-container app-containerC">

     <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="快速查询："  size="small" v-if="needShow">
          <el-input v-model="listQuery.repairManName" placeholder="维修人" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item label="设备："  size="small" v-if="needShow">
          <el-input v-model="listQuery.eqpName" placeholder="设备名称/设备ID" style="width: 180px;" class="filter-item"  size="small" clearable/>
        </el-form-item>
        <el-form-item label="时间:"  size="small" prop="dateCount">
          <el-date-picker v-model="listQuery.dateGroup" @change="dateChange" style="width: 240px;" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="设备使用部门"  size="small" v-if="needShow">
          <el-select v-model="listQuery.usingDepId"  size="small" placeholder="使用部门" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in usingDepData" :key="items.k" :label="items.v" :value="items.k" />
          </el-select>
        </el-form-item>
        <el-form-item label="维修状态"  size="small">
          <el-select v-model="listQuery.status"  size="small" placeholder="维修状态" style="width: 120px;" filterable default-first-option>
            <el-option v-for="items in orderStatus" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item  size="small">
          <el-button type="primary" icon="el-icon-download" @click="onExport()">结果导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <table-simple
      class="otherCon wp"
      :data="tableData"
      :row-header="rowHeader"
      :total="total"
      :page="listQuery.pg_pagenum"
      :limit="listQuery.pg_pagesize"
      :eId="tabRid4Exp"
      @pagination="getList"
    />

    <!--查看备件-->
    <el-dialog draggable :close-on-click-modal="false" title="查看备件"  v-model="dialogTablePcVisible" class="roleDialog800">
<!--      <table-simple
        :heightTable="heightTable"
        :data="tablePcData"
        :row-header="rowPcHeader"
        :total="totalPc"
        :page="listSpQuery.pg_pagenum"
        :limit="listSpQuery.pg_pagesize"
        @pagination="getPcList"
      /> -->
      <UseRecord ref="useRecord"></UseRecord>
      <div   class="dialog-footer">
        <el-button @click="dialogTablePcVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>
    <!--查看等待原因-->
    <el-dialog draggable :close-on-click-modal="false" title="等待记录"  v-model="dialogTableWaiting" class="roleDialog800">
      <table-simple
        :heightTable="heightTable"
        :data="waitTableData"
        :row-header="waitRowHeader"
        :total="totalWait"
        :page="listWaitQuery.pg_pagenum"
        :limit="listWaitQuery.pg_pagesize"
        @pagination="getWaitList"
      />
      <div   class="dialog-footer">
        <el-button @click="dialogTableWaiting = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog draggable :close-on-click-modal="false" :title="pictureTitle"  v-model="dialogPicturePcVisible" class="roleDialog800">
      <el-image v-for="(src, index) in pictureArray" :key="index" :src="src" style="width: 180px;height: 135px;"  fit="contain" :preview-src-list="pictureArray"></el-image>
      <div   class="dialog-footer">
        <el-button @click="dialogPicturePcVisible = false"  size="small">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
import TableSimple from '@/components/Table/index'
import { $randomId } from '@/utils/common.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import UseRecord from "@/views/em/emRepair/emRepair_001_basicData_children/spartPartsUseRecord"
// 设备维修记录查询,设备维修使用备件记录查询
import { getEqpRepairRecList, getRepSpList ,getRepPicture,getRepWaitRec} from '@/api/em/eqpRepair'
import { $rooturl ,$deepCopy,timeTranslate} from '@/utils/common.js'
import { finEqpDep } from '@/api/em/eqpLedger'
import { ElButton,ElButtonGroup} from "element-plus";

export default {
  name: 'Table',
  components: { TableSimple,UseRecord },
  props: {
    eqpId: {
      required: false,
      type: String
    },
    needShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        repairManName:'',
        eqpName: '',
        strDate: '', // 开始查询日期 yyyy-MM-dd
        endDate: '', // 截止查询日期 yyyy-MM-dd
        dateGroup: [],
        usingDepId:null,
        status:null
      },
      listSpQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        orderNum: '' // 查询的维修记录维修单号
      },
      tableData: [], // 角色分类列表表格数据
      rowHeader: [],
      formLabelWidth: '120px',
      heightTable: '300px', // 查看备件弹窗表格高度
      tablePcData: [], // 备件表格
      rowPcHeader: [], // 备件表头
      totalPc: 0, // 备件条数
      dialogTablePcVisible: false, // 查看备件弹窗显示隐藏
      dialogPicturePcVisible: false, // 查看照片弹窗显示隐藏
      rooturl: '', // 路径
      pictureTitle:'',//照片显示标题
      pictureArray:[],//照片数组
      tabRid4Exp:'',
      dialogTableWaiting:false,
      listWaitQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        id: '' // 查询的维修记录id
      },
      waitTableData: [], // 等待数据
      waitRowHeader: [],// 等待表头
      totalWait:0,
      usingDepData:[],
      orderStatus:[
        {
          name:'报修（未响应）',
          id:0
        },
        {
          name:'响应检测中',
          id:1
        },
        {
          name:'待二次维修',
          id:2
        },
        {
          name:'维修中',
          id:3
        },
        {
          name:'等待中',
          id:4
        },
        {
          name:'维修完成',
          id:5
        },
        {
          name:'维修已确认',
          id:6
        },
        {
          name: "全部",
          id:-1
        }
      ],
    }
  },
  mounted() {
    this.listQuery.eqpName = this.eqpId
    this.tabRid4Exp=$randomId();
    $rooturl().then(response =>{
      this.rooturl = response.data
    });
    this.onload()
    console.log(this.tabRid4Exp)
    this.onWaitHeader();
    this.getEqpDpt()
  },
  methods: {
    onload() {
      const self = this
      self.rowHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'orderNum',
          align: 'center',
          label: '维修单号'
        },
        {
          prop: 'eqpName',
          align: 'center',
          label: '设备名称'
        },
        {
          prop: 'eqpId',
          align: 'center',
          label: '设备ID'
        },
        {
          prop: 'usingDepName',
          align: 'center',
          label: '设备使用部门'
        },
        {
          prop: 'triggerPerName',
          align: 'center',
          label: '触发人姓名'
        },
        {
          prop: 'triggerTime',
          align: 'center',
          label: '报修时间'
        },
        {
          prop: 'currentStatus',
          align: 'center',
          label: '维修单状态',
          render: (h, params) => {
            var statusHtml = ''
            switch (params.row.currentStatus) {
              case 0:
                statusHtml = '报修（未响应）'
                break
              case 1:
                statusHtml = '响应检测中'
                 break
              case 2:
                statusHtml = '待二次维修'
                 break
              case 3:
                statusHtml = '维修中'
                break
              case 4:
                statusHtml = '等待中'
                break
              case 5:
                statusHtml = '维修完成'
                break
              case 6:
                statusHtml = '维修已确认'
                break
            }
            return h('div', [
              statusHtml
            ])
          }
        },
        {
          prop: 'respTime',
          align: 'center',
          label: '响应时间'
        },
        {
          prop: 'respDuration',
          align: 'center',
          label: '响应总时长(分钟)'
        },
        {
          prop: 'respPerName',
          align: 'center',
          label: '响应人姓名'
        },
        {
          prop: 'repairTime',
          align: 'center',
          label: '维修开始时间'
        },
        {
          prop: 'phenomenon',
          align: 'center',
          label: '故障现象及部位'
        },
        {
          prop: 'phenomenon',
          align: 'center',
          label: '故障现象照片',
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'text', size: 'small',
                on: {
                 onClick: function() {
                    self.pictureTitle='故障现象照片';
                    self.dialogPicturePcVisible = true
                    self.getPicArr({'id':params.row.id,'type':0})
                  }
                }
              }, '查看')

            ])
          }
        },
        {
          align: 'center',
          label: '等待记录',
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'text', size: 'small',
                on: {
                 onClick: function() {
                    self.dialogTableWaiting = true;
                    self.listWaitQuery.id=params.row.id;
                    self.onWaitQuery();
                  }
                }
              }, '查看')

            ])
          }
        },
        {
          prop: 'completionTime',
          align: 'center',
          label: '维修完成时间'
        },
        {
          prop: 'duration',
          align: 'center',
          label: '维修总时长(分钟)'
        },
        
        // {
        //   prop: 'allRepairMan',
        //   align: 'center',
        //   label: '维修人',
        //   render: (h, params) => {
        //     let names='';
        //     params.row.allRepairMan.forEach(item=>{
        //       names+=(item.repairManName+',');
        //     })
        //     if (names.length>0){
        //       names=names.substring(0,names.length-1);
        //     }
        //     return h('span', names)
        //   }
        // },
        {
          prop: 'repairManName',
          align: 'center',
          label: '维修人'
        },
        {
          prop: 'confirmerName',
          align: 'center',
          label: '维修确认人'
        },
        {
          prop: 'analysisDesc',
          align: 'center',
          label: '维修过程分析描述'
        },
        {
          prop: 'phenomenon',
          align: 'center',
          label: '维修完成照片',
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'text', size: 'small',
                on: {
                 onClick: function() {
                    self.pictureTitle='维修完成照片';
                    self.dialogPicturePcVisible = true
                    self.getPicArr({'id':params.row.id,'type':1})
                  }
                }
              }, '查看')

            ])
          }
        },
        {
          prop: 'faultCate',
          align: 'center',
          label: '故障类别名称'
        },
        {
          prop: 'faultFactor',
          align: 'center',
          label: '故障因素名称'
        },
		{
		  prop: 'evaluate',
		  align: 'center',
		  label: '维修评价'
		},
		{
		  prop: 'status',
		  align: 'center',
		  label: '设备维修后状态',
		  render: (h, params) => {
		    var statusHtml = ''
		    switch (params.row.status) {
		      case 0:
		        statusHtml = '没修复'
		        break
		      case 1:
		        statusHtml = '已修复'
		         break
		    }
		    return h('div', [
		      statusHtml
		    ])
		  }
		},
		{
		  prop: 'isClear',
		  align: 'center',
		  label: '维修现场是否清理',
		  render: (h, params) => {
		    var statusHtml = ''
		    switch (params.row.isClear) {
		      case 0:
		        statusHtml = '否'
		        break
		      case 1:
		        statusHtml = '是'
		         break
		    }
		    return h('div', [
		      statusHtml
		    ])
		  }
		},
        {
          prop: 'name',
          align: 'center',
          label: '查看备件使用',
          fixed: 'right',
          render: (h, params) => {
            return h(ElButtonGroup, ()=>[
              h(ElButton, {
                type: 'text', size: 'small',
                // style: { marginRight: '0px' },
                on: {
                 onClick: function() {
                    self.dialogTablePcVisible = true
                    self.showUseRecord(params.row.orderNum)
                    // self.listSpQuery = { // 查询条件
                    //   pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
                    //   pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
                    //   orderNum: =() // 查询的维修记录维修单号
                    // }
                    // getRepSpList(self.listSpQuery).then(res =>{
                    //   // console.log("409:",res)
                    //   self.tablePcData = res.data
                    //   self.totalPc = res.total_count
                    // })
                  }
                }
              }, '查看')

            ])
          }
        }
      ]
      self.onPcload() // 备件表头
      self.onQuery() // 查询
    },
    // 备件表头
    onPcload() {
      const self = this
      self.rowPcHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'materialName',
          align: 'center',
          label: '备件名称'
        },
        {
          prop: 'materialCode',
          align: 'center',
          label: '备件编号'
        },
        {
          prop: 'quantity',
          align: 'center',
          label: '使用数量'
        },
        {
          prop: 'unit',
          align: 'center',
          label: '单位'
        },
        {
          prop: 'repairNum',
          align: 'center',
          label: '维修单号'
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
      getEqpRepairRecList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
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
    getPcList(val) {
      this.listPcQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listPcQuery.pg_pagesize = val.limit
      }
      this.onPcQuery() // 查询
    },
    getPicArr(params){
      this.pictureArray.length=0;
      let self=this;
      getRepPicture(params).then(res =>{
        if (res.data==null)return ;
        res.data.forEach(src=>{
          self.pictureArray.push(self.rooturl+src.picPath);
        })
      })
    },
    showUseRecord(e){
      this.$nextTick( ()=>{
        this.$refs.useRecord.init(e)
      })
    },
    exportExcel(tableId,fileName) {
      let tempHead=$deepCopy(this.rowHeader);
      this.rowHeader.forEach(item=>{
        delete(item.fixed);
      })
      let self=this;
      this.tableData = []
      getEqpRepairRecList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
        setTimeout(function(){
          let xlsxParam = { raw: true }; //转换成excel时，使用原始的格式
          // / generate workbook object from table /;
          /* 从表生成工作簿对象 */
          let wb = XLSX.utils.table_to_book(
            document.querySelector("#"+tableId),  //elementui 表格的id
            xlsxParam
          );

          /* 获取二进制字符串作为输出 */
          var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
          });
          try {
            FileSaver.saveAs(
              //Blob 对象表示一个不可变、原始数据的类文件对象。
              //Blob 表示的不一定是JavaScript原生格式的数据。
              //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
              //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
              new Blob([wbout], { type: "application/octet-stream" }),
              //设置导出文件名称
              fileName+".xlsx"
            );
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
          self.rowHeader=tempHead
          self.onQuery();
          return wbout;
        },100)//数据渲染延迟
      })
    },
    dateChange(event) {
      if(event) {
        this.listQuery.strDate = timeTranslate(this.listQuery.dateGroup[0]) // 开始日期
        this.listQuery.endDate = timeTranslate(this.listQuery.dateGroup[1]) // 结束日期
      }else{
        this.listQuery.strDate = '' // 开始日期
        this.listQuery.endDate = '' // 结束日期
      }
      this.onQuery()
    },
    // 等待表头
    onWaitHeader() {
      this.waitRowHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 50,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'waitStr',
          align: 'center',
          label: '等待开始时间'
        },
        {
          prop: 'waitEnd',
          align: 'center',
          label: '等待结束时间'
        },
        {
          prop: 'waitReason',
          align: 'center',
          label: '等待原因'
        },
        {
          prop: 'waitDuratin',
          align: 'center',
          label: '等待时长（分钟）'
        }
      ]
    },
    getWaitList(val) {
      this.listWaitQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listWaitQuery.pg_pagesize = val.limit
      }
      this.onWaitQuery() // 查询
    },
    onWaitQuery(){
      this.waitTableData = []
      getRepWaitRec(this.listWaitQuery).then(response => {
        this.waitTableData = response.data
        this.totalWait = response.total_count
      })
    },
    getEqpDpt() {
      finEqpDep().then(res=>{
        this.usingDepData = res.data
      })
    },
    onExport() {
      window.location.href = `${process.env.VUE_APP_BASE_API}` + '/endpoint/qrcodeexcel/checkrc'
    },
  }
}
</script>

<style scoped>
</style>
