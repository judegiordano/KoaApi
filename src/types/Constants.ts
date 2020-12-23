/* eslint-disable no-unused-vars */
export const enum Environment {
	dev = "development",
	stg = "staging",
	prod = "production"
}

export const enum RequestErrors {
	missingBody = "missing body { email:string, password:string }"
}

export const enum JWTErrs {
	invalidToken = "Invalid token"
}

export const enum UserErrors {
	emailTaken = "email taken",
	emailNotFound = "email not found",
	wrongPassword = "incorrect password",
	wrongId = "node user found matching given id"
}

export const enum RateLimit {
	error = "Too Many Requests. Please Try Again later."
}

export const enum Database {
	connectionSucc = "successfully connected to database",
	connectionErr = "error connecting to database"
}