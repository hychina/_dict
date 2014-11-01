from os.path import join
import re

word_list_long = '../data/word_list_long'
inflection_mapping = '../data/inflection_mapping'
word_list_long_noinflect = '../data/word_list_long_noinflect'
pattern = re.compile('<inflections>(.*)</inflections>')

with open(word_list_long, 'r') as word_list_long, \
     open(inflection_mapping, 'w') as inflection_mapping, \
     open(word_list_long_noinflect, 'w') as word_list_long_noinflect:
  for word in word_list_long:
    word = word.strip('\n')
    with open(join('../data/bing_dict/', word), 'r') as f:
      m = pattern.search(f.read())
      if m:
        inflections = m.group(1)
        inflections = inflections.strip().split(',')
        if word not in inflections:
          word_list_long_noinflect.write(word + '\n')
          print word
          for i in inflections:
            print i, word
            inflection_mapping.write(i + ' ' + word + '\n')
      else:
        word_list_long_noinflect.write(word + '\n')
        print word
