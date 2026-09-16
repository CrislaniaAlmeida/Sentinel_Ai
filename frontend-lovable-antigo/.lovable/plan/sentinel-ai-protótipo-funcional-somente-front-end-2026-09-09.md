# Sentinel AI — Protótipo funcional (somente front-end)

Protótipo navegável do painel de investigação por videomonitoramento, com dados simulados. Nenhum backend, câmera ou IA real: tudo funciona a partir de dados de exemplo no próprio aplicativo, abrindo direto no painel (sem login).

## Telas

**1. Painel de Investigação (página inicial)**
- Barra superior com identidade Sentinel AI, contador de alertas e menu do usuário.
- Lateral esquerda com lista de câmeras e status online/offline, clicável.
- Campo de busca por descrição em linguagem natural ("veículo prata saindo pelo portão B após as 22h"), com resultados ordenados e índice de confiança em cada um.
- Filtros por período, tipo de alvo (pessoa/veículo) e câmera.
- Mapa da planta do local com o trajeto do alvo selecionado desenhado entre as câmeras.
- Player com o quadro do evento selecionado e controles de play/pause/avanço.
- Linha do tempo horizontal dos eventos, navegável por clique.
- Botão fixo "Gerar relatório de incidente".

**2. Central de Monitoramento**
- Grade de câmeras ao vivo (quadros simulados) com borda destacada nas câmeras com evento recente e uma lista lateral de alertas que chegam em tempo simulado.

**3. Administração**
- Cadastro e listagem de câmeras (nome, local, endereço de stream, protocolo).
- Usuários com papel atribuído e ativar/desativar conta.
- Privacidade e retenção: liga/desliga reconhecimento facial, prazo de retenção e status de conformidade.

**4. Auditoria e Relatórios**
- Tabela de auditoria filtrável (usuário, ação, recurso, data/hora, origem) com ação de exportar.
- Relatório de incidente montado com imagens, horários e trajeto reconstruído, pronto para impressão/PDF do navegador.

## Detalhes técnicos

- TanStack Start + React + TypeScript, Tailwind v4, shadcn/ui. Rotas: `/` (investigação), `/monitoramento`, `/admin`, `/auditoria`, `/relatorios/$id`.
- Dados simulados em `src/data/*` (câmeras, eventos, alertas, alvos, trajetos, auditoria, usuários); estado de UI em React, sem persistência.
- Busca por descrição implementada como correspondência por palavras-chave sobre os atributos dos eventos simulados, com score exibido como índice de confiança.
- Mapa da planta em SVG com pontos de câmera e linha de trajeto animada.
- Imagens de cena de câmera geradas e usadas como quadros estáticos no player e na grade.
- Tema escuro de central de operações como base do design, com tokens semânticos em `src/styles.css`.
- Cada rota com título e descrição próprios para compartilhamento.

## Fora do escopo

Backend, banco de dados, streams RTSP/ONVIF reais, IA/OCR reais, login e aplicativo móvel nativo.
