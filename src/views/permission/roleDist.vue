<template>
  <div class="app-container">

    <el-row :gutter="12" class="hp">
      <el-col :span="6" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>组织机构</span>
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
                <el-form-item label="员工姓名">
                  <el-input v-model="listQuery.ownerName" placeholder="员工姓名" style="width: 180px;"
                            class="filter-item" clearable />
                </el-form-item>
                <el-form-item label="角色名称">
                  <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 180px;"
                            class="filter-item" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="onQueryWithNoGsbmId">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Plus" @click="onAdd">新增角色分配</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table
              :data="tableData"
              :border="true"
              header-cell-class-name="bgblue"
              style="width: 100%"
              stripe
              row-key="id"
              height="700"
            >
              <el-table-column
                prop="index"
                label="序号"
                align="center"
                min-width="5%"
              >
                <template v-slot:default="scope">
                  <span>{{ (scope.$index + 1) }} </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="ownerName"
                label="员工姓名"
                align="center"
                min-width="15%"
              />
              <el-table-column
                prop="ownerCode"
                align="center"
                label="员工编号"
                min-width="15%"
              />
              <el-table-column
                prop="roleName"
                align="center"
                label="角色名称"
                min-width="15%"
              />
              <el-table-column
                prop="deptName"
                align="center"
                label="授权部门"
                min-width="15%"
              />
              <el-table-column
                min-width="6%"
                align="center"
                label="操作"
              >
                <template v-slot="scope">
                  <el-button

                    plain
                    type="danger"
                    icon="Delete"
                    @click="deleteRole(scope.row)"
                  >
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
              @size-change="(val) => handleSizeChange('load', val)"
              @current-change="(val) => handleCurrentChange('load', val)"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--弹窗新增或修改角色定义-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="textMap[dialogStatus]" v-model="dialogFormVisible"
               class="roleDialog720">
      <el-form ref="listUpdate" label-position="right" label-width="150px" :rules="submitRules" :model="listUpdate">
        <el-form-item label="分配角色:" prop="roleName">
          <el-input v-model="listUpdate.roleName" placeholder="" style="width: 410px;" class="filter-item"
                    :disabled="true" />
          <el-button type="primary" icon="Plus" @click="chooseRole">请选择角色</el-button>
        </el-form-item>
        <el-form-item label="角色拥有者:" prop="ownerName">
          <el-input v-model="listUpdate.ownerName" type="textarea" :rows="4" placeholder="" :disabled="true"
                    style="width: 410px;" />
          <el-button type="primary" icon="Plus" @click="choosePeople">请选择人员</el-button>
        </el-form-item>
        <!-- <el-form-item label="所属部门:" prop="deptName" size="small">
          <el-checkbox label="自动分配至用户隶属部门" v-model="listUpdate.deptChecked" @change="deptChecked" name="type"></el-checkbox>
        </el-form-item> -->
        <el-form-item label="授权部门" prop="deptName">
          <el-input v-model="listUpdate.deptName" placeholder="" style="width: 410px;" class="filter-item"
                    :disabled="true" />
          <el-button type="primary" icon="Plus" @click="chooseDepartment">请选择授权部门</el-button>
          <div class="placeholderDiv">如果不选择'授权部门'，则默认分配至所选用户的隶属部门(非必填项)</div>
        </el-form-item>
        <el-form-item v-if="noLimitZt" label="限制账套" prop="limitZt">
          <el-checkbox v-model="listUpdate.limitZt" :checked="listUpdate.limitZt==1" :true-label="1" :false-label="0">
            业务范围限制为授权部门所在账套
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createData('listUpdate')">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

    <!--选择角色-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="textTableMap[dialogTableStatus]"
               v-model="dialogTableVisible" class="roleDialog800">
      <el-form label-position="right" label-width="90px" :model="listTableUpdate" :inline="true"
               class="demo-form-inline demo-form-zdy">
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="listTableUpdate.rName" placeholder="角色名称" style="width: 180px;" class="filter-item"
                    />
        </el-form-item>
        <el-form-item label="角色介绍:" prop="intro">
          <el-input v-model="listTableUpdate.rIntro" placeholder="角色介绍" style="width: 180px;" class="filter-item"
                    />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onRoleQuery">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableRoleData"
        :border="true"
        header-cell-class-name="bgblue"
        style="width: 100%"
        stripe
        row-key="id"
        height="700"
      >
        <el-table-column
          prop="index"
          label="序号"
          align="center"
          min-width="5%"
        >
          <template v-slot:default="scope">
            <span>{{ (scope.$index + 1) }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rName"
          label="角色名称"
          align="center"
          min-width="15%"
        />
        <el-table-column
          prop="rIntro"
          align="center"
          label="角色介绍"
          min-width="15%"
        />
        <el-table-column
          prop="cateName"
          align="center"
          label="角色分类名称"
          min-width="15%"
        />
        <el-table-column
          min-width="6%"
          align="center"
          label="操作"
        >
          <template v-slot:default="scope">
            <el-button

              plain
              type="primary"
              @click="confirmChoose('role',scope.row)"
            >确认选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="listTableUpdate.pg_pagenum"
        :page-sizes="[100, 200, 500]"
        :page-size="listTableUpdate.pg_pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRole"
        @size-change="(val) => handleSizeChange('role', val)"
        @current-change="(val) => handleCurrentChange('role', val)"
      />

      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
      </div>
      </template>
    </el-dialog>

    <!--选择部门-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="textTableMap[dialogTableStatus]"
               v-model="dialogTableDeptVisible" class="roleDialog800">
      <el-form label-position="right" label-width="110px" :model="listTableDeptUpdate" :inline="true"
               class="demo-form-inline demo-form-zdy">
        <el-form-item label="组织机构名称:" prop="name">
          <el-input v-model="listTableDeptUpdate.oName" placeholder="组织机构名称" style="width: 180px;"
                    class="filter-item" />
        </el-form-item>
        <el-form-item label="组织机构编号:" prop="orgCode">
          <el-input v-model="listTableDeptUpdate.oCode" placeholder="组织机构编号" style="width: 180px;"
                    class="filter-item" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onDeptQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableDeptData"
        :border="true"
        header-cell-class-name="bgblue"
        style="width: 100%"
        stripe
        row-key="id"
        height="700"
      >
        <el-table-column
          prop="index"
          label="序号"
          align="center"
          min-width="5%"
        >
          <template v-slot:default="scope">
            <span>{{ (scope.$index + 1) }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="组织机构名称"
          align="center"
          min-width="15%"
        />
        <el-table-column
          prop="orgCode"
          align="center"
          label="组织机构编号"
          min-width="15%"
        />
        <el-table-column
          min-width="6%"
          align="center"
          label="操作"
        >
          <template v-slot="scope">
            <el-button

              plain
              type="primary"
              @click="confirmChoose('dept',scope.row)"
            >确认选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="listTableDeptUpdate.pg_pagenum"
        :page-sizes="[100, 200, 500]"
        :page-size="listTableDeptUpdate.pg_pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalDept"
        @size-change="(val) => handleSizeChange('dept', val)"
        @current-change="(val) => handleCurrentChange('dept', val)"
      />
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogTableDeptVisible = false">关 闭</el-button>
      </div>
      </template>
    </el-dialog>

    <!--选择人员-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="textTableMap[dialogTableStatus]"
               v-model="dialogTablePeopleVisible" class="roleDialog800">
      <el-form label-position="right" label-width="110px" :model="listTablePeopleUpdate" :inline="true"
               class="demo-form-inline demo-form-zdy">
        <el-form-item label="员工姓名:" prop="uName">
          <el-input v-model="listTablePeopleUpdate.uName" placeholder="员工姓名" style="width: 180px;"
                    class="filter-item" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onPeopleQuery(true)">查询</el-button>
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
        stripe
        row-key="id"
        height="700"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column
          width="50"
          align="center"
          type="selection"
        />
        <el-table-column
          prop="index"
          label="序号"
          align="center"
          min-width="5%"
        >
          <template v-slot:default="scope">
            <span>{{ (scope.$index + 1) }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          label="员工编号"
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
          prop="gsbmName"
          align="center"
          label="归属部门"
          min-width="15%"
        />
      </el-table>
      <el-pagination
        :current-page="listTablePeopleUpdate.pg_pagenum"
        :page-sizes="[100, 200, 500]"
        :page-size="listTablePeopleUpdate.pg_pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPeople"
        @size-change="(val) => handleSizeChange('people', val)"
        @current-change="(val) => handleCurrentChange('people', val)"
      />

      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogTablePeopleVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTablePeopleData()">
          确 认
        </el-button>
      </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
// 组织机构树查询、组织机构列表查询
import { getOrgAlltree, getOrgAll } from "@/api/org";
// 角色列表分页查询 表格、查询角色、角色用户分配的新增与修改 保存操作,删除角色用户
import { getRoleUser, getRole, postRoleUser, deleteRoleUser } from "@/api/role";
// 查询人员
import { getUser } from "@/api/user";
//
import { getRoleLimitZt } from "@/utils/auth"; // get RoleLimitZt from cookie

export default {
  data() {
    return {
      heightTable: "300px",
      props: { // 组织结构树默认格式
        value: "id", // ID字段名
        label: "name", // 显示名称
        children: "sub" // 子级字段名
      },
      noLimitZt: !getRoleLimitZt(),
      dataTree: [], // 组织结构树数据
      rowHeader: [], // 角色分配列表
      rowTableHeader: [], // 选择角色
      total: 0,
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条
        pg_pagesize: 10, // 查询第几页数据，默认第一页
        roleName: "", // 模糊匹配，角色名称
        roleId: "", // 角色主键
        ownerGsbmId: "", // 角色拥有者的归属部门主键
        ownerGsbmName: "", // 角色拥有者的归属部门名称
        ownerId: "", // 角色拥有者的主键
        ownerName: "" // 角色拥有者的用户姓名
      },
      listUpdate: { // 弹窗
        roleId: "", // 角色id
        roleName: "", // 角色名称
        limitZt: 1, // 是否限制账套
        ownerId: "", // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerName: "", // 要分配的用户name数组，多个用户名称以英文逗号“,”分隔
        useGsbm: 0, // int	bool值，是否默认使用授权用户的归属部门作为授权部门
        deptId: "", // 要授权管理的组织ID，如果使用默认部门【useGsbm==1】则此值为空
        deptName: "" // 要授权管理的组织名称，如果使用默认部门【useGsbm==1】则此值为空
      },

      owner: {
        ownerIdArray: [], // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerNameArray: [] // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
      },
      listTableUpdate: { // 查询角色
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        name: "", // 角色名称
        intro: "", // 角色介绍
        enabled: 1 // 此角色是否可用，bool值，参见枚举值定义
      },
      // 检验规则
      submitRules: {
        roleName: [
          { required: true, trigger: "change", message: "该项为必填项" }
        ],
        ownerName: [
          { required: true, trigger: "change", message: "该项为必填项" }
        ]
      },
      tableData: [], // 表格数据
      dataListUpdate: {}, // 修改时数据存储
      dialogFormVisible: false, // 角色列表表格新增或者修改弹窗显示或者隐藏 false为隐藏，true显示
      dialogStatus: "", // 角色列表表格新增或者修改状态控制
      textMap: { // 控制弹窗提示字
        update: "修改角色分配",
        create: "添加角色分配"
      },
      tableDataRoleName: [], // 角色名称集合
      totalRole: 0, // 角色表格条数
      tableRoleData: [], // 角色表格数据
      dialogTableVisible: false, // 选择角色和部门
      dialogTableStatus: "", // 角色列表表格新增或者修改状态控制
      textTableMap: {
        chooseRole: "选择角色",
        chooseDepartment: "选择部门",
        choosePeople: "选择人员"
      },
      dialogTableDeptVisible: false, // 部门表格显示隐藏
      rowTableDeptHeader: [], // 部门表格标题
      tableDeptData: [], // 部门表格内容
      totalDept: 0, // 部门表格数量
      listTableDeptUpdate: {
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        oName: "",	// 组织机构名称
        oCode: ""	// 组织机构编号
      },
      dialogTablePeopleVisible: false, // 人员表格显示隐藏
      listTablePeopleUpdate: {
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        uName: "" // 姓名
      },
      rowTablePeopleHeader: [], // 人员表格标题
      tablePeopleData: [], // 人员表格内容
      totalPeople: 0, // 人员表格数量
      multipleSelection: [] // 选中数据
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    this.onload();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onload() {
      this.onQueryOrgAlltree(); // 查询组织机构树
      this.onQuery(); // 查询
    },
    // 查询组织机构树
    onQueryOrgAlltree() {
      this.dataTree = [];
      getOrgAlltree().then(response => {
        this.dataTree = response.data;
      });
    },
    // 组织机构树点击事件
    handleNodeClick(obj, node, data) {
      this.listQuery.ownerGsbmId = obj.id; // 角色拥有者的归属部门主键
      this.listQuery.ownerGsbmName = obj.name; // 角色拥有者的归属部门名称
      this.onQuery(); // 查询
    },
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1;
      this.onQuery(); // 查询
    },
    // 查询
    onQuery() {
      this.tableData = [];
      getRoleUser(this.listQuery).then(response => {
        this.tableData = response.data;
        this.total = response.total_count;
      });
    },
    // 查询
    onQueryWithNoGsbmId() {
      this.tableData = [];
      this.listQuery.pg_pagenum = 1;
      this.listQuery.ownerGsbmId = "";
      getRoleUser(this.listQuery).then(response => {
        this.tableData = response.data;
        this.total = response.total_count;
      });
    },
    // 查询角色
    onRoleQuery() {
      this.tableRoleData = [];
      getRole(this.listTableUpdate).then(response => {
        this.tableRoleData = response.data;
        this.totalRole = response.total_count;
      });
    },
    onRoleListQuery() {
      this.listTableUpdate.pg_pagenum = 1;
      this.onRoleQuery(); // 查询
    },
    // 查询部门（表格）
    onDeptQuery() {
      this.tableDeptData = [];
      getOrgAll(this.listTableDeptUpdate).then(response => {
        this.tableDeptData = response.data;
        this.totalDept = response.total_count;
      });
    },
    onDeptListQuery() {
      this.listTableDeptUpdate.pg_pagenum = 1;
      this.onDeptQuery();
    },
    // 查询人员（表格）
    onPeopleQuery(bool) {
      this.tablePeopleData = [];
      if (bool) {
        this.listTablePeopleUpdate.pg_pagesize = 10;
        this.listTablePeopleUpdate.pg_pagenum = 1;
      }
      getUser(this.listTablePeopleUpdate).then(response => {
        this.tablePeopleData = response.data;
        this.totalPeople = response.total_count;
      });
      this.$nextTick(() => {
        this.setTableSelected();
      });
    },
    onPeopleListQuery() {
      this.listTablePeopleUpdate.pg_pagenum = 1;
      this.onPeopleQuery(false);
    },
    // 新增角色分配
    onAdd() {
      this.clearData(); // 清空添加的数据
      // this.listUpdate.deptId = this.listQuery.ownerGsbmId // 角色拥有者的归属部门主键
      // this.listUpdate.deptName = this.listQuery.ownerGsbmName // 角色拥有者的归属部门名称
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
    },
    // 清空添加的数据
    clearData() {
      this.listUpdate = { // 弹窗
        roleId: "", // 角色id
        roleName: "", // 角色名称
        limitZt: 1,
        ownerId: "", // 要分配的用户ID数组，多个用户ID以英文逗号“,”分隔
        ownerName: "", // 要分配的用户name数组，多个用户名称以英文逗号“,”分隔
        useGsbm: 1, // int	bool值，是否默认使用授权用户的归属部门作为授权部门
        deptId: "", // 要授权管理的组织ID，如果使用默认部门【useGsbm==1】则此值为空
        deptName: "" // 要授权管理的组织名称，如果使用默认部门【useGsbm==1】则此值为空
      };
    },
    // 清空角色表格查询条件
    clearRoleData() {
      this.listTableUpdate = { // 查询角色
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        name: "", // 角色名称
        intro: "", // 角色介绍
        enabled: 1 // 此角色是否可用，bool值，参见枚举值定义
      };
    },
    clearDeptData() {
      this.listTableDeptUpdate = {
        pg_pagesize: 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: 1, // 查询第几页数据，默认第一页
        name: "",	// 组织机构名称
        orgCode: ""	// 组织机构编号
      };
    },
    // 选择角色
    chooseRole() {
      this.clearRoleData(); // 清空角色表格查询条件
      this.onRoleQuery(); // 查询角色
      this.dialogTableVisible = true;
      this.dialogTableStatus = "chooseRole";
    },
    // 选择人员
    choosePeople() {
      this.onPeopleQuery(false); // 查询人员
      this.setTableSelected();
      this.dialogTablePeopleVisible = true;
      this.dialogTableStatus = "choosePeople";
    },
    // 选择部门
    chooseDepartment() {
      this.clearDeptData(); // 清空部门表格查询条件
      this.onDeptQuery(); // 查询部门（表格）
      this.dialogTableDeptVisible = true;
      this.dialogTableStatus = "chooseDepartment";
    },
    // 确认选择的人员
    createTablePeopleData() {
      if (this.multipleSelection === 0) {
        this.$message({ type: "warning", message: "请选择人员!" });
      } else {
        const ownerIdArray = [];
        const ownerNameArray = [];
        this.multipleSelection.forEach(item => {
          ownerIdArray.push(item.id);
          ownerNameArray.push(item.uName);
        });
        this.listUpdate.ownerId = ownerIdArray.join(","); // 变成字符串后，以逗号分隔
        this.listUpdate.ownerName = ownerNameArray.join(","); // 变成字符串后，以逗号分隔
        this.dialogTablePeopleVisible = false;
      }
    },
    // 添加角色分配保存
    createData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        if (valid) {
          const req = { ...this.listUpdate };
          postRoleUser(req).then(response => {
            this.dialogFormVisible = false;
            this.$message({ message: (this.dialogStatus === "create" ? "添加成功" : "修改成功"), type: "success" });
            this.onQuery(); // 查询
          });
        } else {
          this.$message({ message: "请填写必填项", type: "warning" });
          return false;
        }
      });
    },
    handleSizeChange(type, val) {
      if (type === "load") {
        this.listQuery.pg_pagesize = val;
        this.onQuery(); // 查询
      } else if (type === "people") {
        this.listTablePeopleUpdate.pg_pagesize = val;
        this.onPeopleQuery(false); // 查询
      } else if (type === "role") {
        this.listTableUpdate.pg_pagesize = val;
        this.onRoleQuery(); // 查询
      } else if (type === "dept") {
        this.listTableDeptUpdate.pg_pagesize = val;
        this.onDeptQuery(); // 查询
      }
    },
    handleCurrentChange(type, val) {
      if (type === "load") {
        this.listQuery.pg_pagenum = val;
        this.onQuery(); // 查询
      } else if (type === "people") {
        this.listTablePeopleUpdate.pg_pagenum = val;
        this.onPeopleQuery(false); // 查询
      } else if (type === "role") {
        this.listTableUpdate.pg_pagenum = val;
        this.onRoleQuery(); // 查询
      } else if (type === "dept") {
        this.listTableDeptUpdate.pg_pagenum = val;
        this.onDeptQuery(); // 查询
      }
    },
    deleteRole(row) {
      this.dataListUpdate = row;
      this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteRoleUser({ id: row.id }).then(response => {
          this.$message({ type: "success", message: "删除成功!" });
          this.onQuery(); // 查询
        });
      }).catch(() => {
        this.$message({ type: "info", message: "已取消删除" });
      });
    },
    confirmChoose(type, row) {
      if (type === "role") {
        this.listUpdate.limitZt = row.limitZt; // 是否限制账套
        this.listUpdate.roleId = row.id; // 角色id
        this.listUpdate.roleName = row.rName; // 角色名称
        this.dialogTableVisible = false;
      } else if (type === "dept") {
        this.listUpdate.limitZt = row.limitZt || 0; // 是否限制账套
        this.listUpdate.deptId = row.id; // 要授权管理的组织ID，如果使用默认部门【useLsbm==1】则此值为空
        this.listUpdate.deptName = row.name; // 要授权管理的组织名称，如果使用默认部门【useLsbm==1】则此值为空
        this.listUpdate.useGsbm = 0; // bool值，是否默认使用授权用户的归属部门作为授权部门
        this.dialogTableDeptVisible = false;
      }
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
    setTableSelected() {
      this.tablePeopleData.forEach(item => {
        this.multipleSelection.some(subItem => {
          if (item.id === subItem.id) {
            this.$refs.tableRef.toggleRowSelection(item, true);
            return true;
          } else {
            return false;
          }
        });
      });
    },
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
    }
  }
};
</script>
<style scoped>
.border {
  border: 1px solid #ebebeb;
  border-radius: 8px;
  -webkit-box-shadow: 0 0 15px 0 rgba(232, 237, 250, .6), 0 7px 11px 0 rgba(232, 237, 250, .5);
  box-shadow: 0 0 15px 0 rgba(232, 237, 250, .6), 0 7px 11px 0 rgba(232, 237, 250, .5);
  height: 600px;
}

.p-10 {
  padding: 0 10px 10px 10px
}

.placeholderDiv {
  font-size: 12px;
  color: red;
}
</style>

