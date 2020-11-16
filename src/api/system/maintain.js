import request from '@/utils/request'
import { url } from '../proxy'

export function getMaintainList(params) {
  return request({
    url: url + '/Maintain/GetListPageBySearch',
    method: 'get',
    params
  })
}
export function getMaintainById(params) {
  return request({
    url: url + '/Maintain/GetMaintainById',
    method: 'get',
    params
  })
}
export function getMaintainAll(params) {
  return request({
    url: url + '/Maintain/GetNoDealToolOrPartWithMaintain',
    method: 'get',
    params
  })
}
export function addMaintain(data) {
  return request({
    url: url + '/Maintain/Add',
    method: 'post',
    data
  })
}
export function updInfo(data) {
  return request({
    url: url + '/Maintain/UpdateMaintainNoRelation',
    method: 'post',
    data
  })
}
export function updTool(data) {
  return request({
    url: url + '/Maintain/UpdateWithTool',
    method: 'post',
    data
  })
}
export function updPart(data) {
  return request({
    url: url + '/Maintain/UpdateWithOldPart',
    method: 'post',
    data
  })
}
export function updByOut(data) {
  return request({
    url: url + '/Maintain/UpdateWithOut',
    method: 'post',
    data
  })
}
export function delMaintain(data) {
  return request({
    url: url + '/Maintain/Delete',
    method: 'delete',
    params: data
  })
}
export function delMaintainBatch(data) {
  return request({
    url: url + '/Maintain/DeleteBatch',
    method: 'delete',
    data
  })
}
