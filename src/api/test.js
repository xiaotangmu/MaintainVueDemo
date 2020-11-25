import request from '@/utils/request'
import { url } from '@/api/proxy'

export function test2() {
  return request({
    url: url + '/Test/NoAuthorize',
    method: 'get'
  })
}
export function test1() {
  return request({
    url: url + '/Test/NeedAccount',
    method: 'get'
  })
}
export function test3() {
  return request({
    url: url + '/Test/NeedRole',
    method: 'get'
  })
}
