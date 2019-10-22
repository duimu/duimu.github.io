---
title: gdbImagewatch qt ubuntu
layout: post
date: "2019-10-22 14:12"
tags: [tensorflow]

---



## 流程:

1 Git 从https://github.com/csantosbh/gdb-imagewatch.git

2 sudo apt-get install libpython3-dev python3-dev

如果安装过程中出现安装包不匹配的错误，可以降级安装

 sudo aptitude install libpython3-dev python3-dev

3  安装

```
mkdir build && cd build
qmake .. BUILD_MODE=release
make -j4
sudo  make install
```

4 将脚本和qt相关联

```
菜单栏 >> Tools >> Options >> Debugger >> GDB >> Extra Debugging Helpers 设定（文件是之前 ImageWatch 插件 build 文件夹下的 gdb-imagewatch.py)
```

