#include "kmeans.h"
#include <cmath>
#include <limits>
#include <iostream>
#include <random>

// =========================================================
// 1. DISTANCIAS
// =========================================================
double distancia_euclidiana(const Coord_3D& a, const Coord_3D& b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    double dz = a.z - b.z;
    return std::sqrt(dx*dx + dy*dy + dz*dz);
}

// Usamos distancia al cuadrado para comparar (sin sqrt) por optimización de CPU
double distancia_cuadrada(const Coord_3D& a, const Coord_3D& b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    double dz = a.z - b.z;
    return dx*dx + dy*dy + dz*dz;
}

// =========================================================
// 2. ASIGNACIÓN DE PUNTOS
// =========================================================
bool asignar_puntos(const std::vector<Coord_3D>& datos, 
                    const std::vector<Cluster>& clusters, 
                    std::vector<int>& asignaciones) {
    bool hubo_cambio = false;
    const int n = static_cast<int>(datos.size());
    const int k = static_cast<int>(clusters.size());

    for (int i = 0; i < n; ++i) {
        double min_dist = std::numeric_limits<double>::max();
        int mejor_idx = 0;

        for (int j = 0; j < k; ++j) {
            double d = distancia_cuadrada(datos[i], clusters[j].centroide);
            if (d < min_dist) {
                min_dist = d;
                mejor_idx = j;
            }
        }

        if (asignaciones[i] != mejor_idx) {
            asignaciones[i] = mejor_idx;
            hubo_cambio = true;
        }
    }
    return hubo_cambio;
}

// =========================================================
// 3. RECÁLCULO DE CENTROIDES (Centro de Masa)
// =========================================================
bool recalcular_centroides(const std::vector<Coord_3D>& datos, 
                           std::vector<Cluster>& clusters, 
                           const std::vector<int>& asignaciones) {
    const int k = static_cast<int>(clusters.size());
    const int n = static_cast<int>(datos.size());

    std::vector<double> sum_x(k, 0.0);
    std::vector<double> sum_y(k, 0.0);
    std::vector<double> sum_z(k, 0.0);
    std::vector<int> count(k, 0);

    for (int i = 0; i < n; ++i) {
        int j = asignaciones[i];
        sum_x[j] += datos[i].x;
        sum_y[j] += datos[i].y;
        sum_z[j] += datos[i].z;
        count[j]++;
    }

    for (int j = 0; j < k; ++j) {
        if (count[j] == 0) {
            std::cerr << "Advertencia: El cluster " << clusters[j].etiqueta << " quedó vacío.\n";
            return false; 
        }
        clusters[j].centroide.x = sum_x[j] / count[j];
        clusters[j].centroide.y = sum_y[j] / count[j];
        clusters[j].centroide.z = sum_z[j] / count[j];
    }
    return true;
}

// =========================================================
// 4. CONDICIÓN DE PARADA (Regla de NagySoft)
// =========================================================
/*
 * FUNCION DE CONDICION DE PARADA ENCAPSULADA
 * Parámetros:
 * - anteriores: Vector de clusters en la iteración (t-1).
 * - actuales: Vector de clusters tras recalcular en (t).
 * - iteracion: Número de iteración actual.
 * - maxIteraciones: Límite de seguridad del bucle.
 * - tolerancia: Distancia mínima de movimiento a considerar.
 * * ¿Por qué es una buena condición de parada?
 * 1. Failsafe (Seguridad): Previene ciclos infinitos si el algoritmo oscila.
 * 2. Convergencia Real: Mide el desplazamiento máximo (distancia euclidiana) de TODOS 
 * los centroides. Si el que más se movió, se desplazó menos que nuestra tolerancia 
 * (ej. 0.0001), garantizamos que el sistema completo encontró su estabilidad matemática 
 * y los puntos ya no cambiarán de grupo.
 */
bool condicionDeParada(const std::vector<Cluster>& anteriores, 
                       const std::vector<Cluster>& actuales, 
                       int iteracion, int maxIteraciones, double tolerancia) {
    
    // 1. Seguro contra bucles infinitos
    if (iteracion >= maxIteraciones) {
        std::cout << "Failsafe: Límite de iteraciones alcanzado.\n";
        return true;
    }

    // 2. Evaluación de convergencia geométrica
    double max_desplazamiento = 0.0;
    for (size_t j = 0; j < actuales.size(); ++j) {
        double d = distancia_euclidiana(anteriores[j].centroide, actuales[j].centroide);
        if (d > max_desplazamiento) {
            max_desplazamiento = d;
        }
    }

    // Si el máximo movimiento es menor a la tolerancia, el algoritmo converge.
    return max_desplazamiento <= tolerancia;
}

// =========================================================
// 5. INICIALIZACIÓN INTELIGENTE (K-Means++)
// =========================================================
static void inicializar_kmeans_pp(const std::vector<Coord_3D>& datos, int k, std::vector<Cluster>& clusters) {
    const int n = static_cast<int>(datos.size());
    std::mt19937 rng(42); // Semilla fija para reproducibilidad

    clusters.clear();
    clusters.resize(k);

    for (int j = 0; j < k; ++j) {
        clusters[j].etiqueta = static_cast<char>('A' + j);
    }

    std::uniform_int_distribution<int> dist_uniforme(0, n - 1);
    clusters[0].centroide = datos[dist_uniforme(rng)];

    std::vector<double> d2(n);
    for (int j = 1; j < k; ++j) {
        double total = 0.0;
        for (int i = 0; i < n; ++i) {
            double min_d2 = std::numeric_limits<double>::max();
            for (int prev = 0; prev < j; ++prev) {
                double d = distancia_cuadrada(datos[i], clusters[prev].centroide);
                if (d < min_d2) min_d2 = d;
            }
            d2[i] = min_d2;
            total += min_d2;
        }

        std::uniform_real_distribution<double> dist_real(0.0, total);
        double r = dist_real(rng);
        double acum = 0.0;
        int elegido = 0;
        for (int i = 0; i < n; ++i) {
            acum += d2[i];
            if (acum >= r) { elegido = i; break; }
        }
        clusters[j].centroide = datos[elegido];
    }
}

// =========================================================
// 6. MOTOR PRINCIPAL
// =========================================================
void ejecutar_kmeans(const std::vector<Coord_3D>& datos, int k, std::vector<Cluster>& clusters, std::vector<int>& asignaciones, int max_iter, double tolerancia) {
    const int n = static_cast<int>(datos.size());
    asignaciones.assign(n, -1);
    const int MAX_REINICIOS = 5;

    for (int intento = 0; intento < MAX_REINICIOS; ++intento) {
        inicializar_kmeans_pp(datos, k, clusters);
        asignaciones.assign(n, -1);
        bool reiniciar = false;

        for (int iter = 0; iter < max_iter; ++iter) {
            std::vector<Cluster> anteriores = clusters;

            asignar_puntos(datos, clusters, asignaciones);

            if (!recalcular_centroides(datos, clusters, asignaciones)) {
                reiniciar = true;
                break; // Un cluster se vació, abortamos esta ronda y reiniciamos
            }

            // Aplicamos la regla estricta de NagySoft
            if (condicionDeParada(anteriores, clusters, iter, max_iter, tolerancia)) {
                std::cout << "K-Means: Convergencia alcanzada en iteracion " << iter + 1 << "\n";
                return;
            }
        }

        if (!reiniciar) return; // Si salimos por failsafe, terminamos igual
    }
}

// =========================================================
// 7. CÁLCULO DE DISPERSIÓN (Root Mean Square Distance)
// =========================================================
double dispersion(const std::vector<Coord_3D>& datos, const Cluster& cluster, const std::vector<int>& asignaciones, int cluster_idx) {
    double suma = 0.0;
    int count = 0;

    for (size_t i = 0; i < datos.size(); ++i) {
        if (asignaciones[i] == cluster_idx) {
            double d = distancia_euclidiana(datos[i], cluster.centroide);
            suma += d * d;
            ++count;
        }
    }
    if (count == 0) return 0.0;
    return std::sqrt(suma / count); 
}