export interface ISignIn {
    username: string;
    password: string;
}

export interface ISignUp {
    username: string;
    password: string;
}

export interface IAuthResponse {
    "accessToken": string;
    "refreshToken": string;
    "user": {
        "id": number,
        "fullName": string,
        "dateOfBirth": Date,
        "role": string,
        "gender": string,
        "email": string
    }
}
