cmake_minimum_required(VERSION 3.15)

project(Ex1 CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

#create exe file for running the code
add_executable(runner 
    src/commands/AddCommand.cpp
    src/commands/HelpCommand.cpp
    src/commands/RecommendCommand.cpp
    src/input/StdinInputHandler.cpp
    #src/main.cpp
    src/output/StdoutOutputHandler.cpp
    src/parser/CommandParser.cpp
    src/recommendation/RecommendationEngine.cpp
    src/storage/FileDataStorage.cpp
    src/commands/DeleteCommand.cpp
    src/commands/GetCommand.cpp
    src/commands/PatchCommand.cpp
    src/commands/PostCommand.cpp
    src/server/SingleClientHandler.cpp
    src/server/TCPServer.cpp
    src/socket/SocketInputHandler.cpp
    src/socket/SocketOutputHandler.cpp
    src/server_main.cpp
)   

target_include_directories(runner PRIVATE
    src/commands
    src/input
    src/interfaces
    src/output
    src/parser
    src/recommendation
    src/storage
    src/server
    src/socket
)
