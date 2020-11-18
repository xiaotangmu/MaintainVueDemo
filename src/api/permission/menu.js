import request from '@/utils/request'

export function getRoutes(query) {
  return request({
    url: '/permission/menu/routes',
    method: 'get',
    params: query
  })
}

export function delMenu(data) {
  return request({
    url: '/permission/menu/delete',
    method: 'delete',
    data
  })
}
export function addMenu(data) {
  return request({
    url: '/permission/menu/add',
    method: 'post',
    data
  })
}
export function updMenu(data) {
  return request({
    url: '/permission/menu/update',
    method: 'post',
    data
  })
}
