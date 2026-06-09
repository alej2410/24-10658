#ifndef CARGADOR_H
#define CARGADOR_H

#include <vector>
#include <string>
#include "tipos.h"

// Lee el CSV y retorna el vector de coordenadas. 
// Pasamos el string por referencia constante para evitar copias innecesarias en memoria.
std::vector<Coord_3D> cargarDatosCSV(const std::string& nombreArchivo);

#endif // CARGADOR_H