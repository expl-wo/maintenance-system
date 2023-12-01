<template>
  <div class="app-container">

    <el-row :gutter="12" class="hp">
      <el-col :span="6" class="hp">
        <el-card shadow="hover" class="hp">
          <div   class="clearfix">
            <span>异常分类</span>
            <el-button style="float: right;" size="small" type="primary" icon="Plus" @click="onAdd" />
          </div>
          <el-tree
            :data="dataTree"
            :props="props"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :span="9" class="hp">
        <el-card shadow="hover" class="hp">
          <div   class="clearfix">
            <span>【{{listQuery.cateName}}】异常项</span>
            <el-button style="float: right;" size="small" type="primary" icon="Plus" @click="onNapeAdd" />
          </div>

          <el-table
            :data="tableData"
            :border="true"
            header-cell-class-name="bgblue"
            style="width: 100%"
            stripe
            row-key="id"
            @row-click="handleClick"
          >
            <el-table-column
              prop="abnormalName"
              label="名称"
              align="center"
              min-width="15%"
            />
            <el-table-column
              prop="abnormalDesc"
              align="center"
              label="描述"
              min-width="15%"
            />
            <el-table-column
              prop="responders"
              align="center"
              label="通知人"
              min-width="5%"
            />
            <el-table-column
              min-width="20%"
              align="center"
              label="操作"
            >
              <template #default="scope">
                <el-button-group>
                  <el-button
                    plain
                    icon="Edit"
                    type="primary"
                    @click="editAbnormal(scope.row)"
                  >
                  </el-button>
                  <el-button
                    plain
                    icon="Delete"
                    type="danger"
                    @click="deleteAbnormal(scope.row)"
                  >
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="listQuery.pg_pagenum"
            :page-sizes="[100, 200, 500]"
            :page-size="listQuery.pg_pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @Paginate="getList"
          />

        </el-card>
      </el-col>
      <el-col :span="9" class="hp">
        <el-card shadow="hover" class="hp">
          <div   class="clearfix">
            <span>【{{listUpQuery.abnormalNameLeft}}】异常升级提醒</span>
            <el-button-group style="float: right;">
              <el-button size="small" type="primary" @click="onUpTemplateAdd">升级模板</el-button>
              <el-button size="small" type="primary" icon="Plus" @click="onUpAdd" />
            </el-button-group>
          </div>
          <el-table
            :data="tableUpData"
            :border="true"
            header-cell-class-name="bgblue"
            style="width: 100%"
            stripe
            row-key="id"
            @row-click="handleClick"
          >
            <el-table-column
              prop="upgradeName"
              label="升级名称"
              align="center"
              min-width="15%"
            />
            <el-table-column
              prop="upgradeTime"
              align="center"
              label="升级时间"
              min-width="15%"
            />
            <el-table-column
              prop="responders"
              align="center"
              label="升级响应人"
              min-width="5%"
            />
            <el-table-column
              min-width="20%"
              align="center"
              label="操作"
            >
              <template #default="scope">
                <el-button-group>
                  <el-button
                    plain
                    icon="Edit"
                    type="primary"
                    @click="editAbnormalUp(scope.row)"
                  >
                  </el-button>
                  <el-button
                    plain
                    icon="Delete"
                    type="danger"
                    @click="deleteAbnormalUp(scope.row)"
                  >
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="listUpQuery.pg_pagenum"
            :page-sizes="[100, 200, 500]"
            :page-size="listUpQuery.pg_pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalUp"
            @Paginate="getUpList"
          />
        </el-card>
      </el-col>
    </el-row>

    <!--异常分类新增或修改角色定义-->
    <el-dialog draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogTreeFormVisible" class="roleDialog">
      <el-form ref="listTreeUpdate" label-position="right" label-width="90px" :rules="submitTreeRules" :model="listTreeUpdate">
        <el-form-item label="分类名称:" prop="cateName" size="small">
          <el-input v-model="listTreeUpdate.cateName" placeholder="分类名称" style="width: 360px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="分类描述:" prop="cateDesc" size="small">
          <el-input v-model="listTreeUpdate.cateDesc" placeholder="分类描述" style="width: 360px;" class="filter-item" />
        </el-form-item>
        <el-form-item v-if="!listTreeUpdate.fid" label="节点类型:" prop="andonCate" style="width: 360px;" class="filter-item" size="small">
          <el-select v-model="listTreeUpdate.andonCate" placeholder="节点类型" style="width: 165px;">
            <el-option v-for="item in andonCateList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序:" prop="cateWeight" size="small">
          <el-input-number v-model="listTreeUpdate.cateWeight" placeholder="排序" style="width: 165px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button size="small" @click="dialogTreeFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?createTreeData('listTreeUpdate', '添加成功'):updateTreeData('listTreeUpdate', '修改成功')">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

    <!--异常项新增或修改角色定义-->
    <el-dialog draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogNapeFormVisible" class="roleDialog800">
      <el-form ref="listNapeUpdate" label-position="right" label-width="180px" :rules="submitNapeRules" :model="listNapeUpdate">
        <el-form-item label="异常项所属分类:" size="small">
          <el-input v-model="listNapeUpdate.cateName" placeholder="异常项所属分类" style="width: 460px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="异常名称:" prop="abnormalName" size="small">
          <el-input v-model="listNapeUpdate.abnormalName" placeholder="异常名称" style="width: 460px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="异常描述:" prop="abnormalDesc" size="small">
          <el-input v-model="listNapeUpdate.abnormalDesc" placeholder="异常描述" style="width: 460px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="选择异常通知人:" prop="respondersName" size="small">
          <el-input v-model="listNapeUpdate.respondersName" placeholder="选择异常通知人" style="width: 343px;" class="filter-item" disabled />
          <el-button size="small" type="primary" @click="onSelectDept">请选择异常通知人</el-button>
        </el-form-item>
<!--        <el-form-item label="是否按人数升级:" prop="isUpByPersonCount" size="small" class="filter-item">-->
<!--          <el-select v-model="listNapeUpdate.isUpByPersonCount" placeholder="请选择" style="width: 460px;">-->
<!--            <el-option label="否" value="0" />-->
<!--            <el-option label="是" value="1" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="排序:" prop="abnormalWeight" size="small">
          <el-input-number v-model="listNapeUpdate.abnormalWeight" placeholder="排序" style="width: 165px;" class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button size="small" @click="dialogNapeFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveNapeData('listNapeUpdate')">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

    <!--异常升级提醒新增或修改角色定义-->
    <el-dialog draggable  :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogUpFormVisible" class="roleDialog720">
      <el-form ref="listUpUpdate" label-position="right" label-width="180px" :rules="submitUpRules" :model="listUpUpdate">
        <el-form-item label="异常项所属分类:" size="small">
          <el-input v-model="listUpUpdate.abnormalName" placeholder="异常项所属分类" style="width: 343px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="升级提醒名称:" prop="upgradeName" size="small">
          <el-input v-model="listUpUpdate.upgradeName" placeholder="升级提醒名称" style="width: 343px;" class="filter-item" disabled />
          <el-button size="small" type="primary" @click="onUpTemplateAdd">请选择升级提醒名称及时间</el-button>
        </el-form-item>
        <el-form-item label="升级提醒时间(分钟):" size="small">
          <el-input v-model="listUpUpdate.upgradeTime" placeholder="升级提醒时间(分钟)" style="width: 343px;" class="filter-item" disabled />
        </el-form-item>
        <el-form-item label="选择异常通知人:" prop="respondersName" size="small">
          <el-input v-model="listUpUpdate.respondersName" placeholder="选择异常通知人" style="width: 343px;" class="filter-item" disabled />
          <el-button size="small" type="primary" @click="onSelectDept">请选择异常通知人</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogUpFormVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="saveUpData('listUpUpdate')">
          保存
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--选择人员-->
    <el-dialog draggable  :close-on-click-modal="false" title="请选择异常通知人员" v-model="dialogPeopleFormVisible" class="roleDialog800">
      <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
        <el-form-item label="" prop="name" size="small">
          <el-input v-model="listPeopleQuery.uName" placeholder="用户姓名" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro" size="small">
          <el-input v-model="listPeopleQuery.userid" placeholder="员工编号" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="" prop="intro" size="small">
          <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门名称" style="width: 180px;" class="filter-item" />
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" icon="Search" @click="onPeopleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-tag
        v-for="item in multipleSelection"
        v-show="multipleSelection.length > 0"
        :key="item.id"
        closable
        @close="tagClose(item)"
      >{{ item.uName }}
      </el-tag>
      <el-table
        :data="tablePeopleData"
        :border="true"
        header-cell-class-name="bgblue"
        style="width: 100%"
        :height-table="heightTable"
        stripe
        row-key="id"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column
          width="50"
          align="center"
          type="selection"
        />
        <el-table-column
          prop="uName"
          label="员工姓名"
          align="center"
          min-width="15%"
        />
        <el-table-column
          prop="userId"
          align="center"
          label="员工编号"
          min-width="15%"
        />
        <el-table-column
          prop="mobileNo"
          align="center"
          label="员工电话"
          min-width="5%"
        />
        <el-table-column
          prop="gsbmName"
          align="center"
          label="归属部门名称"
          min-width="5%"
        />
      </el-table>
      <el-pagination
        :current-page="listPeopleQuery.pg_pagenum"
        :page-sizes="[100, 200, 500]"
        :page-size="listPeopleQuery.pg_pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPeople"
        @Paginate="getPeopleList"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogPeopleFormVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="savePeopleData()">
          保存
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--异常类标签-->
    <el-dialog draggable  :close-on-click-modal="false" title="异常类标签" v-model="dialogLabelFormVisible">
      <abnormalLabel ref="abnormalChild" :abnormal-id-child="listNapeUpdate" />
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogLabelFormVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!--升级模板-->
    <el-dialog draggable  :close-on-click-modal="false" title="升级模板" v-model="dialogUpLabelFormVisible" class="roleDialog800">
      <upgradeTemplate ref="upgradeChild" :confirm-btn="confirmBtn" @confirmEmit="confirmEmit" />
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogUpLabelFormVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="jsx">
import TableSimple from '@/components/Table/index'
// 查询人员信息
import { getUser } from '@/api/user'
// 异常分类查询,异常分类添加修改，异常分类删除，异常项查询，异常项添加修改,异常项删除，异常升级提醒查询，异常升级提醒修改添加，异常升级提醒删除
import {
  getAndonConfigCateList,
  getAndonConfigCateUpdate,
  deleteAndonConfigCate,
  getAndonAbnormalList,
  getAndonAbnormalUpdate,
  deleteAndonAbnormal,
  getUpgradeConfigList,
  getUpgradeConfigUpdate,
  deleteUpgradeConfig,
  getAndonCateList
} from '@/api/andonConfig'
import abnormalLabel from './pm_001_andonBasisConfig_children/abnormalLabel.vue'
import upgradeTemplate from './pm_001_andonBasisConfig_children/upgradeTemplate.vue'

export default {
  name: 'Table',
  components: {  abnormalLabel, upgradeTemplate },
  data() {
    return {
      heightTable: '300px',
      tableData: [], // 表格2（异常项）
      rowHeader: [], // 表格2（表头）
      total: 0, // 表格2（总条数）
      andonCateList: [], // 顶级节点类型数据
      listQuery: { // 表格2
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        cateId: '',
        cateName: ''
      },
      tableUpData: [], // 表格3（异常升级提醒）
      rowUpHeader: [], // 表格3（表头）
      totalUp: 0, // 表格3（总条数）
      listUpQuery: { // 表格3
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        abnormalId: '',
        abnormalNameLeft: ''
      },
      dataTree: [],
      props: {
        value: 'id', // ID字段名
        label: 'cateName', // 显示名称
        children: 'sub' // 子级字段名
      },
      listTreeUpdate: {
        cateName: '', // 分类名称
        cateDesc: '', // 分类描述
        fid: '', // 父分类id（首层为null）
        id: '', // 主键id,编辑修改时必填
        andonCate: '', // 顶级节点类型
        cateWeight: '' // 权重
      },
      dialogStatus: '', // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: '修改',
        create: '添加',
        chooseDepartment: '选择部门'
      },
      dialogTreeFormVisible: false, // 添加修改弹窗
      submitTreeRules: {
        cateName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        // cateDesc: [
        //   { required: true, trigger: 'change', message: '该项为必填项' }
        // ],
        cateWeight: [{ required: true, trigger: 'change', message: '该项为必填项' }]
      },
      dialogNapeFormVisible: false, // 异常项添加修改弹窗
      listNapeUpdate: {
        abnormalName: '', // 异常名称,不允许重复
        abnormalDesc: '', // 异常描述,不允许重复
        cateId: '', // 所属分类id,必须为已有的分类id
        cateName: '', // 所属分类名称
        id: '', // 异常分类主键。如果是修改操作，则需要传递此值
        responders: [], // [{}] 	响应人员列表，新增修改时都必填
        respondersName: '', // [{}] 	响应人员列表，新增修改时都必填
        isUpByPersonCount: '',
        abnormalWeight: '' // 权重
      },
      owner: {
        ownerIdArray: [], // 要分配的用户ID数组
        ownerNameArray: [], // 要分配的用户名称数组
        ownerNumberArray: []// 要分配的用户电话数组
      },
      submitNapeRules: {
        abnormalName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        abnormalDesc: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        cateName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        respondersName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        // isUpByPersonCount: [
        //   { required: true, trigger: 'change', message: '该项为必填项' }
        // ],
        abnormalWeight: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      dialogPeopleFormVisible: false, // 选择人员弹窗
      tablePeopleData: [], // 人员表格数据
      rowPeopleHeader: [], // 人员表格表头
      totalPeople: 0, // 人员列表总条数
      listPeopleQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        uName: '', // 模糊匹配，用户姓名
        userid: '', // 模糊匹配，员工编号
        gsbmName: '' // 模糊匹配，归属部门名称
      },
      checkboxItem: {},
      dialogLabelFormVisible: false, // 标签弹窗
      dialogUpLabelFormVisible: false, // 升级模板弹窗
      dialogUpFormVisible: false, // 异常升级提3醒弹窗显示隐藏
      listUpUpdate: {
        upgradeName: '', // 升级提醒名称,同一个异常不能添加已存在的升级提醒名称
        upgradeTime: '', // 升级提醒时间(分钟)
        abnormalId: '', // 异常项id
        abnormalNameLeft: '', // 异常项名称
        id: '', // 主键。如果是修改操作，则需要传递修改数据的id值
        responders: [],
        respondersName: ''
      }, // 异常升级提3数据
      submitUpRules: { // 异常升级提3验证
        upgradeName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        respondersName: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      rowUpdata: '', // 选中的异常升级提醒
      confirmBtn: 'none', // 子组件控制确认按钮显示隐藏
      confirmData: {}, // 子组件确认选择的升级模板数据
      multipleSelection: []
    }
  },
  mounted() {
    this.onload()
    this.onUpload()
  },
  methods: {
    tagClose(item) {
      const multipleSelection = this.multipleSelection.filter((user) => {
        return item.id === user.id;
      });
      if (multipleSelection.length > 0) {
        this.$refs.tableRef && this.$refs.tableRef.toggleRowSelection(multipleSelection[0], false);
      }
      this.multipleSelection = this.multipleSelection.filter((user) => {
        return item.id !== user.id;
      });
    },
    onload() {
      this.onTreeQuery() // 查树形
      this.onQueryPeople() // 人员表格头
      this.onAndonCate() // andon顶级类型
    },
    onUpload() {
      // self.onSelectQuery() // 下拉框
    },
    // 清空树形选中的数据
    clearTreeData() {
      this.listQuery.cateId = '' // 异常分类1
      this.listQuery.cateName = ''
      this.tableData = []
      this.total = 0
    },
    // 清空异常项选中的数据
    clearData() {
      this.listUpQuery.abnormalId = '' // 异常项
      this.listUpQuery.abnormalNameLeft = ''
      this.tableUpData = []
      this.totalUp = 0
    },
    // 查询
    onTreeQuery() {
      this.dataTree = []
      getAndonConfigCateList().then(response => {
        this.dataTree = response.data
        this.clearTreeData() // 清空树形选中的数据
        this.clearData() // 清空异常项选中的数据
      })
    },
    // 安灯等级类型查询
    onAndonCate() {
      getAndonCateList().then(response => {
        this.andonCateList = response.data
      })
    },
    // 查询异常项
    onQuery() {
      this.tableData = []
      getAndonAbnormalList(this.listQuery).then(response => {
        this.tableData = response.data
        this.total = response.total_count
        // this.clearData() // 清空异常项选中的数据
      })
    },
    // 升级提醒分页查询
    onUpQuery() {
      this.tableUpData = []
      getUpgradeConfigList(this.listUpQuery).then(response => {
        this.tableUpData = response.data
        this.totalUp = response.total_count
      })
    },
    // 树形点击
    handleNodeClick(data) {
      this.listQuery.cateId = data.id
      this.listQuery.cateName = data.cateName
      this.onQuery() // 查询异常项
      this.listUpQuery = { // 表格3
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
          abnormalId: '',
          abnormalNameLeft: ''
      },
      // this.listUpQuery.abnormalId = data.id
      // this.listUpQuery.abnormalNameLeft = data.cateName
      // this.onUpQuery() // 升级提醒分页查询
      this.tableUpData = []
    },
    handleClick(row, event, column) {
      this.listUpQuery.abnormalId = row.item.id
      this.listUpQuery.abnormalNameLeft = row.item.abnormalName
      this.onUpQuery() // 升级提醒分页查询
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node wp'>
          <span>{node.label}</span>
          <span class='fr'>
            <el-button-group>
              <el-button size='mini' type='primary' class='Edit' on-click={ () => this.onUpdate(data) }></el-button>
              <el-button size='mini' type='danger' class='Delete' on-click={ () => this.onRemove(node, data) }></el-button>
            </el-button-group>
          </span>
        </span>
      )
    },
    // 添加异常分类（顶级）
    onAdd(row) {
      this.dialogStatus = 'create'
      this.dialogTreeFormVisible = true
      const fid = row ? row.id : null
      this.listTreeUpdate = {
        cateName: '', // 分类名称
        cateDesc: '', // 分类描述
        andonCate: this.andonCateList[0].id || '',
        fid: fid // 父分类id（首层为null）
      }
    },
    // 异常分类修改
    onUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogTreeFormVisible = true
      this.listTreeUpdate = {
        cateName: row.cateName, // 分类名称
        cateDesc: row.cateDesc, // 分类描述
        andonCate: row.andonCate,
        cateWeight: row.cateWeight,
        fid: row.fid, // 父分类id（首层为null）
        id: row.id // 主键id,编辑修改时必填
      }
    },
    // 保存异常分类
    createTreeData(listTreeUpdate, message) {
      this.saveTreeData(listTreeUpdate, message)
    },
    updateTreeData(listTreeUpdate, message) {
      this.saveTreeData(listTreeUpdate, message)
    },
    saveTreeData(listTreeUpdate, message) {
      this.$refs[listTreeUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.listTreeUpdate }
          getAndonConfigCateUpdate(req).then(response => {
            this.dialogTreeFormVisible = false
            this.$message({ message: message, type: 'success' })
            this.onTreeQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 异常分类删除
    onRemove(node, data) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAndonConfigCate({ id: data.id }).then(response => {
          this.$message({ message: '删除成功', type: 'success' })
          this.onTreeQuery() // 查询
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 查询人员表格
    onPeopleQuery() {
      this.tablePeopleData = []
      getUser(this.listPeopleQuery).then(response => {
        this.tablePeopleData = response.data
        this.totalPeople = response.total_count
      })
    },
    onPeopleListQuery() {
      this.listPeopleQuery.pg_pagenum = 1
      this.onPeopleQuery()
    },
    // 添加异常项
    onNapeAdd() {
      if (this.listQuery.cateId) {
        this.listNapeUpdate = {
          abnormalName: '', // 异常名称,不允许重复
          abnormalDesc: '', // 异常描述,不允许重复
          cateId: this.listQuery.cateId, // 所属分类id,必须为已有的分类id
          cateName: this.listQuery.cateName, // 所属分类名称
          id: '', // 异常分类主键。如果是修改操作，则需要传递此值
          responders: [], // [{}] 	响应人员列表，新增修改时都必填
          respondersName: '' // [{}] 	响应人员列表，新增修改时都必填
        }
        this.clearOwner()
        this.dialogStatus = 'create'
        this.dialogNapeFormVisible = true
      } else {
        this.$message({ message: '请选择异常分类', type: 'warning' })
      }
    },
    // 选择异常通知人
    onSelectDept() {
      this.dialogPeopleFormVisible = true
      this.onPeopleQuery()
    },
    checkboxClick(item) {
      this.checkboxItem = item
    },
    // 确认选择异常通知人
    savePeopleData() {
      console.log(this.owner.ownerIdArray)
      console.log(this.owner.ownerNameArray)
      console.log(this.owner.ownerNumberArray)
      if (this.owner.ownerIdArray.length > 0) {
        if (this.dialogNapeFormVisible) { // 异常项
          this.listNapeUpdate.responders = []
          this.listNapeUpdate.respondersName = ''
          this.owner.ownerIdArray.forEach((item, i) => {
            this.listNapeUpdate.responders.push({ id: item, name: this.owner.ownerNameArray[i], number: this.owner.ownerNumberArray[i] })
            this.listNapeUpdate.respondersName += this.owner.ownerNameArray[i] + '(' + (this.owner.ownerNumberArray[i] || '') + ')' + ','
          })
          this.listNapeUpdate.respondersName = this.listNapeUpdate.respondersName.substring(0, this.listNapeUpdate.respondersName.length - 1)
          this.dialogPeopleFormVisible = false
        } else if (this.dialogUpFormVisible) {
          this.listUpUpdate.responders = []
          this.listUpUpdate.respondersName = ''
          this.owner.ownerIdArray.forEach((item, i) => {
            this.listUpUpdate.responders.push({ id: item, name: this.owner.ownerNameArray[i], number: this.owner.ownerNumberArray[i] })
            this.listUpUpdate.respondersName += this.owner.ownerNameArray[i] + '(' + (this.owner.ownerNumberArray[i] || '') + ')' + ','
          })
          this.listUpUpdate.respondersName = this.listUpUpdate.respondersName.substring(0, this.listUpUpdate.respondersName.length - 1)
          this.dialogPeopleFormVisible = false
        }
      } else {
        this.$message({ message: '请选择异常通知人', type: 'warning' })
      }
    },
    // 添加角色分配保存
    saveNapeData(listUpdate) {
      if(this.listNapeUpdate.abnormalDesc.length > 130){
        console.log(this.listNapeUpdate.abnormalDesc.length)
        this.$message({ message: "描述超长,限制长度为130，当前" + this.listNapeUpdate.abnormalDesc.length, type: 'fail' })
        return
      }
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogNapeFormVisible = false
          const req = {
            abnormalName: this.listNapeUpdate.abnormalName,
            abnormalDesc: this.listNapeUpdate.abnormalDesc,
            cateId: this.listNapeUpdate.cateId,
            responders: this.listNapeUpdate.responders,
            isUpByPersonCount: 0,
            abnormalWeight: this.listNapeUpdate.abnormalWeight
          }
          if (this.dialogStatus === 'update') req.id = this.listNapeUpdate.id
          getAndonAbnormalUpdate(req).then(response => {
            this.$message({ message: (this.dialogStatus === 'create' ? '添加成功' : '修改成功'), type: 'success' })
            this.onQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 添加异常升级提醒
    onUpAdd(update, row, respondersName) {
      if (this.listUpQuery.abnormalId) {
        this.listUpUpdate = {
          abnormalName: this.listUpQuery.abnormalNameLeft, // 异常项名称
          upgradeName: (update == 'update' ? row.upgradeName : ''), // 升级提醒名称,同一个异常不能添加已存在的升级提醒名称
          upgradeTime: (update == 'update' ? row.upgradeTime : ''), // 升级提醒时间(分钟)
          abnormalId: this.listUpQuery.abnormalId, // 异常项id
          responders: (update == 'update' ? row.responders : []),
          respondersName: (update == 'update' ? respondersName : '')
        } // 异常升级提3数据
        this.clearOwner()
        if (update == 'update') {
          this.pushOwner(row.responders)
        }
        update == 'update' ? (this.dialogStatus = 'update') : (this.dialogStatus = 'create')
        this.dialogUpFormVisible = true
      } else {
        this.$message({ message: '请选择异常项', type: 'warning' })
      }
    },
    // 添加异常升级提醒
    saveUpData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          this.dialogUpFormVisible = false
          const req = {
            upgradeName: this.listUpUpdate.upgradeName, // 升级提醒名称,同一个异常不能添加已存在的升级提醒名称
            upgradeTime: this.listUpUpdate.upgradeTime, // 升级提醒时间(分钟)
            abnormalId: this.listUpUpdate.abnormalId,
            responders: this.listUpUpdate.responders
          }
          if (this.dialogStatus === 'update') req.id = this.rowUpdata.id
          getUpgradeConfigUpdate(req).then(response => {
            this.$message({ message: (this.dialogStatus === 'create' ? '添加成功' : '修改成功'), type: 'success' })
            this.onUpQuery() // 查询
          })
        } else {
          this.$message({ message: '请填写必填项', type: 'warning' })
          return false
        }
      })
    },
    // 模板升级
    onUpTemplateAdd() {
      // confirmBtn控制升级模板弹窗确认按钮是否显示
      this.dialogUpFormVisible ? (this.confirmBtn = 'block') : (this.confirmBtn = 'none')
      this.dialogUpLabelFormVisible = true
      this.$nextTick(() => {
        this.$refs.upgradeChild.onQuery()
      })
    },
    // 点击确认按钮
    confirmEmit(item) {
      this.listUpUpdate.upgradeName = item.confirmData.upgradeName // 升级提醒名称,同一个异常不能添加已存在的升级提醒名称
      this.listUpUpdate.upgradeTime = item.confirmData.upgradeTime // 升级提醒时间(分钟)
      this.dialogUpLabelFormVisible = false
    },
    getList(val) {
      this.listQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listQuery.pg_pagesize = val.limit
      }
      this.onQuery() // 查询
    },
    getUpList(val) {
      this.listUpQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listUpQuery.pg_pagesize = val.limit
      }
      this.onUpQuery() // 查询
    },
    // 分页数据发生变化
    getPeopleList(val) {
      this.listPeopleQuery.pg_pagenum = val.page
      if (val.limit) {
        this.listPeopleQuery.pg_pagesize = val.limit
      }
      this.onPeopleQuery() // 查询
    },
    clearOwner() {
      this.owner.ownerIdArray.length = 0
      this.owner.ownerNameArray.length = 0
      this.owner.ownerNumberArray.length = 0
    },
    pushOwner(arrData) {
      const self = this
      arrData.forEach(d => {
        self.owner.ownerIdArray.push(d.id)
        self.owner.ownerNameArray.push(d.name)
        self.owner.ownerNumberArray.push(d.number)
      })
    },
    editAbnormal(row){
      this.listNapeUpdate = {
        abnormalName: row.abnormalName, // 异常名称,不允许重复
        abnormalDesc: row.abnormalDesc, // 异常描述,不允许重复
        cateId: this.listQuery.cateId, // 所属分类id,必须为已有的分类id
        cateName: this.listQuery.cateName, // 所属分类名称
        id: row.id, // 异常分类主键。如果是修改操作，则需要传递此值
        responders: row.responders, // [{}] 	响应人员列表，新增修改时都必填
        isUpByPersonCount: row.isUpByPersonCount,
        abnormalWeight: row.abnormalWeight
      }
      this.listNapeUpdate.respondersName = ''
      if (row.responders) {
        row.responders.forEach(i => {
          this.listNapeUpdate.respondersName += i.name + '(' + (i.number || '') + ')' + ','
        })
      }
      this.listNapeUpdate.respondersName = this.listNapeUpdate.respondersName.substring(0, this.listNapeUpdate.respondersName.length - 1)
      this.dialogStatus = 'update'
      this.clearOwner()
      this.pushOwner(row.responders)
      this.dialogNapeFormVisible = true
    },
    deleteAbnormal(row) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAndonAbnormal({ id: row.id }).then(response => {
          this.$message({ message: '删除成功', type: 'success' })
          this.onQuery() // 查询异常项
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    editAbnormalUp(row){
      var htmlText = ''
      row.responders.forEach(i => {
        htmlText += i.name + '(' + (i.number || '') + ')' + ','
      })
      htmlText = htmlText.substring(0, htmlText.length - 1)
      this.rowUpdata = row
      this.onUpAdd('update', row, htmlText)
    },
    deleteAbnormalUp(row){
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUpgradeConfig({ id: row.id }).then(response => {
          this.$message({ message: '删除成功', type: 'success' })
          this.onUpQuery() // 查询
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    handleSelect(selection, row) {
      if (selection.indexOf(row) >= 0) {
        // 是被选中
        const isHave = this.multipleSelection.find(item => {
          return item.id === row.id;
        });
        if (!isHave) {
          this.multipleSelection.push(row);
        }
      } else {
        this.multipleSelection.some((item, index) => {
          if (item.id === row.id) {
            this.multipleSelection.splice(index, 1);
            return true;
          } else {
            return false;
          }
        });
      }
    },
    handleSelectAll(selection) {
      this.tablePeopleData.forEach(row => {
        this.handleSelect(selection, row);
      });
    },
  }
}
</script>

<style scoped>

</style>

