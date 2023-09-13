/**
 * Created by fp on 2020/11/20.
 */
import chartUtil from './realize/xuiChartUtil'
import XuiLineBarChart from './realize/xuiLineBarChart'
import XuiPieChart from './realize/xuiPieChart'
import XuiScatterChart from './realize/xuiScatterChart'

export default {
  /**
   * 通用的调用，默认类型是line
   * @param series
   * @param options
   * @returns {*}
   */
  getCommonChart: function (series, options) {
    const newSeries = chartUtil.turnObjToArray(series)
    chartUtil.addTypeToSeries(newSeries, 'line')
    let commonChart = new XuiLineBarChart(newSeries, options)
    return commonChart.getChartOption()
  },

  getLineChart: function (series, options) {
    const newSeries = chartUtil.turnObjToArray(series)
    chartUtil.addTypeToSeries(newSeries, 'line')
    let commonChart = new XuiLineBarChart(newSeries, options)
    return commonChart.getChartOption()
  },

  getAreaChart: function (series, options) {

  },

  getBarChart: function (series, options) {
    const newSeries = chartUtil.turnObjToArray(series)
    chartUtil.addTypeToSeries(newSeries, 'bar')
    let commonChart = new XuiLineBarChart(newSeries, options)
    return commonChart.getChartOption()
  },

  getStackChart: function (series, options) {

  },

  getPieChart: function (series, options) {
    const newSeries = chartUtil.turnObjToArray(series)
    chartUtil.addTypeToSeries(newSeries, 'pie')
    let xuiPieChart = new XuiPieChart(newSeries, options)
    return xuiPieChart.getChartOption()
  },

  getScatterChart: function (series, options) {
    const newSeries = chartUtil.turnObjToArray(series)
    chartUtil.addTypeToSeries(newSeries, 'scatter')
    let xuiScatterChart = new XuiScatterChart(newSeries, options)
    return xuiScatterChart.getChartOption()
  },
}
