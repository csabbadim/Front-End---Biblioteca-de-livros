# Front-End - Biblioteca virtual de livros

Este MVP foi realizado para a sprint **Arquitetura de software**, da pós-Graduação em Engenharia de Software pela PUC-Rio.

Este projeto possui como objetivo ser uma biblioteca virtual, onde nele, o leitor é capaz de inserir o nome do autor, livro, e se já leu ou pretende ler/reler o livro. O leitor pode também inserir a data de quando leu o livro inserido, ou a data de quando pretende ler.

Esse projeto foi dividido em três componentes, onde o componente A é o Front-end da aplicação, e nele é chamado o componente B, que é uma API externa obtida através do site Open Library, e o componente C, desenvolvido por mim.

A API do componente B é uma API pública e sem necessidade de autenticação. A partir da consulta (método GET) pelo nome do autor, a API retorna livros relacionados/escritos por esse autor.

A API do componente C realiza a consulta, cadastro e deleção de livros, além de alterações de informações relacionadas a se o leitor já leu, gostaria de ler e data de leitura.

---
## Como executar em modo de desenvolvimento

Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.

---
## Como executar em modo de desenvolvimento

Certifique-se de ter o Docker instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal. Execute como administrador o seguinte comando para construir a imagem Docker:

```
(env)$ docker build -t front-store .
``` 

Uma vez criada a imagem, para executar o container basta executar, como administrador, seguinte o comando:

```
(env)$ docker run --rm -p 8080:80 front-store
```

Uma vez executando, para acessar o front-end, basta abrir o http://localhost:8080/#/ no navegador.
