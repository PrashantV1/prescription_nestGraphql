import { Injectable } from '@nestjs/common';
import {Prescription,PrescriptionModel} from './prescription.schema';
import { PrescriptionInput, PrescriptionUpdate } from './createPrescriptionInput';
import { NotFoundException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {genRandomId} from '../utils/genRandom';
import {MockService} from '../mockService/mockApiCall';

@Injectable()
export class PrescriptionService {
  public mockService=new MockService();
  constructor(
    @InjectModel('Prescription') public prescriptionRepository=PrescriptionModel
  ) {}

  async getPrescription(nhi: string): Promise<Prescription[]|string> {
    const prescriptionDataFromDb= this.prescriptionRepository.findOne({ "patient.nhi":nhi });
    const prescriptionFromApi=this.mockService.getMockPrescription(nhi);
    const[dbResult,apiResult]= await Promise.all([prescriptionDataFromDb,prescriptionFromApi])
    const result=this.getResponse(dbResult,apiResult);
    if(result.length)
    return result;
    throw new NotFoundException(`prescription with nhi ${nhi} not found`);
  }



  async createPrescription(
    PrescriptionInput: PrescriptionInput,
  ): Promise<Prescription> {
    const { name, medications } = PrescriptionInput;
    const prescriptionData=this.createPrescriptionObj(medications,name);
    const dbPromise= this.prescriptionRepository.create(prescriptionData);
    const apiPromise=this.mockService.addPrescription(prescriptionData);

  const[dbResult,apiResult]= await Promise.all([dbPromise,apiPromise])
  if(!apiResult.success||!dbResult)
  throw new BadRequestException(`Error while creating Prescription`)
  return dbResult;
  }



  async updatePrescription(PrescriptionUpdate: PrescriptionUpdate): Promise<Prescription> {
    const {nhi,medications}=PrescriptionUpdate;
    const medicationData=this.createMedicationArray(medications);
    const dbUpdate=this.updatePrescriptionDb(medicationData,nhi);
    const apiUpdate=this.mockService.updateMockPresciption(nhi,medicationData);
    const [updatedDB,upDatedApi]=await Promise.all([dbUpdate,apiUpdate]);
    if(!upDatedApi.success||!updatedDB){
      throw new BadRequestException(`Error while updating ${nhi}`);
    }
    return updatedDB;
  }


 private async updatePrescriptionDb(medicationData:{id: string;dosage: string;}[],nhi:string){
  const prescriptionDataFromDb= await this.prescriptionRepository.findOne({ "patient.nhi":nhi });
  if(!prescriptionDataFromDb)
  throw new NotFoundException(`prescription with nhi ${nhi} not found`);
    const dbUpdate =await this.prescriptionRepository.findOneAndUpdate(
      { "patient.nhi": nhi },
      {
        $set: {
          medications: [...prescriptionDataFromDb.medications,...medicationData ],
        },
      }
    );
    return dbUpdate;
  }
  
 private  createMedicationArray(medications:string[]):{id: string;dosage: string;}[]{
    const medicationData=[];
    medications.forEach(dosage => {
      medicationData.push({id:genRandomId('MD',10),dosage})
    });
    return medicationData;
  }

  private createPrescriptionObj(medications:string[],name:string):Prescription{
  const medicationData=this.createMedicationArray(medications);
  const prescriptionData ={
    patient:{
      name,
      nhi:genRandomId('NH',10)
    },
    date:new Date(),
    medications:medicationData
  };
  return prescriptionData;
 }

 private getResponse(dbResult:Prescription,apiResult:Prescription):Prescription[]{
  if(dbResult||apiResult){
    const response=[];
         if(dbResult)
         response.push(dbResult);
        if(apiResult)
        response.push(apiResult)
      return response;
  }
  return [];
}
}
