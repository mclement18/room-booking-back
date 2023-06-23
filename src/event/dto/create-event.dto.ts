import {
  IsDateString,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsLaterThan } from 'src/validators/IsLaterThan';

export class CreateEventDto {
  @IsString()
  @MinLength(5, { message: 'Name too short' })
  @MaxLength(150, { message: 'Name too long' })
  name: string;

  @IsDateString()
  start: Date;

  @IsDateString()
  @IsLaterThan('start')
  end: Date;

  @IsInt()
  roomId: number;
}
