import Constants from '@//utils/constants'

import {login,loginEjia,loginUserCode} from '@/api/lgn';
import {defineStore} from "pinia";
import {
    setUserInfo,
    setToken,
    removeToken,
    removeUserInfo,
    setRoleList
} from "@/utils/auth";

import {Response} from "@/utils/http";


const useUserStore = defineStore("user", {
    state: () => {
        return {
            initAuthority: false
        }
    },
    actions: {
        login(userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then((response: Response) => {
                    if (response.code === Constants.respCode.success) {
                        const {data} = response
                        this.token = data.accessToken;
                        setToken(data.accessToken);
                        setUserInfo(data.userInfo);
                        setRoleList(data.roleList);
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        loginUserCode(userInfo) {
            return new Promise((resolve, reject) => {
                loginUserCode(userInfo).then((response: Response) => {
                    if (response.code === Constants.respCode.success) {
                        const {data} = response
                        this.token = data.accessToken;
                        setToken(data.accessToken);
                        setUserInfo(data.userInfo);
                        setRoleList(data.roleList);
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        loginEjiaTicket(params) {
            return new Promise((resolve, reject) => {
                loginEjia(params).then((response: Response) => {
                    if (response.code === Constants.respCode.success) {
                        const {data} = response
                        this.token = data.accessToken;
                        setToken(data.accessToken);
                        setUserInfo(data.userInfo);
                        setRoleList(data.roleList);
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        changeNickName(newNickName: string) {
            this.nickName = newNickName;
        },
        logout() {
            return new Promise<void>((res) => {
                removeToken();
                removeUserInfo();
                res();
            });
        },
        updateInitAuthority(flag) {
            this.initAuthority = flag;
        }
    },
});

export default useUserStore;
