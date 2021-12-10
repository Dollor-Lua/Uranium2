#include <fstream>
#include <iostream>
#include <string>
#include <vector>
#include <sstream>

#ifdef _WIN32
#include <direct.h>
#define getcwd _getcwd // stupid MSFT "deprecation" warning
#elif
#include <unistd.h>
#endif

using namespace std;
bool fileExists(string filepath);
std::string readfile(string filepath);
std::string getWorkingDirectory();
std::vector<std::string> split(std::string str, char delim);