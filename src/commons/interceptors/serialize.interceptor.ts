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

// serialize is a decorator that takes a class as an argument. this class is a dto.
// Indicate that the response should be serialized using the dto. It transforms the response to the dto.
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {} // dto is a class. It is a type of UserDto. any is used because the type of dto is not known.

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // pipe() allows us to add operators to the observable and transform the data. it's used in the handler.
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          // excludeExtraneousValues: true means that if a property is not defined in UserDto, it will not be returned.
          excludeExtraneousValues: true,
        })
      }),
    )
  }
}
