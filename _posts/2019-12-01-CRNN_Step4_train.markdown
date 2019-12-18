---
layout: post
title: tensorflow_Step4_train
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
import h5py
import cv2

from Step1_getdatatxt import *
from Step2_WritetfRecord import *
from Step3_1_crnn_baseoperations import *


def TrainCRNN(trainfile, valfile, batchsize, resize_height, resize_width, channels):
    g_is_training = tf.cast(True, tf.bool)

    # inputs
    inputs = tf.placeholder(tf.float32, [batchsize, resize_height, resize_width, channels], name="input")
    # labels
    labels = tf.sparse_placeholder(tf.int32, name="labels")

    # cnn特征 lstm特征
    crnn_out_np = Getfeature(inputs)

    # 计算loss
    # time_major=True(默认)时为：max_time_step  * batch_size * num_classes
    # 否则形状为：batch_size * max_time_step  * num_classes
    loss = tf.nn.ctc_loss(
        labels=labels, inputs=crnn_out_np,
        sequence_length=g_seq_len * np.ones(batchsize)
    )
    cost = tf.reduce_mean(loss)

    optimizer = tf.train.AdamOptimizer(learning_rate=0.0001).minimize(cost)

    # tf.train.MomentumOptimizer( learning_rate=0.0001, momentum=0.9).minimize(cost)
    # The decoded answer
    decoded, log_prob = tf.nn.ctc_beam_search_decoder(
        crnn_out_np,
        g_seq_len * np.ones(batchsize),
        merge_repeated=False
    )
    sequence_dist = tf.reduce_mean(
        tf.edit_distance(tf.cast(decoded[0], tf.int32), labels),
        name='train_edit_distance'
    )
    # acc
    acc = tf.reduce_mean(tf.edit_distance(tf.cast(decoded[0], tf.int32), labels))
    # 获取数据------------------------------------------------------------------------------------------
    init = tf.global_variables_initializer()

    tf_image, tf_label= read_records(trainfile,
                                         resize_height,
                                         resize_width,
                                         channel=channels,
                                         type='normalization')

    tf_image_v, tf_label_v = read_records(valfile,
                                           resize_height,
                                           resize_width,
                                           channel=channels,
                                           type='normalization')

    with tf.Session() as sess:  # 开始一个会话
        sess.run(init)
        saver = tf.train.Saver(tf.global_variables(), max_to_keep=100)
        coord = tf.train.Coordinator()
        threads = tf.train.start_queue_runners(coord=coord)
        model_file = tf.train.latest_checkpoint('F:\\0_dataset\\mjsynth\\model\\')
        #saver.restore(sess, model_file)

        for nStep in range(1000):
            for n in range(10000):
                imagesbatch = np.zeros([batchsize, resize_height, resize_width, 3])
                lablesbatch = []
                # 获取数据
                for i in range(batchsize):
                    image, label = sess.run([tf_image, tf_label])  # 在会话中取出image和label
                    imagesbatch[i, :] = image
                    lablesbatch.append(list(label))
                lablesbatch = np.squeeze(lablesbatch, axis=1)
                lablesbatch = sparse_tuple_from(lablesbatch)
                # 训练集
                sess.run(optimizer, feed_dict={inputs: imagesbatch, labels: lablesbatch})
                costValue = sess.run(cost, feed_dict={inputs: imagesbatch, labels: lablesbatch})
                if n % 100 == 0:
                    print("epoch:%2d,step:%2d,cost:%.2f" % (nStep, n, costValue))

            # 验证集
            imagesbatch_v = np.zeros([batchsize, resize_height, resize_width, 3])
            lablesbatch_v = []
            for i in range(batchsize):
                image_v, label_v = sess.run(
                    [tf_image_v, tf_label_v])  # 在会话中取出image和label
                imagesbatch_v[i, :] = image_v
                lablesbatch_v.append(list(label_v))

            lablesbatch_v = np.squeeze(lablesbatch_v, axis=1)
            lablesbatch_v = sparse_tuple_from(lablesbatch_v)

            accValue, decoded_v = sess.run([acc, decoded[0]], feed_dict={inputs: imagesbatch_v, labels: lablesbatch_v})
            print("epoch:%2d,cost:%.2f,dis:%.2f" % (nStep, costValue, accValue))
            getaccuracy(decoded_v, lablesbatch_v)
            saver.save(sess, 'F:\\0_dataset\\mjsynth\\model\\OCR', write_meta_graph=True, global_step=nStep)
        # 停止所有线程
        coord.request_stop()
        coord.join(threads)



if __name__ == '__main__':
    TrainCRNN('F:/0_dataset/mjsynth/train1.tfrecords',
              'F:/0_dataset/mjsynth/val1.tfrecords',
              32,
              32,
              100,
              3)






```