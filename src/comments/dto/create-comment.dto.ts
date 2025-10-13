import { IsString, IsEmail, IsIn, IsDateString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    content: string;
}
