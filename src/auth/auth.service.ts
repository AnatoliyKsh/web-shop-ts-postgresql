import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateAuthDto} from './dto/create-auth.dto';
import {UpdateAuthDto} from './dto/update-auth.dto';
import {PrismaService} from "../prisma.service";
import {faker} from "@faker-js/faker";
import {hash, verify} from "argon2";
import {JwtService} from "@nestjs/jwt";
import {NotFoundError} from "rxjs";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {
    }

    async login(dto: CreateAuthDto) {
        const user = await this.validateUser(dto)
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken)
        if (result) throw new UnauthorizedException('Invalid token')
        const user = await this.prisma.user.findUnique({
            where: {id: result.id}
        })
        const tokens = await this.issuetoken(user.id)
    }


    async register(dto: CreateAuthDto) {
        const oldUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if (oldUser) throw new BadRequestException("User alredy exist")
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: faker().name.firstName(),
                avatarPath: faker.image.avatar()
                phone: faker.phone.number('+ # (###) ###-##-##')
                password: await hash(dto.password)
            }
        })
        const tokens = await this.issuetoken(user.id)

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    private async issuetoken(userId: number) {
        const data = {id: userId}
        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'

        })
        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d',
        })
        return {accessToken, refreshToken}
    }

    private returnUserFields(user: User) {

        return {
            id: uset.id
            email: user.email

        }
    }

    private async validateUser(dto: CreateAuthDto){
        const user = await this.prisma.user.findUnique({
        where: {
            email: dto.email
        }
    })
        if (!user) throw new NotFoundError("User not found")

        const isValid = await  verify(dto.password,user.password)

        if(!isValid) throw new UnauthorizedException('Invalid')
        return user
    }



}
