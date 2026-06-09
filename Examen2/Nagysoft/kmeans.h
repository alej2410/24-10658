#ifndef KMEANS_H
#define KMEANS_H

#include "tipos.h"
#include <vector>

// El "Molde" para nuestros líderes (Centroides)
struct Cluster {
    Coord_3D centroide;
    char etiqueta; // 'A', 'B', 'C', etc.
};

// 1. Funciones de Distancia
double distancia_euclidiana(const Coord_3D& a, const Coord_3D& b);
double distancia_cuadrada(const Coord_3D& a, const Coord_3D& b);

// 2. Funciones de Lógica del Algoritmo
bool asignar_puntos(const std::vector<Coord_3D>& datos, 
                    const std::vector<Cluster>& clusters, 
                    std::vector<int>& asignaciones);

bool recalcular_centroides(const std::vector<Coord_3D>& datos, 
                           std::vector<Cluster>& clusters, 
                           const std::vector<int>& asignaciones);

// 3. Regla Estricta del Dr. Szilard: Condición de Parada Encapsulada
bool condicionDeParada(const std::vector<Cluster>& anteriores, 
                       const std::vector<Cluster>& actuales, 
                       int iteracion, 
                       int maxIteraciones, 
                       double tolerancia);

// 4. Medida de Dispersión (Para el archivo summary.txt)
double dispersion(const std::vector<Coord_3D>& datos, 
                  const Cluster& cluster, 
                  const std::vector<int>& asignaciones, 
                  int cluster_idx);

// 5. El Motor Principal
void ejecutar_kmeans(const std::vector<Coord_3D>& datos, 
                     int k, 
                     std::vector<Cluster>& clusters, 
                     std::vector<int>& asignaciones, 
                     int max_iter = 300, 
                     double tolerancia = 0.0001);

#endif