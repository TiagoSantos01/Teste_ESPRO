<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use App\Models\Turmas;
use Illuminate\Http\Request;
use Validator;

class PeriodoController
{
    //

    public function index()
    {
        $periodos = Periodo::where('exclusao', false)->get();
        return response()->json($periodos);
    }

    const PREFIXES = [
        'inicio' => 'Informe um início válido.',
        'fim' => 'Informe um fim válido.',
    ];

    public function postPeriodo(Request $request)
    {
        $rules = [
            'inicio' => 'required|date_format:H:i',
            'fim' => 'required|date_format:H:i|after:inicio',
        ];

        $messages = [
            'inicio.required' => 'Informe um início válido.',
            'inicio.date_format' => 'Informe o início no formato HH:mm.',
            'fim.required' => 'Informe um fim válido.',
            'fim.date_format' => 'Informe o fim no formato HH:mm.',
            'fim.after' => 'O fim deve ser posterior ao início.',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validação falhou. Verifique os campos.',
                'errors' => $validator->errors()->toArray(),
            ], 400);
        }

        $validated = $validator->validated();

        $periodo = Periodo::where('inicio', $validated['inicio'])->where('fim', $validated['fim'])->where('exclusao', false)->exists();
        if ($periodo) {
            return response()->json(['error' => 'Período já existe'], 409);
        }

        $periodo = Periodo::create($validated);
        return response()->json($periodo, 201);
    }

    public function getPeriodo($id)
    {
        $periodo = Periodo::where('id', $id)->where('exclusao', false)->first();
        if (!$periodo) {
            return response()->json(['error' => 'Período não encontrado'], 404);
        }
        return response()->json($periodo);
    }

    public function updatePeriodo(Request $request, $id)
    {
          $rules = [
            'inicio' => 'required|date_format:H:i',
            'fim' => 'required|date_format:H:i|after:inicio',
        ];

        $messages = [
            'inicio.required' => 'Informe um início válido.',
            'inicio.date_format' => 'Informe o início no formato HH:mm.',
            'fim.required' => 'Informe um fim válido.',
            'fim.date_format' => 'Informe o fim no formato HH:mm.',
            'fim.after' => 'O fim deve ser posterior ao início.',
        ];
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validação falhou. Verifique os campos.',
                'errors' => $validator->errors()->toArray(),
            ], 400);
        }

        $validated = $validator->validated();

        $periodo = Periodo::where('id', $id)->where('exclusao', false)->first();
        if (!$periodo) {
            return response()->json(['error' => 'Período não encontrado'], 404);
        }

        $periodoExists = Periodo::where('inicio', $validated['inicio'])->where('fim', $validated['fim'])->where('id', '!=', $id)->where('exclusao', false)->exists();
        if ($periodoExists) {
            return response()->json(['error' => 'Período já existe'], 409);
        }

        $periodo->update($validated);
        return response()->json($periodo);
    }

    public function deletePeriodo($id)
    {
        $periodo = Periodo::where('id', $id)->where('exclusao', false)->first();
        if (!$periodo) {
            return response()->json(['error' => 'Período não encontrado'], 404);
        }

        $turmaExists = Turmas::where('periodo', $id)->where('exclusao', false)->exists();
        if ($turmaExists) {
            return response()->json(['error' => 'Período está associado a uma turma ativa'], 409);
        }
        $periodo->excluir($id);
        return response()->json(null, 200);
    }
}
