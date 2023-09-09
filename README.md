# dh-panel
Paínel de controle para hospedagem de bots que utilizam javascript, usando docker

## O Que é o DHPanel?

DHPanel é um projeto para hospedar bots do discord criado em javascript/typescript, oferecendo uma interface de facil gerenciamento e de controle

## O Que o DHPanel oferece?

* Bots em Multi Dedicados

Conforme um bot cresce ele acaba pegando cada vez mais recursos, para compensar os donos de bots normalmente aumentam os recursos da vps/dedicado, porém, uma outra solução é a compra de mais servidores dedicados, contudo essa solução vem com desafios na configuração das shards e na integração dos dedicados. Esse recurso envia automaticamente quais shards devem ser conectadas em cada maquina, facilitando na criação de bots que utilizam multiplos dedicados.

* Limitação na RAM e CPU

Nenhuma maquina possui mémoria infinita, esse recurso permite que o administrador limite a quantidade de mémoria que um bot pode utilizar, garantindo que o seu servidor continuará operacional

* Manipulação de variaveis de ambiente

Compartilhe o token do bot, a url de conexão do banco de dados e outras variaveis de ambiente de forma segura por meio de uma criptografia segura

* Utilização do GIT

As maquinas recebem os arquivos via GIT, uma forma segura e rapida de transportar os arquivos

* Manipulação do Banco de dados (MySQL, PostgreSQL, MongoDB)

O Paínel também permite ver e editar o banco de dados, permitindo monitor e realizar backups automaticos
