import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://8.134.49.56:8000/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://8.134.49.56:8000/user/info',
    method: 'get',
    params: { token }
  })
}

export function update(data) {
  return request({
    url: 'http://8.134.49.56:8000/user/update',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'http://8.134.49.56:8000/user/logout',
    method: 'post'
  })
}
