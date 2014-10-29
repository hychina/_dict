# -*- coding: utf-8 -*-

import jieba
import codecs

cn = '../data/sentences.cn'
cn_seg = '../data/sentences.cn.seg'

with open(cn) as fcn, codecs.open(cn_seg,'w','utf-8') as fcn_seg:
  i = 1
  for line in fcn:
    seg_list = jieba.cut(line.strip(' \t\n'))
    fcn_seg.write(' '.join(seg_list) + '\n')
    print i
    i += 1
