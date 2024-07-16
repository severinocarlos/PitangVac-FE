import { Patient } from "./patient";

type status = 'Agendado' | 'Concluído' | 'Cancelado';

export interface Schedules {
    id: number,
    scheduleDate: string,
    scheduleTime: string,
    status: status,
    createAt: string,
    patient: Patient
}
