<template>
  <el-dialog draggable :title="title" v-model="dialogFormVisible" width="700px">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item v-if="form.fId"
                    label="父节点名称"
                    :label-width="formLabelWidth"
                    prop="fName"
      >
        <el-input v-model.trim="form.fName" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="form.fId"
                    label="父节点代码"
                    :label-width="formLabelWidth"
                    prop="fOrgCode"
      >
        <el-input v-model.trim="form.fOrgCode" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item
          label="部门名称"
          :label-width="formLabelWidth"
          prop="name"
      >
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
          label="部门代码"
          :label-width="formLabelWidth"
          prop="orgCode"
      >
        <el-input v-model.trim="form.orgCode" autocomplete="off"></el-input>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import {
  insertOrUpdate,
} from "@/sys/api/dataPermissionOrg";
import constants from "@/_public/utils/constants";

export default {
  name: "orgForm",
  data() {
    return {
      //添加用户弹出框数据
      isModel: true,
      dialogFormVisible: false,
      title: "",
      initForm: {
        id: '',
        name: '',
        orgCode: '',
        fdncode: '',
        fId: '',
        fOrgCode: '',
        fName: '',
        domainDataDisabled: ''
      },
      form: {},
      formLabelWidth: "140px",
      rules: {
        name: [{required: true, message: "请输部门名称", trigger: "blur"}],
        departmentNumber: [
          {required: true, message: "请输部门代码", trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    addSubOrganization(parent) {
      this.form = {
        ...this.model,
        fdncode: parent.dncode,
        fOrgCode: parent.orgCode,
        fId: parent.cid,
        fName: parent.name,
        domainDataDisabled: constants.flag.n
      }
      this.dialogFormVisible = true;
      this.title = "新增"
      this.$nextTick(() => {
        this.$refs.formRef?.clearValidate();
      })
    },
    //编辑部门
    async editOrganization(row) {
      this.form = {
        ...this.model,
        id: row.id,
        name: row.name,
        orgCode: row.orgCode
      }
      this.dialogFormVisible = true
      this.title = "修改"
      this.$nextTick(() => {
        this.$refs.formRef?.clearValidate();
      })
    },
    //修改部门确定按钮
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          await insertOrUpdate(this.form)
          this.dialogFormVisible = false
          this.$message.success("数据处理成功!")
          this.$emit('refresh', {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>
