import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PrismaService} from "../prisma.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {getJwtConfig} from "./jwt.config";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService]
  imports:[
      JwtModule.registerAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory:getJwtConfig

      })
  ]
})
export class AuthModule {}
