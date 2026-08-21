#include "StdoutOutputHandler.h"
#include <iostream>

// Implementation of StdoutOutputHandler.
// Handles writing output to the standard output stream.


void StdoutOutputHandler::writeLine (const std::string& line) 
{
    std::cout << line << std::endl;
}
