import request from '@/utils/request'
import { url } from '@/api/proxy'

export function getRoles(query) {
  return request({
    url: url + '/RoleManagement/GetRoleListWithMenuWithPaging',
    method: 'get',
    params: query
  })
}

export function getRolesAll() {
  return request({
    url: url + '/RoleManagement/GetAllNoMenu',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: url + '/RoleManagement/Add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: url + `/RoleManagement/Update`,
    method: 'post',
    data
  })
}

export function enableRole(data) {
  return request({
    url: url + `/RoleManagement/EnableRole`,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: url + `/RoleManagement/Delete`,
    method: 'delete',
    data
  })
}
