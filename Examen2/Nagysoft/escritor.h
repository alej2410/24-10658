#ifndef ESCRITOR_H
#define ESCRITOR_H

#include <vector>
#include <string>
#include "tipos.h"
#include "kmeans.h"

// Genera el archivo CSV con los puntos y su respectiva etiqueta
void generarClasificadosCSV(const std::string& nombreArchivo, 
                            const std::vector<Coord_3D>& datos, 
                            const std::vector<int>& asignaciones, 
                            const std::vector<Cluster>& clusters);

// Genera el archivo de resumen con centroides y dispersión
void generarSummaryTXT(const std::string& nombreArchivo, 
                       const std::vector<Coord_3D>& datos, 
                       const std::vector<int>& asignaciones, 
                       const std::vector<Cluster>& clusters);

#endif // ESCRITOR_H