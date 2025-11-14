@echo off
echo RENOVADOR DE CERTIFICADO SSL - VERSAO SIMPLES
echo =============================================

set "%CERT_DIR%"="./"

echo Verificando se OpenSSL esta instalado...
openssl version
if errorlevel 1 (
    echo ERRO: OpenSSL nao encontrado!
    pause
    exit /b 1
)

echo.
echo Verificando chave privada...
if not exist "%CERT_DIR%\key.pem" (
    echo ERRO: key.pem nao encontrado em %CERT_DIR%
    pause
    exit /b 1
)

echo Gerando novo certificado...
openssl req -new -x509 -key "%CERT_DIR%\key.pem" -out "%CERT_DIR%\cert.pem" -days 365 -subj "/C=BR/ST=Parana/L=Curitiba/O=UFPR/CN=localhost"

if errorlevel 1 (
    echo ERRO ao gerar certificado!
    pause
    exit /b 1
)

echo Criando keystore...
openssl pkcs12 -export -in "%CERT_DIR%\cert.pem" -inkey "%CERT_DIR%\key.pem" -out "%CERT_DIR%\keystore.p12" -name "myapp" -passout pass:password

if errorlevel 1 (
    echo ERRO ao criar keystore!
    pause
    exit /b 1
)

echo.
echo ✅ CERTIFICADO RENOVADO COM SUCESSO!
echo.
echo Data: %date%
echo Validade: 365 dias
echo.
echo Lembre-se de reiniciar o Spring Boot!
pause