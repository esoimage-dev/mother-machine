import json,re,base64,glob,sys
M='/home/claude/mkF/'
tpl=open(M+'manual.tpl').read().split('\n')
man='\n'.join(tpl[21:84]+tpl[121:125])   # header, lift, navlift, shaft extras (lines 22-84,122-125)
FD='/home/claude/fonts/'
def b64(n): return base64.b64encode(open(glob.glob(FD+'*/package/files/'+n)[0],'rb').read()).decode()
FF=''.join(f"@font-face{{font-family:'{n}';src:url(data:font/woff2;base64,{b64(p)}) format('woff2');font-weight:{w}}}\n" for n,p,w in [('Hanken','hanken-grotesk-latin-wght-normal.woff2','100 900'),('DMMono','dm-mono-latin-400-normal.woff2','400')])
CSS=open('/home/claude/mk/base.css').read().replace('/*FONTS*/','')+open(M+'c4.css').read()+open(M+'c5.css').read()
IC=json.load(open(M+'icons.json'))
AS=json.load(open('/home/claude/mk/assets.json'));AS={k:AS[k] for k in ('heroS','heroW')}
LT=json.load(open('/home/claude/lt/letter2.json'))['new']
lines=open(M+'manual.tpl').read().split('\n')
s=open(M+'manual.tpl').read()
a=s.index('function two(n)');b=s.index("var SITEF=")
LIFT=s[a:b]
t=open(sys.argv[1] if len(sys.argv)>1 else 'home.tpl').read()
t=t.replace('/*CSS*/',CSS).replace('/*FONTS*/',FF).replace('/*MANCSS*/',man).replace('/*ASSETS*/',json.dumps(AS)).replace('/*LT*/',json.dumps(LT)).replace('/*LIFTJS*/',LIFT)
t=re.sub(r'/\*I:(\w+)\*/',lambda m:IC[m.group(1)],t)
t=t.replace('{{L05}}',LT['05']).replace('{{LG0}}',LT['G'])
assert '—' not in t and '–' not in t
open(sys.argv[2] if len(sys.argv)>2 else '/mnt/user-data/outputs/mother-machine-home.html','w').write('<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+t);print(len(t)//1024,'KB')
