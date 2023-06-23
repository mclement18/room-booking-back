import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date | undefined> {
  private required: boolean;

  constructor(options?: { required?: boolean }) {
    this.required = !!options?.required;
  }

  transform(value: string, metadata: ArgumentMetadata): Date | undefined {
    if (metadata.metatype !== Date) {
      throw new BadRequestException('Argument type definition does not match.');
    }

    if (!this.required && value === undefined) {
      return value;
    }

    if (value === undefined) {
      throw new BadRequestException('Date query param cannot be undefined.');
    }

    return new Date(value);
  }
}
