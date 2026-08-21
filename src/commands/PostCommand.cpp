#include "PostCommand.h"

PostCommand::PostCommand(IDataStorage& storage, IOutputHandler& output) : storage(storage) , output(output){}

void PostCommand::execute(const std::vector<std::string>& args)
{

    if (args.size()<2) return output.writeLine("400 Bad Request"); //check if args has only userid without products
    int userid;

    try
    {
        size_t pos;
        userid=std::stoi(args[0], &pos);
        if (pos != args[0].size()) return output.writeLine("400 Bad Request");
    }
    catch (...) {return output.writeLine("400 Bad Request");}

    int productId;

    for (size_t i=1;i<args.size();i++)
    {
        try{
            size_t pos;
            productId=std::stoi(args[i], &pos);
            if (pos != args[i].size()) return output.writeLine("400 Bad Request");
        }
        catch(...){ return output.writeLine("400 Bad Request");}
    }

    if (storage.userExists(userid)) return output.writeLine("404 Not Found");

    // all product IDs are valid integers — safe to add them to storage

    for (size_t i=1;i<args.size();i++)
    {
        productId = std::stoi(args[i]);
        storage.addProduct(userid,productId);
    }

    output.writeLine("201 Created");

}

/// @brief Returns the command keyword
/// @return the command name 
std::string PostCommand::getName() const{
    return "POST";
}

/// @brief Returns the usage line printed by the help command
/// @return the description string (e.g. "add [userid] [productid1] [productid2] ...")
std::string PostCommand::getDescription() const{
    return "POST [userid] [productid1] [productid2] ...";
}

/// @return "[userid] [productid1] [productid2] ..."
std::string PostCommand::getArguments() const{
    return "[userid] [productid1] [productid2] ...";
}