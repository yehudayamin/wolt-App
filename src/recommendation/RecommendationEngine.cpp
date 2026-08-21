#include "RecommendationEngine.h"
#include <algorithm>
#include <utility>

#define MAX_RECOMMENDATIONS 10

// Implementation of RecommendationEngine.
// Calculates user similarity scores and ranks products by total relevance.

RecommendationEngine::RecommendationEngine(IDataStorage& storage) : storage(storage) {}

std::vector<int> RecommendationEngine::getUsersWhoWatched(int productId){
    std::vector<int> usersIds; //vector of user ids 
    std::vector<int> allUsers = this->storage.getAllUsers(); 
    for (auto& user : allUsers){ //iterate all users
        std::vector<int> products = this->storage.getProducts(user);
        if (find(products.begin(), products.end(), productId) != products.end()){ //if productId was found in users list
            usersIds.push_back(user); // insert the user's id into the vector
        }
    }
    return usersIds;
}

std::vector<int> RecommendationEngine::sortByRelevance(const std::map<int, int>& scores){
    std::vector<std::pair<int,int>> vec(scores.begin(), scores.end()); // 
    sort(vec.begin(), vec.end(), [](const std::pair<int,int>& a, const std::pair<int,int>& b) { //sort using lambda function
    if (a.second != b.second) return a.second > b.second; // highest score is before
    return a.first < b.first; // if scores are equal, put the lowest id before
    });
    std::vector<int> result;
    for (auto& pair : vec){
        result.push_back(pair.first);
    }
    return result;
}

int RecommendationEngine::calcSimilarity(int userId1, int userId2)
{
    // retrieve the product list of each user
    std::vector<int> list_user1= storage.getProducts(userId1);
    std::vector<int> list_user2= storage.getProducts(userId2);

    int score=0;

    // for each product in list1, check if it exists in list2
    
    for (int product1 : list_user1)
    {
        for (int product2 : list_user2)
        {
            if (product1==product2)
            {
                score++;
            }
        }
    }

    return score;
}

std::map<int, int>RecommendationEngine::calcRelevance(int userId, int productId)
{
    std::map<int,int> relevenceMap; // map: (productId (key),relevance score)

    // find all users who watched productId
    std::vector<int> common_users = getUsersWhoWatched(productId);

    // for each user who watched productId:
    // 1. calculate his similarity to userId
    // 2. for each product he watched, add his similarity score to that product's total relevance
    for (int user : common_users)
    {
        int similarity = calcSimilarity(user, userId);
        if (similarity > 0)
        {
            for (int product : storage.getProducts(user))
            {
                relevenceMap[product] += similarity;
            }
        }
    }

    return relevenceMap;
}

std::vector<std::string> RecommendationEngine::getRecommendations(const std::string& userId, const std::string& productId)
{

    // convert string ids to int
    int userId_Int;
    try{
        userId_Int = std::stoi(userId);
    }
    catch(...){return{};}
    int productId_Int;
    try{
        productId_Int = std::stoi(productId);
    }
    catch(...){return{};}

    // calculate relevance scores for all products
    std::map<int,int> relevenceMap = calcRelevance(userId_Int, productId_Int);

    // remove products the user has already watched
    for (int product : storage.getProducts(userId_Int))
    {
        relevenceMap.erase(product);
    }

    // remove the queried product itself
    relevenceMap.erase(productId_Int);

    // sort products by relevance score descending, then by id ascending on ties
    std::vector<int> sortedList = sortByRelevance(relevenceMap);

    // take up to 10 recommendations and convert to strings
    std::vector<std::string> output;
    for (int i = 0; i < MAX_RECOMMENDATIONS && i < (int)sortedList.size(); i++)
    {
        output.push_back(std::to_string(sortedList[i]));
    }

return output;
}
