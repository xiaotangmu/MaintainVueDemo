import request from '@/utils/request'
import { url } from '../proxy'

export function getList(query) {
  return request({
    url: url + '/Catalog1/GetAll',
    method: 'get',
    params: query
  })
}
export function addCatalog1(data) {
  return request({
    url: url + '/Catalog1/Add',
    method: 'post',
    data
  })
}
export function updateCatalog1(data) {
  return request({
    url: url + '/Catalog1/Update',
    method: 'post',
    data
  })
}
export function deleteCatalog1(data) {
  return request({
    url: url + '/Catalog1/Delete',
    method: 'delete',
    data
  })
}
export function deleteCatalog1Batch(data) {
  return request({
    url: url + '/Catalog1/DeletBatch',
    method: 'delete',
    data
  })
}
export function getListBy1(query) {
  return request({
    url: url + '/Catalog2/GetListByCatalog1',
    method: 'get',
    params: query
  })
}
export function addCatalog2(data) {
  return request({
    url: url + '/Catalog2/Add',
    method: 'post',
    data
  })
}
export function updateCatalog2(data) {
  return request({
    url: url + '/Catalog2/Update',
    method: 'post',
    data
  })
}
export function deleteCatalog2(data) {
  return request({
    url: url + '/Catalog2/Delete',
    method: 'delete',
    data
  })
}
export function deleteCatalog2Batch(data) {
  return request({
    url: url + '/Catalog2/DeletBatch',
    method: 'delete',
    data
  })
}
