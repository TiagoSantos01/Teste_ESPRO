<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class periodo extends Model
{
    protected $fillable = [
        'inicio',
        'fim',
    ];
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'inicio' => 'time',
            'fim' => 'time',
            'data_criacao' => 'date',
            'data_atualizacao' => 'date',
        ];
    }

}
