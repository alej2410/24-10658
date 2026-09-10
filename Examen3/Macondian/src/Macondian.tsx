///
/// Macondian.tsx
///

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  FormEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

import type {
  Batch,
  ProcessedBatch,
  Sensor,
} from "./types";

import { MacondianStreamParser } from "./streamParser";

import {
  processBatch,
  quickselectMedian,
  sortMedian,
} from "./processing";

import type {
  MedianStrategy,
} from "./processing";

import Chart from "./Chart";
import CLI from "./CLI";
import Image from "./Image";
import List from "./List";
import Monitor from "./Monitor";
import ToolBar from "./ToolBar";

import "bootstrap/dist/css/bootstrap.min.css";


// ============================================================================
// Información del proyecto
// ============================================================================

const project = "ZenSheet™";
const artefact = "Macondian Simulator";
const version = "V-20260901";

const title = (
  <h3>
    The Great {artefact}
  </h3>
);

const product = (
  <em>
    <b>{artefact}</b>{" "}
    Interactive Computing Environment
  </em>
);

const copyright = (
  <>
    Copyright ©{" "}
    <b>Lakebolt™ Research</b>{" "}
    2024-2026
  </>
);


// ============================================================================
// Configuración
// ============================================================================

const MONITOR_SIZE = 1024;

const SYNTHESIS_TOLERANCE = 0.10;

/*
 * Estrategia utilizada por la simulación normal.
 *
 * Después del benchmark puedes cambiarla por sortMedian
 * si la medición en la VM demuestra que es más rápida.
 */
const MEDIAN_STRATEGY: MedianStrategy =
  quickselectMedian;

const COMPLETION_MESSAGE =
  "Macondian completed!";

const BATCH_HEADER =
  /^Batch\s+\d+:$/;


// ============================================================================
// Estadísticas de Tsynthesis
// ============================================================================

interface SynthesisStats {
  batchCount: number;
  totalMs: number;
  lastMs: number;
  minMs: number;
  maxMs: number;
}


const createEmptyStats =
  (): SynthesisStats => ({
    batchCount: 0,
    totalMs: 0,
    lastMs: 0,
    minMs: Number.POSITIVE_INFINITY,
    maxMs: 0,
  });


interface RuntimeViewState {
  rawLog: string[];
  processedBatches: ProcessedBatch[];
  benchmark: SynthesisStats;
}


// ============================================================================
// Worker
// ============================================================================

const createTGMRWorker = (): Worker => {

  return new Worker(
    new URL(
      "./Macondian/tgmr-thx-1138.js",
      import.meta.url
    )
  );
};


// ============================================================================
// Benchmark sintético
// ============================================================================

interface BenchmarkSummary {
  average: number;
  median: number;
  min: number;
  max: number;
}


/*
 * PRNG determinista.
 *
 * Hace que el benchmark genere los mismos datos
 * cada vez que ejecutamos .bench.
 */
const createBenchmarkRandom = (
  seed: number
) => {

  let state =
    seed >>> 0;

  return (): number => {

    state ^=
      state << 13;

    state ^=
      state >>> 17;

    state ^=
      state << 5;

    return (
      (state >>> 0) /
      4294967296
    );
  };
};


/**
 * Crea un batch sintético masivo.
 *
 * Alternamos:
 *
 * Sensor 0 -> 6 microsensores
 * Sensor 1 -> 8 microsensores
 * Sensor 2 -> 6 microsensores
 * Sensor 3 -> 8 microsensores
 * ...
 *
 * La generación NO forma parte del tiempo medido.
 */
const createSyntheticBatch = (
  sensorCount: number
): Batch => {

  const random =
    createBenchmarkRandom(
      0x12345678
    );

  const sensors =
    new Array<Sensor>(
      sensorCount
    );

  for (
    let i = 0;
    i < sensorCount;
    i++
  ) {

    const microCount =
      (i & 1) === 0
        ? 6
        : 8;

    const microarray =
      new Array<number>(
        microCount
      );

    /*
     * Valor central similar al rango del
     * simulador Macondiano.
     */
    const center =
      1.75 +
      random() * 0.50;

    for (
      let j = 0;
      j < microCount;
      j++
    ) {

      /*
       * Ruido normal del sensor.
       */
      let value =
        center +
        (
          random() - 0.5
        ) * 0.25;

      /*
       * Algunos outliers artificiales.
       */
      if (
        random() < 0.03
      ) {

        value +=
          random() < 0.5
            ? -0.8
            : 0.8;
      }

      microarray[j] =
        value;
    }

    sensors[i] = {
      id: `S${i + 1}`,
      microarray,
    };
  }

  return {
    batchNumber: 1,
    sensors,
  };
};


/**
 * Quickselect y sortMedian modifican el microarray.
 *
 * Por eso ambos algoritmos necesitan trabajar sobre
 * una copia independiente del mismo dataset.
 *
 * Esta copia se realiza ANTES de performance.now().
 */
const cloneBenchmarkBatch = (
  source: Batch
): Batch => {

  const sensors =
    new Array<Sensor>(
      source.sensors.length
    );

  for (
    let i = 0;
    i < source.sensors.length;
    i++
  ) {

    const sourceSensor =
      source.sensors[i];

    sensors[i] = {

      id:
        sourceSensor.id,

      microarray:
        sourceSensor
          .microarray
          .slice(),
    };
  }

  return {
    batchNumber:
      source.batchNumber,

    sensors,
  };
};


/**
 * Mide únicamente processBatch().
 *
 * La clonación queda FUERA del cronómetro.
 */
const benchmarkStrategy = (
  source: Batch,
  strategy: MedianStrategy
): number => {

  const workingBatch =
    cloneBenchmarkBatch(
      source
    );

  const start =
    performance.now();

  processBatch(
    workingBatch,
    SYNTHESIS_TOLERANCE,
    strategy
  );

  const end =
    performance.now();

  return end - start;
};


const summarizeBenchmark = (
  times: number[]
): BenchmarkSummary => {

  let total = 0;

  let min =
    Number.POSITIVE_INFINITY;

  let max =
    Number.NEGATIVE_INFINITY;

  for (
    let i = 0;
    i < times.length;
    i++
  ) {

    const time =
      times[i];

    total += time;

    if (time < min) {
      min = time;
    }

    if (time > max) {
      max = time;
    }
  }

  /*
   * Esto ocurre fuera de cualquier medición.
   */
  const ordered =
    times
      .slice()
      .sort(
        (a, b) =>
          a - b
      );

  const middle =
    Math.floor(
      ordered.length / 2
    );

  const median =
    (ordered.length & 1) === 1
      ? ordered[middle]
      : (
          ordered[middle - 1] +
          ordered[middle]
        ) / 2;

  return {
    average:
      total / times.length,

    median,

    min,

    max,
  };
};


// ============================================================================
// Componente principal
// ============================================================================

const Macondian = () => {

  // ==========================================================================
  // CLI
  // ==========================================================================

  const command =
    useRef<HTMLInputElement>(
      null
    );


  // ==========================================================================
  // Estado visible
  // ==========================================================================

  const [
    runtimeView,
    setRuntimeView,
  ] =
    useState<RuntimeViewState>({
      rawLog: [],
      processedBatches: [],
      benchmark:
        createEmptyStats(),
    });


  /*
   * Resultado de:
   *
   * .bench
   */
  const [
    comparisonBenchmarkLog,
    setComparisonBenchmarkLog,
  ] =
    useState<string[]>([]);


  // ==========================================================================
  // Buffers fuera de React
  // ==========================================================================

  const rawPendingRef =
    useRef<string[]>([]);

  const rawHistoryRef =
    useRef<string[]>([]);

  const processedBatchesRef =
    useRef<ProcessedBatch[]>([]);

  const benchmarkStatsRef =
    useRef<SynthesisStats>(
      createEmptyStats()
    );


  // ==========================================================================
  // Parser / Worker
  // ==========================================================================

  const parserRef =
    useRef<MacondianStreamParser | null>(
      null
    );

  const workerRef =
    useRef<Worker | null>(
      null
    );

  const runningRef =
    useRef(false);


  // ==========================================================================
  // UI
  // ==========================================================================

  const [ux, setUX] =
    useState(0);

  const [error, setError] =
    useState("");

  const [leftPct, setLeftPct] =
    useState(50);

  const splitRef =
    useRef<HTMLDivElement>(
      null
    );

  const dragging =
    useRef(false);


  /*
   * Evita que la imagen cambie aleatoriamente
   * en cada render de React.
   */
  const randomImageRef =
    useRef(
      Math.random() < 0.5
        ? "ART042.jpg"
        : "ART067.png"
    );


  const uxColor = (
    mode: number
  ) => {

    return mode === ux
      ? "Yellow"
      : "Gray";
  };


  // ==========================================================================
  // Split pane
  // ==========================================================================

  useEffect(() => {

    const onMove = (
      event: MouseEvent
    ) => {

      if (
        !dragging.current ||
        !splitRef.current
      ) {
        return;
      }

      const rect =
        splitRef
          .current
          .getBoundingClientRect();

      const pct =
        (
          (
            event.clientX -
            rect.left
          ) /
          rect.width
        ) * 100;

      setLeftPct(
        Math.min(
          80,
          Math.max(
            20,
            pct
          )
        )
      );
    };


    const onUp = () => {

      dragging.current =
        false;

      document.body
        .style
        .userSelect = "";

      document.body
        .style
        .cursor = "";
    };


    window.addEventListener(
      "mousemove",
      onMove
    );

    window.addEventListener(
      "mouseup",
      onUp
    );


    return () => {

      window.removeEventListener(
        "mousemove",
        onMove
      );

      window.removeEventListener(
        "mouseup",
        onUp
      );
    };

  }, []);


  const startDrag = (
    event: ReactMouseEvent
  ) => {

    event.preventDefault();

    dragging.current =
      true;

    document.body
      .style
      .userSelect = "none";

    document.body
      .style
      .cursor = "col-resize";
  };


  // ==========================================================================
  // Raw log
  // ==========================================================================

  const flushPendingRaw =
    useCallback(() => {

      const pending =
        rawPendingRef.current;

      if (
        pending.length === 0
      ) {
        return;
      }

      const history =
        rawHistoryRef.current;

      for (
        let i = 0;
        i < pending.length;
        i++
      ) {

        history.push(
          pending[i]
        );
      }

      /*
       * Vaciar sin crear otro array.
       */
      pending.length = 0;

      const overflow =
        history.length -
        MONITOR_SIZE;

      if (
        overflow > 0
      ) {

        history.splice(
          0,
          overflow
        );
      }

    }, []);


  // ==========================================================================
  // React snapshot
  // ==========================================================================

  const publishRuntimeView =
    useCallback(() => {

      /*
       * Estas copias quedan fuera de Tsynthesis.
       */
      setRuntimeView({

        rawLog:
          rawHistoryRef
            .current
            .slice(),

        processedBatches:
          processedBatchesRef
            .current
            .slice(),

        benchmark: {
          ...benchmarkStatsRef.current,
        },
      });

    }, []);


  // ==========================================================================
  // Batch completo
  // ==========================================================================

  const handleCompletedBatch =
    useCallback(
      (
        batch: Batch
      ): void => {

        /*
         * ==============================================================
         * Tsynthesis START
         * ==============================================================
         */

        const startTime =
          performance.now();

        const processed =
          processBatch(
            batch,
            SYNTHESIS_TOLERANCE,
            MEDIAN_STRATEGY
          );

        const endTime =
          performance.now();

        /*
         * ==============================================================
         * Tsynthesis END
         * ==============================================================
         */

        const elapsedMs =
          endTime -
          startTime;


        /*
         * Todo desde aquí está fuera del benchmark.
         */
        const stats =
          benchmarkStatsRef.current;

        stats.batchCount++;

        stats.totalMs +=
          elapsedMs;

        stats.lastMs =
          elapsedMs;

        if (
          elapsedMs <
          stats.minMs
        ) {

          stats.minMs =
            elapsedMs;
        }

        if (
          elapsedMs >
          stats.maxMs
        ) {

          stats.maxMs =
            elapsedMs;
        }


        processedBatchesRef
          .current
          .push(
            processed
          );

        flushPendingRaw();

        /*
         * Un render por batch.
         */
        publishRuntimeView();

      },
      [
        flushPendingRaw,
        publishRuntimeView,
      ]
    );


  // ==========================================================================
  // Mensajes Worker
  // ==========================================================================

  const handleWorkerMessage =
    useCallback(
      (
        envelope:
          MessageEvent<unknown>
      ): void => {

        const data =
          envelope.data;

        if (
          typeof data !== "string" ||
          data.length === 0
        ) {

          runningRef.current =
            false;

          setError(
            "ERROR: TGMR Worker returned invalid data."
          );

          workerRef.current
            ?.terminate();

          workerRef.current =
            null;

          return;
        }


        const line =
          data.trim();

        const parser =
          parserRef.current;

        if (
          parser === null
        ) {
          return;
        }


        try {

          /*
           * El encabezado del siguiente batch puede
           * cerrar el batch anterior.
           */
          if (
            BATCH_HEADER.test(
              line
            )
          ) {

            parser.pushLine(
              line
            );

            rawPendingRef
              .current
              .push(
                line
              );

          } else {

            /*
             * Primero registramos la línea.
             *
             * parser.pushLine() puede emitir el batch
             * inmediatamente si esta es la última lectura.
             */
            rawPendingRef
              .current
              .push(
                line
              );

            parser.pushLine(
              line
            );
          }


          if (
            line ===
            COMPLETION_MESSAGE
          ) {

            runningRef.current =
              false;

            /*
             * Publicar el mensaje final si quedó pendiente.
             */
            if (
              rawPendingRef
                .current
                .length > 0
            ) {

              flushPendingRaw();

              publishRuntimeView();
            }
          }

        } catch (
          cause: unknown
        ) {

          runningRef.current =
            false;

          const message =
            cause instanceof Error
              ? cause.message
              : String(cause);

          setError(
            `Stream error: ${message}`
          );

          workerRef.current
            ?.terminate();

          workerRef.current =
            null;
        }

      },
      [
        flushPendingRaw,
        publishRuntimeView,
      ]
    );


  // ==========================================================================
  // Crear Worker
  // ==========================================================================

  const createAndBindWorker =
    useCallback((): Worker => {

      const worker =
        createTGMRWorker();


      worker.onmessage = (
        event:
          MessageEvent<unknown>
      ) => {

        /*
         * Ignorar mensajes de Workers viejos.
         */
        if (
          workerRef.current !==
          worker
        ) {
          return;
        }

        handleWorkerMessage(
          event
        );
      };


      worker.onerror = (
        event:
          ErrorEvent
      ) => {

        if (
          workerRef.current !==
          worker
        ) {
          return;
        }

        runningRef.current =
          false;

        setError(
          `TGMR Worker error: ${event.message}`
        );

        worker.terminate();

        workerRef.current =
          null;
      };


      workerRef.current =
        worker;

      return worker;

    }, [
      handleWorkerMessage,
    ]);


  // ==========================================================================
  // Inicialización
  // ==========================================================================

  useEffect(() => {

    parserRef.current =
      new MacondianStreamParser(
        handleCompletedBatch
      );

    createAndBindWorker();


    return () => {

      workerRef.current
        ?.terminate();

      workerRef.current =
        null;

      parserRef.current =
        null;

      runningRef.current =
        false;
    };

  }, [
    createAndBindWorker,
    handleCompletedBatch,
  ]);


  // ==========================================================================
  // Limpiar datos de una corrida
  // ==========================================================================

  const clearRunData = () => {

    rawPendingRef.current.length =
      0;

    rawHistoryRef.current.length =
      0;

    processedBatchesRef.current.length =
      0;

    benchmarkStatsRef.current =
      createEmptyStats();

    setComparisonBenchmarkLog(
      []
    );

    setRuntimeView({
      rawLog: [],
      processedBatches: [],
      benchmark:
        createEmptyStats(),
    });
  };


  // ==========================================================================
  // Start
  // ==========================================================================

  const start = () => {

    if (
      runningRef.current
    ) {

      setError(
        "Macondian is already running."
      );

      return;
    }


    const worker =
      workerRef.current;

    const parser =
      parserRef.current;


    if (
      worker === null ||
      parser === null
    ) {

      setError(
        "Macondian Worker is not available. Use Reset."
      );

      return;
    }


    /*
     * Cada Start representa una corrida independiente.
     *
     * No mezclar Batch 1 de una corrida con Batch 1
     * de una ejecución anterior.
     */
    clearRunData();

    parser.reset();

    setError("");

    runningRef.current =
      true;

    worker.postMessage(
      ".start"
    );
  };


  // ==========================================================================
  // Reset
  // ==========================================================================

  const reset = () => {

    /*
     * El Worker NO conoce ".reset".
     *
     * terminate() cancela realmente sus timers.
     */
    runningRef.current =
      false;

    workerRef.current
      ?.terminate();

    workerRef.current =
      null;


    parserRef.current
      ?.reset();


    clearRunData();

    setError("");


    /*
     * Crear una VM nueva y limpia.
     */
    createAndBindWorker();
  };


  // ==========================================================================
  // Benchmark Quickselect vs sort
  // ==========================================================================

  const bench = () => {

    /*
     * No competir por CPU contra la simulación.
     */
    if (
      runningRef.current
    ) {

      setError(
        "Reset or wait for the simulation to finish before running .bench."
      );

      return;
    }


    setError("");


    const SENSOR_COUNT =
      100_000;

    const TRIALS =
      7;


    /*
     * Batch maestro.
     *
     * Nunca se modifica directamente.
     */
    const source =
      createSyntheticBatch(
        SENSOR_COUNT
      );


    // ========================================================================
    // Warm-up JIT
    // ========================================================================

    /*
     * Utilizamos una muestra menor.
     *
     * Estos tiempos se descartan.
     */
    const warmupSource: Batch = {

      batchNumber: 0,

      sensors:
        source
          .sensors
          .slice(
            0,
            5_000
          ),
    };


    benchmarkStrategy(
      warmupSource,
      quickselectMedian
    );

    benchmarkStrategy(
      warmupSource,
      sortMedian
    );


    // ========================================================================
    // Trials
    // ========================================================================

    const quickselectTimes:
      number[] = [];

    const sortTimes:
      number[] = [];


    /*
     * Alternamos el orden para disminuir sesgos
     * por JIT, caché, temperatura del CPU, etc.
     */
    for (
      let trial = 0;
      trial < TRIALS;
      trial++
    ) {

      if (
        (trial & 1) === 0
      ) {

        quickselectTimes.push(
          benchmarkStrategy(
            source,
            quickselectMedian
          )
        );

        sortTimes.push(
          benchmarkStrategy(
            source,
            sortMedian
          )
        );

      } else {

        sortTimes.push(
          benchmarkStrategy(
            source,
            sortMedian
          )
        );

        quickselectTimes.push(
          benchmarkStrategy(
            source,
            quickselectMedian
          )
        );
      }
    }


    // ========================================================================
    // Resumen
    // ========================================================================

    const quick =
      summarizeBenchmark(
        quickselectTimes
      );

    const sort =
      summarizeBenchmark(
        sortTimes
      );


    /*
     * Para decidir ganador usamos la mediana de trials.
     *
     * Es algo más resistente a una pausa aislada
     * provocada por GC o por el sistema operativo.
     */
    const sortWon =
      sort.median <
      quick.median;


    const winner =
      sortWon
        ? "sortMedian"
        : "quickselectMedian";


    const faster =
      Math.min(
        sort.median,
        quick.median
      );

    const slower =
      Math.max(
        sort.median,
        quick.median
      );


    const ratio =
      faster > 0
        ? slower / faster
        : Number.POSITIVE_INFINITY;


    const totalMicrosensors =
      (SENSOR_COUNT / 2) * 6 +
      (SENSOR_COUNT / 2) * 8;


    setComparisonBenchmarkLog([

      "==========================================",
      " QUICKSELECT vs SORT",
      "==========================================",

      "",

      `Sensors           : ${SENSOR_COUNT.toLocaleString()}`,

      `Microsensors      : ${totalMicrosensors.toLocaleString()}`,

      "Sensor sizes      : 6 / 8 alternating",

      `Trials            : ${TRIALS}`,

      `Tolerance         : ${SYNTHESIS_TOLERANCE * 100}%`,

      "",

      "Generation        : NOT TIMED",
      "Dataset cloning   : NOT TIMED",
      "React rendering   : NOT TIMED",
      "Warm-up           : NOT RECORDED",

      "",

      "--- quickselectMedian ---",

      `Average : ${quick.average.toFixed(3)} ms`,

      `Median  : ${quick.median.toFixed(3)} ms`,

      `Minimum : ${quick.min.toFixed(3)} ms`,

      `Maximum : ${quick.max.toFixed(3)} ms`,

      "",

      "--- sortMedian ---",

      `Average : ${sort.average.toFixed(3)} ms`,

      `Median  : ${sort.median.toFixed(3)} ms`,

      `Minimum : ${sort.min.toFixed(3)} ms`,

      `Maximum : ${sort.max.toFixed(3)} ms`,

      "",

      `WINNER: ${winner}`,

      `Speed ratio: ${ratio.toFixed(3)}x`,

      "",

      sortWon
        ? (
          "Conclusion: sortMedian is faster for the current " +
          "6/8-element sensor arrays despite its O(m log m) complexity."
        )
        : (
          "Conclusion: quickselectMedian is faster on this runtime " +
          "for the tested sensor arrays."
        ),

      "",

      "Big-O describes asymptotic growth; the VM benchmark determines",
      "which implementation is actually faster for this concrete workload.",

      "==========================================",
    ]);


    /*
     * Mostrar automáticamente el resultado.
     */
    setUX(1);
  };


  // ==========================================================================
  // CLI
  // ==========================================================================

  const nop = () => {
  };


  const kvp = [

    {
      key: ".start",
      fun: start,
    },

    {
      key: ".reset",
      fun: reset,
    },

    {
      key: ".bench",
      fun: bench,
    },
  ];


  const map = (
    key: string
  ) => {

    for (
      const element of kvp
    ) {

      if (
        key ===
        element.key
      ) {

        return element.fun;
      }
    }

    return nop;
  };


  const cliRequest = (
    event:
      FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    if (
      command.current
    ) {

      const request =
        command.current
          .value
          .trim();

      command.current.value =
        "";

      map(request)();
    }
  };


  // ==========================================================================
  // Serie sintetizada
  // ==========================================================================

  const seriesLog =
    useMemo(() => {

      return runtimeView
        .processedBatches
        .map(
          batch => {

            const sensors =
              batch
                .sensors
                .map(
                  sensor =>
                    `${sensor.id}=${sensor.value.toFixed(6)}`
                )
                .join(" | ");

            return (
              `Batch ${batch.batchNumber}: ${sensors}`
            );
          }
        );

    }, [
      runtimeView.processedBatches,
    ]);


  // ==========================================================================
  // Benchmark normal Tsynthesis
  // ==========================================================================

  const benchmarkLog =
    useMemo(() => {

      const stats =
        runtimeView.benchmark;


      if (
        stats.batchCount === 0
      ) {

        return [
          "Tsynthesis: waiting for batches..."
        ];
      }


      const average =
        stats.totalMs /
        stats.batchCount;


      return [

        "=== Tsynthesis ===",

        `Batches processed : ${stats.batchCount}`,

        `Last batch        : ${stats.lastMs.toFixed(6)} ms`,

        `Average           : ${average.toFixed(6)} ms`,

        `Minimum           : ${stats.minMs.toFixed(6)} ms`,

        `Maximum           : ${stats.maxMs.toFixed(6)} ms`,

        `Total             : ${stats.totalMs.toFixed(6)} ms`,
      ];

    }, [
      runtimeView.benchmark,
    ]);


  // ==========================================================================
  // Monitor Test
  // ==========================================================================

  const testLog =
    useMemo(
      () => [

        ...benchmarkLog,

        "",

        ...comparisonBenchmarkLog,

        "",

        ...seriesLog,
      ],
      [
        benchmarkLog,
        comparisonBenchmarkLog,
        seriesLog,
      ]
    );


  // ==========================================================================
  // Views
  // ==========================================================================

  const rawView = (

    <div
      className="app-split"
      ref={splitRef}
    >

      <section
        className="app-pane"
        data-bs-theme="dark"
        style={{
          flexGrow:
            leftPct,
        }}
      >

        <Monitor
          title="señal cruda"
          log={
            runtimeView.rawLog
          }
        />

      </section>


      <div
        className="pane-divider"
        onMouseDown={
          startDrag
        }
        title="Drag to resize"
      />


      <section
        className="app-pane"
        style={{
          flexGrow:
            100 - leftPct,
        }}
      >

        <Image
          image="MAC997.jpg"
        />

      </section>

    </div>
  );


  const testView = (

    <div
      className="app-split"
      ref={splitRef}
    >

      <section
        className="app-pane"
        data-bs-theme="dark"
        style={{
          flexGrow:
            leftPct,
        }}
      >

        <Monitor
          title="señal cruda"
          log={
            runtimeView.rawLog
          }
        />

      </section>


      <div
        className="pane-divider"
        onMouseDown={
          startDrag
        }
        title="Drag to resize"
      />


      <section
        className="app-pane"
        style={{
          flexGrow:
            100 - leftPct,
        }}
      >

        <Monitor
          title="serie / benchmark"
          log={
            testLog
          }
        />

      </section>

    </div>
  );


  const chartView = (

    <div
      className="app-split"
      ref={splitRef}
    >

      <section
        className="app-pane"
        data-bs-theme="dark"
        style={{
          flexGrow:
            leftPct,
        }}
      >

        <Monitor
          title="señal cruda"
          log={
            runtimeView.rawLog
          }
        />

      </section>


      <div
        className="pane-divider"
        onMouseDown={
          startDrag
        }
        title="Drag to resize"
      />


      <section
        className="app-pane"
        style={{
          flexGrow:
            100 - leftPct,
        }}
      >

        {/*
         * CAMBIO IMPORTANTE:
         *
         * Antes:
         *
         * data={[]}
         *
         * Ahora pasamos los batches procesados reales.
         */}
        <Chart
          data={
            runtimeView
              .processedBatches
          }
        />

      </section>

    </div>
  );


  const imageView = (

    <Image
      image={
        randomImageRef.current
      }
    />
  );


  const listView = (
    <List />
  );


  const views = [
    rawView,
    testView,
    chartView,
    imageView,
    listView,
  ];


  // ==========================================================================
  // Render
  // ==========================================================================

  return (

    <div className="app-shell">

      <header className="app-header">
        {title}
      </header>


      <ToolBar
        start={start}
        reset={reset}
        uxColor={uxColor}
        setUX={setUX}
        error={error}
      />


      <main className="app-main">
        {views[ux]}
      </main>


      <CLI
        req={cliRequest}
        ref={command}
      />


      <footer className="app-footer">

        <h6>

          <b>
            {project}
          </b>

          {" "}Project:{" "}

          {product}

          {" "}

          {version}

          {" - "}

          {copyright}

        </h6>

      </footer>

    </div>
  );
};


export default Macondian;