-- Inserir Usuários
INSERT INTO usuarios (cpf, email, nome, matricula, setor, data_nascimento) VALUES
('12345678901', 'joao.silva@email.com', 'João Silva', '2023001', 'TI', '1990-05-15'),
('23456789012', 'maria.santos@email.com', 'Maria Santos', '2023002', 'RH', '1985-08-22'),
('34567890123', 'pedro.oliveira@email.com', 'Pedro Oliveira', '2023003', 'Financeiro', '1992-12-10'),
('45678901234', 'ana.costa@email.com', 'Ana Costa', '2023004', 'Marketing', '1988-03-25'),
('56789012345', 'carlos.rodrigues@email.com', 'Carlos Rodrigues', '2023005', 'Operações', '1995-07-12');

-- Inserir Superusuários
INSERT INTO superusuarios (cpf, senha) VALUES
('12345678901', '$2a$10$ABC123def456ghi789jkl'),
('23456789012', '$2a$10$DEF456ghi789jkl012mno');

-- Inserir Eventos - VERIFIQUE OS NOMES EXATOS DAS COLUNAS NO SEU BANCO!
INSERT INTO evento (superusuario_cpf, titulo, descricao, data_hora, categoria, carga_horaria) VALUES
('12345678901', 'Workshop Spring Boot', 'Workshop completo sobre desenvolvimento com Spring Boot e boas práticas', '2024-01-15 14:00:00', 'Tecnologia', 4.0),
('23456789012', 'Treinamento Liderança', 'Desenvolvimento de habilidades de liderança e gestão de equipes', '2024-01-20 09:00:00', 'Gestão', 8.0);

-- Inserir CheckIns
INSERT INTO check_in (evento_id, usuario_cpf, data_hora_checkin, status) VALUES
(1, '12345678901', '2024-01-15 14:05:00', 'PRESENTE'),
(2, '23456789012', '2024-01-15 14:10:00', 'PRESENTE')

-- Inserir Certificados
INSERT INTO certificados (usuario_cpf, evento_id, superusuario_cpf, nome_usuario, cpf_usuario, nome_superusuario, codigo_validacao, data_emissao, texto_certificado) VALUES
('12345678901', 1, '12345678901', 'João Silva', '12345678901', 'João Silva', 'CERT001', '2024-01-15', 'Certificado de participação no Workshop Spring Boot com carga horária de 4 horas.');