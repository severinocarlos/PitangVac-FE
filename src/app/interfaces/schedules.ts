import { Patient } from "./patient";

export type Status = 'Agendado' | 'Concluído' | 'Cancelado';

export interface Schedules {
    id: number,
    scheduleDate: string,
    scheduleTime: string,
    status: Status,
    createAt: string,
    patient: Patient
}
