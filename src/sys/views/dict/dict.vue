<template>
  <div class="filter-container searchCon ">
    <el-form :inline="true" :model="model">
      <el-form-item prop="title" label="字典代码或名称：">
        <el-input style="width: 130px;" @keyup.enter="handleQuery" v-model="model.code" clearable></el-input>
      </el-form-item>
      <el-form-item prop="title" label="字典代码或名称：">
        <xui-dict-select :widthFull="false" style="width: 100px" item-code="dictType" v-model="model.scope" clearable></xui-dict-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="handleQuery">查询</el-button>
        <el-button icon="Plus" type="primary" @click="handleAdd()">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table ref="multipleTable"
            class="el-table__row-pointer"
            :data="dataList" highlight-current-row @current-change="handleCurrentChange" border
            stripe>
    <el-table-column label="名称" prop="name" min-width="100" align="center"></el-table-column>
    <el-table-column label="编码" prop="code" min-width="100" align="center"></el-table-column>
    <el-table-column label="顺序号" prop="sort" width="80" align="center"></el-table-column>
    <el-table-column label="操作" width="160" align="center">
      <template #default="scope">
        <el-button-group>
          <el-button type="primary" icon="Edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" icon="Delete" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog draggable :close-on-click-modal="false" :title="initModel.id?'修改': '新增'" width="600"
             v-if="dialogFormVisible" v-model="dialogFormVisible" class="roleDialog">
    <el-form ref="formRef" label-width="100px" :rules="rules" :model="initModel">
      <el-form-item prop="name" label="名称">
        <el-input v-model="initModel.name" :maxlength="50" :minlength="1"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="编码">
        <el-input v-model="initModel.code" :disabled="!!initModel.id" :maxlength="50" :minlength="1"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="类型">
        <xui-dict-select item-code="dictType" v-model="initModel.scope"></xui-dict-select>
      </el-form-item>
      <el-form-item prop="value" label="顺序号">
        <el-input-number v-model="initModel.sort" :min="0" :maxlength="4"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save()">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref
} from "vue";
import Constants from "@/_public/utils/constants";
import {copyExistProps} from '@/_public/utils/obj'
import {
  ElMessage,
  ElMessageBox
} from "element-plus";
import {
  getDictList,
  deleteDict,
  insertOrUpdateDict
} from "@/sys/api/dict";
import {deepClone} from "@/_public/utils";


export default defineComponent({
  name: "list",

  data() {
    return {
      dialogFormVisible: false,
      initModel: {
        id: '',
        name: '',
        code: '',
        itemCode: '',
        sort: '',
        scope: ''
      },
      rules: {
        code: [{
          required: true,
          message: '字典项编码不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '字典项名称不能为空',
          trigger: 'blur'
        }],
       /* scope: [{
          required: true,
          message: '字典项类型不能为空',
          trigger: 'change'
        }]*/
      }
    }
  },
  methods: {
    init(selectData) {
      this.initModel = {
        id: '',
        name: '',
        code: '',
        itemCode: '',
        sort: '',
        scope: ''
      }
      if (selectData !== null && selectData !== undefined) {
        copyExistProps(this.initModel, selectData)
      } else {
        this.setSort(this.initModel);
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      })
    },
    setSort(data) {
      let dataList = this.dataList;
      if (!dataList || dataList.length === 0) {
        data.sort = 1;
      } else {
        let max = 1;
        dataList.forEach(item => {
          if (item.sort > max) {
            max = item.sort;
          }
        })
        data.sort = max + 2;
      }
    },
    save() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return;
        }
        this.initModel.itemCode = this.initModel.code
        delete this.initModel.children;
        insertOrUpdateDict(this.initModel).then(response => {
          if (response.code === Constants.respCode.success) {
            this.$message.success('保存/修改成功');
            this.dialogFormVisible = false;
            this.getDataList();
          } else {
            this.$message.error(response.msg)
          }
        })
      })
    },
    handleEdit(rowData) {
      this.init(rowData);
    },
    handleAdd() {
      this.init();
    },
    handleCurrentChange(val) {
      this.$emit("updateItem", val)
    }
  },
  watch: {
    dataList: function () {
      this.$nextTick(function () {
        this.$refs.multipleTable.setCurrentRow(this.dataList[0])
      })
    }
  },
  setup() {
    const dataList = ref([])
    const model = reactive({
      code: '',
      scope: Constants.dictType.biz
    })
    const getKeyWords = () => {
      return {
        ...model
      };
    }
    const getDataList = async () => {
      const response = await getDictList(getKeyWords());
      if (response.code === Constants.respCode.success) {
        dataList.value = response.data;
      } else {
        ElMessage({
          message: '查询失败',
          type: 'error',
        })
      }
    }
    const handleQuery = () => {
      getDataList();
    }
    const handleDelete = (rowData) => {
      ElMessageBox.confirm(
          '确定删除？',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            let params = {
              id: rowData.id
            }
            deleteDict(params).then(response => {
              if (response.code == Constants.respCode.success) {
                ElMessage({
                  message: '删除成功',
                  type: 'success',
                })
              }
              getDataList();
            })
          })
    }
    onMounted(() => {
      getDataList();
    })
    return {
      dataList,
      model,
      getDataList,
      handleDelete,
      getKeyWords,
      handleQuery
    }
  }
})
</script>

<style>
</style>
