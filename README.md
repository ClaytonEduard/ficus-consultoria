### Explicação Detalhada do Projeto

1. **Importação de Bibliotecas**:
   - `axios`: Para fazer requisições HTTP.
   - `crypto-js`: Para funções criptográficas.
   - `crc32`: Para calcular valores CRC32.

2. **Função `getServerNonce`**:
   - Faz uma requisição GET para obter o nonce do servidor.

3. **Função `getClientNonce`**:
   - Gera o nonce do cliente com base no hash SHA256 da data e hora atual em formato ISO.

4. **Função `encodePassword`**:
   - Combina o salt com a senha.
   - Gera o hash SHA256 da combinação salt + senha.
   - Combina várias strings conforme especificado.
   - Gera o hash SHA256 da string combinada.

5. **Função `hashPassword`**:
   - Combina o salt com a senha.
   - Gera e retorna o hash SHA256 da combinação salt + senha.

6. **Função `authenticate`**:
   - Obtém o nonce do servidor.
   - Gera o nonce do cliente.
   - Codifica a senha usando os nonces e o nome do usuário.
   - Faz a requisição GET para a URL de autenticação.
   - Retorna o resultado da autenticação e o hash da senha.

7. **Função `getSessionId`**:
   - Divide a string da sessão e retorna a parte antes do `+`.

8. **Função `getPrivateKey`**:
   - Calcula o CRC32 do valor da sessão.
   - Calcula e retorna o CRC32 do hash da senha usando o valor da sessão CRC como valor inicial.

9. **Função `getTimestampHex`**:
   - Obtém o timestamp atual em milissegundos.
   - Converte o timestamp para uma string hexadecimal.
   - Retorna os últimos 8 dígitos da string hexadecimal.

10. **Função `getSessionSignature`**:
    - Calcula o CRC32 da timestamp hexadecimal usando a chave privada como valor inicial.
    - Calcula e retorna o CRC32 do caminho da requisição usando o CRC da timestamp como valor inicial, convertido para hexadecimal.

11. **Função `getFavoriteCompanies`**:
    - Obtém o ID da sessão.
    - Obtém a chave privada.
    - Define o caminho da requisição.
    - Obtém a timestamp em hexadecimal.
    - Gera a assinatura da sessão combinando o ID da sessão, a timestamp e a assinatura calculada.
    - Faz a requisição GET para a URL e retorna o resultado.

12. **Exemplo de uso**:
    - Realiza a autenticação e, em caso de sucesso, obtém a


# Projeto de Autenticação e Pesquisa de Empresas Favoritas

Este projeto demonstra como realizar a autenticação e a pesquisa de empresas favoritas utilizando Node.js, axios, e funções criptográficas.

## Requisitos

- Node.js (versão 12 ou superior)
- npm (Node Package Manager)

## Instalação

1. Clone o repositório para a sua máquina local:

```bash

   git clone <URL_DO_REPOSITORIO>
   
```

2. Navegue até o diretório do projeto:

   ```bash

   cd <DIRETORIO_DO_PROJETO>

   ```
3. Instale as dependências do projeto:

   ```bash

   npm install
   
   ```

## Configuração

Nenhuma configuração adicional é necessária. Certifique-se de que todas as dependências foram instaladas corretamente.

## Executando o Projeto

Para executar o projeto, utilize o seguinte comando:

### `npm start`

O projeto irá iniciar no link local http://localhost:3000/

### Possui somente duas telas como proposto.
* Atenticação do usuário
  * user: aaaa
  * password: 123456
 
## Gif de detalhes
https://www.loom.com/share/664d3dbac6014d28b119be146ffcea9f?sid=de6c7dee-dc06-4eec-a4dd-6a2f59271a02

   

  
