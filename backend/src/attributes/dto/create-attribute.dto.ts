import { IsString, IsNotEmpty, IsIn, MaxLength } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

  @IsString()
  @IsIn(['dropdown', 'radio', 'checkbox', 'colour', 'image'])
  type: string;
}
