<?php

use App\Http\Controllers\AlunosController;
use App\Http\Controllers\DiasDaSemanaController;
use App\Http\Controllers\MateriasController;
use App\Http\Controllers\PeriodoController;
use App\Http\Controllers\SalasController;
use App\Http\Controllers\TurmaAlunosController;
use App\Http\Controllers\TurmasController;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "v1"], function () {
    Route::prefix('alunos')->name('alunos')->group(function () {
        Route::get('', [AlunosController::class, 'index'])->name('listar alunos');
    });
    Route::prefix('aluno')->name('aluno')->group(function () {
        Route::post('', [AlunosController::class, 'postAluno'])->name('cadastrar aluno');
        Route::get('{id}', [AlunosController::class, 'getAluno'])->name('buscar aluno');
        Route::put('{id}', [AlunosController::class, 'updateAluno'])->name('atualizar aluno');
        Route::delete('{id}', [AlunosController::class, 'deleteAluno'])->name('deletar aluno');
    });

    Route::prefix('dias-da-semana')->name('dias da semana')->group(function () {
        Route::get('', [DiasDaSemanaController::class, 'index'])->name('listar dias da semana');
    });
    Route::prefix('dia-da-semana')->name('dia da semana')->group(function () {
        Route::post('', [DiasDaSemanaController::class, 'postDia'])->name('cadastrar dia da semana');
        Route::get('{id}', [DiasDaSemanaController::class, 'getDia'])->name('buscar dia da semana');
        Route::put('{id}', [DiasDaSemanaController::class, 'updateDia'])->name('atualizar dia da semana');
        Route::delete('{id}', [DiasDaSemanaController::class, 'deleteDia'])->name('deletar dia da semana');
    });

    Route::prefix('materias')->name('materias')->group(function () {
        Route::get('', [MateriasController::class, 'index'])->name('listar materias');
    });

    Route::prefix('materia')->name('materia')->group(function () {
        Route::post('', [MateriasController::class, 'postMateria'])->name('cadastrar materia');
        Route::get('{id}', [MateriasController::class, 'getMateria'])->name('buscar materia');
        Route::put('{id}', [MateriasController::class, 'updateMateria'])->name('atualizar materia');
        Route::delete('{id}', [MateriasController::class, 'deleteMateria'])->name('deletar materia');
    });

    Route::prefix('periodos')->name('periodos')->group(function () {
        Route::get('', [PeriodoController::class, 'index'])->name('listar periodos');
    });
    Route::prefix('periodo')->name('periodo')->group(function () {
        Route::post('', [PeriodoController::class, 'postPeriodo'])->name('cadastrar periodo');
        Route::get('{id}', [PeriodoController::class, 'getPeriodo'])->name('buscar periodo');
        Route::put('{id}', [PeriodoController::class, 'updatePeriodo'])->name('atualizar periodo');
        Route::delete('{id}', [PeriodoController::class, 'deletePeriodo'])->name('deletar periodo');
    });

    Route::prefix('salas')->name('salas')->group(function () {
        Route::get('', [SalasController::class, 'index'])->name('listar salas');
    });
    Route::prefix('sala')->name('sala')->group(function () {
        Route::post('', [SalasController::class, 'postSala'])->name('cadastrar sala');
        Route::get('{id}', [SalasController::class, 'getSala'])->name('buscar sala');
        Route::put('{id}', [SalasController::class, 'updateSala'])->name('atualizar sala');
        Route::delete('{id}', [SalasController::class, 'deleteSala'])->name('deletar sala');
    });

    Route::prefix('turmas')->name('turmas')->group(function () {
        Route::get('', [TurmasController::class, 'index'])->name('listar turmas');
    });
    Route::prefix('turma')->name('turma')->group(function () {
        Route::post('', [TurmasController::class, 'postTurma'])->name('cadastrar turma');
        Route::get('{id}', [TurmasController::class, 'getTurma'])->name('buscar turma');
        Route::put('{id}', [TurmasController::class, 'updateTurma'])->name('atualizar turma');
        Route::delete('{id}', [TurmasController::class, 'deleteTurma'])->name('deletar turma');
        
        Route::prefix('{id}/alunos')->name('turma com alunos')->group(function () {
            Route::get('', [TurmaAlunosController::class, 'getAlunosPorTurma'])->name('buscar alunos por turma');
            Route::delete('', [TurmaAlunosController::class, 'deleteAlunosPorTurma'])->name('deletar alunos por turma');
        });
    });
});