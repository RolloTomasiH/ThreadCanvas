' ThreadCanvas Silent Launcher for Windows
' Launches ThreadCanvas.bat in the background without showing a command prompt window.

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

strScriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
strBatPath = strScriptDir & "\ThreadCanvas.bat"

If fso.FileExists(strBatPath) Then
    ' Run with window style 0 (hidden)
    WshShell.Run """" & strBatPath & """", 0, False
Else
    MsgBox "找不到运行脚本: " & strBatPath, 16, "ThreadCanvas"
End If
