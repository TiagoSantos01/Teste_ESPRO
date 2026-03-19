<?php

namespace App\Http\Controllers;

use App\Models\Alunos;
use App\Models\turmas;
use Illuminate\Http\Request;
use Validator;

class AlunosController
{
    public function index()
    {
        $alunos = Alunos::ativo()->get();
        return response()->json($alunos);
    }

    const PREFIXES = [
        'nome' => 'Informe um nome válido.',
        'cpf' => 'Infome um CPF válido',
        'cod_turma' => 'Informe uma turma válida.',
        'telefone' => 'Informe um telefone válido.',
        'email' => 'Informe um email válido.',
        'data_nascimento' => 'Informe uma data de nascimento válida.',
        'endereco' => 'Informe um endereço válido.',
    ];

    public function postAluno(Request $request)
    {
        $rules = [
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|size:11',
            'data_nascimento' => 'required|date',
            'email' => 'required|email',
            'telefone' => 'required|string',
            'endereco' => 'required|string',
            'cod_turma' => 'required|integer',
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

        $turma = Turmas::where('id', $validated['cod_turma'])->where('exclusao', false);
        if (!$turma->exists()) {
            return response()->json(['success' => false, 'message' => 'Turma não encontrada'], 404);
        }
        $alunosTotal = Alunos::byTurma($turma->first()->id)->count();
        if ($alunosTotal >= $turma->first()->qtd_alunos) {
            return response()->json(['error' => 'Turma já atingiu a quantidade máxima de alunos'], 409);
        }

        $alunoExist = Alunos::cpfByAtivo($validated['cpf'])->exists();
        if ($alunoExist) {
            return response()->json(['error' => 'Aluno já existe'], 409);
        }


        $aluno = Alunos::create($validated);
        return response()->json($aluno, 201);
    }

    public function getAluno($id)
    {
        $aluno = Alunos::ativoById($id)->first();
        if (!$aluno) {
            return response()->json(['error' => 'Aluno não encontrado'], 404);
        }
        return response()->json($aluno);
    }

    public function updateAluno(Request $request, $id)
    {
        $rules = [
            'nome' => 'sometimes|string|max:255',
            'cpf' => "sometimes|nullable|string|size:11",
            'data_nascimento' => 'sometimes|nullable|date',
            'email' => 'sometimes|nullable|email',
            'telefone' => 'sometimes|nullable|string',
            'endereco' => 'sometimes|nullable|string',
            'cod_turma' => 'sometimes|integer',
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

        $aluno = Alunos::ativoById($id)->first();
        if (!$aluno) {
            return response()->json(['error' => 'Aluno não encontrado'], 404);
        }

        if (isset($validated['cod_turma']) && $validated['cod_turma'] !== null && $validated['cod_turma'] !== '') {
            $turma = Turmas::where('id', $validated['cod_turma'])->where('exclusao', false)->first();
            if (!$turma) {
                return response()->json(['error' => 'Turma não encontrada'], 404);
            }
        }

        if (!empty($validated['cpf'])) {
            $exists = Alunos::where('cpf', $validated['cpf'])->where('id', '!=', $id)->where('exclusao', false)->exists();
            if ($exists) {
                return response()->json(['error' => 'CPF já cadastrado para outro aluno'], 409);
            }
        }

        $aluno->update($validated);
        return response()->json($aluno);
    }

    public function deleteAluno($id)
    {
        $aluno = Alunos::ativoById($id)->first();
        if (!$aluno) {
            return response()->json(['error' => 'Aluno não encontrado'], 404);
        }
        $aluno->excluir($id);
        return response()->json(null, 200);
    }

}
