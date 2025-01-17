import { Module } from '@nestjs/common';
import { CustomerModule } from './customer.module';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
  imports: [CustomerModule],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerHttpModule {}
