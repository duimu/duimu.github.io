---
layout: post
title: tensorflow_Step5_Test
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

@Created on: 2019/12/4 9:12
"""
import tensorflow as tf
import numpy as np
import os
import cv2
from tensorflow.contrib import rnn
from Step1_getdatatxt import *
from Step2_WritetfRecord import *
from Step3_1_crnn_baseoperations import *


def Inference(image,modelpath):
    g_is_training=tf.cast(False, tf.bool)

    # inputs
    inputs = tf.placeholder(tf.float32, [1, g_image_height, g_image_width, 3], name="input")

    # cnn特征 lstm特征
    crnn_out_np = Getfeature(inputs)

    # The decoded answer
    decoded, log_prob = tf.nn.ctc_beam_search_decoder(
        crnn_out_np,
        g_seq_len * np.ones(1),
        merge_repeated=False
    )

    # 获取数据------------------------------------------------------------------------------------------
    init = tf.global_variables_initializer()

    with tf.Session() as sess:  # 开始一个会话
        sess.run(init)
        saver = tf.train.Saver(tf.global_variables(), max_to_keep=100)
        coord = tf.train.Coordinator()
        model_file = tf.train.latest_checkpoint(modelpath)
        saver.restore(sess, model_file)

        decodestring=sess.run(decoded[0],feed_dict={inputs:image})

        decodestring = decode_sparse_tensor(decodestring)
        return decodestring

if __name__ == '__main__':
    image=cv2.imread('E:\\tensorflow\\char_image\\pro2\\11.jpg')
    image=cv2.resize(image,(g_image_width, g_image_height))
    image = np.asanyarray(image)
    image = image / 255.0
    images=[]
    images.append(image)
    ocrstring=Inference(images,'F:\\0_dataset\\mjsynth\\model\\')
    print(ocrstring)






```