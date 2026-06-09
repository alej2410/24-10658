#include "cargador.h"
#include <fstream>
#include <sstream>
#include <iostream>

std::vector<Coord_3D> cargarDatosCSV(const std::string& nombreArchivo) {
    std::vector<Coord_3D> datos;
    std::ifstream archivo(nombreArchivo);

    if (!archivo.is_open()) {
        std::cerr << "Error: No se pudo abrir el archivo " << nombreArchivo << std::endl;
        return datos; // Retorna un vector vacío si falla
    }

    std::string linea;
    
    // Leemos el archivo línea por línea
    while (std::getline(archivo, linea)) {
        // Ignoramos líneas vacías por precaución
        if (linea.empty()) continue; 

        std::stringstream ss(linea);
        std::string valor;
        Coord_3D punto;

        // Extraemos x, y, z asumiendo que siempre vienen separados por coma
        if (std::getline(ss, valor, ',')) punto.x = std::stod(valor);
        if (std::getline(ss, valor, ',')) punto.y = std::stod(valor);
        if (std::getline(ss, valor, ',')) punto.z = std::stod(valor);

        datos.push_back(punto);
    }

    archivo.close();
    return datos;
}