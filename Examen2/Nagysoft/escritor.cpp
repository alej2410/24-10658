#include "escritor.h"
#include <fstream>
#include <iostream>
#include <iomanip>

void generarClasificadosCSV(const std::string& nombreArchivo, 
                            const std::vector<Coord_3D>& datos, 
                            const std::vector<int>& asignaciones, 
                            const std::vector<Cluster>& clusters) {
    std::ofstream archivo(nombreArchivo);
    if (!archivo.is_open()) {
        std::cerr << "Error al crear el archivo " << nombreArchivo << "\n";
        return;
    }

    // Usamos 6 decimales para igualar tu captura de datos.csv
    archivo << std::fixed << std::setprecision(6);

    for (size_t i = 0; i < datos.size(); ++i) {
        int cluster_idx = asignaciones[i];
        
        archivo << datos[i].x << "," 
                << datos[i].y << "," 
                << datos[i].z << "," 
                << clusters[cluster_idx].etiqueta << "\n";
    }

    archivo.close();
    std::cout << "Exito: " << nombreArchivo << " generado correctamente.\n";
}

void generarSummaryTXT(const std::string& nombreArchivo, 
                       const std::vector<Coord_3D>& datos, 
                       const std::vector<int>& asignaciones, 
                       const std::vector<Cluster>& clusters) {
    std::ofstream archivo(nombreArchivo);
    if (!archivo.is_open()) {
        std::cerr << "Error al crear el archivo " << nombreArchivo << "\n";
        return;
    }

    archivo << std::fixed << std::setprecision(6);

    for (size_t j = 0; j < clusters.size(); ++j) {
        // Contamos cuántos puntos pertenecen a este cluster
        int n_puntos = 0;
        for (int idx : asignaciones) {
            if (idx == static_cast<int>(j)) {
                n_puntos++;
            }
        }

        // Usamos tu función para calcular la Raíz del Error Cuadrático Medio
        double md = dispersion(datos, clusters[j], asignaciones, static_cast<int>(j));

        // Molde estricto: A: N, (x, y, z), MD
        archivo << clusters[j].etiqueta << ": " 
                << n_puntos << ", (" 
                << clusters[j].centroide.x << ", " 
                << clusters[j].centroide.y << ", " 
                << clusters[j].centroide.z << "), " 
                << md << "\n";
    }

    archivo.close();
    std::cout << "Exito: " << nombreArchivo << " generado correctamente.\n";
}