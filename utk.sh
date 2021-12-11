#!/usr/bin/env bash

# This shell script is based off of the bin/npm file (https://github.com/npm/cli/blob/latest/bin/npm)
# Tested with CYGWIN64

(set -o igncr) 2>/dev/null && set -o igncr; # cygwin encoding fix

basedir=`dirname "$0"`

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

NODE_EXE="$basedir/node.exe"
if ! [ -x "$NODE_EXE" ]; then
    NODE_EXE="$basedir/node"
fi
if ! [ -x "$NODE_EXE" ]; then
    NODE_EXE=node
fi

CLI="./modules/TKCLI.js"

CLI_PREFIX=`"$NODE_EXE" "$CLI" prefix -g`
if [ $? -ne 0 ]; then
    echo "Could not determine Node.js install directory" >&2
    exit 1
fi

"$NODE_EXE" "$CLI" "$@"