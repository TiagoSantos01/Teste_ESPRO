<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turmas extends Model
{
    protected $table = "turmas";
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_atualizacao';
    protected $fillable = [
        'nome',
        'serie',
        'periodo',
        'dia_da_semana',
        'cod_materia',
        'cod_sala',
        'qtd_alunos'
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

    public function scopeExcluir($query, $id)
    {
        return $query->where('id', $id)->where('exclusao', false)->update(['exclusao' => true, 'data_exclusao' => now()]);
    }
}
