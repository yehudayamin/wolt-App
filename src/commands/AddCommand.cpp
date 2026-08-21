#include "AddCommand.h"


AddCommand::AddCommand(IDataStorage& storage) : storage(storage) {}

/// @brief Runs the command with the given arguments
/// @param args tokens after the command name (e.g. for "add 1 100 101", args = {"1", "100", "101"})
void AddCommand::execute(const std::vector<std::string>& args){
    int userId;
    if (args.size() < 2) return; // check if args has only user id without products

    try {
        userId = std::stoi(args[0]); //args[0] is the user id
    }
    catch (...){ return ;}
    int productId;
    //add all products to the user list
    for (size_t i = 1; i < args.size(); i++){
        try {
            productId = std::stoi(args[i]);
        }
        catch(...){return ;}
    }
    
    for (size_t i = 1; i < args.size(); i++){
        productId = std::stoi(args[i]);
        storage.addProduct(userId, productId);
    }
}

/// @brief Returns the command keyword
/// @return the command name (e.g. "add", "recommend", "help")
std::string AddCommand::getName() const{
    return "add";
}

/// @brief Returns the usage line printed by the help command
/// @return the description string (e.g. "add [userid] [productid1] [productid2] ...")
std::string AddCommand::getDescription() const{
    return "add [userid] [productid1] [productid2] ...";
}
