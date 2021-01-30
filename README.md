# Tanoshi
Selfhosted web manga reader with extension model.

Rewrite in progress of [Tanoshi](https://github.com/faldez/tanoshi/tree/rust), track issue [here](https://github.com/faldez/tanoshi/issues/137)


For standalone mode to works on windows, it is necessary to add loopback excempt

```powershell
CheckNetIsolation.exe LoopbackExempt -a -n="Microsoft.Win32WebViewHost_cw5n1
h2txyewy"
```