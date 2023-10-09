import {ref, Ref} from "vue";

export interface ITableParams {
    dataList: Ref<[] | undefined>,
    tableLoading: Ref<boolean>,
    total: Ref<number>,
    pageNo: Ref<number>,
    pageSize: Ref<number>
}

export default function (pageSizeTemp = 10): ITableParams {
    const dataList = ref<[]>();
    const tableLoading = ref(false);
    const total = ref(0);
    const pageNo = ref(1);
    const pageSize = ref(pageSizeTemp);
    return {
        dataList,
        tableLoading,
        total,
        pageNo,
        pageSize
    }
}
