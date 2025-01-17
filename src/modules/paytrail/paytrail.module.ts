import { Module } from '@nestjs/common';
import { PayTrailController } from './payrtail.contrloller';
import { PayTrailService } from './paytrail.service';

@Module({
  providers: [PayTrailService],
  controllers: [PayTrailController],
})
export class PayTrailModule {}
