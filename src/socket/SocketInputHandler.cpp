#include "SocketInputHandler.h"
#include <sys/socket.h> 
#include <unistd.h> 
// Implementation of SocketInputHandler

///@brief constructor, receives the connected client socket fd
SocketInputHandler::SocketInputHandler(int clientFd) : clientFd(clientFd){}

/// @brief reads bytes from clientFd until '\n', stores result in line (without '\n'),
    ///                  returns true on success, false if client disconnected
bool SocketInputHandler::readLine(std::string& line){
    //clear line
    line.clear();
    char c;
    int read_bytes;
    while (true){
        ///read one byte
        read_bytes = recv(clientFd, &c, 1, 0);
        if (read_bytes<=0)
            return false;
        //end of the line
        if (c == '\n'){
            //check for \r in the end of line, if exists, remove it
            if (!line.empty() && line.back() == '\r') {
                line.pop_back();
            }
            return true;
        }
        
        line += c;
    }
}