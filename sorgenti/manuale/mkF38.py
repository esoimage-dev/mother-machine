import base64,glob,json,re
FD='/home/claude/fonts/'
def b64(n): return base64.b64encode(open(glob.glob(FD+'*/package/files/'+n)[0],'rb').read()).decode()
FF=''.join(f"@font-face{{font-family:'{n}';src:url(data:font/woff2;base64,{b64(p)}) format('woff2');font-weight:{w}}}\n" for n,p,w in [('Hanken','hanken-grotesk-latin-wght-normal.woff2','100 900'),('DMMono','dm-mono-latin-400-normal.woff2','400'),('DMMono','dm-mono-latin-500-normal.woff2','500')])
IC=json.load(open('icons.json'))
H='/home/claude/hero/'
CSS=open('/home/claude/mk/base.css').read().replace('/*FONTS*/','')+open('c4.css').read()+open('c5.css').read()
t=open('manual_v2r39.tpl').read().replace('/*CSS*/',CSS).replace('/*FONTS*/',FF).replace('/*ASSETS*/',open('/home/claude/mk/assets.json').read()).replace('/*ICONS*/',json.dumps(IC))
t=re.sub(r'/\*I:(\w+)\*/',lambda m:IC[m.group(1)],t)
x=open(H+'h3_s2.css').read().replace('/*GLOOCK*/','')+open(H+'glass.css').read()+open(H+'hdr.css').read()+open(H+'flr.css').read()+open('m38.css').read()+open(H+'cur.css').read()
t=t.replace('/*HDRJS*/\n','',1);t=t.replace('function Lift(root,floors,opt){',open(H+'hdr.js').read()+'\n'+open(H+'flr.js').read()+'\nfunction Lift(root,floors,opt){',1)
i=t.index('</style>');t=t[:i]+x+'\n'+t[i:]
home=base64.b64encode(open('/mnt/user-data/outputs/mother-machine-hero-3.html','rb').read()).decode()
js='<script type="text/plain" id="homeB64">'+home+'</script>\n<script>\n'+open(H+'cur.js').read()+'\n'+open('m30.js').read()+'\n(function(){var V=[].slice.call(document.querySelectorAll(".wv"));function fit(){V.forEach(function(v){v.style.setProperty("--k",(v.clientWidth/384).toFixed(4))})}fit();addEventListener("resize",fit);if(window.ResizeObserver)new ResizeObserver(fit).observe(document.body)})();\n</script>\n'
k=t.rindex('</script>')+len('</script>');t=t[:k]+'\n'+js+t[k:]
assert '—' not in t and '–' not in t
open('/mnt/user-data/outputs/mother-machine-manuale.html','w').write('<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+t);print(len(t)//1024,'KB')
