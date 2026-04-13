# 💼 Sistema de Holerites

Sistema web completo para envio, gerenciamento e visualização de holerites em PDF, com controle de acesso e registro de leitura por funcionário.

---

## 🚀 Demonstração

> (Opcional: adicione prints aqui depois)

* Login
* Painel do administrador
* Envio de holerites
* Painel do funcionário
* Visualização e download de PDFs

---

## 🎯 Funcionalidades

### 👨‍💼 Administrador

* Login com autenticação JWT
* Cadastro de funcionários
* Envio de holerites em PDF
* Visualização de todos os holerites enviados
* Acompanhamento de leitura:

  * Status (visualizado ou não)
  * Data e hora da leitura

### 👨‍🔧 Funcionário

* Login individual
* Visualização apenas dos próprios holerites
* Abertura do PDF
* Download do arquivo
* Registro automático de leitura

---

## 🔐 Segurança

* Senhas criptografadas com **bcrypt**
* Autenticação via **JWT (JSON Web Token)**
* Proteção de rotas no backend e frontend
* Controle de acesso por perfil (admin / funcionário)

---

## 🧱 Tecnologias utilizadas

### Backend (`holerite-app`)

* Node.js
* Express
* JWT
* Bcrypt
* Multer (upload de arquivos)
* Persistência em JSON (MVP)

### Frontend (`holerite-front`)

* React
* Vite
* Axios
* React Router

---

## 📂 Estrutura do projeto

```
holerite-system/
  holerite-app/     → Backend (API)
  holerite-front/   → Frontend (React)
```

---

## ⚙️ Como rodar o projeto

### 🔧 Backend

```bash
cd holerite-app
npm install
npm run dev
```

Servidor padrão:

```
http://localhost:3000
```

---

### 💻 Frontend

```bash
cd holerite-front
npm install
npm run dev
```

Acesse:

```
http://localhost:5174
```

---

## 🔄 Fluxo do sistema

1. Administrador realiza login
2. Cadastra um funcionário
3. Envia um holerite em PDF
4. Funcionário acessa o sistema
5. Visualiza ou baixa o documento
6. O sistema registra automaticamente:

   * leitura
   * data e hora

---

## 📌 Melhorias futuras

* Integração com banco de dados (PostgreSQL / SQLite)
* Reset de senha
* Upload em nuvem (AWS S3 / Cloudinary)
* Interface mais avançada (UI/UX)
* Deploy em produção

---

## 👨‍💻 Autor

Desenvolvido por **Danilo Dantas (DanShiryu)**
🔗 https://github.com/DanShiryu

---

## 📄 Licença

Projeto desenvolvido para fins de estudo e portfólio.
