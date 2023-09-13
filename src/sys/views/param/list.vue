<template>
	<div class="app-container app-containerC">
		<div class="filter-container searchCon">
			<el-form :inline="true" :model="model">
				<el-form-item prop="title" label="参数编码：">
					<el-input @keyup.enter="handleQuery" v-model="model.code" clearable ></el-input>
				</el-form-item>
				<el-form-item prop="title" label="参数名称：">
					<el-input @keyup.enter="handleQuery" v-model="model.name" clearable ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button icon="Search" @click="handleQuery">查询</el-button>
					<el-button icon="Plus" type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table highlight-current-row  ref="multipleTable" :data="dataList" v-loading="loading" border stripe>
			<el-table-column type="index" label="序号" min-width="160" align="center"></el-table-column>
			<el-table-column label="参数编号" prop="code" min-width="160" align="center"></el-table-column>
			<el-table-column label="参数名" prop="name" min-width="160" align="center"></el-table-column>
			<el-table-column label="参数值" prop="value" min-width="300" align="center"></el-table-column>
			<el-table-column label="备注" prop="remark" min-width="160" align="center" ></el-table-column>
			<el-table-column label="操作" min-width="160" align="center">
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
		<xui-pagination size="small" @page-change="handlePageChange" layout="total, sizes, prev, pager, next, jumper"
			:page-num="page" :page-size="limit" :total="total">
		</xui-pagination>
		<add-or-update-dialog ref="dialogRef" @success="getDataList" @refresh="getDataList"></add-or-update-dialog>
	</div>
</template>

<script lang="ts">
	import {
		defineComponent,
		onMounted,
		reactive,
		ref
	} from "vue";
	import Constants from "@/_public/utils/constants";
	import {
		ElMessage,
		ElMessageBox
	} from "element-plus";
	import {
		getParamList,
		deleteParam
	} from "@/sys/api/param";
	import addOrUpdateDialog from "@/sys/views/param/addOrUpdateDialog.vue"
	export default defineComponent({
		name: "list",
		components: {
			addOrUpdateDialog
		},
		setup() {
			
			const page = ref(1);
			const limit = ref(20);
			const total = ref(0);
			const dataList = ref([]);
			const loading = ref(false);
			const dialogRef = ref(null);
			const model = reactive({
				code: '',
				name: '',
				value: '',
				remark: ''
			})
			const getParams = () => {
				return {
					pageNo: page.value,
					pageSize: limit.value,
					...model,
				};
			}



			const getDataList = async () => {
				const response = await getParamList(getParams());
				if (response.code === Constants.respCode.success) {
					dataList.value = response.data.list;
					total.value = response.data.totalCount;
				} else {
					ElMessage({
						message: '查询失败',
						type: 'error',
					})
				}

			}

			const handleQuery = () => {
				page.value = 1;
				getDataList();
			}
			const handleAdd = () => {
				dialogRef.value.init(null,dataList);

			}
			const handleEdit = (rowData) => {

				dialogRef.value.init(rowData,dataList);
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
						deleteParam(rowData).then(response => {
							if (response.code == Constants.respCode.success) {
								ElMessage({
									message: '删除成功',
									type: 'success',
								})
							}
							getDataList()
						})
					})
			}

			const handlePageChange = ({
				pageNum,
				pageSize
			}) => {
				page.value = pageNum;
				limit.value = pageSize;
				getDataList();
			}

			onMounted(() => {
				getDataList();
			})
			return {
				model,
				dataList,
				page,
				limit,
				total,
				loading,
				dialogRef,
				handleQuery,
				getDataList,
				handleAdd,
				handleEdit,
				handleDelete,
				handlePageChange
			}
		}
	})
</script>

<style scoped>
</style>