<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alunos extends Model
{
    protected $table = "alunos";
     const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_atualizacao';
    protected $fillable = [
        'nome',
        'cpf',
        'data_nascimento',
        'email',
        'telefone',
        'endereco',
        'cod_turma'
    ];
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'nome' => 'string',
            'cpf' => 'string',
            'data_nascimento' => 'date',
            'email' => 'string',
            'telefone' => 'string',
            'endereco' => 'string',
            'cod_turma' => 'integer',
            'exclusao' => 'boolean',
            'data_exclusao' => 'date',
            'data_criacao' => 'date',
            'data_atualizacao' => 'date',
        ];
    }

    public function turma()
    {
        return $this->belongsTo(Turmas::class, 'cod_turma');
    }

    public function scopeByTurma($query, $turmaId)
    {
        return $query->where('cod_turma', $turmaId)->where('exclusao', false);
    }

  
    public function scopeAtivo($query)
    {
        return $query->where('exclusao', false);
    }
    public function scopeAtivoById($query, $id)
    {
        return $query->where('id', $id)->where('exclusao', false);
    }
    public function scopeCpfByAtivo($query, $cpf)
    {
        return $query->where('cpf', $cpf)->where('exclusao', false);
    }
    public function scopeExcluir($query, $id)
    {
        return $query->where('id', $id)->where('exclusao', false)->update(['exclusao' => true, 'data_exclusao' => now()]);
    }

    
}
