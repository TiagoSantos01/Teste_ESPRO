<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiasDaSemana extends Model
{
    protected $fillable = [
        'nome',
    ];
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'nome' => 'string',
            'data_criacao' => 'date',
            'data_atualizacao' => 'date',
        ];
    }
}
