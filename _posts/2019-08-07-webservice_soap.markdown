---
layout: post
title: webservice_soap
date: "2019-08-07 16:31:000"
tags: [webservice, soap，vs2015]

---

## 流程:

1 推荐下载gsoap_2.8.0（其它版本未测试）

2拷贝gsoap_2.8.0\gsoap-2.8\gsoap\bin\win32目录下文件到目标文件夹

3 wsdl2h -o 文件名.h http:*//localhost:8087/itoa?wsdl*

4 soapcpp2 -i -C -I D:\gSOAP\gsoap-2.8\gsoap\import 文件名.h  其中 D:\gSOAP\gsoap-2.8\gsoap\import为gsoap下载文件中目录

5 将生成的文件拷贝的工程目录，文件包括（soapC.cpp,soapH.h,soapStub.h,stdsoap2.h,stdsoap2.cpp,---11Proxy.h,---11Proxy.cpp,----.nsmap）其中stdsoap2文件位于gsoap根目录

6 c++预处理器：WITH_NONAMESPACES ；预编译头：不适用预编译头

---------------------

soapcpp2命令含义：

-C 仅生成客户端代码
-S 仅生成服务器端代码
-L 不要产生soapClientLib.c和soapServerLib.c文件
-c 产生纯C代码，否则是C++代码(与头文件有关)
-I 指定import路径
-x 不要产生XML示例文件
-i 生成C++包装