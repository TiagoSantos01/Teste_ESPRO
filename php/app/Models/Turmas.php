<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class turmas extends Model
{
      protected $fillable = [
        'nome',
        'serie',
        'periodo',
        'dia_da_semana',
        'cod_materia',
        'cod_sala'
    ];
      protected function casts(): array
    {
        return [
            'id' => 'integer',
            'nome' => 'string',
            'serie' => 'string',
            'periodo' => 'string',
            'dia_da_semana' => 'string',
            'qtd_alunos' => 'integer',
            'cod_materia' => 'integer',
            'cod_sala' => 'integer',
            'exclusao' => 'boolean',
            'data_cadastro' => 'date',
            'data_exclusao' => 'date',
            'data_criacao' => 'date',
            'data_atualizacao' => 'date',
        ];
    }
}
