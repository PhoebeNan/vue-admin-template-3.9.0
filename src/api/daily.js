import request from '@/utils/request'

//const api_name = '/statistics/daily/memberRegisterCount'

export default {

  getStatisticsDate(day) {
    return request({
      url: '/statistics/daily/memberRegisterCount/'+day,
      method: 'get'
    })
  
  }
}