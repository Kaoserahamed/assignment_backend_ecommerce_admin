import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class OAuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  provider: string; // 'google' | 'github'
}
