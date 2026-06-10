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

# DETECCIÓN INTELIGENTE DE SISTEMA OPERATIVO
# Si la variable OS está definida, estamos en Windows. Si no, en Linux/Mac.
ifdef OS
    CLEAN_CMD = del /Q /F *.o cluster.exe
else
    CLEAN_CMD = rm -f *.o cluster cluster.exe
endif

# Regla clean multiplataforma (Funciona en la USB y en tu PC)
clean:
	$(CLEAN_CMD)