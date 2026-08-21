#ifndef DELETE_COMMAND_H
#define DELETE_COMMAND_H
#include "../interfaces/ICommand.h"
#include "../interfaces/IDataStorage.h"
#include "../interfaces/IOutputHandler.h"

// DeleteCommand: handles the DELETE command.
// Removes specific product views from an existing user.

class DeleteCommand : public ICommand {
private:
    IDataStorage& storage;
    IOutputHandler& output;

public:

    /// @brief constructor
    /// @param storage : where to remove products from
    /// @param output : where to print the response
    DeleteCommand(IDataStorage& storage, IOutputHandler& output);

    /// @brief executes the DELETE command
    /// @param args expects [userid] [productid1] [productid2] ...
    void execute(const std::vector<std::string>& args) override;

    /// @brief returns "DELETE"
    std::string getName() const override;

    /// @brief returns the usage line for the help command
    std::string getDescription() const override;

    /// @return "[userid] [productid1] [productid2] ..."
    std::string getArguments() const override;
};

#endif
