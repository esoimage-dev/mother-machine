# costruisce le tre prove di eroe sopra la home: python3 mkHero.py 1|2|3
import sys,re,subprocess,json,base64,glob
n=sys.argv[1];H='/home/claude/home/';D='/home/claude/hero/'
t=open(H+'home.tpl').read()
sec=open(D+'h%s.html'%n).read();css=open(D+'h%s.css'%n).read()+'\n'+open(D+'bianco.css').read();js=open(D+'h%s.js'%n).read()
TT={'1':'Hero 1 · Il marchio vivo','2':'Hero 2 · Il film','3':'Hero 3 · Il carattere che respira'}[n]
t=re.sub(r'  <section class="hs op".*?</section>\n',lambda m:sec+'\n',t,count=1,flags=re.S)
import os
if os.path.exists(D+'h%s_s2.html'%n):
    s2=open(D+'h%s_s2.html'%n).read();t=re.sub(r'  <section class="hs" data-luce="carta" data-f="05.2".*?</section>\n',lambda m:s2+'\n',t,count=1,flags=re.S);css+='\n'+open(D+'h%s_s2.css'%n).read();js+='\n'+open(D+'h%s_s2.js'%n).read()
t=t.replace('<title>Mother Machine Home</title>','<title>Mother Machine '+TT+'</title>',1)
if os.path.exists(D+'h%s_s3.html'%n):
    s3=open(D+'h%s_s3.html'%n).read();LTN=json.load(open('/home/claude/lt/letter2.json'))['new'];s3=re.sub(r'<span class="gnum" data-n="(\d\d)" aria-hidden="true"></span>',lambda m:'<span class="gnum" aria-hidden="true">'+re.sub(r' role="img" aria-label="[^"]*"','',LTN[m.group(1)]).replace('class="lt"','class="lt" focusable="false"')+'</span>',s3);t=re.sub(r'  <section class="hs" data-luce="carta" data-f="05.3".*?</section>\n',lambda m:s3+'\n',t,count=1,flags=re.S);css+='\n'+open(D+'glass.css').read();js+='\n'+open(D+'glass.js').read()
css+='\n'+open(D+'cur.css').read();js+='\n'+open(D+'cur.js').read()
if sys.argv[2:3]==['ritmo']:
    # proposta di ritmo: 05.1 apertura, 05.2 cosa costruiamo (vetro caldo), 05.3 lavori, 05.4 le sei animazioni (vetro freddo), 05.5 come lavoriamo, G
    m2=re.search(r'  <section class="hs wk".*?</section>\n',t,flags=re.S);m3=re.search(r'  <section class="hs mmo".*?</section>\n',t,flags=re.S)
    b2,b3=m2.group(0),m3.group(0)
    b3=b3.replace('data-f="05.3"','data-f="05.2"').replace('05.3 · What we build','05.2 · What we build')
    b2=b2.replace('data-f="05.2"','data-f="05.3"')
    t=t.replace(m2.group(0),'@@S2@@').replace(m3.group(0),'@@S3@@')
    t=t.replace('@@S2@@',b3).replace('@@S3@@',b2+open(D+'h3_s5.html').read()+'\n')
    t=t.replace('data-f="05.4" data-n="How we work"','data-f="05.5" data-n="How we work"')
    css+='\n'+open(D+'h3_s5.css').read();js+='\n'+open(D+'h3_s5.js').read()

css+='\n'+open(D+'hdr.css').read()+'\n'+open(D+'flr.css').read();t=t.replace('/*HDRJS*/',('window.MM_PNL="b";\n' if sys.argv[2:3]==['pb'] else '')+open(D+'hdr.js').read()+'\n'+open(D+'flr.js').read(),1)
VAR=sys.argv[2] if len(sys.argv)>2 else ''
if VAR=='rosa':css+='\n:root{--sig:#EEC3B1}\n';js='window.MM_SIG="rosa";\n'+js
i=t.index('</style>');t=t[:i]+css+'\n'+t[i:]
t=t.rstrip()+'\n<script>\n'+js+'\n</script>\n'
open(D+'h%s.tpl'%n,'w').write(t)
out='/mnt/user-data/outputs/mother-machine-hero-%s%s.html'%(n,('-'+sys.argv[2]) if len(sys.argv)>2 else '')
subprocess.run(['python3',H+'mkH.py',D+'h%s.tpl'%n,out],check=True,cwd=H)
o=open(out).read()
if '/*GLOOCK*/' in o:o=o.replace('/*GLOOCK*/',"@font-face{font-family:'Gloock';src:url(data:font/woff2;base64,%s) format('woff2');font-weight:400}"%base64.b64encode(open('/home/claude/fonts/fontsource-gloock-5.3.0/package/files/gloock-latin-400-normal.woff2','rb').read()).decode())
if n=='1':o=o.replace('/*LGPTS*/',open(D+'lgpts.json').read())
if '/*FILMJS*/' in o:
    A='/home/claude/film/anim/';lg=json.load(open('/home/claude/film/logoparts.json'))
    FD='/home/claude/fonts/'
    def b64(p): return base64.b64encode(open(glob.glob(FD+'*/package/files/'+p)[0],'rb').read()).decode()
    ff="@font-face{font-family:'Hanken Grotesk';src:url(data:font/woff2;base64,%s) format('woff2');font-weight:100 900}\n@font-face{font-family:'DM Mono';src:url(data:font/woff2;base64,%s) format('woff2');font-weight:400}\n@font-face{font-family:'DM Mono';src:url(data:font/woff2;base64,%s) format('woff2');font-weight:500}\n"%(b64('hanken-grotesk-latin-wght-normal.woff2'),b64('dm-mono-latin-400-normal.woff2'),b64('dm-mono-latin-500-normal.woff2'))
    o=o.replace('/*FILMFONTS*/',ff)
    o=o.replace('/*FILMJS*/','var LG='+json.dumps({'parts':lg['parts'],'bounds':lg['bounds']})+';\n'+open(A+'mm.js').read()+'\n'+open(A+'mmv.js').read()+'\n'+open(A+'snd.js').read())
assert '—' not in o
open(out,'w').write(o);print(out,len(o)//1024,'KB')
