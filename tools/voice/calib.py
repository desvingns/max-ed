import asyncio, json, sys, numpy as np, av
sys.path.insert(0, '/home/user/max-ed/tools/voice')
from edge import synth

SITE='/home/user/max-ed/site'
m=json.load(open(f'{SITE}/voice/manifest.json'))
P={'narrator':('ru-RU-SvetlanaNeural','-4Hz','-8%','warm'),'pyx':('ru-RU-SvetlanaNeural','+30Hz','+6%',''),'shchyok':('ru-RU-DmitryNeural','+45Hz','-4%',''),
   'tyuk':('ru-RU-DmitryNeural','-8Hz','-6%','warm'),'hapchik':('ru-RU-DmitryNeural','+30Hz','+10%','echo'),'cow':('ru-RU-SvetlanaNeural','-30Hz','-12%','warm'),'busya':('ru-RU-SvetlanaNeural','+45Hz','+4%','')}
tests=[('c.narrator.done','narrator'),('c.narrator.sticker','narrator'),('c.pyx.praise1','pyx'),('c.pyx.praise2','pyx'),('c.shchyok.praise1','shchyok'),('c.tyuk.praise1','tyuk'),('c.tyuk.praise2','tyuk'),('e.intro.hap_hi1','hapchik'),('e.intro.hap_hic','hapchik'),('c.busya.praise1','busya')]
tests=[(k,w) for k,w in tests if k in m]
def load(path, sr=24000):
    c=av.open(path); rs=av.AudioResampler(format='s16',layout='mono',rate=sr); out=[]
    for f in c.decode(audio=0):
        for g in rs.resample(f): out.append(g.to_ndarray().reshape(-1))
    for g in rs.resample(None): out.append(g.to_ndarray().reshape(-1))
    return np.concatenate(out).astype(np.float64)/32768
BANDS=[(0,200),(200,500),(500,1000),(1000,2000),(2000,4000),(4000,6000),(6000,8000),(8000,12000)]
def stats(x):
    n=len(x); w=np.hanning(4096); acc=np.zeros(2049); k=0
    for i in range(0,n-4096,2048):
        s=np.abs(np.fft.rfft(x[i:i+4096]*w))**2; acc+=s; k+=1
    acc/=max(k,1); f=np.fft.rfftfreq(4096,1/24000)
    tot=acc.sum()
    b=[10*np.log10(acc[(f>=lo)&(f<hi)].sum()/tot+1e-12) for lo,hi in BANDS]
    rms=20*np.log10(np.sqrt(np.mean(x**2))+1e-9); pk=20*np.log10(np.max(np.abs(x))+1e-9)
    # rms only on non-silent frames
    fr=[np.sqrt(np.mean(x[i:i+720]**2)) for i in range(0,n-720,720)]
    act=[v for v in fr if v>0.01]
    arms=20*np.log10(np.mean(act)+1e-9) if act else -99
    return b,rms,pk,arms
async def main():
    for key,who in tests:
        v,p,r,fx=P[who]
        text=m[key]['t']
        await synth(text,v,r,p,'raw.mp3')
        a=load(f"{SITE}/voice/{m[key]['f']}"); b=load('raw.mp3')
        sa,sb=stats(a),stats(b)
        print(key,who,fx or '-',f"dur exist={len(a)/24000:.2f} raw={len(b)/24000:.2f}")
        print('   bands exist',np.round(sa[0],1)); print('   bands raw  ',np.round(sb[0],1))
        print(f"   rms exist={sa[1]:.1f} raw={sb[1]:.1f}  peak exist={sa[2]:.1f} raw={sb[2]:.1f}  activeRMS exist={sa[3]:.1f} raw={sb[3]:.1f}")
asyncio.run(main())
