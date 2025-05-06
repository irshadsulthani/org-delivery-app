import privateApi from "./intreceptors/privateApi"
import  publicApi  from "./intreceptors/publicApi"

export const adminLogin = async (email:string,password:string)=>{
    const response = await publicApi('post','/auth/adminlogin',{email,password})
    return response
}

export const getAllUsers = async () => {        
    const response = await privateApi('get','/admin/getallusers')
    return response
}

export const logoutAdmin = async () => {
    const response = await publicApi('post','/auth/adminLogout')
    return response
}

export const getAllCustomers = async () => {
    const response = await privateApi('get','/admin/getallcustomers')
    return response
}

export const refreshToken = async () => {
    const response = await publicApi('post','/auth/refresh-token')
    return response
}

export const getAllDeliveryBoys = async () => {
    const response = await privateApi('get','/admin/getalldeliveryboys')
    return response
}

export const getAllReatilers =  async ()=>{
    const response = await privateApi('get','/admin/get-allReatilers')
    return response
}
