import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/messageManagement/messageList',
        method: 'get',
        params
    })
}

export function changeMessage(params) {
    return request({
        url: '/messageManagement/message',
        method: 'put',
        params
    })
}

export function saveMessage(params) {
    return request({
        url: '/messageManagement/message',
        method: 'post',
        params
    })
}

export function sendToMail(params) {
    return request({
        url: '/messageManagement/sendMail',
        method: 'post',
        params
    })
}