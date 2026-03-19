import { PartialType, PickType } from '@nestjs/mapped-types';
import { Alunos } from '@domain/entity/alunos.enity';

export class CriarAlunoDTO extends PickType(Alunos, ['nome', 'data_nascimento', 'email', 'cpf', 'telefone', 'endereco', 'cod_turma'] as const) {}
export class AtualizarAlunoDTO extends PartialType(CriarAlunoDTO) {}
export class ExcluirAlunoDTO extends PickType(Alunos, ['id'] as const) {}
