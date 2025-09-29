# Sistema de Entregas com Drones  

## Descrição do Projeto  
Este projeto tem como objetivo simular um sistema de entregas utilizando drones.  
A aplicação permite:  
- Criar pedidos (com peso, posição e prioridade).  
- Cadastrar drones (com limite de peso e distância).  
- Alocar pedidos a drones e criar entregas.  
- Finalizar entregas, alterando o status de pedidos e drones.  
- Gerar relatórios de entregas e distância percorrida.  

A solução é composta por:  
- **Backend** em Node.js com Express.  
- **Frontend** em React, para interagir com a API.  

---

## Como Executar o Projeto  

### Pré-requisitos  
- Node.js **20+** (recomendado, pois o frontend com Vite exige versão moderna).  
- npm (ou yarn).  

---
### Clone o repositório:

   ```bash
   git clone https://github.com/jpmouraf/desafio-dti-digital-JoaoFurtado
   ```

### Backend (API)  

Em um terminal:  

```bash
cd backend
npm install
npm run dev
```
O servidor estará disponível em: http://localhost:3000

### Frontend (React)

Em um terminal: 

```bash
cd frontend
npm install
npm run dev
```
A interface estará disponível em: http://localhost:5173

### Testes

Os testes foram feitos com Jest + Supertest, cobrindo rotas principais de entregas.
Para rodar os testes:

Em um terminal: 
```bash
cd backend
npm test
```

## Outras informações

- O sistema funciona 100% localmente.
- O backend libera CORS para permitir que o frontend se conecte sem problemas.
- Como os dados ficam em memória, ao reiniciar o servidor os cadastros são perdidos.
- Foi utilizado IA para debugs no backend e para o aprimoramento do design e das funcionalidades no frontend
