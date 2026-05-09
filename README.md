# Tarea 1

## Informacion general

- DEBEN seguir las instrucciones de cada ejercicio. No hacerlo RESULTARA en una calificación de 0.
- El programa `ex.z` DEBE interpretarse SIN ERRORES, si al copiarse y pegarse en miticalc genera al menos un error, la calificación de esta seccion será 0.
- El programa `ex.cxx` DEBE compilarse SIN ERRORES, si no compila, la calificación de esta seccion será 0.
- NO PUEDEN MODIFICAR LAS FIRMAS DE LAS FUNCIONES EN NINGUN ARCHIVO, si lo hacen, la calificación de esta seccion será 0.
- El codigo de c++ se compilara con una maquina virtual igual a la proveida en el replit. Es decir, DEBEN verificar que el codigo compila
  en replit o una maquina equivalente. Si compilan de cualquier otra forma sin verificar esto, lo hacen bajo su propio riesgo.
- DEBEN mantener los nombres de los archivos Y el nombre de la carpeta igual. Si no lo hacen, la calificación de esta seccion será 0.
- NO DEBEN crear mas archivos que los solicitados. Si lo hacen, la calificación de esta seccion será 0.
    - Es decir, NO DEBEN subir un zip, ni un rar, ni una carpeta adicional, las respuestas DEBEN ser ubicadas en la carpeta "Tatea1" y los archivos "ex.z", "ex.cxx" DEBEN estar en esa carpeta.

Recomendamos que no usen IA para preguntas de Zilly, pero, si lo hacen:
- además de la solución deben mostrar el "prompt" y decirnos qué modelo de IA usaron. Esto debe ser anexado en un archivo llamado "metadata.txt".
   NO dentro del archivo `ex.z`
- si creemos que usaron IA y lo ocultaron, nos reservamos el derecho de entrevistarlos.
    Deben demostrar capacidad de razonamiento. Esto es para el bien de ustedes.


El incumplimiento de cualquiera de estas reglas RESULTARA en una calificación de 0 para la sección correspondiente, sin excepciones.



## Zilly

Estos ejercicios DEBEN responderse dentro del archivo `ex.z`


### Ejercicio 1


Este nivel de uso de IA se llama: "AI discouraged".
El lógico-matemático Augustus De Morgan descubrió estos teoremas en el siglo XIX:

La negación de «P y Q» es lo mismo que «no P o no Q»
La negación de «P o Q» es lo mismo que «no P y no Q»

Es decir, usando

$$
\neg (P \wedge Q) \equiv \neg P \vee \neg Q
$$

$$
\neg (P \vee Q) \equiv \neg P \wedge \neg Q
$$

Escriba dos expresiones (una para cada teorema) que representen las leyes de DeMorgan.

La expresion1 DEBE ser una funcion, y DEBE asignarse a la variable `de_morgan1`.

La expresion2 DEBE ser una funcion, y DEBE asignarse a la variable `de_morgan2`.


### Ejercicio 2


Este nivel de uso de IA se llama: "AI discouraged".

Defina una abstracción funcional llamada succ, tal que succ(z) computa z + 1.

    succ(-100) retorna (99)
    succ(7) retorna (8)


## C++

Estas preguntas DEBEN responderse dentro del archivo `ex.cxx`

### Ejercicio 3

Esta pregunta es "AI optional": es decir, pueden usar IA, aunque es algo ridículo en este caso.

Recuerden que si usan IA DEBEN mostrar los datos requeridos en un archivoo llamado "metadata.txt", y no dentro del código.

Programe el promedio y la varianza de una muestra, representada son un vector<double>

Las funciones deben llamarse mean (promedio) y variance (varianza)


### Ejercicio 4

Esta pregunta es "AI encouraged". Les pedimos que usen inteligencia artificial.

Recuerden que DEBEN mostrar los datos requeridos en un archivoo llamado "metadata.txt", y no dentro del código.

Sea S un conjunto de elementos que poseen dos propiedades: A y B.
Representamos S con dos vectores, VA y VB (valores de A y B), donde cada elemento de S corresponde a elementos de VA y VB que tienen el mismo índice.

- Programen una función, llamada pearson_r, que computa el coeficiente de correlación de las variables A y B.
- Digan qué modelo de IA usaron. No manden los "prompts" (pueden ser largos) pero recomendamos que los guarden -pueden ayudar en caso de revisión.



### Ejercicio 5

Zoólogos y arqueólogos de la era espacial del siglo XXII han descubierto tres especies inteligentes,
todas descendientes, de acuerdo a su fenotipo y genotipo, de una especie similar al Octopus Vulgaris de nuestro planeta.
Son muy inteligentes, han desarrollado conocimientos de geometría y matemática, desde Euclides a Leibniz y posiblemente Gauss.
Cada especie usa símbolos distintos para representar números, pero tienen varias similaridades, lo que sugiere intercambio cultural.
De hecho, las tres especies han desarrollado una economía común, empleando almejas como divisas.
Cada especie tiene su propio sistema de numeración posicional, basado en su número de tentáculos:

- Septapus Mirabilis tiene siete tentáculos
- Octopus Sapiens tiene ocho tentáculos
- Hexakaidecapus Turingia tiene dieciséis tentáculos

Los arqueólogos han logrado, sin mucha dificultad, identificar el significado de cada símbolo/dígito.
Podemos usar los dígitos a los que estamos acostumbrados: tienen correspondencia 1-1 con los símbolos de los pulpos inteligentes.

Si Hexakaidecapus Turingia ofrece de una cesta de langostas por 1A8 almejas,
Septapus Mirabilis hace la conversión a XXX Almejas y  Octopus Sapiens hace la conversión a YYY almejas ...
.. la misma divisa, y el mismo número de almejas, sólo representado de manera diferente.

Su trabajo sera implementar las funciones:

```cpp
vector<char> dec_to_septapus(int n){return {}}; // la cual convierte un numero decimal a su representacion en el sistema de Septapus Mirabilis
vector<char> dec_to_octopus(int n){return {}}; // la cual convierte un numero decimal a su representacion en el sistema de Octopus Sapiens
vector<char> dec_to_hexakaidecapus(int n){return {}}; // la cual convierte un numero decimal a su representacion en el sistema de Hexakaidecapus Turing
vector<char> septapus_to_dec(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Septapus Mirabilis a su representacion decimal
vector<char> octopus_to_dec(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Octopus Sapiens a su representacion decimal
vector<char> hexakaidecapus_to_dec(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Hexakaidecapus Turing a su representacion decimal
vector<char> septapus_to_octopus(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Septapus Mirabilis a su representacion en el sistema de Octopus Sapiens
vector<char> septapus_to_hexakaidecapus(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Septapus Mirabilis a su represent
vector<char> octapus_to_septapus(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Octopus Sapiens a su representacion en el sistema de Septapus Mirabilis
vector<char> octopus_to_hexakaidecapus(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Octopus Sapiens a su
vector<char> hexakaidecapus_to_septapus(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Hexakaidecapus Turing a su representacion en el sistema de Septapus Mirabilis
vector<char> hexakaidecapus_to_octopus(vector<char> s){return {}}; // la cual convierte un numero representado en el sistema de Hexakaidecapus Turing a su representacion en el sistema de Octopus Sapiens
```
