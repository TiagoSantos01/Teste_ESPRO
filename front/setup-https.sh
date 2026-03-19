#!/bin/bash

# Script para gerar certificados SSL para desenvolvimento local
# HTTPS Setup

echo "🔐 Configurando HTTPS para desenvolvimento..."
echo ""

# Criar diretório para certificados
mkdir -p certs

# Verificar se mkcert está instalado
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert não encontrado. Instalando..."
    
    # Detectar sistema operacional e instalar mkcert
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "🍺 Instalando mkcert via Homebrew..."
            brew install mkcert
        else
            echo "❌ Homebrew não encontrado. Por favor, instale mkcert manualmente:"
            echo "https://github.com/FiloSottile/mkcert#installation"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "🐧 Para Linux, instale mkcert manualmente:"
        echo "https://github.com/FiloSottile/mkcert#linux"
        exit 1
    else
        echo "❌ Sistema operacional não suportado automaticamente."
        echo "Por favor, instale mkcert manualmente:"
        echo "https://github.com/FiloSottile/mkcert#installation"
        exit 1
    fi
fi

# Instalar CA raiz local
echo "🔑 Instalando CA raiz local..."
mkcert -install

# Gerar certificados para localhost
echo "📜 Gerando certificados SSL para localhost..."
cd certs
mkcert localhost 127.0.0.1 ::1 *.local

# Renomear arquivos para os nomes esperados pelo Vite
mv localhost+3.pem localhost.pem 2>/dev/null || echo "Arquivo localhost.pem já existe ou não foi criado"
mv localhost+3-key.pem localhost-key.pem 2>/dev/null || echo "Arquivo localhost-key.pem já existe ou não foi criado"

cd ..

# Verificar se os certificados foram criados
if [ -f "certs/localhost.pem" ] && [ -f "certs/localhost-key.pem" ]; then
    echo "✅ Certificados SSL criados com sucesso!"
    echo ""
    echo "📁 Arquivos criados:"
    echo "   - certs/localhost.pem"
    echo "   - certs/localhost-key.pem"
    echo ""
    echo "🚀 Agora você pode executar:"
    echo "   npm run dev    # Para desenvolvimento com HTTPS"
    echo "   npm run build  # Para build"
    echo "   npm run preview # Para preview com HTTPS"
    echo ""
    echo "🌐 Acesse: https://localhost:5173"
    echo ""
    echo "🔔 Agora todas as funcionalidades PWA funcionarão:"
    echo "   ✅ Push Notifications"
    echo "   ✅ Instalação PWA"
    echo "   ✅ Service Worker completo"
    echo "   ✅ Socket.io"
    echo "   ✅ APIs avançadas"
else
    echo "❌ Erro ao criar certificados. Tentando método alternativo..."
    
    # Método alternativo usando OpenSSL
    echo "🔧 Tentando com OpenSSL..."
    
    openssl req -x509 -newkey rsa:2048 -keyout certs/localhost-key.pem -out certs/localhost.pem -days 365 -nodes -subj "/CN=localhost"
    
    if [ -f "certs/localhost.pem" ] && [ -f "certs/localhost-key.pem" ]; then
        echo "✅ Certificados criados com OpenSSL!"
        echo "⚠️  Nota: Você precisará aceitar o certificado no navegador"
    else
        echo "❌ Falha ao criar certificados."
        echo "Por favor, crie os certificados manualmente ou use:"
        echo "npm run dev -- --https (certificado auto-assinado do Vite)"
    fi
fi

echo ""
echo "🛡️ HTTPS configurado!"