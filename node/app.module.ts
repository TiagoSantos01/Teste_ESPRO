import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AcceptLanguageResolver,
  I18nModule,
} from 'nestjs-i18n';
import { FlatJsonI18nLoader } from '@infrastructure/i18n/flat-json.loader';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigModule } from '@nestjs/config';
import { MateriaController } from '@application/controller/materia.controller';
import { MateriasService } from '@domain/services/materias.service';
import { AlunoController } from '@application/controller/aluno.controller';
import { DiaDaSemanaController } from '@application/controller/dia-da-semana.controller';
import { PeriodoController } from '@application/controller/periodo.controller';
import { SalaController } from '@application/controller/sala.controller';
import { TurmaController } from '@application/controller/turma.controller';
import { TurmasService } from '@domain/services/turma.service';
import { AlunosService } from '@domain/services/alunos.service';
import { DiasDaSemanaService } from '@domain/services/dias-da-semana.service';
import { PeriodoService } from '@domain/services/periodo.service';
import { SalasService } from '@domain/services/salas.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'pt',
      loader: FlatJsonI18nLoader,
      loaderOptions: {
        path: (() => {
          const devPath = path.join(process.cwd(), 'src', 'i18n');
          const distPath = path.join(process.cwd(), 'dist', 'src', 'i18n');
          const prodPath = path.join(__dirname, '..', 'i18n');
          if (fs.existsSync(devPath)) return devPath;
          if (fs.existsSync(distPath)) return distPath;
          if (fs.existsSync(prodPath)) return prodPath;
          return devPath;
        })(),
        watch: process.env.I18N_WATCH === 'true',
      },
      resolvers: [AcceptLanguageResolver],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AlunoController,
    DiaDaSemanaController,
    MateriaController,
    PeriodoController,
    SalaController,
    TurmaController
  ],
  providers: [
    AlunosService,
    DiasDaSemanaService,
    MateriasService,
    PeriodoService,
    SalasService,
    TurmasService
  ],
})
export class AppModule { }
