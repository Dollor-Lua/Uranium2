#include <iostream>
#include <string>
#include <cstdlib>

#include "../inc/util.h"
#include "../inc/json.hpp"

using json = nlohmann::json;

using namespace std;
int main(int argc, char **argv)
{
    string cwd = getWorkingDirectory();

    if (argc != 2)
    {
        std::cout << "\x1b[31merror\x1b[0m No command provided." << std::endl;
        std::cout << "\x1b[34minfo\x1b[0m Provide a command in package.json as parameter 2." << std::endl;
        return 1;
    }

    string arg(argv[1]);
    if (fileExists(cwd + "/package.json"))
    {
        string package = readfile(cwd + "/package.json");
        auto json = json::parse(package.c_str());
        if (json["scripts"] != NULL)
        {
            if (json["scripts"][arg.c_str()] != NULL)
            {
                string torun(json["scripts"][arg.c_str()]);
                cout << "\x1b[90m$ " << torun << "\x1b[0m" << endl;
                system(torun.c_str());
            }
        }
    }

    return 0;
}