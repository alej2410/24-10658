// src/types.ts

// Una lectura individual producida por un microsensor.
// Actualmente es un number, pero el alias mantiene el modelo semántico explícito.
export type Microsensor = number;

// Sensor Macondiano.
// microarray tiene tamaño dinámico: el algoritmo nunca debe asumir 6, 8, etc.
export interface Sensor {
  id: string;
  microarray: Microsensor[];
}

// Lote completo correspondiente a un instante de muestreo.
export interface Batch {
  batchNumber: number;
  sensors: Sensor[];
}

// Resultado sintetizado de un único Sensor Macondiano.
export interface SensorResult {
  id: string;
  value: number;
}

// Resultado del procesamiento de todos los sensores de un lote.
export interface ProcessedBatch {
  batchNumber: number;
  sensors: SensorResult[];
}