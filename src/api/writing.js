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

export function saveArticle(data){
  return request({
    url: '/articleManagement/article',
    method: 'post',
    data
  })

}