#ifndef TCP_SERVER_H
#define TCP_SERVER_H

#include "../interfaces/IServer.h"
#include "../interfaces/IClientHandler.h"
#include <memory>

// TCPServer: concrete implementation of IServer for TCP connections.
// Delegates all client handling to the injected IClientHandler — Single Responsibility Principle.

class TCPServer : public IServer {

private:
    int port;
    IClientHandler& clientHandler;

public:

    /// @brief constructor
    /// @param port : the port
    /// @param clienthandler : the client handler 
    TCPServer(int port, IClientHandler& clienthandler); 

    /// @brief creates socket, binds to port, listens, and enters accept() loop. 
    /// for each accepted connection, delegates to clientHandler->handle(clientFd)
    void start() override;

};

#endif