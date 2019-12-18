---
layout: post
title: tensorflow-batch normalization
date: "2019-11-11 14:00:000"
tags: [tensorflow, batch normalization]

---

## 流程:

转(https://www.cnblogs.com/hrlnw/p/7227447.html)

**1.原理**

公式如下：

y=γ(x-μ)/σ+β

其中x是输入，y是输出，μ是均值，σ是方差，γ和β是缩放（scale）、偏移（offset）系数。

一般来讲，这些参数都是基于channel来做的，比如输入x是一个16*32*32*128(NWHC格式)的feature map，那么上述参数都是128维的向量。其中γ和β是可有可无的，有的话，就是一个可以学习的参数（参与前向后向），没有的话，就简化成y=(x-μ)/σ。而μ和σ，在训练的时候，使用的是batch内的统计值，测试/预测的时候，采用的是训练时计算出的滑动平均值。

 

**2.tensorflow中使用**

tensorflow中batch normalization的实现主要有下面三个：

tf.nn.batch_normalization

tf.layers.batch_normalization

tf.contrib.layers.batch_norm

封装程度逐个递进，建议使用tf.layers.batch_normalization或tf.contrib.layers.batch_norm，因为在tensorflow官网的解释比较详细。我平时多使用tf.layers.batch_normalization，因此下面的步骤都是基于这个。

 

**3.训练**

训练的时候需要注意两点，(1)输入参数`training=True,(2)计算loss时，要添加以下代码（即添加`update_ops到最后的train_op中）。这样才能计算μ和σ的滑动平均（测试时会用到）

```
  update_ops = tf.get_collection(tf.GraphKeys.UPDATE_OPS)
  with tf.control_dependencies(update_ops):
    train_op = optimizer.minimize(loss)
```

 

**4.测试**

测试时需要注意一点，输入参数`training=False，其他就没了`

 

**5.预测**

预测时比较特别，因为这一步一般都是从checkpoint文件中读取模型参数，然后做预测。一般来说，保存checkpoint的时候，不会把所有模型参数都保存下来，因为一些无关数据会增大模型的尺寸，常见的方法是只保存那些训练时更新的参数（可训练参数），如下：

```
var_list = tf.trainable_variables()
saver = tf.train.Saver(var_list=var_list, max_to_keep=5)
```

 

但使用了batch_normalization，γ和β是可训练参数没错，μ和σ不是，它们仅仅是通过滑动平均计算出的，如果按照上面的方法保存模型，在读取模型预测时，会报错找不到μ和σ。更诡异的是，利用`tf.moving_average_variables()也没法获取bn层中的μ和σ（也可能是我用法不对），不过好在所有的参数都在`tf.global_variables()中，因此可以这么写：

```
var_list = tf.trainable_variables()
g_list = tf.global_variables()
bn_moving_vars = [g for g in g_list if 'moving_mean' in g.name]
bn_moving_vars += [g for g in g_list if 'moving_variance' in g.name]
var_list += bn_moving_vars
saver = tf.train.Saver(var_list=var_list, max_to_keep=5)
```

按照上述写法，即可把μ和σ保存下来，读取模型预测时也不会报错，当然输入参数training=False还是要的。

注意上面有个不严谨的地方，因为我的网络结构中只有bn层包含moving_mean和moving_variance，因此只根据这两个字符串做了过滤，如果你的网络结构中其他层也有这两个参数，但你不需要保存，建议使用诸如bn/moving_mean的字符串进行过滤。

```
 
```

**2018.4.22更新**

提供一个基于mnist的[示例](https://files.cnblogs.com/files/hrlnw/bn_exp.zip)，供大家参考。包含两个文件，分别用于train/test。注意bn_train.py文件的51-61行，仅保存了网络中的可训练变量和bn层利用统计得到的mean和var。注意示例中需要下载mnist数据集，要保持电脑可以联网。