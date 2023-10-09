/**
 * Created by fp
 */
export default {
    /**
     * 把对象转换成包含此对象的数组
     * @param series
     * @returns {*}
     */
    turnObjToArray(series){
        if (Array.isArray(series)) {
            return series;
        } else {
            return [series]
        }
    },

    /**
     * 为ser赋予类型
     * @param series
     * @param type
     */
    addTypeToSeries(series, type){
        series.forEach(item => {
            if (!item.type) {
                item.type = type;
            }
        })
    },
}
