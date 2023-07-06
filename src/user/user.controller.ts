import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserInput } from './dto/user.input';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Post()
  @ApiBody({ type: UserInput })
  async create(@Body() user: UserInput): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  @ApiBody({ type: UserInput })
  async update(
    @Param('id') id: number,
    @Body() user: UserInput,
  ): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
