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
export function update(data) {
  return request({
    url: url + '/DataDict/Update',
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
    url: url + '/DataDict/Delete',
    method: 'delete',
    data
  })
}
