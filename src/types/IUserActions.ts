export interface ILogin {
	email: string,
	password: string
}

export interface IRegister {
	email: string,
	password: string
}

export interface IUpdateEmail {
	id: string,
	email: string,
	newEmail: string
}

export interface IUpdatePass {
	id: string,
	email: string,
	newPassword: string
}

export interface IDeleteAccount {
	id: string,
	email: string,
	password: string
}