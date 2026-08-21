#include "DeleteCommand.h"
#include <algorithm>

DeleteCommand::DeleteCommand(IDataStorage& storage, IOutputHandler& output) : storage(storage), output(output) {}

void DeleteCommand::execute(const std::vector<std::string>& args) {
    //must have at least  the userid and one productid
    if (args.size() < 2) {
        output.writeLine("400 Bad Request");
        return;
    }

    //parse and validate userid
    int userId;
    try {
        size_t pos;
        userId = std::stoi(args[0], &pos);
        if (pos != args[0].size()) { output.writeLine("400 Bad Request"); return; }
    } catch (...) {
        output.writeLine("400 Bad Request");
        return;
    }

    //parse and validate all the product ids
    std::vector<int> productIds;
    for (size_t i = 1; i < args.size(); i++) {
        try {
            size_t pos;
            int id = std::stoi(args[i], &pos);
            if (pos != args[i].size()) { output.writeLine("400 Bad Request"); return; }
            productIds.push_back(id);
        } catch (...) {
            output.writeLine("400 Bad Request");
            return;
        }
    }

    //check for duplicate product IDs in the input
    std::vector<int> seen;
    for (int id : productIds) {
        if (std::find(seen.begin(), seen.end(), id) != seen.end()) {
            output.writeLine("404 Not Found");
            return;
        }
        seen.push_back(id);
    }

    //check if the user exists
    if (!storage.userExists(userId)) {
        output.writeLine("404 Not Found");
        return;
    }

    //check that all requested products exist for this user
    std::vector<int> existing = storage.getProducts(userId);
    for (int productId : productIds) {
        if (std::find(existing.begin(), existing.end(), productId) == existing.end()) {
            output.writeLine("404 Not Found");
            return;
        }
    }

    //remove products and respond with 204 No Content
    storage.removeProducts(userId, productIds);
    output.writeLine("204 No Content");
}
//returns the command name
std::string DeleteCommand::getName() const {
    return "DELETE";
}
//returns the usage line for the help command
std::string DeleteCommand::getDescription() const {
    return "DELETE [userid] [productid1] [productid2] ...";
}
//returns the arguments string for the help command output
std::string DeleteCommand::getArguments() const {
    return "[userid] [productid1] [productid2] ...";
}
