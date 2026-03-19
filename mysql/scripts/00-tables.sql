SET
    time_zone = "-03:00";

-- --------------------------------------------------------
--
-- Banco de dados: `dbo`
--
CREATE DATABASE IF NOT EXISTS `dbo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE `dbo`;

-- --------------------------------------------------------
--
-- Estrutura para tabela `salas`
--
CREATE TABLE `salas` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nome` varchar(255),
    `exclusao` bit DEFAULT 0,
    `data_exclusao` timestamp DEFAULT NULL,
    `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
--
-- Estrutura para tabela `materias`
--
CREATE TABLE `materias` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nome` varchar(255),
    `exclusao` bit DEFAULT 0,
    `data_exclusao` timestamp DEFAULT NULL,
    `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
--
-- Estrutura para tabela `periodo`
--
CREATE TABLE `periodo` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `inicio` TIME,
    `fim` TIME,
    `exclusao` bit DEFAULT 0,
    `data_exclusao` timestamp DEFAULT NULL,
    `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
--
-- Estrutura para tabela `dias_da_semana`
--
CREATE TABLE `dias_da_semana` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nome` varchar(255),
    `exclusao` bit DEFAULT 0,
    `data_exclusao` timestamp DEFAULT NULL,
    `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
--
-- Estrutura para tabela `turmas`
--
CREATE TABLE `turmas` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nome` varchar(255),
    `serie` varchar(11),
    `periodo` int,
    `dia_da_semana` int,
    `qtd_alunos` int DEFAULT 0,
    `cod_materia` int,
    `cod_sala` int,
    `exclusao` bit DEFAULT 0,
    `data_cadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_exclusao` timestamp DEFAULT NULL,
    `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`cod_materia`) REFERENCES `materias`(`id`),
    FOREIGN KEY (`cod_sala`) REFERENCES `salas`(`id`),
    FOREIGN KEY (`periodo`) REFERENCES `periodo`(`id`),
    FOREIGN KEY (`dia_da_semana`) REFERENCES `dias_da_semana`(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
--
-- Estrutura para tabela `alunos`
--
CREATE TABLE `alunos` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nome` varchar(255),
    `cpf` varchar(11),
    `data_nascimento` Date,
    `email` varchar(255),
    `telefone` varchar(20),
    `endereco` varchar(255),
    `cod_turma` int,
    `exclusao` bit DEFAULT 0,
    `data_exclusao` timestamp DEFAULT NULL,
    `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_atualizacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`cod_turma`) REFERENCES `turmas`(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;