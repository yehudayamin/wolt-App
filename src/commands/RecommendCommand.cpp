#include "RecommendCommand.h"

// store dependencies injected from outside
RecommendCommand::RecommendCommand(std::shared_ptr<IRecommendationEngine> engine, std::shared_ptr<IOutputHandler> output){
    this->engine = engine;
    this->output = output;
}

void RecommendCommand::execute(const std::vector<std::string>& args) {
    // expect exactly userid and productid, otherwise do nothing
    if (args.size() != 2) return;
    std::vector<std::string> recommendations = engine->getRecommendations(args[0], args[1]);
    // join recommendations with spaces and write to output
    std::string result;
    for (size_t i = 0; i < recommendations.size(); i++) {
        if (i > 0) result += " ";
        result += recommendations[i];
    }
    output->writeLine(result);
}

std::string RecommendCommand::getName() const {
    return "recommend";
}

std::string RecommendCommand::getDescription() const {
    return "recommend [userid] [productid]";
}
