USE `dbo`;
--
-- Estrutura para trigger `alusnos`
--
DELIMITER $$

DROP TRIGGER IF EXISTS `depois_de_inserir_aluno`;
CREATE TRIGGER `depois_de_inserir_aluno`
AFTER INSERT ON `alunos`
FOR EACH ROW
BEGIN
  UPDATE `turmas`
  SET `qtd_alunos` = `qtd_alunos` + 1
  WHERE `id` = NEW.`cod_turma`;
END$$

DROP TRIGGER IF EXISTS `depois_de_atualizar_aluno`;
CREATE TRIGGER `depois_de_atualizar_aluno`
AFTER UPDATE ON `alunos`
FOR EACH ROW
BEGIN
  IF NOT (OLD.`cod_turma` <=> NEW.`cod_turma`) or (OLD.`exclusao`= 0 AND NEW.`exclusao` = 1) THEN
    UPDATE `turmas`
    SET `qtd_alunos` = `qtd_alunos` - 1
    WHERE `id` = OLD.`cod_turma`;
  END IF;

  IF NOT (OLD.`cod_turma` <=> NEW.`cod_turma`) or (OLD.`exclusao`= 1 AND NEW.`exclusao` = 0) THEN
    UPDATE `turmas`
    SET `qtd_alunos` = `qtd_alunos` + 1
    WHERE `id` = NEW.`cod_turma`;
  END IF;
END$$

DELIMITER ;