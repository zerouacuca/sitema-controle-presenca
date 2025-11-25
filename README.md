# Sistema de Controle de Presença - Pontu
Projeto de trabalho de conclusão de curso para o curso de Tecnologia em Análise e Desenvolvimento de Sistemas da Universidade Federal do Paraná.

## Sobre o Projeto

O Pontu é um software empresarial de controle de presença e gerenciamento de eventos. Ele permite a criação, atualização de dados de participação e assiduidade de funcionários em eventos internos, promovendo a maior integração corporativa e a participação ativa dos funcionários no aprendizado. Ele oferece suporte à leitura biométrica para a verificação da autenticidade e permite a geração e exportação de relatórios e certificados de participação.  

## 🔧 Tecnologias Utilizadas
- Angular
- Java Spring Boot
- JWT para autenticação
- PostgreSQL para banco de dados
- Open SSL para Protocolo HTTPs

## Integrantes da Equipe
Aruni van Amstel - Desenvolvedor Backend e QA Tester  
Giovani Trierweiler  - Desenvolvedor Frontend e responsável pela documentação  
Lucas Souza de Oliveira  - Desenvolvedor Fullstack e QA Tester

## Configurando chaves e segredos (importante!)
A configuração principal fica em application.properties.
JWT:

- jwt.secret: deve ser uma chave codificada em Base64. O código decodifica esse valor com Base64 e o usa para assinar tokens (HS256). Recomenda-se uma chave forte (pelo menos 32 bytes / 256 bits antes da codificação Base64).
- jwt.expiration: tempo de expiração em milissegundos. O valor padrão no projeto é 7200000 (2 horas). Ajuste conforme sua política de sessão.

Banco de dados:

- Configure spring.datasource.username e spring.datasource.password conforme seu ambiente. Os valores padrão no application.properties do repositório são postgres / postgres. Altere para credenciais seguras em produção.

Certificados TLS:

- O projeto inclui um script em presenca-system/src/main/resources/script atualizar certificado.bat que:
exige que exista key.pem no diretório de execução, gera cert.pem com validade de 365 dias e cria keystore.p12 (a senha usada no script é password), define CERT_DIR como ./ por padrão.
Portanto coloque sua chave privada key.pem no diretório correto, execute o script para gerar cert.pem/keystore.p12 e reinicie a aplicação. Renove a cada 365 dias (ou ajuste -days no script conforme necessário) e troque a senha do keystore antes de produção.conexão HTTPS segura.

## Executando o projeto com Docker

Este repositório já inclui orquestração via Docker Compose (`docker-compose.yml`) e `Dockerfile`s para os dois serviços principais (backend Spring Boot em `presenca-system` e frontend Angular em `sitema-controle-presenca`). Abaixo há instruções rápidas para rodar, parar e depurar usando Docker no Windows (PowerShell).

**Requisitos**
- **Docker Desktop** instalado e em execução no Windows.
- Permissões suficientes para executar containers e mapear portas.

**Subir todos os serviços (modo rápido)**
Abra um PowerShell na raiz do repositório e execute:

```powershell
docker-compose up --build
```

Para rodar em segundo plano:

```powershell
docker-compose up --build -d
```

Nota: em versões recentes do Docker você também pode usar `docker compose` (sem o hífen):

```powershell
docker compose up --build -d
```

**Parar e remover containers**

```powershell
docker-compose down
```

Remover volumes e imagens órfãs (uso cuidadoso):

```powershell
docker-compose down -v --rmi all --remove-orphans
```

**Rebuild de apenas um serviço**

```powershell
docker-compose build presenca-system
docker-compose build sitema-controle-presenca
```

**Ver logs / acessar shell do container**

```powershell
docker-compose logs -f
docker-compose logs <serviço>
docker-compose exec <serviço> sh
```

Se a imagem usar `bash`, troque `sh` por `bash`.


**Verificação rápida**
- `docker-compose ps` — confirma containers e portas.
- Acesse o backend em `http://localhost:<porta_backend>` e o frontend em `http://localhost:<porta_frontend>` (substitua conforme `docker-compose.yml`).

---