#include "SingleClientHandler.h"
#include "SocketInputHandler.h"
#include "SocketOutputHandler.h"
#include "CommandParser.h"
#include "HelpCommand.h"
#include "DeleteCommand.h"
#include "GetCommand.h"
#include "PatchCommand.h"
#include "PostCommand.h"
#include <string>
#include <memory>

SingleClientHandler::SingleClientHandler(IDataStorage& storage, IRecommendationEngine& engine)
    : storage(storage), engine(engine) {}

void SingleClientHandler::handle(int clientFd) {
    SocketInputHandler input(clientFd);
    SocketOutputHandler output(clientFd);
    CommandParser parser(output);

    // non-owning shared_ptr — engine lifetime is managed by the caller (server_main)
    std::shared_ptr<IRecommendationEngine> enginePtr(&engine, [](IRecommendationEngine*){});

    auto getCmd    = std::make_shared<GetCommand>(enginePtr, output, storage);
    auto postCmd   = std::make_shared<PostCommand>(storage, output);
    auto patchCmd  = std::make_shared<PatchCommand>(storage, output);
    auto deleteCmd = std::make_shared<DeleteCommand>(storage, output);

    std::vector<ICommand*> commands = {
        getCmd.get(), postCmd.get(), patchCmd.get(), deleteCmd.get()
    };

    auto helpCmd = std::make_shared<HelpCommand>(output, commands);
    commands.push_back(helpCmd.get());

    parser.registerCommand("GET",    getCmd);
    parser.registerCommand("POST",   postCmd);
    parser.registerCommand("PATCH",  patchCmd);
    parser.registerCommand("DELETE", deleteCmd);
    parser.registerCommand("HELP",   helpCmd);

    std::string line;
    while (input.readLine(line)) {
        parser.parse(line);
    }
}