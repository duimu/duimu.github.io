---
layout: post
title: tensorflow_Step0_CrnnDefines
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

@Created on: 2019/12/17 11:10

全局定义

"""
import tensorflow as tf

#label中所有的字符类别
g_dict=" ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

#字典字符个数
g_num_classes = 37

#标签中字符最多的个数
g_MaxLableCount=10
"""
#可以使用此函数生成
def CreateDict():
    dict={'blank':0}
    for index in range(0,26):
        char=chr(ord('A')+index)
        dict[char]=index +1

    for index in range(0,10):
        char=chr(ord('0')+index)
        dict[char] = index + 26

    return dict
"""

g_is_training = tf.cast(True, tf.bool)

#lstm 隐含层单元个数
g_num_hidden = 256

#lstm 隐含层个数
g_num_layers = 2

#读取字符串长度
g_seq_len=25

#字符图片resize后的高度
g_image_height=32

#字符图片resize后的宽度
g_image_width=100

#字符图片图像通道
g_iamge_channels=3

g_batch_size=32





```