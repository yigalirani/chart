import json
j=json.load(open('cat.json'))
print(j['data'].keys())
ans={}
for i,(name,value) in enumerate(j['data'].items()):
  newname=f'category {i}'
  print(newname,name)
  ans[newname]=value
ans2={'data':ans}

open('cat_anon.json','w').write(json.dumps({'data':ans},indent=4))