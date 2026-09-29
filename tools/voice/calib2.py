import json, random, numpy as np, av
SITE='/home/user/max-ed/site'
m=json.load(open(f'{SITE}/voice/manifest.json'))
def load(path, sr=24000):
    c=av.open(path); rs=av.AudioResampler(format='s16',layout='mono',rate=sr); out=[]
    for f in c.decode(audio=0):
        for g in rs.resample(f): out.append(g.to_ndarray().reshape(-1))
    for g in rs.resample(None): out.append(g.to_ndarray().reshape(-1))
    return np.concatenate(out).astype(np.float64)/32768
random.seed(3)
keys=random.sample(list(m),60)
data=[]
for k in keys:
    x=load(f"{SITE}/voice/{m[k]['f']}"); e=[int(c) for c in m[k]['e']]
    data.append((x,e))
def frames(x,n,off=0,hop=800,win=800):
    r=[]
    for i in range(n):
        s=max(0,(i+off)*hop); seg=x[s:s+win]
        r.append(np.sqrt(np.mean(seg**2)) if len(seg) else 0)
    return np.array(r)
best=None
for off in [-2,-1,0,1]:
    for win in [800,1200]:
        R=[];E=[]
        for x,e in data:
            R.append(frames(x,len(e),off,800,win)); E.append(np.array(e))
        R=np.concatenate(R);E=np.concatenate(E)
        for ref in np.arange(0.03,0.30,0.01):
            for gam in [0.5,0.6,0.7,0.8,1.0,1.2]:
                p=np.clip(np.round(9*np.minimum(1,R/ref)**gam),0,9)
                mae=np.mean(np.abs(p-E))
                if best is None or mae<best[0]: best=(mae,off,win,ref,gam)
print('best',best)
mae,off,win,ref,gam=best
R=np.concatenate([frames(x,len(e),off,800,win) for x,e in data]);E=np.concatenate([np.array(e) for x,e in data])
p=np.clip(np.round(9*np.minimum(1,R/ref)**gam),0,9)
print('corr',np.corrcoef(p,E)[0,1],'exact',np.mean(p==E), 'within1',np.mean(np.abs(p-E)<=1))
# also check duration vs len(e)
for k in keys[:5]: print(k,m[k]['d'],len(m[k]['e'])/30)
