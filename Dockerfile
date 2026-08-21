FROM gcc:latest      
RUN apt-get update && apt-get install -y cmake
WORKDIR /app
COPY src/ ./src/
COPY data/ ./data/
COPY CMakeLists.txt .
RUN cmake -S . -B build  
RUN cmake --build build  
ENTRYPOINT ["./build/runner"]