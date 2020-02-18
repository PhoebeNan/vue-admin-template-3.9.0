import request from '@/utils/request' //模板提供的组件，axios封装


const apiUrl = '/eduservice/teacher/moreConditionPageList'
export default {
  //分页条件查询的方法
  //三个参数：当前页，每页记录数，条件封装对象
  getTeacherPageList(page, limit, searchObj) {
    return request({
      //后端controller里面的路径
      url: `${apiUrl}/${page}/${limit}` ,
      //提交方式
      method: 'post',
      //传递条件对象,如果传递json数据，使用data。如果不是json，使用params
      data: searchObj
    })
  },
  // deleteTeacherId(id) {
  //   return request({
  //     //后端controller里面的路径
  //     url: '/eduservice/teacher/' + id,
  //     //提交方式
  //     method: 'delete'
  //   })
  // },
  deletedata(id) {
    return request({
      //后端controller里面的路径
      url: '/eduservice/teacher/deleteTeacher/' + id,
      //提交方式
      method: 'delete'
    })
  },
  //添加讲师
  saveTeacher(teacher) {
    return request({
      url: '/eduservice/teacher/addTeacher/',
      method: 'post',
      data: teacher
    })
  },
  //根据id查询讲师
  getTeacherById(id) {
    return request({
      url: '/eduservice/teacher/findTeacherById/'+id,
      method: 'get'
    })
  },
  //修改讲师
  editTeacher(id,teacher) {
    return request({
      url: '/eduservice/teacher/updateByTeacher/'+id,
      method: 'post',
      data: teacher
    })
  },
}