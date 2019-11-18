---
title: tensorflow windows安装
layout: post
date: "2018-09-01 14:12"
tags: [tensorflow]

---



## Windows 10 流程:

环境：

tensorflow1.2.0

cuda8

win10

若为其他环境，查看硬件支持情况后，选择合适的版本，

！！！强烈建议根据官网说明安装，否则版本问题很容易出错

官网:https://tensorflow.google.cn/

```
https://tensorflow.google.cn/install/pip

经过测试的构建配置
Linux-----------------------------------------------------------------------
版本	Python 版本	编译器	编译工具
tensorflow-1.13.1	2.7、3.3-3.6	GCC 4.8	Bazel 0.19.2
tensorflow-1.12.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.15.0
tensorflow-1.11.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.15.0
tensorflow-1.10.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.15.0
tensorflow-1.9.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.11.0
tensorflow-1.8.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.10.0
tensorflow-1.7.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.10.0
tensorflow-1.6.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.9.0
tensorflow-1.5.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.8.0
tensorflow-1.4.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.5.4
tensorflow-1.3.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.5
tensorflow-1.2.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.5
tensorflow-1.1.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.2
tensorflow-1.0.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.2
版本	Python 版本	编译器	编译工具	cuDNN	CUDA
tensorflow_gpu-1.13.1	2.7、3.3-3.6	GCC 4.8	Bazel 0.19.2	7.4	10.0
tensorflow_gpu-1.12.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.15.0	7	9
tensorflow_gpu-1.11.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.15.0	7	9
tensorflow_gpu-1.10.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.15.0	7	9
tensorflow_gpu-1.9.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.11.0	7	9
tensorflow_gpu-1.8.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.10.0	7	9
tensorflow_gpu-1.7.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.9.0	7	9
tensorflow_gpu-1.6.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.9.0	7	9
tensorflow_gpu-1.5.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.8.0	7	9
tensorflow_gpu-1.4.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.5.4	6	8
tensorflow_gpu-1.3.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.5	6	8
tensorflow_gpu-1.2.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.5	5.1	8
tensorflow_gpu-1.1.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.2	5.1	8
tensorflow_gpu-1.0.0	2.7、3.3-3.6	GCC 4.8	Bazel 0.4.2	5.1	8


macOS----------------------------------------------------------------------
CPU
版本	Python 版本	编译器	编译工具
tensorflow-1.13.1	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.19.2
tensorflow-1.12.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.15.0
tensorflow-1.11.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.15.0
tensorflow-1.10.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.15.0
tensorflow-1.9.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.11.0
tensorflow-1.8.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.10.1
tensorflow-1.7.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.10.1
tensorflow-1.6.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.8.1
tensorflow-1.5.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.8.1
tensorflow-1.4.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.5.4
tensorflow-1.3.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.4.5
tensorflow-1.2.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.4.5
tensorflow-1.1.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.4.2
tensorflow-1.0.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.4.2
GPU
版本	Python 版本	编译器	编译工具	cuDNN	CUDA
tensorflow_gpu-1.1.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.4.2	5.1	8
tensorflow_gpu-1.0.0	2.7、3.3-3.6	XCode 中的 Clang	Bazel 0.4.2	5.1	8



windows----------------------------------------------------------------------
CPU
版本	Python 版本	编译器	编译工具
tensorflow-1.13.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.12.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.11.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.10.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.9.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.8.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.7.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.6.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.5.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.4.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.3.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.2.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.1.0	3.5	MSVC 2015 update 3	Cmake v3.6.3
tensorflow-1.0.0	3.5	MSVC 2015 update 3	Cmake v3.6.3
GPU
版本	Python 版本	编译器	编译工具	cuDNN	CUDA
tensorflow_gpu-1.13.0	3.5-3.6	MSVC 2015 update 3	Bazel 0.15.0	7	9
tensorflow_gpu-1.12.0	3.5-3.6	MSVC 2015 update 3	Bazel 0.15.0	7	9
tensorflow_gpu-1.11.0	3.5-3.6	MSVC 2015 update 3	Bazel 0.15.0	7	9
tensorflow_gpu-1.10.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	7	9
tensorflow_gpu-1.9.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	7	9
tensorflow_gpu-1.8.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	7	9
tensorflow_gpu-1.7.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	7	9
tensorflow_gpu-1.6.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	7	9
tensorflow_gpu-1.5.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	7	9
tensorflow_gpu-1.4.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	6	8
tensorflow_gpu-1.3.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	6	8
tensorflow_gpu-1.2.0	3.5-3.6	MSVC 2015 update 3	Cmake v3.6.3	5.1	8
tensorflow_gpu-1.1.0	3.5	MSVC 2015 update 3	Cmake v3.6.3	5.1	8
tensorflow_gpu-1.0.0	3.5	MSVC 2015 update 3	Cmake v3.6.3	5.1	8
```

