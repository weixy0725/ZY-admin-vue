import request from '@/utils/request'

export function getTypes() {
  return request({
    url: '/articleManagement/type',
    method: 'get'
  })
}

export function getClassifications(params) {
  return request({
    url: '/articleManagement/classification',
    method: 'get',
    params
  })
}

export function saveArticle(data) {
  return request({
    url: '/articleManagement/article',
    method: 'post',
    data
  })
}

export function getArticle(params) {
  return request({
    url: '/articleManagement/article',
    method: 'get',
    params
  })
}

export function updateArticle(data) {
  return request({
    url: '/articleManagement/article',
    method: 'put',
    data
  })
}

export function addClassification(data) {
  return request({
    url: '/articleManagement/classification',
    method: 'post',
    data
  })
}

export function updateClassification(data) {
  return request({
    url: '/articleManagement/classification',
    method: 'put',
    data
  })
}

export function deleteClassification(data) {
  return request({
    url: '/articleManagement/classification',
    method: 'delete',
    data
  })
}