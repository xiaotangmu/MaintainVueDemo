import request from '@/utils/request'
import { url } from '@/api/proxy'

export function getUsers(params) {
  return request({
    url: url + '/UserManagement/GetUserGroupWithPaging',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: url + '/UserManagement/AddUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: url + `/UserManagement/UpdateUser`,
    method: 'post',
    data
  })
}

export function enableUser(data) {
  return request({
    url: url + `/UserManagement/EnableUser`,
    method: 'post',
    data
  })
}

export function resetUser(data) {
  return request({
    url: url + `/UserManagement/ResetPassword`,
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: url + `/UserManagement/DeleteUser`,
    method: 'delete',
    data
  })
}
