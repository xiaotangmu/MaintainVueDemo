import request from '@/utils/request'
import { url } from '../proxy'

export function getPageList(params) {
  return request({
    url: url + '/DataDict/GetDictWithPaging',
    method: 'get',
    params
  })
}
export function getChildren(params) {
  return request({
    url: url + '/DataDict/GetChildrenByTypeCodeWithPaging',
    method: 'get',
    params
  })
}
export function getChildrenByType(params) {
  return request({
    url: url + '/DataDict/GetChildrenByTypeCode',
    method: 'get',
    params
  })
}
export function update(data) {
  return request({
    url: url + '/DataDict/Update',
    method: 'post',
    data
  })
}
export function updDict(data) {
  return request({
    url: url + '/Maintain/UpdateChooseList',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: url + '/DataDict/Add',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: url + '/DataDict/DeleteChild',
    method: 'delete',
    data
  })
}
export function delParent(data) {
  return request({
    url: url + '/DataDict/DeleteParent',
    method: 'delete',
    data
  })
}
