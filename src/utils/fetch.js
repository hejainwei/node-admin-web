import axios from 'axios'
// import qs from 'qs'
import { Message } from 'element-ui'
import {removeToken ,getToken ,getSecretKey} from './auth'
import genSignData from './des/des'
import md5 from './des/md5'

axios.defaults.withCredentials = true 

// 发送时
axios.interceptors.request.use(config => {
  // 开始
  return config
}, err => {
  return Promise.reject(err)
})

// 响应时
axios.interceptors.response.use(response => response, err => Promise.resolve(err.response))

const projectPaths= {
  admin:  '/admin/',
  infoweb: '/info/',
  active: '/rjsactivity/',
  promote: '/promoteWeb/',
  mallweb:'/mallweb/'
}

class Fetch {
  constructor(project='admin'){
    this.projectPath = projectPaths[project]
  }
  initRequestData(){
    this.requestData = {
      "platform": "web",
      "session_token": getToken(),
      "data": {}
    }
  }
  checkStatus (res) {
    if(!res){
      return {
        status: 999999,
        msg: '请求失败'
      }
    }
    if (res.status === 200 || res.status === 304) {
      return res.data
    }else{
      return {
        status: 999999,
        msg: res.data.msg || res.statusText,
        data: res.statusText
      }
    }
  }
  checkCode (res) {
    if (res.status === 999999 || res.status === 0) {//系统级别的错误
      Message({
        message: res.msg,
        type: 'error',
        duration: 2 * 1000
      })
    }else if (res.status === -1){//请先登录
      removeToken()
      Message({
        message: '请先登录',
        type: 'error',
        duration: 2 * 1000,
        onClose:function(){
          window.location.href = '#/login'
        }
      })
    }else if (res.status === -2){//验签失败，重新登录
      removeToken()
      Message({
        message: '验签失败，重新登录',
        type: 'error',
        duration: 2 * 1000,
        onClose:function(){
          window.location.href = '#/login'
        }
      })
    }
    return res
  }
  post({url,data,easyOriginData}){
    if(!url){
      return
    }
    this.initRequestData()
    if(easyOriginData && easyOriginData instanceof Object){
      const urlStr = "/" + url
      const keyStr = getSecretKey();
      this.requestData["sign"] = md5(urlStr + "&" + md5(genSignData(easyOriginData)) + "&" + keyStr);
      this.requestData["timestamp"] = new Date().getTime();
      this.requestData.data = easyOriginData
    }else{
      this.requestData.data = data
    }
    url = this.projectPath+url
    var self = this
    return axios({
      method: 'post',
      url: url,
      data: self.requestData,
      timeout: 30000
    }).then(self.checkStatus).then(self.checkCode)
  }
}

export default Fetch
