import { Schedules } from "./schedules";

export interface SchedulesPagination {
    totalLength: number,
    schedulings: Schedules[]
}