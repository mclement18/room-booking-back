import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(3, { message: 'Name too short' })
  @MaxLength(75, { message: 'Name too long' })
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(15)
  color: string;
}
