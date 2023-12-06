import { GenericResponse } from './generic-response.interface'

export interface ExceptionResponse extends GenericResponse {
  error: any
}
