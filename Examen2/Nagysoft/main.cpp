#include <iostream>
#include <string>
#include <vector>
#include "tipos.h"
#include "cargador.h"
#include "kmeans.h"
#include "escritor.h"

int main(int argc, char* argv[]) {
    // Fase de Validacion
    if (argc != 3) {
        std::cerr << "Error: Uso incorrecto del programa.\n";
        std::cerr << "Sintaxis requerida: cluster <k> <datos>\n";
        return 1;
    }

    int k;
    try {
        k = std::stoi(argv[1]);
    } catch (...) {
        std::cerr << "Error: <k> debe ser un numero entero valido.\n";
        return 1;
    }

    if (k <= 0 || k > 6) { // El Dr. Szilard menciono no necesitar mas de 6
        std::cerr << "Advertencia: Se recomienda un k entre 1 y 6 segun NagySoft.\n";
    }

    std::string archivoDatos = argv[2];
    std::cout << "\n--- NagySoft: K-Means Clustering 3D ---\n";
    
    // Fase 1: Carga de Datos
    std::vector<Coord_3D> datos = cargarDatosCSV(archivoDatos);
    if (datos.empty()) return 1;
    std::cout << "-> Datos cargados: " << datos.size() << " puntos.\n";

    // Fase 3: Motor Matematico
    std::vector<Cluster> clusters;
    std::vector<int> asignaciones;
    
    std::cout << "-> Ejecutando K-Means para k=" << k << "...\n";
    ejecutar_kmeans(datos, k, clusters, asignaciones); 

    // Fase 4: Generacion de Reportes
    generarClasificadosCSV("clasificados.csv", datos, asignaciones, clusters);
    generarSummaryTXT("summary.txt", datos, asignaciones, clusters);

    std::cout << "--- Proceso Finalizado Exitosamente ---\n\n";
    return 0;
}