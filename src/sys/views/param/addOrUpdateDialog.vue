<template>
	<el-dialog draggable :close-on-click-modal="false" :title="model.id?'修改': '新增'" width="600" v-if="dialogFormVisible"
		v-model="dialogFormVisible" class="roleDialog">
		<el-form ref="formRef" label-width="100px" :rules="rules" :model="model">
			<el-form-item prop="code" label="参数编码" style="width: 90%">
				<el-input v-model="model.code" :disabled="!!model.id" :maxlength="50" :minlength="1"></el-input>
			</el-form-item>
			<el-form-item prop="name" label="参数名" style="width: 90%">
				<el-input v-model="model.name" :maxlength="50" :minlength="1"></el-input>
			</el-form-item>
			<el-form-item prop="value" label="参数值" style="width: 90%">
				<el-input v-model="model.value" :minlength="1" type="textarea" :autosize="{minRows:5}"></el-input>
			</el-form-item>
			<el-form-item prop="remark" label="备注" style="width: 90%">
				<el-input v-model="model.remark" :maxlength="255" type="textarea" :rows="3"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="saveData">
					保存
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script>
	import Constants from '@/_public/utils/constants'
	import {
		insertOrUpdateParam
	} from "@/sys/api/param";
	export default {
		name: "addOrUpdateDialog",
		data() {
			return {
				dialogFormVisible: false,
				initModel: {
					id: '', //
					code: '', //
					name: '',
					value: '',
					remark: '',
				},
				list: [],
				model: {},
				rules: {
					code: [{
						required: true,
						trigger: 'blur',
						message: '参数编码不能为空'
					}],
					name: [{
						required: true,
						trigger: 'blur',
						message: '参数名不能为空'
					}],
					value: [{
						required: true,
						trigger: 'blur',
						message: '参数值不能为空'
					}]
				}
			}
		},
		methods: {
			init(selectData) {
				this.initModel = {
					id: '', //
					code: '', //
					name: '',
					value: '',
					remark: '',
				}
				if (selectData !== null && selectData !== undefined) {
					this.initModel = selectData
				}
				this.model = {
					...this.initModel
				}
				this.dialogFormVisible = true;
				this.$nextTick(() => {
					this.$refs.formRef.clearValidate();
				})
			},
			saveData() {
				this.$refs.formRef.validate(valid => {
					if (!valid) {
						return;
					}
					insertOrUpdateParam(this.model).then(response => {
						if (response.code === Constants.respCode.success) {
							this.$message.success('保存/修改成功');
							this.dialogFormVisible = false;
							this.$emit('refresh', {});
						}else{
							this.$message.error(response.msg)
						}
					})
				})
				//更新后初始化

			},
		}
	}
</script>

<style scoped>
</style>
