import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UploadImageDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  alt_text?: string;

  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @IsOptional()
  @IsUUID()
  project_id?: string;
}
