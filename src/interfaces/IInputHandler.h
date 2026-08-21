#ifndef IINPUT_HANDLER_H
#define IINPUT_HANDLER_H
#include <string>

// Interface for input handling. Abstracts the source of user input,
// allowing the system to read from stdin, files, sockets, or any other source without modifying the core logic.

class IInputHandler {
public:
    virtual ~IInputHandler() = default;

    /// @brief the function reads one line from source, writes it to line
    /// @param line: where we write the line we read
    /// @return true if success, false otherwise (EOF- End of file);
    virtual bool readLine(std::string& line)=0;
    
};

#endif
