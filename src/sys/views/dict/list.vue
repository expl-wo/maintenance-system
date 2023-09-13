<template>
	<div class="app-container app-containerC">
		<el-row :gutter="10" class="hp">
			<el-col :span="10" class="hp">
        <el-card shadow="hover" class="hp">
          <template #header>
              <div class="clearfix">
                <span>字典项目</span>
            </div>
          </template>
          <div class="wp hp app-containerC">
            <dict @updateItem="updateItemList"></dict>
          </div>
        </el-card>
			</el-col>
			<el-col :span="14" class="hp">
        <el-card shadow="hover" class="hp">
          <template #header>
            <div class="clearfix">
              <span>字典明细</span>
            </div>
          </template>
          <div class="wp hp app-containerC">
            <dictItem ref="itemList">
            </dictItem>
          </div>
        </el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import dict from "@/sys/views/dict/dict.vue"
	import dictItem from "@/sys/views/dict/dictItem.vue"
	export default{
		components:{dict,dictItem},
		methods:{
			updateItemList(param) {
				this.$refs.itemList.initItem(param)
			}
		}
	}
</script>

<style scoped>
	
</style>