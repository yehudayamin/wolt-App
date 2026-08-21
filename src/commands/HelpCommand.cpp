#include "HelpCommand.h"
#include <algorithm>

HelpCommand::HelpCommand(IOutputHandler& output, const std::vector<ICommand*>& commands)
    : output(output), commands(commands) {}

std::string HelpCommand::getName() const {
    return "help";
}

std::string HelpCommand::getDescription() const {
    return "help";
}

void HelpCommand::execute(const std::vector<std::string>& args) {
    if (args.size() != 0) return output.writeLine("400 Bad Request");
    // if user send "help" with "bla bla"

    //sorted the vector alpahbetic
    std::vector<ICommand*> sorted(commands.begin(), commands.end());
    std::sort(sorted.begin(), sorted.end(), [](ICommand* a, ICommand* b) {
        return a->getName() < b->getName();
    });

    for (ICommand* command : sorted) {
        if (command->getName() == "help") continue;
        if (command->getArguments() == "") {
            output.writeLine(command->getName());
        } else {
            output.writeLine(command->getName() + ", arguments: " + command->getArguments());
        }
    }
    output.writeLine("help");
}

