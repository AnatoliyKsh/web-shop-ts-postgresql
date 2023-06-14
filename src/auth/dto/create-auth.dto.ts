import {isEmail, isString, minLength} from "class-validator";

export class CreateAuthDto {
    @isEmail()
    email: string
    @minLength(6)
    @isString()
    password: string
}
