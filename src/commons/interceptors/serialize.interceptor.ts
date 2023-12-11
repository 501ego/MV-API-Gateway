import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'

interface ClassConstructor {
  new (...args: any[]): object
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        let objectToSerialize
        if (data.client) {
          objectToSerialize = data.client.data
        } else if (data.employee) {
          objectToSerialize = data.employee.data
        } else {
          throw new Error('Invalid data structure')
        }

        const serializedObject = plainToInstance(this.dto, objectToSerialize, {
          excludeExtraneousValues: true,
        })

        return data.access_token
          ? {
              ...serializedObject,
              access_token: data.access_token,
            }
          : serializedObject
      }),
    )
  }
}
