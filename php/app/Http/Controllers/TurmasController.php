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

class TurmasController
{
    public function index()
    {
        $turmas = Turmas::where('exclusao', false)->get();
        return response()->json($turmas);
    }

    const PREFIXES = [
        'nome' => 'Informe um nome válido.',
        'serie' => 'Informe uma série válida.',
        'periodo' => 'Informe um período válido.',
        'dia_da_semana' => 'Informe um dia da semana válido.',
        'cod_materia' => 'Informe um código de matéria válido.',
        'cod_sala' => 'Informe um código de sala válido.',
        'qtd_alunos' => 'Informe uma quantidade de alunos válida.'
    ];

    public function postTurma(Request $request)
    {
        $rules = [
            'nome' => 'required|string|max:255',
            'serie' => 'required|string|max:255',
            'periodo' => 'required|integer',
            'dia_da_semana' => 'required|integer',
            'cod_materia' => 'required|integer',
            'cod_sala' => 'required|integer',
            'qtd_alunos' => 'required|integer'
        ];
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $errors = $validator->errors()->toArray();


            $messages = [];
            foreach ($errors as $field => $msgs) {
                $pref = self::PREFIXES[$field] ?? null;
                $messages[$field] = array_map(fn($m) => $pref ? "$pref" : $m, $msgs);
            }

            return response()->json([
                'success' => false,
                'message' => 'Validação falhou. Verifique os campos.',
                'errors' => $messages,
            ], 400);
        }

        $validated = $validator->validated();

        $materiaExist = Materias::where('id', $validated['cod_materia'])->where('exclusao', false)->exists();
        if (!$materiaExist) {
            return response()->json(['error' => 'Matéria não encontrada'], 404);
        }
        $salaExist = Salas::where('id', $validated['cod_sala'])->where('exclusao', false)->exists();
        if (!$salaExist) {
            return response()->json(['error' => 'Sala não encontrada'], 404);
        }
        $periodoExist = Periodo::where('id', $validated['periodo'])->where('exclusao', false)->exists();
        if (!$periodoExist) {
            return response()->json(['error' => 'Período não encontrado'], 404);
        }
        $diaExist = DiasDaSemana::where('id', $validated['dia_da_semana'])->where('exclusao', false)->exists();
        if (!$diaExist) {
            return response()->json(['error' => 'Dia da semana não encontrado'], 404);
        }

        $turmaExistsNome = Turmas::where('nome', $validated['nome'])->where('exclusao', false)->exists();
        if ($turmaExistsNome) {
            return response()->json(['error' => 'Turma já existe'], 409);
        }
        $turmaExistsPeriodo = Turmas::where('cod_sala', $validated['cod_sala'])->where('periodo', $validated['periodo'])->where('dia_da_semana', $validated['dia_da_semana'])->where('exclusao', false)->exists();
        if ($turmaExistsPeriodo) {
            return response()->json(['error' => 'Sala já está ocupada nesse período'], 409);
        }

        $turma = Turmas::create($validated);
        return response()->json($turma, 201);
    }

    public function getTurma($id)
    {
        $turma = Turmas::where('id', $id)->where('exclusao', false)->first();
        if (!$turma) {
            return response()->json(['error' => 'Turma não encontrada'], 404);
        }
        return response()->json($turma);
    }

    public function updateTurma(Request $request, $id)
    {
        $rules = [
            'nome' => 'sometimes|string|max:255',
            'serie' => 'sometimes|string|max:255',
            'periodo' => 'sometimes|integer',
            'dia_da_semana' => 'sometimes|integer',
            'cod_materia' => 'sometimes|integer',
            'cod_sala' => 'sometimes|integer',
            'qtd_alunos' => 'sometimes|integer'
        ];
        ;
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $errors = $validator->errors()->toArray();


            $messages = [];
            foreach ($errors as $field => $msgs) {
                $pref = self::PREFIXES[$field] ?? null;
                $messages[$field] = array_map(fn($m) => $pref ? "$pref" : $m, $msgs);
            }

            return response()->json([
                'success' => false,
                'message' => 'Validação falhou. Verifique os campos.',
                'errors' => $messages,
            ], 400);
        }

        $validated = $validator->validated();

        $turma = Turmas::where('id', $id)->where('exclusao', false)->first();
        if (!$turma) {
            return response()->json(['error' => 'Turma não encontrada'], 404);
        }

        if (isset($validated['cod_materia'])) {
            $materiaExist = Materias::where('id', $validated['cod_materia'])->where('exclusao', false)->exists();
            if (!$materiaExist) {
                return response()->json(['error' => 'Matéria não encontrada'], 404);
            }
        }

        if (isset($validated['cod_sala'])) {

            $salaExist = Salas::where('id', $validated['cod_sala'])->where('exclusao', false)->exists();
            if (!$salaExist) {
                return response()->json(['error' => 'Sala não encontrada'], 404);
            }
        }

        if (isset($validated['periodo'])) {

            $periodoExist = Periodo::where('id', $validated['periodo'])->where('exclusao', false)->exists();
            if (!$periodoExist) {
                return response()->json(['error' => 'Período não encontrado'], 404);
            }
        }

        if (isset($validated['dia_da_semana'])) {

            $diaExist = DiasDaSemana::where('id', $validated['dia_da_semana'])->where('exclusao', false)->exists();
            if (!$diaExist) {
                return response()->json(['error' => 'Dia da semana não encontrado'], 404);
            }
        }

        if (isset($validated['nome'])) {
            $turmaExistsNome = Turmas::where('nome', $validated['nome'])->where('exclusao', false)->where('id', '!=', $id)->exists();
            if ($turmaExistsNome) {
                return response()->json(['error' => 'Turma já existe'], 409);
            }
        }

        $keysToCheck = ['cod_sala', 'periodo', 'dia_da_semana'];
        if (count(array_intersect($keysToCheck, array_keys($validated))) > 0) {
            $cod_sala = $validated['cod_sala'] ?? $turma->cod_sala;
            $periodo = $validated['periodo'] ?? $turma->periodo;
            $dia_da_semana = $validated['dia_da_semana'] ?? $turma->dia_da_semana;

            $turmaExistsPeriodo = Turmas::where('cod_sala', $cod_sala)->where('periodo', $periodo)->where('dia_da_semana', $dia_da_semana)->where('exclusao', false)->where('id', '!=', $id)->exists();
            if ($turmaExistsPeriodo) {
                return response()->json(['error' => 'Sala já está ocupada nesse período'], 409);
            }
        }

        $turma->update($validated);
        return response()->json($turma);
    }

    public function deleteTurma($id)
    {
        $turma = Turmas::where('id', $id)->where('exclusao', false)->first();
        if (!$turma) {
            return response()->json(['error' => 'Turma não encontrada'], 404);
        }

        $turmaExists = Alunos::where('cod_turma', $id)->where('exclusao', false)->exists();
        if ($turmaExists) {
            return response()->json(['error' => 'Turma possui alunos cadastrados'], 409);
        }
        $turma->excluir($id);
        return response()->json(null, 200);
    }
}
