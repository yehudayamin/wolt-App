#ifndef STDOUT_OUTPUT_HANDLER_H
#define STDOUT_OUTPUT_HANDLER_H
#include "../interfaces/IOutputHandler.h"

// Concrete implementation of IOutputHandler that writes output to stdout.
// This is the default output destination for the CLI application.

class StdoutOutputHandler : public IOutputHandler {
    public:

      /// @brief the function prints to screen (std) the line and ends with new line
      /// @param line : the line we want to print to the screen
      void writeLine (const std::string& line) override;

};

#endif
