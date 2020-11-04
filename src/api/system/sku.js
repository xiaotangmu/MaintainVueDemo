import request from '@/utils/request'
import { url } from '../proxy'

export function getSkuList(params) {
  return request({
    url: url + '/Sku/GetListPageBySearch',
    method: 'get',
    params
  })
}
export function addSku(data) {
  return request({
    url: url + '/Sku/Add',
    method: 'post',
    data
  })
}
export function delSku(data) {
  return request({
    url: url + '/Sku/Delete',
    method: 'delete',
    params: data
  })
}
export function updSku(data) {
  return request({
    url: url + '/Sku/Update',
    method: 'post',
    data
  })
}
