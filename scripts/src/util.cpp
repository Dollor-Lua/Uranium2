#include "../inc/util.h"

using namespace std;

bool fileExists(string filepath)
{
    ifstream file(filepath.c_str());
    return file.good();
}

std::string readfile(string filepath)
{
    string contents;
    ifstream file(filepath.c_str());

    string cline;
    while (getline(file, cline))
    {
        contents += cline;
        continue;
    }

    file.close();

    return contents;
}

std::string getWorkingDirectory()
{
    char buffer[4096];
    getcwd(buffer, 4096);
    if (!buffer)
        return "";

    std::string buffer2(buffer);
    return buffer2;
}

std::vector<std::string> split(std::string str, char delim) {
    vector<string> strings;
    istringstream f(str.c_str());
    string s;    
    while (getline(f, s, delim)) {
        cout << s << endl;
        strings.push_back(s);
    }

    return strings;
}