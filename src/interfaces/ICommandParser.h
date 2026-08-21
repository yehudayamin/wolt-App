#ifndef ICOMMAND_PARSER_H
#define ICOMMAND_PARSER_H

#include <string>
#include <memory>
#include "ICommand.h"

// Parses a raw input line and dispatches it to the matching command.
class ICommandParser {
public:
    virtual ~ICommandParser() = default;

    /// @brief Maps a command name to its ICommand implementation
    /// @param name the command keyword (e.g. "add", "recommend", "help")
    /// @param command shared pointer to the ICommand implementation
    virtual void registerCommand(const std::string& name, std::shared_ptr<ICommand> command) = 0;

    /// @brief Splits line into tokens, finds the matching command, and calls execute()
    /// @param line the raw input line (e.g. "add 1 100 101")
    /// @note silently ignores unknown or malformed input
    virtual void parse(const std::string& line) = 0;
};

#endif
