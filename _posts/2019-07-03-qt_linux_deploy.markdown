---
layout: post
title: qt-linux-deploy
date: "2019-07-02 10:24:000"
tags: [linux, deploy]

---

## 脚本:

1 copy.sh

```
#!/bin/bash

LibDir=$PWD
Target=$1

lib_array=($(ldd $Target | grep -o "/.*" | grep -o "/.*/[^[:space:]]*"))

for Variable in ${lib_array[@]}
do
    cp "$Variable" $LibDir
done

```

2 app.sh

```javascript
#!/bin/sh  
    appname=`basename $0 | sed s,\.sh$,,`  
      
    dirname=`dirname $0`  
    tmp="${dirname#?}"  
      
    if [ "${dirname%$tmp}" != "/" ]; then  
    dirname=$PWD/$dirname  
    fi  
    LD_LIBRARY_PATH=$dirname  
    export LD_LIBRARY_PATH  
    $dirname/$appname "$@"

```



3 操作方式:

1 新建文件发布目录
2 将copy.sh  app.sh拷贝到该目录中

3 将release目录中的so和  **发布程序**  拷贝到该目录

4 sudo ./copy.sh  **发布程序**    将所依赖的库拷贝到当前文件夹

例如 sudo ./copy.sh appName

5 sudo ./app.sh