# Compilador y flags de advertencia para código limpio
CXX = g++
CXXFLAGS = -Wall -Wextra -std=c++11

# El ejecutable exigido por el Dr. Szilard
TARGET = cluster

# Nuestros archivos fuente
SRCS = main.cpp cargador.cpp kmeans.cpp escritor.cpp
OBJS = $(SRCS:.cpp=.o)

# Regla principal
all: $(TARGET)

# Enlazado final
$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)

# Compilación de los objetos
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Regla para limpiar el directorio (Adaptada para Windows)
clean:
	del /Q /F *.o cluster.exe

