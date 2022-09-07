# 💀 Deathmatch


Deathmatch es un juego realizado para la edición 2022 de la [JS13k](https://js13kgames.com/), cuyo tema es [DEATH](https://medium.com/js13kgames/js13kgames-2022-has-started-73a7bd31721b).

En está competencia existe la categoría de [server](https://github.com/js13kGames/js13kserver), en la cual se entrega un proyecto el cual ya tiene configurado lo necesario para establecer una conexión en tiempo real, en este caso haciedo uso de la popular librería conocida como [socket.io](https://socket.io/), 
la idea es que el juego comprimido en un acrhivo .zip no supere los 13KB, para este juego el archivo que contiene todo el juego y que pesa 13 KB, es el denominado [dist.zip](https://github.com/Jorger/deathmatch-online/blob/main/dist.zip), los archivos comprimidos está ubicados en la carpeta [public](https://github.com/Jorger/deathmatch-online/tree/main/public), 
de la misma forma los archivos no comprimidos del juego se encuetran en la carpeta [public_uncompressed](https://github.com/Jorger/deathmatch-online/tree/main/public_uncompressed)

# Reglas.

La meta en Death Match es despejar tantas filas y columnas como sea posible utilizando el menor número de movimientos posible. Es posible despejar ítems  del tablero alineando tres (o más) en una fila, lo cual se logra intercambiando las piezas hasta formar tríos de piezas iguales.

![parejas_tres](https://user-images.githubusercontent.com/30050/188906867-358ba85b-22e3-4511-85a0-ea5e2129cd24.gif)

## Turnos/movimientos y tiempo.

![image](https://user-images.githubusercontent.com/30050/188908330-c3a933b3-5c51-4299-91b1-0b29d322a846.png)

### Turnos/movimientos

Se cuenta con cinco turnos, en cada uno el jugador tiene un máximo de dos intentos (o más si se consiguen premios).

### Tiempo

Se tiene un tiempo de 20 segundos para realizar el movimiento, si en este tiempo no se hace movimiento algo se perderá el turno, cada vez que se hace un movimiento el tiempo se pausa.

## Premios.

Existen 4 tipo de premios como son:

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





# Two Players
https://user-images.githubusercontent.com/30050/188747351-857773fd-0c98-4d0d-aa8b-e7b9fbe7a872.mov

# Vs Bot

https://user-images.githubusercontent.com/30050/188747419-1089aa19-db2a-47c1-a15b-f53ea8bcf2f0.mov

# Play with Friends

![play_with_friend](https://user-images.githubusercontent.com/30050/188748338-91afd751-9e4b-4e83-8e16-5e3828a2b04f.gif)


# Play online.


![play_online](https://user-images.githubusercontent.com/30050/188748377-29b58544-f855-47fc-b239-9013f36ceb4b.gif)
