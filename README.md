# 💀 Deathmatch


Deathmatch es un juego realizado para la edición 2022 de la [JS13k](https://js13kgames.com/), cuyo tema es [DEATH](https://medium.com/js13kgames/js13kgames-2022-has-started-73a7bd31721b).

En está competencia existe la categoría de [server](https://github.com/js13kGames/js13kserver), en la cual se entrega un proyecto el cual ya tiene configurado lo necesario para establecer una conexión en tiempo real, en este caso haciedo uso de la popular librería conocida como [socket.io](https://socket.io/), 
la idea es que el juego comprimido en un acrhivo .zip no supere los 13KB, para este juego el archivo que contiene todo el juego y que pesa 13 KB, es el denominado [dist.zip](https://github.com/Jorger/deathmatch-online/blob/main/dist.zip), los archivos comprimidos está ubicados en la carpeta [public](https://github.com/Jorger/deathmatch-online/tree/main/public), 
de la misma forma los archivos no comprimidos del juego se encuetran en la carpeta [public_uncompressed](https://github.com/Jorger/deathmatch-online/tree/main/public_uncompressed)

# 📖 Reglas.

La meta en Death Match es despejar tantas filas y columnas como sea posible utilizando el menor número de movimientos posible. Es posible despejar ítems  del tablero alineando tres (o más) en una fila, lo cual se logra intercambiando las piezas hasta formar tríos de piezas iguales. gana el juagdor que tenga más puntuación al final de los cinco turnos.

![parejas_tres](https://user-images.githubusercontent.com/30050/188906867-358ba85b-22e3-4511-85a0-ea5e2129cd24.gif)

## 🗺️ Turnos/movimientos y tiempo.

![image](https://user-images.githubusercontent.com/30050/188908330-c3a933b3-5c51-4299-91b1-0b29d322a846.png)

### 🖐️ Turnos/movimientos

Se cuenta con cinco turnos, en cada uno el jugador tiene un máximo de dos intentos (o más si se consiguen premios).

### ⏱️ Tiempo

Se tiene un tiempo de 20 segundos para realizar el movimiento, si en este tiempo no se hace movimiento alguno se perderá el turno, cada vez que se hace un movimiento el tiempo se pausa.

## 🏅 Premios.

Existen 4 tipos de premios como son:

### 🧨 Dinamita:

Se consigue cuando se completan 4 ítems, en este caso como un cuadrado.

| 💀 | 💀 | 🧨 |
|:---:|:---:|:---:|
| 💀 | 💀 |    |


Cuando se activa una dinamita se eliminan los elementos que están alrededor de está.

| 💥 | 💥 | 💥 |
|----|----|----|
| 💥 | 🧨 | 💥 |
| 💥 | 💥 | 💥 |


    
### 🪓 Hacha (Axe):

Se consigue cuando se completan 4 o más ítems de forma horizontal.


| 🎃 | 🎃 | 🎃 | 🎃 | = |  🪓 |
|----|----|----|----|---|-----|


Al activarla se eliminarán todos elementos que estén en la fila.

### 🚀 Cohete (Rocket):

Se obtiene cuando se logran tres o más ítems verticalmente.


| 👹 |
|----|
| 👹 |
| 👹 |
| 👹 |
| =  |
| 🚀 |

Al activar este premio se destruyen todos los elementos de la columna.

### 🚀 Bomba:

Se obtien cuando se logran tres o más elementos de forma horizontal y vertical.

|    |    | 🧠 |   |    |
|----|----|----|---|----|
|    |    | 🧠 | = | 💣 |
| 🧠 | 🧠 | 🧠 |   |    |

Al activar la bomba se eliminan todos los ítems que estén en un radio de dos espacios.

| 💥 | 💥 | 💥 | 💥 | 💥 |
|----|----|----|----|----|
| 💥 | 💥 | 💥 | 💥 | 💥 |
| 💥 | 💥 | 💣 | 💥 | 💥 |
| 💥 | 💥 | 💥 | 💥 | 💥 |
| 💥 | 💥 | 💥 | 💥 | 💥 |


Es posible combinar premios, por ejemplo:

| 🚀 | 💥 | 💣 |
|----|----|----|
| 💥 | 🧨 | 💥 |
| 💥 | 💥 | 🪓 |

* Si se activa la dinamita, está a su vez activará los demás premios.
* Si se activa el rocket, ya que sólo tiene efecto de forma vertical, no activará los demás premios.
* El mismo caso del hacha, ya que sólo afecta horizontalmente.
* En e caso de la bomba debido a que tiene un mayor radio, activará los demás premios.

💡 Es posible activar un premio al cambiar su posición con otro elemento o al hacer click/touch sobre éste, esto es importante por que puede cambiar el rango de destrucción:

| 🚀 | 💥 | 💣 |
|----|----|----|
| 💥 | 🧨 | 💥 |
| 💥 | 💥 | 🪓 |


Si en este caso se mueve la dinamita hacía abajo, debido a que el rango de eliminación es de una sola celda, la dinamita no activaría la bomba y el cohete.

Pero si se mueve por ejemplo el hacha hacía arriba, debido a que la fila cambia, activará la dinamita ya que estarían en la misma fila, y está a si vez activaría los demas premios.

💡 Cuando se consigue un premio **(siempre y cuando haya sido logrado por el usuario y no por la caída de nuevos elementos)** se le otorga un movimiento extra al jugador, entre más movimientos se tengan, se pueden hacer más jugadas y por consiguiente más putuación.

# 🎮 Modalidades de Juego.

![image](https://user-images.githubusercontent.com/30050/188919918-687c03af-bd8d-479c-a117-34a9436cc5a6.png)

El juego cuenta con dos tipos de modalidades como son:

* **1️⃣ Offline:** Que a la vez se componente de:

  * 👽 Two Players
  * 🤖 vs Bot
  
* **2️⃣ Online:** De la misma forma se compone de:

  * 🌎 Play Online
  * 🤝 Play with friends


## 1️⃣ Offline.

En está modalidad toda la actividad del juego se lleva a cabo en el mismo dispotivo, gracias al uso de [service workers](https://developers.google.com/web/fundamentals/primers/service-workers), el juego puede funcionar offline, además de ser un [PWA](https://web.dev/progressive-web-apps/)

### 👽 Two Players

https://user-images.githubusercontent.com/30050/188747351-857773fd-0c98-4d0d-aa8b-e7b9fbe7a872.mov

En esta modalidad la partida se llevará a cabo en el mismo dispositivo.

### 🤖 vs Bot

https://user-images.githubusercontent.com/30050/188747419-1089aa19-db2a-47c1-a15b-f53ea8bcf2f0.mov

En esta modalidad se competirá vs un bot, es una modalidad que también sirve como práctica, a la vez se cuenta con tres modos de dificultad.

## 2️⃣ Online.

Está modalidad requiere conexión a internet, ya que se hará uso de [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), se tienen las siguientes opciones:

### 🌎 Play Online

![play_online](https://user-images.githubusercontent.com/30050/188748377-29b58544-f855-47fc-b239-9013f36ceb4b.gif)

Esta modalidad nos permitirá inciar una partida con cualquier jugador que este conectado, se podría intepretar como una partida aleatoria, ya que se creará una sala con aquella persona que este disponible en ese momento.

### 🤝 Play with friends

![play_with_friend](https://user-images.githubusercontent.com/30050/188748338-91afd751-9e4b-4e83-8e16-5e3828a2b04f.gif)

Es una extensión de la modalidad anterior, pero en este caso se creará una sala privada, es decir, sólo aquellos usuarios que tengan el código de la sala podrán jugar la partida, se aplican las mismas funcionalidades de la modalidad anterior.
