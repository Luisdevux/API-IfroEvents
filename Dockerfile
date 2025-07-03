# Usando a imagem base do Node.js 22-alphine
FROM node:22-alpine

# Cria a pasta de trabalho dentro do contêiner
WORKDIR /node-app

# Copia os arquivos de dependências para dentro do contêiner
COPY package.json package-lock.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia todo o código da aplicação para o contêiner
COPY . .

# Expõe a porta 5011 para a plataforma de divulgação de eventos
EXPOSE 5011

# Comando para rodar a aplicação
CMD [ "npm", "start" ]