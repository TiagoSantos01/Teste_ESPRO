import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    IsBoolean,
    IsEnum,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { Serie } from '@domain/enum/serie.enum';
export class Turmas {
    @IsNumber({}, { message: 'turmas.id.isNumber' })
    @IsNotEmpty({ message: 'turmas.id.isNotEmpty' })
    id: number

    @IsString({ message: 'turmas.nome.isString' })
    @IsNotEmpty({ message: 'turmas.nome.isNotEmpty' })
    @Length(2, 100, { message: 'turmas.nome.length' })
    nome: string

    @IsEnum(Serie, { message: 'turmas.serie.isEnum' })
    @IsNotEmpty({ message: 'turmas.serie.isNotEmpty' })
    @Transform(({ value }: { value: unknown }) =>
        typeof value === 'string'
            ? value.toLowerCase().trim()
            : value,
        { toClassOnly: true },
    )
    serie: Serie;

    @IsNumber({}, { message: 'turmas.periodo.isNumber' })
    @IsNotEmpty({ message: 'turmas.periodo.isNotEmpty' })
    periodo: number

    @IsNumber({}, { message: 'turmas.dia_da_semana.isNumber' })
    @IsNotEmpty({ message: 'turmas.dia_da_semana.isNotEmpty' })
    dia_da_semana: number

    @IsNumber({}, { message: 'turmas.qtd_alunos.isNumber' })
    @IsNotEmpty({ message: 'turmas.qtd_alunos.isNotEmpty' })
    qtd_alunos: number

    @IsNumber({}, { message: 'turmas.cod_materia.isNumber' })
    @IsNotEmpty({ message: 'turmas.cod_materia.isNotEmpty' })
    cod_materia: number
    @IsNumber({}, { message: 'turmas.cod_sala.isNumber' })
    @IsNotEmpty({ message: 'turmas.cod_sala.isNotEmpty' })
    cod_sala: number
    @IsBoolean({ message: 'turmas.exclusao.isBoolean' })
    @IsNotEmpty({ message: 'turmas.exclusao.isNotEmpty' })
    exclusao: boolean

    data_exclusao: Date | null
    data_cadastro: Date
    data_criacao: Date
    data_atualizacao: Date

}
