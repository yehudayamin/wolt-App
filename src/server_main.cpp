#include "server/TCPServer.h"
#include "server/SingleClientHandler.h"
#include "storage/FileDataStorage.h"
#include "recommendation/RecommendationEngine.h"
#include <cstdlib>

int main(int argc, char* argv[]) {
    int port = atoi(argv[1]); // the port that user sent.

    FileDataStorage storage("data/users.txt"); //create the users file data storage.
    RecommendationEngine engine(storage); // create the recommendation engine.

    SingleClientHandler handler(storage, engine); 
    //Creates a SingleClientHandler object, passing storage and engine by reference,
    // allowing it to access both for incoming connections.

    TCPServer server(port, handler); //create server
    server.start(); //start the listen to clients

    return 0;
}