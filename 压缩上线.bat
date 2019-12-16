@echo off
title 压缩B2C前端代码

@echo 1.正在更新SVN，please wait...
svn update
ping -n 3 127.0.0.1 >nul

start cmd /k "gulp pureBuild"
ping -n 3 127.0.0.1 >nul

color 67
@echo 2.请稍等所有项目编译完成后按任意健继续... &pause>nul
@echo off

title 3.正在打包，请稍等...
@echo 3.正在打包，请稍等...

set dir=上线目录

set zipname=2c.zip
cls
echo 压缩生产版，此时运行指令为‘gulp pureBuild'，文件大小约为4M左右，检查
IF EXIST %zipname% (del %zipname%)
del %dir%\%zipname% 
@echo 以下将压缩前端代码资源至桌面，现为正式生产环境，上线覆盖时注意不要修改线上文件夹的webconfig.js文件
7z a %zipname% "dist" "favicon.ico" "humans.txt" "robots.txt" "*.html" "webconfig.js" 
@echo 压缩成功
color 2F
title 打包完成。
@echo 打包完成，2S自动退出
start .
ping -n 3 127.0.0.1 >nul && exit()