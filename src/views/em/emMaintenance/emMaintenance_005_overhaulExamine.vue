<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQueryDe" class="demo-form-inline demo-form-zdy">
        <el-form-item label="设备名称"  size="small" v-if="needShow">
          <el-input v-model="listQueryDe.name" placeholder="请输入设备名称"  @keyup.enter="handleSearch"
                    style="width:210px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="OA流程审批状态"  size="small" >
          <xui-dict-select multiple item-code="OverHaulOaStatus"  size="small" includeAll v-model="listQueryDe.oaStatus"
                           style="width:200px;" class="filter-item" :clearable="false"></xui-dict-select>
        </el-form-item>
        <el-button type="primary" @click="handleSearch"  size="small">查询</el-button>
        <el-button type="primary" v-if="false" @click="updateBegin"  size="small">修改实际开始时间</el-button>
        <el-button type="primary" v-if="false" @click="updateEnd"  size="small">修改实际结束时间</el-button>
      </el-form>
    </div>
    <div class="app-container app-containerC">
      <div class="otherCon wp" id="psMainPlan">
        <el-table stripe  ref="tableRef" :height="'100%'" highlight-current-row border :data="dataList"
                  style="font-size: 0.7rem"
                  :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @cell-click="handleCellClick" @selection-change="selectChange"
        >
          <el-table-column
            header-align="center"
            align="center"
            type="selection"
            fixed
            width="45"
            property="selection"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="大修单号"
            property="overhaulPlanNo"
            width="120"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="大修改造设备编号"
            width="120"
            property="eqpNumber">
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="大修改造设备名称"
            width="150"
            property="eqpName">
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="申请部门"
            property="subDepName"
            width="160"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="项目分类"
            property="proClass"
            width="160"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="检修方案"
            property="maintenancePlan"
            width="260"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="检修人员"
            property="maintenanceName"
            width="80"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="检修安全措施"
            property="safetyMeasures"
            width="120"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="检修质量标准"
            property="qualityStandard"
            width="120"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="检修进度安排"
            property ="maintenanceSchedule"
            width="140"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="费用"
            property ="expenses"
            width="140"
          >
          </el-table-column>

          <el-table-column
            header-align="center"
            align="center"
            label="计划开始时间"
            property ="planStarttime"
            width="140"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="计划结束时间"
            property="planEndtime"
            width="140"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="实际开始时间"
            property="starttime"
            width="140"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="实际结束时间"
            property ="endtime"
            width="140"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="大修状态"
            property ="status"
            width="140"
          >
            <template  #default="scope">
              <xui-dictionary itemCode="overHaulStatus" :code="scope.row.status"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="大修OA状态"
            property ="status"
            width="140"
          >
            <template  #default="scope">
              <xui-dictionary itemCode="OverHaulOaStatus" :code="scope.row.oaStatus"></xui-dictionary>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="大修任务书"
            width="180"
          >
            <template  #default="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="请选择word格式文档"
                placement="top">
                <el-button @click="upload('assignment')" icon="el-icon-upload" type="primary"  size="small"></el-button>
              </el-tooltip>
              <input  ref="fileA" type="file" style="display:none" accept=".doc, .docx" @change="updateAssignment('assignment',$event, scope.row)">
              <el-button-group>
                <el-button  size="small" title="" type="primary" icon="el-icon-folder"
                           @click="viewFile('assignment',scope.row)">
                  查看任务书
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="大修改造验收"
            width="180"
          >
            <template  #default="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="请选择word格式文档"
                placement="top">
                <el-button @click="upload('reform')" icon="el-icon-upload" type="primary"  size="small"></el-button>
              </el-tooltip>
              <input ref="fileR" type="file" style="display:none" accept=".doc, .docx" @change="updateAssignment('reform',$event, scope.row)">
              <el-button-group>
                <el-button  size="small" title="" type="primary" icon="el-icon-folder"
                           @click="viewFile('reform',scope.row)">
                  查看改造验收
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="预验收"
            width="120"
          >
            <template  #default="scope">
              <el-button-group>
                <el-button  size="small" title="转OA审批" type="primary" icon="el-icon-upload2"
                           @click="oaApproval(scope.row)">
                 转OA审批
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="二次验收"
            width="120"
          >
            <template  #default="scope">
              <el-button-group>
                <el-button  size="small" title="转OA审批" type="primary" icon="el-icon-upload2"
                           @click="secondApproval(scope.row)">
                  转OA审批
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template  #default="scope">
              <el-button-group>
                <el-button  type="primary"  size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">修改
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination" class="searchCon wp"/>
    </div>
    <el-dialog v-draggable  :close-on-click-modal="false" title="修改"  v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listQuery" label-position="right" label-width="130px" :rules="submitRules" :model="listQuery">
        <el-form-item label="检修方案:" prop="maintenancePlan"  size="small">
          <el-input v-model="listQuery.maintenancePlan"  type="textarea" :rows="3"  style="width: 245px;" class="filter-item"   />
        </el-form-item>
        <el-form-item label="检修人员:" prop="maintenanceName"  size="small">
          <el-input v-model="listQuery.maintenanceName" style="width: 245px;" class="filter-item"  disabled/>
          <el-button type="primary" @click="onSelect">请选择</el-button>
        </el-form-item>
        <el-form-item label="检修安全措施:" prop="safetyMeasures"  size="small">
          <el-input v-model="listQuery.safetyMeasures" type="textarea" :rows="3"  style="width: 245px;" class="filter-item"   />
        </el-form-item>
        <el-form-item label="检修进度安排:" prop="maintenanceSchedule" >
          <el-input v-model="listQuery.maintenanceSchedule" type="textarea" :rows="3"  style="width: 245px;" class="filter-item"  />
        </el-form-item>
        <el-form-item label="检修质量标准:" prop="qualityStandard" >
          <el-input v-model="listQuery.qualityStandard" type="textarea" :rows="3" style="width: 245px;" class="filter-item"  />
        </el-form-item>
        <el-form-item label="费用:" prop="expenses"  size="small">
          <el-input v-model="listQuery.expenses" type="number" style="width: 245px;" class="filter-item"  />
        </el-form-item>
      </el-form>
      <div   class="dialog-footer">
        <el-button @click="dialogFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="saveData('listQuery', '修改成功')"  size="small">
          保存
        </el-button>
      </div>
    </el-dialog>
    <select-name-dialog ref="selectNameDialogRef"  @selectName="selectName"></select-name-dialog>
    <approval-overhaul-dialog ref="approvalOverhaulDialogRef" @refresh="getDataList"></approval-overhaul-dialog>
  </div>
</template>

<script>
  import { transformDictDetail } from '@/components/xui/dictionary'
  import planWeekHttp from '@/api/plan/planWeek'
  import Pagination from '@/components/Pagination/index'
  import cellTransform from '@/views/ps/_public/cell_transform'
  import XuiDictionary from '@/components/xui/dictionary/dictionary'
  import { getDictListByKey } from '@/components/xui/dictionary'
  import formatPlanMixins from '@/views/ps/_public/formatPlanMixins'
  import submitApprovalDialog from '@/views/ps/planWeek/dialog/submitApprovalDialog'
  import rejectDialog from '@/views/ps/planWeek/dialog/rejectDialog'
  import enterSearchMixins from '@/mixins/enterSearchMixins'
  import configColumnMixins from '@/views/ps/_public/configColumnMixins'
  import { $rooturl } from '@/utils/common.js'
  import { getSingleUpload } from '@/api/endpoint'
  import { getOverHaulTopList, getOverHaulTopUpdate, deleteOverHaulTop, getUploadFileUpdate } from '@/api/em/overHaul'
  import selectNameDialog from  './emMaintenance_005_children/emMaintenance_005_selectName'
  import approvalOverhaulDialog from './emMaintenance_005_children/approvalOverhaulDialog'



  const propertyClassFromDict = ['designSource', 'importmentLevel', 'urgentLevel', 'processStatus','nodeWeekStatus']
  const frozenDesc = '冻结'
    export default {
      name: "emMaintenance_005_overhaulExamine",
      mixins: [formatPlanMixins, enterSearchMixins, configColumnMixins],
      props: {
        eqpId: {
          required: true,
          type: String
        },
        needShow: {
          type: Boolean,
          default: true
        }
      },
      components:
        {
          approvalOverhaulDialog,
          XuiDictionary,
          Pagination,
          cellTransform,
          submitApprovalDialog,
          rejectDialog,
          selectNameDialog
        },
      data() {
        let pageId = 'ps_041_main';
        let isApprovePage = false, statusModel = this.$constants.confirmStatus.conStatus;
        let routePath = this.$route.fullPath;
        if(routePath.indexOf('ps_041_mainApproval')>=0){
          isApprovePage = true
          statusModel = this.$constants.confirmStatus.approvalPageSelected
          pageId = 'ps_041_mainApproval';
        }
        return {
          pageId,
          isApprovePage,
          selectList: [],
          searchParams:[],
          processType: '',
          isMainPlanPage: true, //默认页面为生产主计划
          dialogFormVisible:false,
          listQuery: {
            id:'',
            eqpName:'',
            maintenancePlan: '',
            maintenancePersonnel: '',
            safetyMeasures:'',
            maintenanceSchedule: '',
            qualityStandard: '',
            maintenanceName:'',
            expenses:''
          },
          listQueryDe: { // 查询条件
            pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
            pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
            name: '', // 设备名称
            oaStatus:[]
          },
          submitRules: {
            eqpName: [
              { required: true, trigger: 'change', message: '该项为必填项' }
            ],
            planStarttime: [
              { required: true, trigger: 'change', message: '该项为必填项' }
            ],
            planEndtime: [
              { required: true, trigger: 'change', message: '该项为必填项' }
            ],
            // starttime: [
            //   { required: true, trigger: 'change', message: '该项为必填项' }
            // ],
            // endtime: [
            //   { required: true, trigger: 'change', message: '该项为必填项' }
            // ],
            status: [
              { required: true, trigger: 'change', message: '该项为必填项' }
            ]
          },
          dateTime:'',
          rooturl:''
        }
      },
      mounted() {
        $rooturl().then(response =>{
          this.rooturl = response.data
        })
        this.handleSearch()
      },
      methods: {
        async getDataList() {
          let response = await getOverHaulTopList(this.getParams())
          this.total = response.total_count
          // this.formatSearchData(response.data)
          this.dataList = response.data;
          // this.dataList.forEach(item=>{
          //   item['testStatus'] = item.nodeList.filter(node=>node.nodeId === '23').status;
          // })
          // console.error(this.dataList)
          this.$nextTick(()=>{
            this.$refs.tableRef &&this.$refs.tableRef.doLayout();
          })
        },
        getParams() {
          let status = this.listQueryDe.oaStatus;
          let intStatus = [];
          status.forEach(item=>{
            intStatus.push(parseInt(item))
          })
          // let intStatus2 = [];
          // this.listQuery.statusModel.forEach(item=>{
          //   intStatus2.push(parseInt(item))
          // })
          return {
            getCon:{
              eqpName:this.listQueryDe.name,
              eqpId:this.eqpId
            },
            oaStatusList: intStatus,
            status:[1,2],
            pvo:{
              pageNum: this.listQueryDe.pg_pagenum,
              pageSize: this.listQueryDe.pg_pagesize
            }
          }
        },
        //格式化数据
        formatSearchData(dataList) {
          dataList.forEach((item, index) => {
            if (item.tentativeTime!=null&&item.tentativeEndTime!=null){
              item['tentativePhase'] = item.tentativeTime+'至'+item.tentativeEndTime
            } else {
              item['tentativePhase'] = null
            }
            if (item.salesReply!=null&&item.salesEndReply!=null){
              item['salesPhase'] = item.salesReply+'至'+item.salesEndReply
            } else {
              item['salesPhase'] = null
            }
            let nodeList = item.nodeList
            if (nodeList && nodeList.length > 0) {
              nodeList.forEach(secondItem => {
                // item['23_startDate'] = '4/15'
                // item['23_status'] = 'delay'
                item[ 'startDate_'+secondItem.nodeId ] = secondItem.startDate
                item[ 'prostatus_'+ secondItem.nodeId ] =  secondItem.progressStatus
                item[ 'confirm_'+secondItem.nodeId ] = secondItem.confirmStatus
                item[ 'status_'+secondItem.nodeId] = secondItem.status
                item['nodeDate_'+secondItem.nodeId] = secondItem.nodeDate
                item['finishDate_'+secondItem.nodeId] = secondItem.finishDate
                item['actualStartDate_'+secondItem.nodeId] = secondItem.actualStartDate
                /*  item[secondItem.nodeId + 'startDate'] = '4/15'
                  item[secondItem.nodeId + 'status'] = 'normal'*/
              })
            }
          })
        },
        handleSearch() {
          this.listQueryDe.pg_pagenum = 1
          this.getDataList()
        },
        selectChange(selection) {
          this.selectList = selection;
        },
        getSelectedData(type){
          let legalStatus = [], desc = '';
          if(type === 'addWeek'){
            //如果是获取加入周计划的数据
            legalStatus = this.$constants.confirmStatus.canAdd;
            desc = this.$constants.confirmStatus.canAddDesc;
          }else if(type === 'approval'){
            //如果是要求审批的数据
            legalStatus = this.$constants.confirmStatus.canApproval;
            desc = this.$constants.confirmStatus.canApprovalDesc;
          }else if(type === 'apply'){
            //apply  待审批数据
            legalStatus = this.$constants.confirmStatus.waitApproval;
            desc = this.$constants.confirmStatus.waitApprovalDesc;
          }else{
            return new Promise((resolve, reject)=>{
              resolve([])
            })
          }
          return new Promise((resolve, reject)=>{
            let selectedData = this.selectList;
            if(!selectedData || selectedData.length === 0){
              this.$message({ message: '请选择要处理的数据', type: 'warning' })
              return resolve([]);
            }
            //刷选出符合条件的数据和错误的数据
            let rightData = [], errorData= [];
            selectedData.forEach(item=>{
              if(legalStatus.indexOf(item.confirm_23.toString())>=0){
                rightData.push(item);
              }else{
                errorData.push(item);
              }
            })
            if(rightData.length === 0){
              this.$message({ message: `请选择审批状态为${desc}的数据`, type: 'warning' })
              return resolve(rightData);
            }else if(errorData.length > 0){
              this.$confirm(`您选择了状态不为${desc}的数据，是否剔除错误数据后继续操作？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
              }).then(() => {
                return resolve(rightData);
              }).catch(() => {
                return resolve([]);
              });
            }else{
              return resolve(rightData);
            }
          })
        },
        handlePagination({ page, limit }) {
          this.listQueryDe.pg_pagenum = page
          this.listQueryDe.pg_pagesize = limit
          this.getDataList()
        },
        //设置行样式
        tableRowClassName({ row, rowIndex }) {
          if (row.stateName === frozenDesc) {
            return 'trFrozenStatus'
          }
          return ''
        },
        cellClassName({ row, column, rowIndex, columnIndex }) {
          if (this.$constants.isEmpty(column.property)) {
            return ''
          }
          let retClass = []

          //不能是冻结行，冻结行不能进行操作，样式也会在已冻结行方法中处理  且为生产主计划页面时
          if (row.stateName === frozenDesc && this.isMainPlanPage) {
            //只能查看列表
            if ( column.property.indexOf('_status') >= 0) {
              retClass.push('pointer-cursor')
            }
            return retClass.join(' ')
          }

          //有以下功能代表可点击
          if(this.isMainPlanPage){
            if (column.property.indexOf('_status') >= 0
              || column.property === 'salesReply'||(row.isSpecialUser===1&&column.property === 'customerName')) {
              retClass.push('pointer-cursor')
            }
          }

          //加入产品期量、设计来源（PLM）、重点性、紧急性
          //加入的实际进度
          try {
            if (column.property.indexOf('_status') >= 0) {
              if (this.$constants.isNotEmpty(row[column.property])) {
                retClass.push(transformDictDetail('nodeWeekStatus', row[column.property], 'remark'))
              }
            } else if (propertyClassFromDict.indexOf(column.property) >= 0) {
              //从字典中获取数据
              retClass.push(transformDictDetail(column.property, row[column.property], 'remark'))
            } else if (column.property === 'model' ) {
              if (this.$constants.isEmpty(row.timeLimitName)) {
                retClass.push('cellNotPorductNum')
              }
            }else if (column.property ==='status_23') {
              if (row.status_23 == -1){
                retClass.push('celldelay')
              }else if (row.status_23 == 1){
                retClass.push('celladvance')
              }
            }else if (row.isSpecialUser===1&&column.property === 'customerName'){
              retClass.push('celladvance')
            }
          } catch (e) {
            console.error(e)
            console.error(JSON.stringify(column))
          }
          return retClass.join(' ')
        },
        handleCellClick(row, column, cell, event) {
          if (this.$constants.isEmpty(column.property)) {
            return ''
          }

          //冻结的只允许查看详情
          if (row.stateName === frozenDesc) {
            return;
          }

          if(this.isMainPlanPage){
            if (column.property === 'salesReply') {
              this.$refs.changeDeliveryDialogRef.init(row)
            }else if(row.isSpecialUser===1&&column.property === 'customerName'){
              this.$refs.specialRequirementsDialogRef.init(row)
            }
          }
        },
        viewFile(type,row){
          if (type==='assignment'){
            if (row.assignmentPath ==null){
              this.$message.warning('未上传文件')
            }else {
              window.location.href = this.rooturl + row.assignmentPath
            }
          }else if (type==='reform'){
            if (row.reformPath==null){
              this.$message.warning('未上传文件')
            }else {
              window.location.href = this.rooturl + row.reformPath
            }
          }
        },
        upload(type) {
          if (type==='assignment'){
            this.$refs.fileA.click()
          }else if (type==='reform'){
            this.$refs.fileR.click()
          }
        },
        updateAssignment(type,e,row) {
          const file = e.target.files[0]
          const param = new FormData() // 创建form对象
          param.append('file', file) // 通过append向form对象添加数据
          param.append('appid', 'mesupload') // 添加form表单中其他数据
          const name = file.name + ''
          // 防止用户手动更改选择类型
          if (name.indexOf('.doc') === -1 && name.indexOf('.docx') === -1) {
            this.$message.warning('请选择正确的文件类型')
            return
          }
          // 上传word
          getSingleUpload(param).then(response => {
            // word更新
            console.log(type)
            if (type==='assignment'){
              getUploadFileUpdate({ id: row.id, assignmentPath: response.path}).then(responseUp => {
                this.$message({ message: '更新成功', type: 'success' })
                this.handleSearch()
              })
            }else if (type==='reform'){
              getUploadFileUpdate({ id: row.id, reformPath: response.path}).then(responseUp => {
                this.$message({ message: '更新成功', type: 'success' })
                this.handleSearch()
              })
            }
          })
        },
        handleEdit(row){
          this.listQuery = {
            id:row.id,
            maintenancePlan:row.maintenancePlan,
            maintenancePersonnel: row.maintenancePersonnel,
            maintenanceName:row.maintenanceName,
            safetyMeasures:row.safetyMeasures,
            maintenanceSchedule: row.maintenanceSchedule,
            qualityStandard: row.qualityStandard,
            expenses:row.expenses
          }
          this.dialogFormVisible = true;
        },
        onSelect(){
          this.$refs.selectNameDialogRef.init()
        },
        selectName(obj){
          this.listQuery.maintenancePersonnel = obj.id
          this.listQuery.maintenanceName = obj.name
        },
        saveData(listQuery, message) {
          this.$refs[listQuery].validate((valid) => {
            if (valid) {
              const req = { ...this.listQuery }
              console.log(req,this.listQuery)
              getOverHaulTopUpdate(req).then(response => {
                this.dialogFormVisible = false
                this.$message({ message: message, type: 'success' })
                this.handleSearch() // 查询
              })
            } else {
              this.$message({ message: '请填写必填项', type: 'warning' })
              return false
            }
          })
        },
        numFilter(value) {
          // 截取当前数据到小数点后两位
          let tempVal = parseFloat(value).toFixed(3);
          let realVal = tempVal.substring(0, tempVal.length - 1);
          return realVal;
        },
        oaApproval(row){
          if(row.status===2){
            this.$message({ message: '该大修计划已完成，不可提交', type: 'warning' })
          }
          else if(row.oaStatus!==2) {
            this.$message({message: '请选择OA审批状态为计划申请通过的单据', type: 'warning'})
          }
          else {
            this.$refs.approvalOverhaulDialogRef.init(row,'oaApproval')
          }
        },
        secondApproval(row){
          if(row.status===2){
            this.$message({ message: '该大修计划已完成，不可提交', type: 'warning' })
          }
          else if(row.oaStatus!==4) {
            this.$message({message: '请选择OA审批状态为预验收通过的单据', type: 'warning'})
          }
          else {
            this.$refs.approvalOverhaulDialogRef.init(row,'secondApproval')
          }
        },
        updateBegin(){

        },
        updateEnd(){

        },
      }
    }
</script>

<style scoped>

</style>
