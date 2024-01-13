import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';



@InputType()
export class PrescriptionInput {
  @MinLength(1)
  @Field()
  name: string;

  @MinLength(1, { each: true })
  @Field(() => [String]) 
  medications: string[];
}

@InputType()
export class PrescriptionUpdate {
  @MinLength(1)
  @Field()
  nhi: string;

  @MinLength(1, { each: true })
  @Field(() => [String]) 
  medications: string[];
}