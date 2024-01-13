import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionSchema } from './prescription.schema';
import { PrescriptionResolver } from './prescription.resolver';
import { PrescriptionService } from './prescription.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Prescription', schema: PrescriptionSchema }])],
  providers: [PrescriptionService, PrescriptionResolver],
  exports:[PrescriptionService]
})
export class PrescriptionModule {}
