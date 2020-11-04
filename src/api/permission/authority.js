import request from '@/utils/request'

export function getRoutes(query) {
  return request({
    url: '/permission/authority/routes',
    method: 'get',
    params: query
  })
}
