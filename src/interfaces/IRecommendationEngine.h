#ifndef IRECOMMENDATION_ENGINE_H
#define IRECOMMENDATION_ENGINE_H

#include <string>
#include <vector>

// Interface for the recommendation engine. Given a user and a product,
// returns a ranked list of recommended products based on similarity between users.
// Implementations may use different algorithms without affecting the rest of the system.

class IRecommendationEngine {
public:

    virtual ~IRecommendationEngine() = default;

    // Returns up to 10 recommended products. Receives a user ID and a product ID to base the recommendations on.
    virtual std::vector<std::string> getRecommendations (const std::string& userid,const std::string& productId)=0;
};

#endif
