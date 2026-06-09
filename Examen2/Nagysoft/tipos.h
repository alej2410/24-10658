#ifndef TIPOS_H
#define TIPOS_H

// Estructura exigida para almacenar las coordenadas originales
struct Coord_3D {
    double x;
    double y;
    double z;
};

// Estructura sugerida para asociar un punto a un cluster (etiqueta)
struct Labeled {
    Coord_3D coord;
    char label;
};

#endif // TIPOS_H