export interface IJwtPayload {
	id: number,
	created: Date,
	activated: boolean,
	email: string
}
export interface IJWT {
	id: number,
	created: Date,
	activated: boolean,
	email: string,
	iat: string,
	exp: string,
	issued: string,
	expires: string
}
