#ifndef FILE_DATA_STORAGE_H
#define FILE_DATA_STORAGE_H
#include "../interfaces/IDataStorage.h"
#include <vector>
#include <map>
#include <string>
// Concrete implementation of IDataStorage using the local filesystem.
// Stores and loads user-product associations from a file in the data/ directory.

class FileDataStorage : public IDataStorage {
    private:
        /// @brief file path of the file to store data
        std::string filePath;
        /// @brief it maps user id to a vector with all the products of the user
        std::map<int, std::vector<int>> userProducts;
    public:
        FileDataStorage(const std::string& filePath);

        void addProduct(int userId, int productId) override;
        std::vector<int> getProducts(int userId) override;
        std::vector<int> getAllUsers() override;
        bool userExists(int userId) override;
        void removeProducts(int userId, const std::vector<int>& productIds) override;

};

#endif
