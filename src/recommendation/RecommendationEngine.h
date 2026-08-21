#ifndef RECOMMENDATION_ENGINE_H
#define RECOMMENDATION_ENGINE_H

#include "../interfaces/IRecommendationEngine.h"
#include "../interfaces/IDataStorage.h"
#include <string>
#include <vector>
#include <map>

// Concrete implementation of IRecommendationEngine.
// Recommends products based on user similarity — the more products two users share, the more similar they are.

class RecommendationEngine : public IRecommendationEngine {

    private:
        IDataStorage& storage;

        /// @brief Calculates the number of common products between two users.
        /// @param userId1 first user id
        /// @param userId2 second user id
        /// @return number of common products
        int calcSimilarity(int userId1, int userId2);

        /// @brief Returns all users who watched a given product.
        /// @param productId the product id
        /// @return vector of user ids who watched the product
        std::vector<int> getUsersWhoWatched(int productId);

        /// @brief Calculates a relevance score for each product based on user similarity.
        /// @param userId the user to recommend for
        /// @param productId the product to base recommendations on
        /// @return map of productId to relevance score
        std::map<int, int> calcRelevance(int userId, int productId);

        /// @brief Sorts products by relevance score descending, then by product id ascending on ties.
        /// @param scores map of productId to relevance score
        /// @return sorted vector of product ids
        std::vector<int> sortByRelevance(const std::map<int, int>& scores);

    public:

        /// @brief Constructor. Receives a storage to retrieve user-product data from.
        /// @param storage the data storage to use
        RecommendationEngine(IDataStorage& storage);

        /// @brief Returns up to 10 recommended products for a given user based on a product they viewed.
        /// @param userId the user to recommend for
        /// @param productId the product to base recommendations on
        std::vector<std::string> getRecommendations(const std::string& userId, const std::string& productId) override;
};

#endif
