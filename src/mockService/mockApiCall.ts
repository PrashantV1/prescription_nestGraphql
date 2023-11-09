import { Prescription } from 'src/prescription/prescription.schema';

const prescriptionData = [];

export class MockService {
  constructor() {}
  addPrescription = async (
    prescription: Prescription,
  ): Promise<{ success: boolean }> => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        prescriptionData.push(prescription);
        res({ success: true });
      }, 500);
    });
  };

  getMockPrescription = async (nhi: String): Promise<Prescription> => {
    return new Promise((res, rej) => {
      const returnOuput = [];
      setTimeout(() => {
        prescriptionData.forEach((prescription) => {
          if (prescription.patient.nhi == nhi) returnOuput.push(prescription);
        });
        res(returnOuput[0]);
      }, 500);
    });
  };

  updateMockPresciption = async (
    nhi: String,
    medications: { id: string; dosage: string }[],
  ): Promise<{ success: boolean }> => {
    return new Promise((res, rej) => {
      const returnOuput = [];
      setTimeout(() => {
        prescriptionData.forEach((prescription) => {
          if (prescription.patient.nhi == nhi) {
            prescription.medications.push(...medications);
            returnOuput.push(prescription);
          }
        });
        res({ success: true });
      }, 500);
    });
  };
}
