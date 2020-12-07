import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const username = 'Username'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUsername() {
  return Cookies.get(username)
}

export function setUsername(value) {
  return Cookies.set(username, value)
}

export function removeUsername() {
  return Cookies.remove(username)
}
