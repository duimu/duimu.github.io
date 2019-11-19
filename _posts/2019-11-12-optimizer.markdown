---
layout: post
title: tensorflow-optimizer
date: "2019-11-02 14:00:000"
tags: [tensorflow, optimizer]

---

## 流程:

```
//标准梯度下降
optimizer=tf.train.GradientDescentOptimizer(learning_rate=0.01)
//梯度下降中增加了动量项
optimizer=tf.train.MomentumOptimizer(learning_rate=0.01,momentum=0.02)
//自适应的、单调递减的学习率
optimizer=tf.train.AdadeltaOptimizer(learning_rate=0.01,rho=0.95)
// Adam 优化器:利用梯度的一阶和二阶矩对不同的系数计算不同的自适应学习率
optimizer=tf.train.AdamOptimizer()

train_step=optimizer.minimize(loss)
```