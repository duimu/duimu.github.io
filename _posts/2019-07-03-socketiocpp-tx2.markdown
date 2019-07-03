---
layout: post
title: socketiocpp-tx2
date: "2019-07-02 10:31:000"
tags: [socketiocpp, tx2]

---

## 流程:

1 根据上文所述编译boost

2 下载:git clone <https://github.com/socketio/socket.io-client-cpp.git

3 rapidjson
3.1.下载源码 git clone https://github.com/miloyip/rapid
3.2.将源码目录下的 include/rapidjson copy到socket.io-client-cpp/lib目录下即可

4websocketpp
4.1.下载源码git clone https://github.com/zaphoyd/websocketpp.git
4.2.下载成功后并不需要做任何工作，直接将websocketpp目录下的websocketpp目录copy到socket.io-client-cpp/lib目录下即可

2 在socketio工程根目录下执行,根据自己的配置修改加粗部分。如果不需要ssh，可以不用配置

cmake -DBOOST_ROOT:STRING=**/home/nvidia/code/v50/boost_1_58_0** -DBOOST_VER:STRING=1.58.0 INCLUDE_DIRECTORIES=./lib -DCMAKE_C_COMPILER=**/usr/bin/aarch64-linux-gnu-gcc-5** -DCMAKE_CXX_COMPILER=**/usr/bin/aarch64-linux-gnu-g++-5** -DCMAKE_CXX_FLAGS:STRING="-I./lib -std=c++11 -fPIC" ./

---------------------

附:在tx2上使用时发现socket emit报错，将emit修改为其它名称如emitData可以解决该问题