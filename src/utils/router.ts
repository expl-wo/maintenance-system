import LayoutStore, {Layout} from "@/layouts";
import {isExternal, mapTwoLevelRouter} from "@/layouts/utils";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router, {constantRoutes} from "../router";
import Cookies from "js-cookie";
import {post, Response} from "@/utils/http";
import {RouteRecordRaw} from "vue-router";
import {toHump} from "./index";
import {RouteRecordRawWithHidden} from "@/layouts/types";
import useUserStore from "@/store/modules/user";
import pinia from "@/store/pinia";
import {getToken} from '@/utils/auth'
// import {userMenuTree} from "@/sys/api/user";
import {ElMessage} from 'element-plus'
import {initUserPrivilege} from './control'
import constants from "@/utils/constants";

const userStore = useUserStore(pinia);
let hasInitPrivilege = false;

NProgress.configure({
    showSpinner: false,
});

interface OriginRoute {
    menuUrl: string;
    menuName?: string;
    hidden?: boolean;
    outLink?: string;
    affix?: boolean;
    cacheable?: boolean;
    icon?: string;
    tip?: string | number;
    isSingle?: boolean;
    children: Array<OriginRoute>;
}


function getComponent(it: OriginRoute) {
    return (): any => import("@/views" + it.menuUrl + ".vue");
}

function isMenu(route: OriginRoute) {
    return route.children && route.children.length > 0;
}

function getNameByUrl(menuUrl: string) {
    const temp = menuUrl.split("/");
    return toHump(temp[temp.length - 1]);
}

function generatorRoutes(res: Array<OriginRoute>) {
    const tempRoutes: Array<RouteRecordRawWithHidden> = [];
    res.forEach((it) => {
        const route: RouteRecordRawWithHidden = {
            path: it.outLink && isExternal(it.outLink) ? it.outLink : it.menuUrl,
            name: getNameByUrl(it.menuUrl),
            hidden: !!it.hidden,
            component: isMenu(it) ? Layout : getComponent(it),
            meta: {
                title: it.menuName,
                affix: !!it.affix,
                cacheable: !!it.cacheable,
                icon: it.icon || "",
                badge: it.tip,
                isSingle: !!it.isSingle,
            },
            children: []
        };
        if (it.children) {
            route.children = generatorRoutes(it.children);
        }
        tempRoutes.push(route);
    });
    return tempRoutes;
}

// const whiteRoutes: string[] = ["/login", "/main"];

function isWhitePath(path) {
    if (path.indexOf("/login") === 0) {
        return true;
    }
    return false;
}

function hasToken(): boolean {
    return !!getToken();
}

router.beforeEach((to, from, next) => {
    NProgress.start();
    const query = to.query;
    if (query && constants.isNotEmptyObj(query) && query.ticket) {
        //说明是单点登录跳转页面
        if (query.client_id) {//说明是从ejia来的
            userStore.loginEjiaTicket({
                ticket: query.ticket
            }).then((response: Response) => {
                if (response.code === constants.respCode.success) {
                    next({
                        path: query.toPath as any
                    });
                } else {
                    ElMessage.error(response.msg);
                    next('/login')
                }
            }).catch((response) => {
                ElMessage.error(response.msg);
                next('/login')
            })
        } else { //自身的单点登录
            next('/login')
        }
    } else {
        if (to.path.indexOf("/login")===0) {
            if(hasToken()){
                return next('/dashboard');
            }else{
                return next();
            }
        }
        if (isWhitePath(to.path)) {
            NProgress.done();
            return next();
        }
        if (!hasToken()) {
            NProgress.done();
            setTimeout(() => {
                window.location.reload();
            }, 500);
            next({
                path: "/login",
                query: {redirect: to.fullPath},
            });
        } else {
            //判断是否已初始化菜单，如果没有，就获取菜单
            if (!hasInitPrivilege) {
                initUserPrivilege().then(response => {
                    hasInitPrivilege = true;
                    const isEmptyRoute = LayoutStore.isEmptyPermissionRoute();
                    if (isEmptyRoute) {
                        LayoutStore.initPermissionRoute(constantRoutes);
                    }
                    next();
                }).catch(reason => {
                    ElMessage.error(reason);
                    next({
                        path: "/login",
                    })
                })
            }
            next();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
