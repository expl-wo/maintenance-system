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
					<el-form-item label="工序:" prop="pnName">
						<el-input v-model="model.pnName" disabled />
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="计划时间:" prop="time" >
						<el-date-picker v-model="model.time" type="datetimerange"
							:popper-options="pickerOptions0"
							:disabled-date = "disabledDate"
							value-format="YYYY-MM-DD HH:mm:ss"
							range-separator="至"
							start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="工位" name="" >
						<el-table ref="multipleTableRef" key="id" :data="midOp" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
							<el-table-column prop="name" label="名称" width="140px">
								<template #default="scope">
									<el-input v-model="scope.row.name" disabled :min="0"></el-input>
								</template>
							</el-table-column>
<!--							<el-table-column prop="count" label="数量" width="140px">-->
<!--								<template #default="scope">-->
<!--									<el-input-number v-model="scope.row.count" :min="0"></el-input-number>-->
<!--								</template>-->
<!--							</el-table-column>-->
							<el-table-column prop="work" label="工位" width="140px">
								<template #default="scope">
									<el-select v-model="scope.row.work" size="small" placeholder="工位选择"
										style="width: 120px;">
										<el-option v-for="items in work" :key="items.id" :label="items.typeName"
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
	import planMain from '@/api/plan/planMain'
  import { ElMessage,ElTable  } from 'element-plus'
	const emits = defineEmits(["handleRefresh"])

  const multipleTableRef = ref<InstanceType<typeof ElTable>>()
  const multipleSelection = ref<any[]>([])
  const handleSelectionChange = (val: any[]) => {
    multipleSelection.value = val
  }
  const toggleSelection = (rows?: any[]) => {
    if (rows) {
      rows.forEach((row) => {
        // TODO: improvement typing when refactor table
        multipleTableRef.value!.toggleRowSelection(row, undefined)
      })
    } else {
      multipleTableRef.value!.clearSelection()
    }
  }

  const openSuccess = (msg:string) => {
    ElMessage( {
      message:msg,
      type: 'success',
    })
  }
  const openWarning = (msg:string) => {
    ElMessage( {
      message:msg,
      type: 'warning',
    })
  }
	const dialogVisible = ref(false);

	const initModel = {
		productPlanId:'',
		productNodeId:'',
		productNo: '',
    pnName: '',
    workspaceName : "",
    workspaceNumber : "",
		time:[],
		nodeId:'',
		works:[],
	}

	const midOp = reactive([])

	const work = reactive([]);

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

	const init = async(row) => {
    console.log(row);
    let data = {
      ...initModel,
    }
    let workData = []
    let opData = []
		let response = await planMain.getOpInfo({productPlanId:row.productplanId,nodeId:row.nodeId})
    if((response as any).err_code === 10000 ){
      response.data.instances.forEach(item =>{
        workData.push(item)
      })
      response.data.midOp.forEach(item =>{
        opData.push({id:item.id,name:item.craftsName,work:null})
      })
      data.workspaceName = response.data.workspaceName;
      data.workspaceNumber = response.data.workspaceNumber;
      // toggleSelection(work)
    }else {
      openWarning("查询节点信息失败")
    }


		data.productNo = row.productNo;
		data.pnName = row.pnName;
		data.productPlanId = row.productplanId;
		data.productNodeId = row.id;
		data.nodeId = row.nodeId;


		Object.assign(model, data);
		Object.assign(work, workData);
		Object.assign(midOp, opData);
		dialogVisible.value = true;
	}



  const getProcedureWorkspace =()=>{
    let data =[]
    multipleSelection.value.forEach( item =>{
      data.push({k: item.id, v: item.work})
    })
    return data
  }

	const saveData = () => {
		let params = {
			productPlanId : model.productPlanId,
			productNodeId : model.productNodeId,
			planStartTime : model.time[0],
			planEndTime   : model.time[1],
      workspaceName : model.workspaceName,
      workspaceNumber : model.workspaceNumber,
			procedureWorkspace: getProcedureWorkspace()
		}
    console.log(params)
    planMain.editNodePlan(params).then( (res:any) =>{
      if(res.err_code === 10000){
        dialogVisible.value = false;
        openSuccess("设置成功!")
      }else {
        openWarning("设置失败!")
        // (this as any).$message.error("设置失败！")
      }
    })
	}

	defineExpose({
		init
	})

</script>

<style scoped lang="scss">

</style>
