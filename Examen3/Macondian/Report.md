# Modelos de IA usados:
- Google Gemini 3.1 Pro Razonamiento extendido: Actuó como arquitecto de software y tutor analítico. Se encargó de la ingeniería inversa del flujo de datos, el diseño de la arquitectura reactiva, la formulación de la estrategia matemática (análisis de complejidad Big-O) y la preparación argumentativa para la defensa oral.

- OpenAI — GPT-5.6 Sol: Actuó como desarrollador y auditor de código. Su función fue transcribir las directrices y estrategias previamente definidas al código final, encargándose de la implementación en TypeScript, la integración en React y la maquetación estética (CSS).

Explicación del algoritmo de procesamiento de los datos de los sensores:
El funcionamiento de este algoritmo consiste principalmente en encontrar primero un centro robusto calculando la mediana del conjunto de lecturas de los microsensores. A partir de esa mediana, define un radio de tolerancia del 10 % y descarta las lecturas que quedan fuera de ese rango, considerándolas outliers. Luego calcula el promedio únicamente con las lecturas que permanecen dentro del radio de tolerancia. Este proceso se realiza de forma independiente para cada sensor.


____________________________________________________________________________________________________________________________________________________________________________________
____________________________________________________________________________________________________________________________________________________________________________________

# Funcionalidad adicional: benchmark de Quickselect vs Sort

Además del procesamiento requerido para los sensores, se agregó el comando ".bench" como una herramienta de prueba de rendimiento. Esta funcionalidad no forma parte del comportamiento básico solicitado para el simulador, sino que fue incorporada para comprobar experimentalmente cuál estrategia de cálculo de la mediana era más conveniente para este problema.

Durante el desarrollo se consideraron dos formas de calcular la mediana:

1. quickselectMedian:
   Utiliza Quickselect para localizar los elementos centrales sin ordenar completamente el arreglo. Su complejidad temporal esperada es O(m), donde m es la cantidad de microsensores de un sensor. La implementación trabaja in-place, por lo que modifica directamente el arreglo recibido y no necesita una copia adicional para calcular la mediana.

2. sortMedian:
   Ordena completamente el arreglo de microsensores y luego toma el elemento central, o el promedio de los dos centrales cuando la cantidad de elementos es par. Para efectos del análisis se considera un costo del orden de O(m log m), aunque también trabaja in-place.

La razón para comparar ambas estrategias es que los sensores utilizados actualmente contienen arreglos muy pequeños, de solamente 6 u 8 microsensores. En estas condiciones, una mejor complejidad asintótica no garantiza automáticamente un menor tiempo de ejecución. Los factores constantes de cada algoritmo, la cantidad de comparaciones e intercambios y la implementación del motor de JavaScript pueden tener mayor influencia cuando m es tan pequeño.

Por esta razón no se decidió únicamente a partir del análisis Big-O, sino que se implementaron ambas estrategias detrás de la misma interfaz y se creó un benchmark para compararlas en el entorno de ejecución real.

Funcionamiento del comando .bench

El comando se ejecuta desde la línea de comandos del simulador escribiendo:

.bench

La prueba genera un lote sintético con 100.000 sensores. Los sensores alternan entre 6 y 8 microsensores, produciendo aproximadamente 700.000 lecturas en total. Se utiliza la misma carga de datos para comparar las dos estrategias.

Debido a que tanto Quickselect como Sort modifican los arreglos in-place, cada estrategia recibe una copia independiente del mismo conjunto de datos. La clonación se realiza antes de iniciar el cronómetro para evitar que ese costo forme parte de la medición.

Antes de registrar los resultados también se realiza una fase de warm-up. Esta ejecución inicial no se contabiliza y sirve para reducir el efecto que puede producir la compilación JIT y las optimizaciones iniciales del motor de JavaScript.

Posteriormente se realizan 7 pruebas para cada estrategia. El orden de ejecución se alterna entre Quickselect y Sort para reducir posibles ventajas causadas por ejecutar siempre un algoritmo antes que el otro.

La medición se realiza con performance.now() y cubre únicamente la ejecución de processBatch(). No se incluyen en el tiempo medido:

- la generación de los datos sintéticos;
- la clonación del dataset;
- el renderizado de React;
- la actualización del DOM;
- la fase de warm-up.

Al finalizar se calculan el promedio, la mediana, el mínimo y el máximo de los tiempos obtenidos. Para seleccionar el ganador se utiliza principalmente la mediana, ya que es menos sensible a una ejecución ocasionalmente afectada por pausas del sistema, garbage collection u otras variaciones del runtime.

En una de las ejecuciones realizadas en la máquina virtual se obtuvieron los siguientes resultados:

quickselectMedian:
- Promedio: 26.857 ms
- Mediana: 28.500 ms
- Mínimo: 21.000 ms
- Máximo: 31.100 ms

sortMedian:
- Promedio: 36.414 ms
- Mediana: 37.600 ms
- Mínimo: 28.000 ms
- Máximo: 44.000 ms

Tomando las medianas de ejecución:

37.6 / 28.5 ≈ 1.319

Por lo tanto, Quickselect fue aproximadamente 1.32 veces más rápido que Sort en esa prueba.

Este resultado no pretende demostrar que Quickselect será siempre más rápido que Sort en cualquier sistema. El resultado solamente indica que, para esta implementación, esta carga de trabajo y este entorno de ejecución, Quickselect presentó un mejor rendimiento. La utilidad del benchmark es precisamente complementar el análisis teórico con una medición experimental sobre el sistema real.
