/**
 */
import constants from "@/utils/constants";
//基础组件
import xuiPagination from './pagination/pagination.vue'
import xuiDictionary from './dictionary/dictionary.vue'
// @ts-ignore
import xuiDictLabel from './dictLabel/dictLabel.vue'
import xuiDictName from "./dictionary/dict-name.vue";
import xuiDictSelect from './select/dict-select.vue'
import xuiListSelect from './select/list-select.vue'
import xuiFilter from './filter/filter.vue'
import xuiText from './text/text.vue'
import xuiFormText from './form/form-text.vue'
import xuiDownload from './download/download.vue'
import xuiUpload from './upload/upload.vue'
import xuiMultiUpload from './upload/multi-upload.vue'

export const install = function (app) {
    app.component('xuiPagination', xuiPagination);
    app.component('xuiDictionary', xuiDictionary);
    app.component('xuiDictLabel', xuiDictLabel);
    app.component('xuiDictName', xuiDictName);
    app.component('xuiDictSelect', xuiDictSelect);
    app.component('xuiListSelect', xuiListSelect);
    app.component('xuiFilter', xuiFilter);
    app.component('xuiText', xuiText);
    app.component('xuiFormText', xuiFormText);
    app.component('xuiDownload', xuiDownload);
    app.component('xuiUpload', xuiUpload);
    app.component('xuiMultiUpload', xuiMultiUpload);
    //添加全局方法
    app.config.globalProperties.$filters = {
        formatSimpleDate(value:string) {
            if (value) {
                return value.substr(0, 10)
            } else {
                return value
            }
        },
        formatNumber(value:string) {
            if (constants.isNotEmpty(value)) {
                return parseFloat(value);
            } else {
                return value;
            }
        }
    }
};
