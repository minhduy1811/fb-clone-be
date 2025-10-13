// src/auth/dto/create-user.dto.ts
import { IsString, IsEmail, IsIn, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  uid!: string;

  @IsEmail()
  email!: string;

  @IsString()
  displayName?: string;

  @IsIn(['male', 'female', 'other'])
  gender!: 'male' | 'female' | 'other';

  @IsDateString()
  birthdate!: string;

  @IsIn(['user', 'admin'])
  role!: 'user' | 'admin';
}
