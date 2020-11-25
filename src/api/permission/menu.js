import request from '@/utils/request'
import { url } from '@/api/proxy'

export function getRoutes(query) {
  return request({
    url: '/permission/menu/routes',
    method: 'get',
    params: query
  })
}

export function getMenus(query) {
  return request({
    url: url + '/ResourceManagement/GetAll',
    method: 'get',
    params: query
  })
}
export function delMenu(query) {
  return request({
    url: url + '/ResourceManagement/DeleteResource',
    method: 'delete',
    params: query
  })
}
export function addMenu(data) {
  return request({
    url: url + '/ResourceManagement/AddResource',
    method: 'post',
    data
  })
}
export function updMenu(data) {
  return request({
    url: url + '/ResourceManagement/UpdateResource',
    method: 'post',
    data
  })
}
