#include "TCPServer.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>

// Implementation of TCPServer


TCPServer::TCPServer(int port, IClientHandler& clientHandler): port(port), clientHandler(clientHandler){}


void TCPServer::start(){

    int serverFD = socket(AF_INET, SOCK_STREAM, 0);

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);
    bind(serverFD, (struct sockaddr*)&sin, sizeof(sin));

    listen(serverFD, 1);

    while (true) {
        struct sockaddr_in clientSin;
        unsigned int addrLen = sizeof(clientSin);
        int clientFd = accept(serverFD, (struct sockaddr*)&clientSin, &addrLen);
        clientHandler.handle(clientFd);
        close(clientFd);
    }

}

