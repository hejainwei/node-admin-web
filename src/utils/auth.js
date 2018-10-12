import { Cookie } from './storage'
const TokenKey = 'session_token'
const SecretKey = 'secretKey'

export function getToken() {  
	return Cookie.get(TokenKey)
}

export function getSecretKey() {  
	return Cookie.get(SecretKey)
}

export function setToken(token) {
  return Cookie.set(TokenKey, token)
}

export function removeToken() {
  return Cookie.remove(TokenKey)
}
