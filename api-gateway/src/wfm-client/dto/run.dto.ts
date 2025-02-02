import { IsString, IsObject } from 'class-validator';

export class RunDto {
  @IsString()
  definitionName: string;

  @IsObject()
  body: Record<string, any>;
}
