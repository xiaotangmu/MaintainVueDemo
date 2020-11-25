import request from '@/utils/request'
import { url } from '@/api/proxy'

export function getPermission(query) {
  return request({
    url: url + '/PermissionManagement/GetPermissionByParentId',
    method: 'get',
    params: query
  })
}

export function addPermission(data) {
  return request({
    url: url + '/PermissionManagement/Add',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: url + `/PermissionManagement/Update`,
    method: 'post',
    data
  })
}

export function deletePermission(data) {
  return request({
    url: url + `/PermissionManagement/Delete`,
    method: 'delete',
    data
  })
}
