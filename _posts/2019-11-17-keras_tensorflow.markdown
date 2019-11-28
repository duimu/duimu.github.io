---
layout: post
title: tensorflow_keras_版本关系
date: "2019-11-16 14:00:000"
tags: [tensorflow, keras]

---

## 流程:

```



Environments
Below is the list of Deep Learning environments supported by FloydHub. Any of these can be specified in the floyd run command using the --env option.

If no --env is provided, it uses the tensorflow-1.9 image by default, which comes with Python 3.6, Keras 2.2.0 and TensorFlow 1.9.0 pre-installed.

Framework	Env name (--env parameter)	Description	Docker Image	Packages and Nvidia Settings
TensorFlow 1.14	tensorflow-1.14	TensorFlow 1.14.0 + Keras 2.2.5 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.14

TensorFlow 1.13	tensorflow-1.13	TensorFlow 1.13.0 + Keras 2.2.4 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.13

TensorFlow 1.12	tensorflow-1.12	TensorFlow 1.12.0 + Keras 2.2.4 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.12
tensorflow-1.12:py2	TensorFlow 1.12.0 + Keras 2.2.4 on Python 2.	floydhub/tensorflow	

TensorFlow 1.11	tensorflow-1.11	TensorFlow 1.11.0 + Keras 2.2.4 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.11
tensorflow-1.11:py2	TensorFlow 1.11.0 + Keras 2.2.4 on Python 2.	floydhub/tensorflow	

TensorFlow 1.10	tensorflow-1.10	TensorFlow 1.10.0 + Keras 2.2.0 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.10
tensorflow-1.10:py2	TensorFlow 1.10.0 + Keras 2.2.0 on Python 2.	floydhub/tensorflow	

TensorFlow 1.9	tensorflow-1.9	TensorFlow 1.9.0 + Keras 2.2.0 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.9
tensorflow-1.9:py2	TensorFlow 1.9.0 + Keras 2.2.0 on Python 2.	floydhub/tensorflow	

TensorFlow 1.8	tensorflow-1.8	TensorFlow 1.8.0 + Keras 2.1.6 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.8
tensorflow-1.8:py2	TensorFlow 1.8.0 + Keras 2.1.6 on Python 2.	floydhub/tensorflow	

TensorFlow 1.7	tensorflow-1.7	TensorFlow 1.7.0 + Keras 2.1.6 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.7
tensorflow-1.7:py2	TensorFlow 1.7.0 + Keras 2.1.6 on Python 2.	floydhub/tensorflow	

TensorFlow 1.5	tensorflow-1.5	TensorFlow 1.5.0 + Keras 2.1.6 on Python 3.6.	floydhub/tensorflow	TensorFlow-1.5
tensorflow-1.5:py2	TensorFlow 1.5.0 + Keras 2.1.6 on Python 2.	floydhub/tensorflow	

TensorFlow 1.4	tensorflow-1.4	TensorFlow 1.4.0 + Keras 2.0.8 on Python 3.6.	floydhub/tensorflow	
tensorflow-1.4:py2	TensorFlow 1.4.0 + Keras 2.0.8 on Python 2.	floydhub/tensorflow	

TensorFlow 1.3	tensorflow-1.3	TensorFlow 1.3.0 + Keras 2.0.6 on Python 3.6.	floydhub/tensorflow	
tensorflow-1.3:py2	TensorFlow 1.3.0 + Keras 2.0.6 on Python 2.	floydhub/tensorflow	

TensorFlow 1.2	tensorflow-1.2	TensorFlow 1.2.0 + Keras 2.0.6 on Python 3.5.	floydhub/tensorflow	
tensorflow-1.2:py2	TensorFlow 1.2.0 + Keras 2.0.6 on Python 2.	floydhub/tensorflow	

TensorFlow 1.1	tensorflow	TensorFlow 1.1.0 + Keras 2.0.6 on Python 3.5.	floydhub/tensorflow	
tensorflow:py2	TensorFlow 1.1.0 + Keras 2.0.6 on Python 2.	floydhub/tensorflow	

TensorFlow 1.0	tensorflow-1.0	TensorFlow 1.0.0 + Keras 2.0.6 on Python 3.5.	floydhub/tensorflow	
tensorflow-1.0:py2	TensorFlow 1.0.0 + Keras 2.0.6 on Python 2.	floydhub/tensorflow	

TensorFlow 0.12	tensorflow-0.12	TensorFlow 0.12.1 + Keras 1.2.2 on Python 3.5.	floydhub/tensorflow	
tensorflow-0.12:py2	TensorFlow 0.12.1 + Keras 1.2.2 on Python 2.	floydhub/tensorflow	


```