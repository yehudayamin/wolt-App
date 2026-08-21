#ifndef SOCKET_INPUT_HANDLER_H
#define SOCKET_INPUT_HANDLER_H

#include "../interfaces/IInputHandler.h"

// SocketInputHandler: concrete implementation of IInputHandler for TCP sockets.
// Reads one line at a time from a connected client socket file descriptor.
// Reads until '\n' and strips it before returning the line.
class SocketInputHandler : public IInputHandler {
private:
    int clientFd;
public:
    ///@brief constructor, receives the connected client socket fd
    SocketInputHandler(int clientFd);

    /// @brief reads bytes from clientFd until '\n', stores result in line (without '\n'),
    ///                  returns true on success, false if client disconnected

    bool readLine(std::string& line) override;



};

#endif