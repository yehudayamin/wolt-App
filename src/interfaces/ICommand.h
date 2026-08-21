#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>
#include <vector>
// Interface for CLI commands. Each command (add, recommend, help) is implemented
// as a separate class, allowing new commands to be added without modifying existing code.
class ICommand {
public:
    virtual ~ICommand() = default;

    /// @brief Runs the command with the given arguments
    /// @param args tokens after the command name (e.g. for "add 1 100 101", args = {"1", "100", "101"})
    virtual void execute(const std::vector<std::string>& args) = 0;

    /// @brief Returns the command keyword
    /// @return the command name (e.g. "add", "recommend", "help")
    virtual std::string getName() const = 0;

    /// @brief Returns the usage line printed by the help command
    /// @return the description string (e.g. "add [userid] [productid1] [productid2] ...")
    virtual std::string getDescription() const = 0;

    /// @brief Returns the arguments string for the help command output
    /// @return arguments string (e.g. "[userid] [productid1] [productid2] ..."), or empty string if no arguments
    /// @default returns empty string — override only in commands that have arguments
    virtual std::string getArguments() const { return ""; }
};

#endif
