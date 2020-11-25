import request from '@/utils/request'
import { url } from '@/api/proxy'

export function login(data) {
  return request({
    url: url + '/LoginManagement/LogInWithAccount',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
