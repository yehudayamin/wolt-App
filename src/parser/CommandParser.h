#ifndef COMMAND_PARSER_H
#define COMMAND_PARSER_H

#include "../interfaces/ICommandParser.h"
#include "../interfaces/IOutputHandler.h"
#include <map>
#include <string>
#include <memory>

// Concrete implementation of ICommandParser.
// Tokenises an input line and dispatches it to the matching registered command.


class CommandParser : public ICommandParser {
private:
    std::map<std::string, std::shared_ptr<ICommand>> commands;
    IOutputHandler& output;
    
public:

    //constuctor
    CommandParser(IOutputHandler& output);
    void registerCommand(const std::string& name, std::shared_ptr<ICommand> command) override;
    void parse(const std::string& line) override;
};

#endif
