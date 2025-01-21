import { Controller, Get } from '@nestjs/common';
import { PayTrailService } from './paytrail.service';
import { Public } from '../authentication/decorators/public.decorator';
@Controller('paytrail')
export class PayTrailController {
  constructor(private readonly paytrailService: PayTrailService) {}

  @Get('get-payments')
  @Public()
  @Public()
  getPayments() {
    return this.paytrailService.createPayment();
  }
}
