import { PartialType } from '@nestjs/mapped-types';
import { CreateWfmDto } from './create-wfm.dto';

export class UpdateWfmDto extends PartialType(CreateWfmDto) {
  id: number;
}
