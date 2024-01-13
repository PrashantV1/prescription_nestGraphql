
import mongoose, { Schema, Document, Model } from 'mongoose';

interface Patient {
    nhi:string,
    name:string,
  }
  interface Medication {
    id: string;
    dosage: string;
  }



export interface Prescription  {
    patient: Patient;
    date:Date,
    medications: Medication[];
  }


  const patientSchema = new Schema<Patient>({
    nhi: { type: String, required: true },
    name: { type: String, required: true }
  });
  
  const medicationSchema = new Schema<Medication>({
    id: { type: String, required: true },
    dosage: { type: String, required: true }
  });
  


  export const PrescriptionSchema = new Schema<Prescription>({
    patient: patientSchema,
    date: { type: Date, required: true },
    medications: [medicationSchema]
  });


  
  export const PrescriptionModel: Model<Prescription> = mongoose.model<Prescription>('Prescription', PrescriptionSchema);
