<template>
  <el-dialog draggable :title="title" v-model="dialogFormVisible" width="700px">
    <el-form :model="form" :rules="rules" ref="form">
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
        prop="departmentNumber"
      >
        <el-input :disabled="!!form.departmentId" v-model.trim="form.departmentNumber" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addOrganizationCancel">取 消</el-button>
        <el-button v-if="isModel" type="primary" @click="addOrganizationSure">确 定</el-button>
        <el-button v-else type="primary" @click="editOrganizationSure">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import {
  departmentAdd,
  getOrganizationDetail,
  departmentUpdate
} from "@/sys/api/organization";

export default {
  name: "orgForm",
  data() {
    return {
      //添加用户弹出框数据
      isModel: true,
      dialogFormVisible: false,
      title: "",
      initForm: {
        departmentId: '',
        name: "",
        departmentNumber: "",
      },
      form: {},
      formLabelWidth: "120px",
      rules: {
        name: [{required: true, message: "请输部门名称", trigger: "blur"}],
        departmentNumber: [
          {required: true, message: "请输部门代码", trigger: 'blur'},
        ],
      },
    };
  },
  methods: {
    addOrganization() {
      this.isModel = true;
      this.dialogFormVisible = true;
      this.title = "添加部门"
      this.$nextTick(()=>{
        this.$refs.form?.clearValidate();
      })
    },
    //添加部门确定按钮
    addOrganizationSure() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await departmentAdd(this.form)
          this.dialogFormVisible = false
          this.$message.success("添加部门成功!")
          this.$emit('refresh', {});
        } else {
          return false;
        }
      });
    },
    //添加部门取消按钮
    addOrganizationCancel() {
      this.dialogFormVisible = false
      this.form = {
        ...this.initForm
      }
    },
    //编辑部门
    async editOrganization(departmentId) {
      this.isModel = false
      this.dialogFormVisible = true
      this.title = "修改部门"
      const getDetailInfo = await getOrganizationDetail(departmentId)
      this.form = getDetailInfo.data
      this.$nextTick(()=>{
        this.$refs.form?.clearValidate();
      })
    },
    //修改部门确定按钮
    editOrganizationSure() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await departmentUpdate(this.form)
          this.dialogFormVisible = false
          this.$message.success("修改部门成功!")
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
