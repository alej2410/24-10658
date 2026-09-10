// src/processing.ts

import type {
  Batch,
  Microsensor,
  ProcessedBatch,
  Sensor,
  SensorResult,
} from "./types";

/**
 * Estrategia intercambiable para calcular la mediana.
 *
 * La función puede modificar el arreglo recibido.
 * Esto es intencional: los datos son lecturas crudas recién parseadas
 * y así evitamos copiar el microarray únicamente para calcular la mediana.
 */
export type MedianStrategy = (values: Microsensor[]) => number;


/* ============================================================================
 * Quickselect in-place
 * ============================================================================
 */

/**
 * Intercambia dos elementos del mismo arreglo sin crear estructuras auxiliares.
 *
 * Tiempo:  O(1)
 * Espacio: O(1)
 */
function swap(values: Microsensor[], i: number, j: number): void {
  if (i === j) {
    return;
  }

  const temp = values[i];
  values[i] = values[j];
  values[j] = temp;
}


/**
 * Particiona el intervalo [left, right] alrededor de un pivote.
 *
 * Al finalizar:
 * - el pivote queda en su posición definitiva;
 * - los valores <= pivote quedan a su izquierda;
 * - los valores > pivote quedan a su derecha.
 *
 * Tiempo:  O(n) para el intervalo procesado
 * Espacio: O(1)
 */
function partition(
  values: Microsensor[],
  left: number,
  right: number,
  pivotIndex: number
): number {
  const pivotValue = values[pivotIndex];

  // Movemos temporalmente el pivote al final.
  swap(values, pivotIndex, right);

  let storeIndex = left;

  for (let i = left; i < right; i++) {
    if (values[i] <= pivotValue) {
      swap(values, storeIndex, i);
      storeIndex++;
    }
  }

  // Colocamos el pivote en su posición definitiva.
  swap(values, storeIndex, right);

  return storeIndex;
}


/**
 * Obtiene el elemento que ocuparía la posición k si el arreglo
 * estuviese completamente ordenado, pero sin ordenar todo el arreglo.
 *
 * Quickselect modifica values in-place.
 *
 * Se utiliza un pivote aleatorio para obtener:
 *
 *   Tiempo esperado: O(n)
 *   Peor caso:       O(n²)
 *   Espacio extra:   O(1)
 *
 * La implementación es iterativa para evitar además el uso de
 * memoria asociado a llamadas recursivas.
 */
export function quickselect(
  values: Microsensor[],
  k: number,
  left = 0,
  right = values.length - 1
): number {
  while (left < right) {
    const pivotIndex =
      left + Math.floor(Math.random() * (right - left + 1));

    const finalPivotIndex = partition(
      values,
      left,
      right,
      pivotIndex
    );

    if (k === finalPivotIndex) {
      return values[k];
    }

    if (k < finalPivotIndex) {
      right = finalPivotIndex - 1;
    } else {
      left = finalPivotIndex + 1;
    }
  }

  return values[left];
}


/**
 * Calcula la mediana mediante Quickselect in-place.
 *
 * Para cantidad impar:
 *
 *   median = x[n / 2]
 *
 * Para cantidad par:
 *
 *   median = (x[n/2 - 1] + x[n/2]) / 2
 *
 * En el caso par ejecutamos Quickselect dos veces.
 * 2·O(n) sigue siendo O(n).
 *
 * Tiempo esperado: O(n)
 * Espacio extra:   O(1)
 */
export function quickselectMedian(values: Microsensor[]): number {
  const length = values.length;

  if (length === 0) {
    return Number.NaN;
  }

  const upperMiddle = Math.floor(length / 2);

  // Número impar: existe un único elemento central.
  if ((length & 1) === 1) {
    return quickselect(values, upperMiddle);
  }

  // Número par: necesitamos los dos elementos centrales.
  const lowerMiddle = upperMiddle - 1;

  const lowerValue = quickselect(values, lowerMiddle);
  const upperValue = quickselect(values, upperMiddle);

  return (lowerValue + upperValue) / 2;
}


/* ============================================================================
 * Alternativa para benchmarking: sort() in-place
 * ============================================================================
 */

/**
 * Calcula la misma mediana ordenando directamente el microarray.
 *
 * Aunque su complejidad asintótica es peor que Quickselect:
 *
 *   Tiempo:  O(n log n)
 *
 * para arreglos extremadamente pequeños (como los sensores actuales
 * de 6 y 8 microsensores), puede tener mejores factores constantes.
 *
 * También modifica el arreglo original y no realiza una copia previa.
 *
 * Esta función existe principalmente para poder comparar ambas
 * estrategias mediante benchmarks en la máquina virtual.
 */
export function sortMedian(values: Microsensor[]): number {
  const length = values.length;

  if (length === 0) {
    return Number.NaN;
  }

  values.sort((a, b) => a - b);

  const middle = Math.floor(length / 2);

  if ((length & 1) === 1) {
    return values[middle];
  }

  return (values[middle - 1] + values[middle]) / 2;
}


/* ============================================================================
 * Síntesis Macondiana
 * ============================================================================
 */

/**
 * Calcula el valor representativo de un Sensor Macondiano.
 *
 * Modelo:
 *
 * 1. Centro robusto:
 *
 *      c = mediana(microarray)
 *
 * 2. Radio Macondiano:
 *
 *      r = tolerance * |c|
 *
 * 3. Un valor xi es aceptado si:
 *
 *      |xi - c| <= r
 *
 * 4. Se calcula la media aritmética únicamente de los inliers.
 *
 *
 * IMPORTANTE:
 *
 * No usamos:
 *
 *   filter()
 *   slice()
 *   spread [...]
 *
 * porque crearían nuevos arrays.
 *
 * La suma y el conteo se realizan en el mismo recorrido.
 *
 *
 * Complejidad con quickselectMedian:
 *
 *   Mediana:              O(m) esperado
 *   Filtrado + promedio:  O(m)
 *   -----------------------------------
 *   Total:                O(m) esperado
 *
 * Espacio auxiliar:
 *
 *   O(1)
 *
 * donde m es la cantidad de microsensores del sensor.
 *
 *
 * medianStrategy es opcional para permitir cambiar fácilmente:
 *
 *   quickselectMedian
 *   sortMedian
 *
 * durante los benchmarks.
 */
export function synthesizeSensor(
  sensor: Sensor,
  tolerance: number = 0.10,
  medianStrategy: MedianStrategy = quickselectMedian
): SensorResult {
  const values = sensor.microarray;

  /*
   * Caso defensivo.
   * El protocolo normal no debería producir sensores sin microsensores.
   */
  if (values.length === 0) {
    return {
      id: sensor.id,
      value: Number.NaN,
    };
  }

  /*
   * La estrategia puede modificar values in-place.
   *
   * Esto no afecta el resultado porque, para la síntesis estadística,
   * únicamente importan los valores y no su posición original.
   */
  const center = medianStrategy(values);

  const radius = tolerance * Math.abs(center);

  let sum = 0;
  let inlierCount = 0;

  /*
   * Un único recorrido.
   *
   * No creamos un arreglo de inliers.
   */
  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (Math.abs(value - center) <= radius) {
      sum += value;
      inlierCount++;
    }
  }

  /*
   * La propia mediana normalmente garantiza al menos un inlier cuando
   * tolerance >= 0, pero conservamos esta defensa por robustez ante
   * estrategias de mediana alternativas o entradas anómalas.
   *
   * center es un fallback matemáticamente razonable porque representa
   * precisamente el centro robusto que utilizamos para el filtrado.
   */
  const synthesizedValue =
    inlierCount > 0
      ? sum / inlierCount
      : center;

  return {
    id: sensor.id,
    value: synthesizedValue,
  };
}


/* ============================================================================
 * Procesamiento del Batch
 * ============================================================================
 */

/**
 * Procesa todos los sensores de un Batch.
 *
 * No se presupone:
 *
 * - número fijo de sensores;
 * - número fijo de microsensores;
 * - modelo concreto de sensor.
 *
 *
 * Si:
 *
 *   mi = cantidad de microsensores del sensor i
 *
 * entonces, utilizando Quickselect:
 *
 *   T(batch) =
 *       O(m1) + O(m2) + ... + O(mN)
 *
 * por lo tanto:
 *
 *   T(batch) = O(M) esperado
 *
 * donde:
 *
 *   M = m1 + m2 + ... + mN
 *
 * es el número total de lecturas de microsensores del batch.
 *
 *
 * Espacio:
 *
 * La parte estadística utiliza O(1) auxiliar por sensor.
 *
 * Naturalmente debemos crear SensorResult[] porque constituye
 * precisamente la salida solicitada del procesamiento.
 */
export function processBatch(
  batch: Batch,
  tolerance: number = 0.10,
  medianStrategy: MedianStrategy = quickselectMedian
): ProcessedBatch {
  const sensorCount = batch.sensors.length;

  /*
   * Reservamos directamente el tamaño final.
   *
   * Evitamos push() y posibles redimensionamientos internos del array
   * de resultados.
   */
  const results = new Array<SensorResult>(sensorCount);

  for (let i = 0; i < sensorCount; i++) {
    results[i] = synthesizeSensor(
      batch.sensors[i],
      tolerance,
      medianStrategy
    );
  }

  return {
    batchNumber: batch.batchNumber,
    sensors: results,
  };
}