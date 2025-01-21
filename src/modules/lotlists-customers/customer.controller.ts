import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import type { User } from '../interface';
import { Customer } from './customer.entity';
import { Public } from '../authentication/decorators/public.decorator';

@Controller('lotlists-customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/create-list')
  create(@Body() req: any): Promise<boolean> {
    return this.customerService.createList(req);
  }
  @Public()
  @Get('/get-all')
  findAll(): Promise<number[]> {
    return this.customerService.findAll();
  }

  @Get('/get-all-customers')
  findAllWithCustomers(): Promise<Customer[]> {
    return this.customerService.findAllCustomers();
  }

  // @Get(':id')
  // findOne(@Param('id') id: number): Promise<User> {
  //   return this.usersService.findOne(id);
  // }
  @Post('/create-customer')
  createCustomer(@Body() user: User) {
    return this.customerService.create(user);
  }

  // @Delete(':id')
  // remove(@Param('id') id: number): Promise<void> {
  //   return this.usersService.remove(id);
  // }
}
