# Usamos la imagen oficial de Node.js
FROM node:20

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias y los instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Exponemos el puerto donde corre la app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD node initdb.js && npm start 
