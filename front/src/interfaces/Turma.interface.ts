import { Serie } from "../enum/serie.enum";

export interface Turma {
    id: number

    nome: string

    serie: Serie;

    periodo: number

    dia_da_semana: number

    qtd_alunos: number

    cod_materia: number
    cod_sala: number
}