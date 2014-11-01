# -*- coding: utf-8 -*-

import urllib2
import socket
import time
import random
from bs4 import BeautifulSoup

baseurl = 'http://cn.bing.com/dict/search?q='
mapping_file = '../data/inflection_mapping'
word_list_long_noinflect = '../data/word_list_long_noinflect'
mapping_file_new = '../data/inflection_mapping_new'
word_list_long_noinflect_new = '../data/word_list_long_noinflect_new'
mapping = {}
word_list = []

def getInflections(word):
  url = baseurl + word
  request = urllib2.Request(url)
  request.add_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36')

  failcount = 0
  interval = random.random() * 2
  while True:
    try:
      time.sleep(interval)
      response = urllib2.urlopen(request, timeout=20)
      break
    except (socket.timeout, urllib2.URLError, Exception) as e:
      failcount += 1
      if failcount <= 5:
        print 'error:{0} {1}, retry {2} ...'.format(url, str(e), failcount)
        interval *= failcount
      else:
        with open('./util.log', 'a') as log:
          log.write('error:{0} {1}'.format(url, str(e)))
        return None

  html = response.read()
  dom = BeautifulSoup(html)

  inflections = []
  headword = ''
  for div in dom.find_all('div', class_='hd_if'):
    for a in div.find_all('a'):
      inflections.append(a.getText())

  for div in dom.find_all('div', id='headword'):
    for strong in div.find_all('strong'):
      headword = strong.getText()

  return (headword, inflections)

#######################################################

with open(word_list_long_noinflect, 'r') as flist:
  for line in flist:
    word_list.append(line.strip())
      
numRemoved = 0
with open(mapping_file, 'r') as fmap:
  for line in fmap:
    pair = line.strip().split(' ')
    if len(pair) != 2:
      with open('./util.log', 'a') as log:
        log.write(line)
      continue
    if pair[0] in mapping:
      ret = getInflections(pair[0])
      if ret == None:
        with open('./util.log', 'a') as log:
          log.write('timeout: ' + line)
        continue

      rootword = ret[0]
      inflections = ret[1]

      # remove inflections from word list
      for w in (pair[1], mapping[pair[0]]):
        if w in inflections:
          if w in word_list:
            print 'remove from word list: ' + w
            word_list.remove(w)
            numRemoved += 1

      for inf in inflections:
        mapping[inf] = rootword
        print rootword + ', ' + inf
    else:
      mapping[pair[0]] = pair[1]

#######################################################

print 'number of words removed: {0}'.format(numRemoved)

with open(word_list_long_noinflect_new, 'w') as flist:
  for w in word_list:
    flist.write(w + '\n')
  
with open(mapping_file_new, 'w') as fmap:
  for inf in mapping:
    if isinstance(inf, unicode):
      inf = inf.encode('utf-8')
    rootword = mapping[inf]
    if isinstance(rootword, unicode):
      rootword = rootword.encode('utf-8')
    fmap.write(inf + ',' + rootword + '\n')
