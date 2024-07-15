import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PatientService } from '../services/patient/patient.service';
import { map } from 'rxjs';

export class PatientRegisterValidator {
    static checkLogin(patientService: PatientService) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value.length === 0) {
                return null
            }
            
            return patientService.checkPatientExistByLogin(control.value).pipe(
              map(res => {
                return res ? { exist : true} : null;
              })  
            );
        };
    }

    static checkEmail(patientService: PatientService) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value.length === 0) {
                return null
            }

            return patientService.checkPatientExistByEmail(control.value).pipe(
                map(res => {
                    return res ? { exist: true } : null;
                })
            );
        };
    }
}