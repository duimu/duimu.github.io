---
title: socketio-cpp
layout: post
date: "2019-06-25 09:29"
tags: [socketio,c++]
---



## windows下编译socketiocpp:

1 下载 https://www.boost.org/，建议1.58版本

2 使用vs命令行工具，如vs2015_x86_64兼容工具命令，进入文件解压目录，运行bootstrap.bat命令,编译完文件会在stage目录中，如：

F:\4_Libs\boost_1_70_0\stage

```
  cd  F:\4_Libs\boost_1_70_0
  bootstrap.bat
  ./b2
```

   3 下载websocketpp :https://github.com/zaphoyd/websocketpp.git（0.60版本）

   4 下载rapidjson：https://github.com/Tencent/rapidjson.git

   5  下载socketiocpp:https://github.com/socketio/socket.io-client-cpp.git

   6  打开cmake，选中socketiocpp目录，将boost相关路径全部指定好，库目录都在 boost stage目录中，指定好后Configure,generate即可

  7 打开生成的功能，sioclient.sln，将下载rapidjson，websocketpp 在sioclient工程的c++目录中指定好，编译即可

