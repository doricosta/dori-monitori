# 🚀 Dori Monitori

Olá! Bem-vindo ao **Dori Monitori**. Este guia vai te ajudar a colocar tudo para rodar rapidinho, de forma simples e segura.
Pacote npm: https://www.npmjs.com/package/dori-monitori-sdk

## 🛠️ Como começar

Nós preparamos um script especial para facilitar a sua vida. Ele vai configurar todas as senhas e chaves de segurança automaticamente para você.

### Passo 1: Configuração Automática

Abra o seu terminal na pasta do projeto e rode o seguinte comando:

```bash
./installer.sh
```

O script vai te fazer duas perguntinhas simples:
1.  **Email do Administrador**: O email que você vai usar para entrar no sistema.
2.  **Senha do Administrador**: A senha para o seu usuário.

E pronto! O script vai gerar um arquivo `.env` super seguro com todas as configurações necessárias.

### Passo 2: Rodando o Projeto

Agora que tudo está configurado, é só pedir para o Docker levantar os serviços:

```bash
docker-compose up -d
```

O Docker vai baixar tudo o que precisa e iniciar o Dori Monitori. Isso pode levar alguns minutinhos na primeira vez.

## ⚠️ Problemas Comuns

### "Erro de autenticação" ou "Password authentication failed"

Se você já tinha rodado o projeto antes e agora está vendo erros de senha no banco de dados, não se preocupe! Isso acontece porque o banco de dados antigo ainda está salvo com a senha velha.

Para resolver, precisamos limpar os dados antigos e começar do zero (cuidado: isso apaga os dados do banco!):

```bash
# 1. Parar tudo e limpar os volumes antigos
docker-compose down -v

# 2. Subir tudo novamente
docker-compose up -d
```

## 📞 Precisa de ajuda?

dorivaldo@dorilabs.cloud
