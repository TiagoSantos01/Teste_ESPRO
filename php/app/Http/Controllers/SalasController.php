<?php

namespace App\Http\Controllers;

use App\Models\Salas;
use App\Models\Turmas;
use Illuminate\Http\Request;
use Validator;

class SalasController
{
    //
       public function index()
    {
        $salas = Salas::where('exclusao', false)->get();
        return response()->json($salas);
    }
    
    const PREFIXES = [
        'nome' => 'Informe um nome válido.',
    ];

    public function postSala(Request $request)
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

        $sala = Salas::where('nome', $validated['nome'])->where('exclusao', false)->exists();
        if ($sala) {
            return response()->json(['error' => 'Sala já existe'], 409);
        }

        $sala = Salas::create($validated);
        return response()->json($sala, 201);
    }

    public function getSala($id)
    {
        $sala = Salas::find($id);
        if (!$sala) {
            return response()->json(['error' => 'Sala não encontrada'], 404);
        }
        return response()->json($sala);
    }

    public function updateSala(Request $request, $id)
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

        $sala = Salas::where('id', $id)->where('exclusao', false)->first();
        if (!$sala) {
            return response()->json(['error' => 'Sala não encontrada'], 404);
        }

        $salaExists = Salas::where('nome', $validated['nome'])->where('id', '!=', $id)->where('exclusao', false)->exists();
        if ($salaExists) {
            return response()->json(['error' => 'Sala já existe'], 409);
        }

        $sala->update($validated);
        return response()->json($sala);
    }

    public function deleteSala($id)
    {
        $sala = Salas::where('id', $id)->where('exclusao', false)->first();
        if (!$sala) {
            return response()->json(['error' => 'Sala não encontrada'], 404);
        }

        $salaExists = Turmas::where('cod_sala', $id)->where('exclusao', false)->exists();
        if ($salaExists) {
            return response()->json(['error' => 'Sala está associada a uma turma ativa'], 409);
        }
        $sala->excluir($id);
        return response()->json(null, 200);
    }
}
