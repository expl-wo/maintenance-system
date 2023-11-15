// @ts-ignore
import {userMenuTree} from "@/api/permission";
import sysConstants from "@/utils/constants";

export const initUserPrivilege = () => {
    return new Promise((resolve, reject) => {

        userMenuTree().then(response => {
            let result = [], menuList = [], btnList = [], otherList = [];
            result  = getMenuList(response.data);
            menuList = result[0];
            btnList = result[1];
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

const getMenuList = menuList => {
    let result = []
    let menuRresult = [];
    let btnResult = [];
    menuList.forEach((item) => {
        _getMenuList(item, menuRresult,btnResult);
    })
    result.push(menuRresult)
    result.push(btnResult)
    return result;
}

const _getMenuList = (item, menuRresult,btnResult)=>{
    if(item.type == 1){
        let subList = [];
        if(item.sub && item.sub.length > 0){
            item.sub.forEach(subItem=>{
                _getMenuList(subItem, subList,btnResult);
            })
        }
        item.sub = subList;
        menuRresult.push(item);
    }else if(item.type == 2){
        btnResult.push(item.code);
    }
}
