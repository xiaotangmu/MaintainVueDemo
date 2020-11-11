import request from '@/utils/request'
import { url } from '../proxy'

export function getOutList(params) {
  return request({
    url: url + '/Out/GetListPageBySearch',
    method: 'get',
    params
  })
}
export function getOutAll(params) {
  return request({
    url: url + '/Out/GetAll',
    method: 'get',
    params
  })
}
export function addOut(data) {
  return request({
    url: url + '/Out/Add',
    method: 'post',
    data
  })
}
export function delOut(data) {
  return request({
    url: url + '/Out/Delete',
    method: 'delete',
    params: data
  })
}
export function updOut(data) {
  return request({
    url: url + '/Out/Update',
    method: 'post',
    data
  })
}
export function remarkOut(data) {
  return request({
    url: url + '/Out/RemarkOut',
    method: 'post',
    data
  })
}
