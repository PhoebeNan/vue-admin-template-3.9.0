import request from '@/utils/request'

export default {

  //添加小节的方法
  addVideo(video) {
    return request({
      url: '/eduservice/video/addVideo',
      method: 'post',
      data: video
    })
  },
  //根据小节id查询小节
  getVideoInfo(videoId) {
    return request({
      url: '/eduservice/video/getVideoById/' + videoId,
      method: 'get'
    })
  },
  //修改小节的方法
  updateVideo(video) {
    return request({
      url: '/eduservice/video/updateVideo',
      method: 'post',
      data: video
    })
  },
  //删除小节的方法
  deleteVideo(videoId) {
    return request({
      url: '/eduservice/video/deleteVideo/' + videoId,
      method: 'delete'
    })
  },
  //删除阿里云云端视频的方法
  removeAliyunVideo(videoId) {
    return request({
      url: '/vidservice/vod/' + videoId,
      method: 'delete'
    })
  },

}