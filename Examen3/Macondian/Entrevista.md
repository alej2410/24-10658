# The Macondian

Transcripción del encuentro - TOP SECRET - ULTRASECRETO
Solo para ingenieros que firmaron el juramento de mantener confidencialidad absoluta

## Diálogo

Mr. X: (representante de la agencia que contrata a la empresa ARTES)
Buenos días Hector: ¿Cómo le va?

Dr. Hector Solana: (Gerente de Productos y Proyectos de ARTES)
Buenos días (## redactado ##), todo bien por aqui, aunque me siento como un pez fuera del agua.
Jamas habiamos trabajando con una agencia gubernamental tan importante como la suya.
¿Puede darme una idea de este proyecto llamado "Macondo"?

Mr. X:
Bueno no puedo decir mucho sobre el proyecto por dos razones:
- Macondo está clasificado: yo no puedo compartir lo que sé, y ..
- yo mismo estoy en la obscuridad acerca de gran parte del proyecto!
Pero no se preocupe, van a tener lo que necesitan. Decidimos contratarlos por buenas razones:
ARTES tiene experiencia desarrollando sistemas integrados de procesamiento en tiempo real.

Dr. Solana:
Gracias, nosotros agradecemos que nos hayan elegido para ser parte de este proyecto.
Supongo que ya tienen un plan para ponernos en marcha.

Mr. X:
Asi es. En esta primera fase vamos a programar una simulación parcial del sistema Macondo.
Y digo "vamos" porque nosotros proporcionamos el generador de datos. ARTES se encarga de procesarlos.
El generador simula y envía un flujo de datos de sensores Macondianos, agrupados en "batches" (lotes).
Antes de entrar en más detalles, cuéntenme cómo nos va hasta ahora.

Dr. Solana:
Entiendo, vamos a implementar un procesamiento de flujos de datos, pero ... ¿"sensores Macondianos"?

Mr. X:
Sí, me alegra que lo pregunte. Imaginaba que se quedaría perplejo, y con razón.
Yo mismo no sé qué miden esos sensores, y aun menos cómo lo hacen: ¡es información clasificada!
Ni siquiera sabemos qué unidades fundamentales están involucradas [1].
Sólo algunos científicos y pocos lideres de la agencia conocen la naturaleza real del proyecto.
La mayoría de nosotros no sabemos quién sabe, quién no, o quién finge no saber.

Dr. Solana:
OMG!

Mr. X:
Como podrá imaginar, se trata de información muy sensitiva por razones de seguridad nacional.
De hecho, usted me conoce, sabe mi nombre, y ahora sabe que ni siquiera yo sé mucho, pero aún así ...
... ¡Me tiene en esta conversación secreta con el alias "Mr. X"!
Es clasificada «TOP SECRET» por órdenes de las altas esferas.

Dr. Solana:
Comprendo.

Mr. X:
Aprecio que ARTES haya sometido a sus ingenieros a un riguroso proceso de evaluación.
Es un proceso largo. Afortunadamente, usted ya está bajo contrato de confidencialidad.
Ya sabe que esta conversación solo puede compartirse con unos pocos de sus ingenieros.

Dr. Solana:
Sí, pocos miembros de ARTES están involucrados en el proyecto, y lo mantienen en secreto.

Mr. X:
Puedo imaginarme el estrés por el que pasaron algunos, y la responsabilidad que sienten.
Volviendo a los sensores Macondianos: la buena noticia es que ...
... para ustedes — y, de hecho, también para nosotros — no son nada más que números.
Nuestros científicos crearon un nombre para lo que miden los sensores, y ese nombre es...
... por favor, no se ría ... ¡Macondos!

Dr. Solana:
(Sonriendo) De alguna manera ya me lo imaginaba.
Ud. menciona que recibimos un flujo de datos, de múltiples sensores, "en lotes".
¿Me está diciendo que no vamos a recibir un flujo separado para cada sensor Macondiano?

Mr. X:
Así es, no se obtiene un flujo de datos separado para cada sensor.
Se obtiene un único flujo de lotes: cada uno con las lecturas de todos los sensores.
En nuestro sistema, es fundamental obtener lecturas simultáneas de todos los sensores.
Por eso, cada lote proporciona los datos de todos los sensores del sistema en un momento dado.
Quizás Ud. se pregunta cuál es la frecuencia de los lotes y cuántos sensores hay.

Dr. Solana:
Sí, especialmente si tenemos requisitos estrictos en cuanto al tiempo de respuesta.

Mr. X:
Buen punto: ¡por eso contratamos personas que dominan este campo!
La buena noticia es que primero vamos a simular el sistema íntegrado en software;
una vez hecho esto, vamos a decidir qué implementar en firmware [2], de ser necesario.

Dr. Solana:
Sí, ese siempre es un buen enfoque.
Me pregunto si el numero de sensores esta prefijado,
y si tienen un estimado de los intervalos de tiempo entre los lotes.

Mr. X:
El número de sensores es un parámetro de la simulación.
Su programa debe depender y funcionar para cualquier valor de los parámetros.
En esta fase, no simulamos intervalos de tiempo entre mensajes por lotes.
Más bien, mediremos (¡y sí, lo haremos!) la sobrecarga del procesamiento de datos y...
...vamos a razonar a la inversa para decidir si procesar los datos mediante software es suficiente.
Tenemos requisitos preliminares de frecuencia mínima de muestreo, basados ​​en la naturaleza del sistema,
pero no necesitamos preocuparnos por eso hasta que conozcamos la sobrecarga del procesamiento de datos.
Espero que su procesamiento sea tan rápido que podamos mantener la frecuencia mínima con holgura.

Dr. Solana:
Claro, la naturaleza de este proyecto lo requiere.
Y conocer la sobrecarga del procesamiento de datos es clave.
Entonces, si entiendo bien, ¿recibiremos lotes de manera continua, sin intervalo de tiempo preestablecido?

Mr. X:
Así es: el generador envía un lote tras otro, periodicamente, en sincronía con el procesamiento.
Ahora bien, no mencioné ciertos detalles para que la explicación fuera más fluida y clara.

Dr. Solana:
Entiendo.

Mr. X:
En particular, probablemente se imagina que cada sensor proporciona una única lectura Macondiana ...
... pero la realidad es más compleja que eso: cada sensor envía un conjunto de lecturas.
Resulta ser que el sensor Macondiano es un dispositivo compuesto: contiene un arreglo de sensores [3].
A esos los llamamos microsensores. Los Macondos son el promedio de las lecturas de los microsensores.

Dr. Solana:
Entiendo: seguramente es asi para mejorar la fiabilidad de la medida de Macondos.

Mr. X:
Correcto. Y debo agregar que el sensor Macondiano no calcula el promedio: ¡eso lo computan Ustedes!

Dr. Solana:
Ya veo. Eso significa que necesitamos las lecturas de todos los microsensores en cada lote, ¿verdad?

Mr. X:
Asi es, las lecturas de los microsensores vienen juntas, para cada sensor, en cada lote.
Debo decirle que los sensores Macondianos vienen en distintos modelos, posiblemente de diferentes proveedores.
Los modelos varian, particularmente en los microsensores, pero cada modelo tiene un número fijo de microsensores.
Los científicos les dan nombres extraños, inspirados en China y Taiwan, pero dudo que los proveedores sean de alli.
Algunos cuentan que los sensores Chinos tienen más microsensores para compensar la menor calidad de éstos.
Es posible que estos cuentos sean "leyendas de laboratorio" para obfuscar de donde vienen los sensores.
Lo que importa es que deben estar preparados a recibir datos de distinto tamaño.

Dr. Solana:
No hay problema - estamos acostumbrados a esas cosas.

Mr. X:
Por ultimo, ya le dije que la medida Macondiana es el promedio de las medidas de los microsensores.
Pero estaba simplificando. La medida Macondiana es el resultado de un modelo estadístico de suavización.
Es cierto que la medida depende de los microsensores, pero la síntesis es más compleja que calcular un promedio.
La síntesis de los datos de los microsensores depende de un modelo estadístico y un parámetro clave del mismo.
A ese parámetro lo conocemos como el radio Macondiano de tolerancia.

Dr. Solana:
Wow. Supongo que vamos a necesitar una especificación que describe el modelo estadístico.

Mr. X:
En principio si, pero déjeme explicar un poco más.
La medida de los Macondos es, lógicamente, un estimado de los microsensores.
El modelo estadístico es un modelo de suavización que depende de varias cosas.
Principalmente de una medida de valor representativo (promedio, mediana, u otra), y ...
... la eliminación de valores atípicos (outliers), debidos a fallas de los microsensores.
El radio Macondiano de tolerancia es un margen de tolerancia para eliminar valores atípicos.

Dr. Solana:
Comprendo ...

Sin embargo, el radio Macondiano de tolerancia es algo que nuestros científicos están tratando de determinar.
Porque ... no es una simple cuestión de estadistica .. el radio .. el radio es algo que depende del mundo físico!
Estoy hablando de experimentos de física cuántica, en nuestro laboratorio, que cuestan millones.

Dr. Solana:
Admiro lo avanzado del proyecto.

Mr. X:
Pero no se preocupe, en esta fase del proyecto pueden asumir un radio y simular el procesamiento.
Después de todo, el valor del radio Macondiano de tolerancia no deberia afectar el costo del mismo.
Los valores sugeridos son 5%~10% de los valores típicos, pero pueden experimentar con variaciones.

Dr. Solana:
De acuerdo: el costo de procesamiento típicamente depende del modelo, más que los parámetros del mismo.

Mr. X:
Asi es. Y esto nos lleva a otra sorpresa: ¡el modelo estadístico no está completamente decidido!
No se asuste: nuestros matemáticos están analizando unos pocos modelos y verificando sus propiedades.
Pero, y esto es algo que debería llenarlo de orgullo, ellos mismos me pidieron que ARTES desarrolle su modelo!
La razón es simple, y dice mucho acerca de la integridad científica y talento de ambas organizaciones.
Un miembro dijo: "desarrollar modelos independientemente puede ayudarmos a conseguir otros mejores".
Para intercambiar los modelos con agilidad, va a ser util que definan una interfaz de procesamiento.

Dr. Solana:
Estoy completamente de acuerdo: es buena ingeniería de software. Me halaga la confianza de su grupo.

Mr. X:
Los modelos van a ser evaluados en dos dimensiones: sus propiedades matemáticas y el costo de procesamiento.
La decisión final de cual adoptar va a depender de ambas.

Dr. Solana:
Me parece bien: ya se me ocurren ideas para hacer ese procesamiento más eficiente de lo que parece.

Mr. X:
No me sorprende: ¡Ud. siempre ha sido un genio en desarrollar algoritmos!

Dr. Solana:
Por favor .. no me haga sentir engreído. :-)

Mr. X:
Claro que no. Vamos a tener una cena .. ¡pagada por la agencia!

Dr. Solana:
¡Con mucho gusto!

---

Notas del facilitador de CI-2125,
suponemos que nuestros ingenieros saben a que se refieren con estos términos:

[1] Unidades fundamentales
https://en.wikipedia.org/wiki/Unit_of_measurement
https://en.wikipedia.org/wiki/Physical_quantity
https://en.wikipedia.org/wiki/Dimensional_analysis

[2] Firmware
https://en.wikipedia.org/wiki/Firmware

[3] Arreglo de sensores
https://en.wikipedia.org/wiki/Sensor_array
