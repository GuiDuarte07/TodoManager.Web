# 📝 TodoManager.Web

Frontend do projeto **TodoManager**, uma aplicação de gerenciamento de tarefas que permite criar, editar e organizar seus todos de forma simples e intuitiva.

---

### Tela de Login
<img width="1269" height="929" alt="Image" src="https://github.com/user-attachments/assets/376ced6b-c888-4129-a979-3e5b4bded5a2" />


### Tela Home
<img width="1269" height="929" alt="Image" src="https://github.com/user-attachments/assets/7da70aef-9fb4-4987-a5bd-1c304a382f9c" />

---

## ⚙️ Tecnologias Utilizadas

| Categoria |	Tecnologias |
|---|---|
| Framework	| Next.js 15 com Turbopack |
| Linguagem |	TypeScript |
| Estilização |	MaterialUI |
|Gerenciamento de Estados| Zustand |
| HTTP Client |	Axios |
| Autenticação |	cookies-next |
| Formulários	| React Hook Form |
| Ícones |	Material Icons |
| Hospedagem | Vercel |
| Backend |	TodoManager.API (.NET 8) |

---

## 🏗️ Decisões de Construção e Arquitetura

* Next.js (App Router): Arquitetura de projeto, route automático, server components e otimizações de build com Turbopack.
* Camada de API isolada (lib/api-client.ts): facilita o controle de headers, tokens e interceptors usado o Axios.
* Organização de páginas (app/): cada módulo (auth, home, etc.) é isolado para facilitar manutenção.
* Gerenciamento de estado: uso de Zustand para gerir de forma simples, centralizada e organizada os estados da aplicação.
* Validação centralizada: erros e respostas da API são tratados nos interceptors.
* Autenticação: uso de cookies para persistência compatível com SSR e APIs seguras.
* UI/UX: Uso do Material UI de forma a organizar e padrozinar o design de interface + responsividade do site. 
* Deploy desacoplado: frontend e backend hospedados em domínios diferentes, com comunicação via HTTPS.

---

## ☁️ Deploy e Integração com Backend

* Frontend: hospedado na Vercel
* Backend: hospedado na AWS EC2, com API em ASP.NET 8
  * Banco de Dados: postgres via container
* Comunicação: HTTPS entre domínios (CORS configurado no backend)
* Domínios:
  * www.todomanager.shop → frontend (Next.js)
  * api.todomanager.shop → backend (.NET API)


---


## 🌐 Como Acessar a Aplicação

🔗 **Aplicação Online:**  
👉 [https://www.todomanager.shop](https://www.todomanager.shop)

🔗 **API (Backend):**  
👉 [https://api.todomanager.shop](https://api.todomanager.shop)

---

## 🚀 Como rodar o projeto localmente

### 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão recomendada: **20+**)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- (Opcional) [Visual Studio Code](https://code.visualstudio.com/) com extensão **ESLint**

### ▶️ Passos para execução

```bash
# 1. Clone o repositório
git clone https://github.com/GuiDuarte07/TodoManager.Web.git

# 2. Acesse o diretório do projeto
cd TodoManager.Web

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env.local na raiz com o conteúdo:
NEXT_PUBLIC_API_URL=https://api.todomanager.shop
# Ou, rodando localmente:
NEXT_PUBLIC_API_URL=http://localhost:8080

# 5. Rode o servidor de desenvolvimento
npm run dev

# O projeto estará disponível em:
http://localhost:3000
```

---

## 👨‍💻 Autor

**Guilherme Duarte**  
💼 Desenvolvedor Full Stack  

📧 **E-mail:** [guilhduart.abr@gmail.com](mailto:guilhduart.abr@gmail.com)  
🌐 **LinkedIn:** [linkedin.com/in/gui-duarte07](https://www.linkedin.com/in/gui-duarte07/)  
💻 **GitHub:** [github.com/GuiDuarte07](https://github.com/GuiDuarte07)
