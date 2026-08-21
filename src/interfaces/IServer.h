#ifndef ISERVER_H
#define ISERVER_H

// Interface for a server.
// Responsible for starting and managing the server lifecycle.

class IServer {
public:
    virtual ~IServer() = default;

    /// @brief starts the server: begins listening for incoming connections 
    /// and delegates each connected client to the IClientHandler
    virtual void start()=0;
};

#endif
