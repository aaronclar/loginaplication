Este proyecto es una aplicación web básica hecha con Node.js, Express, SQLite y EJS que sirve para practicar cómo funciona un sistema de login. Permite que los usuarios se registren en la base de datos con su nombre, contraseña encriptada con bcrypt y un rol que puede ser de administrador o de usuario normal. Al iniciar sesión, el sistema guarda cookies para recordar la autenticación y, según el rol, redirige a /admin o a /home. También tiene la opción de cerrar sesión con /logout.

Para usarlo se deben instalar las dependencias, crear la base de datos database.sqlite con una tabla de usuarios e insertar cuentas de prueba. Luego se inicia el servidor con node index.js y se accede desde el navegador en http://localhost:3000. Es un proyecto sencillo pero útil para entender la autenticación, el cifrado de contraseñas y el manejo de roles en aplicaciones con Node.js.

Para usarlo se deben instalar las dependencias, crear la base de datos database.sqlite con una tabla de usuarios e insertar cuentas de prueba. Luego se inicia el servidor con node index.js y se accede desde el navegador en http://localhost:3000. Es un proyecto sencillo pero útil para entender la autenticación, el cifrado de contraseñas y el manejo de roles en aplicaciones con Node.js.

Configuración un contenedor con un volumen que mantenga la información aunque el contenedor se elimine.

Declararemos el volumen en la imagen postgres:

VOLUME ["/var/lib/postgresql/data"]

Construimos la imagen:

docker build -t imagen-postgres .

Crearemos un volumen persistente:

docker volume create datos_postgres

Lanzamos el contenedor con el volumen montado:

docker run -d --name contenedor_postgres -v datos_postgres:/var/lib/postgresql/data -P imagen-postgres

Ahora, probaremos la persistencia: lanzaremos dos "arquitecturas de dos capas" conectadas al mismo volumen.

BBDD:
docker run -d --network mi_red --name contenedor_postgres -v datos_postgres:/var/lib/postgresql/data -P imagen-postgres
docker run -d --network mi_red --name contenedor-postgres-2 -v datos_postgres:/var/lib/postgresql/data -P imagen-postgres

APP:
docker run -d --network mi_red --name contenedor-node --env DB_HOST="contenedor-postgres" -P imagen-node
docker run -d --network mi_red --name contenedor-node-2 --env DB_HOST="contenedor-postgres-2" -P imagen-node
