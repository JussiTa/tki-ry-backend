import { Body, Controller, Post } from '@nestjs/common';
import { PayTrailService } from './paytrail.service';
import { Public } from '../authentication/decorators/public.decorator';
import { User } from '../interface';
@Controller('paytrail')
export class PayTrailController {
  constructor(private readonly paytrailService: PayTrailService) {}

  @Post('get-payments')
  @Public()
  @Public()
  getPayments(@Body() user: User) {
    return this.paytrailService.createPayment(user);
  }
}
