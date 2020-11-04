import request from '@/utils/request'
import { url } from '../proxy'

export function getSpuList(params) {
  return request({
    url: url + '/Spu/GetSpuListWithPaging',
    method: 'get',
    params
  })
}
export function addSpu(data) {
  return request({
    url: url + '/Spu/Add',
    method: 'post',
    data
  })
}
export function delSpu(data) {
  return request({
    url: url + '/Spu/Delete',
    method: 'delete',
    params: data
  })
}
export function updSpu(data) {
  return request({
    url: url + '/Spu/Update',
    method: 'post',
    data
  })
}
export function getById(data) {
  return request({
    url: url + '/Spu/GetListByCatalog2Id',
    method: 'get',
    params: data
  })
}
