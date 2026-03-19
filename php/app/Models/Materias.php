<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materias extends Model
{
    protected $table = "materias";

     const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_atualizacao';
    protected $fillable = [
        'nome',
    ];
          protected function casts(): array
    {
        return [
            'id' => 'integer',
            'nome' => 'string',
            'exclusao' => 'boolean',
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
