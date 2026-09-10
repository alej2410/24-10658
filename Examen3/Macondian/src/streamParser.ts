import type {
  Batch,
  Microsensor,
  Sensor,
} from "./types";


export type BatchHandler =
  (batch: Batch) => void;


interface ActiveBatch {
  batchNumber: number;
  sensors: Sensor[];
}


interface ParsedSensorLine {
  // El primer número emitido por el Worker es el número del batch,
  // NO el índice del sensor.
  batchTag: number;

  sensor: Sensor;
}


const BATCH_HEADER =
  /^Batch\s+(\d+):$/;

const SENSOR_LINE =
  /^(\d+)\s+(\S+)\s+(\[.*\])$/;

const COMPLETION_MESSAGE =
  "Macondian completed!";


/**
 * Reconstruye objetos Batch desde el stream textual del Worker.
 *
 * Primer batch:
 *   se cierra cuando aparece "Batch N+1:".
 *
 * A partir de ahí:
 *   conocemos sensorCount y podemos cerrar cada batch
 *   inmediatamente al recibir esa cantidad de sensores.
 */
export class MacondianStreamParser {

  private activeBatch:
    ActiveBatch | null = null;


  /*
   * Se descubre a partir del primer batch.
   */
  private sensorCount:
    number | null = null;


  constructor(
    private readonly onBatch: BatchHandler
  ) {
  }


  /**
   * Recibe una línea individual del Worker.
   */
  pushLine(rawLine: string): void {

    const line =
      rawLine.trim();


    if (line.length === 0) {
      return;
    }


    // ================================================================
    // Nuevo Batch
    // ================================================================

    const headerMatch =
      BATCH_HEADER.exec(line);


    if (headerMatch !== null) {

      const batchNumber =
        Number(headerMatch[1]);

      this.startBatch(
        batchNumber
      );

      return;
    }


    // ================================================================
    // Fin de simulación
    // ================================================================

    if (
      line ===
      COMPLETION_MESSAGE
    ) {

      this.finishActiveBatch();

      return;
    }


    /*
     * Mensajes como:
     *
     * Macondian starting ...
     * Macondian accelerating ...
     *
     * llegan antes de que exista un Batch activo.
     */
    if (
      this.activeBatch === null
    ) {
      return;
    }


    // ================================================================
    // Intentar interpretar sensor
    // ================================================================

    const parsed =
      this.parseSensorLine(line);


    /*
     * Si no tiene formato de sensor,
     * simplemente es un mensaje informativo.
     */
    if (parsed === null) {
      return;
    }


    /*
     * IMPORTANTE:
     *
     * El Worker produce:
     *
     * Batch 1:
     * 1 Y1001 [ ... ]
     * 1 L1001 [ ... ]
     * 1 Y1002 [ ... ]
     *
     * Ese primer "1" NO es el índice del sensor.
     *
     * Es nuevamente el número del Batch.
     *
     * Por eso lo único que tiene sentido validar es que
     * coincida con el batch actualmente abierto.
     */
    if (
      parsed.batchTag !==
      this.activeBatch.batchNumber
    ) {

      throw new Error(
        `Sensor tagged as batch ${parsed.batchTag} ` +
        `while parsing batch ${this.activeBatch.batchNumber}.`
      );
    }


    /*
     * No suponemos absolutamente nada sobre:
     *
     * - posición del sensor;
     * - cantidad de sensores;
     * - tipo Y/L;
     * - cantidad de microsensores.
     */
    this.activeBatch
      .sensors
      .push(parsed.sensor);


    /*
     * Después del primer batch ya conocemos sensorCount.
     *
     * Por eso los siguientes batches se pueden emitir
     * inmediatamente.
     */
    if (
      this.sensorCount !== null &&
      this.activeBatch.sensors.length ===
        this.sensorCount
    ) {

      this.emitActiveBatch();
    }
  }


  /**
   * Reinicia completamente la máquina de estados.
   */
  reset(): void {

    this.activeBatch = null;

    this.sensorCount = null;
  }


  getSensorCount():
    number | null {

    return this.sensorCount;
  }


  // ==================================================================
  // Inicio de Batch
  // ==================================================================

  private startBatch(
    batchNumber: number
  ): void {

    /*
     * Si encontramos:
     *
     * Batch 2:
     *
     * mientras Batch 1 sigue abierto,
     * eso constituye el delimitador del Batch 1.
     */
    if (
      this.activeBatch !== null
    ) {

      this.finishActiveBatch();
    }


    this.activeBatch = {
      batchNumber,
      sensors: [],
    };
  }


  // ==================================================================
  // Finalización
  // ==================================================================

  private finishActiveBatch(): void {

    if (
      this.activeBatch === null
    ) {
      return;
    }


    const receivedCount =
      this.activeBatch.sensors.length;


    /*
     * Nunca emitir un Batch vacío.
     */
    if (
      receivedCount === 0
    ) {

      this.activeBatch = null;

      return;
    }


    /*
     * Primer Batch:
     *
     * ahora descubrimos cuántos sensores tiene
     * esta ejecución.
     */
    if (
      this.sensorCount === null
    ) {

      this.sensorCount =
        receivedCount;

    } else if (
      receivedCount !==
      this.sensorCount
    ) {

      throw new Error(
        `Incomplete batch ${this.activeBatch.batchNumber}: ` +
        `expected ${this.sensorCount} sensors, ` +
        `received ${receivedCount}.`
      );
    }


    this.emitActiveBatch();
  }


  // ==================================================================
  // Emisión
  // ==================================================================

  private emitActiveBatch(): void {

    if (
      this.activeBatch === null
    ) {
      return;
    }


    /*
     * No copiamos sensors.
     *
     * Transferimos directamente la referencia construida
     * por el parser.
     */
    const batch: Batch = {

      batchNumber:
        this.activeBatch.batchNumber,

      sensors:
        this.activeBatch.sensors,
    };


    /*
     * Liberamos nuestra referencia ANTES del callback.
     */
    this.activeBatch = null;


    this.onBatch(batch);
  }


  // ==================================================================
  // Parsing
  // ==================================================================

  private parseSensorLine(
    line: string
  ): ParsedSensorLine | null {

    /*
     * Formato REAL:
     *
     * 1 Y1001 [ 1.982,2.014,1.997,... ]
     *
     * Capturas:
     *
     * 1 -> número del Batch
     * 2 -> ID del sensor
     * 3 -> microarray
     */
    const match =
      SENSOR_LINE.exec(line);


    if (
      match === null
    ) {
      return null;
    }


    const batchTag =
      Number(match[1]);

    const id =
      match[2];


    /*
     * "[ ... ]" es JSON válido.
     */
    const parsedValues:
      unknown =
      JSON.parse(match[3]);


    if (
      !Array.isArray(parsedValues)
    ) {

      throw new Error(
        `Invalid microarray for sensor ${id}.`
      );
    }


    /*
     * Validación in-place:
     * no generamos otro array.
     */
    for (
      let i = 0;
      i < parsedValues.length;
      i++
    ) {

      const value =
        parsedValues[i];


      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) {

        throw new Error(
          `Invalid microsensor value for sensor ${id} ` +
          `at position ${i}.`
        );
      }
    }


    return {

      batchTag,

      sensor: {

        id,

        microarray:
          parsedValues as Microsensor[],
      },
    };
  }
}