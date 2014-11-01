# -*- coding: utf-8 -*-
# 扫描bing词典，得到词表

from os import listdir
from os.path import join

bing_dir = '../data/bing_dict/'

fout = open('../data/word_list_long', 'w')

for filename in listdir(bing_dir):
  with open(join(bing_dir, filename)) as f:
    head = f.read(13)
    if head != '<word></word>' and head != '<word><web><e':
      fout.write(filename + '\n')
      print filename

fout.close()
