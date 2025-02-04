import httpInstance from "@/utils/HttpInstance"


export const URL_API_STAFF = {
  get: '/admin/staff',
  creat:'/admin/staff/create',
  update:'/admin/staff/update',
  delete:'/admin/staff/delete',
}

export const getStaff = async (url:string) => {
  const response = await httpInstance.get(url)
  return response.data
}

export const createStaff = async (data: IStaff) => {
  const response = await httpInstance.post(URL_API_STAFF.creat,data)
  return response.data
}

export const updateStaff = async (data: IStaff) => {
  const response = await httpInstance.put(`${URL_API_STAFF.update}/${data.id}`,data)
  return response.data
}