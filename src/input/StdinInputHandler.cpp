#include "StdinInputHandler.h"
#include <string>
#include <iostream>
#include <algorithm>

// Implementation of StdinInputHandler.
// Handles reading lines of input from the standard input stream.

bool StdinInputHandler::readLine(std::string& line)
{
    //getline read from terminal one line and write it to line, if success: return 1(true), o.w: false;
    bool result = (bool)std::getline(std::cin, line);

    if (result) {
        if (!line.empty() && line.back() == '\r') {
            line.pop_back();
        }
        line.erase(std::remove_if(line.begin(), line.end(), [](unsigned char c) {
            // checks if there is hebrew letters in the input.
            return c > 127 || std::iscntrl(c);
        }), line.end());
    }

    return result;
}
