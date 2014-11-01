infFile = '../data/inflections'
mapping = {}

with open(infFile, 'r') as fin:
  for line in fin:
    pair = line.strip().split(',')
    inf = pair[0]
    root = pair[1]
    if inf in mapping:
      print inf, root
      print inf, mapping[inf]
    else:
      mapping[inf] = root
