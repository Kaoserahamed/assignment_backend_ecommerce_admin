import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';

export class UpdateAttributeDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  slug?: string;

  @IsString()
  @IsOptional()
  @IsIn(['dropdown', 'radio', 'checkbox', 'colour', 'image'])
  type?: string;
}
