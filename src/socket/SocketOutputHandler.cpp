#include "SocketOutputHandler.h"
#include <sys/socket.h> 
#include <unistd.h> 
#include <string>
// Implementation of SocketOutputHandler
///@brief constructor, receives the connected client socket fd
SocketOutputHandler::SocketOutputHandler(int clientFd): clientFd(clientFd){}


/// @brief the function gets line to write to destination, writes line + '\n' to clientFd .
/// @param line: the line we want to write to destination.
void SocketOutputHandler::writeLine(const std::string& line){
    std::string toSend = line + "\n";
    send(clientFd, toSend.c_str(), toSend.length(), 0);
}