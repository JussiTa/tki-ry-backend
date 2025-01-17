import { Module } from '@nestjs/common';

import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotList } from '../lotlists/lots.list.entity';
import { Customer } from './customer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([LotList, Customer])],
  providers: [CustomerService],
  exports: [CustomerService, TypeOrmModule.forFeature([LotList, Customer])],
})
export class CustomerModule {}
