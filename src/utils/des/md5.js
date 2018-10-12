/*
 * @Author: qiuyusong 
 * @Date: 2018-09-20 15:16:12 
 * @Last Modified by: qiuyusong
 * @Last Modified time: 2018-09-27 17:27:41
 */
import crypto from 'crypto'

const md5 = (input)=>{
  if(!input){
    return false
  }else{
    input = input.toString()
    const md5Hash = crypto.createHash('md5')
    return md5Hash.update(input).digest('hex')
  }
}
export default md5 