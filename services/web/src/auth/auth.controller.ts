import { Controller, Post, Body, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    response.cookie('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged in successfully' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('userId');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async getProfile(@Req() request: Request) {
    const userId = request.cookies['userId'];
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password_hash, ...result } = user;
    return result;
  }
}
