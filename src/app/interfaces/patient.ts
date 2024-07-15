import { PatientRegister } from "./patient-register";

export interface Patient extends PatientRegister {
    id: number,
    createAt: string
}