-- Inserir Superusuários (PRIMEIRO - devido às constraints de chave estrangeira)
-- A senha 'admin' criptografada com BCrypt
INSERT INTO superusuarios (cpf, email, nome, senha) VALUES
('00000000000', 'admin@admin.com', 'Administrador do Sistema', '$2a$10$N9qo8uLOickgx2ZMRZoMye.vd7.6aJ.7Q7.6.8.9.0a1b2c3d4e5f6g7h8'),
('12345678901', 'joao.super@email.com', 'João Superusuario', '$2a$10$ABC123def456ghi789jkl'),
('23456789012', 'maria.super@email.com', 'Maria Superusuario', '$2a$10$DEF456ghi789jkl012mno');

-- Inserir Usuários Comuns (sem senha - apenas para check-in biométrico)
INSERT INTO usuarios (cpf, email, nome, matricula, setor, data_nascimento, template) VALUES
('34567890123', 'joao.silva@email.com', 'João Silva', '2023001', 'TI', '1990-05-15', E'\\x54656d706c61746542696f6d65747269636f31'),
('45678901234', 'maria.santos@email.com', 'Maria Santos', '2023002', 'RH', '1985-08-22', E'\\x54656d706c61746542696f6d65747269636f32'),
('56789012345', 'pedro.oliveira@email.com', 'Pedro Oliveira', '2023003', 'Financeiro', '1992-12-10', E'\\x54656d706c61746542696f6d65747269636f33'),
('67890123456', 'ana.costa@email.com', 'Ana Costa', '2023004', 'Marketing', '1988-03-25', E'\\x54656d706c61746542696f6d65747269636f34'),
('78901234567', 'carlos.rodrigues@email.com', 'Carlos Rodrigues', '2023005', 'Operações', '1995-07-12', E'\\x54656d706c61746542696f6d65747269636f35');

-- Inserir Eventos (usando CPF dos superusuários existentes)
INSERT INTO evento (titulo, descricao, data_hora, categoria, carga_horaria, status, superusuario_cpf) VALUES
('Workshop Spring Boot', 'Workshop completo sobre desenvolvimento com Spring Boot e boas práticas', '2024-01-15 14:00:00', 'Tecnologia', 4.0, 'AGENDADO', '12345678901'),
('Treinamento Liderança', 'Desenvolvimento de habilidades de liderança e gestão de equipes', '2024-01-20 09:00:00', 'Gestão', 8.0, 'EM_ANDAMENTO', '23456789012'),
('Palestra Inteligência Artificial', 'Introdução aos conceitos e aplicações de IA no mercado', '2024-02-10 16:00:00', 'Tecnologia', 3.0, 'AGENDADO', '00000000000');

-- Inserir CheckIns (SEM STATUS - apenas dados essenciais)
INSERT INTO check_in (evento_id, usuario_cpf, data_hora_checkin) VALUES
(1, '34567890123', '2024-01-15 14:05:00'),
(1, '45678901234', '2024-01-15 14:07:00'),
(2, '56789012345', '2024-01-20 09:10:00'),
(2, '67890123456', '2024-01-20 09:15:00'),
(1, '78901234567', '2024-01-15 14:20:00');

-- Inserir Certificados (SEM CAMPOS DE NOME DUPLICADOS)
INSERT INTO certificados (usuario_cpf, evento_id, superusuario_cpf, codigo_validacao, data_emissao, texto_certificado) VALUES
('34567890123', 1, '12345678901', 'CERT-ABC123', '2024-01-15', 'Certificado de participação no evento "Workshop Spring Boot" com carga horária de 4.0 horas.'),
('45678901234', 1, '12345678901', 'CERT-DEF456', '2024-01-15', 'Certificado de participação no evento "Workshop Spring Boot" com carga horária de 4.0 horas.'),
('78901234567', 1, '12345678901', 'CERT-GHI789', '2024-01-15', 'Certificado de participação no evento "Workshop Spring Boot" com carga horária de 4.0 horas.');