interface ICustomer{
    id: number,
    fullName: string,
    password: string,
    dateOfBirth?: Date | string,
    gender: string,
    phoneNumber: string,
    email: string,
    status: string,
    addresses: any,
    createdAt?: Date,
    updatedAt?: Date,
}

interface IRegister{
    fullName:string,
    phoneNumber:string,
    email:string,
    password:string,
    passwordComfirm:string
}