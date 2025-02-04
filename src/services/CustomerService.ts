import httpInstance from "@/utils/HttpInstance"


export const URL_API_CUSTOMER = {
  get: '/admin/customer',
  creat:'/admin/customer/create',
  update:'/admin/customer/update',
  delete:'/admin/customer/delete',
  register:'/admin/customer/register',
  changePassword:'/admin/customer/changePassword',
  productSalesByUserMapping:'/admin/customer/productSalesByUser'
}

export const getCustomers = async (url:string) => {
  const response = await httpInstance.get(url)
  return response.data
}
export const getProductSalesByUser = async (url:string) => {
  const response = await httpInstance.get(url);
  return response.data
}

export const getDetailCustomer = async (key: string) => {
  // const id = key.split('/').pop(); // Lấy id từ key nếu cần
  const response = await httpInstance.get(key);
  return response.data;
};


// Tạo người dùng bên admin
export const createCustomer = async (data: ICustomer) => {
  const response = await httpInstance.post(URL_API_CUSTOMER.creat,data)
  return response.data
}


// Đăng kí tạo tài khoản người dùng
export const registerCustomer = async (data: IRegister) => {
  const response = await httpInstance.post(URL_API_CUSTOMER.register,data)
  return response.data
}

// Cập nhật người dùng
export const updateCustomer = async (data: ICustomer) => {
  const response = await httpInstance.put(`${URL_API_CUSTOMER.update}/${data.id}`,data)
  return response.data
}

// Thay đổi password
export const changePasswordCustomer = async (data: ICustomer) => {
  const response = await httpInstance.put(`${URL_API_CUSTOMER.changePassword}/${data.id}`,data)
  return response.data
}
