@ECHO OFF

SETLOCAL

SET "NODE_EXE=%~dp0\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "CLI=%~dp0\modules\TKCLI.js"

"%NODE_EXE%" "%CLI%" %*