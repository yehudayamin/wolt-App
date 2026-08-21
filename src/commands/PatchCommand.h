#ifndef PATCH_COMMAND_H
#define PATCH_COMMAND_H

#include "../interfaces/ICommand.h"
#include "../interfaces/IDataStorage.h"
#include "../interfaces/IOutputHandler.h"

// PatchCommand: handles the PATCH command.
// Adds additional product views to an existing user.
// Valid ONLY if the user already exists (was previously created via POST).

class PatchCommand : public ICommand {

private:
IDataStorage& storage;
IOutputHandler& output; //where to output to
public:

/// @brief constructor
/// @param storage : where to add users to
/// @param output : where to print messages.
PatchCommand(IDataStorage& storage,IOutputHandler& output);

/// @brief Runs the command with the given arguments
/// @param args tokens after the command name (e.g. for "add 1 100 101", args = {"1", "100", "101"})
void execute(const std::vector<std::string>& args) override;
   
/// @brief the function returns 'PATCH'
/// @return string of the name of command.
std::string getName() const override;

/// @brief Returns the usage line printed by the help command
/// @return the description string 
std::string getDescription() const override;

/// @return "[userid] [productid1] [productid2] ..."
std::string getArguments() const override;
};

#endif