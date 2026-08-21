#ifndef IOUTPUT_HANDLER_H
#define IOUTPUT_HANDLER_H
#include <string>

// Interface for output handling. Abstracts the destination of program output,
// allowing the system to write to stdout, files, sockets, or any other target without modifying the core logic.

class IOutputHandler {
public:
    virtual ~IOutputHandler() = default;

    /// @brief the function gets line to write to destination .
    /// @param line: the line we want to write to destination .
    virtual void writeLine (const std::string& line)=0;
};


#endif
