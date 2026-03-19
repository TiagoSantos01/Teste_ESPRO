import { PartialType, PickType } from '@nestjs/mapped-types';
import { Periodo } from '@domain/entity/periodo.entity';

export class CriarPeriodoDTO extends PickType(Periodo, ['inicio', 'fim'] as const) { }
export class AtualizarPeriodoDTO extends PartialType(CriarPeriodoDTO) { }
export class ExcluirPeriodoDTO extends PickType(Periodo, ['id'] as const) { }
