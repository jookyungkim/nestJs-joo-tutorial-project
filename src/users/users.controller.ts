import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Res,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { SeletedUserDto } from './dto/seleted-user.dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentizls.dto';
import { AuthService } from 'src/auth/auth.service';

const logger = new Logger('users controller');

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService, // private authService: AuthService,
    private authService: AuthService,
  ) {}

  @Get('/')
  getAllUser(): Promise<User[]> {
    logger.debug('getAllUser start');
    return this.usersService.getAllUsers();
  }

  @Post('/')
  createUser(@Body(ValidationPipe) createUser: CreateUserDto): Promise<User> {
    logger.debug('createUser start');
    return this.usersService.createUser(createUser);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    logger.debug('getUserById start');
    return this.usersService.getUserById(id);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) response,
  ): Promise<void> {
    logger.debug('login start');
    const { access_token } = await this.authService.login(authCredentialsDto);
    await response.cookie('Authorization', access_token);
  }

  @UseGuards(jwtAuthGuard)
  @Get('/profile/1')
  getProfile(@Request() req): Promise<SeletedUserDto> {
    logger.debug('profile');
    return req.user;
  }
}
