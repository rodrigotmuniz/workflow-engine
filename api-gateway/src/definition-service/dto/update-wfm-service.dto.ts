import { PartialType } from '@nestjs/mapped-types';
import { CreateWfmServiceDto } from './create-wfm-service.dto';

export class UpdateWfmServiceDto extends PartialType(CreateWfmServiceDto) {}
