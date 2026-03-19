import { PartialType, PickType } from '@nestjs/mapped-types';
import { Salas } from '@domain/entity/salas.entity';

export class CriarSalaDTO extends PickType(Salas, ['nome'] as const) {}
export class AtualizarSalaDTO extends PartialType(CriarSalaDTO) {}
export class ExcluirSalaDTO extends PickType(Salas, ['id'] as const) {}
