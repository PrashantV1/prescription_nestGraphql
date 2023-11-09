import { Field, ObjectType, GraphQLISODateTime, ID } from '@nestjs/graphql';

@ObjectType('Patient')
class PatientType {
  @Field()
  nhi: string;

  @Field()
  name: string;
}

@ObjectType('Medication')
class MedicationType {
  @Field()
  id: string;

  @Field()
  dosage: string;
}

@ObjectType('Prescription')
export class PrescriptionType {
  @Field(() => PatientType) 
  patient: PatientType;

  @Field(() => GraphQLISODateTime)
  date: Date;

  @Field(() => [MedicationType]) 
  medications: MedicationType[];
}
