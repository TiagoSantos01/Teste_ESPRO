import { PartialType, PickType } from '@nestjs/mapped-types';
import { Materias } from '@domain/entity/materias.entity';

export class CriarMateriaDTO extends PickType(Materias, ['nome'] as const) {}
export class AtualizarMateriaDTO extends PartialType(CriarMateriaDTO) {}
export class ExcluirMateriaDTO extends PickType(Materias, ['id'] as const) {}
