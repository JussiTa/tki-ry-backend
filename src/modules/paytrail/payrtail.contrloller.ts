import { Body, Controller, Post } from '@nestjs/common';
import { PayTrailService } from './paytrail.service';
@Controller('paytrail')
export class PayTrailController {
  constructor(private readonly paytrailService: PayTrailService) {}

  @Post()
  createPayment(@Body() paymenData: string) {
    this.paytrailService.createPayment();
  }
}
