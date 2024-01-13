import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrescriptionService } from './prescription.service';
import { PrescriptionType } from './prescription.type';
import { PrescriptionInput,PrescriptionUpdate } from './createPrescriptionInput';

@Resolver((of) => PrescriptionType)
export class PrescriptionResolver {
  constructor(private prescriptionService: PrescriptionService) {}

  @Query((returns) => [PrescriptionType])
  getPrescription(@Args('nhi') nhi: string) {
    return this.prescriptionService.getPrescription(nhi);
  }


  @Mutation((returns) => PrescriptionType)
  async createPrescription(
    @Args('Prescription') Prescription: PrescriptionInput,
  ) {
    return this.prescriptionService.createPrescription(Prescription);
  }


  @Mutation((returns) => PrescriptionType)
  async updatePrescription(
    @Args('Prescription') Prescription: PrescriptionUpdate,
  ) {
    return this.prescriptionService.updatePrescription(Prescription);
  }
}
