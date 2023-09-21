export type CreateUserParams = {
    username: string;
    password: string;
};
export type UpdateUserParams = {
    username: string;
    email: string;
};

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