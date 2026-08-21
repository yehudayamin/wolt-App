#ifndef SOCKET_OUTPUT_HANDLER_H
#define SOCKET_OUTPUT_HANDLER_H

#include "../interfaces/IOutputHandler.h"

// implementation of IOutputHandler for TCP sockets.
class SocketOutputHandler : public IOutputHandler {
private:
    int clientFd;
public:
    ///@brief constructor, receives the connected client socket fd
    SocketOutputHandler(int clientFd);

    /// @brief the function gets line to write to destination, writes line + '\n' to clientFd .
    /// @param line: the line we want to write to destination.
    void writeLine(const std::string& line) override;

};

#endif