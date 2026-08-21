#ifndef STDIN_INPUT_HANDLER_H
#define STDIN_INPUT_HANDLER_H
#include "../interfaces/IInputHandler.h"

// Concrete implementation of IInputHandler that reads input from stdin.
// This is the default input source for the CLI application.

class StdinInputHandler : public IInputHandler {

    public:
    /// @brief the function read one line from source and write it to line
    /// @param line : where we write the line we read
    /// @return true if success, false otherwise (EOF- End of file);
    bool readLine(std::string& line) override;
};

#endif
