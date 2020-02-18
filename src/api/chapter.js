import request from '@/utils/request'

export default {
    //根据课程id查询此课程下的所有章节和小节
    getAllChapterVideoList(courseId) {
      return request({
        url: '/eduservice/chapter/getChapterVideoList/'+courseId,
        method: 'get'
      })
    },
    //添加章节的方法
    addChapter(chapter){
      return request({
        url: '/eduservice/chapter/addChapter',
        method: 'post',
        data: chapter
      })
    },
    //根据章节id查询章节
    getChapterInfo(chapterId){
      return request({
        url: '/eduservice/chapter/getChapterInfo/'+chapterId,
        method: 'get'
      })
    },
    //修改章节的方法
    updateChapter(chapter){
      return request({
        url: '/eduservice/chapter/updateChapter',
        method: 'post',
        data: chapter
      })
    },  
    //删除章节的方法
    deleteChapter(chapterId){
      return request({
        url: '/eduservice/chapter/deleteChapter/'+chapterId,
        method: 'delete'
      })
    },

}