---
title: ssd
layout: post
date: "2019-09-06 14:12"
tags: [tensorflow]

---



## Windows 10 流程:

1 Git 从https://github.com/balancap/SSD-Tensorflow.git

2 测试：下面两个方法均测试通过

​	方式1：使用juypter notebook ，使用时若报相关的错误，使用pip3 installl  ***安装。

​    方式2：将下面代码保存为TestSSD.py ，需要注意的是：ckpt_filename和测试文件夹的path路径均需要完整路径，否则会报Saver相关的错

```
import os
import math
import random

import numpy as np
import tensorflow as tf
import cv2

slim = tf.contrib.slim
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import sys

sys.path.append('../')
from nets import ssd_vgg_300, ssd_common, np_methods
from preprocessing import ssd_vgg_preprocessing
from notebooks import visualization

# TensorFlow session: grow memory when needed. TF, DO NOT USE ALL MY GPU MEMORY!!!
gpu_options = tf.GPUOptions(allow_growth=True)
config = tf.ConfigProto(log_device_placement=False, gpu_options=gpu_options)
isess = tf.InteractiveSession(config=config)
# Input placeholder.
net_shape = (300, 300)
data_format = 'NHWC'
img_input = tf.placeholder(tf.uint8, shape=(None, None, 3))
# Evaluation pre-processing: resize to SSD net shape.
image_pre, labels_pre, bboxes_pre, bbox_img = ssd_vgg_preprocessing.preprocess_for_eval(
    img_input, None, None, net_shape, data_format, resize=ssd_vgg_preprocessing.Resize.WARP_RESIZE)
image_4d = tf.expand_dims(image_pre, 0)

# Define the SSD model.
reuse = True if 'ssd_net' in locals() else None
ssd_net = ssd_vgg_300.SSDNet()
with slim.arg_scope(ssd_net.arg_scope(data_format=data_format)):
    predictions, localisations, _, _ = ssd_net.net(image_4d, is_training=False, reuse=reuse)

# Restore SSD model.
ckpt_filename = 'E:/tensorflow/SSD-Tensorflow/checkpoints/ssd_300_vgg.ckpt'
# ckpt_filename = '..\checkpoints\ssd_300_vgg.ckpt'
isess.run(tf.global_variables_initializer())
saver = tf.train.Saver()
saver.restore(isess, ckpt_filename)

# SSD default anchor boxes.
ssd_anchors = ssd_net.anchors(net_shape)


# Main image processing routine.
def process_image(img, select_threshold=0.5, nms_threshold=.45, net_shape=(300, 300)):
    # Run SSD network.
    rimg, rpredictions, rlocalisations, rbbox_img = isess.run([image_4d, predictions, localisations, bbox_img],
                                                              feed_dict={img_input: img})

    # Get classes and bboxes from the net outputs.
    rclasses, rscores, rbboxes = np_methods.ssd_bboxes_select(
        rpredictions, rlocalisations, ssd_anchors,
        select_threshold=select_threshold, img_shape=net_shape, num_classes=21, decode=True)

    rbboxes = np_methods.bboxes_clip(rbbox_img, rbboxes)
    rclasses, rscores, rbboxes = np_methods.bboxes_sort(rclasses, rscores, rbboxes, top_k=400)
    rclasses, rscores, rbboxes = np_methods.bboxes_nms(rclasses, rscores, rbboxes, nms_threshold=nms_threshold)
    # Resize bboxes to original image shape. Note: useless for Resize.WARP!
    rbboxes = np_methods.bboxes_resize(rbbox_img, rbboxes)
    return rclasses, rscores, rbboxes


# Test on some demo image and visualize output.
# 测试的文件夹
path = 'E:/tensorflow/SSD-Tensorflow/demo/'
image_names = sorted(os.listdir(path))
# 文件夹中的第几张图，-1代表最后一张
img = mpimg.imread(path + image_names[-1])
rclasses, rscores, rbboxes = process_image(img)

# visualization.bboxes_draw_on_img(img, rclasses, rscores, rbboxes, visualization.colors_plasma)
visualization.plt_bboxes(img, rclasses, rscores, rbboxes)

```



3 训练

  tf_convert_data.py 将数据转化成tensorflow格式

  train_ssd_network.py 训练数据，命令如下，其中batch_size根据需要调整大小，1060GPU建议为12  

```
python train_ssd_network.py    
--train_dir=E:\tensorflow\SSD-Tensorflow\train_model    
--dataset_dir=E:\tensorflow\SSD-Tensorflow\tfrecords_   
--dataset_name=pascalvoc_2007     
--dataset_split_name=train     
--model_name=ssd_300_vgg     
--checkpoint_path=E:\tensorflow\SSD-Tensorflow\checkpoints\ssd_300_vgg.ckpt     
--save_summaries_secs=60     
--save_interval_secs=600     
--weight_decay=0.0005     
--optimizer=adam     
--learning_rate=0.001     
--batch_size=32   
--gpu_memory_fraction=0.5
```



参数含义:

```
train_dir：#训练生成模型的存放路径
dataset_dir：#数据存放路径
dataset_name：#数据名的前缀

dataset_split_name：#从dataset_dir文件夹中分割文件名用，如dataset_dir中间夹中文件名为：		   #voc_2007_train_017.tfrecord .....
# 则dataset_split_name为 train

model_name: 加载的模型的名字
checkpoint_path: 所加载模型的路径
checkpoint_model_scope：所加载模型里面的作用域名
checkpoint_exclude_scopes：指定哪些层的参数不需要从vgg16模型里面加载进来
trainable_scopes：指定哪些层的参数是需要训练的，未指定的参数保持不变,若注释掉此命令，所有的参数均需要训练
save_summaries_secs：多久保存一下日志
save_interval_secs：多久保存一下模型
weight_decay：正则化的权值衰减的系数
optimizer：选取的最优化函数
learning_rate：学习率
learning_rate_decay_factor：学习率的衰减因子
batch_size：每一批次处理的图片数量
```

