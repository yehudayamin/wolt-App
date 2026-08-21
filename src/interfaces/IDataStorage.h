#ifndef IDATA_STORAGE_H
#define IDATA_STORAGE_H

#include <vector>
// Interface for data storage. Responsible for persisting and retrieving
// user-product associations. Implementations may store data in files,
// databases, or any other medium without affecting the rest of the system.

class IDataStorage {
public:
    // destructor
    virtual ~IDataStorage() = default;

    /// @brief this method will handle adding product to a user
    /// @param userId user id
    /// @param productId product id (product num...)
    virtual void addProduct(int userId, int productId) = 0;

    /// @brief this method will return all the products of the user
    /// @param userId user id
    /// @return vector of the products.. each product is represented by its product id
    virtual std::vector<int> getProducts(int userId) = 0;

    /// @brief this method will return a vector of users ids
    /// @return vector of all users ids
    virtual std::vector<int> getAllUsers() = 0;

    /// @brief checks whether a user exists in storage
    /// @param userId user id to check
    /// @return true if the user exists, false otherwise
    virtual bool userExists(int userId) = 0;

    /// @brief removes specific product views from an existing user
    /// @param userId user id
    /// @param productIds list of product ids to remove
    virtual void removeProducts(int userId, const std::vector<int>& productIds) = 0;

};

#endif
