import { EUserStatus } from "../users/users.enum";

export type CreateUserParams = {
    username: string;
    password: string;
};
export type UpdateUserParams = {
    username: string;
    email: string;
};

export type ChangePasswordParams = {
    oldPassword: string;
    newPassword: string;
};

export type ForgotPasswordParams = {
    email: string;
}

export type UpdatePasswordParams = {
    token: string;
    newPassword: string;
}

export type CreateUserProfileParams = {
    firstname: string;
    lastname: string;
    age: number;
    dob: string;
};

export type CreateTodoParams = {
    item : string;
}

export type UpdateTodoParams = {
    item: string;
}

export type UpdateUserFileParams = {
    uploadFile: string;
}