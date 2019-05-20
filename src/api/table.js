import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/articleManagement/articles',
    method: 'get',
    params
  })
}

export function deleteArticle(params) {
  return request({
    url: '/articleManagement/article',
    method: 'delete',
    params
  })
}
