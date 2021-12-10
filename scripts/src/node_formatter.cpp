#include "../inc/node_formatter.h"
#include "../inc/util.h"

#include <string>
#include <vector>

using namespace std;
string format_exec(string exec)
{
    bool win32 = false;
#ifdef _WIN32
    win32 = true;
#endif

    vector<string> splitted = split(exec, ' ');
    int pos = -1;

    string comp;
    for (string str : splitted)
    {
        pos++;
        if (str == "&&")
            pos = -1;
        if (pos == 0 && !fileExists(str))
        {
            comp += "./node_modules/.bin/" + str + (win32 ? ".cmd" : "");
            continue;
        }

        comp += str;
    }

    return comp;
}