import { Body, Controller, Post } from '@nestjs/common';
import { PayTrailService } from './paytrail.service';
import { Public } from '../authentication/decorators/public.decorator';
import { Customer } from '../interface';

@Controller('paytrail')
export class PayTrailController {
  constructor(private readonly paytrailService: PayTrailService) {}

  @Post('get-payments')
  @Public()
  getPayments(@Body() user: Customer) {
    return this.paytrailService.createPayment(user);
  }
}
