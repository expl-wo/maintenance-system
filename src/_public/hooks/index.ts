import { post, get } from '@/_public/utils/http'
import echarts from './Echarts'
import setting from '../setting'
import Emit from './Emit'
import tableParams from './TableParams'

export function useSetting() {
  return setting
}

export function usePost() {
  return post
}

export function useGet() {
  return get
}


export function useTableParams(params){
  return tableParams(params);
}


export function useEcharts(dom: HTMLElement, theme?: string) {
  return echarts(dom, theme)
}

export function useEmit() {
  return Emit()
}
