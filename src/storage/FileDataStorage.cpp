#include "FileDataStorage.h"
#include <map>
#include <vector>
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
// Implementation of FileDataStorage.
// Handles reading from and writing to the data file on disk.

FileDataStorage::FileDataStorage(const std::string& filePath) :filePath(filePath){
    std::ifstream file(filePath); //tries to open the file
    if (file.good()){//if file exists
        std::string line;
        while (std::getline(file, line)){ //read line by line
            std::istringstream s(line);
            int userId;
            s >> userId; //put userid into userId
            userProducts[userId]; // ensure key exists even if user has no products
            int productId;
            while (s >> productId) { //read all products
                userProducts[userId].push_back(productId); //insert the product id to the vector
            }
        }
        file.close();

    }

}


/// @brief this method will handle adding product to a user
/// @param userId user id
/// @param productId product id (product num...)
void FileDataStorage::addProduct(int userId, int productId) {
if (std::find(userProducts[userId].begin(), userProducts[userId].end(), productId) == userProducts[userId].end()) {
     userProducts[userId].push_back(productId); //insert the product id to the vector
}
else
{
    return;
}
    std::ofstream file(filePath); //open the file for writing
    for (auto& user : userProducts){ // iterate the map
        file << user.first; //write user id into the file
        for (int product : userProducts[user.first]) { //iterate the products for each user
            file << " " << product;
        }
        file << "\n";
    }
    file.close(); // close the file
}

/// @brief this method will return all the products of the user
/// @param userId user id
/// @return vector of the products.. each product is represented by its product id
std::vector<int> FileDataStorage::getProducts(int userId) {
    if (userProducts.find(userId) == userProducts.end())//check if userId exists in the map or not
        return {};
    return userProducts[userId];
}

/// @brief this method will return a vector of users ids
/// @return vector of all users ids
std::vector<int> FileDataStorage::getAllUsers(){
    std::vector<int>users;
    for (auto& pair: userProducts){ //iterate the map of user id, user products
        users.push_back(pair.first); //instert the user id into the vector
    }
    return users;
}
/// @brief checks whether a user exists in storage
/// @param userId user id to check
/// @return true if the user exists, false otherwise
bool FileDataStorage::userExists(int userId) {
    return userProducts.find(userId) != userProducts.end();
}

/// @brief removes specific products from a user's product list and updates the file
/// @param userId user id
/// @param productIds list of product ids to remove
void FileDataStorage::removeProducts(int userId, const std::vector<int>& productIds) {
    //check if user exists and if not, do nothing
    auto it = userProducts.find(userId);
    if (it == userProducts.end()) return;

    auto& products = it->second; //get the vector of products for the user

    // remove all requested products efficiently
    for (int productId : productIds) {
        products.erase(std::remove(products.begin(), products.end(), productId), products.end());
    }
    // rewrite the file after removing products
    std::ofstream file(filePath);
    for (const auto& [id, prods] : userProducts) {
        file << id;
        for (int p : prods) {
            file << " " << p;
        }
        file << "\n";
    }
}