import {ISignIn} from "@/types/IAuth";
import httpInstance from "@/utils/HttpInstance";

const URL_API_LOGIN = {
    sign_in: "/auth/access-token"
}

export const signIn = async (data: ISignIn) => {
    const response = await httpInstance.post(URL_API_LOGIN.sign_in, data);
    return response.data;
}