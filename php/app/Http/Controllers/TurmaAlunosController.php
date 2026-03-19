<?php

namespace App\Http\Controllers;

use App\Models\Alunos;
use App\Models\DiasDaSemana;
use App\Models\Materias;
use App\Models\Periodo;
use App\Models\Salas;
use App\Models\Turmas;
use Illuminate\Http\Request;
use Validator;

class TurmaAlunosController
{

    public function getAlunosPorTurma($id)
    {
        $turmaExist = Turmas::where('id', $id)->where('exclusao', false)->exists();
        if (!$turmaExist) {
            return response()->json(['error' => 'Turma não encontrada'], 404);
        }
        $alunos = Alunos::where('cod_turma', $id)->where('exclusao', false)->first();
        if (!$alunos) {
            return response()->json(['error' => 'Alunos não encontrados'], 404);
        }
        return response()->json($alunos);
    }


    public function deleteAlunosPorTurma($id)
    {
        $turmaExist = Turmas::where('id', $id)->where('exclusao', false)->exists();
        if (!$turmaExist) {
            return response()->json(['error' => 'Turma não encontrada'], 404);
        }

        $updated = Alunos::where('cod_turma', $id)
            ->where('exclusao', false)
            ->update([
                'exclusao' => true,
                'data_exclusao' => now(),
            ]);

        if ($updated === 0) {
            return response()->json(['error' => 'Nenhum aluno encontrado'], 404);
        }
        return response()->json(null, 200);
    }
}
