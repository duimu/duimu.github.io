---
layout: post
title: tensorflow_Step1_getdatatxt
date: "2019-12-01 14:00:000"
tags: [tensorflow, CRNN]

---

## 流程:

```

# -*- coding: utf-8 -*-

"""
@from:www.linerect.com

@author:  duimu

@contact: duimu@qq.com

@Created on: 2019/12/17 10:34
本demo完全根据mjsynth 数据集进行测试，如果需要根据自己的图片生成，可以按照实例操作
第一步：
"""
import tensorflow as tf
import numpy as np
import os
from Step0_CrnnDefines import *

#根据图片生成所需要的txt文件，该txt文件用来生成tfrecords数据
#按照文件路径 lable的形式存储
def GetCharDic(picPath,writeTrainPath,writeValPath,radiu=0.2):
    """
    :param picPath: 图片目录   eg: d:/dataset/images
    :param writeTrainPath: 生成train.txt的详细路径  eg: d:/dataset/train.txt
    :param writeValPath:   生成val.txt详细路径  eg: d:/dataset/val.txt
    :param radiu:  验证数据占所有数据中的比率
    :return:
    """
    nameinfo=[]
    for root, dirs, files in os.walk(picPath):
        for f in files:
            info = os.path.join(root, f)
            info=info[len(picPath)+1:]
            f = f.split('_')
            info=info+' '
            for char in f[1]:
                if char >='a'and char <='z':
                    char=str(ord(char)-ord('a')+1)
                elif  char >='A'and char <='Z':
                    char = str(ord(char) - ord('A')+1)
                elif char >='0'and char <='9':
                    char = str(ord(char) - ord('0')+27)
                else:
                    continue
                info=info+char+' '
            nameinfo.append(info)
            if len(nameinfo)%100==0:
                print('size:',len(nameinfo))

    trainfile = open(writeTrainPath, 'w')
    valfile= open(writeValPath, 'w')
    totalcount=len(nameinfo)
    count=0
    valCount=int(totalcount * (1.0 - radiu))
    for line in nameinfo:
        count=count+1
        if count<valCount:
            trainfile.write(line)
            trainfile.write('\n')
        elif count>=valCount:
            valfile.write(line)
            valfile.write('\n')
    trainfile.close()
    valfile.close()


if __name__ == '__main__':
    GetCharDic('F:/0_dataset/mjsynth/set',
               'F:/0_dataset/mjsynth/train1.txt',
               'F:/0_dataset/mjsynth/val1.txt',
               0.2)





```

