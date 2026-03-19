import { PartialType, PickType } from '@nestjs/mapped-types';
import { Turmas } from '@domain/entity/turmas.entity';

export class CriarTurmaDTO extends PickType(Turmas, ['nome', 'serie', 'periodo', 'dia_da_semana', 'qtd_alunos', 'cod_materia', 'cod_sala'] as const) {}
export class AtualizarTurmaDTO extends PartialType(CriarTurmaDTO) {}
export class ExcluirTurmaDTO extends PickType(Turmas, ['id'] as const) {}
