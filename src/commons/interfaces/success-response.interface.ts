import { GenericResponse } from './generic-response.interface'

export interface SuccessResponse<T> extends GenericResponse {
  data: T
  pagination?: {
    currentPage: number
    itemsPerPage: number
    totalItems?: number
    itemCount?: number
    totalPages?: number
  }
}
