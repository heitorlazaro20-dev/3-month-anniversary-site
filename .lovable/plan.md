# Legendas editáveis na galeria

Hoje as legendas estão fixas no código, por isso você não consegue mudá-las pelo site. A ideia é poder clicar na legenda, escrever o texto e salvar — valendo para qualquer pessoa que abrir o site.

## Como vai funcionar

- Cada foto da galeria ganha um botão/ação de editar (ícone de lápis) na legenda.
- Ao clicar, a legenda vira um campo de texto; ao salvar, o texto novo aparece na hora.
- O texto fica guardado online, então ela vê a mesma legenda no celular dela.
- Sem senha: quem abrir o site pode editar.
- Limite de 120 caracteres por legenda, com aviso amigável se passar.
- Pequeno aviso de "salvo" após cada edição.

## O que precisa ser ligado

Ativar o Lovable Cloud (banco de dados integrado) para guardar as legendas. Sem conta externa, sem configuração da sua parte.

## Detalhes técnicos

- Ativar Lovable Cloud e criar tabela `photo_captions` (`photo_key` texto único, `caption` texto, `updated_at`), com GRANTs e RLS permitindo SELECT/INSERT/UPDATE para `anon` e `authenticated` (site público sem login).
- Seed na migration com as 8 legendas atuais, usando uma chave estável por foto (nome do arquivo).
- Leitura via TanStack Query no componente da galeria (`src/routes/index.tsx`), com fallback para as legendas atuais caso a busca falhe.
- Escrita via upsert com validação zod (trim, 1–120 chars) no cliente e limite de tamanho na coluna.
- Extrair a galeria para `src/components/PhotoGallery.tsx` para manter o arquivo da página enxuto.
