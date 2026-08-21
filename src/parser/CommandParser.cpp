#include "CommandParser.h"
#include <iostream>
#include <sstream>

CommandParser::CommandParser(IOutputHandler& output) :output(output){}
void CommandParser::registerCommand(const std::string& name, std::shared_ptr<ICommand> command) {
    commands[name] = command;
}

void CommandParser::parse(const std::string& line) {
    std::istringstream s(line); 
    std::string command;
    s >> command; 

    if (commands.find(command) == commands.end()) {
        output.writeLine("400 Bad Request");
        output.writeLine("");
        return;
    }

    std::vector<std::string> args;
    std::string token;
    while (s >> token)
    {
        args.push_back(token);
    }

    commands[command]->execute(args);
    output.writeLine("");
}

   
