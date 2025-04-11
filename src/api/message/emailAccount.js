import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/email/account/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/email/account/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/email/account/edit',
    method: 'put',
    data
  })
}

export function getAllEmailAccounts() {
  const params = {
    pageIndex: 1,
    pageSize: 100
  }
  return request({
    url: 'api/email/account/query',
    method: 'get',
    params
  })
}

export default { add, edit, del }
