#include "GetCommand.h"

GetCommand::GetCommand(std::shared_ptr<IRecommendationEngine> engine, IOutputHandler& output, IDataStorage& storage) : engine(engine), output(output), storage(storage) {}

void GetCommand::execute(const std::vector<std::string>& args) {
    //must have exactly 2 arguments: userid and productid
    if (args.size() != 2) {
        output.writeLine("400 Bad Request");
        return;
    }
    //both arguments must be valid integers
    try {
        size_t pos0, pos1;
        std::stoi(args[0], &pos0);
        std::stoi(args[1], &pos1);
        if (pos0 != args[0].size() || pos1 != args[1].size()) {
            output.writeLine("400 Bad Request");
            return;
        }
    } catch (...) {
        output.writeLine("400 Bad Request");
        return;
    }
    //check if user exists
    if (!storage.userExists(std::stoi(args[0]))) {
        output.writeLine("404 Not Found");
        return;
    }
    //get recommendations from the engine
    auto recs = engine->getRecommendations(args[0], args[1]);

    //join results with spaces into a single line
    std::string result;
    for (size_t i = 0; i < recs.size(); i++) {
        if (i > 0) result += " ";
        result += recs[i];
    }

    //print "200 Ok" and then the results
    output.writeLine("200 Ok");
    output.writeLine("");
    if (!result.empty())
    {
        output.writeLine(result);
    }

}
//returns the command name
std::string GetCommand::getName() const {
    return "GET";
}
// returns the usage line printed by the help command
std::string GetCommand::getDescription() const {
    return "Get [userid] [productid]";
}
//returns the arguments string for the help command output
std::string GetCommand::getArguments() const {
    return "[userid] [productid]";
}
