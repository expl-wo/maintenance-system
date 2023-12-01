<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form ref="listQuery" :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="提报人/响应人/编号" size="mini" prop="keyWord">
          <el-input v-model="listQuery.keyWord" placeholder="" style="width: 180px;" class="filter-item" size="mini" clearable/>
        </el-form-item>
        <el-form-item label="触发时间:" size="mini" prop="dateCount">
          <el-date-picker
            v-model="listQuery.dateCount"
            style="width: 240px;"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
            @input="e=>{ mmediUpdate(itemF,e) }"
          />
        </el-form-item>
        <el-form-item label="状态：" size="mini">
          <xui-dict-select multiple item-code="andonStatus" includeAll v-model="listQuery.andonStatus"
                           class="filter-item" clearable
          ></xui-dict-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="init()">查询</el-button>
<!--          <el-button type="primary" @click="trigger()">提报安灯</el-button>-->
        </el-form-item>
      </el-form>


    </div>

    <el-dialog v-dialogDrag :close-on-click-modal="false" title="提报安灯" v-model="andonDialogVisible"
               v-if="andonDialogVisible" width="40%">
      <andonDialog @close="triggerClose()" :product-info="productInfo"></andonDialog>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="andonDialogVisible =false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog v-dialogDrag :close-on-click-modal="false" title="提报安灯" v-model="andon"
               v-if="andon" width="40%">
      <el-form ref="model" label-position="right" label-width="90px" :model="andonData">
        <el-form-item label="编号:" size="mini">
          <el-input v-model="andonData.andonNumber" placeholder="编号" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="提报人员:" size="mini">
          <el-input v-model="andonData.triggerName" placeholder="提报人员" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="提报时间:" size="mini">
          <el-input v-model="andonData.triggerDate" placeholder="提报时间" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="生产号:" size="mini">
          <el-input v-model="andonData.productNo" placeholder="生产号" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="问题描述:" size="mini">
          <el-input v-model="andonData.remarks"
                    placeholder="问题描述"
                    disabled style="width: 320px;"
                    class="filter-item"
                    type="textarea"
                    autosize
                    maxlength="300"
                    size="mini" />
        </el-form-item>
        <el-form-item label="处理方案:" size="mini">
            <el-input v-model="andonData.responseDesc"
                      placeholder="处理方案"
                      style="width: 320px;"
                      class="filter-item"
                      size="mini"
                      clearable
                      type="textarea"
                      autosize
                      maxlength="300"
                      show-word-limit/>
        </el-form-item>
        <el-form-item label="" size="mini">
          <el-button style="float: left" type="primary" @click="solve()" size="mini">解决</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-dialogDrag :close-on-click-modal="false" title="转办安灯" v-model="transfer"
               v-if="transfer" width="40%">
      <el-form ref="model" label-position="right" label-width="90px" :model="transferData">
        <el-form-item label="编号:" size="mini">
          <el-input v-model="transferData.andonNumber" placeholder="编号" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="提报人员:" size="mini">
          <el-input v-model="transferData.triggerName" placeholder="提报人员" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="提报时间:" size="mini">
          <el-input v-model="transferData.triggerDate" placeholder="提报时间" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="生产号:" size="mini">
          <el-input v-model="transferData.productNo" placeholder="生产号" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="问题描述:" size="mini">
          <el-input v-model="transferData.remarks"
                    placeholder="问题描述"
                    disabled style="width: 320px;"
                    class="filter-item"
                    type="textarea"
                    autosize
                    maxlength="300"
                    size="mini" />
        </el-form-item>

        <el-form-item label="转办至:" prop="abnormalId" size="mini">
          <el-select v-model="transferData.abnormalId"  placeholder="请选择异常项" filterable @change="queryResponder">
            <el-option
              v-for="item in abnormals"
              :key="item.id"
              :label="item.abnormalName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="响应人:" prop="asResponderId" size="mini">
          <el-select v-model="transferData.asResponderId"  placeholder="响应人" filterable>
            <el-option
              v-for="item in responder"
              :key="item.id"
              :label="item.name "
              :value="item.id"
              @click.native="changeResponder(item)" >
              <span style="float: left">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转办原因:" size="mini">
          <el-input v-model="transferData.responseDesc"
                    placeholder=""
                    style="width: 320px;"
                    class="filter-item"
                    size="mini"
                    clearable
                    type="textarea"
                    autosize
                    maxlength="300"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="" size="mini">
          <el-button style="float: left" type="primary" @click="transferCommit()" size="mini">转办</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-dialogDrag :close-on-click-modal="false" title="转办安灯" v-model="reject"
               v-if="reject" width="40%">
      <el-form ref="model" label-position="right" label-width="90px" :model="rejectData">
        <el-form-item label="编号:" size="mini">
          <el-input v-model="rejectData.andonNumber" placeholder="编号" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="提报时间:" size="mini">
          <el-input v-model="rejectData.triggerDate" placeholder="提报时间" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="生产号:" size="mini">
          <el-input v-model="rejectData.productNo" placeholder="生产号" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="问题描述:" size="mini">
          <el-input v-model="rejectData.remarks"
                    placeholder="问题描述"
                    disabled style="width: 320px;"
                    class="filter-item"
                    type="textarea"
                    autosize
                    maxlength="300"
                    size="mini" />
        </el-form-item>
        <el-form-item label="响应人:" size="mini">
          <el-input v-model="rejectData.responseName" placeholder="响应人" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="处理方案:" size="mini">
          <el-input v-model="rejectData.responseDesc"
                    placeholder="处理方案"
                    disabled style="width: 320px;"
                    class="filter-item"
                    type="textarea"
                    autosize
                    maxlength="300"
                    size="mini" />
        </el-form-item>
        <el-form-item label="驳回理由:" size="mini">
          <el-input v-model="rejectReason"
                    placeholder="驳回理由"
                    style="width: 320px;"
                    class="filter-item"
                    type="textarea"
                    autosize
                    maxlength="300"
                    size="mini" />
        </el-form-item>

        <el-form-item label="" size="mini">
          <el-button style="float: left" type="primary" @click="rejectCommit()" size="mini">驳回</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-table stripe  ref="tableRef"
              :height="'100%'"
              highlight-current-row
              border
              :data="tableData"
              :stripe="true"
              style="font-size: 0.7rem"
              :cell-style="cellStyle"
    >
      <el-table-column
        type="selection"
        :selectable="selectEnable"
        width="40"/>
      <el-table-column
        header-align="center"
        align="center"
        type="index"
        label="序号"
        width="50"
        property="index"
        :index="Nindex"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="编号"
        property="andonNumber"
        width="70"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="分类名称"
        property="cateName"
        width="70"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="异常名称"
        property="abnormalName"
        width="70"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="提报人员"
        property="triggerName"
        width="70"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="提报时间"
        property="triggerDate"
        width="90"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="生产号"
        property="productNo"
        width="120"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="型号"
        property="productModel"
        width="120"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="问题描述"
        property="remarks"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="图片查看"
        property="responseName"
        width="80"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.picCnt > 0"  type="primary" size="mini" @click="getPic(scope.row)"> 查看 </el-button>
          <span v-if="scope.row.picCnt <= 0"> 无图片 </span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="响应人/待响应人"
        property="responseName"
        width="140"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="响应时间"
        property="responseDate"
        width="90"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="响应时长(分钟)"
        property="responseTime"
        width="100"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="解决时间"
        property="solveDate"
        width="90"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="解决时长(分钟)"
        property="solveTime"
        width="100"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="处理方案/转办原因"
        property="responseDesc"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="关闭时间"
        property="closeDate"
        width="90"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="总时长(分钟)"
        property="totalTime"
        width="100"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="状态"
        property="status"
        width="70"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">待响应</span>
          <span v-else-if="scope.row.status === 1">待解决</span>
          <span v-else-if="scope.row.status === 3">待关闭</span>
          <span v-else-if="scope.row.status === 2">已完成</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center" width="110">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-if="scope.row.status === 0 && scope.row.asResponderId == userId" type="primary" size="mini"
                       @click="response(scope.row)">响应
            </el-button>
            <el-button v-if="scope.row.status === 0 && scope.row.asResponderId == userId" type="primary" size="mini"
                       @click="transferDialog(scope.row)">转办
            </el-button>
            <el-button v-if="scope.row.status === 0 && scope.row.asResponderId == userId" type="primary" size="mini"
                       @click="aggsinDialog(scope.row.id)">指派
            </el-button>
            <el-button v-if="scope.row.status === 1 && scope.row.asResponderId == userId" type="primary" size="mini"
                       @click="solveDialog(scope.row)">解决
            </el-button>
            <el-button v-if="(scope.row.status === 0 || scope.row.status === 1) && scope.row.triggerId == userId" type="primary" size="mini"
                       @click="close(scope.row)">直接关闭
            </el-button>
            <el-button v-if="scope.row.status === 3 && scope.row.triggerId == userId" type="primary" size="mini"
                       @click="close(scope.row)">关闭
            </el-button>
            <el-button v-if="scope.row.status === 3 && scope.row.triggerId == userId" type="primary" size="mini"
                       @click="rejectDialog(scope.row)">驳回
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" :page-sizes="[10, 20, 30, 50,100,200]" @pagination="getList" class="searchCon wp"/>


    <!--查看文件或图片-->
    <el-dialog :close-on-click-modal="false" title="查看" v-model="dialogFileFormVisible" class="roleDialog">
      <table-simple
        :height-table="heightTable"
        :data="tableFileData"
        :row-header="roweFileHeader"
        :total="totalFile"
        :hide-page="true"
      />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFileFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--选择人员-->
    <el-dialog  :close-on-click-modal="false" title="选择指派人员" v-model="dialogPeopleFormVisible" class="roleDialog800" >
      <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="" prop="name" size="mini">
          <el-input v-model="listPeopleQuery.searchKey" placeholder="用户姓名/工号" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="btnGetPerson()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table stripe  ref="tableRef"
                :height="'380px'"
                highlight-current-row
                border
                :data="peopleData"
                :stripe="true"
                style="font-size: 0.7rem"
                :cell-style="cellStyle"
      >
        <el-table-column
          header-align="center"
          align="center"
          type="index"
          label="序号"
          width="50"
          property="index"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="姓名"
          property="name"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="电话"
          property="number"
        />
        <el-table-column
          align="center"
          label="操作"
          width="70"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" size="mini"
                         @click="assignCommit(scope.row)">确认
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="peopleTotal" :page="listPeopleQuery.pg_pagenum" :limit="listPeopleQuery.pg_pagesize" :page-sizes="[10, 20, 30, 50,100,200]" @pagination="getPeopleList" class="searchCon wp"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogPeopleFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TableSimple from '@/components/Table/index'
// 所有异常类型,所有安灯状态,安灯问题记录详细信息,查看异常关键点信息,升级提醒记录查询
import {
  getAndonList,responseSave,solveSave,closeSave,getAndonPicture,transferSave, rejectSave, getDepartmentPersons, assignSave
} from '@/api/andonResponse'
import andonDialog from "@/views/andon/andonDialog";
import {timeTranslate } from '@/utils/common'
import formatPlanMixins from "@/views/ps/_public/formatPlanMixins";
import enterSearchMixins from "@/mixins/enterSearchMixins";
import configColumnMixins from "@/views/ps/_public/configColumnMixins";
import Pagination from "@/components/Pagination/index";
import {getAllAndonAbnormalList} from "@/api/andonConfig";
import { getDictListByKey } from "@/components/xui/dictionary";

export default {
  name: 'Table',
  mixins: [formatPlanMixins, enterSearchMixins, configColumnMixins],
  components: { TableSimple,andonDialog,Pagination },
  data() {
    return {
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        keyWord:'',
        andonStatus: [],
        startDate: '', // 触发时间的搜索开始时间
        endDate: '', // 触发时间的搜索结束时间
      },
      tableData:[],
      total:0,
      peopleTotal : 0,
      andonDialogVisible:false,
      andon:false,
      transfer:false,
      reject:false,
      andonData:[],
      transferData:[],
      rejectData:[],
      abnormals:[],
      responder:[],
      productInfo:null,
      dialogFileFormVisible: false, // 图片弹窗
      dialogPeopleFormVisible:false,
      tableFileData: [],
      roweFileHeader: [],
      rejectReason:"",
      totalFile: 0,
      heightTable: '300px',
      listPeopleQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        uName: '', // 模糊匹配，用户姓名
        userid: '', // 模糊匹配，员工编号
        gsbmName: '' // 模糊匹配，归属部门名称
      },
      peopleData:[],
      andonId:"",
    }
  },
  computed: {
    userId: localStorage.getItem('userId')
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    // 勾选框禁用
    selectEnable(row, rowIndex) {
      if (row.id !== null ) {
        return true
      }
    },
    //获取序号
    Nindex(index) {
      // 当前页数 - 1 * 每页数据条数 + 1
      const page = this.listQuery.pg_pagenum // 当前页码
      const pagesize = this.listQuery.pg_pagesize // 每页条数
      return index + 1 + (page - 1) * pagesize
    },
    init(){
      debugger
      // let status = this.listQuery.andonStatus;
      // let intStatus = [];
      // status.forEach(item => {
      //   intStatus.push(parseInt(item));
      // });
      // this.listQuery.andonStatus = intStatus
      console.log('参数列表',this.listQuery)
      getAndonList(this.listQuery).then(res=>{
        this.tableData = res.data
        this.total = res.total_count
      })
    },
    // 提报
    trigger(){
      this.andonDialogVisible = true
    },
    triggerClose(){
      this.andonDialogVisible=false
      this.init()
    },
    // 响应
    response(data){
      let req = {id: data.id}
      responseSave(req).then(res=>{
        this.$message.success("响应成功");
        this.init()
      })
    },
    // 解决
    solveDialog(data){
      this.andonData = data
      this.andon = true
    },
    solve(){
      let tRec = {id:this.andonData.id,responseDesc:this.andonData.responseDesc}
      solveSave({tRec:tRec}).then(res=>{
        this.$message.success("解决成功");
        this.andon = false
        this.init()
      })
    },
    close(data){
      closeSave({id:data.id}).then(res=>{
        this.$message.success("关闭成功");
        this.init()
      })
    },
    // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1
      this.init()
    },
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.init()
    },
    cellStyle({row, column, rowIndex, columnIndex}) {
      // 定义样式变量
      var common = "text-align:center;"

      if(column.property == 'status' && row.status == 0){
        common += "background: #ff9b9b;"
      }else if(column.property == 'status' && row.status == 1){
        common += "background: #ffff00;"
      }else if(column.property == 'status' && row.status == 3){
        common += "background: #00ffff;"
      }else if(column.property == 'status' && row.status == 2){
        common += "background: #7fff00;"
      }
      return common
    },
    getPic(row){
      this.roweFileHeader = [
        // 未做任何格式化处理的数据
        {
          prop: 'index',
          width: 70,
          align: 'center',
          label: '序号'
        },
        {
          prop: 'picPath',
          align: 'center',
          label: '图片',
          render: (h, params) => {
            return h('el-image', {
              style: 'width: 100px; height: 100px',
              props: { src: params.row.picPath, 'preview-src-list': [params.row.picPath] }
            })
          }
        }
      ]
      this.tableFileData = []
      getAndonPicture({ id: row.id }).then(response => {
        const rData = response.data
        for (let i = 0; i < rData.length; i++) {
          rData[i].picPath = 'http://10.16.9.128:9000/' + rData[i].pictureAddr
        }
        this.tableFileData = rData
        this.dialogFileFormVisible = true
      })
    },
    dateChange(event) {
      this.listQuery.startDate = timeTranslate(this.listQuery.dateCount[0]) // 触发时间的搜索开始时间
      this.listQuery.endDate = timeTranslate(this.listQuery.dateCount[1]) // 触发时间的搜索结束时间
      this.handleFilterChange()
    },
    // input框及下拉框输入值触发查询
    handleFilterChange(event) {
      this.listQuery.pg_pagenum = 1
      this.onBtnQuery()// 查询
    },
    mmediUpdate(data, e) {
      if (e == null) {
        this.listQuery.startDate = ""
        this.listQuery.endDate = ""
        this.handleFilterChange()
      }
    },
    transferDialog(row){
      this.transferData = row
      this.transfer = true
      this.queryAbnormal()
    },
    aggsinDialog(id){
      this.andonId = id
      this.dialogPeopleFormVisible = true
      this.btnGetPerson()
    },
    btnGetPerson(){
      this.listPeopleQuery.pg_pagenum = 1
      this.getPersons();
    },
    getPersons(){
      getDepartmentPersons(this.listPeopleQuery).then(res=>{
        this.peopleData = res.data
        this.peopleTotal = res.total_count
      })
    },
    getPeopleList(val){
      this.listPeopleQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listPeopleQuery.pg_pagesize = val.limit
      }
      this.getPersons()
    },
    rejectDialog(row){
      this.rejectData = row
      this.reject = true
    },
    // 根据异常分类查询异常项
    queryAbnormal(){
      getAllAndonAbnormalList({cateId : this.transferData.cateid}).then(res =>{
        this.abnormals = res.data
        this.transferData.abnormalId = res.data[0].id
        this.responder = res.data[0].responders
        this.transferData.asResponderId = this.responder[0].id
        this.transferData.asResponderName = this.responder[0].name
        this.transferData.asResponderTel = this.responder[0].number
      })
    },
    // 根据异常项展示响应人
    queryResponder(){
      this.abnormals.forEach(item => {
        if(item.id == this.transferData.abnormalId){
          this.responder = item.responders
          this.transferData.asResponderId = this.responder[0].id
          this.transferData.asResponderName = this.responder[0].name
          this.transferData.asResponderTel = this.responder[0].number
        }
      })
    },
    // 选择响应人
    changeResponder(item){
      this.transferData.asResponderId = item.id
      this.transferData.asResponderName = item.name
      this.transferData.asResponderTel = item.number
    },
    transferCommit(){
      transferSave(this.transferData).then(res=>{
        this.$message.success("转办成功");
        this.transferData = []
        this.transfer = false
        this.init()
      })
    },
    rejectCommit(){
      const req = {
        rejectReason: this.rejectReason,
        recordId : this.rejectData.id
      }
      rejectSave(req).then(res=>{
        this.$message.success("驳回成功");
        this.rejectData = []
        this.reject = false
        this.rejectReason = ""
        this.init()
      })
    },
    assignCommit(row){
      const req = {
        personInfo :{
          id: row.id,
          name: row.name,
          number: row.number
        },
        andonId: this.andonId
      }
      assignSave(req).then(res=>{
        this.$message.success("指派成功");
        this.dialogPeopleFormVisible = false
        this.init()
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
