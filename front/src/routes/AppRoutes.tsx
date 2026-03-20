import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';

import routes from '../assets/routes.json';
import { HomePage } from '../pages/Home.page';
import { AlunoPage } from '../pages/Aluno.page';
import { DiaDaSemanaPage } from '../pages/DiaDaSemana.page';
import { MateriaPage } from '../pages/Materia.page';
import { PeriodoPage } from '../pages/Periodo.page';
import { SalaPage } from '../pages/Sala.page';
import { TurmaPage } from '../pages/Turma.page';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.home} element={<Suspense><HomePage /></Suspense>} />
      <Route path={routes.aluno} element={<Suspense><AlunoPage /></Suspense>} />
      <Route path={routes.diaDaSemana} element={<Suspense><DiaDaSemanaPage /></Suspense>} />
      <Route path={routes.materia} element={<Suspense><MateriaPage /></Suspense>} />
      <Route path={routes.periodo} element={<Suspense><PeriodoPage /></Suspense>} />
      <Route path={routes.sala} element={<Suspense><SalaPage /></Suspense>} />
      <Route path={routes.turma} element={<Suspense><TurmaPage /></Suspense>} />
    </Routes>
  );
};

export default AppRoutes;
