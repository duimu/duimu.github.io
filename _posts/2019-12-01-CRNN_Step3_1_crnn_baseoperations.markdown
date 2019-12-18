---
layout: post
title: tensorflow_Step3_1_crnn_baseoperations
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

@Created on: 2019/12/17 11:05
"""
import tensorflow as tf
import numpy as np

from tensorflow.contrib import rnn
from cnn_basenet import *
from Step1_getdatatxt import *
from Step0_CrnnDefines import *


def _conv_stage(inputdata, out_dims, name):
    """ Standard VGG convolutional stage: 2d conv, relu, and maxpool

    :param inputdata: 4D tensor batch x width x height x channels
    :param out_dims: number of output channels / filters
    :return: the maxpooled output of the stage
    """
    with tf.variable_scope(name_or_scope=name):
        conv = CNNBaseModel.conv2d(
            inputdata=inputdata, out_channel=out_dims,
            kernel_size=3, stride=1, use_bias=True, name='conv'
        )
        bn = CNNBaseModel.layerbn(
            inputdata=conv, is_training=g_is_training, name='bn'
        )
        relu = CNNBaseModel.relu(
            inputdata=bn, name='relu'
        )
        max_pool = CNNBaseModel.maxpooling(
            inputdata=relu, kernel_size=2, stride=2, name='max_pool'
        )
    return max_pool


def dropout(inputdata, keep_prob, is_training, name, noise_shape=None):
    """

    :param name:
    :param inputdata:
    :param keep_prob:
    :param is_training
    :param noise_shape:
    :return:
    """

    return tf.cond(
        pred=is_training,
        true_fn=lambda: tf.nn.dropout(
            inputdata, keep_prob=keep_prob, noise_shape=noise_shape
        ),
        false_fn=lambda: inputdata,
        name=name
    )


def decode_a_seq(indexes, spars_tensor):
    decoded = []
    for m in indexes:
        str = g_dict[spars_tensor[1][m]]
        decoded.append(str)
    return decoded


# 稀疏矩阵转序列列表
def decode_sparse_tensor(sparse_tensor):
    decoded_indexes = list()
    current_i = 0
    current_seq = []
    for offset, i_and_index in enumerate(sparse_tensor[0]):
        i = i_and_index[0]
        if i != current_i:
            decoded_indexes.append(current_seq)
            current_i = i
            current_seq = list()
        current_seq.append(offset)
    decoded_indexes.append(current_seq)
    result = []
    for index in decoded_indexes:
        result.append(decode_a_seq(index, sparse_tensor))
    return result


# 转化一个序列列表为稀疏矩阵
def sparse_tuple_from(sequences, dtype=np.int32):
    """    Create a sparse representention of x.
      Args:
        sequences: a list of lists of type dtype where each element is a sequence
    Returns:
        A tuple with (indices, values, shape)
    """
    indices = []
    values = []

    for n, seq in enumerate(sequences):
        indices.extend(zip([n] * len(seq), range(len(seq))))
        values.extend(seq)

    indices = np.asarray(indices, dtype=np.int64)
    values = np.asarray(values, dtype=dtype)
    shape = np.asarray([len(sequences), np.asarray(indices).max(0)[1] + 1], dtype=np.int64)

    return indices, values, shape

#将稀疏矩阵转化为字符串比较准确率
def getaccuracy(decoded_list, test_targets):
    original_list = decode_sparse_tensor(test_targets)
    detected_list = decode_sparse_tensor(decoded_list)
    true_numer = 0
    if len(original_list) != len(detected_list):
        print("len(original_list)",
              len(original_list),
              "len(detected_list)",
              len(detected_list),
              " 长度不匹配")
        return
    print("T/F: original(length) <-------> detectcted(length)")
    for idx, number in enumerate(original_list):
        detect_number = detected_list[idx]
        hit = (number == detect_number)
        print(hit, number, "(", len(number), ") <-------> ", detect_number, "(", len(detect_number), ")")
        if hit:
            true_numer = true_numer + 1
    print("精度:", true_numer * 1.0 / len(original_list))

#生成cnn特征
def CNN(inputdata):
    conv1 = _conv_stage(
        inputdata=inputdata, out_dims=64, name='conv1'
    )
    conv2 = _conv_stage(
        inputdata=conv1, out_dims=128, name='conv2'
    )
    conv3 = CNNBaseModel.conv2d(
        inputdata=conv2, out_channel=256, kernel_size=3, stride=1, use_bias=False, name='conv3'
    )
    bn3 = CNNBaseModel.layerbn(
        inputdata=conv3, is_training=g_is_training, name='bn3'
    )
    relu3 = CNNBaseModel.relu(
        inputdata=bn3, name='relu3'
    )
    conv4 = CNNBaseModel.conv2d(
        inputdata=relu3, out_channel=256, kernel_size=3, stride=1, use_bias=False, name='conv4'
    )
    bn4 = CNNBaseModel.layerbn(
        inputdata=conv4, is_training=g_is_training, name='bn4'
    )
    relu4 = CNNBaseModel.relu(
        inputdata=bn4, name='relu4')
    max_pool4 = CNNBaseModel.maxpooling(
        inputdata=relu4, kernel_size=[2, 1], stride=[2, 1], padding='VALID', name='max_pool4'
    )
    conv5 = CNNBaseModel.conv2d(
        inputdata=max_pool4, out_channel=512, kernel_size=3, stride=1, use_bias=False, name='conv5'
    )
    bn5 = CNNBaseModel.layerbn(
        inputdata=conv5, is_training=g_is_training, name='bn5'
    )
    relu5 = CNNBaseModel.relu(
        inputdata=bn5, name='bn5'
    )
    conv6 = CNNBaseModel.conv2d(
        inputdata=relu5, out_channel=512, kernel_size=3, stride=1, use_bias=False, name='conv6'
    )
    bn6 = CNNBaseModel.layerbn(
        inputdata=conv6, is_training=g_is_training, name='bn6'
    )
    relu6 = CNNBaseModel.relu(
        inputdata=bn6, name='relu6'
    )
    max_pool6 = CNNBaseModel.maxpooling(
        inputdata=relu6, kernel_size=[2, 1], stride=[2, 1], name='max_pool6'
    )
    conv7 = CNNBaseModel.conv2d(
        inputdata=max_pool6, out_channel=512, kernel_size=2, stride=[2, 1], use_bias=False, name='conv7'
    )
    bn7 = CNNBaseModel.layerbn(
        inputdata=conv7, is_training=g_is_training, name='bn7'
    )
    relu7 = CNNBaseModel.relu(
        inputdata=bn7, name='bn7'
    )
    return relu7


#转化lstm特征
def LSTM(inputs):
    # 定义LSTM网络
    _hidden_nums = g_num_hidden
    _layers_nums = g_num_layers
    fw_cell_list = [tf.nn.rnn_cell.LSTMCell(nh, forget_bias=1.0) for
                    nh in [_hidden_nums] * _layers_nums]
    # Backward direction cells
    bw_cell_list = [tf.nn.rnn_cell.LSTMCell(nh, forget_bias=1.0) for
                    nh in [_hidden_nums] * _layers_nums]

    stack_lstm_layer, _, _ = rnn.stack_bidirectional_dynamic_rnn(
        fw_cell_list,
        bw_cell_list,
        inputs,
        dtype=tf.float32
    )
    stack_lstm_layer = dropout(
        inputdata=stack_lstm_layer,
        keep_prob=0.5,
        is_training=g_is_training,
        name='sequence_drop_out'
    )

    [batch_s, _, hidden_nums] = inputs.get_shape().as_list()  # [batch, width, 2*n_hidden]

    shape = tf.shape(stack_lstm_layer)

    rnn_reshaped = tf.reshape(stack_lstm_layer, [shape[0] * shape[1], shape[2]])

    return shape, hidden_nums, rnn_reshaped

#生成crnn特征
def Getfeature(inputs):
    # 获取cnn特征
    cnn_output = CNN(inputs)
    # 将4维转化为3维
    reshaped_cnn_output = tf.squeeze(cnn_output, [1])
    # 获取lstm特征
    shape, hidden_nums, outputs = LSTM(reshaped_cnn_output)
    # 定义w,b
    w = tf.Variable(
        tf.truncated_normal([hidden_nums, g_num_classes], stddev=0.1), name="W"
    )
    b = tf.Variable(tf.constant(0.0, shape=[g_num_classes]), name="b")

    # Doing the affine projection
    logits = tf.matmul(outputs, w, name='logits')
    logits = tf.reshape(logits, [shape[0], shape[1], g_num_classes], name='logits_reshape')

    # 结果
    raw_pred = tf.argmax(tf.nn.softmax(logits), axis=2, name='raw_prediction')

    # Swap batch and batch axis
    # 将结果转为[timestamp, batch, n_classes]，便于计算ctc
    rnn_out = tf.transpose(logits, [1, 0, 2], name='transpose_time_major')

    return rnn_out





```