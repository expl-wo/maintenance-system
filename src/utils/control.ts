// import {userMenuTree} from "@/sys/api/user";
// import sysConstants from "@/sys/utils/sysConstants";
//
// export const initUserPrivilege = () => {
//     return new Promise((resolve, reject) => {
//         debugger
//         userMenuTree().then(response => {
//             const menuList = [], btnList = [], otherList = [];
//             // response.data.forEach(item => {
//             //     if (item.pType === sysConstants.permissionType.menu) {
//             //         menuList.push(item);
//             //     } else if (item.pType === sysConstants.permissionType.btn) {
//             //         btnList.push(item.pCode)
//             //     } else {
//             //         otherList.push(item);
//             //     }
//             // })
//             sessionStorage.setItem("menuList", JSON.stringify(menuList));
//             sessionStorage.setItem("btnList", JSON.stringify(btnList));
//             sessionStorage.setItem("otherList", JSON.stringify(otherList));
//             if (menuList.length === 0) {
//                 // reject("没有赋予菜单权限，请联系系统管理员");
//
//                 resolve("");
//             } else {
//                 resolve("");
//             }
//         })
//     })
// }
//
export const isAuth = (key) => {
    return JSON.parse(sessionStorage.getItem('btnList') || '[]').indexOf(key) !== -1 || false
}
