# :checkered_flag: Readio

Uma rede social voltada para a interação social entre leitores, permitindo que os usuários compartilhem e acompanhem suas leituras. 

## :technologist: Membros da equipe

535904, Sabrina Ketlen, Ciência da Computação

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

- Usuário Cadastrado
- Usuário Não Cadastrado
- Organizador do catálogo

## :spiral_calendar: Entidades ou tabelas do sistema

- Usuário
- Livro
- Estante
- Post (atualizar status de leitura, resenha)

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

- Funcionalidades Acessíveis a Todos os Usuários:

Pesquisa de livros e visualização de informações sobre eles.

Criação de perfil pessoal.

- Funcionalidades Restritas a Usuários Logados:

Adminstração da estante pessoal.

Atualização de status de leitura em posts.

Avaliação de livros em posts.

- Funcionalidades Restritas ao Organizador do catálogo:

Adicionar livros ao catálogo

Excluir livros do catálogo

Editar informações de livros do catálogo

----

:warning::warning::warning: As informações a seguir devem ser enviadas juntamente com a versão final do projeto. :warning::warning::warning:


----

## :desktop_computer: Tecnologias e frameworks utilizados

**Frontend:**

Vue.js, Pinia, Vue Router, Vite, Vitest, @vue/test-utils, vite-plugin-vue-devtools, TypeScript, vue-tsc, @tsconfig/node20, @types/node, @types/jsdom, jsdom 

**Backend:**

Strapi, React, React DOM, React Router DOM, Styled Components, @strapi/plugin-users-permissions, @strapi/plugin-i18n, @strapi/plugin-cloud, better-sqlite3, Node.js, NPM

## :shipit: Operações implementadas para cada entidade da aplicação


| Entidade| Criação | Leitura | Atualização | Remoção |
| --- | --- | --- | --- | --- |
| Usuário | X |   |   |   |
| Livros | X | X |  X  |  X  |
| Posts | X | X | X | X |
| Estantes | X | X | X |  |

> Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

## :neckbeard: Rotas da API REST utilizadas

| Método HTTP | URL |
| --- | --- |
| GET | api/livros|
| GET | api/livros/|
| POST | api/livros |
| PUT | api/livros/ |
| DELETE | api/livros/ |
| GET | api/posts |
| GET | api/posts/ |
| POST | api/posts/ |
| DELETE | api/posts/ |
| GET | api/estantes |
| GET | api/estantes/ |
| POST | api/estantes |
| PUT | api/estantes/ |
| POST | api/auth/local|
| PUT | api/auth/local/register |
| GET | api/users/me |





