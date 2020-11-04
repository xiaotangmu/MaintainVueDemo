import request from '@/utils/request'
import { url } from '../proxy'

export function getAttrList(query) {
  return request({
    url: url + '/Attr/GetListByCatalogId',
    method: 'get',
    params: query
  })
}
export function addAttr(data) {
  return request({
    url: url + '/Attr/Add',
    method: 'post',
    data
  })
}
export function delAttr(data) {
  return request({
    url: url + '/Attr/Delete',
    method: 'delete',
    data
  })
}
export function updAttr(data) {
  return request({
    url: url + '/Attr/Update',
    method: 'post',
    data
  })
}
export function delAttrBatch(data) {
  return request({
    url: url + '/Attr/DeletBatch',
    method: 'delete',
    data
  })
}
