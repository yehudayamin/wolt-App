#ifndef ICLIENT_HANDLER_H
#define ICLIENT_HANDLER_H

// Interface for handling a connected client.
// Separates the concern of accepting connections from the
// concern of what to do with a connected client.

class IClientHandler {
public:
    virtual ~IClientHandler() = default;
    /// @brief handles a connected client given its socket file descriptor
    /// reads commands, dispatches them, and writes responses until the client disconnects
    virtual void handle(int clientFd)=0;
};

#endif
