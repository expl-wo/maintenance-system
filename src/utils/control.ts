// @ts-ignore
import {userMenuTree} from "@/api/permission";
import sysConstants from "@/utils/constants";

export const initUserPrivilege = () => {
    return new Promise((resolve, reject) => {

        userMenuTree().then(response => {
            const menuList = [], btnList = [], otherList = [];
            response.data.forEach(item => {
                if (item.type === 1) {
                    menuList.push(item);
                } else if (item.type === '2') {
                    btnList.push(item.pCode)
                } else {
                    otherList.push(item);
                }
            })
            console.log("原始菜单",menuList)
            sessionStorage.setItem("menuList", JSON.stringify(menuList));
            sessionStorage.setItem("btnList", JSON.stringify(btnList));
            sessionStorage.setItem("otherList", JSON.stringify(otherList));
            if (menuList.length === 0) {
                // reject("没有赋予菜单权限，请联系系统管理员");

                resolve("");
            } else {
                resolve("");
            }
        })
    })
}
//
export const isAuth = (key) => {
    return JSON.parse(sessionStorage.getItem('btnList') || '[]').indexOf(key) !== -1 || false
}
