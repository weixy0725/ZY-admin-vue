import request from '@/utils/request'

export function getClassifications() {
    return request({
      url: '/articleManagement/type',
      method: 'get'
    })
}