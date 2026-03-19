import { PartialType, PickType } from '@nestjs/mapped-types';
import { DiasDaSemana } from '@domain/entity/dias-da-semana.entity';

export class CriarDiaDaSemanaDTO extends PickType(DiasDaSemana, ['nome'] as const) { }
export class AtualizarDiaDaSemanaDTO extends PartialType(CriarDiaDaSemanaDTO) { }
export class ExcluirDiaDaSemanaDTO extends PickType(DiasDaSemana, ['id'] as const) { }
