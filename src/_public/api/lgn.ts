import request from '@/_public/utils/request'

export function login(data) {
  return request({
    url: '/api/auth/jwt/tokenLtc',
    method: 'POST',
    data
  })
}

export function loginUserCode(data){
  return request({
    url: '/api/auth/jwt/tokenLtcUserCode',
    method: 'POST',
    data
  })
}

export function loginEjia(data) {
  return request({
    url: '/api/auth/jwt/tokenEjiaTicket',
    method: 'POST',
    data
  })
}

export function logout(data) {
  return request({
    url: '/api/auth/jwt/logout',
    method: 'POST',
    data
  })
}
