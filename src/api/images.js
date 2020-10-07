/**
 * 素材请求相关模块
*/
import request from '@/utils/request'

// 上传图片素材
export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    //   一般文件上传的接口都要求请求头中的 'Content-Type' 设置为 multipart/form-data
    // 但是我们使用 axios 上传文件的话不需要手动设置，你只需要给 data 一个FormData 对象即可
    data
  })
}

// 获取图片素材
export const getImage = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏图片素材
export const collectImage = (imageId, data) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect: data
    }
  })
}

// 删除图片素材
export const deleteImage = (imageId) => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}
