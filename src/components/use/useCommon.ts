import {ElMessageBox} from "element-plus";

export const useDeleteConfirm = (title='确定删除？')=>{
    return  ElMessageBox.confirm(
        title,
        '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
}