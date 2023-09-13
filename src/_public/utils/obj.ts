/**
 * 从源数据拷贝目标对象有的数据，并不在excludeProps中
 * @param target
 * @param source
 * @param excludeProps
 */
import constants from "@/_public/utils/constants";

export function copyExistProps(target, source, excludeProps=[]){
    for(const key in target){
        if(source[key] !== undefined && excludeProps.indexOf(key)<0){
            target[key] = source[key];
        }
    }
}


export function copyExistPropsHasValue(target, source, excludeProps=[]){
    for(const key in target){
        if(constants.isNotEmpty(source[key]) && excludeProps.indexOf(key)<0){
            target[key] = source[key];
        }
    }
}