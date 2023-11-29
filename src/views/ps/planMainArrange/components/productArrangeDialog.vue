<template>
	<el-dialog draggable :close-on-click-modal="false" title="计划编制" v-model="dialogVisible" class="roleDialog">
		<el-form ref="formRef" label-width="120px" :model="model">
			<el-row>
				<el-col :span="12">
					<el-form-item label="生产号:" prop="productNo">
						<el-input v-model="model.productNo" disabled />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="工序:" prop="gx">
						<xui-dict-select item-code="yn" class="width100Percent" v-model="model.gx"></xui-dict-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="计划时间:" prop="time" >
						<el-date-picker v-model="time" @change="dateChange" type="datetimerange"
							:popper-options="pickerOptions0" 
							:disabled-date = "disabledDate"
							value-format="YYYY-MM-DD HH:mm:ss" 	
							range-separator="至"
							start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="工位" name="" v-if="model.opType != 3">
						<el-select v-model="model.work"  placeholder="工位选择" >
							<el-option v-for="items in work" :key="items.id" :label="items.name" :value="items.id" />
						</el-select>
					</el-form-item>
					<el-form-item label="工位" name="" v-if="model.opType == 3">
						<el-table :data="coilData">
							<el-table-column prop="name" label="线圈类型/项号" width="140px">
								<template #default="scope">
									<el-input v-model="scope.row.name" disabled :min="0"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="count" label="数量" width="140px">
								<template #default="scope">
									<el-input-number v-model="scope.row.count" :min="0"></el-input-number>
								</template>
							</el-table-column>
							<el-table-column prop="work" label="工位" width="140px">
								<template #default="scope">
									<el-select v-model="scope.row.work" size="small" placeholder="工位选择"
										style="width: 120px;">
										<el-option v-for="items in work" :key="items.id" :label="items.name"
											:value="items.id" />
									</el-select>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveData">保 存</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick } from "vue";
	import { deepClone } from "@/utils";

	const emits = defineEmits(["handleRefresh"])

	const dialogVisible = ref(false);
	
	const initModel = {
		productNo: '',
		gx: 'y',
		opType: 3,
		work:'',
		works:''
	}
	
	const coilData = reactive([
		{
			name:"高压线圈A",
			count:1,
			work:"",
		},
		{
			name:"高压线圈B",
			count:1,
			work:"",
		},
		{
			name:"高压线圈C",
			count:1,
			work:"",
		},
		{
			name:"低压线圈A",
			count:1,
			work:"",
		},
		{
			name:"低压线圈B",
			count:1,
			work:"",
		},
		{
			name:"低压线圈C",
			count:1,
			work:"",
		}
	])
	
	const work = reactive([])
	
	const pickerOptions0 = {
		placement: 'auto',
		modifiers: [
		  {
		    name: 'flip',
		    options: {
				fallbackPlacements:['bottom'],
				allowedAutoPlacements: ['top','bottom'], // by default, all the placements are allowed
		    },
		  },
		],
	}
	
	const disabledDate = (dataTime: Date) => {
	  return dataTime.getTime() < Date.now() - 8.64e7;
	}
	
	const model = reactive(deepClone(initModel));

	const time = ref<[String,String]>( [
		"",
		""	
	]);
	
	const dateChange = (event: boolean)=>{
		if (event) {
			model.planStartTime = time.value[0] // 开始日期
			model.planEndTime =   time.value[1] // 结束日期
		} else {
			model.planStartTime = '' // 开始日期
			model.planEndTime = '' // 结束日期
		}
		console.log(model);
	}
	
	const init = row => {
		let data = {
			...initModel,
		}
		time.value[0] = '';
		time.value[1] = '';
		data.productNo = row.productNo;
		Object.assign(model, data);
		dialogVisible.value = true;
	}

	const saveData = () => {
		emits("handleRefresh", model);
		dialogVisible.value = false;
	}

	defineExpose({
		init
	})
	
</script>

<style scoped lang="scss">

</style>