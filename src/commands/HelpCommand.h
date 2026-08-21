#ifndef HELP_COMMAND_H
#define HELP_COMMAND_H
#include "../interfaces/ICommand.h"
#include "../interfaces/IOutputHandler.h"
#include <string>
#include <vector>

// Handles the "help" command. Prints the list of all available commands
// to the output handler.

class HelpCommand : public ICommand {

    private:
        IOutputHandler& output; // knows where to output
        const std::vector<ICommand*>& commands; // list of all available commands

    public:

    /// @brief constructor
    /// @param output: where to write the output
    /// @param commands: list of all available commands
    HelpCommand(IOutputHandler& output, const std::vector<ICommand*>& commands);

    /// @return the name of the command: "help"
    std::string getName() const override;

    /// @brief Returns the usage line of the help command, printed when "help" is executed.
    /// @return the description of the command: "help"
    std::string getDescription() const override;

    /// @brief prints the description of all available commands, one per line.
    ///        sorted alphabetically, "help" always last.
    ///        commands with arguments include "arguments: ..." in their output line.
    /// @param args list of tokens (irrelevant for the help command)
    void execute(const std::vector<std::string>& args) override;

    // getArguments() is not overridden — inherits default empty string from ICommand
};

#endif
