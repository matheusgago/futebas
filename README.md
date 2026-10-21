# ⚽ FUTSTATS PRO — Jogos ao Vivo e do Dia em Tempo Real

Aplicação web desenvolvida com **React 19 e Vite**, com foco exclusivo no consumo de **dados reais em tempo real** diretamente da API pública [Football-Data.org v4](https://www.football-data.org/). Nenhuma partida é simulada, gerada ou inventada.

---

## 🚀 Como Executar o Projeto

> **Nota:** Esta é uma aplicação web baseada em **Vite**. Não execute via `node main` ou `node main.jsx`. Utilize os comandos abaixo:

### 1. Acessar a pasta do projeto
```bash
cd futebas
```

### 2. Instalar as dependências (caso ainda não tenha feito)
```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Acesse no navegador: **`http://localhost:5173`**

---

## 🔑 Configuração da Chave de API (Football-Data.org)

A chave de API é consumida por meio de variáveis de ambiente e **nunca fica fixa no código**:

1. Copie o arquivo modelo [.env.example](file:///c:/Users/mabf.gago/Desktop/futebas/.env.example) para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Adicione sua chave gratuita da Football-Data.org:
   ```env
   VITE_FOOTBALL_DATA_API_KEY=sua_chave_aqui
   ```
3. A chave também pode ser informada e testada diretamente pela interface clicando no botão **Configurações (⚙️)** no topo da aplicação.

> 💡 **Como obter uma chave gratuita:**
> Cadastre-se gratuitamente em [football-data.org/client/register](https://www.football-data.org/client/register) para receber a chave instantaneamente por e-mail.

---

## 📡 Lógica de Busca de Jogos do Dia e Ao Vivo

A aplicação foi desenhada para buscar estritamente os jogos reais do dia de hoje (ou ao vivo agora):

1. **Fuso Horário Local do Usuário:**
   - A data atual é obtida no fuso horário do navegador (`YYYY-MM-DD`).
   - Os parâmetros `dateFrom` e `dateTo` são enviados na requisição com a data do dia local, garantindo que partidas noturnas ou matutinas apareçam corretamente na data correta do usuário.

2. **Jogos Ao Vivo e Atualização Contínua:**
   - Partidas em andamento (`IN_PLAY`, `PAUSED`) recebem destaque com indicador pulsante 🔴 e contagem de minutos.
   - A aplicação executa auto-refresh a cada 60 segundos para atualizar placares e status de jogos em andamento.

3. **Salvaguardas de Rate Limit (10 req/min):**
   - **Cache em Memória (TTL de 45 segundos):** Consultas repetidas para a mesma competição ou data dentro da janela de 45s são servidas pelo cache em memória, evitando consumir requisições desnecessárias.
   - **Controle de Intervalo Mínimo (Cooldown):** Cliques manuais repetidos em "Atualizar" respeitam um intervalo mínimo entre chamadas.
   - **Tratamento de HTTP 429:** Caso o limite seja atingido, a interface exibe um contador regressivo em segundos indicando quando novas requisições serão liberadas, sem quebrar a tela.

4. **Tratamento de "Nenhuma Partida":**
   - Se não houver partidas no dia para um campeonato selecionado, é exibida a mensagem:
     `"Nenhuma partida hoje neste campeonato (<Nome do Campeonato>)"`.

---

## 🏷️ Mapeamento de Status da API

Os status da API são mapeados estritamente conforme a regra do projeto:

| Status na API Football-Data.org | Estado Exibido na Interface |
| :--- | :--- |
| `SCHEDULED`, `TIMED` | **Agendada** (exibe o horário no fuso local) |
| `IN_PLAY`, `PAUSED`, `LIVE` | **Em andamento** (com tempo de jogo / Intervalo) |
| `FINISHED`, `AWARDED` | **Encerrada** |
| `POSTPONED` | **Adiada** |
| `CANCELLED`, `SUSPENDED` | **Cancelada** |
| Qualquer outro status ou ausente | **Não informado** |

---

## 📊 Tela de Detalhes e Dados Ausentes

Na tela de detalhes de cada partida:
- **Gols:** busca gols reais com minuto, autor e assistência. Se não houver ou a API não fornecer, exibe "Nenhum evento registrado".
- **Cartões:** exibe cartões amarelos e vermelhos com minuto e atleta.
- **Escalações & Campo Tático 2D:** quando a API disponibiliza os atletas escalados, renderiza o campo 2D tático e a lista de titulares e reservas. Caso a API não forneça, exibe explicitamente **"Escalação não informada pela API"**.
- **Estatísticas (Posse de Bola, Finalizações, etc.):** exibidas dinamicamente em barras comparativas. Indicadores ausentes exibem **"Não informado pela API"** em vez de dados inventados.

---

## 📂 Arquivos do Projeto

- [src/services/footballApi.js](file:///c:/Users/mabf.gago/Desktop/futebas/src/services/footballApi.js): Lógica de busca real, cache TTL (45s), rate limit e normalização.
- [src/constants/competitions.js](file:///c:/Users/mabf.gago/Desktop/futebas/src/constants/competitions.js): Lista de competições e mapeamento de status (`getMatchStatusInfo`).
- [src/App.jsx](file:///c:/Users/mabf.gago/Desktop/futebas/src/App.jsx): Orquestrador de estado e filtros em tempo real.
- [src/components/EmptyState.jsx](file:///c:/Users/mabf.gago/Desktop/futebas/src/components/EmptyState.jsx): Mensagem clara quando não há jogos no dia no campeonato.
- [src/components/MatchCard.jsx](file:///c:/Users/mabf.gago/Desktop/futebas/src/components/MatchCard.jsx): Card de partida com mapeamento de status.
- [src/components/MatchDetailsModal.jsx](file:///c:/Users/mabf.gago/Desktop/futebas/src/components/MatchDetailsModal.jsx): Modal de detalhes com linha do tempo, estatísticas e escalações.
- [src/components/Header.jsx](file:///c:/Users/mabf.gago/Desktop/futebas/src/components/Header.jsx): Status de conexão da API e botão de atualização.
- [src/components/ApiConfigModal.jsx](file:///c:/Users/mabf.gago/Desktop/futebas/src/components/ApiConfigModal.jsx): Gerenciamento da chave de API e teste de latência.
- [vite.config.js](file:///c:/Users/mabf.gago/Desktop/futebas/vite.config.js): Proxy reverso local `/api/football` para evitar CORS e proteger a chave.
- [.env.example](file:///c:/Users/mabf.gago/Desktop/futebas/.env.example): Exemplo de configuração de variáveis de ambiente.
