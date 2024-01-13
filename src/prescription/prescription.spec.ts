import { PrescriptionService } from './prescription.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

jest.mock('./prescription.schema');

describe('PrescriptionService', () => {
  const prescriptionService: PrescriptionService= new PrescriptionService;

  describe('getPrescription', () => {
    it('should return prescriptions from both DB and API if available', async () => {
      const nhi = 'NH123456789';
      const dbResult = { patient: { nhi }, date: new Date(), medications: [] };
      const apiResult = { patient: { nhi }, date: new Date(), medications: [] };

      prescriptionService.prescriptionRepository.findOne=jest.fn().mockReturnValue(dbResult);
      prescriptionService.mockService.getMockPrescription=jest.fn().mockReturnValue(apiResult);


      const result = await prescriptionService.getPrescription(nhi);

      expect(result).toEqual([dbResult, apiResult]);
    });

    it('should throw NotFoundException if no prescriptions are found', async () => {
      const nhi = 'NH123456789';
      prescriptionService.prescriptionRepository.findOne=jest.fn().mockReturnValue(null);
      prescriptionService.mockService.getMockPrescription=jest.fn().mockReturnValue(null);

      await expect(prescriptionService.getPrescription(nhi)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createPrescription', () => {
    it('should create and return a prescription', async () => {
      const prescriptionInput = { name: 'John Doe', medications: ['medication1', 'medication2'] };
      const createdPrescription = { patient: { name: prescriptionInput.name, nhi: 'NH123456789' }, date: new Date(), medications: [] };

      prescriptionService.prescriptionRepository.create=jest.fn().mockReturnValue(createdPrescription);
      prescriptionService.mockService.addPrescription=jest.fn().mockReturnValue({ success: true });

      const result = await prescriptionService.createPrescription(prescriptionInput);

      expect(result).toEqual(createdPrescription);
    });

    it('should throw BadRequestException if an error occurs during creation', async () => {
      const prescriptionInput = { name: 'John Doe', medications: ['medication1', 'medication2'] };

      prescriptionService.prescriptionRepository.create=jest.fn().mockReturnValue(new Error());
      prescriptionService.mockService.addPrescription=jest.fn().mockReturnValue({ success: false });


      await expect(prescriptionService.createPrescription(prescriptionInput)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('updatePrescription', () => {
    it('should update and return the prescription', async () => {
      const nhi = 'NH123456789';
      const medications = ['updatedMedication1', 'updatedMedication2'];
      
      prescriptionService.prescriptionRepository.findOne=jest.fn().mockReturnValue({ patient: { nhi }, date: new Date(), medications: [] });
      prescriptionService.prescriptionRepository.findOneAndUpdate=jest.fn().mockReturnValue({ patient: { nhi }, date: new Date(), medications: [] });

      prescriptionService.mockService.updateMockPresciption=jest.fn().mockReturnValue({ success: true });

      const result = await prescriptionService.updatePrescription({ nhi, medications });

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if an error occurs during update', async () => {
      const nhi = 'NH123456789';
      const medications = ['updatedMedication1', 'updatedMedication2'];

      prescriptionService.prescriptionRepository.findOne=jest.fn().mockReturnValue(null);
      prescriptionService.mockService.getMockPrescription=jest.fn().mockReturnValue({ success: false });


      await expect(prescriptionService.updatePrescription({ nhi, medications })).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadExceptionError if an error occurs during update', async () => {
      const nhi = 'NH123456789';
      const medications = ['updatedMedication1', 'updatedMedication2'];

      prescriptionService.prescriptionRepository.findOne=jest.fn().mockReturnValue({ patient: { nhi }, date: new Date(), medications: [] });
      prescriptionService.prescriptionRepository.findOneAndUpdate=jest.fn().mockReturnValue(null);

      prescriptionService.mockService.getMockPrescription=jest.fn().mockReturnValue({ success: false });


      await expect(prescriptionService.updatePrescription({ nhi, medications })).rejects.toThrowError(BadRequestException);
    });
  });
});
