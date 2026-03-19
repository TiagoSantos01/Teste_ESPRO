import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
} from 'class-validator';

export class Salas {

    @IsNumber({}, { message: 'salas.id.isNumber' })
    @IsNotEmpty({ message: 'salas.id.isNotEmpty' })
    id: number

    @IsString({ message: 'salas.nome.isString' })
    @IsNotEmpty({ message: 'salas.nome.isNotEmpty' })
    @Length(2, 100, { message: 'salas.nome.length' })
    nome: string

    @IsBoolean({ message: 'sa.exclusao.isBoolean' })
    @IsNotEmpty({ message: 'materias.exclusao.isNotEmpty' })
    exclusao: boolean

    data_exclusao: Date | null
    data_criacao: Date
    data_atualizacao: Date
}