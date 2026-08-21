#ifndef ADD_COMMAND_H
#define ADD_COMMAND_H
#include "../interfaces/ICommand.h"
#include "../interfaces/IDataStorage.h"

// Handles the "add" command. Associates a list of viewed products with a given user
// and persists the data via IDataStorage.

class AddCommand : public ICommand {
    private:
        IDataStorage& storage;

    public:
        AddCommand(IDataStorage& storage);

        /// @brief Runs the command with the given arguments
        /// @param args tokens after the command name (e.g. for "add 1 100 101", args = {"1", "100", "101"})
        void execute(const std::vector<std::string>& args) override;

        /// @brief Returns the command keyword
        /// @return the command name (e.g. "add", "recommend", "help")
        std::string getName() const override;

        /// @brief Returns the usage line printed by the help command
        /// @return the description string (e.g. "add [userid] [productid1] [productid2] ...")
        std::string getDescription() const override;
};

#endif
