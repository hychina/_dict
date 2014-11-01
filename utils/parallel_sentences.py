corpus = '../data/sentences.dmp'
cn = '../data/sentences.cn'
en = '../data/sentences.en'

with open(corpus) as fin, open(cn, 'w') as fcn, open(en, 'w') as fen:
  i = 1
  for line in fin:
    splits = line.split('|')
    if len(splits) != 3:
      continue
    fen.write(splits[1] + '\n')
    fcn.write(splits[2])
    print i
    i += 1
