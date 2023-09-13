import constants from "@/_public/utils/constants";

const userKey = 'ltcUserSelect';

export const addOrUpdateUserToCache = (user) => {
    let data = localStorage.getItem(userKey);
    try {
        let list = [];
        if (constants.isNotEmpty(data)) {
            list = JSON.parse(data);
        }
        let index = -1;
        let isExist = list.find((item, i) => {
            if (item.id == user.id) {
                index = i;
                return true;
            } else {
                return false;
            }
        })
        if (isExist) {
            list.splice(index, 1);
        }
        list.unshift({
            id: user.id,
            code: user.code,
            name: user.name,
            zhglSysId: user.zhglSysId,
            departmentId: user.departmentId,
            departmentName: user.departmentName
        })
        if (list.length > 20) {
            list.splice(20);
        }
        localStorage.setItem(userKey, JSON.stringify(list));
    } catch {
    }
}

export const getUserFromCache = () => {
    let data = localStorage.getItem(userKey);
    try {
        return JSON.parse(data);
    } catch {
        return []
    }
}

export const deleteUserFromCache = user => {
    let data = localStorage.getItem(userKey);
    try {
        let list = [];
        if (constants.isNotEmpty(data)) {
            list = JSON.parse(data);
        }
        let index = -1;
        let isExist = list.find((item, i) => {
            if (item.id == user.id) {
                index = i;
                return true;
            } else {
                return false;
            }
        })
        if (isExist) {
            list.splice(index, 1);
        }
        localStorage.setItem(userKey, JSON.stringify(list));
        return list;
    } catch {
        return [];
    }
}