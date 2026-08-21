#ifndef SINGLE_CLIENT_HANDLER_H
#define SINGLE_CLIENT_HANDLER_H

#include "../interfaces/IClientHandler.h"
#include "../interfaces/IDataStorage.h"
#include "../interfaces/IRecommendationEngine.h"

// SingleClientHandler: concrete implementation of IClientHandler.
// Handles exactly one client at a time in a blocking loop.

class SingleClientHandler : public IClientHandler {
private:
    IDataStorage& storage;
    IRecommendationEngine& engine;
public:
    SingleClientHandler(IDataStorage& storage, IRecommendationEngine& engine);
    void handle(int clientFd) override;
};

#endif