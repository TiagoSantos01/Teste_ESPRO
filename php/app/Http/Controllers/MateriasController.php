<?php

namespace App\Http\Controllers;

use App\Models\Materias;
use App\Models\Turmas;
use Illuminate\Http\Request;
use Validator;

class MateriasController
{
     public function index()
    {
        $materias = Materias::where('exclusao', false)->get();
        return response()->json($materias);
    }
    
    const PREFIXES = [
        'nome' => 'Informe um nome válido.',
    ];

    public function postMateria(Request $request)
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

        $materia = Materias::where('nome', $validated['nome'])->where('exclusao', false)->exists();
        if ($materia) {
            return response()->json(['error' => 'Matéria já existe'], 409);
        }

        $materia = Materias::create($validated);
        return response()->json($materia, 201);
    }

    public function getMateria($id)
    {
        $materia = Materias::where('id', $id)->where('exclusao', false)->first();
        if (!$materia) {
            return response()->json(['error' => 'Matéria não encontrada'], 404);
        }
        return response()->json($materia);
    }

    public function updateMateria(Request $request, $id)
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

        $materia = Materias::where('id', $id)->where('exclusao', false)->first();
        if (!$materia) {
            return response()->json(['error' => 'Matéria não encontrada'], 404);
        }

        $materiaExists = Materias::where('nome', $validated['nome'])->where('id', '!=', $id)->where('exclusao', false)->exists();
        if ($materiaExists) {
            return response()->json(['error' => 'Matéria já existe'], 409);
        }

        $materia->update($validated);
        return response()->json($materia);
    }

    public function deleteMateria($id)
    {
        $materia = Materias::where('id', $id)->where('exclusao', false)->first();
        if (!$materia) {
            return response()->json(['error' => 'Matéria não encontrada'], 404);
        }

        $materiaExists = Turmas::where('cod_materia', $id)->where('exclusao', false)->exists();
        if ($materiaExists) {
            return response()->json(['error' => 'Matéria está associada a uma turma ativa'], 409);
        }
        $materia->excluir($id);
        return response()->json(null, 200);
    }
}
