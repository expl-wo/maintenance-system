import { post, get } from '@/_public/utils/http'

//角色列表的分页查询
export function getUserLoginInfoList(keyWord, pageNum, pageSize) {
    return get({
        url: "/api/auth/online/page",
        data: {
            keyWord,
            pageNo: pageNum,
            pageSize
        }
    });
}