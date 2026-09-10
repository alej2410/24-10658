///
/// Chart.tsx
///

import {
  useMemo,
} from "react";

import type {
  ProcessedBatch,
} from "./types";


interface Props {
  data: ProcessedBatch[];
}


interface Point {
  batchNumber: number;
  value: number;
}


interface SensorSeries {
  id: string;
  points: Point[];
  color: string;
}


// ============================================================================
// Dimensiones del SVG
// ============================================================================

const WIDTH = 1000;
const HEIGHT = 520;

const MARGIN_LEFT = 80;
const MARGIN_RIGHT = 30;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 70;

const PLOT_WIDTH =
  WIDTH -
  MARGIN_LEFT -
  MARGIN_RIGHT;

const PLOT_HEIGHT =
  HEIGHT -
  MARGIN_TOP -
  MARGIN_BOTTOM;


// ============================================================================
// Helpers
// ============================================================================

/*
 * Genera colores diferentes sin mantener una tabla fija.
 *
 * Funciona para una cantidad dinámica de sensores.
 */
const sensorColor = (
  index: number
): string => {

  const hue =
    (index * 137.508) % 360;

  return `hsl(${hue}, 70%, 42%)`;
};


const Chart = ({
  data,
}: Props) => {


  // ==========================================================================
  // Construir una serie por ID de sensor
  // ==========================================================================

  const series =
    useMemo<SensorSeries[]>(() => {

      const sensorMap =
        new Map<
          string,
          Point[]
        >();


      for (
        let batchIndex = 0;
        batchIndex < data.length;
        batchIndex++
      ) {

        const batch =
          data[batchIndex];


        for (
          let sensorIndex = 0;
          sensorIndex <
            batch.sensors.length;
          sensorIndex++
        ) {

          const sensor =
            batch.sensors[sensorIndex];


          let points =
            sensorMap.get(sensor.id);


          if (!points) {

            points = [];

            sensorMap.set(
              sensor.id,
              points
            );
          }


          points.push({

            batchNumber:
              batch.batchNumber,

            value:
              sensor.value,
          });
        }
      }


      const result:
        SensorSeries[] = [];


      let index = 0;


      for (
        const [id, points]
        of sensorMap
      ) {

        result.push({
          id,
          points,
          color:
            sensorColor(index),
        });

        index++;
      }


      return result;

    }, [data]);


  // ==========================================================================
  // Determinar rango Y
  // ==========================================================================

  const bounds =
    useMemo(() => {

      let minY =
        Number.POSITIVE_INFINITY;

      let maxY =
        Number.NEGATIVE_INFINITY;

      let minBatch =
        Number.POSITIVE_INFINITY;

      let maxBatch =
        Number.NEGATIVE_INFINITY;


      for (
        let i = 0;
        i < series.length;
        i++
      ) {

        const points =
          series[i].points;


        for (
          let j = 0;
          j < points.length;
          j++
        ) {

          const point =
            points[j];


          if (
            point.value < minY
          ) {
            minY = point.value;
          }

          if (
            point.value > maxY
          ) {
            maxY = point.value;
          }

          if (
            point.batchNumber <
            minBatch
          ) {
            minBatch =
              point.batchNumber;
          }

          if (
            point.batchNumber >
            maxBatch
          ) {
            maxBatch =
              point.batchNumber;
          }
        }
      }


      if (
        !Number.isFinite(minY)
      ) {

        return {
          minY: 0,
          maxY: 1,
          minBatch: 1,
          maxBatch: 1,
        };
      }


      /*
       * Agregar margen vertical para que las líneas
       * no toquen los bordes.
       */
      let range =
        maxY - minY;


      if (
        range === 0
      ) {

        range =
          Math.abs(minY) * 0.1;

        if (
          range === 0
        ) {
          range = 1;
        }
      }


      const padding =
        range * 0.10;


      return {

        minY:
          minY - padding,

        maxY:
          maxY + padding,

        minBatch,

        maxBatch,
      };

    }, [series]);


  // ==========================================================================
  // Sin información
  // ==========================================================================

  if (
    data.length === 0 ||
    series.length === 0
  ) {

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <h3>
          Waiting for processed batches...
        </h3>
      </div>
    );
  }


  // ==========================================================================
  // Escalas
  // ==========================================================================

  const yRange =
    bounds.maxY -
    bounds.minY;


  const batchRange =
    bounds.maxBatch -
    bounds.minBatch;


  const scaleX = (
    batchNumber: number
  ): number => {

    /*
     * Si solo tenemos un batch,
     * colocarlo en el centro.
     */
    if (
      batchRange === 0
    ) {

      return (
        MARGIN_LEFT +
        PLOT_WIDTH / 2
      );
    }


    return (
      MARGIN_LEFT +
      (
        (
          batchNumber -
          bounds.minBatch
        ) /
        batchRange
      ) *
      PLOT_WIDTH
    );
  };


  const scaleY = (
    value: number
  ): number => {

    return (
      MARGIN_TOP +
      (
        1 -
        (
          (
            value -
            bounds.minY
          ) /
          yRange
        )
      ) *
      PLOT_HEIGHT
    );
  };


  // ==========================================================================
  // Eje Y
  // ==========================================================================

  const Y_TICKS = 5;

  const yTicks =
    new Array(Y_TICKS + 1);


  for (
    let i = 0;
    i <= Y_TICKS;
    i++
  ) {

    const ratio =
      i / Y_TICKS;

    const value =
      bounds.minY +
      ratio * yRange;


    yTicks[i] = {
      value,
      y: scaleY(value),
    };
  }


  // ==========================================================================
  // Eje X
  // ==========================================================================

  const batchNumbers =
    data.map(
      batch =>
        batch.batchNumber
    );


  // ==========================================================================
  // Render
  // ==========================================================================

  return (

    <div className="chart-container">

    <svg
      className="chart-svg"
      viewBox={
        `0 0 ${WIDTH} ${HEIGHT}`
      }
      preserveAspectRatio="xMidYMid meet"
    >

        {/* ================================================================
            Grid horizontal + etiquetas Y
           ================================================================ */}

        {
          yTicks.map(
            (tick, index) => (

              <g
                key={
                  `y-${index}`
                }
              >

                <line
                  x1={MARGIN_LEFT}
                  y1={tick.y}
                  x2={
                    WIDTH -
                    MARGIN_RIGHT
                  }
                  y2={tick.y}
                  stroke="#dddddd"
                  strokeWidth="1"
                />

                <text
                  x={
                    MARGIN_LEFT - 10
                  }
                  y={
                    tick.y + 5
                  }
                  textAnchor="end"
                  fontSize="13"
                >
                  {
                    tick.value
                      .toFixed(3)
                  }
                </text>

              </g>
            )
          )
        }


        {/* ================================================================
            Eje Y
           ================================================================ */}

        <line
          x1={MARGIN_LEFT}
          y1={MARGIN_TOP}
          x2={MARGIN_LEFT}
          y2={
            MARGIN_TOP +
            PLOT_HEIGHT
          }
          stroke="black"
          strokeWidth="2"
        />


        {/* ================================================================
            Eje X
           ================================================================ */}

        <line
          x1={MARGIN_LEFT}
          y1={
            MARGIN_TOP +
            PLOT_HEIGHT
          }
          x2={
            WIDTH -
            MARGIN_RIGHT
          }
          y2={
            MARGIN_TOP +
            PLOT_HEIGHT
          }
          stroke="black"
          strokeWidth="2"
        />


        {/* ================================================================
            Batches en X
           ================================================================ */}

        {
          batchNumbers.map(
            (
              batchNumber,
              index
            ) => {

              /*
               * Si en algún momento hay cientos de batches,
               * evitamos dibujar cientos de etiquetas superpuestas.
               */
              const step =
                Math.max(
                  1,
                  Math.ceil(
                    batchNumbers.length /
                    12
                  )
                );


              if (
                index % step !== 0 &&
                index !==
                  batchNumbers.length - 1
              ) {

                return null;
              }


              const x =
                scaleX(batchNumber);


              return (

                <g
                  key={
                    `x-${index}`
                  }
                >

                  <line
                    x1={x}
                    y1={
                      MARGIN_TOP +
                      PLOT_HEIGHT
                    }
                    x2={x}
                    y2={
                      MARGIN_TOP +
                      PLOT_HEIGHT +
                      6
                    }
                    stroke="black"
                  />


                  <text
                    x={x}
                    y={
                      MARGIN_TOP +
                      PLOT_HEIGHT +
                      25
                    }
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {
                      batchNumber
                    }
                  </text>

                </g>
              );
            }
          )
        }


        {/* ================================================================
            Una polyline por sensor
           ================================================================ */}

        {
          series.map(
            sensorSeries => {

              const pointsString =
                sensorSeries
                  .points
                  .map(
                    point =>
                      `${scaleX(point.batchNumber)},${scaleY(point.value)}`
                  )
                  .join(" ");


              return (

                <g
                  key={
                    sensorSeries.id
                  }
                >

                  <polyline
                    points={
                      pointsString
                    }
                    fill="none"
                    stroke={
                      sensorSeries.color
                    }
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />


                  {
                    /*
                     * Para cantidades normales de batches mostramos
                     * puntos individuales y tooltip.
                     */
                    sensorSeries
                      .points
                      .length <= 100 &&
                    sensorSeries
                      .points
                      .map(
                        point => (

                          <circle
                            key={
                              `${sensorSeries.id}-${point.batchNumber}`
                            }
                            cx={
                              scaleX(
                                point.batchNumber
                              )
                            }
                            cy={
                              scaleY(
                                point.value
                              )
                            }
                            r="3.5"
                            fill={
                              sensorSeries.color
                            }
                          >

                            <title>
                              {
                                `${sensorSeries.id} | ` +
                                `Batch ${point.batchNumber} | ` +
                                `${point.value.toFixed(6)}`
                              }
                            </title>

                          </circle>
                        )
                      )
                  }

                </g>
              );
            }
          )
        }


        {/* ================================================================
            Nombre eje X
           ================================================================ */}

        <text
          x={
            MARGIN_LEFT +
            PLOT_WIDTH / 2
          }
          y={
            HEIGHT - 10
          }
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
        >
          Batch
        </text>

      </svg>


      {/* ==================================================================
          Leyenda
         ================================================================== */}

      <div className="chart-legend">

        {
          series.map(
            sensorSeries => (

              <div
                key={
                  sensorSeries.id
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >

                <span
                  style={{
                    display: "inline-block",
                    width: "18px",
                    height: "4px",
                    backgroundColor:
                      sensorSeries.color,
                  }}
                />

                <span>
                  {
                    sensorSeries.id
                  }
                </span>

              </div>
            )
          )
        }

      </div>

    </div>
  );
};


export default Chart;