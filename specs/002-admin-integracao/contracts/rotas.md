# Contrato: rotas e guarda do admin

Mesmas rotas da 001 (`specs/001-admin-telas/contracts/rotas.md`). O que muda é o **guarda** do
grupo `(painel)` e as etapas novas dentro de `/admin/login`.

## `/admin/login` (grupo `auth`)

| Etapa | Quando aparece | Ação |
|---|---|---|
| Senha | sem sessão | e-mail + senha → `signIn` |
| Cadastro do fator | admin `aal1` sem fator verificado | QR code + código manual + campo do código → `confirmEnrollment` |
| Código | admin `aal1` com fator | campo de 6 dígitos → `verifyCode` |
| Acesso negado | conta sem linha em `admins` | mensagem + sair automático |

Depois de `aal2`, volta para o endereço pedido (`?voltar=/admin/projetos...`, só caminhos que
começam com `/admin`) ou para `/admin`.

## Guarda do `(painel)`

| `AuthStatus.step` | Resultado |
|---|---|
| `signed_out` | vai para `/admin/login?voltar=<rota atual>` |
| `verify` ou `enroll` | vai para `/admin/login?voltar=<rota atual>` (abre na etapa certa) |
| `not_admin` | sai e vai para `/admin/login` com aviso |
| `ready` | mostra as telas |

Enquanto o estado carrega, mostra só a moldura vazia (sem dados).

## Moldura

- Botão **Sair** na barra superior e na gaveta do celular (RF-008).
- Lembrete "cadastre um segundo fator" quando `factorCount === 1`, com atalho para
  `/admin/seguranca` (tela nova e mínima: lista de fatores + cadastrar outro).
- Faixa "dados de exemplo" só nas telas de Sistemas e no Início (grade de sistemas).

## Produção

`src/proxy.ts`: `/admin` liberado só com `ADMIN_ENABLED=true` (`vars` do `wrangler.jsonc`), na
última tarefa.
