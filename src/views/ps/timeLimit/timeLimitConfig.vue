<template>
  <div class="app-container app-containerC">

    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="工艺类型" size="mini">
          <el-input v-model="listQuery.code" placeholder="工艺类型" style="width: 180px;" class="filter-item"
                    size="mini" clearable />
        </el-form-item>
        <el-form-item label="期量表名称" size="mini">
          <el-input v-model="listQuery.name" placeholder="期量表名称" style="width: 180px;" class="filter-item"
                    size="mini" clearable />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Edit" @click="addLimit(true)">新增期量</el-button>
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
        prop="code"
        label="工艺类型"
        align="center"
        min-width="10%"
      />
      <el-table-column
        prop="name"
        label="期量表名称"
        align="center"
        min-width="10%"
      />
      <el-table-column
        prop="productType"
        label="产品类型"
        align="center"
        min-width="5%"
      >
        <template v-slot:default="scope">
          <el-tag v-if="scope.row.productType ==0 ">换流变</el-tag>
          <el-tag v-else-if="scope.row.productType ==1 ">变压器</el-tag>
          <el-tag v-else-if="scope.row.productType ==2 ">电抗器</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="longestPath"
        label="总时长"
        align="center"
        min-width="5%"
      />
      <el-table-column
        prop="coilQuantity"
        label="相数"
        align="center"
        min-width="5%"
      />
      <el-table-column
        prop="voltageLevel"
        label="电压等级"
        align="center"
        min-width="5%"
      />
      <el-table-column
        prop="cuttingQuantity"
        label="横剪下料片数"
        align="center"
        min-width="5%"
      />
      <el-table-column
        prop="bakingQuantity"
        label="饼数"
        align="center"
        min-width="5%"
      />
      <el-table-column
        min-width="10%"
        align="center"
        label="操作"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            @click="queryDetailHead(scope.row)"
          >查看
          </el-button>
          <el-button
            size="mini"
            plain
            type="primary"
            icon="Edit"
            @click="addLimit(scope.row,false)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="Delete"
            @click="deleteLimit(scope.row)"
          >删除
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

    <!-- 新增期量弹窗 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title=title v-model="addMainDialogVisible"
               class="roleDialog">
      <el-form label-position="right" label-width="160px" :model="mainAddOrUpdateForm" :rules="mainRules"
               ref="mainRuleForm">
        <el-form-item label="工艺类型:" size="mini" prop="name">
          <el-input v-model="mainAddOrUpdateForm.code" placeholder="工艺类型" style="width: 180px;" class="filter-item"
                    size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="期量表名称:" size="mini" prop="code">
          <el-input v-model="mainAddOrUpdateForm.name" placeholder="期量表名称" style="width: 180px;"
                    class="filter-item"
                    size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="相数:" size="mini" prop="coilQuantity">
          <el-input v-model="mainAddOrUpdateForm.coilQuantity" typt="number" placeholder="相数" style="width: 180px;"
                    class="filter-item" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="电压等级:" size="mini" prop="voltageLevel">
          <el-input v-model="mainAddOrUpdateForm.voltageLevel" typt="number" placeholder="电压等级"
                    style="width: 180px;"
                    class="filter-item" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="横减下料片数:" size="mini" prop="cuttingQuantity">
          <el-input v-model="mainAddOrUpdateForm.cuttingQuantity" typt="number" placeholder="横减下料片数"
                    style="width: 180px;" class="filter-item" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="饼数:" size="mini" prop="bakingQuantity">
          <el-input v-model="mainAddOrUpdateForm.bakingQuantity" typt="number" placeholder="饼数" style="width: 180px;"
                    class="filter-item" size="mini">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <!-- <el-button size="mini" @click="resetForm('mainRuleForm')">取 消</el-button> -->
        <el-button size="mini" @click="addMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('mainRuleForm')">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

    <el-dialog v-dialogDrag :close-on-click-modal="false" title="查看期量明细" v-model="detailDialog" width="70%">
      <el-form :inline="true" :model="detailQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="节点名称" size="mini">
          <el-input v-model="detailQuery.nodeName" placeholder="节点名称" style="width: 180px;" class="filter-item"
                    size="mini" clearable />
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Search" @click="queryDetail()">查询</el-button>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="Edit" @click="addDialogVisible = true">新增节点</el-button>
        </el-form-item>
      </el-form>
      <el-table highlight-current-row
                :data="detailData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                stripe
                default-expand-all
                v-loading="loadingData"
                height="800px"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          prop="type"
          label="类型"
          width="150"
          align="center">
          <template v-slot="scope">
            <span v-if="scope.row.type === 0">设计</span>
            <span v-if="scope.row.type === 1">采购</span>
            <span v-if="scope.row.type === 2">生产</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nodeName"
          label="节点"
          align="center">
        </el-table-column>
        <el-table-column
          prop="duration"
          label="周期"
          align="center">
          <template v-slot="scope">
            <span v-if="scope.row.duration">{{ scope.row.duration }} 天</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" v-if="scope.row.type == null" style="margin-left: 60px;"
                       @click="updateDetail(scope.row)">编辑节点
            </el-button>
            <el-button type="danger" size="mini" v-if="scope.row.type == null" style="margin-left: 60px;"
                       @click="deleteDetail(scope.row)">删除节点
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增节点弹窗 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="新增" v-model="addDialogVisible" class="roleDialog">
      <el-form label-position="right" label-width="160px" :model="addOrUpdateForm" :rules="deRules" ref="deRuleForm">
        <el-form-item label="节点类型:" size="mini" prop="nodeType">
          <el-select v-model="addOrUpdateForm.nodeType" clearable placeholder="请选择节点类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点名称:" size="mini" prop="nodeId">
          <el-select multiple value-key="id" v-model="addOrUpdateForm.nodeIds" clearable placeholder="请选择节点">
            <el-option
              v-for="item in nodeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否计算" size="mini" prop="isComputed">
          <el-radio-group v-model="addOrUpdateForm.isComputed">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="周期:" size="mini" prop="duration">
          <el-input v-model="addOrUpdateForm.duration" placeholder="周期" style="width: 180px;" class="filter-item"
                    size="mini">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <!-- <el-button size="mini" @click="resetForm('deRuleForm')">取 消</el-button> -->
        <el-button size="mini" @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('deRuleForm')">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

    <!-- 修改节点弹窗 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改" v-model="dialogFormEditVisible"
               class="roleDialog"
               @close="dialogFormClosed">
      <el-form label-position="right" label-width="160px" :model="addOrUpdateForm" :rules="deRules" ref="deRuleForm">
        <el-form-item label="节点类型:" size="mini" prop="nodeType">
          <el-select v-model="addOrUpdateForm.nodeType" clearable placeholder="请选择节点类型" disabled>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点名称:" size="mini" prop="nodeId">
          <el-select v-model="addOrUpdateForm.nodeId" clearable placeholder="请选择节点" disabled>
            <el-option
              v-for="item in nodes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否计算" size="mini" prop="isComputed">
          <el-radio-group v-model="addOrUpdateForm.isComputed">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="周期:" size="mini" prop="duration">
          <el-input v-model="addOrUpdateForm.duration" placeholder="周期" style="width: 180px;" class="filter-item"
                    size="mini">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <!-- <el-button size="mini" @click="resetForm('deRuleForm')">取 消</el-button> -->
        <el-button size="mini" @click="dialogFormEditVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('deRuleForm')">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import treeTransfer from 'el-tree-transfer' // 引入
// 设备分类查询
import {
  queryMainList,
  queryDeList,
  delLimitDe,
  insertOrUpdateLimitDe,
  delMainLimit,
  insertOrUpdateMainLimit
} from "@/api/timeLimit";
import { findByType } from "@/api/plan";
import { ElMessage } from "element-plus";

export default {
  name: "timeLimitConfig",
  data() {
    return {
      total: 0, // 角色列表表格总条数
      listQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        code: null, // 模糊匹配，工艺类型
        name: null // 期量表名称
      },
      listUpdate: {
        eqpClassId: "", // 分类id
        name: "", // 模糊匹配，设备分类名称
        toAndonTime: 0 // 安灯提报时间上限
      },
      tableData: [], // 角色分类列表表格数据
      formLabelWidth: "120px",
      dialogFormEditVisible: false,
      detailQuery: {
        limitId: null,
        nodeName: null
      },
      detailDialog: false,
      detailData: [],
      detailNodes: [],
      loadingData: true,
      options: [{
        value: 0,
        label: "设计"
      }, {
        value: 1,
        label: "采购"
      }, {
        value: 2,
        label: "生产"
      }],
      nodes: [],
      nodeOptions: null,
      mainAddOrUpdateForm: {
        id: null,
        name: null,
        code: null,
        coilQuantity: null,
        voltageLevel: ""
      },
      addOrUpdateForm: {
        id: null,
        nodeType: null,
        nodeId: null,
        nodeIds: [],
        duration: null,
        isComputed: 1,
        timeLimitId: null
      },
      addDialogVisible: false,
      mainRules: {
        name: [{ required: true, message: "请输入期量名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入期量编号", trigger: "blur" }],
        coilQuantity: [{ required: true, message: "请输入相数", trigger: "blur" }]
      },
      deRules: {
        nodeType: [{ required: true, message: "请选择类型", trigger: "change" }],
        // nodeId: [{ required: true, message: "请选择节点", trigger: "change" }],
        duration: [{ required: true, message: "请输入周期", trigger: "blur" }],
        isComputed: [{ required: true, message: "请确认是否计算", trigger: "change" }]
      },
      addMainDialogVisible: false,
      title: null
    };
  },
  mounted() {
    this.onload();
  },
  computed: {
    nodeType() {
      return this.addOrUpdateForm.nodeType;
    }
  },
  watch: {
    nodeType: function(newValue, oldValue) {
      this.nodeOptions = [];
      this.nodeOptions = this.nodes.filter(item => item.type === newValue && this.detailNodes.indexOf(item.id) == -1);
    }
  },
  methods: {
    onload() {
      this.onQuery(); // 查询
      this.queryNodes();
    }, // 查询
    onBtnQuery() {
      this.listQuery.pg_pagenum = 1;
      this.onQuery();
    },
    // 查询
    onQuery() {
      this.tableData = [];
      queryMainList(this.listQuery).then(response => {
        this.tableData = response.data;
        this.total = response.total_count;
      });
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val;
      this.onQuery(); // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val;
      this.onQuery(); // 查询
    },
    queryDetailHead(row){
      this.detailDialog = true;
      this.detailQuery.limitId = row.id;
      this.timeLimitId=row.id;
      this.addOrUpdateForm.timeLimitId = row.id;
      this.queryDetail()
    },
    queryDetail() {
      this.detailData = [],
        queryDeList(this.detailQuery).then(res => {
          let typeArr = res.data.map(item => {
            return item.nodeType;
          });
          this.detailNodes = [];
          this.detailNodes = res.data.map(item => {
            return item.nodeId;
          });
          typeArr = Array.from(new Set(typeArr));
          typeArr.forEach(item => {
            this.detailData.push({
              "id": Math.random(),
              "type": item,
              "children": res.data.filter(i => i.nodeType === item)
            });
          });
          this.loadingData = false;
        });
    },
    queryNodes() {
      findByType().then(res => {
        this.nodes = res.data;
      });
    },
    updateDetail(row) {
      this.addOrUpdateForm.id = row.id;
      this.addOrUpdateForm.nodeId = row.nodeId;
      this.addOrUpdateForm.nodeType = row.nodeType;
      this.addOrUpdateForm.duration = row.duration;
      this.addOrUpdateForm.isComputed = row.isComputed;
      this.dialogFormEditVisible = true;
    },
    deleteLimit(row) {
      this.$confirm("此操作将永久删除该条期量, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delMainLimit({ id: row.id }).then(res => {
          if (res.err_code === 10000) {
            this.$message.success("删除成功！");
            this.onQuery();
          } else this.$message.error("删除失败" + res.err_msg);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    deleteDetail(row) {
      this.$confirm("此操作将永久删除该条期量节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delLimitDe({ id: row.id }).then(res => {
          if (res.err_code === 10000) {
            this.$message.success("删除成功！");
            this.queryDetail();
          } else this.$message.error("删除失败" + res.err_msg);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    addOrUpdateMain() {
      insertOrUpdateMainLimit(this.mainAddOrUpdateForm).then(res => {
        if (res.err_code === 10000) {
          if (this.mainAddOrUpdateForm.id == null) {
            this.$message.success("新增成功！");
          } else {
            this.$message.success("修改成功！");
          }
          this.onQuery();
        } else {
          this.$message.error("操作失败" + res.err_msg);
        }

        this.addMainDialogVisible = false;
        this.mainAddOrUpdateForm.id = null;
        this.mainAddOrUpdateForm.name = null;
        this.mainAddOrUpdateForm.code = null;
        this.mainAddOrUpdateForm.coilQuantity = null;
        this.mainAddOrUpdateForm.voltageLevel = null;
      });
    },
    addOrUpdateDe() {
      console.log(this.addOrUpdateForm)
      insertOrUpdateLimitDe({entity:this.addOrUpdateForm,nodeIds:this.addOrUpdateForm.nodeIds}).then(res => {
        if (res.err_code === 10000) {
          if (this.addOrUpdateForm.id == null) {
            this.addDialogVisible = false;
            this.$message.success("新增成功！");
          } else {
            this.dialogFormEditVisible = false;
            this.$message.success("修改成功！");
          }
          this.queryDetail();
        } else {
          this.dialogFormEditVisible = false;
          this.addDialogVisible = false;
          this.$message.error("操作失败" + res.err_msg);
        }

        this.addOrUpdateForm.id = null;
        this.addOrUpdateForm.nodeType = null;
        this.addOrUpdateForm.nodeId = null;
        this.addOrUpdateForm.nodeIds = null;
        this.addOrUpdateForm.duration = null;
        this.addOrUpdateForm.isComputed = 1;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(formName);
          if (formName === "deRuleForm") this.addOrUpdateDe();
          else this.addOrUpdateMain();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addLimit(row, isAdd) {
      this.addMainDialogVisible = true;
      if (isAdd) {
        this.title = "新增期量";
        this.mainAddOrUpdateForm.id = null;
        this.mainAddOrUpdateForm.name = null;
        this.mainAddOrUpdateForm.code = null;
        this.mainAddOrUpdateForm.coilQuantity = null;
        this.mainAddOrUpdateForm.voltageLevel = null;
      } else {
        this.title = "编辑期量";
        this.mainAddOrUpdateForm.id = row.id;
        this.mainAddOrUpdateForm.name = row.name;
        this.mainAddOrUpdateForm.code = row.code;
        this.mainAddOrUpdateForm.coilQuantity = row.coilQuantity;
        this.mainAddOrUpdateForm.voltageLevel = row.voltageLevel;
      }
    },
    dialogFormClosed() {
      this.addOrUpdateForm.id = null;
      this.addOrUpdateForm.nodeType = null;
      this.addOrUpdateForm.nodeId = null;
      this.addOrUpdateForm.nodeIds = null;
      this.addOrUpdateForm.duration = null;
      this.addOrUpdateForm.isComputed = 1;
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>
