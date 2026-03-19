<?php

namespace App\Http\Controllers;

use App\Models\DiasDaSemana;
use App\Models\Turmas;
use Illuminate\Http\Request;
use Validator;

class DiasDaSemanaController
{
    public function index()
    {
        $dias = DiasDaSemana::where('exclusao', false)->get();
        return response()->json($dias);
    }

    const PREFIXES = [
        'nome' => 'Informe um nome válido.',
    ];

    public function postDia(Request $request)
    {
        $rules = [
            'nome' => 'required|string|max:255',
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

        $dia = DiasDaSemana::where('nome', $validated['nome'])->where('exclusao', false)->exists();
        if ($dia) {
            return response()->json(['error' => 'Dia já existe'], 409);
        }

        $dia = DiasDaSemana::create($validated);
        return response()->json($dia, 201);
    }

    public function getDia($id)
    {
        $dia = DiasDaSemana::where('id', $id)->where('exclusao', false)->first();
        if (!$dia) {
            return response()->json(['error' => 'Dia não encontrado'], 404);
        }
        return response()->json($dia);
    }

    public function updateDia(Request $request, $id)
    {
        $rules = [
            'nome' => 'sometimes|string|max:255',
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

        $dia = DiasDaSemana::where('id', $id)->where('exclusao', false)->first();
        if (!$dia) {
            return response()->json(['error' => 'Dia não encontrado'], 404);
        }

        $diaExists = DiasDaSemana::where('nome', $validated['nome'])->where('id', '!=', $id)->where('exclusao', false)->exists();
        if ($diaExists) {
            return response()->json(['error' => 'Dia já existe'], 409);
        }

        $dia->update($validated);
        return response()->json($dia);
    }

    public function deleteDia($id)
    {
        $dia = DiasDaSemana::where('id', $id)->where('exclusao', false)->first();
        if (!$dia) {
            return response()->json(['error' => 'Dia não encontrado'], 404);
        }

        $diaExists = Turmas::where('dia_da_semana', $id)->where('exclusao', false)->exists();
        if ($diaExists) {
            return response()->json(['error' => 'Dia está associado a uma turma ativa'], 409);
        }
        $dia->excluir($id);
        return response()->json(null, 200);
    }

}
