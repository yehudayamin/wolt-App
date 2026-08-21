#ifndef RECOMMEND_COMMAND_H
#define RECOMMEND_COMMAND_H

#include "../interfaces/ICommand.h"
#include "../interfaces/IRecommendationEngine.h"
#include "../interfaces/IOutputHandler.h"
#include <memory>

// Handles the "recommend" command. Given a user and a product, returns up to 10
// recommended products with IRecommendationEngine and prints them with IOutputHandler.

class RecommendCommand : public ICommand {
private:
    std::shared_ptr<IRecommendationEngine> engine;
    std::shared_ptr<IOutputHandler> output;
public:
    /// @brief constructs a RecommendCommand with the given engine and output handler
    /// @param engine shared pointer to the recommendation engine
    /// @param output shared pointer to the output handler
    RecommendCommand(std::shared_ptr<IRecommendationEngine> engine, std::shared_ptr<IOutputHandler> output);

    /// @brief executes the recommend command
    /// @param args tokens after the command name — expects exactly 2: userid and productid
    void execute(const std::vector<std::string>& args) override;

    /// @brief returns the command keyword
    /// @return "recommend"
    std::string getName() const override;

    /// @brief returns the usage line for the help command
    /// @return "recommend [userid] [productid]"
    std::string getDescription() const override;
};

#endif
