#ifndef GET_COMMAND_H
#define GET_COMMAND_H
#include "../interfaces/ICommand.h"
#include "../interfaces/IRecommendationEngine.h"
#include "../interfaces/IOutputHandler.h"
#include "../interfaces/IDataStorage.h"
#include <memory>

// GetCommand: handles the GET command.
// Returns product recommendations for a given user and product.

class GetCommand : public ICommand {
private:
    std::shared_ptr<IRecommendationEngine> engine;
    IOutputHandler& output;
    IDataStorage& storage;


public:

    /// @brief constructor
    /// @param engine : the recommendation engine to query
    /// @param output : where to print the response
    GetCommand(std::shared_ptr<IRecommendationEngine> engine, IOutputHandler& output, IDataStorage& storage);

    /// @brief executes the GET command
    /// @param args expects exactly 2 tokens: [userid] [productid]
    void execute(const std::vector<std::string>& args) override;

    /// @brief returns "GET"
    std::string getName() const override;

    /// @brief returns the usage line for the help command
    std::string getDescription() const override;

    /// @return "[userid] [productid]"
    std::string getArguments() const override;
};

#endif
