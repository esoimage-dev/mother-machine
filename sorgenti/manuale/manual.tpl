<title>Mother Machine, manuale</title>
<style>
/*FONTS*/
/*CSS*/
/* ===== manual: one file, built as a building. floors descend to G. ===== */
:root{--acc:#121211;--acc-ink:#F4F2EC}
[data-luce="carta"]{--bg:#ECEAE3;--sf:#F4F2EC;--sf2:#E4E1D8;--ink:#121211;--mut:#6F6C65;--ln:rgba(18,18,17,.14);--inv:#121211;--inv-ink:#F4F2EC;--acc:#121211;--acc-ink:#F4F2EC;--ui:#D9D5CB;color-scheme:light}
[data-luce="notte"]{--acc:#F1EEE7;--acc-ink:#121211}
html{scroll-behavior:smooth;scroll-padding-top:52px}
body{padding:0}
.b.p::before{background:var(--bg)}.b.p:hover,.b.p:focus-visible{color:var(--ink)}
.fl{background:var(--bg);color:var(--ink);padding:110px 0 130px}
.fl>.in{max-width:1240px;margin:0 auto;padding-inline:clamp(16px,4vw,56px);display:grid;gap:96px}
.flh{display:grid;grid-template-columns:auto minmax(0,1fr);gap:clamp(18px,3vw,44px);align-items:end;border-bottom:1.5px solid var(--ink);padding-bottom:18px}
.flh .n{font:500 clamp(80px,12vw,168px)/.78 var(--f-mono);letter-spacing:-.06em}
.flh h2{font:700 clamp(34px,4.6vw,64px)/.95 var(--f-body);letter-spacing:-.045em}
.flh p{font-size:16px;max-width:64ch;opacity:.86;margin-top:12px}
.sub{display:grid;gap:22px}
.sub>h3{font:700 clamp(22px,2.4vw,30px)/1.05 var(--f-body);letter-spacing:-.03em;display:flex;gap:14px;align-items:baseline;flex-wrap:wrap}
.sub>h3 small{font:400 12px var(--f-mono);letter-spacing:.06em;color:var(--mut)}
.sub>p.lead{max-width:66ch;font-size:15.5px;opacity:.86;margin-top:-10px}
/* top bar + display */
.bar{position:fixed;top:0;left:0;right:0;height:64px;z-index:40;display:flex;justify-content:space-between;align-items:center;padding:0 clamp(16px,3vw,32px);background:var(--bg);color:var(--ink);border-bottom:1px solid var(--ln)}
.bar .mm{width:132px}
.bar .blogo{position:absolute;left:clamp(16px,3vw,32px);top:0;width:200px;height:100%;color:inherit;display:block}
.bar .blogo>span{position:absolute;left:0;display:block}
.bar .blogo .mm{width:100%;display:block;height:auto}
/* hanging: the big logo, original stroke; folded: the small-size master, stroke +15% */
.bar .lgB{top:18px;width:199px;transform-origin:0 0;transition:transform .6s var(--e-carro),opacity .2s .4s}
.bar .lgS{top:10px;width:98px;opacity:0;transition:opacity .2s}
.bar.fold .lgB{transform:translateY(-8px) scale(.478);opacity:0}
.bar.fold .lgS{opacity:1;transition:opacity .2s .45s}
.bar:not(.fold) .lgB{transition:transform .6s var(--e-carro) .1s,opacity .15s}
@font-face{font-family:"MMLogoS";src:url(data:font/woff2;base64,d09GMgABAAAAAAdgAAoAAAAAEFwAAAcYAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmAANAqcBJpRATYCJAMICwYABCAFYAcrG/EOQJ4HZduVZlNeyYXfddmRTFNHOvVeVuzXiysgF1BWiKQA0rvAuJanZO2GPHbYgMfyijjffm6oh0I007tvev8m7gk8ElcaJezx+hKZ/93v9zF5EiqESgqkyqEEQrGsut0hvu2pf0vPM2KDc0pyF/ZGXpnfTZ55hGmPKabjJOXRMSN1YMcecGjN1Xt04g2xtkpJnkxKtPvp6yw95veotKkk8MRCpKo0GiGKdvJqJxIjpRBqwYZM8yA4Js6IK7T/O1Ehhu+NnOy0AQtaTAGspg9qX3SEj3/+T2AugE5H0NOAMWQsJ3XQqKDZOJIFQEMv4P9/Hp2GAFknMxgLNGt8bwvGjVspiLlj+Z5aYaDk4J7OZez44orZlqo9upafmNVByKqI541mRjxL0DAym0p0ogNoimE4RtN4i7dykLVOd7zTIiQwd0FyYpZG9Li2Dc4tODlsGLsfjwtqEBgSc7nbmjjv8l1FudZtMVnOIRIX67yM/i6z8HWNJXFTh9w1+d5dvS4QB7WEIQkeeFh0EeHo2mHrYBw2k6KOhBsk2DKWZOwyAGzBN72bDLVlWiii4RuPJ+60LO/enW/5PXBgoGNP1guieaY/fnlK/HprCOLTDugZDN8XpY54O/v87PdFV8/3hO77SxOn1RuigaJHRul88WDEMbyQA9OyHcTxvkDQSDOXl1tVyWxBEGUhubQiq7KjgzEbA/RYBc6x06mkvPIt6SKh+BB7uJPbhFAalxKyrKTS6bV1imkZPOI4G6fsKBWGLc2CNACQihtccmrZ4Ygv2jsPTm86tIxSwy5ViYIVdwJP9puxGkZ+ylaEMUfIbEW+nfKjMDzGNLTPVFyK0/I+I9yhFccaUW9JNZAA3GrLekCLFdjmODyxNq2fsMBnALJVixkvAE+MXQviVcpRQojBmhZCGrflCxqNzMXVZkVudlKQRUFIZmdXVM5N0yZDMJDn19/slGUy4xLwOaLbQoEY2j0+xV/btP6HzvNzsRjCX267eZvWyfZ23ylEqfxjPDxWCjvztttZBanKtIqKjrSJ8gdyQFWZdEIJPoTwiOhGQlHTG7lJfKf7wThhW+GcsLSp+fjpSVEenJIodi7cKMnOh0f1CBDk2dl44Lp8K73s4pzM9nbS4PNlZEnEEFIxOXj4eLTUuHp59tyqHExa6T8IOTmdnYzJGCxkUMsy2VVVFvKLqKyy7q35eJLz5TVkM1O/BHRGhSvomOqGqajp9fym30DRF2NB4DiY477Rrw/9fRUSFgn3Keag3dz2iiQI/Ki1BQJNdbuczjiMwriUWPNgrD+/GM/0MJ60JfZ8n7zwCAkvrrmhxHWkEEGxignIfERHdLAvFUDlCR2UMQYNBZ4DGQwQxImiC8ToPCCrYoA+y0Zgj0Ff0GDyV0VWdlIuiQraGOT8eaT2RxAKAuC2E+bvAgQE/JSFoYOtopK2ESj2WzUAgYoUrecRCQi6N5IHGxywIBDRUPYO/ShgaI7HMqjrkJ0Nrye6Crzsa6wucW+FcRZQIyIajH77GOKNB28z/XV/+eX5HO9mZVW0t1GkAePs+svas0RFAR9iLFBRSiojCKFjfEwMXBQGwgcKJoL118yfuGObjJ1cxTii1+J9ihIOGjloqC0H8Pz2VCXE8Te7eXmCxNOXe9MU9y/8k1RFOZNd2ZlmjMECpyGL6afkCMJDfCTqkpxU13NgEkcq+XylfG+ZvTb7rj4LJohXGMMc1t86khEVeJjgqj8rmRQ7OvmCyu+gjNFY2P/OIWQ12Wk3urg+Qga+3M8w5JgY/wxzE1Xd8yLhr62203wjaUnzsIxV7fbOdXPbIcv1zU5X7egUWZ5e3dNtiVV38rnOw9DU/7K6GvsI6ofis6p/uwdbTeRwm4Wpkpemuaup6gJZVqlIOM5JBUEUtbSeQkLzIo/bVU/LInyPq1o3zdOzfOh8rTwVuC6ROHrCkyBQUVI2RLG/HzyEJE4lOTXkQUCDcKWlZTUiuTPtyqZysw8vHLMwnM+ybk3LEfsiopqp3PTTlGb/WiOqrJyuBR0mQeB9hmKenhwT1qQ9knRZSVHBhl8zR4Sdtlq3qb/LD+0buQLghGXPc8BnMFKwVGQzHvCXFpEtqKIjzdDIDxQ4DWSozDyl4vQQ3L0mFdKmZ3GgDeUk0xm0Muu2m9daEoe6OlJS1bh7KG/hRO5mpvN2P0zN71kQLYlqeIFBL/v5+uwo6NOXJusPHp7yhb151e/LKjIlGBPJUNObgdMVP7IcG+NWqmMGVWfy+tiwMFD5dRolaiJG373fX1ia3/T/X14av/TlGsvY6b+4s8pn847D8tRtjtrNoC/xGp5g4nthJCYEcDcLpUeAc5DQrwEGL0DMynLbuiWQCGM6kl1dfwTDPv43XavueuSvwAa44B/hAdDyfj1gBgmc53QEYDoQw35NDQ==) format("woff2");font-display:block}@font-face{font-family:"MMLogoW";src:url(data:font/woff2;base64,d09GMgABAAAAAAdUAAoAAAAAD7gAAAcLAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmAANAqaYJk2ATYCJAMICwYABCAFYAcrG1YOUZTI0RDEzwPHmGt6FXEKf1Q/NQnnc3l4qHKS2hCZm/5Xp30pIAq+xJFK6KR1EdgHhHOn4xFxuqn3dqAVcEacmlNAN2NRlykZhQsYaP9TIByzhvMTZsKQMCjUftxPc0DGTc9NKSALeEQFTP/9pESvBEl+u3FgpBjV2VMn5G7omqv6Ahz4DKcwGkfi1Wcv29a8/vn7vXoWGYAD7BQY4Ptvdd+vvOugSHu/YhRROJAKoA+6LgogH8FUxFs6HMoB/Vaw0F8oDjawAhN5wKKiGipfgm2xf/6voMQeUDpYsbDAlMVRfrCQx7I2pKwAVP8S/v/XTbEIUOdW2MIKPoE9o8BpbGhlZbhTBicuFfLy9vrorPVI/EJxTOkOP3PNeQBQTNJK9xYi6Ts1DQkrR/3h4QECj4XfXUFYtFpOQkjfiFV+tU2CCRIpCI3HoWjcJwPQBEQkuQJiewDNiYUBc0ub8toZHkMjT29Es3RuCBrl8y0aso2qXH/Ql3Wnta1SlWWnfgtCBap1hUTKKDTK4KfMYE4ECJgKoAEpNmRAdmwCXg1p/D2Yr7Ny27YwUMqhbS6GxKyOQyCjAtKk/gnfzLlVyohdyNCkHjLDnGHLjCU9RUDQCcyrc0nEIwD8yRUciREVJ5RwWnIDEeQyiJxkFJ/FfTFve6l//NmzTPHVimcHnArU0hF0MD4lbc4tMAkO2mHFjSCIyoiMinS6nJEOwyhpa0HcsLJtGxITLP4mA1pCXJxgcfGJWoCyjYcHTWqmw3OIVfrEGknDqdVRgmA5LBMKBVOB5BylaydTwWA6xLIcQbPI56GB3X6/lhHk9WRWjtd3S4VR7mU4xKaDnVQnA3Mug94cCgETLGmqn5y7H6U5A27vgryFI5I3wcpyTV8xfrZtQDlvHDpwRQjVuxwgh4O2MoRuB6osSTciHW6nwxFpGCWloyMuEZRLQ/Lj3DI40/QEoyNo1SiPKMMNoeS1MP7vONK0SsVVvGzBjlbHsNIt9iZ8fnQmyu1iyBn3aipiPJ6YjJSSpmY7iBTzhTMjkGomE94exvcl/H4U+JbLCYUi9nCcykiSLJPzk/Jq60xGHMM2NwMzdtIJooqPm+R+WyxWWTBMMdZoOuYoCYaamuiwkMt0/N5utg99PTV/QZeyJJLQRvO/m0ZHlpa2jIqV0lWuzXfZ6Xq1WNDzx+XK8wVxL5/7NbB+ZzRVQmxv9YupMoPSNM+a5q8iAC6HY0FXiinKvplXby3iZiNhr7OX39hKNlJN+l8wJYMFBfX1JMnhoVAqMMfWrctkOJ6irbaFUIjZifp5mspkfXurR9yoNTr01oO6E4v57vvMuhcpXlq4t2sRQOnAlmE3LIMRwSsRYkCSdcfQttZBWNqpFlsZiC5rr0rlOxwg+kBYQWqpIBfyLpWKQwBwoArgBErNWB9MyGIZul1aWFKK6ThMumIGtqdDOBZuSiZQqio87uVrVsNqOIGz7Cf6MkJKOqBSQrFR6+NqxBXHGRdev7wwYf56LD+r5XlEWKi4qGnIRkeEfP9b7vjrUdIb7+F7fYkUQsYMR5ImymKR5usFelDJGBBdf8Gkc2c4o1KeOBA8UuAQwmOXeO02zwLgvK0Edt/HfGvajBiHU5jQpCbti33j82Pf0ZTi4pEmUAoPf5wZNJVqfDroYYteXxJ9zfS+CXmh4NktlVbz+1fibne7rc4vyypYh9Be3w/lAPjnkCyV3BCZ4YShwRuMiKM+c7BB891D5KA+MM9sUyuHbdvbP2QYy21tLR4ojkgOuG7KZ1Bw3ZBSMbAwsVfcHmVZWiUMuN1x5R3tscZeuFRc+XPsB//N9RJ/gvfDq9fl+tu2q7vQwr9Gi9tTLpcXXSnPcru9puCUKaWChYWN9VYLRfI8z2ZeT50FPX9yfV/sFQphl6wgGApTjDqYea+nwBaIUxMTNNMNIH+2mPBtl/6G8wRppswWq2EgSNIMr9XRbU/R0gagf2kLHiGVPN5xz3C4cPvlAvHHLSdmJBwtTmlugQwoFAZGNp1qJuPeHr43/rmtcOd71jQLxehuGND27wuPTfPrdf2QyneoOcghLZA7L2uMEMsyhOERPqH5rS0Gw0pJAGOL8S7KlBQRG6z9InUOhFFmg+WNB0rwclIm/hW4hSPuMCXEVr/j0UOizAJcsIkiiqjTn0qIyeyYqNdv1g6uB4/N9/0JPB/xl3eb/UFWS2V3PSfw2Uy69Wlu0YfQd6FAS5L1ZCkJbTfHyB4Pdi0c+FuacJd+pYhUNGn6e98qlnau+//Dfafj6kURB3dYeAklmP/vSrfcm2rSWUFg9KUFUrdjewb4GhkAVlghvxfuCEhhJWCGBxaBldWscIFLLHBpZFvbpyacgX/WCmA114JCAsJeCw0Y8BVbzUEUgpAeKB2ASxG2XrkCAA==) format("woff2");font-display:block}.bar .lgF{display:none;line-height:1;white-space:nowrap;user-select:none;-webkit-user-select:none;font-style:normal}.mmfont .bar .lgF{display:block}.mmfont .bar .blogo>span>.mm{display:none}.bar .lgB .lgF{font-family:"MMLogoS";font-size:92.08px}.bar .lgS .lgF{font-family:"MMLogoW";font-size:44.39px}@media (max-width:620px){.bar .lgB .lgF{font-size:63.85px}.bar .lgS .lgF{font-size:40.32px}}
@media (max-width:620px){.bar{height:60px}.navdim{top:60px}.navlift{top:68px}.bar .lgB{top:16px;width:138px}.bar .lgS{top:10px;width:89px}.bar.fold .lgB{transform:translateY(-6px) scale(.625)}}
.bar{transition:border-color .4s,background-color .6s var(--e-carro),color .6s var(--e-carro)}.bar:not(.fold){border-bottom-color:transparent}
header.bar .dispB{margin-left:auto}
.bar .disp2 .ar i{position:relative;cursor:pointer}.bar .disp2 .ar i::after{content:"";position:absolute;left:-9px;right:-9px;top:-7px;bottom:-7px}
.navdim{position:fixed;left:0;right:0;top:64px;bottom:0;z-index:40;background:rgba(15,15,14,.24);opacity:0;pointer-events:none;transition:opacity .35s var(--e-corsa)}
.navdim.on{opacity:1;pointer-events:auto}
body.navopen .rail.pnl{opacity:0;pointer-events:none}
.rail.pnl{transition:opacity .3s}
.bar .dispB{all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;padding:6px 4px 6px 10px}
.bar .dispB svg{width:20px;height:20px;fill:currentColor;margin-left:4px}
.bar .dispB:focus-visible{outline:1px solid currentColor}
.rail.pnl{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:39;color:var(--ink)}
.rail.pnl button span,.rail.pnl button.on span{opacity:0;background:var(--bg);padding:3px 7px}.rail.pnl button:hover span{opacity:1}
/* the lift panel: one component for the site menu, the manual and the machine room */
.lift{background:var(--inv);color:var(--inv-ink);padding:16px;display:grid;gap:14px;width:252px}
.lift .scr{display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:12px;padding:10px 12px;border:1px solid rgba(128,128,128,.45)}
.lift .scr .ar{display:grid;gap:3px}.lift .scr .ar i{display:block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;opacity:.22;transition:opacity .2s}
.lift .scr .ar .u{border-bottom:6px solid currentColor}.lift .scr .ar .d{border-top:6px solid currentColor}.lift .scr .ar i.on{opacity:1}
.lift .scr b{font:500 30px/1 var(--f-mono);letter-spacing:-.04em;min-width:2ch}
.lift .scr>span:last-child{font:400 10px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;opacity:.7;text-align:right}
.lift ol{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.lift li button{all:unset;cursor:pointer;display:grid;grid-template-columns:40px 1fr 10px;align-items:center;gap:12px;width:100%;box-sizing:border-box}
.lift li .sw{width:10px;height:10px;border:1px solid rgba(128,128,128,.55);box-sizing:border-box;transition:opacity .25s}
.lift.pre .scr b,.lift.pre .scr>span:last-child{opacity:.5}
.lift.code li .nm,.lift.code li .sw,.lift.code li button:hover .nm{opacity:.1}
.lift.code .scr b{letter-spacing:.12em;font-size:24px}
.lift .scr.no{animation:liftNo .4s}
@keyframes liftNo{20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
.lift.flick{animation:liftFlick .9s steps(1) 1}
@keyframes liftFlick{0%,30%,60%{opacity:1}15%,45%,75%{opacity:.55}}
.lift .sq{width:40px;height:40px;border:1.5px solid currentColor;display:grid;place-items:center;font:500 13px var(--f-mono);box-sizing:border-box;position:relative;transition:background-color .35s var(--e-scatto),color .35s var(--e-scatto)}
.lift li .nm{font:500 14.5px var(--f-body);opacity:.62;transition:opacity .25s}
.lift li button:hover .nm,.lift li.cur .nm{opacity:1}
.lift li.cur .sq{background:var(--inv-ink);color:var(--inv)}
.lift li.call .sq::after{content:"";position:absolute;inset:4px;border:1.5px solid currentColor;animation:sBlink .9s steps(2,start) infinite}
.lift li button:focus-visible .sq{outline:2px solid currentColor;outline-offset:2px}
.lift .keyw{display:grid;grid-template-columns:40px 1fr;gap:12px;align-items:center;border-top:1px solid rgba(128,128,128,.4);padding-top:14px}
.lift .keyw b{font:500 13px var(--f-mono);display:block}.lift .keyw span{font:400 10px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;opacity:.65}
.cyl{all:unset;cursor:pointer;width:40px;height:40px;border-radius:50%;border:1.5px solid currentColor;box-sizing:border-box;position:relative;display:block;flex:none}
.cyl i{position:absolute;left:50%;top:22%;bottom:22%;width:3px;margin-left:-1.5px;background:currentColor;transition:transform .8s var(--e-carro)}
.cyl.on i{transform:rotate(90deg)}
.cyl.sec i{transform:rotate(135deg)}
.cyl .n3{position:absolute;left:50%;top:50%;width:1.5px;height:4px;margin:-2px 0 0 -.75px;background:currentColor;opacity:.22;transform:rotate(135deg) translateY(-25px)}
.cyl::before,.cyl::after{content:"";position:absolute;background:currentColor}
.cyl::before{left:50%;top:-7px;width:1.5px;height:4px;margin-left:-.75px;opacity:.5}
.cyl::after{top:50%;right:-7px;height:1.5px;width:4px;margin-top:-.75px}
.cyl:focus-visible{outline:2px solid currentColor;outline-offset:4px}
.navlift{position:fixed;top:72px;right:clamp(12px,3vw,32px);z-index:41;transform:translateY(-12px);opacity:0;pointer-events:none;transition:opacity .35s var(--e-corsa),transform .45s var(--e-corsa);box-shadow:0 18px 50px rgba(0,0,0,.28)}
.navlift.on{transform:none;opacity:1;pointer-events:auto}
.navlift{max-height:calc(100vh - 88px);overflow:auto}
/* cover */
.cov{padding-top:150px}
.cov h1{font:700 clamp(46px,7.4vw,108px)/.92 var(--f-body);letter-spacing:-.055em;max-width:12ch}
.cov .lead{font-size:clamp(16px,1.5vw,19px);max-width:62ch;opacity:.86}
.cov .hm{max-width:520px;margin-top:10px}
.sum{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border:1.5px solid var(--ink)}
.sum>div{display:grid;grid-template-columns:150px minmax(0,1fr);gap:14px;padding:14px 18px;border-bottom:1px solid var(--ln);align-items:baseline}
.sum>div:nth-child(odd){border-right:1px solid var(--ln)}
.sum>div:nth-last-child(-n+2){border-bottom:0}
.sum span{font:400 10.5px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut)}
.sum b{font:600 15px/1.35 var(--f-body)}
/* brand */
.onl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--ln)}
.onl>div{background:var(--bg);color:var(--ink);padding:34px 24px 40px;display:grid;place-items:center;position:relative;min-height:190px}
.onl>div .lab{position:absolute;left:12px;bottom:10px}
.rl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.rl div{border-top:1.5px solid var(--ink);padding-top:10px;display:grid;gap:4px;align-content:start}
.rl span{font:400 11px var(--f-mono);color:var(--mut)}.rl b{font:700 17px/1.2 var(--f-body);letter-spacing:-.02em}.rl p{font-size:14px;opacity:.85}
/* motion moments */
.mom{width:100%;max-width:640px;cursor:pointer}
.mom .mm path{transform-box:fill-box}
.press .car{animation:press 7s var(--e-carro) infinite}
.rep{position:absolute;right:12px;bottom:10px;font:400 10px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--mut)}
/* type */
.ltr6{display:flex;gap:clamp(18px,3vw,40px);height:clamp(48px,6vw,72px);align-items:flex-end}.ltr6 .lt{height:100%;width:auto;display:block}.ltr6 .lt path{fill:currentColor}
.fonts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.fonts>div{background:var(--sf);padding:20px;display:grid;gap:10px;align-content:start}
.fonts .sp{font:700 54px/1 var(--f-body);letter-spacing:-.04em}
.fonts .sp.m{font:400 40px/1 var(--f-mono);letter-spacing:-.02em}
.fonts b{font:700 18px var(--f-body)}.fonts p{font-size:14px;opacity:.85}
.fonts .tg{justify-self:start;font:400 10px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;padding:3px 7px;border:1px solid var(--ln)}
/* posters */
.posters.p3c{grid-template-columns:repeat(3,minmax(0,1fr))}
.pf.p2.ct{background:#F4F2EC}.pf.p4.gr4{background:#BEC2BF}
.prules{background:var(--sf);padding:22px;display:grid;gap:12px;align-content:start}
.prules b{font:700 18px var(--f-body)}.prules li{font-size:14.5px;margin:4px 0}
.prules ul{margin:0;padding-left:18px}
/* floors */
.shaft.tall{aspect-ratio:auto;height:500px}
.shaft.tall .door{width:50%}
.shaft .door .sym{position:absolute;top:50%;width:var(--sw,60px);transform:translateY(-50%);color:var(--inv-ink);opacity:0}
.shaft.sigil .door .sym{opacity:1}
.shaft .door.l .sym{left:calc(100% - var(--sw,60px)/2)}.shaft .door.r .sym{left:calc(var(--sw,60px)/-2)}
.shaft .door{overflow:hidden}
.ldemo{width:100%;display:grid;grid-template-columns:252px minmax(0,1fr);gap:16px;align-items:stretch}
.rule2{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1.5px solid var(--ink)}
.rule2>div{padding:20px;display:grid;gap:8px;align-content:start}.rule2>div+div{border-left:1.5px solid var(--ink)}
.rule2 b{font:700 22px/1.1 var(--f-body);letter-spacing:-.03em}.rule2 p{font-size:14.5px;opacity:.85}
/* machine room */
.pg13{position:absolute;inset:0;z-index:1;background:#0F0F0E;color:#F1EEE7;display:grid}
.login{display:grid;place-items:center;padding:28px;position:relative}
.login .tl{position:absolute;left:22px;top:18px;font:500 54px/1 var(--f-mono);letter-spacing:-.05em}
.login .tr{position:absolute;right:22px;top:24px;font:400 10px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;opacity:.6;text-align:right}
.login .bx{display:grid;justify-items:center;gap:18px;text-align:center}
.login .cyl{width:112px;height:112px;border-width:2px}
.login .cyl i{width:6px;margin-left:-3px}
.login .cyl::before{top:-12px;height:7px;width:2px;margin-left:-1px}.login .cyl::after{right:-12px;width:7px;height:2px;margin-top:-1px}
.login .mk{position:relative}
.login .mk em{position:absolute;font:400 10px var(--f-mono);font-style:normal;letter-spacing:.06em;opacity:.6}
.login .mk .e0{left:50%;top:-30px;transform:translateX(-50%)}.login .mk .e1{right:-40px;top:50%;transform:translateY(-50%)}
.login h4{font:700 34px/1 var(--f-body);letter-spacing:-.04em}
.login .hint2{font:400 11px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;opacity:.65;min-height:1.4em;display:flex;gap:10px;align-items:center;justify-content:center}
.login .alt{font:400 11px var(--f-mono);letter-spacing:.06em;opacity:.5;text-decoration:underline;text-underline-offset:3px}
.pg13 .mdash{height:100%}
.pg13[hidden]{display:none}
/* misc */
.dirs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.dirs>div{background:var(--sf);padding:16px;display:grid;gap:6px;align-content:start}
.dirs b{font:700 15px var(--f-body)}.dirs p{font-size:13.5px;opacity:.85}
.dirs .y{color:#2F7D5B;font:400 10px var(--f-mono);letter-spacing:.08em;text-transform:uppercase}.dirs .n{color:#B83A2C;font:400 10px var(--f-mono);letter-spacing:.08em;text-transform:uppercase}
[data-luce="notte"] .dirs .y{color:#6FBF97}[data-luce="notte"] .dirs .n{color:#E07A6C}
.gl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.gl>div{border-top:1.5px solid var(--ink);padding-top:12px;display:grid;gap:8px;align-content:start}
.gl h4{font:700 20px/1.1 var(--f-body);letter-spacing:-.03em}
.gl ul{margin:0;padding:0;list-style:none;display:grid}
.gl li{font-size:14.5px;padding:7px 0;border-bottom:1px solid var(--ln)}
.gl li span{font:400 10.5px var(--f-mono);color:var(--mut);margin-left:6px}
.gl a{color:inherit}
.endg{display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap}
.endg .mm{width:min(420px,70vw)}
.sigs .tx>b{font:700 16px/1.2 var(--f-body)}
.card .map table{min-width:0}
table{color:inherit;font-size:inherit;font-family:inherit}
@media (max-width:980px){.onl,.rl,.dirs{grid-template-columns:1fr 1fr}.fonts,.posters.p3c,.gl{grid-template-columns:1fr 1fr}.ldemo{grid-template-columns:1fr}.ldemo .lift{width:100%}}
@media (max-width:760px){.rail{display:none}}
@media (max-width:620px){.sum{grid-template-columns:1fr}.sum>div{grid-template-columns:1fr;gap:2px;border-right:0!important;border-bottom:1px solid var(--ln)!important}.onl,.rl,.dirs,.fonts,.posters.p3c,.gl,.rule2{grid-template-columns:1fr}.rule2>div+div{border-left:0;border-top:1.5px solid var(--ink)}.flh{grid-template-columns:1fr}.bar .mm{width:104px}.bar .disp2 .nm{display:none}.shaft.tall{height:560px}.login .tl{font-size:38px}.navlift{left:12px;right:12px;width:auto}}

/* ===== v2: floor 11, the site ===== */
.tower{display:grid;grid-template-columns:28px minmax(0,1fr);gap:14px}
.shaftline{position:relative;border-left:1.5px solid var(--ink);margin-left:12px}
.shaftline i{position:absolute;left:-7px;top:0;width:12px;height:12px;background:var(--ink)}
.fls{display:grid;border:1px solid var(--ln)}
.frow{display:grid;grid-template-columns:90px minmax(0,1fr) auto;gap:18px;align-items:center;padding:18px 20px;background:var(--bg);color:var(--ink);min-height:92px}
.frow .fn{font:500 44px/1 var(--f-mono);letter-spacing:-.05em}
.frow b{font:700 22px/1.1 var(--f-body);letter-spacing:-.03em}.frow p{font-size:14px;opacity:.85;margin-top:4px;max-width:70ch}
.frow .fc{font:400 10.5px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut);text-align:right}
.gline{height:0;border-top:3px solid var(--ink);position:relative}
.gline span{position:absolute;right:12px;top:-22px;font:400 10px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}
.anat{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:18px;align-items:start}
.apage{background:var(--bg);color:var(--ink);border:1px solid var(--ln);display:grid;gap:22px;padding:0 0 0}
.apage>*{position:relative}
.abar{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--ln)}
.abar .mm{width:110px}.abar .ad{font:500 12px var(--f-mono)}
.asill{display:flex;align-items:baseline;gap:12px;margin:0 22px;border-bottom:1.5px solid var(--ink);padding-bottom:6px}
.asill .an{font:500 40px/.9 var(--f-mono);letter-spacing:-.05em}
.ahead{margin:0 22px}.ahead b{font:700 clamp(24px,2.6vw,34px)/1 var(--f-body);letter-spacing:-.04em;display:block;max-width:16ch}
.agrid{display:grid;grid-template-columns:1.3fr 1fr;gap:12px;margin:0 22px}
.ashot{background:#FFFFFF;border-radius:4px;padding:10px;display:grid;grid-template-columns:26% 1fr;gap:8px;min-height:120px;box-shadow:0 1px 0 rgba(0,0,0,.06)}
.ashot .sb{background:#2E5BFF;border-radius:3px}.ashot .mn{display:grid;gap:6px;align-content:start}.ashot .mn i{display:block;height:9px;background:#E6EAF5;border-radius:2px}.ashot .mn i:first-child{height:18px;width:60%;background:#FFB547}
.aill svg{display:block;width:100%;height:100%;min-height:120px}
.asig{display:flex;align-items:center;gap:10px;margin:0 22px}
.adoor{background:var(--bg);color:var(--ink);padding:16px 22px;display:flex;justify-content:space-between;align-items:baseline}
.adoor b{font:700 18px var(--f-body);letter-spacing:-.02em}.adoor>span:not(.tg2){font:500 26px var(--f-mono)}
.tg2{position:absolute;font:400 9.5px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;padding:2px 6px;white-space:nowrap;z-index:2}
.tg2.m{background:#121211;color:#F4F2EC}.tg2.w{background:#EEC3B1;color:#121211}
.abar .tg2{right:150px;top:14px}.asill .tg2{right:0;top:4px}.ahead .tg2{right:0;top:2px}.ashot .tg2,.aill .tg2{left:6px;bottom:6px}.asig .tg2{right:0}.adoor .tg2{right:60px;top:-9px}
.aill{position:relative}
.arules{display:grid;gap:12px}
.arules>div{border-top:1.5px solid var(--ink);padding-top:10px}.arules b{font:700 17px var(--f-body);letter-spacing:-.02em}.arules p{font-size:14.5px;opacity:.85;margin-top:4px}
.range{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.range>div{aspect-ratio:4/3;padding:18px;display:grid;align-content:space-between;justify-items:start;gap:8px}
.range svg{width:64px;height:48px}.range span{font:400 10px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;opacity:.7}
/* ===== floor 10, illustrations ===== */
.film{background:#2B1D14;padding:clamp(10px,2vw,22px)}
.film svg{display:block;width:100%;height:auto}
.filo{position:relative;padding-left:34px}
.filo>.fl-l{position:absolute;left:6px;top:0;bottom:0;width:1.5px;background:currentColor}
.filo>.fl-q{position:absolute;left:1px;top:0;width:12px;height:12px;background:currentColor;transition:transform .7s var(--e-carro)}
.deck.filo>.fl-l,.deck.filo>.fl-q{color:var(--ink)}
@media (max-width:620px){.filo{padding-left:22px}.filo>.fl-l{left:3px}.filo>.fl-q{left:-1.5px;width:9px;height:9px}}
.micro6{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.micro6>div{background:var(--sf);padding:12px 12px 16px;display:grid;gap:6px;align-content:start}
.micro6 svg{display:block;width:100%;height:auto;margin-bottom:6px}
.bld .win{background:var(--bg);color:var(--ink);padding:16px 18px;display:grid;gap:6px;max-width:560px}
.micro6>div{border:1px solid var(--ln)}
.tvk{font:400 10px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut);padding-top:2px}
.tvf{margin:0}.tvf svg{margin:0 0 6px!important}
.tvg{display:flex;align-items:center;gap:8px;font:400 10px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin:0 0 8px}
.micro6+.tvg{margin-top:16px}.tvg i{width:14px;height:1px;background:currentColor;opacity:.6}
/* ===== LG · the passage to The Lab ===== */
.sx{--sp:#171716;--sk:#F1EEE7;--sm:rgba(241,238,231,.55);--sl:rgba(241,238,231,.16);display:grid;grid-template-columns:252px minmax(0,1fr);gap:16px;color:var(--sk);align-items:start}
.sxp{background:var(--sp);padding:16px;display:grid;gap:12px;align-content:start;border:1px solid var(--sl)}
.sxs{display:grid;grid-template-columns:1fr auto;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--sl);margin-bottom:4px}
.sxs b{font:500 30px/1 var(--f-mono);letter-spacing:-.04em;min-width:2.2ch}
.sxs span{font:400 10px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--sm);text-align:right}
.sxfl{all:unset;cursor:pointer;display:grid;grid-template-columns:40px 1fr;align-items:center;gap:12px;-webkit-user-select:none;user-select:none}
.sxfl .sq{width:40px;height:40px;border:1.5px solid currentColor;display:grid;place-items:center;font:500 13px var(--f-mono);box-sizing:border-box;transition:background-color .25s,color .25s}
.sxfl .nm{font:500 14.5px var(--f-body);color:var(--sm)}
.sxfl.cur .sq{background:var(--sk);color:var(--sp)}.sxfl.cur .nm{color:var(--sk)}
.sxfl.hit .sq{background:rgba(241,238,231,.25)}
.sxfl:focus-visible .sq{outline:2px solid var(--sk);outline-offset:2px}
.sxp.flick{animation:sxFlick .9s steps(1) 1}
@keyframes sxFlick{0%,30%,60%{opacity:1}15%,45%,75%{opacity:.55}}
.sxlog{border-top:1px solid var(--sl);padding-top:12px;margin-top:4px;display:grid;gap:6px;font:400 10px/1.4 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--sm)}
.sxlog b{font-weight:400;color:var(--sk)}
.sxw{position:relative;min-height:560px;background:#0B0B0A;border:1px solid var(--sl);overflow:hidden;perspective:1100px}
.sxst{position:absolute;inset:0;padding:24px;opacity:0;visibility:hidden;transition:opacity .5s,visibility 0s .5s}
.sxst.on{opacity:1;visibility:visible;transition:opacity .5s}
.sxk{font:400 10px var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--sm)}
/* the machine room screen */
.sx0{display:grid;grid-template-rows:auto 1fr auto;gap:18px;transform-origin:0 50%;transform-style:preserve-3d}
.sx0 .top{display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid var(--sl);padding-bottom:14px}
.sx0 .top .brand{display:flex;align-items:center;gap:12px}.sx0 .top .brand>div{width:20px}.sx0 .top .brand svg{display:block;width:100%;height:auto}
.sxbay{position:relative;transform-style:preserve-3d}
/* the compartment behind the hatch */
.sxcmp{position:absolute;inset:0;background:#060606;border:1px solid var(--sl);box-shadow:inset 0 26px 50px rgba(0,0,0,.9),inset 0 0 0 6px #0B0B0A,inset 0 0 0 7px rgba(241,238,231,.08);display:grid;align-content:center;justify-items:center;gap:18px;padding:22px;visibility:hidden}
.sxcmp.on{visibility:visible}
.sxcmp h5{font:700 22px/1.1 var(--f-body);letter-spacing:-.02em;margin:0}
.sxkeys{display:grid;grid-template-columns:auto auto;gap:44px;align-items:end}
.sxkeys>div{display:grid;justify-items:center;gap:12px;text-align:center}
.sxcy{all:unset;cursor:pointer;width:84px;height:84px;border-radius:50%;border:1.5px solid var(--sk);box-sizing:border-box;position:relative;display:block;box-shadow:0 0 0 6px rgba(241,238,231,.04)}
.sxcy i{position:absolute;left:50%;top:20%;bottom:20%;width:5px;margin-left:-2.5px;background:var(--sk);border-radius:3px;transition:transform .7s cubic-bezier(.65,0,.35,1)}
.sxcy.on i{transform:rotate(90deg)}
.sxcy:focus-visible{outline:1.5px solid var(--sk);outline-offset:6px}
.sxph{width:62px;height:108px;border:1.5px solid var(--sk);border-radius:12px;display:grid;place-items:center;position:relative}
.sxph::before{content:"";position:absolute;top:7px;left:50%;width:16px;height:3px;margin-left:-8px;border-radius:2px;background:var(--sk);opacity:.6}
.sxph .sxcy{width:40px;height:40px;box-shadow:none}.sxph .sxcy i{width:3px;margin-left:-1.5px}
.sxph.wait{animation:sxWait 1s ease-in-out infinite}
@keyframes sxWait{50%{border-color:rgba(241,238,231,.3)}}
.sxkeys b{font:400 10px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--sm)}
.sxkeys .on b{color:var(--sk)}
.sxbar{width:min(300px,80%);height:2px;background:var(--sl);position:relative;overflow:hidden}.sxbar i{position:absolute;inset:0;background:var(--sk);transform-origin:0 50%;transform:scaleX(0)}
.sxmsg{font:400 11px var(--f-mono);letter-spacing:.06em;color:var(--sm);min-height:14px}
/* the hatch: a piece of the page that comes away */
.sxhatch{position:relative;height:100%;min-height:270px;background:#0B0B0A;transform-origin:50% 0;backface-visibility:hidden}
.sxhatch .rows{display:grid;gap:8px;align-content:start}
.sxhatch .rows div{display:grid;grid-template-columns:70px 1fr 90px;gap:12px;align-items:center;border-bottom:1px solid var(--sl);padding:9px 0;font:400 12px var(--f-mono)}
.sxhatch .rows span{color:var(--sm)}.sxhatch .rows em{font-style:normal;text-align:right;color:var(--sm);font-size:10px;letter-spacing:.1em;text-transform:uppercase}
.sxseam{position:absolute;inset:-8px;pointer-events:none;opacity:0}
.sxseam i{position:absolute;background:var(--sk)}
.sxseam i:nth-child(1){left:0;right:0;top:0;height:1px;transform-origin:0 0}.sxseam i:nth-child(2){top:0;bottom:0;right:0;width:1px;transform-origin:0 0}
.sxseam i:nth-child(3){left:0;right:0;bottom:0;height:1px;transform-origin:100% 0}.sxseam i:nth-child(4){top:0;bottom:0;left:0;width:1px;transform-origin:0 100%}
/* the corridor */
.sxc{padding:0;background:#0B0B0A}
.sxc svg{position:absolute;inset:0;width:100%;height:100%}
.sxc .lbl{position:absolute;left:24px;top:24px}
.sxflash{position:absolute;inset:0;background:#F1EEE7;opacity:0;pointer-events:none;z-index:5}
/* the door at the end of the corridor */
.sxwall{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;visibility:hidden;z-index:3}
.sxwall.on{visibility:visible}
.sxwall>div{position:relative;overflow:hidden;background:#141413;border:1px solid var(--sl)}
.sxwall .sym{position:absolute;top:50%;width:120px;transform:translateY(-50%);color:var(--sk)}
.sxwall .sym svg{display:block;width:100%;height:auto}
.sxwall .l .sym{right:-60px}.sxwall .r .sym{left:-60px}
/* the lab */
.sx3{display:grid;grid-template-rows:auto 1fr auto auto;gap:18px;padding:28px}
.sx3 h4{font:700 clamp(54px,8vw,96px)/.9 var(--f-body);letter-spacing:-.045em;margin:10px 0 0}
.sx3 .sub2{font:400 15px/1.45 var(--f-body);color:var(--sm);max-width:38ch;margin-top:12px}
.sx3 .gr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.sx3 .gr div{border:1px solid var(--sl);padding:12px;display:grid;gap:18px;min-height:100px;align-content:space-between}
.sx3 .gr b{font:600 15px var(--f-body)}.sx3 .gr span{font:400 10px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--sm)}
.sx3 .ft{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.sx3 .ft button{all:unset;cursor:pointer;font:400 10px var(--f-mono);letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--sl);padding:7px 10px}
.sx3 .ft button:focus-visible{outline:1.5px solid var(--sk)}
@media (max-width:980px){.sx{grid-template-columns:1fr}.sxw{min-height:520px}.sx3 .gr{grid-template-columns:1fr}.sxhatch .rows div{grid-template-columns:56px 1fr}.sxhatch .rows em{display:none}.sxkeys{gap:24px}}
.micro6 b{font:700 17px var(--f-body);letter-spacing:-.02em}.micro6 p{font-size:14px;opacity:.85}
@media (max-width:980px){.anat{grid-template-columns:1fr}.range{grid-template-columns:1fr 1fr}.micro6{grid-template-columns:1fr 1fr}}
@media (max-width:620px){.frow{grid-template-columns:56px 1fr;gap:12px}.frow .fc{grid-column:2;text-align:left}.frow .fn{font-size:32px}.micro6,.range{grid-template-columns:1fr}.agrid{grid-template-columns:1fr}.abar .tg2{display:none}.tower{grid-template-columns:1fr}.shaftline{display:none}}
</style>

<header class="bar" id="bar" data-luce="carta"><a class="blogo" href="#top" aria-label="Mother Machine"><span class="lgB" data-a="heroS"><i class="lgF" aria-hidden="true">&#xE000;</i></span><span class="lgS" data-a="heroW"><i class="lgF" aria-hidden="true">&#xE000;</i></span></a><button class="dispB disp2" id="dispB" aria-label="Open the floors panel"><span class="ar"><i class="u" id="bU"></i><i class="d" id="bD"></i></span><span class="nw" id="bN"><b>11</b></span><span class="nm" id="bL">Il sito</span><svg viewBox="0 0 24 24"><path d="/*I:floors*/"/></svg></button></header>
<div class="navdim" id="navDim"></div>
<div class="lift navlift" id="navLift" data-luce="carta"></div>
<div class="pnl rail" id="rail"></div>

<!-- ============ COVER ============ -->
<section class="fl cov" data-luce="carta" id="top"><div class="in">
  <div class="sub">
    <span class="lab">Mother Machine · manuale dell'identità · versione 2</span>
    <h1>Il manuale. Tutto, in un posto solo.</h1>
    <p class="lead">Tutto quello che abbiamo approvato, dal primo kit del marchio a oggi. La versione 2 non toglie niente: aggiunge in cima come si usa tutto questo nel sito vero, multipagina e con aria, e le illustrazioni che lo scaldano. La Machine Room scende sottoterra, a LG. Si legge scendendo piano per piano, oppure con la pulsantiera in alto a destra.</p>
  </div>
  <div class="sub"><h3>In una pagina <small>le decisioni prese</small></h3>
    <div class="sum">
      <div><span>Nome</span><b>Mother Machine</b></div>
      <div><span>Dominio e lingua</span><b>mothermachine.studio · inglese internazionale</b></div>
      <div><span>Marchio</span><b>La m alta due righe, due piani di archi. Sempre in un colore solo.</b></div>
      <div><span>Movimento</span><b>Carroponte, porte, torre. Il marchio non segnala mai niente.</b></div>
      <div><span>Posizionamento</span><b>A design and engineering studio for companies that want to grow.</b></div>
      <div><span>Apertura</span><b>The machine behind your business.</b></div>
      <div><span>Offerta</span><b>Systems (custom software, UI e UX) dentro, Brand fuori. Un solo studio.</b></div>
      <div><span>Colore</span><b>Carta, inchiostro, notte, grigio macchina, rosa anche a pagine intere.</b></div>
      <div><span>Caratteri</span><b>Hanken Grotesk e DM Mono. Il lettering del marchio solo per logo e poster.</b></div>
      <div><span>Sito</span><b>Multipagina. Ogni pagina è un piano: dalla home in alto si scende fino a G, il contatto.</b></div>
      <div><span>Tono</span><b>Machine e mother, metà e metà: la struttura si vede, ma con aria.</b></div>
      <div><span>Illustrazioni</span><b>Un film e sei animazioni dei servizi, in codice, con marchi concept a colori.</b></div>
      <div><span>Segnali</span><b>Quadrati che si muovono: dicono cosa sta facendo il sito.</b></div>
      <div><span>Backoffice</span><b>Machine Room, sottoterra a LG. Si entra solo con la chiave.</b></div>
    </div>
  </div>
</div></section>

<!-- ============ 11 THE SITE ============ -->
<section class="fl" data-luce="carta" data-f="11" data-n="Il sito" id="f11"><div class="in">
  <header class="flh"><span class="n">11</span><div><span class="k">Floor 11 · come si usa tutto questo</span><h2>Il sito è un palazzo di pagine</h2><p>Questo manuale è compresso per natura: tutti i pezzi uno sotto l'altro, senza respiro. Il sito no. È multipagina, ogni pagina è un piano, e tutto quello che c'è qui sotto si usa, distribuito con aria. Il laboratorio si vede e ci piace, ma non schiaccia il resto.</p></div></header>
  <div class="sub"><h3>Il palazzo <small>dalla home in alto fino al piano terra, poi sottoterra</small></h3>
    <div class="tower">
      <div class="shaftline"><i id="cab"></i></div>
      <div class="fls">
        <div class="frow" data-luce="carta"><span class="fn">05</span><div><b>Home</b><p>The machine behind your business. Le due pratiche, un numero vero, il film, i lavori in vetrina.</p></div><span class="fc">Carta</span></div>
        <div class="frow" data-luce="notte"><span class="fn">04</span><div><b>Work</b><p>Il registro delle macchine. Ogni progetto è una stanza del piano: 04 · No. 014, con la sua pagina.</p></div><span class="fc">Notte</span></div>
        <div class="frow" data-luce="macchina"><span class="fn">03</span><div><b>Systems</b><p>Custom software: gestionali, app e web app, ecommerce, automazioni. Product design, UI e UX. Il sistema dal vivo.</p></div><span class="fc">Grigio</span></div>
        <div class="frow" data-luce="carta"><span class="fn">02</span><div><b>Brand</b><p>Identità, siti, art direction, grafica. I lavori dei clienti con i loro colori: qui la cornice è carta perché il colore lo porta il contenuto.</p></div><span class="fc">Carta</span></div>
        <div class="frow" data-luce="rosa2"><span class="fn">01</span><div><b>Studio</b><p>Chi siamo e come lavoriamo: Survey, Build, Run. La torre del marchio in apertura.</p></div><span class="fc">Rosa</span></div>
        <div class="frow" data-luce="rosa2"><span class="fn">G</span><div><b>Contact</b><p>Tell us what slows you down. L'ordine di lavoro. Il primo incontro è gratuito.</p></div><span class="fc">Rosa</span></div>
        <div class="gline"><span>Ground level</span></div>
        <div class="frow" data-luce="notte"><span class="fn">LG</span><div><b>Machine Room</b><p>Sottoterra, solo con la chiave. Il nostro backoffice, sistema No. 001.</p></div><span class="fc">Notte · key only</span></div>
      </div>
    </div>
    <div class="rl">
      <div><span>Regola 1</span><b>Una pagina, un piano.</b><p>Cambiare pagina è la corsa dell'ascensore: porte, display che conta, porte che si aprono già nella luce nuova.</p></div>
      <div><span>Regola 2</span><b>La pulsantiera è il menu.</b><p>Dall'alto in basso, l'ordine dei bottoni è l'ordine dei piani. Un menu solo, niente doppioni.</p></div>
      <div><span>Regola 3</span><b>Le sezioni sono locali.</b><p>Dentro una pagina: 03.1, 03.2. Il colore della pagina non cambia; il nero o il rosa entrano solo come finestre.</p></div>
      <div><span>Regola 4</span><b>Ogni pagina ha la porta per G.</b><p>In fondo a ogni piano, una fascia rosa porta al piano terra: il contatto è sempre a un piano di distanza.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Machine e mother <small>più o meno metà e metà</small></h3>
    <p class="lead">La struttura (piani, segnali, numeri, etichette) è la parte machine: dice che sappiamo costruire. Il contenuto (lavori, colore, persone, illustrazioni, frasi umane) è la parte mother: dice che sappiamo fare marchi per chiunque. Oggi la struttura pesa un po' di più perché i progetti sono pochi; ogni lavoro nuovo sposta l'equilibrio verso il contenuto.</p>
    <div class="anat">
      <div class="apage" data-luce="macchina">
        <div class="abar"><div data-a="line"></div><span class="tg2 m">Machine</span><span class="ad">03 · Systems</span></div>
        <div class="asill"><span class="an">03</span><span class="lab">Systems</span><span class="tg2 m">Machine</span></div>
        <div class="ahead"><b>Custom software that runs the company.</b><span class="tg2 w">Mother</span></div>
        <div class="agrid">
          <div class="ashot"><div class="sb"></div><div class="mn"><i></i><i></i><i></i><i></i></div><span class="tg2 w">Mother · lavoro del cliente</span></div>
          <div class="aill"><svg viewBox="0 0 120 90"><rect width="120" height="90" fill="#F6E7C8"/><path d="M38 70V48a22 22 0 0 1 44 0v22" fill="none" stroke="#D2582A" stroke-width="7"/><path d="M28 70h64" stroke="#2B1D14" stroke-width="5"/></svg><span class="tg2 w">Mother · illustrazione</span></div>
        </div>
        <div class="asig"><span class="sig sm h5 s-search"><i></i><i></i><i></i><i></i><i></i><b></b></span><span class="lab">Searching</span><span class="tg2 m">Machine</span></div>
        <div class="adoor" data-luce="rosa2"><b>Tell us what slows you down.</b><span>G</span><span class="tg2 w">Mother · la porta</span></div>
      </div>
      <div class="arules">
        <div><b>Il laboratorio si vede</b><p>Numeri dei piani, segnali, etichette in mono, schemi e infografiche. Ci piacciono e restano, con tanto spazio intorno.</p></div>
        <div><b>Il colore arriva dal contenuto</b><p>I lavori dei clienti con le loro palette, le illustrazioni concept, il rosa a pagina intera.</p></div>
        <div><b>Persone e posti veri</b><p>Foto con luce reale: chi usa il sistema, il locale, il magazzino. Mai repertorio.</p></div>
        <div><b>Frasi umane, in grande</b><p>Parliamo dei problemi di chi lavora, non di tecnologia. "Tell us what slows you down."</p></div>
      </div>
    </div>
  </div>
  <div class="sub"><h3>Si parla a tutti <small>la cornice resta nostra, la pelle è del cliente</small></h3>
    <div class="range">
      <div style="background:#F6E7C8;color:#2B1D14"><svg viewBox="0 0 80 60"><path d="M22 48V30a18 18 0 0 1 36 0v18" fill="none" stroke="#D2582A" stroke-width="6"/><path d="M14 48h52" stroke="#2B1D14" stroke-width="4"/></svg><b style="font:800 22px/1 var(--f-body);letter-spacing:-.03em">forno nove</b><span>Bakery · giocoso</span></div>
      <div style="background:#EEF3F8;color:#12355B"><svg viewBox="0 0 80 60"><circle cx="40" cy="30" r="17" fill="none" stroke="#12355B" stroke-width="4"/><path d="M40 16v28M26 30h28" stroke="#3FA7D6" stroke-width="4"/></svg><b style="font:500 19px/1 var(--f-body);letter-spacing:.14em;text-transform:uppercase">Lumen Lab</b><span>Farmaceutica · serio</span></div>
      <div style="background:#141414;color:#F2EDE4"><svg viewBox="0 0 80 60"><path d="M24 46L40 14L56 46" fill="none" stroke="#F2EDE4" stroke-width="2"/><path d="M30 34h20" stroke="#C9A46A" stroke-width="2"/></svg><b style="font:italic 400 24px/1 Georgia,serif">Atelier Ottavo</b><span>Moda · editoriale</span></div>
      <div style="background:#1F4D3A;color:#F3D35B"><svg viewBox="0 0 80 60"><rect x="26" y="14" width="28" height="34" rx="4" fill="none" stroke="#F3D35B" stroke-width="4"/><path d="M54 22h6v18h-6" fill="none" stroke="#F3D35B" stroke-width="4"/><path d="M26 22h28" stroke="#F7F1DE" stroke-width="4"/></svg><b style="font:900 22px/1 var(--f-body);letter-spacing:-.02em;text-transform:uppercase">Birrificio Mare</b><span>Birrificio · artigianale</span></div>
    </div>
    <p class="note">Marchi concept, inventati per mostrare la gamma. Sul sito si etichettano sempre "Concept".</p>
  </div>
</div></section>

<!-- ============ 10 ILLUSTRATIONS ============ -->
<section class="fl" data-luce="macchina" data-f="10" data-n="Illustrazioni" id="f10"><div class="in">
  <header class="flh"><span class="n">10</span><div><span class="k">Floor 10 · la parte mother</span><h2>Illustrazioni e film</h2><p>Fanno capire in pochi secondi cosa costruiamo, anche a chi non sa cos'è un back office. Le facciamo noi, in codice: piatte, geometriche, costruite come il marchio (aste, archi, monolinea), ma a colori, con marchi concept. Questa pagina è grigia apposta: il colore lo portano già le illustrazioni, la cornice resta da laboratorio, con tavole numerate e misure.</p></div></header>
  <div class="sub"><h3>Il film: From mark to machine <small>prototipo · 12 secondi in loop</small></h3>
    <div class="film"><svg id="film" viewBox="0 0 640 360" role="img" aria-label="From mark to machine, prototype"></svg></div>
    <div class="rl">
      <div><span>Atto 1</span><b>Il segno</b><p>Una linea disegna il marchio di un cliente concept. Il brand nasce da un gesto.</p></div>
      <div><span>Atto 2</span><b>La struttura</b><p>Il marchio entra in un telefono e in un gestionale: griglia, schermate, righe. Il software prende forma.</p></div>
      <div><span>Atto 3</span><b>La pelle</b><p>Arrivano colore, caratteri, prodotti, ordini che contano. Il marchio e la macchina sono la stessa cosa.</p></div>
      <div><span>Uso</span><b>Home e presentazioni</b><p>Versione lunga 30-40 secondi per la home e le presentazioni. Questo è il prototipo da cui partire.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Sei animazioni, una per servizio <small>un gesto ciascuna · stesso alfabeto</small></h3>
    <div class="tvg"><i></i><span>Outside · what your customers see</span></div>
    <div class="micro6">
      <div><div class="tvf"><svg id="mi1" viewBox="0 0 320 200"></svg></div><span class="tvk">Mark · system · guidelines</span><b>Brand identity</b><p>New brand or rebrand. One mark, everywhere it lives.</p></div>
      <div><div class="tvf"><svg id="mi3" viewBox="0 0 320 200"></svg></div><span class="tvk">iOS · Android · web</span><b>Apps &amp; websites</b><p>UI and UX, from wireframe to the real thing.</p></div>
      <div><div class="tvf"><svg id="mi5" viewBox="0 0 320 200"></svg></div><span class="tvk">Shopify · custom stores</span><b>Ecommerce</b><p>One click, one more order. Stores built to sell.</p></div>
    </div>
    <div class="tvg"><i></i><span>Inside · what runs the company</span></div>
    <div class="micro6">
      <div><div class="tvf"><svg id="mi4" viewBox="0 0 320 200"></svg></div><span class="tvk">Back office · CRM · dashboards</span><b>Management systems</b><p>Scattered tools passing data by hand become one system.</p></div>
      <div><div class="tvf"><svg id="mi2" viewBox="0 0 320 200"></svg></div><span class="tvk">3D · vision · voice</span><b>Custom software</b><p>Complex software, built from scratch. AI included. If it can be imagined, we can build it.</p></div>
      <div><div class="tvf"><svg id="mi6" viewBox="0 0 320 200"></svg></div><span class="tvk">Workflows · APIs · integrations</span><b>Automation</b><p>Nobody at work at night. Everything done by morning.</p></div>
    </div>
  </div>
  <div class="rl">
    <div><span>Stile</span><b>Una grammatica sola</b><p>Fondo tinto per servizio, un oggetto bianco al centro, nero più un accento più grigio, angoli 8, le stesse righe per le interfacce. In basso a sinistra uno stato che cambia: prima, dopo. Un gesto chiaro, generico, valido per qualsiasi cliente.</p></div>
    <div><span>Ordine</span><b>Fuori, poi dentro</b><p>Sopra quello che vedono i clienti (brand, app e siti, ecommerce), sotto quello che fa girare l'azienda (sistemi, software, automazione). Un accento e un fondo tinto per servizio. Titoli e testi in inglese, come sul sito.</p></div>
    <div><span>Tecnica</span><b>In codice</b><p>SVG o Rive: leggere, nitide, interattive. Si fermano con "riduci movimento". Il video vero resta per i lavori veri.</p></div>
    <div><span>Onestà</span><b>Concept, sempre dichiarato</b><p>Quando il marchio è inventato c'è scritto "Concept". I lavori veri arrivano con i loro numeri.</p></div>
  </div>
</div></section>

<!-- ============ 09 BRAND ============ -->
<section class="fl" data-luce="carta" data-f="09" data-n="Il marchio" id="f09"><div class="in">
  <header class="flh"><span class="n">09</span><div><span class="k">Floor 09</span><h2>Il marchio</h2><p>La m alta due righe, con due piani di archi, regge mother e machine. Sempre in un solo colore: inchiostro o carta. Il colore resta fuori dal logo.</p></div></header>
  <div class="sub">
    <div class="hero" data-a="hero"><span class="lab">Principale · il piano inferiore della m è il pezzo che si muove</span></div>
    <div class="vrow"><div data-a="heroS"><span class="lab">Principale</span></div><div><div style="width:34%" data-a="iconS"></div><span class="lab">Simbolo</span></div><div data-a="line"><span class="lab">Riga</span></div><div><div style="width:26%" data-a="icon3"></div><span class="lab">Tre piani</span></div></div>
  </div>
  <div class="sub"><h3>Nell'header <small>il logo vero, appeso</small></h3>
    <div class="rl">
      <div><span>Regola</span><b>Sempre il logo intero</b><p>Nella barra non va una versione semplificata: va il logo vero, simbolo e nome insieme.</p></div>
      <div><span>In cima, poi scorrendo</span><b>Appeso, poi ripiegato</b><p>All'apertura il logo intero pende sotto la barra sottile, grande, come una targa. Appena scorri si riduce con il movimento del carroponte ed entra nella barra: 44 px di altezza su desktop (barra 64 px), 40 px su telefono (barra 60 px). Lettere originali, le h restano sfalsate.</p></div>
      <div><span>Misure piccole</span><b>Tratto +15%</b><p>Sotto i 60 px di altezza si usa la versione per le misure piccole: stesso disegno, aste più spesse del 15%, così il logo non sparisce. Sopra, il tratto originale. Il logo in riga resta solo per le firme ("Built by Mother Machine", piè di pagina, documenti).</p></div>
      <div><span>Resa</span><b>Disegnato come testo</b><p>Nell'header il logo è un carattere: un font di un solo segno, 2 KB, dentro il sito. Il browser lo disegna con il motore del testo, che tiene i bordi netti anche a 40 px; un SVG a quella misura sembra smangiucchiato. Sotto resta l'SVG come riserva, se il font non carica. Fuori dall'header, SVG.</p></div>
    </div>
  </div>
  <div class="sub"><h3>In ogni luce <small>un colore solo, quello del testo</small></h3>
    <div class="onl"><div data-luce="carta"><div style="width:80%" data-a="heroS"></div><span class="lab">Carta · inchiostro</span></div><div data-luce="macchina"><div style="width:80%" data-a="heroS"></div><span class="lab">Grigio · inchiostro</span></div><div data-luce="notte"><div style="width:80%" data-a="heroS"></div><span class="lab">Notte · carta</span></div><div data-luce="rosa2"><div style="width:80%" data-a="heroS"></div><span class="lab">Rosa · inchiostro</span></div></div>
  </div>
  <div class="rl">
    <div><span>Regola 1</span><b>Un colore solo.</b><p>Inchiostro sui fondi chiari, carta sul nero. Mai pezzi del logo in rosa o in un altro colore.</p></div>
    <div><span>Regola 2</span><b>Sotto i 60 px, il simbolo.</b><p>La scritta principale non scende sotto i 60 pixel di larghezza. Sotto si usa la m da sola, o la riga.</p></div>
    <div><span>Regola 3</span><b>Statico per la stampa.</b><p>Per la stampa c'è una versione fusa in un unico tracciato. Quella a pezzi, che si muove, resta per lo schermo.</p></div>
    <div><span>Regola 4</span><b>Disegnato a mano.</b><p>La s ha curva continua e terminali orizzontali come c ed e. Il piano mobile entra dentro le aste: nessuna fessura bianca.</p></div>
  </div>
</div></section>

<!-- ============ 08 BRAND MOTION ============ -->
<section class="fl" data-luce="carta" data-f="08" data-n="Movimento" id="f08"><div class="in">
  <header class="flh"><span class="n">08</span><div><span class="k">Floor 08</span><h2>Il marchio si muove solo per farsi riconoscere</h2><p>Avevi ragione: il logo che fa da caricamento o da segnale confonde. Ora il marchio non comunica mai uno stato, quello lo fanno i quadrati. Il marchio ha tre movimenti, lenti e rari, e torna sempre fermo.</p></div></header>
  <div class="grid2">
    <div class="card"><div class="demo"><div class="mom press" data-a="hero" style="max-width:440px"></div></div>
      <div class="txt"><b>Il carroponte</b><p>Il gesto firma, quello che ci ha fatto scegliere il marchio: il piano inferiore sale e torna giù. Vive nel hero e al passaggio del mouse sul logo nella barra. Mai in loop su più loghi nella stessa pagina.</p></div></div>
    <div class="card"><div class="demo"><div class="entry" id="entry"><div class="pgE"><div data-a="heroS"></div></div><div class="dr l"><div class="sym" data-a="iconS"></div></div><div class="dr r"><div class="sym" data-a="iconS"></div></div><span class="hint">Tocca per rivedere</span></div></div>
      <div class="txt"><b>Le porte</b><p>L'ingresso al sito, alla prima visita: il simbolo sta sulle porte chiuse, la fessura passa nell'asta centrale della m, le porte si aprono. È anche il gesto con cui si entra nella Machine Room.</p></div></div>
    <div class="card" style="grid-column:1/-1"><div class="demo" style="min-height:380px"><div class="mom p1" data-a="p1" style="max-width:380px"></div></div>
      <div class="txt"><b>La torre</b><p>La m cresce di un piano per ogni riga e la frase si scrive con il marchio: mother machine makes machines. Nasce sui poster e sale sul sito in pochi punti scelti: l'apertura della pagina Studio, la chiusura di un caso studio prima del piano terra, i titoli di coda dei video. Una torre per pagina, al massimo.</p></div></div>
  </div>
  <div class="rl">
    <div><span>Movimento 1</span><b>Carroponte</b><p>La m si muove: il piano inferiore sale e torna giù. Nel hero e al passaggio sul logo nella barra.</p></div>
    <div><span>Movimento 2</span><b>Porte</b><p>All'apertura del sito la m si divide in due con le porte. Una volta per visita, e per entrare nella Machine Room.</p></div>
    <div><span>Movimento 3</span><b>Torre</b><p>La m cresce un piano per riga. Poster, apertura di Studio, chiusura dei casi, titoli di coda. Una per pagina.</p></div>
    <div><span>Regola</span><b>Nient'altro.</b><p>Il marchio non si monta, non carica, non segnala. Con "riduci movimento" è sempre fermo.</p></div>
  </div>
  <p class="note">Tolti: il marchio come segnale (in movimento, invio, apertura) e il montaggio.</p>
</div></section>

<!-- ============ 07 COLOUR ============ -->
<section class="fl" data-luce="carta" data-f="07" data-n="Colore" id="f07"><div class="in">
  <header class="flh"><span class="n">07</span><div><span class="k">Floor 07</span><h2>Il colore dice su che piano sei</h2><p>Cinque colori, ognuno con un tipo di piano. Caldo per mother, freddo per machine. Il rosa non è mai un dettaglio: è un posto, e ora può coprire pagine intere.</p></div></header>
  <div class="sub">
    <div class="chips">
      <div class="chip"><i style="background:#F4F2EC"></i><b>Carta</b><span>#F4F2EC · fondo #ECEAE3</span><em>Mother · si parla, si legge. Il default</em></div>
      <div class="chip"><i style="background:#121211"></i><b>Inchiostro</b><span>#121211</span><em>Testo e marchio, in ogni luce</em></div>
      <div class="chip"><i style="background:#BEC2BF"></i><b>Grigio macchina</b><span>#BEC2BF</span><em>Machine · si spiega: metodo, tempi, tecnica</em></div>
      <div class="chip"><i style="background:#0F0F0E"></i><b>Notte</b><span>#0F0F0E</span><em>Machine · si vede girare: prova, sistemi dal vivo</em></div>
      <div class="chip"><i style="background:#EEC3B1"></i><b>Rosa pelle</b><span>#EEC3B1</span><em>Mother · ci si incontra: pagine intere, poster, copertine</em></div>
    </div>
  </div>
  <div class="sub"><h3>Un colore, un tipo di piano</h3>
    <div class="cmap">
      <div data-luce="carta"><span class="k">Carta · mother</span><h4>Si parla.</h4><span class="who">I piani dove si legge e si racconta.</span><ul><li>Home</li><li>Brand, con i lavori a colori</li><li>Testi, casi, pagine progetto</li></ul><span class="never">È il fondo di default. Se hai un dubbio, è carta.</span></div>
      <div data-luce="macchina"><span class="k">Grigio · machine</span><h4>Si spiega.</h4><span class="who">I piani del metodo e della tecnica.</span><ul><li>Systems</li><li>Metodo, tempi, tecnologia</li><li>Schede tecniche, infografiche</li></ul><span class="never">Mai per il contatto, mai per i risultati.</span></div>
      <div data-luce="notte"><span class="k">Notte · machine</span><h4>Si vede girare.</h4><span class="who">I piani dove le macchine sono accese.</span><ul><li>Work, i numeri</li><li>Il sistema dal vivo, come finestra</li><li>Machine Room</li></ul><span class="never">Sopra solo carta. Niente rosa sul nero.</span></div>
      <div data-luce="rosa2"><span class="k">Rosa · mother</span><h4>Ci si incontra.</h4><span class="who">Le pagine delle persone, e le copertine.</span><ul><li>Studio, contatto, ordine di lavoro</li><li>La porta per G in fondo a ogni pagina</li><li>Poster, copertine, social, inviti</li></ul><span class="never">Mai piccolo: niente testo, righe, bottoni o accenti rosa.</span></div>
    </div>
    <div class="rules">
      <div><span>Regola 1</span><b>Un colore, un tipo di piano.</b><p>In due scroll si impara che il grigio è il metodo e il nero è la prova, senza che nessuno lo dica.</p></div>
      <div><span>Regola 2</span><b>Il rosa è sempre una superficie intera.</b><p>Pagine intere (Studio, contatto), la fascia della porta per G, poster e copertine. Fuori dal sito è il colore che ci fa riconoscere.</p></div>
      <div><span>Regola 3</span><b>Il testo è inchiostro o carta.</b><p>Mai testo colorato. Il marchio è sempre del colore del testo.</p></div>
      <div><span>Regola 4</span><b>Un cambio di colore è un cambio di piano.</b><p>Il colore cambia solo con la corsa dell'ascensore, mai dentro la stessa schermata.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Sì e no</h3>
    <div class="dd">
      <div><div class="fr" style="background:#EEC3B1"><span style="font:700 34px/1 var(--f-body);letter-spacing:-.04em;color:#121211">Ground floor.</span></div><span class="v y">Sì</span><p>Rosa come superficie piena, testo in inchiostro.</p></div>
      <div><div class="fr" style="background:#0F0F0E"><span style="font:700 40px/1 var(--f-body);letter-spacing:-.04em;color:#F1EEE7">+30%</span></div><span class="v y">Sì</span><p>Sul nero i numeri sono carta. Pesano di più.</p></div>
      <div><div class="fr" style="background:#0F0F0E"><span style="font:700 40px/1 var(--f-body);letter-spacing:-.04em;color:#EEC3B1">+30%</span></div><span class="v n">No</span><p>Rosa come accento sul nero: è l'uso che lo faceva sembrare messo a caso.</p></div>
      <div><div class="fr" style="background:#BEC2BF"><div style="height:46px;width:70%;background:#EEC3B1"></div></div><span class="v n">No</span><p>Rosa sul grigio, o testo rosa sulla carta: spariscono.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Gli stessi pezzi, in ogni luce</h3>
    <div class="luci">
      <div class="mini" data-luce="carta"><nav><div data-a="line"></div><span>04</span></nav><div class="in"><span class="lab">Carta</span><h4>The machine behind your business.</h4><span class="bt">Start a work order</span></div><div class="nm"><b>+30%</b><span class="lab">bookings · example</span></div></div>
      <div class="mini" data-luce="macchina"><nav><div data-a="line"></div><span>01</span></nav><div class="in"><span class="lab">Grigio</span><h4>Three floors. Fixed timelines.</h4><span class="bt">How we work</span></div><div class="nm"><b>6 wks</b><span class="lab">first release</span></div></div>
      <div class="mini" data-luce="notte"><nav><div data-a="line"></div><span>03</span></nav><div class="in"><span class="lab">Notte</span><h4>The system, live.</h4><span class="bt">Open the back office</span></div><div class="nm"><b>148</b><span class="lab">orders tonight</span></div></div>
      <div class="mini" data-luce="rosa2"><nav><div data-a="line"></div><span>G</span></nav><div class="in"><span class="lab">Rosa</span><h4>Tell us what slows you down.</h4><span class="bt">Start a work order</span></div><div class="nm"><b>2 days</b><span class="lab">to reply</span></div></div>
    </div>
    <div class="states"><span class="st2"><i style="background:#2F7D5B"></i>Running</span><span class="st2"><i style="background:#B7791F"></i>Attention</span><span class="st2"><i style="background:#B83A2C"></i>Error</span><span class="note" style="align-self:center">Colori di stato: solo dentro le interfacce dei sistemi, sempre con la parola accanto. Mai nel marchio, nei titoli o nei fondi.</span></div>
    <div class="ctr"><table><thead><tr><th>Luce</th><th>Testo inchiostro</th><th>Testo carta</th><th>Distacco dalla carta</th><th>Verdetto</th></tr></thead><tbody>
      <tr><td>Carta</td><td>16.7 : 1</td><td>n/a</td><td>n/a</td><td>Base</td></tr>
      <tr><td>Grigio macchina</td><td>10.4 : 1</td><td>n/a</td><td>1.61 : 1</td><td>Distacco chiaro, testo comodo</td></tr>
      <tr><td>Rosa pelle</td><td>11.7 : 1</td><td>n/a</td><td>1.43 : 1</td><td>Solo superficie piena</td></tr>
      <tr><td>Notte</td><td>n/a</td><td>17.1 : 1</td><td>17.1 : 1</td><td>Sopra solo carta</td></tr>
    </tbody></table></div>
  </div>
</div></section>

<!-- ============ 06 TYPE ============ -->
<section class="fl" data-luce="carta" data-f="06" data-n="Carattere" id="f06"><div class="in">
  <header class="flh"><span class="n">06</span><div><span class="k">Floor 06</span><h2>Carattere e ritmo</h2><p>Due caratteri gratuiti per tutto il sito, confermati l'11 ottobre dopo una prova con diciotto caratteri, anche a pagamento. Il lettering del marchio solo per logo, numeri dei piani e poster. Tre curve di movimento, ognuna con il suo nome.</p></div></header>
  <div class="fonts">
    <div><span class="tg">Testi e titoli</span><span class="sp">Aa 30%</span><b>Hanken Grotesk</b><p>Grottesco pulito e un po' geometrico, di Hanken Design Co. Gratuito, licenza OFL, su Google Fonts. È molto usato, ed è il suo pregio: non disturba. La personalità la danno il mono, i numeri grandi e il marchio.</p></div>
    <div><span class="tg">Etichette e piani</span><span class="sp m">04 · No. 014</span><b>DM Mono</b><p>Monospaziato di Colophon, gratuito OFL. Per numeri dei piani, etichette, codici, display. È la voce della macchina.</p></div>
    <div><span class="tg">Solo marchio e poster</span><div style="width:84%" data-a="line"></div><b>Lettering Mother Machine</b><p>Disegnato da noi, monolinea geometrico. Diciassette minuscole, la s corretta, i numeri da 0 a 5, G e L. Solo per marchio, numeri dei piani nelle aperture delle pagine e poster. Mai per testi.</p></div>
  </div>
  <p class="note">Deciso l'11 ottobre: restano Hanken Grotesk e DM Mono, costo zero. Provati diciotto caratteri sul sito finto (Söhne, GT Standard, Saans, Monument Grotesk e altri): a peso Medium sembrano quasi tutti uguali, la faccia dello studio la fanno logo, palazzo, colori, etichette e animazioni. Finalisti scartati per costo: Hanken con GT Standard Mono, GT Standard, Saans.</p>
  <div class="type">
    <div class="r"><span>Titolo · 72</span><div style="font:700 clamp(36px,5vw,72px)/.95 var(--f-body);letter-spacing:-.05em">The machine behind your business.</div></div>
    <div class="r"><span>Capitolo · 36</span><div style="font:700 clamp(24px,3vw,36px)/1.05 var(--f-body);letter-spacing:-.03em">Management systems, apps and ecommerce, built around you.</div></div>
    <div class="r"><span>Testo · 17</span><div style="font-size:17px;max-width:60ch">We design and build the software companies run on, and the brands they're known by. Inside and outside, one language.</div></div>
    <div class="r"><span>Numero · 80</span><div style="font:700 clamp(48px,6vw,80px)/.9 var(--f-body);letter-spacing:-.05em;font-variant-numeric:tabular-nums">+30% · 148 · 6 wks</div></div>
    <div class="r"><span>Piano · mono 46</span><div style="font:500 46px/1 var(--f-mono);letter-spacing:-.05em">05 · G · LG</div></div>
    <div class="r"><span>Piano · lettering</span><div class="ltr6"><svg class="lt" viewBox="-2 -780 1126 790" role="img" aria-label="05"><path d="M1121.7 -247.4 L1120.8 -229.7 L1118.5 -210.6 L1115.0 -191.7 L1110.2 -173.2 L1104.2 -155.1 L1097.0 -137.5 L1088.6 -120.6 L1079.1 -104.4 L1068.5 -89.0 L1057.0 -74.4 L1044.5 -60.9 L1031.1 -48.4 L1016.9 -37.0 L1002.0 -26.8 L987.8 -18.5 L971.7 -10.7 L956.6 -4.7 L939.7 0.5 L922.5 4.4 L905.0 6.9 L887.5 8.0 L869.9 7.6 L852.4 5.8 L835.1 2.7 L818.0 -1.9 L802.7 -7.3 L786.4 -14.5 L770.6 -22.9 L755.4 -32.6 L740.9 -43.5 L727.2 -55.6 L714.3 -68.7 L703.3 -81.6 L692.3 -96.6 L682.2 -112.4 L674.0 -127.6 L666.7 -143.3 L659.9 -161.1 L654.7 -177.8 L650.2 -196.2 L742.0 -196.2 L746.8 -180.8 L752.4 -166.7 L759.0 -153.3 L767.0 -139.7 L775.4 -127.9 L785.3 -116.3 L795.3 -106.5 L806.7 -97.2 L818.7 -89.2 L830.4 -83.0 L842.6 -78.1 L855.9 -74.3 L869.4 -72.0 L882.2 -71.2 L895.9 -71.9 L908.5 -73.9 L915.7 -75.6 L922.8 -77.8 L935.8 -83.0 L948.3 -89.7 L954.8 -93.8 L961.1 -98.3 L967.2 -103.2 L973.1 -108.5 L983.6 -119.3 L993.9 -132.0 L1002.5 -145.0 L1010.6 -159.9 L1017.1 -174.7 L1022.5 -190.2 L1026.9 -207.3 L1029.8 -223.7 L1031.5 -241.5 L1031.8 -258.3 L1030.7 -276.2 L1028.8 -290.5 L1025.7 -305.7 L1021.8 -319.5 L1016.7 -333.9 L1010.6 -347.7 L1004.1 -359.9 L996.3 -372.2 L987.6 -383.7 L978.1 -394.2 L968.7 -403.1 L958.0 -411.6 L947.5 -418.4 L935.8 -424.6 L924.5 -429.2 L912.1 -432.9 L900.4 -435.2 L888.6 -436.3 L877.6 -436.3 L865.8 -435.2 L855.0 -433.1 L844.3 -430.1 L833.0 -425.7 L822.0 -420.3 L811.4 -413.8 L802.0 -406.9 L792.3 -398.4 L783.2 -389.1 L774.8 -378.9 L767.0 -367.9 L760.5 -357.1 L754.2 -344.8 L748.9 -332.3 L644.4 -332.3 L644.4 -770.0 L1064.5 -770.0 L1064.5 -690.8 L734.4 -690.8 L734.4 -458.6 L748.1 -469.7 L762.9 -480.0 L778.4 -489.1 L793.1 -496.3 L808.2 -502.4 L825.1 -507.8 L840.8 -511.5 L858.2 -514.2 L874.3 -515.4 L891.9 -515.4 L908.0 -514.2 L925.4 -511.5 L942.5 -507.4 L958.0 -502.4 L973.1 -496.3 L989.1 -488.4 L1003.3 -480.0 L1018.1 -469.7 L1032.3 -458.2 L1045.6 -445.6 L1057.0 -433.2 L1068.5 -418.6 L1079.1 -403.2 L1087.8 -388.4 L1095.7 -372.9 L1103.1 -355.5 L1109.3 -337.4 L1113.9 -320.5 L1117.8 -301.7 L1120.2 -284.3 L1121.6 -265.0 L1121.7 -247.4ZM554.4 -377.8 L553.6 -356.1 L552.1 -334.5 L549.7 -313.1 L546.5 -291.8 L542.5 -270.9 L537.6 -250.3 L532.0 -230.2 L525.6 -210.5 L518.4 -191.3 L510.5 -172.7 L501.9 -154.8 L492.6 -137.6 L482.6 -121.1 L472.0 -105.4 L460.8 -90.6 L449.1 -76.7 L436.8 -63.7 L424.1 -51.7 L410.9 -40.7 L395.7 -29.7 L381.7 -21.0 L367.4 -13.4 L352.8 -6.9 L337.9 -1.5 L322.9 2.6 L307.8 5.6 L292.5 7.4 L277.2 8.0 L261.9 7.4 L246.6 5.6 L231.5 2.6 L216.5 -1.5 L201.6 -6.9 L187.0 -13.4 L172.7 -21.0 L158.7 -29.7 L145.0 -39.5 L131.8 -50.4 L119.0 -62.3 L106.7 -75.2 L94.9 -89.0 L83.6 -103.7 L73.0 -119.3 L62.9 -135.7 L53.5 -152.8 L44.8 -170.7 L36.9 -189.2 L28.8 -210.5 L22.4 -230.2 L16.8 -250.3 L11.9 -270.9 L7.9 -291.8 L4.7 -313.1 L2.3 -334.5 L0.8 -356.1 L0.0 -380.2 L0.3 -401.9 L1.3 -423.5 L3.3 -445.0 L6.0 -466.4 L9.6 -487.5 L14.0 -508.3 L19.2 -528.7 L25.2 -548.7 L30.4 -563.8 L36.0 -578.7 L42.1 -593.2 L48.6 -607.3 L55.6 -621.0 L62.9 -634.3 L70.7 -647.1 L78.8 -659.5 L87.3 -671.3 L96.1 -682.6 L104.0 -691.8 L113.4 -702.1 L123.2 -711.8 L133.2 -720.8 L143.5 -729.3 L154.1 -737.1 L164.9 -744.3 L175.9 -750.8 L187.0 -756.6 L198.4 -761.8 L208.2 -765.6 L219.8 -769.5 L231.5 -772.6 L243.3 -775.0 L255.1 -776.8 L267.0 -777.7 L278.9 -778.0 L290.8 -777.5 L302.7 -776.3 L314.5 -774.4 L326.3 -771.8 L337.9 -768.5 L349.5 -764.4 L359.3 -760.4 L370.6 -755.0 L381.7 -749.0 L392.6 -742.3 L403.3 -734.9 L413.8 -726.9 L424.1 -718.3 L434.0 -709.1 L443.7 -699.2 L453.1 -688.8 L462.1 -677.8 L470.8 -666.3 L479.1 -654.2 L487.1 -641.7 L494.7 -628.7 L501.9 -615.2 L508.6 -601.3 L515.0 -587.0 L520.9 -572.4 L526.3 -557.4 L531.3 -542.1 L535.8 -526.4 L539.9 -510.6 L543.4 -494.5 L546.5 -478.2 L549.1 -461.7 L551.1 -445.0 L552.7 -428.3 L553.8 -411.5 L554.3 -394.6 L554.4 -377.8ZM464.4 -390.8 L463.8 -410.0 L462.4 -431.0 L460.1 -451.9 L457.3 -470.5 L453.8 -488.9 L449.3 -508.6 L443.9 -527.8 L438.4 -544.7 L431.6 -562.5 L424.8 -578.1 L416.7 -594.3 L408.8 -608.2 L399.5 -622.6 L390.6 -634.7 L380.2 -647.0 L370.5 -657.1 L359.3 -667.0 L348.8 -674.9 L338.1 -681.7 L326.0 -687.9 L314.8 -692.4 L302.4 -695.9 L289.8 -698.1 L278.3 -698.8 L265.7 -698.2 L253.1 -696.2 L241.8 -693.1 L229.5 -688.4 L218.5 -683.0 L206.6 -675.6 L196.1 -667.8 L184.9 -658.0 L174.2 -647.0 L164.8 -635.9 L155.8 -623.9 L146.5 -609.6 L137.7 -594.3 L130.3 -579.6 L122.8 -562.5 L116.6 -546.3 L111.0 -529.5 L105.6 -510.4 L101.3 -492.5 L97.4 -472.4 L94.5 -453.8 L92.2 -432.9 L90.7 -411.9 L90.1 -392.7 L90.1 -373.4 L91.0 -352.3 L92.8 -331.4 L95.1 -312.5 L98.4 -292.1 L102.1 -273.9 L107.0 -254.3 L112.1 -237.1 L117.8 -220.4 L124.8 -202.7 L131.8 -187.4 L140.0 -171.4 L148.1 -157.7 L157.6 -143.7 L167.5 -130.7 L177.0 -119.9 L187.9 -109.2 L199.2 -99.7 L210.9 -91.5 L222.9 -84.7 L235.1 -79.3 L247.5 -75.2 L260.0 -72.5 L272.6 -71.3 L285.2 -71.5 L297.8 -73.1 L310.3 -76.2 L322.7 -80.6 L334.8 -86.4 L345.6 -92.9 L357.2 -101.3 L368.5 -111.0 L379.3 -122.0 L389.6 -134.1 L399.5 -147.4 L408.8 -161.8 L417.4 -177.1 L425.5 -193.5 L432.9 -210.7 L439.5 -228.7 L445.4 -247.4 L450.6 -266.7 L455.0 -286.6 L458.5 -306.9 L461.2 -327.6 L463.1 -348.5 L464.2 -369.6 L464.4 -390.8Z"/></svg><svg class="lt" viewBox="-2 -780 666 790" role="img" aria-label="G"><path d="M347.7 -385.0 L662.2 -385.0 L661.9 -368.1 L661.0 -351.3 L659.5 -334.5 L657.3 -317.8 L654.6 -301.2 L650.7 -282.5 L646.1 -264.0 L640.7 -245.8 L634.6 -227.9 L627.8 -210.5 L620.2 -193.4 L613.0 -178.8 L605.3 -164.7 L595.8 -149.0 L585.8 -133.8 L575.1 -119.3 L565.2 -107.1 L553.5 -93.8 L541.1 -81.2 L528.3 -69.3 L515.0 -58.2 L501.3 -47.9 L487.2 -38.4 L474.5 -30.8 L461.6 -23.8 L446.5 -16.6 L431.1 -10.4 L415.5 -5.0 L401.7 -1.0 L385.7 2.6 L369.6 5.3 L353.4 7.1 L337.2 7.9 L320.9 7.8 L306.7 6.9 L290.6 5.0 L276.5 2.6 L260.5 -1.0 L244.8 -5.6 L231.1 -10.4 L215.7 -16.6 L202.5 -22.8 L189.5 -29.7 L176.8 -37.3 L164.4 -45.5 L152.2 -54.3 L140.4 -63.7 L127.4 -75.2 L114.8 -87.4 L104.3 -98.7 L94.1 -110.5 L83.1 -124.7 L73.9 -137.6 L65.2 -150.9 L55.8 -166.7 L48.2 -180.9 L40.1 -197.6 L33.5 -212.6 L26.8 -230.2 L21.5 -245.8 L16.1 -264.0 L12.0 -280.2 L8.5 -296.5 L5.6 -313.1 L3.0 -332.1 L1.4 -348.9 L0.3 -368.1 L0.0 -385.0 L0.3 -401.9 L1.4 -421.1 L3.0 -437.9 L5.6 -456.9 L9.0 -475.8 L12.5 -492.1 L16.7 -508.3 L21.5 -524.2 L27.6 -542.1 L33.5 -557.4 L41.0 -574.5 L48.2 -589.1 L55.8 -603.3 L64.0 -617.2 L73.9 -632.4 L83.1 -645.3 L94.1 -659.5 L104.3 -671.3 L114.8 -682.6 L127.4 -694.8 L140.4 -706.3 L152.2 -715.7 L164.4 -724.5 L176.8 -732.7 L191.4 -741.3 L204.4 -748.1 L217.6 -754.2 L231.1 -759.6 L246.7 -765.0 L260.5 -769.0 L276.5 -772.6 L290.6 -775.0 L302.7 -776.6 L314.9 -777.5 L325.0 -777.9 L337.2 -777.9 L349.4 -777.4 L361.5 -776.3 L373.6 -774.7 L385.7 -772.6 L397.7 -770.0 L409.6 -766.8 L421.4 -763.1 L431.1 -759.6 L442.6 -755.0 L454.0 -749.9 L465.3 -744.3 L476.3 -738.2 L487.2 -731.6 L497.8 -724.5 L508.2 -717.0 L516.7 -710.4 L526.7 -702.1 L536.4 -693.3 L545.8 -684.2 L555.0 -674.6 L563.8 -664.6 L572.3 -654.2 L580.5 -643.5 L588.3 -632.4 L595.8 -621.0 L603.0 -609.3 L609.7 -597.3 L616.0 -585.2 L516.8 -585.2 L507.7 -598.6 L498.4 -610.9 L488.6 -622.6 L478.3 -633.6 L467.5 -643.8 L456.3 -653.2 L444.8 -661.7 L432.8 -669.5 L419.2 -677.1 L406.7 -683.0 L394.0 -687.9 L381.0 -692.0 L367.9 -695.1 L354.7 -697.3 L341.5 -698.5 L328.1 -698.8 L314.8 -698.1 L301.6 -696.4 L288.4 -693.8 L275.4 -690.3 L262.5 -685.8 L249.9 -680.5 L237.5 -674.2 L224.0 -666.2 L212.3 -658.0 L200.9 -649.1 L188.7 -638.2 L178.1 -627.6 L168.1 -616.2 L158.5 -604.2 L149.5 -591.4 L141.0 -578.1 L131.5 -560.9 L122.8 -543.0 L115.1 -524.4 L108.4 -505.1 L103.1 -487.1 L98.3 -466.8 L94.6 -446.2 L92.0 -425.3 L90.5 -406.2 L90.0 -385.0 L90.5 -363.8 L92.2 -342.8 L94.9 -321.9 L98.7 -301.3 L103.6 -281.1 L109.5 -261.4 L116.4 -242.2 L124.3 -223.7 L133.1 -205.9 L142.9 -188.9 L153.5 -172.8 L164.9 -157.7 L175.9 -144.9 L188.7 -131.8 L202.1 -119.9 L216.1 -109.2 L230.7 -99.7 L245.7 -91.5 L261.1 -84.7 L275.4 -79.7 L291.3 -75.5 L307.5 -72.7 L319.3 -71.6 L329.6 -71.2 L340.0 -71.4 L350.3 -72.2 L362.1 -73.8 L372.3 -75.8 L382.5 -78.4 L392.5 -81.6 L402.5 -85.3 L412.3 -89.5 L423.4 -95.1 L432.8 -100.5 L442.1 -106.5 L451.2 -112.9 L460.1 -119.9 L468.7 -127.3 L478.3 -136.4 L486.3 -144.9 L494.1 -153.8 L501.6 -163.1 L508.7 -172.8 L515.6 -183.0 L523.0 -195.0 L529.1 -205.9 L534.8 -217.1 L540.1 -228.7 L545.8 -242.2 L550.3 -254.3 L554.4 -266.7 L558.1 -279.3 L561.4 -292.1 L564.4 -305.8 L347.7 -305.8 L347.7 -385.0Z"/></svg><svg class="lt" viewBox="-2 -780 1116 790" role="img" aria-label="LG"><path d="M0.0 -0.0 L0.0 -770.0 L90.0 -770.0 L90.0 -79.2 L400.4 -79.2 L400.4 -0.0 L0.0 -0.0ZM797.6 -385.0 L1112.1 -385.0 L1111.9 -370.5 L1111.0 -353.7 L1109.6 -336.9 L1107.9 -322.6 L1105.7 -308.3 L1103.1 -294.2 L1100.1 -280.2 L1096.0 -264.0 L1091.4 -248.1 L1086.9 -234.6 L1082.0 -221.3 L1075.8 -206.2 L1070.1 -193.4 L1062.9 -178.8 L1056.3 -166.7 L1048.1 -152.8 L1035.7 -133.8 L1023.6 -117.5 L1010.8 -102.0 L995.7 -85.8 L979.9 -70.8 L963.3 -56.9 L946.0 -44.3 L929.9 -34.0 L911.5 -23.8 L894.5 -15.8 L877.1 -8.9 L857.5 -2.6 L839.6 1.8 L819.5 5.3 L799.3 7.4 L781.0 8.0 L764.8 7.5 L748.5 6.1 L732.4 3.7 L716.4 0.4 L700.5 -3.8 L684.9 -8.9 L669.5 -15.0 L654.3 -21.9 L639.4 -29.7 L624.9 -38.4 L610.8 -47.9 L597.1 -58.2 L583.8 -69.3 L571.0 -81.2 L558.6 -93.8 L546.9 -107.1 L535.7 -121.1 L525.1 -135.7 L515.1 -150.9 L505.7 -166.7 L497.0 -183.0 L489.0 -199.7 L481.7 -217.0 L475.1 -234.6 L469.3 -252.6 L464.2 -270.9 L459.8 -289.5 L456.3 -308.3 L453.5 -327.3 L451.5 -346.5 L450.3 -365.7 L449.9 -385.0 L450.3 -404.3 L451.5 -423.5 L453.5 -442.7 L456.3 -461.7 L459.8 -480.5 L464.2 -499.1 L469.3 -517.4 L475.1 -535.4 L481.7 -553.0 L489.0 -570.3 L497.0 -587.0 L505.7 -603.3 L515.1 -619.1 L525.1 -634.3 L535.7 -648.9 L546.9 -662.9 L558.6 -676.2 L571.0 -688.8 L583.8 -700.7 L597.1 -711.8 L610.8 -722.1 L624.9 -731.6 L639.4 -740.3 L654.3 -748.1 L669.5 -755.0 L684.9 -761.1 L700.5 -766.2 L716.4 -770.4 L732.4 -773.7 L748.5 -776.1 L764.8 -777.5 L781.0 -778.0 L793.2 -777.7 L803.3 -777.1 L823.5 -774.7 L843.6 -770.9 L855.5 -767.9 L865.4 -765.0 L884.9 -758.2 L896.4 -753.4 L905.8 -749.0 L924.4 -739.2 L933.5 -733.8 L944.2 -726.9 L953.0 -720.8 L963.3 -713.1 L979.9 -699.2 L995.7 -684.2 L1004.9 -674.6 L1012.2 -666.3 L1020.8 -656.0 L1027.7 -647.1 L1040.8 -628.7 L1054.0 -607.3 L1065.9 -585.2 L966.7 -585.2 L959.6 -595.7 L951.5 -606.9 L942.9 -617.5 L934.0 -627.6 L925.8 -635.9 L916.2 -644.8 L906.2 -653.2 L896.0 -660.8 L885.4 -667.8 L874.6 -674.2 L865.0 -679.1 L853.8 -684.1 L842.4 -688.4 L830.9 -692.0 L820.8 -694.5 L809.0 -696.7 L798.7 -697.9 L788.4 -698.7 L778.0 -698.8 L767.7 -698.3 L757.4 -697.3 L747.1 -695.7 L736.9 -693.5 L726.7 -690.7 L716.7 -687.4 L706.8 -683.6 L697.0 -679.1 L687.4 -674.2 L677.9 -668.7 L668.7 -662.6 L659.6 -656.1 L650.8 -649.1 L639.8 -639.3 L630.3 -630.0 L620.2 -618.8 L611.6 -608.2 L602.4 -595.7 L594.6 -584.1 L586.5 -570.4 L579.7 -557.7 L573.4 -544.7 L567.0 -529.5 L561.2 -513.9 L556.6 -499.7 L552.1 -483.4 L548.6 -468.7 L545.4 -451.9 L543.2 -436.7 L541.5 -421.5 L540.4 -404.2 L539.9 -386.9 L540.1 -371.5 L540.9 -356.2 L542.5 -339.0 L544.8 -321.9 L547.9 -305.0 L551.2 -290.2 L555.5 -273.9 L560.6 -257.8 L565.6 -243.9 L572.0 -228.7 L578.1 -215.5 L584.7 -202.7 L592.8 -188.9 L598.4 -180.0 L605.4 -170.0 L611.6 -161.8 L619.1 -152.5 L632.7 -137.6 L641.0 -129.6 L648.3 -123.0 L663.5 -111.0 L671.3 -105.6 L680.6 -99.7 L688.7 -95.1 L697.0 -90.9 L705.4 -87.0 L715.3 -83.1 L723.9 -80.1 L732.5 -77.6 L741.2 -75.5 L751.5 -73.6 L760.3 -72.4 L769.2 -71.6 L779.5 -71.2 L788.4 -71.3 L797.3 -71.9 L807.6 -73.1 L816.4 -74.6 L825.1 -76.5 L833.8 -78.8 L843.9 -82.1 L852.4 -85.3 L860.8 -88.9 L874.6 -95.8 L888.1 -103.8 L901.1 -112.9 L913.7 -123.0 L925.8 -134.1 L937.4 -146.1 L948.3 -159.1 L958.6 -172.8 L968.3 -187.4 L977.3 -202.7 L985.5 -218.7 L992.9 -235.4 L999.6 -252.6 L1005.4 -270.3 L1010.4 -288.4 L1014.3 -305.8 L797.6 -305.8 L797.6 -385.0Z"/></svg></div></div>
    <div class="r"><span>Etichetta · mono 11</span><div class="lab" style="color:var(--ink)">03 · Proof · No. 014 · Running</div></div>
  </div>
  <div class="rl">
      <div><span>Titolo</span><b>Hanken 700 · da 54 a 136 px</b><p>Interlinea 0,9, spaziatura -0,055 em, al massimo dieci parole. È l'unico punto dove si spinge.</p></div>
      <div><span>Sezione</span><b>Hanken 700 · da 40 a 80 px</b><p>Interlinea 0,93, spaziatura -0,047 em. Sotto, la soglia: numero del locale in mono e una riga.</p></div>
      <div><span>Testo</span><b>17 px, attacco da 19 a 25 px</b><p>Testo con interlinea 1,55 e righe da 60 caratteri. L'attacco sotto il titolo a 1,34, spaziatura -0,012 em.</p></div>
      <div><span>Macchina</span><b>DM Mono 12 px, maiuscolo</b><p>Spaziatura +0,08 em per etichette e codici. I numeri dei piani grandi nelle aperture sono in lettering.</p></div>
  </div>
  <div class="motion">
    <div><div class="trk"><i data-e="carro"></i></div><b>Carroponte</b><code>cubic-bezier(.65,0,.35,1) · 600-1200 ms</code><p class="note">Lento e pesante: il marchio, le luci che cambiano.</p></div>
    <div><div class="trk"><i data-e="corsa"></i></div><b>Corsa</b><code>cubic-bezier(.7,0,.2,1) · 450-900 ms</code><p class="note">Parte decisa e si ferma morbida: cambio piano, pannelli, bottoni.</p></div>
    <div><div class="trk"><i data-e="scatto"></i></div><b>Scatto</b><code>cubic-bezier(.2,.8,.2,1) · 200-300 ms</code><p class="note">Piccolo e preciso: segnali, filtri, conferme.</p></div>
  </div>
</div></section>

<!-- ============ 05 POSTERS ============ -->
<section class="fl" data-luce="carta" data-f="05" data-n="Poster" id="f05"><div class="in">
  <header class="flh"><span class="n">05</span><div><span class="k">Floor 05</span><h2>Poster</h2><p>Opere da stampa con il colore fisso. Ogni poster segue la regola del colore: rosa per le copertine e l'incontro, carta per il messaggio, nero per la prova, grigio per il metodo.</p></div></header>
  <div class="posters p3c">
    <div class="pst"><div class="pf p1 pk"><div data-a="p1"></div><div class="foot"><span>Mother Machine</span><span>Brand and software</span></div></div><p><b>Makes machines.</b> La frase dello studio scritta dal marchio. I piani salgono uno alla volta e la torre si richiude in una m sola. È la copertina.</p></div>
    <div class="pst"><div class="pf p2 ct"><div data-a="p2"></div><div class="foot"><span>Mother Machine</span><span>Systems that pay for themselves</span></div></div><p><b>More margin.</b> La torre si costruisce piano per piano: ogni piano scende, si ferma, e la parola compare. Il messaggio che vendiamo.</p></div>
    <div class="pst"><div class="pf p3 nt"><div data-a="icon3"></div><div><h3>It runs while you sleep.</h3><p class="cnt" style="margin-top:14px"><b id="clk">03:12</b> · <span id="ord">148</span> orders processed<br>0 people awake</p></div><div class="foot"><span>Mother Machine</span><span>Automation</span></div></div><p><b>Night shift.</b> Il piano si muove da solo, come un ascensore di notte, e il contatore va avanti. Per l'automazione.</p></div>
    <div class="pst"><div class="pf p4 gr4"><h3>Signed, numbered, built to run.</h3><div class="plate"><i class="rv" style="left:7px;top:7px"></i><i class="rv" style="right:7px;top:7px"></i><i class="rv" style="left:7px;bottom:7px"></i><i class="rv" style="right:7px;bottom:7px"></i><div class="hd"><div data-a="line"></div><span class="lab" style="color:inherit;opacity:.55">No. <span id="ser">001</span></span></div><dl><dt>Type</dt><dd>Back office</dd><dt>Built for</dt><dd>Client</dd><dt>Year</dt><dd>2026</dd><dt>Hours saved / month</dt><dd id="hrs">0</dd></dl></div><div class="stamp" data-a="iconS" id="stamp"></div></div><p><b>Nameplate.</b> La targhetta diventa poster: il numero di serie conta fino al nuovo lavoro e il simbolo si timbra. Un poster per ogni consegna.</p></div>
    <div class="pst"><div class="pf gf"><span class="g">G</span><div><h3>Ground floor. Tell us what slows you down.</h3></div><div class="foot"><span>Mother Machine</span><span>Start a work order</span></div></div><p><b>Ground floor.</b> Il rosa porta sempre all'incontro: inviti, biglietti, l'ultima slide.</p></div>
    <div class="prules"><b>Regole dei poster</b><ul><li>Un messaggio per poster, in inglese.</li><li>Il marchio sempre in un colore, quello del testo.</li><li>Colore di fondo secondo il tipo di piano.</li><li>Le parole del marchio solo con le lettere che esistono (mancano tra le altre b, f, v, w, y).</li><li>Numeri e nomi nei poster sono esempi finché non abbiamo i progetti veri.</li></ul></div>
  </div>
</div></section>

<!-- ============ 04 WORDS ============ -->
<section class="fl" data-luce="carta" data-f="04" data-n="Parole" id="f04"><div class="in">
  <header class="flh"><span class="n">04</span><div><span class="k">Floor 04</span><h2>Cosa facciamo, e come lo diciamo</h2><p>Inglese internazionale: frasi corte, parole semplici, niente gergo da agenzia. Due pratiche, non dieci servizi.</p></div></header>
  <div class="house">
    <div class="roof"><b>One studio. The inside and the outside of your business.</b><span class="lab">Mother Machine</span></div>
    <div><span class="k">Inside · custom software</span><h4>Systems</h4><p>Custom software that runs the company. Built around how you actually work, not the other way round.</p>
      <ul><li>Product design, UI and UX<span>core</span></li><li>Management systems and back offices<span>core</span></li><li>Apps and web apps<span>core</span></li><li>Ecommerce<span>core</span></li><li>Automations and integrations<span>core</span></li></ul></div>
    <div><span class="k">Outside · the face</span><h4>Brand</h4><p>Identity, website and art direction, so the company looks as good as it runs. Same team, same standards.</p>
      <ul><li>Brand identity<span></span></li><li>Websites<span></span></li><li>Art direction<span></span></li><li>Visual design<span></span></li></ul></div>
  </div>
  <div class="deck filo">
    <div class="r"><span>Posizionamento</span><div><div class="h2">A design and engineering studio for companies that want to grow.</div><div class="s">Ci mette nella categoria giusta: design e ingegneria insieme, non "agenzia digitale".</div></div></div>
    <div class="r"><span>Apertura <i class="rec">Approvata</i></span><div><div class="h">The machine behind your business.</div><div class="s">We design and build the software companies run on, and the brands they're known by.</div>
      <div class="alt"><div>Software that runs your company. A brand that sells it.</div><div>Built to run. Designed to grow.</div><div>Less software. More business.</div><div>We build the software your business runs on.</div></div></div></div>
    <div class="r"><span>La prova</span><div><div class="h2">Results, not deliverables.</div><div class="s">We measure our work in revenue earned, hours saved and errors removed. Every project ends with a number.</div></div></div>
    <div class="r"><span>Come lavoriamo</span><div><div class="h2">Three floors. Fixed timelines.</div>
      <div class="steps3"><div><span>01</span><b>Survey</b><p>We map how your business really works, before we design anything.</p></div><div><span>02</span><b>Build</b><p>We design and ship in short, fixed cycles. You see it working early.</p></div><div><span>03</span><b>Run</b><p>We stay on: maintenance, improvements, new floors when you grow.</p></div></div></div></div>
    <div class="r"><span>Piano terra</span><div><div class="h2">Ground floor. Tell us what slows you down.</div><div class="s">Start a work order. We reply within two working days.</div></div></div>
    <div class="r"><span>Il primo passo</span><div><div class="h2">Start with a conversation. It's free.</div><div class="s">Il primo incontro è gratuito: ascoltiamo cosa vi rallenta. Survey è la prima fase del progetto, dentro il preventivo, non un prodotto a sé.</div></div></div>
    <div class="r"><span>Machine Room</span><div><div class="h2">Every system we build comes with its own Machine Room.</div><div class="s">La frase per vendere il backoffice ai clienti.</div></div></div>
    <div class="r"><span>AI <i class="rec">Approvata</i></span><div><div class="h2">We don't plug AI in. We build it in.</div><div class="s" style="font-weight:600;opacity:1">Private AI that runs on your own machines. Your data never leaves the building.</div><div class="s">Due regole. L'AI nel come lavoriamo non si dice mai: la faccia dello studio resta art direction, prodotto e software. L'AI in quello che costruiamo per i clienti si dice chiaro: la mettiamo dentro il loro gestionale e le funzioni AI le scriviamo noi, codice fatto bene e testato, anche AI privata che gira sui loro computer, non solo servizi online. Dove: un locale "AI inside" nella pagina Systems, la didascalia di Custom software ("AI included."), le parole per Google (AI integration, AI automation, custom AI software). Visibile, ma mai il titolo dello studio.</div>
      <div class="alt"><div>AI inside.</div><div>We build AI into the systems that run your company.</div><div>Not plugged in. Built in.</div><div>Private AI that runs on your own machines. Your data never leaves the building.</div><div>Software that sees, listens and decides.</div></div></div></div>
    <div class="r"><span>Titolo per Google</span><div><div class="h2">Mother Machine, software and brand studio</div><div class="s">Nel titolo della pagina e nelle anteprime dei link: dice "software" dove la gente lo cerca, senza cambiare il posizionamento.</div></div></div>
    <div class="r"><span>Microcopy</span><div><table class="micro">
      <tr><td>Menu</td><td>Work · Systems · Brand · Studio · Contact</td></tr>
      <tr><td>Bottone principale</td><td>Start a work order</td></tr>
      <tr><td>Registro lavori</td><td>No. · Client · What we built · Result</td></tr>
      <tr><td>Stati del lavoro</td><td>In build · Running · Delivered</td></tr>
      <tr><td>Segnali</td><td>Moving between floors · Searching · Sending work order · Saving · Wrong floor · Waiting for you</td></tr>
      <tr><td>Modulo inviato</td><td>Work order received. No. 015. We'll reply within two working days.</td></tr>
      <tr><td>Pagina 404</td><td>Wrong floor. This one doesn't exist. Back to the ground floor.</td></tr>
      <tr><td>Machine Room</td><td>LG · Lower ground · Authorised staff only · Turn your key</td></tr>
      <tr><td>Firma nei sistemi</td><td>Built by Mother Machine · No. 014</td></tr>
    </table></div></div>
    <div class="r"><span>Parole che non usiamo</span><div class="no"><span>digital agency</span><span>full service</span><span>solutions</span><span>innovation</span><span>experiences</span><span>synergy</span><span>cutting-edge</span><span>marketing</span><span>AI-first</span><span>AI-powered</span><span>AI agency</span><span>AI specialists</span><span>AI experts</span><span>AI transformation</span><span>generated</span></div></div>
    <div class="r"><span>Le cose fisse</span><div><table class="micro">
      <tr><td>Numeri</td><td>Sempre veri. Dove mancano: progetti interni, concept, stime dichiarate come tali.</td></tr>
      <tr><td>Persone</td><td>Niente persone, foto o ruoli inventati. Il sito parla al plurale, come uno studio.</td></tr>
      <tr><td>Servizi</td><td>Mai social media, campagne, pubblicità o strategia marketing.</td></tr>
      <tr><td>Prezzi</td><td>Mai sul sito. Come le grandi agenzie: il prezzo arriva con la proposta.</td></tr>
      <tr><td>Abbonamenti</td><td>Diciamo "fatto su misura per voi". Non è una legge: non promettiamo "mai abbonamenti" e non promettiamo la cessione del codice. Siamo una software house: un giorno potremmo avere prodotti nostri.</td></tr>
      <tr><td>Proprietà (interna)</td><td>Non si scrive sul sito. Di base tecnologie e codice restano di Mother Machine; il cliente ha la licenza d'uso, il suo marchio e i suoi dati, che non riusiamo mai. Possiamo rifare faccia e marchio a un sistema e venderlo ad altri. Con clienti molto grandi si può firmare esclusiva o cessione, a un prezzo diverso. Sempre scritto nel contratto, sempre con etica.</td></tr>
      <tr><td>Cosa non mostriamo</td><td>Pagine lunghe su logo, design system e processo. La lista di servizi da sitarello. Il "premium" generico.</td></tr>
      <tr><td>Scrittura</td><td>Mai il trattino lungo, in nessun testo.</td></tr>
    </table></div></div>
  </div>
</div></section>

<!-- ============ 03 FLOORS ============ -->
<section class="fl" data-luce="macchina" data-f="03" data-n="Piani" id="f03"><div class="in">
  <header class="flh"><span class="n">03</span><div><span class="k">Floor 03</span><h2>Piani, locali, corsa</h2><p>Il palazzo è al piano 11: ogni pagina è un piano. Qui ci sono i pezzi che lo fanno funzionare. Dentro una pagina si scende per locali (05.1, 05.2) fino alla porta per G. Tra una pagina e l'altra si viaggia con la pulsantiera e la corsa. Questo manuale funziona allo stesso modo.</p></div></header>
  <div class="rl">
    <div><span>Menu</span><b>Una pulsantiera sola</b><p>Identica ovunque. Si apre sopra la pagina, che si oscura appena; scegli un piano e si chiude subito. La corsa va a tutto schermo, con le porte al centro. Sul telefono è un pannello a tutta altezza.</p></div>
    <div><span>Header</span><b>Il logo vero, le frecce</b><p>Il logo intero è appeso sotto la barra in cima alla pagina e si ripiega nella barra quando scorri. A destra il piano: le frecce portano su o giù di un piano senza aprire niente.</p></div>
    <div><span>Quadratini</span><b>Sono i locali, non i piani</b><p>Nel sito i quadratini a lato indicano i punti della pagina (05.1, 05.2), da 3 a 8, solo sulle pagine lunghe. I piani si cambiano solo con la pulsantiera.</p></div>
    <div><span>Corsa</span><b>Un passaggio, mai un cancello</b><p>Un piano dura circa un secondo, ogni piano in più un po' di più, mai oltre due. Ogni pagina ha il suo indirizzo: da un link o da Google si entra diretti.</p></div>
  </div>
  <div class="sub"><h3>Dentro una pagina: i locali <small>la home, scorri dentro il riquadro</small></h3>
    <div class="bldw" data-luce="carta">
      <div class="bld" id="bld">
        <div class="hdr" id="hdr" data-luce="carta"><div data-a="line"></div><div class="disp2"><div class="ar"><i class="u" id="aU"></i><i class="d" id="aD"></i></div><div class="nw" id="nw"><b>05.1</b></div><span class="nm" id="nm">Opening</span></div></div>
        <section data-luce="carta" data-f="05.1" data-n="Opening"><div class="sill"><span class="n">05.1</span><span class="t">Home · Opening</span></div><h5>The machine behind your business.</h5><p class="s">We design and build the software companies run on, and the brands they're known by.</p></section>
        <section data-luce="carta" data-f="05.2" data-n="Proof"><div class="sill"><span class="n">05.2</span><span class="t">Proof</span></div><h5>Results, not deliverables.</h5><div class="win" data-luce="notte"><span class="lab">Window on 04 · Work</span><div class="big">3×</div><p class="s">Example figure. Every project ends with a real number.</p></div></section>
        <section data-luce="carta" data-f="05.3" data-n="What we build"><div class="sill"><span class="n">05.3</span><span class="t">What we build</span></div><h5>One studio. The inside and the outside.</h5><div class="two"><div><b>Systems</b><span>Custom software, UI and UX, apps, ecommerce, automations</span></div><div><b>Brand</b><span>Identity, websites, art direction, visual design</span></div></div></section>
        <section data-luce="carta" data-f="05.4" data-n="How we work"><div class="sill"><span class="n">05.4</span><span class="t">How we work</span></div><h5>Three floors. Fixed timelines.</h5><div class="st3"><div><span>01</span>Survey</div><div><span>02</span>Build</div><div><span>03</span>Run</div></div></section>
        <section data-luce="rosa2" data-f="G" data-n="The door to G"><div class="sill"><span class="n">G</span><span class="t">The door to the ground floor</span></div><h5>Tell us what slows you down.</h5><span class="cta">Start a work order <svg viewBox="0 0 24 24"><path d="/*I:forward*/"/></svg></span></section>
      </div>
      <div class="pnl" id="pnl"></div>
    </div>
    <div class="three">
      <div><span class="k">1 · Il display</span><b>Dove sei.</b><p>Nella barra: la freccia si accende mentre scorri, il numero corre al piano nuovo, il nome cambia. Toccandolo si apre la pulsantiera.</p></div>
      <div><span class="k">2 · La pulsantiera</span><b>Dove puoi andare.</b><p>Chiusa è una fila di quadrati a destra, aperta è il pannello dell'ascensore. Pieno dove sei, vuoto dove non sei.</p></div>
      <div><span class="k">3 · La soglia</span><b>Dove sei arrivato.</b><p>Ogni piano si apre con il suo numero in mono, il nome piccolo e una riga. Chi arriva a metà pagina capisce subito.</p></div>
    </div>
  </div>
  <div class="sub"><h3>La pulsantiera e la corsa <small>premi un piano</small></h3>
    <p class="lead">La pulsantiera è un componente solo, in tre usi: il menu del sito, la navigazione di questo manuale, l'accesso alla Machine Room. Bottoni quadrati, come i segnali. Quando premi, il bottone si accende e lampeggia finché non arrivi. La corsa è il cambio piano: le porte si chiudono, il display conta i piani, la cabina si assesta, le porte si aprono già con la luce nuova.</p>
    <div class="ldemo"><div class="lift" id="lift03"></div><div class="shaft" id="shaft03" style="aspect-ratio:auto;min-height:420px"><div class="pg"></div><div class="door l"></div><div class="door r"></div><i class="mark"></i><div class="disp"><div class="ar"><i class="u"></i><i class="d"></i></div><div class="roll"><b>05</b></div><span class="nm">Home</span></div></div></div>
    <div class="rule2">
      <div><span class="k">Pagine</span><b>Ogni pagina è un piano.</b><p>Home, Work, Systems, Brand, Studio, Contact: i bottoni della pulsantiera, dall'alto in basso. Un menu solo.</p></div>
      <div><span class="k">Sezioni</span><b>Ogni sezione è un locale.</b><p>Dentro la pagina si scorre: 05.1, 05.2. Il display mostra il locale, la pulsantiera resta sui piani.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Piani, locali, nomi</h3>
    <div class="grid2">
      <div class="card"><div class="demo" style="place-items:stretch;align-content:center"><div class="map" style="background:transparent"><table><thead><tr><th>Piano</th><th>Pagina</th><th>Luce</th></tr></thead><tbody>
        <tr><td>05</td><td>Home</td><td><i class="sw" style="background:#F4F2EC"></i>Carta</td></tr>
        <tr><td>04</td><td>Work</td><td><i class="sw" style="background:#0F0F0E"></i>Notte</td></tr>
        <tr><td>03</td><td>Systems</td><td><i class="sw" style="background:#BEC2BF"></i>Grigio</td></tr>
        <tr><td>02</td><td>Brand</td><td><i class="sw" style="background:#F4F2EC"></i>Carta</td></tr>
        <tr><td>01</td><td>Studio</td><td><i class="sw" style="background:#EEC3B1"></i>Rosa</td></tr>
        <tr><td>G</td><td>Contact</td><td><i class="sw" style="background:#EEC3B1"></i>Rosa</td></tr>
        <tr><td>LG</td><td>Machine Room · key only</td><td><i class="sw" style="background:#0F0F0E"></i>Notte</td></tr>
      </tbody></table></div></div>
        <div class="txt"><b>Il sito, piano per piano</b><p>Il colore segue il tipo di pagina. LG non è nel pannello: si raggiunge solo con la chiave.</p></div></div>
      <div class="card"><div class="demo" style="place-items:stretch;align-content:center"><div class="secs"><div class="s"><span>03</span><b>Systems</b><em>#03</em></div><div class="s"><span>03.1</span><b>Management systems</b><em>#03.1</em></div><div class="s"><span>03.2</span><b>Apps and web apps</b><em>#03.2</em></div><div class="s"><span>03.3</span><b>Product design, UI and UX</b><em>#03.3</em></div></div></div>
        <div class="txt"><b>I locali del piano</b><p>Le sezioni di una pagina sono i locali: 03.1, 03.2. Il numero è anche l'ancora del link. I locali hanno la luce del loro piano; nero e rosa entrano solo come finestre.</p></div></div>
      <div class="card"><div class="demo"><div class="case" style="max-width:420px"><div><span>Prima</span><b>P00 · P01 · P02 · N°</b><em>Italiano</em></div><div class="dk"><span>Ora</span><b>G · 01 · 02 · No.</b><em>Inglese</em></div></div></div>
        <div class="txt"><b>I piani in inglese</b><p>Negli ascensori internazionali il piano terra è G e gli altri sono solo numeri. La targhetta dice "No. 014".</p></div></div>
      <div class="card"><div class="demo" style="place-items:stretch;align-content:center"><div class="ground"><div class="top"><span>G · Ground floor</span><span>End of the line</span></div><h4>You've seen every floor. Now we start.</h4><div class="row"><a class="lnk" style="color:inherit;background-image:linear-gradient(currentColor,currentColor)" href="#f01">Start a work order</a><div data-a="iconS"></div></div></div></div>
        <div class="txt"><b>La porta per G</b><p>Il piè di pagina di ogni piano non è una lista di link: è la porta per il piano terra. Una frase, un'azione, il simbolo.</p></div></div>
    </div>
  </div>
</div></section>

<!-- ============ 02 SIGNALS ============ -->
<section class="fl" data-luce="notte" data-f="02" data-n="Segnali" id="f02"><div class="in">
  <header class="flh"><span class="n">02</span><div><span class="k">Floor 02</span><h2>Segnali e stati: quadrati che dicono cosa succede</h2><p>Il quadrato è lo stesso della pulsantiera e degli stati. Come si muove dice cosa sta facendo il sito. Prende il colore del testo, quindi funziona in ogni luce.</p></div></header>
  <div class="sub">
    <div class="luceb" id="sigL"><button data-l="carta"><i style="background:#F4F2EC"></i>Carta</button><button data-l="macchina"><i style="background:#BEC2BF"></i>Grigio</button><button data-l="notte" class="on"><i style="background:#0F0F0E"></i>Notte</button><button data-l="rosa2"><i style="background:#EEC3B1"></i>Rosa</button></div>
    <div class="sigs" id="sigs" data-luce="notte">
      <div><div class="stage"><div class="sig v3 s-move"><i></i><i></i><i></i><b></b></div></div><div class="tx"><b>Moving</b><code>Moving between floors</code><p>Su e giù in verticale: si cambia pagina o si carica.</p></div></div>
      <div><div class="stage"><div class="sig h5 s-search"><i></i><i></i><i></i><i></i><i></i><b></b></div></div><div class="tx"><b>Searching</b><code>Searching</code><p>Scorre a scatti in orizzontale: cerca, filtra, legge.</p></div></div>
      <div><div class="stage"><div class="sig h6 s-open"><i></i><i></i><i></i><i></i><i></i><i></i><b class="q1"></b><b class="q2"></b></div></div><div class="tx"><b>Opening</b><code>Opening</code><p>Due quadrati si separano dal centro: le porte. Menu, pannelli, progetti.</p></div></div>
      <div><div class="stage"><div class="sig h6 s-close"><i></i><i></i><i></i><i></i><i></i><i></i><b class="q1"></b><b class="q2"></b></div></div><div class="tx"><b>Closing</b><code>Closing</code><p>Si richiudono al centro. Si chiude un pannello, si esce.</p></div></div>
      <div><div class="stage"><div class="sig v3 s-send"><i></i><i></i><i></i><b class="q1"></b><b class="q2"></b><b class="q3"></b></div></div><div class="tx"><b>Sending</b><code>Sending work order</code><p>Si riempie dal basso verso l'alto: il messaggio sale fino a noi.</p></div></div>
      <div><div class="stage"><div class="sig h3 s-save"><i></i><i></i><i></i><b class="q1"></b><b class="q2"></b><b class="q3"></b></div></div><div class="tx"><b>Saving</b><code>Saving</code><p>Si riempie da sinistra a destra: avanzamento, salvataggio.</p></div></div>
      <div><div class="stage"><div class="sig one s-live"><i style="opacity:0"></i><b></b></div></div><div class="tx"><b>Running</b><code>Running</code><p>Lampeggia a scatti: il sistema è acceso. Nei gestionali prende il verde.</p></div></div>
      <div><div class="stage"><div class="sig h3 s-wrong"><i></i><i></i><i></i><b></b></div></div><div class="tx"><b>Wrong</b><code>Wrong floor</code><p>Scatta a destra e a sinistra, poi si ferma: errore, campo sbagliato, 404.</p></div></div>
      <div><div class="stage"><div class="sig one hollow s-wait"><i style="opacity:0"></i><b></b></div></div><div class="tx"><b>Your turn</b><code>Waiting for you</code><p>Quadrato vuoto e fermo: il sistema aspetta te. Pieno vuol dire fatto.</p></div></div>
    </div>
    <div class="grammar">
      <div><b>Verticale</b><p>Ci si sposta tra i piani: caricare, cambiare pagina, inviare.</p></div>
      <div><b>Orizzontale</b><p>Porte e lettura: aprire, chiudere, cercare.</p></div>
      <div><b>Riempire</b><p>Avanzare. Pieno vuol dire fatto.</p></div>
      <div><b>Lampeggiare</b><p>Acceso, dal vivo. Anche il bottone premuto della pulsantiera.</p></div>
      <div><b>Scattare</b><p>Qualcosa non va. Una volta sola.</p></div>
    </div>
  </div>
  <div class="grid2">
    <div class="card"><div class="demo"><div style="display:grid;gap:22px;justify-items:center"><div class="tags"><span class="tag build"><i></i>In build</span><span class="tag run"><i></i>Running</span><span class="tag done"><i></i>Delivered</span></div><div class="states" style="justify-content:center"><span class="st2"><i style="background:#2F7D5B"></i>Running</span><span class="st2"><i style="background:#B7791F"></i>Attention</span><span class="st2"><i style="background:#B83A2C"></i>Error</span></div></div></div>
      <div class="txt"><b>Gli stati</b><p>Sul sito, gli stati del lavoro sono quadrati nel colore del testo: vuoto in costruzione, lampeggiante in funzione, pieno consegnato. Dentro i gestionali, la salute del sistema prende i tre colori di stato, sempre con la parola.</p></div></div>
    <div class="card"><div class="demo"><div class="wob">
        <button id="wob"><span id="wobT">Start a work order</span><span id="wobS"><svg viewBox="0 0 24 24"><path d="/*I:forward*/"/></svg></span></button>
        <span class="msg" id="wobM">Tocca il bottone</span>
        <div class="srch" id="srch"><svg viewBox="0 0 24 24"><path d="/*I:search*/"/></svg><span id="srchT">Search work</span><div class="sig sm h5 s-search"><i></i><i></i><i></i><i></i><i></i><b></b></div></div>
      </div></div>
      <div class="txt"><b>Dentro i componenti</b><p>Il bottone invia: i quadrati salgono, poi un quadrato pieno e il numero dell'ordine. Il campo di ricerca scorre mentre cerca. Nessuna rotellina, nessun pallino, nessun logo che gira.</p></div></div>
  </div>
</div></section>

<!-- ============ 01 COMPONENTS ============ -->
<section class="fl" data-luce="macchina" data-f="01" data-n="Componenti" id="f01"><div class="in">
  <header class="flh"><span class="n">01</span><div><span class="k">Floor 01</span><h2>Componenti</h2><p>I pezzi con cui si monta il sito. Stesse regole ovunque: angoli vivi, una riga sottile per separare, il colore che sale dal basso come un piano.</p></div></header>
  <p class="note" style="max-width:72ch">Riferimento alto per elementi e comportamento: i siti delle fonderie Klim, Dinamo, Grilli Type, Displaay, Fontshare, Pangram Pangram e Lineto. Non per il contenuto ma per la qualità di linee, forme, bottoni, form, uso del logo (anche nel footer) e animazioni degli elementi.</p>
  <div class="grid3">
    <div class="card"><div class="demo"><div class="filo" style="max-width:300px;display:grid;gap:14px"><i class="fl-l"></i><i class="fl-q" style="transform:translateY(46px)"></i><p style="font-size:14px;margin:0">Survey. We map how your business really works.</p><p style="font-size:14px;margin:0">Build. We design and ship in short, fixed cycles.</p><p style="font-size:14px;margin:0">Run. We keep it running and make it better.</p></div></div>
      <div class="txt"><b>Il filo</b><p>Una riga con un quadratino che scende di punto in punto mentre leggi, come la cabina nel vano. Per testi lunghi: metodo, casi studio, Studio. Lo vedi al lavoro nel piano 04.</p></div></div>
    <div class="card"><div class="demo"><div class="btns"><button class="b p">Start a work order <small>G</small></button><button class="b">See the work</button><a class="lnk" href="#f01">Read the case</a></div></div>
      <div class="txt"><b>Bottoni e link</b><p>Al passaggio il colore sale dal basso, come un piano. Il bottone principale porta il numero del piano dove ti manda.</p></div></div>
    <div class="card"><div class="demo"><div class="pcard"><div class="ui"><div class="sb"></div><div class="mn"><i></i><i style="width:90%"></i><i style="width:70%"></i><i style="width:80%"></i></div></div><div class="bd"><div class="hd"><span>Client</span><span>No. 014</span></div><ul><li>Booking system</li><li>Staff app</li><li>Website</li></ul><div class="res"><b>+30%</b><span>bookings in six months</span></div></div><div class="go"><span>Open the project</span><span>05</span></div></div></div>
      <div class="txt"><b>La scheda progetto</b><p>Sopra il sistema vero, ridotto. Poi cosa abbiamo fatto in tre righe e il risultato in grande. Al passaggio sale la barra per aprirlo.</p></div></div>
    <div class="card"><div class="demo"><div class="wo" id="ordine"><div class="hd"><span>Work order</span><span>No. 015</span></div>
        <label>Company<input id="woA" value="" placeholder="Your company"></label>
        <label>What you need</label><div class="opts" id="woO"><button>Management system</button><button class="on">App</button><button>Ecommerce</button><button>Website</button><button>Brand</button></div>
        <div class="send"><span class="ok" id="woK"></span><span style="display:flex;gap:12px;align-items:center"><span id="woL"></span><button class="b p" id="woS">Send</button></span></div></div></div>
      <div class="txt"><b>L'ordine di lavoro</b><p>Il modulo di contatto è un ordine numerato: il prossimo numero libero è il vostro. All'invio parte il segnale Sending.</p></div></div>
    <div class="card" style="grid-column:span 2"><div class="demo" style="place-items:stretch;align-content:center"><div><div class="chipsF" id="regF"><button class="on">All</button><button>Hospitality</button><button>Retail</button><button>Services</button></div>
        <table class="reg"><thead><tr><th>No.</th><th>Client</th><th>What we built</th><th class="r">Result</th></tr></thead><tbody id="regB"></tbody></table></div></div>
      <div class="txt"><b>Il registro delle macchine</b><p>La pagina dei lavori è un registro: numero di serie, cliente, cosa abbiamo costruito, risultato. Filtri per settore, si legge in un colpo d'occhio. Righe di esempio.</p></div></div>
    <div class="card"><div class="demo"><div class="bf" id="bf"><div class="subs"><div>Management<span>€/month</span></div><div>Bookings<span>€/month</span></div><div>Stock<span>€/month</span></div><div>Invoices<span>€/month</span></div></div><div class="arr"></div><div class="one"><span>Custom</span><b>One system</b><span>Built for you</span></div></div></div>
      <div class="txt"><b>Prima e dopo</b><p>Quattro programmi diversi diventano un sistema solo, fatto per voi. Spiega il valore senza promettere "mai abbonamenti".</p></div></div>
    <div class="card"><div class="demo"><div class="plate"><i class="rv" style="left:7px;top:7px"></i><i class="rv" style="right:7px;top:7px"></i><i class="rv" style="left:7px;bottom:7px"></i><i class="rv" style="right:7px;bottom:7px"></i><div class="hd"><div data-a="line"></div><span class="lab" style="color:inherit;opacity:.55">No. 014</span></div><dl><dt>Type</dt><dd>System and app</dd><dt>Built for</dt><dd>Client</dd><dt>Year</dt><dd>2026</dd></dl></div></div>
      <div class="txt"><b>La targhetta</b><p>La firma su ogni sistema consegnato: nel login, nel piè di pagina, nella scheda progetto. Si inverte da sola in ogni luce.</p></div></div>
    <div class="card"><div class="demo"><div class="res2" style="width:100%;display:grid;gap:8px"><div style="font:700 clamp(54px,6vw,80px)/.9 var(--f-body);letter-spacing:-.05em"><span id="cnt">+0</span>%</div><div style="font-size:15px;max-width:24ch">bookings in six months, with the new system</div><div class="lab" style="border-top:1px solid var(--ink);padding-top:8px">Example · client</div></div></div>
      <div class="txt"><b>Il numero</b><p>Il risultato in grande conta fino al suo valore quando entra nello schermo. Una riga sola sotto.</p></div></div>
    <div class="card"><div class="demo"><div class="case"><div class="big"><span>.1</span><b>Client · what we built · result</b><em>Pagina</em></div><div class="dk big"><span>.2</span><b>The machine, live</b><em>Finestra</em></div><div><span>.3</span><b>Three numbers</b><em>Pagina</em></div><div><span>.4</span><b>How it works, in three scenes</b><em>Pagina</em></div><div class="dk"><span>.5</span><b>Nameplate and credits</b><em>Finestra</em></div><div><span>G</span><b>Next project, or start yours</b><em>Porta</em></div></div></div>
      <div class="txt"><b>La pagina progetto</b><p>È la pagina che vende, una stanza del piano Work: 04 · No. 014. Il fondo è il colore del cliente o carta. Si scende per locali: chi, cosa e quanto; il sistema dal vivo in una finestra scura; tre numeri, tre scene, la targhetta. In fondo la porta: il progetto dopo, o il vostro.</p></div></div>
    <div class="card" style="grid-column:1/-1"><div class="demo"><div class="e404" style="max-width:520px"><span class="lab">Floor</span><span class="n">404</span><b>Wrong floor.</b><span style="font-size:15px;opacity:.85">This one doesn't exist. Take the lift back to the ground floor.</span><span class="lab" style="color:var(--ink)">Back to G</span></div></div>
      <div class="txt"><b>Le pagine di servizio</b><p>404, pagina vuota, errore di invio: anche queste parlano la lingua dei piani. Il segnale Wrong scatta una volta.</p></div></div>
  </div>
  <div class="sub"><h3>Icone <small>ogni estremità tagliata dritta, come il +</small></h3>
    <p class="lead">Corrette nel giro del manuale. La x aveva le estremità tagliate in verticale e sembravano svasate: ora ogni tratto finisce con un taglio perpendicolare a sé stesso, come il +, e vale per tutte le frecce e la spunta. Il manico della lente entrava dentro il vetro: ora parte dalla linea del cerchio.</p>
    <div class="icons3" id="icons"></div>
    <div class="cons">
      <div><svg class="big" id="consA" viewBox="-1 -1 26 26"></svg><b>Griglia 24, tratto 2</b><p>Ogni linea dritta sta su un'unità intera: a 24, 48 e 96 pixel il bordo è netto.</p></div>
      <div><svg class="big" id="consB" viewBox="-1 -1 26 26"></svg><b>Tagli dritti, sempre</b><p>Ogni estremità è tagliata a squadra con il proprio tratto. Le punte sono angoli retti pieni.</p></div>
      <div><svg class="big" id="consC" viewBox="-1 -1 26 26"></svg><b>Il manico parte dal cerchio</b><p>Il manico della lente nasce dalla linea del vetro e non entra dentro. Il lucchetto usa l'arco della m.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Immagini</h3>
    <div class="dirs">
      <div><span class="y">Sì · principale</span><b>Interfacce vere</b><p>Il sistema in uso, in HTML e SVG, piatto. Niente telefoni finti intorno.</p></div>
      <div><span class="y">Sì · poche, grandi</span><b>Persone e luoghi veri</b><p>Chi usa il sistema, con luce reale. Video brevi senza audio solo nelle pagine progetto.</p></div>
      <div><span class="y">Sì</span><b>Il marchio del cliente applicato</b><p>E i dettagli da vicino: un tasto, un numero, uno scontrino.</p></div>
      <div><span class="n">No</span><b>Repertorio e 3D astratto</b><p>Mai foto di repertorio, mai forme 3D che non spiegano cosa facciamo.</p></div>
    </div>
  </div>
</div></section>

<!-- ============ G GROUND FLOOR ============ -->
<section class="fl" data-luce="rosa2" data-f="G" data-n="Piano terra" id="fG"><div class="in">
  <header class="flh"><span class="n">G</span><div><span class="k">Ground floor · end of the line</span><h2>Piano terra: cosa abbiamo lasciato, cosa manca</h2><p>Per non tornare su scelte già scartate e non dimenticare niente.</p></div></header>
  <div class="gl">
    <div><h4>Scartato, per non tornarci</h4><ul>
      <li>Caratteri a pagamento (Söhne, GT Standard, Saans e altri quindici): troppo simili a Hanken per quello che costano<span>11 ottobre</span></li>
      <li>Il logo dell'header come SVG: sul Mac a 40-44 px sembra smangiucchiato, ora è un carattere<span>10 ottobre</span></li>
      <li>La s del lettering fatta di due anelli sfalsati<span>11 ottobre</span></li>
      <li>Arco rosa dentro il simbolo<span>giro 2</span></li>
      <li>Blu officina<span>giro 2</span></li>
      <li>Cambio pagina "a popcorn" con gli archetti<span>giro 2</span></li>
      <li>Tasto chiaro e scuro, regolatore di luce<span>giro 2</span></li>
      <li>Cemento #D6D5CF<span>giro 4</span></li>
      <li>Rosa #F2CDBE, troppo timido<span>giro 4</span></li>
      <li>P00, P01, N°<span>giro 4</span></li>
      <li>Numeri dei piani che salgono<span>giro 5</span></li>
      <li>Rosa come accento sul nero<span>giro 5</span></li>
      <li>"Floor 13" come nome del prodotto<span>giro 5</span></li>
      <li>Il 13 come piano della Machine Room, ora LG<span>giro 7</span></li>
      <li>Il marchio come segnale di stato<span>giro 6</span></li>
      <li>Il montaggio del marchio<span>giro 6</span></li>
      <li>Lettere A-F nella pagina progetto<span>giro 6</span></li>
      <li>Sito a landing unica<span>giro 7</span></li>
      <li>Prezzi sul sito<span>giro 7</span></li>
      <li>Survey come prodotto a pagamento separato<span>giro 7</span></li>
    </ul></div>
    <div><h4>Da fare</h4><ul>
      <li>Numeri veri dei progetti: c'è del materiale, da vedere</li>
      <li>Screenshot o demo dei sistemi già costruiti</li>
      <li>Mercato e clienti dei primi 12 mesi</li>
      <li>Film "From mark to machine" in versione lunga, e le sei animazioni rifinite</li>
      <li>Numeri dei piani disegnati con il lettering del marchio, e favicon</li>
      <li>Kit di consegna (SVG, favicon, variabili colore) e template della proposta</li>
      <li>Decidere se tenere Hanken Grotesk o un'alternativa gratuita</li>
      <li>Wireframe della home e della pagina progetto</li>
    </ul></div>
    <div><h4>Versioni precedenti</h4><ul>
      <li><a href="https://claude.ai/artifact/2i27pBQmrNguSx6SkF3ZrJ">Kit del marchio</a><span>giro 1</span></li>
      <li><a href="https://claude.ai/artifact/FuSdXvYj2AEuWPcwQqPDCL">Identità, quattro luci</a><span>giro 2</span></li>
      <li><a href="https://claude.ai/artifact/NLk1nE2Pz7BeTXDhgcfitz">Identità, la corsa</a><span>giro 3</span></li>
      <li><a href="https://claude.ai/artifact/R7DTjbJWV9xVQLpjTsju65">Affinamenti, colore e parole</a><span>giro 4</span></li>
      <li><a href="https://claude.ai/artifact/Lb7E99PUtGG6bRrEetzuzY">Quinto giro, segnali e 13</a><span>giro 5</span></li>
      <li>Manuale, versione 1<span>giro 6, versioni 1-3 della pagina</span></li>
    </ul><p class="note" style="margin-top:10px">Restano salvate. Da qui in avanti si aggiorna solo questo manuale, con una nuova versione per ogni giro.</p></div>
  </div>
  <div class="endg"><div data-a="heroS"></div><span class="lab" style="color:var(--ink)">Mother Machine · manuale · versione 2 · mothermachine.studio</span></div>
</div></section>

<!-- ============ LG MACHINE ROOM ============ -->
<section class="fl" data-luce="notte" data-f="LG" data-n="Machine Room" id="fLG"><div class="in">
  <header class="flh"><span class="n">LG</span><div><span class="k">Lower ground · key only</span><h2>Machine Room</h2><p>Sotto il piano terra, dove negli edifici veri sta la sala macchine. Non è nel pannello: ci si scende solo con la chiave, come negli interrati veri. È il nostro backoffice, il sistema No. 001, e diventa il prodotto per i clienti.</p></div></header>
  <div class="sub"><h3>Gira la chiave <small>la chiave in basso nel pannello, poi quella sullo schermo</small></h3>
    <div class="ldemo"><div class="lift" id="lift13"></div><div class="shaft tall" id="shaft13"><div class="pg"></div><div class="pg13" id="v13" hidden></div><div class="door l"><div class="sym" data-a="iconS"></div></div><div class="door r"><div class="sym" data-a="iconS"></div></div><i class="mark"></i><div class="disp"><div class="ar"><i class="u"></i><i class="d"></i></div><div class="roll"><b>G</b></div><span class="nm">Contact</span></div></div></div>
    <div class="rl">
      <div><span>1</span><b>La chiave nel pannello</b><p>Sotto i bottoni c'è un cilindro, come negli ascensori veri. Lo giri e la cabina scende sotto il piano terra, a LG.</p></div>
      <div><span>2</span><b>La chiave è il login</b><p>Niente password: la chiave è una passkey (impronta, volto o chiave fisica). Giri il cilindro sullo schermo e il sistema la controlla.</p></div>
      <div><span>3</span><b>Le porte con il simbolo</b><p>Chiave accettata: le porte si chiudono con il simbolo sopra e si aprono sulla Machine Room. Lo stesso gesto dell'ingresso al sito.</p></div>
      <div><span>4</span><b>Dentro, il sistema No. 001</b><p>Il back office dello studio: i piani del sito da modificare, gli ordini di lavoro con i loro stati, i progetti. All'inizio i clienti non ci entrano. Più in fondo c'è The Lab.</p></div>
    </div>
  </div>
  <div class="opt3">
    <div><span class="tg">Perché sotto</span><h4>La sala macchine</h4><p>Negli edifici veri il motore e gli impianti stanno spesso sottoterra. Il sito sta sopra, la macchina che lo fa girare sta sotto.</p></div>
    <div><span class="tg y">Scelto</span><h4>LG · Machine Room</h4><p>LG, lower ground, è la sigla internazionale degli interrati. Ed è il nome che questo progetto ha da sempre: Lower Ground.</p></div>
    <div><span class="tg">Per ora</span><h4>Il nostro back office</h4><p>All'inizio LG è il back office dello studio e i clienti non ci entrano. The Lab, dietro, tiene i dati più sensibili. Più avanti si decide se LG va ai clienti ("Every system we build comes with its own Machine Room") e il nostro back office scende tutto nel Lab.</p></div>
  </div>
  <div class="sub"><h3>Dietro la Machine Room: The Lab <small>la parte più profonda · prova: tre tocchi veloci sulla chiave, poi 04, 02, 05, 01</small></h3>
    <div class="sx" id="sx">
      <div class="lift" id="sxLift"></div>
      <div class="sxw" id="sxW">
        <div class="sxst sx0 on" id="sxS0">
          <div class="top"><div class="brand"><div data-a="iconS"></div><span class="sxk">LG · Machine Room</span></div><span class="sxk">Back office · No. 001</span></div>
          <div class="sxbay" id="sxBay">
            <div class="sxcmp" id="sxCmp"><span class="sxk">Behind the panel</span><h5>Two keys.</h5>
              <div class="sxkeys"><div id="sxK1"><button class="sxcy" id="sxC1" aria-label="Turn the first key"><i></i></button><b>Key 1 · This screen</b></div>
                <div id="sxK2"><div class="sxph" id="sxPh"><button class="sxcy" id="sxC2" aria-label="Turn the second key"><i></i></button></div><b>Key 2 · Your phone</b></div></div>
              <div class="sxbar"><i id="sxBar"></i></div><div class="sxmsg" id="sxMsg">Turn both keys within 8 seconds.</div></div>
            <div class="sxhatch" id="sxHatch"><div class="rows">
              <div><span>No. 018</span>Work order · new brewery system<em>New</em></div>
              <div><span>No. 017</span>Brand · coffee roaster<em>In build</em></div>
              <div><span>No. 016</span>Ecommerce · ceramics<em>Running</em></div>
              <div><span>05</span>Home · edit the opening<em>Draft</em></div>
              <div><span>Inbox</span>3 work orders to answer<em>Today</em></div>
            </div><div class="sxseam" id="sxSeam"><i></i><i></i><i></i><i></i></div></div>
          </div>
          <span class="sxk">Authorised staff only</span>
        </div>
        <div class="sxst sxc" id="sxSC"><svg id="sxCor" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice"></svg><span class="sxk lbl">LG · The passage</span></div>
        <div class="sxst sx3" id="sxS3"><div><span class="sxk">LG · The Lab</span><h4>The Lab.</h4><p class="sub2">The deepest part of the machine. What matters most, kept where nobody else goes.</p></div><div></div>
          <div class="gr"><div><span>R&amp;D</span><b>4 ideas running</b></div><div><span>Finance</span><b>Encrypted</b></div><div><span>Contracts</span><b>Signed, kept</b></div></div>
          <div class="ft"><span class="sxk">Two keys · locked to this device · session 15:00</span><button id="sxBack">Back to the Machine Room</button></div></div>
        <div class="sxwall" id="sxWall"><div class="l"><div class="sym" data-a="iconS"></div></div><div class="r"><div class="sym" data-a="iconS"></div></div></div>
        <div class="sxflash" id="sxFlash"></div>
      </div>
    </div>
    <div class="rl">
      <div><span>1</span><b>La chiave ha tre posizioni</b><p>La pulsantiera è sempre la stessa e i piani funzionano sempre. A LG, tre tocchi veloci sulla chiave la girano in una terza posizione, segnata solo da un graffio quasi invisibile: la pulsantiera diventa un tastierino (etichette spente, quattro trattini nel display). Un tocco sulla chiave e torna normale; da sola dopo 20 secondi.</p></div>
      <div><span>2</span><b>Un pezzo di sito si stacca</b><p>Codice giusto: il display scrive OPEN e il pannello sfarfalla. Al centro della Machine Room le giunture di un pannello si accendono, il pannello si stacca e si apre verso di te come uno sportello. Dietro c'è il vano con la serratura.</p></div>
      <div><span>3</span><b>Due chiavi</b><p>Una sullo schermo e una sul telefono, entro otto secondi: la conferma su un secondo dispositivo. La serratura si può cambiare in futuro, lo sportello resta.</p></div>
      <div><span>4</span><b>Il passaggio</b><p>La Machine Room ruota come una libreria. Un corridoio: le luci si accendono una dopo l'altra, la luce filtra dalla porta in fondo, la porta con il simbolo si divide in due. The Lab.</p></div>
    </div>
    <p class="note">Il gesto è solo la porta, non la sicurezza. Sul server: password lunga, passkey, conferma sul telefono, dispositivi autorizzati, sessioni brevi, accessi registrati. Il codice dei piani si cambia quando si vuole e non vive nel codice della pagina. All'inizio LG è il back office dello studio e i clienti non ci entrano; più avanti si decide se LG va ai clienti e il back office scende tutto nel Lab.</p>
  </div>
</div></section>


<script>var AS=/*ASSETS*/;var IC=/*ICONS*/;</script>
<script>
(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-a]').forEach(function(el){el.insertAdjacentHTML('afterbegin',AS[el.getAttribute('data-a')])});
function two(n){return n===0?'G':n===-1?'LG':('0'+n).slice(-2)}
function $(id){return document.getElementById(id)}

/* ---------- lift panel component ---------- */
var LUCEC={carta:'#F4F2EC',macchina:'#BEC2BF',notte:'#0F0F0E',rosa2:'#EEC3B1'};
function Lift(root,floors,opt){
  opt=opt||{};
  root.innerHTML='<div class="scr"><span class="ar"><i class="u"></i><i class="d"></i></span><b></b><span></span></div><ol>'+floors.map(function(f){return '<li data-k="'+f.k+'"><button aria-label="Floor '+f.label+', '+f.name+'"><span class="sq">'+f.label+'</span><span class="nm">'+f.name+'</span><i class="sw"'+(f.luce?' style="background:'+LUCEC[f.luce]+'"':' style="visibility:hidden"')+'></i></button></li>'}).join('')+'</ol>'+(opt.key?'<div class="keyw"><button class="cyl" aria-label="Lower ground, key only"><i></i><b class="n3"></b></button><div><b>LG</b><span>Machine Room · key only</span></div></div>':'');
  var lis=[].slice.call(root.querySelectorAll('li')),scr=root.querySelector('.scr'),scrN=root.querySelector('.scr b'),scrL=root.querySelector('.scr span:last-child'),U=root.querySelector('.scr .u'),D=root.querySelector('.scr .d'),cyl=root.querySelector('.cyl');
  var now={l:'',n:''},code=null,clicks=[],codeT=null,SEC=opt.secret;
  function disp(l,n){scrN.textContent=l;scrL.textContent=n}
  lis.forEach(function(li,i){var b=li.querySelector('button'),f=floors[i];
    b.addEventListener('click',function(){if(code){press(f.label,li);return}opt.onPick&&opt.onPick(li.dataset.k)});
    function pre(){if(code||root.classList.contains('open'))return;root.classList.add('pre');disp(f.label,f.name)}
    function back(){if(code||root.classList.contains('open'))return;root.classList.remove('pre');disp(now.l,now.n)}
    b.addEventListener('mouseenter',pre);b.addEventListener('mouseleave',back);b.addEventListener('focus',pre);b.addEventListener('blur',back)});
  /* the key: one turn goes to LG; at LG three quick turns reach a third, almost invisible position: the panel becomes a keypad */
  if(cyl)cyl.addEventListener('click',function(){
    if(code){exitCode();return}
    if(SEC&&opt.atLG&&opt.atLG()){var t=performance.now();clicks=clicks.filter(function(x){return t-x<700});clicks.push(t);if(clicks.length>=3){clicks=[];enterCode()}return}
    opt.onKey&&opt.onKey(cyl)});
  function dots(n){var L=SEC.code.length,s=[];for(var i=0;i<L;i++)s.push(i<n?'•':'-');return s.join('')}
  function arm(){clearTimeout(codeT);codeT=setTimeout(exitCode,20000)}
  function enterCode(){code=[];root.classList.remove('pre');root.classList.add('code');cyl.classList.add('sec');disp(dots(0),'Code');arm()}
  function exitCode(){code=null;clearTimeout(codeT);root.classList.remove('code');if(!root.classList.contains('open'))cyl.classList.remove('sec');disp(now.l,now.n)}
  function press(label,li){arm();code.push(label);li.classList.add('call');setTimeout(function(){li.classList.remove('call')},220);disp(dots(code.length),'Code');
    if(code.length<SEC.code.length)return;
    if(code.join()===SEC.code.join()){code=null;clearTimeout(codeT);root.classList.remove('code');root.classList.add('open');disp('OPEN','Code accepted');SEC.onUnlock&&SEC.onUnlock()}
    else{code=[];scr.classList.remove('no');void scr.offsetWidth;scr.classList.add('no');setTimeout(function(){if(code)disp(dots(0),'Try again')},380)}}
  return {
    cur:function(k,label,name){lis.forEach(function(li){li.classList.toggle('cur',li.dataset.k===String(k));if(li.dataset.k===String(k))li.classList.remove('call')});now={l:label,n:name};disp(label,name)},
    call:function(k){lis.forEach(function(li){li.classList.toggle('call',li.dataset.k===String(k))})},
    clear:function(){lis.forEach(function(li){li.classList.remove('call')})},
    dir:function(d){U.classList.toggle('on',d>0);D.classList.toggle('on',d<0)},
    key:function(on){if(cyl)cyl.classList.toggle('on',on)},
    show:function(label,name){now={l:label,n:name};disp(label,name);lis.forEach(function(li){li.classList.remove('cur')})},
    relock:function(){root.classList.remove('open','code');code=null;clearTimeout(codeT);if(cyl)cyl.classList.remove('sec')},
    el:root
  }}

/* ---------- the run: shaft rides between levels ---------- */
function Shaft(sh,FL,draw){
  var pg=sh.querySelector('.pg'),dL=sh.querySelector('.door.l'),dR=sh.querySelector('.door.r'),mk=sh.querySelector('.mark'),disp=sh.querySelector('.disp'),roll=sh.querySelector('.roll'),nm=sh.querySelector('.disp .nm'),U=sh.querySelector('.disp .u'),Dn=sh.querySelector('.disp .d');
  var S={cur:null,busy:false,EC:'cubic-bezier(.7,0,.2,1)'};
  function A(el,kf,o){return el.animate(kf,Object.assign({fill:'forwards'},o)).finished}
  function step(n,dir,dur){var old=roll.firstElementChild,nb=document.createElement('b');nb.textContent=two(n);roll.appendChild(nb);
    nb.style.position='absolute';nb.style.left='0';nb.style.right='0';nb.style.top='0';
    var a=old.animate([{transform:'translateY(0)'},{transform:'translateY('+(dir>0?-100:100)+'%)'}],{duration:dur,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'});
    nb.animate([{transform:'translateY('+(dir>0?100:-100)+'%)'},{transform:'translateY(0)'}],{duration:dur,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'});
    var h=sh.clientHeight;mk.animate([{transform:'translateY('+(dir>0?0:h)+'px)',opacity:0},{opacity:.35,offset:.2},{opacity:.35,offset:.8},{transform:'translateY('+(dir>0?h:0)+'px)',opacity:0}],{duration:dur,easing:'linear'});
    return a.finished.then(function(){old.remove();nb.style.position='static'})}
  S.set=function(k){S.cur=k;draw(pg,k);roll.innerHTML='<b>'+two(k)+'</b>';nm.textContent=(FL[k]||[''])[0]};
  S.close=function(sig){sh.classList.toggle('sigil',!!sig);dL.animate([{transform:'translateX(-101%)'},{transform:'translateX(0)'}],{duration:480,easing:S.EC,fill:'forwards'});return A(dR,[{transform:'translateX(101%)'},{transform:'translateX(0)'}],{duration:480,easing:S.EC})};
  S.open=function(){dL.animate([{transform:'translateX(0)'},{transform:'translateX(-101%)'}],{duration:620,easing:S.EC,fill:'forwards'});return A(dR,[{transform:'translateX(0)'},{transform:'translateX(101%)'}],{duration:620,easing:S.EC}).then(function(){sh.classList.remove('sigil')})};
  S.ride=async function(to,onStep){
    if(S.busy||to===S.cur)return false;S.busy=true;var from=S.cur,dir=to>from?1:-1,n=Math.abs(to-from);
    if(reduce){S.set(to);S.busy=false;onStep&&onStep(to,0);return true}
    U.classList.toggle('on',dir>0);Dn.classList.toggle('on',dir<0);onStep&&onStep(from,dir);
    await S.close(false);
    await A(disp,[{opacity:0},{opacity:1}],{duration:160});
    for(var i=1;i<=n;i++){var d=n===1?560:Math.round(Math.max(110,Math.min(300,1300/n)));var lv=from+dir*i;await step(lv,dir,d);nm.textContent=(FL[lv]||[''])[0];onStep&&onStep(lv,dir)}
    S.cur=to;draw(pg,to);
    await Promise.all([dL,dR,disp].map(function(e){return e.animate([{translate:'0 0'},{translate:'0 '+(dir>0?5:-5)+'px'},{translate:'0 0'}],{duration:260,easing:'cubic-bezier(.3,0,.3,1)'}).finished}));
    U.classList.remove('on');Dn.classList.remove('on');
    await A(disp,[{opacity:1},{opacity:0}],{duration:160});
    await S.open();S.busy=false;return true};
  return S}

var SITE={'-1':['Machine Room','notte',''],0:['Contact','rosa2','Tell us what slows you down.'],1:['Studio','rosa2','A design and engineering studio for companies that want to grow.'],2:['Systems','macchina','The tools your company runs on.'],3:['Brand','carta','So the company looks as good as it runs.'],4:['Work','notte','Results, not deliverables.'],5:['Home','carta','The machine behind your business.']};
var SITEF=[5,4,3,2,1,0].map(function(k){return {k:k,label:two(k),name:SITE[k][0],luce:SITE[k][1]}});
function drawSite(pg,k){var d=SITE[k];pg.className='pg';pg.setAttribute('data-luce',d[1]);pg.innerHTML='<div><span class="l">'+two(k)+' · '+d[0]+'</span><div class="t">'+d[2]+'</div><i style="width:70%"></i><i style="width:52%"></i></div><div class="bx"></div>'}

/* ---------- 03: panel + run ---------- */
var sh03=Shaft($('shaft03'),SITE,drawSite);sh03.set(5);
var l03=Lift($('lift03'),SITEF,{key:true,onPick:function(k){k=+k;if(sh03.busy||k===sh03.cur)return;l03.call(k);sh03.ride(k,function(lv,d){l03.dir(d);l03.show(two(lv),(SITE[lv]||[''])[0])}).then(function(){l03.dir(0);l03.cur(sh03.cur,two(sh03.cur),SITE[sh03.cur][0])})},onKey:function(c){c.classList.add('on');setTimeout(function(){c.classList.remove('on');$('fLG').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){if(!mr.at13)keyTo13()},reduce?50:1100)},reduce?0:850)}});
l03.cur(5,'05','Home');
if(!reduce){var once=false;new IntersectionObserver(function(es){if(es[0].isIntersecting&&!once){once=true;setTimeout(function(){l03.call(3);sh03.ride(3,function(lv,d){l03.dir(d);l03.show(two(lv),SITE[lv][0])}).then(function(){l03.dir(0);l03.cur(3,'03',SITE[3][0])})},700)}},{threshold:.5}).observe($('shaft03'))}

/* ---------- 13: machine room ---------- */
var shEl=$('shaft13');
function sw13(){shEl.style.setProperty('--sw',Math.round(shEl.clientHeight*0.30*0.503)+'px')}sw13();addEventListener('resize',sw13);
var mr={at13:false,inside:false};
var DASH='<div class="mdash"><nav><span class="h">Site floors</span><div class="i">Home<span>05</span></div><div class="i">Work<span>04</span></div><div class="i">Systems<span>03</span></div><div class="i">Brand<span>02</span></div><div class="i">Studio<span>01</span></div><div class="i">Contact<span>G</span></div><span class="h">Machine Room</span><div class="i on">Work orders<span>LG</span></div><div class="i">Projects<span>No.</span></div><div class="i">Clients<span></span></div></nav><main><div class="top"><b>Work orders</b><div class="sig sm one s-live" style="color:#F1EEE7"><i style="opacity:0"></i><b></b></div></div><div class="kp"><div><b>3</b><span>New this week</span></div><div><b>2</b><span>In build</span></div><div><b>14</b><span>Running</span></div></div><div style="overflow-x:auto"><table><thead><tr><th>No.</th><th>Client</th><th>What</th><th>Status</th></tr></thead><tbody><tr><td>015</td><td>Client A</td><td>Booking system</td><td><span class="stt"><i style="border:1.5px solid #F1EEE7;box-sizing:border-box"></i>Your turn</span></td></tr><tr><td>014</td><td>Client B</td><td>Back office and app</td><td><span class="stt"><i style="background:#B7791F"></i>Attention</span></td></tr><tr><td>013</td><td>Client C</td><td>Ecommerce</td><td><span class="stt"><i style="background:#2F7D5B"></i>Running</span></td></tr><tr><td>012</td><td>Client D</td><td>Brand identity</td><td><span class="stt"><i style="background:#F1EEE7"></i>Delivered</span></td></tr></tbody></table></div><div class="sigf"><span>Built by Mother Machine · No. 001</span><span>LG · Lower ground</span></div></main></div>';
var LOGIN='<div class="login"><span class="tl">LG</span><span class="tr">Machine Room · lower ground<br>Authorised staff only</span><div class="bx"><div class="mk"><em class="e0">0</em><em class="e1">LG</em><button class="cyl" id="cyl13" aria-label="Turn your key"><i></i></button></div><h4>Turn your key.</h4><span class="hint2" id="h13">Passkey · fingerprint, face or key</span><span class="alt">Use email instead</span></div></div>';
var v13=$('v13');function draw13(pg,k){if(k!==-1){v13.hidden=true;drawSite(pg,k);return}v13.hidden=false;v13.innerHTML=mr.inside?DASH:LOGIN;if(!mr.inside)bindKey()}
var sh13=Shaft(shEl,SITE,draw13);sh13.set(0);
function bindKey(){var c=$('cyl13'),h=$('h13');if(!c)return;c.addEventListener('click',function(){if(c.classList.contains('on'))return;c.classList.add('on');
  setTimeout(function(){h.innerHTML='<span class="sig sm v3 s-send" style="color:#F1EEE7"><i></i><i></i><i></i><b class="q1"></b><b class="q2"></b><b class="q3"></b></span>Checking key'},reduce?0:700);
  setTimeout(function(){h.innerHTML='<span class="sig sm one" style="color:#F1EEE7"><b style="position:static"></b></span>Key accepted'},reduce?0:2000);
  setTimeout(async function(){if(reduce){mr.inside=true;draw13(shEl.querySelector('.pg'),-1);return}await sh13.close(true);await new Promise(function(r){setTimeout(r,650)});mr.inside=true;draw13(shEl.querySelector('.pg'),-1);await sh13.open()},reduce?0:2700)})}
function keyTo13(){if(sh13.busy)return;l13.key(true);mr.at13=true;l13.clear();setTimeout(function(){sh13.ride(-1,function(lv,d){l13.dir(d);l13.show(two(lv),(SITE[lv]||[''])[0])}).then(function(){l13.dir(0);l13.show('LG','Machine Room')})},reduce?0:850)}
var l13=Lift($('lift13'),SITEF,{key:true,onPick:function(k){k=+k;if(sh13.busy||k===sh13.cur)return;l13.key(false);mr.at13=false;mr.inside=false;l13.call(k);sh13.ride(k,function(lv,d){l13.dir(d);l13.show(two(lv),(SITE[lv]||[''])[0])}).then(function(){l13.dir(0);l13.cur(sh13.cur,two(sh13.cur),SITE[sh13.cur][0])})},onKey:function(){if(mr.at13)return;keyTo13()}});
l13.cur(0,'G','Contact');

/* ---------- manual navigation: bar display, rail, panel ---------- */
var FLS=[].slice.call(document.querySelectorAll('section.fl[data-f]')),bar=$('bar'),bN=$('bN'),bL=$('bL'),bU=$('bU'),bD=$('bD'),rail=$('rail'),navL=$('navLift'),curI=-1,lastY=scrollY,tmo;
var NAVF=FLS.filter(function(s){return s.dataset.f!=='LG'}).map(function(s){return {k:s.id,label:s.dataset.f,name:s.dataset.n,luce:s.dataset.luce}});
var navDim=$('navDim');function openNav(on){navL.classList.toggle('on',on);navDim.classList.toggle('on',on);document.body.classList.toggle('navopen',on)}
navDim.addEventListener('click',function(){openNav(false)});
var nav=Lift(navL,NAVF,{key:true,onPick:function(id){nav.call(id);setTimeout(function(){openNav(false);$(id).scrollIntoView({behavior:reduce?'auto':'smooth'})},reduce?0:260)},onKey:function(c){c.classList.add('on');setTimeout(function(){openNav(false);$('fLG').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){c.classList.remove('on')},900)},reduce?0:800)}});
rail.innerHTML=NAVF.map(function(f){return '<button data-id="'+f.k+'" aria-label="Floor '+f.label+'"><span>'+f.label+' · '+f.name+'</span><i></i></button>'}).join('');
var rb=[].slice.call(rail.querySelectorAll('button'));rb.forEach(function(b){b.addEventListener('click',function(){$(b.dataset.id).scrollIntoView({behavior:reduce?'auto':'smooth'})})});
$('dispB').addEventListener('click',function(e){e.stopPropagation();openNav(!navL.classList.contains('on'))});
addEventListener('keydown',function(e){if(e.key==='Escape')openNav(false)});
/* the arrows in the bar: one floor up or down without opening the panel */
function stepNav(d){var ids=NAVF.map(function(f){return f.k}),i=ids.indexOf(FLS[curI].id);if(i<0)i=ids.length-1;var j=Math.max(0,Math.min(ids.length-1,i+d));if(j!==i)$(ids[j]).scrollIntoView({behavior:reduce?'auto':'smooth'})}
bU.addEventListener('click',function(e){e.stopPropagation();stepNav(-1)});bD.addEventListener('click',function(e){e.stopPropagation();stepNav(1)});
/* the real logo hangs below the bar at the top, then folds into the bar */
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('20px MMLogoS','\uE000'),document.fonts.load('20px MMLogoW','\uE000')]).then(function(){if(document.fonts.check('20px MMLogoS','\uE000')&&document.fonts.check('20px MMLogoW','\uE000'))document.documentElement.classList.add('mmfont')}).catch(function(){})}
function mini(){bar.classList.toggle('fold',scrollY>30)}addEventListener('scroll',mini,{passive:true});mini();
function setNav(i){var s=FLS[i],down=i>curI;curI=i;var l=s.dataset.luce;bar.setAttribute('data-luce',l);rail.setAttribute('data-luce',l);navL.setAttribute('data-luce',l);
  var nb=document.createElement('b');nb.textContent=s.dataset.f;bN.innerHTML='';bN.appendChild(nb);bL.textContent=s.dataset.n;
  if(!reduce)nb.animate([{transform:'translateY('+(down?'-100%':'100%')+')'},{transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
  rb.forEach(function(b){b.classList.toggle('on',b.dataset.id===s.id)});nav.cur(s.id,s.dataset.f,s.dataset.n)}
function pickNav(){var y=scrollY+innerHeight*0.4,i=0;FLS.forEach(function(s,j){if(s.offsetTop<=y)i=j});if(i!==curI)setNav(i)}
addEventListener('scroll',function(){var y=scrollY;bD.classList.toggle('on',y>lastY);bU.classList.toggle('on',y<lastY);lastY=y;clearTimeout(tmo);tmo=setTimeout(function(){bD.classList.remove('on');bU.classList.remove('on')},260);pickNav()},{passive:true});
setNav(0);pickNav();

/* ---------- 11: the cabin in the shaft ---------- */
(function(){var cab=$('cab'),fl=document.querySelector('.fls');if(!cab||reduce)return;
  function run(){cab.getAnimations().forEach(function(a){a.cancel()});var rows=[].slice.call(fl.querySelectorAll('.frow')),H=fl.clientHeight,top0=fl.getBoundingClientRect().top,n=rows.length,kf=[],E='cubic-bezier(.65,0,.35,1)';
    rows.forEach(function(r,i){var y=r.getBoundingClientRect().top-top0+r.clientHeight/2-6;var a=i/n,b=a+0.6/n;kf.push({transform:'translateY('+y+'px)',offset:a,easing:E});kf.push({transform:'translateY('+y+'px)',offset:Math.min(b,0.999),easing:E})});
    kf.push({transform:kf[0].transform,offset:1});cab.animate(kf,{duration:16000,iterations:Infinity})}
  run();addEventListener('resize',function(){clearTimeout(run.t);run.t=setTimeout(run,200)})})();

/* ---------- 10: film and micro animations ---------- */
var NS='http://www.w3.org/2000/svg',EZ='cubic-bezier(.65,0,.35,1)',ANIMS=[];
function el(p,tag,a,txt){var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;p.appendChild(e);return e}
function tl(e,fr,D){var kf=fr.map(function(f){var o=Object.assign({},f[1]);o.offset=f[0];o.easing=o.easing||EZ;return o});
  /* every property is held between keyframes: fill gaps with the last known value, and back-fill the start */
  var props={};kf.forEach(function(k){for(var p in k)if(p!=='offset'&&p!=='easing')props[p]=1});
  Object.keys(props).forEach(function(p){var last;for(var i=0;i<kf.length;i++){if(kf[i][p]!==undefined)last=kf[i][p];else if(last!==undefined)kf[i][p]=last}
    var first;for(var j=0;j<kf.length;j++){if(kf[j][p]!==undefined){first=kf[j][p];break}}if(p==='opacity')first=1;for(var m=0;m<kf.length&&kf[m][p]===undefined;m++)kf[m][p]=first});var a=e.animate(kf,{duration:D,iterations:Infinity});ANIMS.push([a,D]);return a}
function show(e,a,b,c,d,D,extra){/* opacity 0 until a, 1 from b to c, 0 from d */var f=[[0,{opacity:0}],[a,{opacity:0}],[b,{opacity:1}],[c,{opacity:1}],[d,{opacity:0}],[1,{opacity:0}]];return tl(e,f,D)}
function draw(e,a,b,D){e.setAttribute('pathLength','1');e.style.strokeDasharray='1';return tl(e,[[0,{strokeDashoffset:1}],[a,{strokeDashoffset:1}],[b,{strokeDashoffset:0}],[1,{strokeDashoffset:0}]],D)}
var FONT='font-family:Hanken,system-ui,sans-serif';var MONO='font-family:DMMono,monospace';
(function film(){var s=$('film');if(!s)return;var D=12000;
  var C={cr:'#F6E7C8',tc:'#D2582A',ink:'#2B1D14',cr2:'#E9B98F',bs:'#3E7B4F',wh:'#FFF8EC'};
  el(s,'rect',{width:640,height:360,fill:C.cr});
  el(s,'text',{x:620,y:28,'text-anchor':'end',fill:'#8A4B2A',style:MONO+';font-size:11px;letter-spacing:.08em'},'CONCEPT · FORNO NOVE');
  // act 3 frames first (behind the mark)
  var ph=el(s,'g',{});var phf=el(ph,'rect',{x:250,y:26,width:140,height:308,rx:20,fill:'#FFFFFF','fill-opacity':0,stroke:C.ink,'stroke-width':4});
  var wire=[[262,44,116,44,C.wh],[262,98,116,70,C.tc],[262,178,54,54,C.cr2],[324,178,54,54,C.cr2],[262,242,116,10,C.ink],[262,260,80,10,C.ink],[262,284,116,32,C.bs]];
  var wr=wire.map(function(w){return el(ph,'rect',{x:w[0],y:w[1],width:w[2],height:w[3],rx:3,fill:w[4],'fill-opacity':0,stroke:C.ink,'stroke-opacity':.4,'stroke-dasharray':'4 4','stroke-width':1.5})});
  var buns=el(ph,'g',{});el(buns,'circle',{cx:292,cy:133,r:18,fill:C.cr});el(buns,'circle',{cx:348,cy:133,r:18,fill:C.cr});el(buns,'circle',{cx:289,cy:205,r:14,fill:C.tc});el(buns,'circle',{cx:351,cy:205,r:14,fill:C.tc});
  var ord=el(ph,'text',{x:320,y:305,'text-anchor':'middle',fill:'#FFFFFF',style:FONT+';font-weight:700;font-size:14px'},'Order now');
  var bo=el(s,'g',{});var bof=el(bo,'rect',{x:420,y:70,width:196,height:196,fill:'#FFFFFF','fill-opacity':0,stroke:C.ink,'stroke-width':3});
  var bos=el(bo,'rect',{x:420,y:70,width:42,height:196,fill:C.ink,'fill-opacity':0,stroke:C.ink,'stroke-opacity':.4,'stroke-dasharray':'4 4'});
  var bor=[0,1,2,3].map(function(i){return el(bo,'rect',{x:474,y:100+i*26,width:130,height:16,fill:'#F1E4CC','fill-opacity':0,stroke:C.ink,'stroke-opacity':.4,'stroke-dasharray':'4 4'})});
  var bot=el(bo,'text',{x:474,y:90,fill:C.ink,style:FONT+';font-weight:700;font-size:13px'},'Orders');
  var sq=['#3E7B4F','#B7791F','#3E7B4F',C.tc].map(function(c,i){return el(bo,'rect',{x:588,y:104+i*26,width:8,height:8,fill:c})});
  var cnt=el(bo,'text',{x:474,y:226,fill:C.ink,style:FONT+';font-weight:800;font-size:26px;letter-spacing:-.03em'},'128');
  var cnl=el(bo,'text',{x:474,y:248,fill:'#8A4B2A',style:MONO+';font-size:10px;letter-spacing:.06em'},'ORDERS TODAY');
  var rc=el(s,'g',{});var rcf=el(rc,'rect',{x:36,y:84,width:150,height:212,fill:'#FFFFFF','fill-opacity':0,stroke:C.ink,'stroke-width':3});
  var rcl=[0,1,2,3,4].map(function(i){return el(rc,'rect',{x:54,y:150+i*20,width:i===4?60:114,height:8,fill:C.ink,'fill-opacity':0,stroke:C.ink,'stroke-opacity':.4,'stroke-dasharray':'3 3'})});
  var rcm=el(rc,'g',{});el(rcm,'path',{d:'M97 132V116a14 14 0 0 1 28 0v16',fill:'none',stroke:C.tc,'stroke-width':5});el(rcm,'path',{d:'M90 132h42',stroke:C.ink,'stroke-width':3});
  // the mark
  var mk=el(s,'g',{style:'transform-box:view-box;transform-origin:0 0'});
  var arch=el(mk,'path',{d:'M262 232V172a58 58 0 0 1 116 0v60',fill:'none',stroke:C.tc,'stroke-width':16});
  var base=el(mk,'path',{d:'M240 232h160',stroke:C.ink,'stroke-width':10});
  var word=el(s,'text',{x:320,y:290,'text-anchor':'middle',fill:C.ink,style:FONT+';font-weight:800;font-size:32px;letter-spacing:-.03em'},'forno nove');
  var L=['1 · The mark','2 · The structure','3 · The skin'].map(function(t){return el(s,'text',{x:20,y:342,fill:C.ink,style:MONO+';font-size:12px;letter-spacing:.08em'},t.toUpperCase())});
  var cover=el(s,'rect',{width:640,height:360,fill:C.cr,opacity:0});
  // timeline
  draw(arch,.02,.15,D);draw(base,.12,.2,D);
  tl(word,[[0,{opacity:0}],[.17,{opacity:0}],[.23,{opacity:1}],[.31,{opacity:1}],[.35,{opacity:0}],[1,{opacity:0}]],D);
  tl(mk,[[0,{transform:'translate(0px,0px) scale(1)'}],[.32,{transform:'translate(0px,0px) scale(1)'}],[.42,{transform:'translate(250px,28px) scale(.22)'}],[1,{transform:'translate(250px,28px) scale(.22)'}]],D);
  draw(phf,.33,.43,D);tl(phf,[[0,{fillOpacity:0,opacity:0}],[.329,{fillOpacity:0,opacity:0}],[.33,{fillOpacity:0,opacity:1}],[.62,{fillOpacity:0,opacity:1}],[.66,{fillOpacity:1,opacity:1}],[1,{fillOpacity:1,opacity:1}]],D);
  wr.forEach(function(r,i){var a=.40+i*.012;tl(r,[[0,{opacity:0,fillOpacity:0,strokeOpacity:.4}],[a,{opacity:0,fillOpacity:0,strokeOpacity:.4}],[a+.03,{opacity:1,fillOpacity:0,strokeOpacity:.4}],[.62+i*.012,{opacity:1,fillOpacity:0,strokeOpacity:.4}],[.66+i*.012,{opacity:1,fillOpacity:1,strokeOpacity:0}],[1,{opacity:1,fillOpacity:1,strokeOpacity:0}]],D)});
  show(buns,.68,.72,.99,1,D);show(ord,.71,.74,.99,1,D);
  draw(bof,.45,.53,D);tl(bof,[[0,{fillOpacity:0,opacity:0}],[.449,{fillOpacity:0,opacity:0}],[.45,{fillOpacity:0,opacity:1}],[.64,{fillOpacity:0,opacity:1}],[.68,{fillOpacity:1,opacity:1}],[1,{fillOpacity:1,opacity:1}]],D);
  [bos].concat(bor).forEach(function(r,i){var a=.5+i*.012;tl(r,[[0,{opacity:0,fillOpacity:0,strokeOpacity:.4}],[a,{opacity:0,fillOpacity:0,strokeOpacity:.4}],[a+.03,{opacity:1,fillOpacity:0,strokeOpacity:.4}],[.68+i*.012,{opacity:1,fillOpacity:0,strokeOpacity:.4}],[.72+i*.012,{opacity:1,fillOpacity:1,strokeOpacity:0}],[1,{opacity:1,fillOpacity:1,strokeOpacity:0}]],D)});
  show(bot,.5,.54,.99,1,D);sq.forEach(function(q,i){show(q,.74+i*.02,.76+i*.02,.99,1,D)});show(cnt,.78,.81,.99,1,D);show(cnl,.78,.81,.99,1,D);
  draw(rcf,.48,.56,D);tl(rcf,[[0,{fillOpacity:0,opacity:0}],[.479,{fillOpacity:0,opacity:0}],[.48,{fillOpacity:0,opacity:1}],[.66,{fillOpacity:0,opacity:1}],[.7,{fillOpacity:1,opacity:1}],[1,{fillOpacity:1,opacity:1}]],D);
  rcl.forEach(function(r,i){var a=.52+i*.012;tl(r,[[0,{opacity:0,fillOpacity:0,strokeOpacity:.4}],[a,{opacity:0,fillOpacity:0,strokeOpacity:.4}],[a+.03,{opacity:1,fillOpacity:0,strokeOpacity:.4}],[.7+i*.012,{opacity:1,fillOpacity:0,strokeOpacity:.4}],[.74+i*.012,{opacity:1,fillOpacity:.85,strokeOpacity:0}],[1,{opacity:1,fillOpacity:.85,strokeOpacity:0}]],D)});
  show(rcm,.72,.76,.99,1,D);
  show(L[0],.03,.06,.28,.31,D);show(L[1],.33,.36,.58,.61,D);show(L[2],.63,.66,.9,.93,D);
  tl(cover,[[0,{opacity:0}],[.93,{opacity:0}],[.985,{opacity:1}],[1,{opacity:1}]],D)})();
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){
/* ===== six service animations, v4: the first set, rebuilt on one grammar =====
   grammar: tinted background per service, one white object at the centre, ink + one accent + grey,
   corners 8, the same skeleton lines for interfaces, a state label bottom left that changes
   from the starting state to the result, the same three easings, the same loop (build, act, result, hold, fade). */
var SP='cubic-bezier(.34,1.56,.64,1)',OQ='cubic-bezier(.22,1,.36,1)',IQ='cubic-bezier(.55,0,.75,.06)',LIN='linear';
var INK='#121211',GR='#E6E3DC',WH='#FFFFFF';
function G(p,a){return el(p,'g',a||{})}
function T(x,y,s){return {transform:'translate('+x+'px,'+y+'px)'+(s!=null?' scale('+s+')':'')}}
function O(o,x){var r=Object.assign({},x||{});r.opacity=o;return r}
function E(o,ez){var r=Object.assign({},o);r.easing=ez;return r}
function fb(e){e.style.transformBox='fill-box';e.style.transformOrigin='center';return e}
function vb(e,ox,oy){e.style.transformBox='view-box';e.style.transformOrigin=ox+'px '+oy+'px';return e}
function card(p,x,y,w,h,f){return el(p,'rect',{x:x,y:y,width:w,height:h,rx:8,fill:f||WH})}
function bar(p,x,y,w,f){return el(p,'rect',{x:x,y:y,width:w,height:5,rx:2.5,fill:f||GR})}
function states(s,list,D,col){/* list: [[text,from,to],...] */list.forEach(function(it,i){var t=el(s,'text',{x:20,y:184,fill:col||INK,'fill-opacity':.55,style:MONO+';font-size:9px;letter-spacing:.12em'},it[0]);
  var a=it[1],b=it[2];var fr=[[0,{opacity:a===0?1:0}]];if(a>0){fr.push([a-.02,{opacity:0}]);fr.push([a+.02,{opacity:1}])}fr.push([b-.02,{opacity:1}]);fr.push([b+.02,{opacity:0}]);fr.push([1,{opacity:i===0?1:0}]);
  if(i===0){fr=[[0,{opacity:1}],[b-.02,{opacity:1}],[b+.02,{opacity:0}],[.95,{opacity:0}],[1,{opacity:1}]]}tl(t,fr,D)})}
function fadeOut(s,bg,D){var c=el(s,'rect',{width:320,height:200,fill:bg,opacity:0});tl(c,[[0,{opacity:1}],[.03,{opacity:0}],[.92,{opacity:0}],[.975,{opacity:1}],[1,{opacity:1}]],D);return c}
function arrow(p){var g=G(p,{});var a=G(g,{});el(a,'path',{d:'M0 0V16l4.4-4 2.8 6.6 2.6-1.1-2.8-6.5H12.5Z',fill:INK,stroke:WH,'stroke-width':1.3,'stroke-linejoin':'round'});vb(a,0,0);return {g:g,a:a}}
function micro(id,bg,fn){var s=$(id);if(!s)return;s.setAttribute('viewBox','0 0 320 200');var b=el(s,'rect',{width:320,height:200,fill:bg});fn(s,b)}

/* 1 · Brand identity: a mark called "brand" is constructed, locked up with its name, then carried onto everything */
micro('mi1','#E9EEFF',function(s){var D=9000,AC='#2E5BFF',MV='cubic-bezier(.65,0,.35,1)';
  function mark(p,col,dot){var g=G(p,{});vb(g,0,0);return {g:g,s:el(g,'path',{d:'M-23 -28V28.5',fill:'none',stroke:col,'stroke-width':9}),r:el(g,'path',{d:'M-23 8A16 16 0 1 1 9 8A16 16 0 1 1 -23 8',fill:'none',stroke:col,'stroke-width':9}),d:el(g,'circle',{cx:20.5,cy:24,r:4.6,fill:dot})}}
  // three different places the brand will live: a website, a shopping bag, a t-shirt
  var ob=[];
  var c1=G(s,{}),c1i=fb(G(c1,{}));el(c1i,'rect',{x:36,y:100,width:84,height:56,rx:5,fill:WH});el(c1i,'path',{d:'M36 109V105a5 5 0 0 1 5-5h74a5 5 0 0 1 5 5v4Z',fill:GR});
  [0,1,2].forEach(function(i){el(c1i,'circle',{cx:42+i*4.5,cy:104.5,r:1.4,fill:INK,'fill-opacity':.35})});
  [0,1,2].forEach(function(i){el(c1i,'rect',{x:88+i*9,y:116,width:6,height:2.5,rx:1.25,fill:INK,'fill-opacity':.35})});el(c1i,'rect',{x:36,y:124,width:84,height:1,fill:GR});
  bar(c1i,46,133,44,INK);bar(c1i,46,142,30);el(c1i,'rect',{x:46,y:149,width:16,height:5,rx:2.5,fill:AC});ob.push([c1,c1i]);
  var c2=G(s,{}),c2i=fb(G(c2,{}));el(c2i,'path',{d:'M151 113v-6a9 9 0 0 1 18 0v6',fill:'none',stroke:INK,'stroke-width':2,'stroke-linecap':'round'});el(c2i,'path',{d:'M137 112h46l2 44h-50Z',fill:INK,stroke:INK,'stroke-width':2,'stroke-linejoin':'round'});
  el(c2i,'rect',{x:136,y:118,width:48,height:1.5,fill:'#3A3936'});el(c2i,'circle',{cx:151,cy:115,r:1.3,fill:'#3A3936'});el(c2i,'circle',{cx:169,cy:115,r:1.3,fill:'#3A3936'});ob.push([c2,c2i]);
  var c3=G(s,{}),c3i=fb(G(c3,{}));el(c3i,'path',{d:'M224 100L212 104L204 118L214 123L218 117V156H262V117L266 123L276 118L268 104L256 100Q240 111 224 100Z',fill:AC,stroke:AC,'stroke-width':2,'stroke-linejoin':'round'});ob.push([c3,c3i]);
  /* targets: x, y, scale, launch, stem colour, dot colour */
  var TG=[[47,117,.17,.56,AC,INK],[160,134,.3,.62,WH,AC],[250,119,.14,.68,WH,INK]];
  ob.forEach(function(o,n){var t=.44+n*.03,L=TG[n][3]+.07;
    tl(o[0],[[0,O(0,T(0,14))],[t,E(O(0,T(0,14)),SP)],[t+.08,O(1,T(0,0))],[1,O(1,T(0,0))]],D);
    tl(o[1],[[0,{transform:'scale(1)'}],[L,E({transform:'scale(1)'},OQ)],[L+.012,E({transform:'scale(.96)'},SP)],[L+.06,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D)});
  // construction guides: ascender, x-height, baseline, bowl, stem
  var gd=G(s,{}),gs={fill:'none',stroke:INK,'stroke-opacity':.3,'stroke-width':1,'stroke-dasharray':'2 3'};
  [39.6,65.6,113].forEach(function(y){el(gd,'line',Object.assign({x1:100,y1:y,x2:220,y2:y},gs))});el(gd,'line',Object.assign({x1:130.1,y1:28,x2:130.1,y2:124},gs));el(gd,'circle',Object.assign({cx:150.9,cy:86.4,r:20.8},gs));
  tl(gd,[[0,{opacity:0}],[.02,{opacity:0}],[.07,{opacity:1}],[.24,{opacity:1}],[.3,{opacity:0}],[1,{opacity:0}]],D);
  // the mark and its name
  var Wd=G(s,{});vb(Wd,0,0);var wt=el(Wd,'text',{x:0,y:0,fill:INK,style:FONT+';font-weight:800;font-size:30px;letter-spacing:-.05em'},'brand');var w=80;try{w=wt.getBBox().width}catch(e){}
  var tot=27.4+10+w,x0=160-tot/2,MX=x0+14.3,TX=MX+13.1+10;
  var M=G(s,{});vb(M,0,0);var Mi=mark(M,AC,INK);
  tl(M,[[0,T(160,76,1.3)],[.4,E(T(160,76,1.3),MV)],[.5,T(MX,40,.52)],[1,T(MX,40,.52)]],D);
  tl(Wd,[[0,T(160-w*.35,146,.7)],[.37,E(T(160-w*.35,146,.7),MV)],[.42,O(0,T(160-w*.35,140,.7))],[.48,E(O(0,T(TX-6,54.8,1)),OQ)],[.55,O(1,T(TX,54.8,1))],[1,O(1,T(TX,54.8,1))]],D);
  draw(Mi.s,.06,.12,D);draw(Mi.r,.11,.22,D);fb(Mi.d);tl(Mi.d,[[0,{transform:'scale(0)'}],[.21,E({transform:'scale(0)'},SP)],[.26,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  tl(wt,[[0,{clipPath:'inset(-30% 100% -30% 0)'}],[.27,E({clipPath:'inset(-30% 100% -30% 0)'},OQ)],[.35,{clipPath:'inset(-30% 0% -30% 0)'}],[1,{clipPath:'inset(-30% 0% -30% 0)'}]],D);
  var pr=[[0,{transform:'scale(1)'}]];TG.forEach(function(t){pr.push([t[3]-.008,E({transform:'scale(1)'},OQ)]);pr.push([t[3],E({transform:'scale(.92)'},SP)]);pr.push([t[3]+.025,{transform:'scale(1)'}])});pr.push([1,{transform:'scale(1)'}]);tl(Mi.g,pr,D);
  // identical copies peel off the mark and land on each touchpoint, in its colours
  TG.forEach(function(t){var g=G(s,{});vb(g,0,0);var gi=G(g,{});vb(gi,0,0);var cm=mark(gi,AC,INK);
    var mx=MX+(t[0]-MX)*.55,my=40+(t[1]-40)*.25,km=(.52+t[2])/2,st=T(MX,40,.52);
    tl(g,[[0,O(0,st)],[t[3]-.002,O(0,st)],[t[3],E(O(1,st),'cubic-bezier(.3,0,.6,1)')],[t[3]+.035,E(T(mx,my,km),OQ)],[t[3]+.07,T(t[0],t[1],t[2])],[1,T(t[0],t[1],t[2])]],D);
    tl(gi,[[0,{transform:'scale(1)'}],[t[3]+.05,E({transform:'scale(1)'},OQ)],[t[3]+.068,E({transform:'scale(1.08)'},SP)],[t[3]+.11,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
    if(t[4]!==AC)[cm.s,cm.r].forEach(function(e){tl(e,[[0,{stroke:AC}],[t[3]+.035,{stroke:AC}],[t[3]+.06,{stroke:t[4]}],[1,{stroke:t[4]}]],D)});
    if(t[5]!==INK)tl(cm.d,[[0,{fill:INK}],[t[3]+.035,{fill:INK}],[t[3]+.06,{fill:t[5]}],[1,{fill:t[5]}]],D)});
  states(s,[['SKETCH',0,.24],['MARK',.24,.5],['IDENTITY',.5,.95]],D);fadeOut(s,'#E9EEFF',D)});

/* 2 · Custom software: the terminal stays, one line builds anything. Three takes: in 3D, vision, voice (the game is a spare take) */
micro('mi2','#FFEDE6',function(s){var D=22500,AC='#FF6A3D',BGc='#FFEDE6',PE='#FFD3C2',TX='#F4F1EC',DIM='#8C887F';
  function A(k,u){return (k+u)/3}
  // the terminal never leaves
  el(s,'rect',{x:24,y:50,width:150,height:100,rx:10,fill:INK});[0,1,2].forEach(function(i){el(s,'circle',{cx:38+i*9,cy:62,r:3,fill:i===0?AC:'#3A3936'})});
  el(s,'text',{x:162,y:64.5,'text-anchor':'end',fill:'#6E6A63',style:MONO+';font-size:7px;letter-spacing:.04em'},'~/mother-machine');
  el(s,'rect',{x:24,y:72,width:150,height:1,fill:'#2A2927'});
  el(s,'text',{x:38,y:92,fill:AC,style:MONO+';font-size:13px'},'$');
  /* one clock for everything: terminal, cursor, label and objects are all drawn in the same frame */
  function xo(q){var a=sg(q,.9,.965);return 1-a*a*(3-2*a)}
  function sm(x){return x*x*(3-2*x)}
  var TK=[['in 3D ↵','0.84s','IT BUILDS'],['vision ↵','1.12s','IT SEES'],['voice ↵','0.42s','IT LISTENS']];
  function term(){var g=G(s,{}),o={g:g,l1:el(g,'text',{x:50,y:92,fill:TX,style:MONO+';font-size:13px'},''),l2:el(g,'text',{x:38,y:110,fill:DIM,style:MONO+';font-size:11px'},''),cells:[],fills:[]};
    for(var i=0;i<12;i++){o.cells.push(el(g,'rect',{x:38+i*7,y:124,width:5,height:6,rx:1,fill:'#3A3936'}));o.fills.push(el(g,'rect',{x:38+i*7,y:124,width:5,height:6,rx:1,fill:AC}))}
    o.ok=el(g,'text',{x:126,y:130,fill:DIM,style:MONO+';font-size:8px'});el(o.ok,'tspan',{fill:AC},'OK ');o.o2=el(o.ok,'tspan',{},'');return o}
  var TA=term(),TB=term(),cr=el(s,'rect',{x:0,y:0,width:7,height:13,fill:AC}),lab=el(s,'text',{x:20,y:184,fill:INK,'fill-opacity':.55,style:MONO+';font-size:9px;letter-spacing:.12em'},'');
  /* take timeline (u from 0 to 1, 7.5 s): old text leaves 0-.035, type .03-.15, argument .15-.2, enter at .2, progress .21-.28, result from .22 */
  function paint(o,k,u){var tk=TK[k],n1=Math.floor(13*sg(u,.03,.15)+1e-6),n2=Math.floor(tk[0].length*sg(u,.15,.2)+1e-6),nf=Math.floor(12*sg(u,.21,.28)+1e-6);
    o.l1.textContent='machine build'.slice(0,n1);o.l2.textContent=tk[0].slice(0,n2);
    o.cells.forEach(function(c){c.setAttribute('opacity',u>=.2?1:0)});o.fills.forEach(function(f,i){f.setAttribute('opacity',i<nf?1:0)});
    o.o2.textContent=tk[1];o.ok.setAttribute('opacity',u>=.285?1:0);return {n1:n1,n2:n2}}
  // take one: the cube (unchanged)
  var cg=G(s,{}),V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],EDG=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  var FC=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];
  var faces=FC.map(function(){return el(cg,'path',{d:'',fill:WH,stroke:'none'})}),edges=EDG.map(function(){return el(cg,'line',{stroke:INK,'stroke-width':2.5,'stroke-linecap':'round'})});
  // take two: a tiny platform game
  var gg=G(s,{opacity:0,transform:'translate(244 100) scale(1.12) translate(-244 -100)'});
  var gnd=el(gg,'line',{x1:188,y1:142,x2:188,y2:142,stroke:INK,'stroke-width':2.5,'stroke-linecap':'round'});
  var pA=el(gg,'rect',{x:214,y:116,width:26,height:8,rx:2,fill:WH,stroke:INK,'stroke-width':2.5}),pB=el(gg,'rect',{x:248,y:92,width:26,height:8,rx:2,fill:WH,stroke:INK,'stroke-width':2.5});
  var coin=G(gg,{});el(coin,'circle',{cx:0,cy:0,r:5.5,fill:PE,stroke:INK,'stroke-width':2});el(coin,'rect',{x:-.9,y:-2.6,width:1.8,height:5.2,rx:.9,fill:INK});
  var sc0=el(gg,'text',{x:190,y:44,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'SCORE 0'),sc1=el(gg,'text',{x:190,y:44,fill:INK,style:MONO+';font-size:9px;letter-spacing:.12em'},'SCORE 1');
  var plus=el(gg,'text',{x:0,y:0,'text-anchor':'middle',fill:AC,style:MONO+';font-size:10px;font-weight:700'},'+1');
  var hero=G(gg,{});el(hero,'rect',{x:-7,y:-7,width:14,height:14,rx:3,fill:AC});el(hero,'rect',{x:1.4,y:-3.6,width:2.6,height:2.6,rx:.6,fill:INK});
  function cl(x){return x<0?0:x>1?1:x}function sg(q,a,b){return cl((q-a)/(b-a))}function eo(t){return 1-Math.pow(1-t,3)}function eb(t){var c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)}
  function pop(e,cx,cy,k){e.setAttribute('transform','translate('+cx+' '+cy+') scale('+k.toFixed(3)+') translate('+(-cx)+' '+(-cy)+')')}
  var J=[[.64,.70,198,134,227,108,22],[.73,.79,227,108,261,84,22],[.82,.88,261,84,290,134,45]],LAND=[.58,.70,.79,.88],TC=.82+.06*.361;
  function game(q){gg.setAttribute('opacity',xo(q).toFixed(3));
    gnd.setAttribute('x2',(188+110*eo(sg(q,.36,.46))).toFixed(1));gnd.setAttribute('opacity',q>.36?1:0);
    pop(pA,227,120,eb(sg(q,.42,.5)));pop(pB,261,96,eb(sg(q,.45,.53)));
    var ck=eb(sg(q,.48,.56)),cy=60+Math.sin(q*60)*1.5,got=q>TC?sg(q,TC,TC+.03):0;
    coin.setAttribute('transform','translate(272 '+cy.toFixed(2)+') scale('+(ck*(1+got*.6)).toFixed(3)+')');coin.setAttribute('opacity',(1-got).toFixed(3));
    var sv=sg(q,.44,.48);sc0.setAttribute('opacity',(q<TC?sv:0).toFixed(3));sc1.setAttribute('opacity',q<TC?0:1);pop(sc1,190,41,q<TC?1:1+.15*(1-eo(sg(q,TC,TC+.05))));
    var pf=q>TC?sg(q,TC,TC+.07):0;plus.setAttribute('x',272);plus.setAttribute('y',(50-16*eo(pf)).toFixed(1));plus.setAttribute('opacity',q>TC?(1-pf).toFixed(3):0);
    var x=198,y=134,sx=1,sy=1,vis=q>=.52?1:0;
    if(q<.57){var t=sg(q,.52,.57);y=40+94*t*t;sx=.9;sy=1.12}
    J.forEach(function(j){if(q>=j[1])x=j[4],y=j[5];if(q>=j[0]&&q<j[1]){var t=(q-j[0])/(j[1]-j[0]);x=j[2]+(j[4]-j[2])*t;y=j[3]+(j[5]-j[3])*t-4*j[6]*t*(1-t);sx=.92;sy=1.1}
      if(q>=j[0]-.02&&q<j[0]){var a=(q-(j[0]-.02))/.02;sx=1+.15*a;sy=1-.15*a}});
    LAND.forEach(function(L){if(q>=L&&q<L+.03){var a=1-(q-L)/.03;sx=1+.25*a;sy=1-.25*a}});
    hero.setAttribute('opacity',vis);hero.setAttribute('transform','translate('+x.toFixed(1)+' '+(y+7).toFixed(1)+') scale('+sx.toFixed(3)+' '+sy.toFixed(3)+') translate(0 -7)')}
  // take two: computer vision, it finds and counts what is in a photo
  var vg=G(s,{opacity:0}),vc=el(s,'clipPath',{id:'mi2v'});el(vc,'rect',{x:182,y:58,width:116,height:84,rx:8});
  var vcard=el(vg,'rect',{x:182,y:58,width:116,height:84,rx:8,fill:WH}),ph=G(vg,{});
  el(ph,'rect',{x:203,y:89,width:6,height:10,fill:WH,stroke:INK,'stroke-width':2});el(ph,'rect',{x:202,y:85,width:8,height:4.5,rx:1,fill:INK});el(ph,'rect',{x:199,y:97,width:14,height:31,rx:4,fill:WH,stroke:INK,'stroke-width':2});el(ph,'rect',{x:200,y:108,width:12,height:9,fill:AC});
  el(ph,'rect',{x:227,y:104,width:26,height:24,rx:2,fill:PE,stroke:INK,'stroke-width':2});el(ph,'line',{x1:227,y1:111,x2:253,y2:111,stroke:INK,'stroke-width':1.5});el(ph,'rect',{x:237,y:104,width:6,height:7,fill:'#FFB79E'});el(ph,'rect',{x:227,y:104,width:26,height:24,rx:2,fill:'none',stroke:INK,'stroke-width':2});
  el(ph,'path',{d:'M266 104q-2.2-3 0-6M272 104q-2.2-3 0-6',fill:'none',stroke:INK,'stroke-opacity':.35,'stroke-width':1.5,'stroke-linecap':'round'});
  el(ph,'path',{d:'M279 114.5h2.5a4.5 4.5 0 0 1 0 9H279',fill:'none',stroke:INK,'stroke-width':2});el(ph,'path',{d:'M261 110h18v13a5 5 0 0 1-5 5h-8a5 5 0 0 1-5-5Z',fill:AC,stroke:INK,'stroke-width':2,'stroke-linejoin':'round'});
  el(ph,'line',{x1:190,y1:128,x2:290,y2:128,stroke:INK,'stroke-width':2,'stroke-linecap':'round'});
  var scan=G(vg,{'clip-path':'url(#mi2v)'}),band=el(scan,'rect',{x:182,y:0,width:116,height:18,fill:AC,'fill-opacity':.14}),sl=el(scan,'rect',{x:182,y:0,width:116,height:1.5,fill:AC});
  var BX=[[197,82,18,48,40,'bottle 95%',.5],[224,101,32,29,34,'box 98%',.55],[258,95,31,35,30,'cup 97%',.6]].map(function(b){var g=G(vg,{});el(g,'rect',{x:b[0],y:b[1],width:b[2],height:b[3],rx:2,fill:AC,'fill-opacity':.07,stroke:AC,'stroke-width':1.5});
    var tg=G(g,{}),tr=el(tg,'rect',{x:b[0]-.75,y:b[1]-9,width:b[4],height:9,rx:1.5,fill:AC}),tx=el(tg,'text',{x:b[0]+2.5,y:b[1]-2.5,fill:WH,style:MONO+';font-size:6px'},b[5]);try{tr.setAttribute('width',(tx.getBBox().width+6).toFixed(1))}catch(e){}return {g:g,tg:tg,b:b}});
  var cnt=el(vg,'text',{x:184,y:44,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'DETECTED 0');
  function vision(q,al){vg.setAttribute('opacity',al.toFixed(3));
    var ck=eb(sg(q,.3,.37)),co=sg(q,.3,.33);pop(vcard,240,100,ck);pop(ph,240,100,ck);vcard.setAttribute('opacity',co);ph.setAttribute('opacity',co);
    var sv=sg(q,.38,.49),y=58+86*sv;sl.setAttribute('y',y.toFixed(1));band.setAttribute('y',(y-18).toFixed(1));scan.setAttribute('opacity',q>.38&&q<.5?1:0);
    var n=0;BX.forEach(function(o){var a=sg(q,o.b[6],o.b[6]+.04);if(q>=o.b[6])n++;o.g.setAttribute('opacity',Math.min(1,a*3).toFixed(3));pop(o.g,o.b[0]+o.b[2]/2,o.b[1]+o.b[3]/2,1.2-.2*eo(a));o.tg.setAttribute('opacity',sg(q,o.b[6]+.02,o.b[6]+.05).toFixed(3))});
    cnt.textContent='DETECTED '+n;cnt.setAttribute('opacity',sg(q,.36,.4).toFixed(3))}
  // take three: voice, it listens and then it acts
  var wg=G(s,{opacity:0}),wcard=el(wg,'rect',{x:182,y:58,width:116,height:84,rx:8,fill:WH}),wi=G(wg,{});
  var ring=el(wi,'circle',{cx:198,cy:80,r:8,fill:'none',stroke:AC,'stroke-width':1.5}),mic=G(wi,{});el(mic,'circle',{cx:198,cy:80,r:8,fill:AC});el(mic,'rect',{x:196,y:75,width:4,height:7,rx:2,fill:WH});el(mic,'path',{d:'M194.5 80.5a3.5 3.5 0 0 0 7 0M198 84v2',fill:'none',stroke:WH,'stroke-width':1.2,'stroke-linecap':'round'});
  var NB=18,bars=[];for(var i=0;i<NB;i++)bars.push(el(wi,'rect',{x:213+i*4.3,y:79,width:2.6,height:2,rx:1.3,fill:INK}));
  var SAY='"table for 4, friday 8pm"',said=el(wi,'text',{x:190,y:104,fill:INK,style:MONO+';font-size:6.6px'},'');
  var chip=G(wg,{});el(chip,'rect',{x:190,y:112,width:100,height:22,rx:6,fill:PE});el(chip,'rect',{x:197,y:117,width:12,height:12,rx:2,fill:WH,stroke:INK,'stroke-width':1.5});el(chip,'rect',{x:197,y:117,width:12,height:3.5,rx:1,fill:INK});
  el(chip,'text',{x:215,y:122.5,fill:INK,style:MONO+';font-size:7px;letter-spacing:.06em'},'FRI · 20:00');el(chip,'text',{x:215,y:130.5,fill:INK,'fill-opacity':.6,style:FONT+';font-size:7px;font-weight:600'},'Table for 4');
  var chk=G(wg,{});el(chk,'circle',{cx:278,cy:123,r:6,fill:AC});el(chk,'path',{d:'M275.3 123.2l1.9 1.9 3.6-3.8',fill:'none',stroke:WH,'stroke-width':1.6,'stroke-linecap':'round','stroke-linejoin':'round'});
  var wst=el(wg,'text',{x:184,y:44,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'');
  function voice(q,al){wg.setAttribute('opacity',al.toFixed(3));
    var ck=eb(sg(q,.3,.37)),co=sg(q,.3,.33);pop(wcard,240,100,ck);pop(wi,240,100,ck);wcard.setAttribute('opacity',co);wi.setAttribute('opacity',co);
    var amp=sg(q,.37,.41)*(1-sg(q,.56,.6));
    bars.forEach(function(b,i){var bell=.45+.55*Math.sin(Math.PI*i/(NB-1)),n=Math.abs(Math.sin(i*1.7+q*95+Math.sin(i*.9+q*43)*2)),h=2+amp*bell*(.3+.7*n)*20;b.setAttribute('y',(80-h/2).toFixed(2));b.setAttribute('height',h.toFixed(2))});
    var pr=(q*12)%1,lis=q>.37&&q<.6;ring.setAttribute('r',(8+7*pr).toFixed(2));ring.setAttribute('opacity',lis?(1-pr)*.8:0);
    said.textContent=SAY.slice(0,Math.round(SAY.length*sg(q,.42,.58)));
    var c=sg(q,.61,.67);chip.setAttribute('opacity',c.toFixed(3));chip.setAttribute('transform','translate(0 '+(8*(1-eo(c))).toFixed(2)+')');
    pop(chk,278,123,eb(sg(q,.67,.72)));chk.setAttribute('opacity',q>.67?1:0);
    wst.textContent=q<.6?'LISTENING':'BOOKED';wst.setAttribute('opacity',(q<.6?sg(q,.36,.4)*(.55+.45*Math.abs(Math.cos(q*40))):sg(q,.6,.63)).toFixed(3))}
  var t0=performance.now();
  function frame(now){var P=(window.__mmP!=null)?window.__mmP:((((now-t0)%D)+D)%D/D);if(reduce&&window.__mmP==null)P=.8/3;
    var k=Math.max(0,Math.min(2,Math.floor(P*3))),u=P*3-k,pk=(k+2)%3,tsec=u*D/3000;
    // terminal: the last command scrolls away, the new one is typed
    var x=sm(sg(u,0,.035));paint(TB,pk,2);TB.g.setAttribute('opacity',(1-x).toFixed(3));TB.g.setAttribute('transform','translate(0 '+(-10*x).toFixed(2)+')');
    var st=paint(TA,k,u),cx,cy;if(u<.15){cx=51+(st.n1?TA.l1.getComputedTextLength():0);cy=81}else{cx=39+(st.n2?TA.l2.getComputedTextLength():0);cy=99}
    var blink=Math.floor(tsec/.45)%2===0,typing=u>=.03&&u<.2;cr.setAttribute('transform','translate('+cx.toFixed(1)+' '+cy+')');cr.setAttribute('opacity',(u<.035||u>=.27)?0:(typing||blink?1:0));
    // state label
    var d=Math.min(Math.abs(u-.2),u,1-u);lab.textContent=u<.2?'WRITING CODE':TK[k][2];lab.setAttribute('opacity',Math.min(1,d/.012).toFixed(3));
    // objects: the last result stays until enter is pressed, then hands over to the new one
    cg.setAttribute('opacity',0);vg.setAttribute('opacity',0);gg.setAttribute('opacity',0);wg.setAttribute('opacity',0);
    var TK3=[cube,vision,voice],GR3=[cg,vg,wg],pa=1-sm(sg(u,.2,.25));GR3.forEach(function(g){g.removeAttribute('transform')});
    if(pa>0){TK3[pk](1.08+u,pa);GR3[pk].setAttribute('transform','translate(240 100) scale('+(1-.05*(1-pa)).toFixed(4)+') translate(-240 -100)')}
    TK3[k](u+.08,1);/* game(u) is a spare take */
    if(!reduce||window.__mmP!=null)requestAnimationFrame(frame)}
  function cube(p,al){
    var a=(p*Math.PI*2*1.5)+.6,tx=.55,cx=240,cy=100,S=30;
    var P=V.map(function(v){var x=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=-v[0]*Math.sin(a)+v[2]*Math.cos(a),y=v[1];var y2=y*Math.cos(tx)-z*Math.sin(tx),z2=y*Math.sin(tx)+z*Math.cos(tx);return [cx+x*S,cy+y2*S,z2]});
    var draw=Math.max(0,Math.min(1,(p-.32)/.16)),fill=Math.max(0,Math.min(1,(p-.5)/.08)),out=al,inn=p<.3?0:1;
    cg.setAttribute('opacity',(inn*out).toFixed(3));
    EDG.forEach(function(e,i){var A=P[e[0]],B=P[e[1]];var k=Math.max(0,Math.min(1,draw*12-i));var L=edges[i];L.setAttribute('x1',A[0]);L.setAttribute('y1',A[1]);L.setAttribute('x2',A[0]+(B[0]-A[0])*k);L.setAttribute('y2',A[1]+(B[1]-A[1])*k);L.setAttribute('opacity',k>0?1:0)});
    var order=FC.map(function(f,i){var z=f.reduce(function(s,j){return s+P[j][2]},0)/4;return [z,i]}).sort(function(m,n){return n[0]-m[0]});
    order.forEach(function(o,rank){var f=FC[o[1]],pt=f.map(function(j){return P[j][0].toFixed(1)+' '+P[j][1].toFixed(1)});var el2=faces[o[1]];el2.setAttribute('d','M'+pt.join('L')+'Z');
      var col=o[1]===2||o[1]===3?AC:(o[1]===0||o[1]===1?PE:WH);el2.setAttribute('fill',col);el2.setAttribute('opacity',(fill*(rank>=3?1:0)).toFixed(3));cg.appendChild(el2)});
    var vis={};order.forEach(function(o,rank){if(rank>=3){var f=FC[o[1]];for(var q=0;q<4;q++){var u=f[q],w=f[(q+1)%4];vis[Math.min(u,w)+'-'+Math.max(u,w)]=1}}});
    EDG.forEach(function(e,i){var key=Math.min(e[0],e[1])+'-'+Math.max(e[0],e[1]);if(!vis[key]){var L=edges[i];var cur=parseFloat(L.getAttribute('opacity'))||0;L.setAttribute('opacity',(cur*(1-fill)).toFixed(3))}});
    edges.forEach(function(L){cg.appendChild(L)})}
  requestAnimationFrame(frame);
});

/* 3 · Apps: wireframe, design, live */
micro('mi3','#E4F4EC',function(s){var D=8000,AC='#1F9D6B';
  el(s,'rect',{x:124,y:24,width:72,height:152,rx:15,fill:INK});el(s,'rect',{x:129,y:29,width:62,height:142,rx:11,fill:WH});el(s,'rect',{x:150,y:33,width:20,height:4,rx:2,fill:INK});
  var parts=[[135,46,50,10,'#CDEBDC'],[135,62,50,40,AC],[135,110,40,5,GR],[135,119,28,5,GR],[135,146,50,16,INK]];
  parts.forEach(function(p,i){var r=el(s,'rect',{x:p[0],y:p[1],width:p[2],height:p[3],rx:p[3]>8?4:2.5,fill:p[4],stroke:INK,'stroke-width':1.2,'stroke-dasharray':'3 3'});
    tl(r,[[0,{opacity:0,fillOpacity:0,strokeOpacity:.45}],[.04+i*.035,{opacity:0}],[.08+i*.035,{opacity:1}],[.3+i*.02,E({fillOpacity:0,strokeOpacity:.45},OQ)],[.38+i*.02,{fillOpacity:1,strokeOpacity:0}],[1,{opacity:1,fillOpacity:1,strokeOpacity:0}]],D)});
  var sun=fb(el(s,'circle',{cx:170,cy:76,r:7,fill:WH}));tl(sun,[[0,O(0,{transform:'scale(0)'})],[.4,E(O(0,{transform:'scale(0)'}),SP)],[.46,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  var hill=el(s,'path',{d:'M135 102l16-16 12 10 8-6 14 12Z',fill:'#16835A'});tl(hill,[[0,{opacity:0}],[.38,{opacity:0}],[.44,{opacity:1}],[1,{opacity:1}]],D);
  var bt=el(s,'text',{x:160,y:157,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:700;font-size:8px'},'Book');tl(bt,[[0,{opacity:0}],[.44,{opacity:0}],[.48,{opacity:1}],[1,{opacity:1}]],D);
  var f=fb(el(s,'circle',{cx:160,cy:154,r:9,fill:'rgba(18,18,17,.22)',stroke:WH,'stroke-width':1.5}));
  tl(f,[[0,O(0,{transform:'scale(1.5)'})],[.52,E(O(0,{transform:'scale(1.5)'}),OQ)],[.57,O(1,{transform:'scale(1)'})],[.6,O(1,{transform:'scale(.82)'})],[.65,O(0,{transform:'scale(.82)'})],[1,O(0,{transform:'scale(1.5)'})]],D);
  var ok=fb(G(s,{}));el(ok,'circle',{cx:198,cy:44,r:13,fill:AC});el(ok,'path',{d:'M192 44l4.5 4.5 8-9',fill:'none',stroke:WH,'stroke-width':3});
  tl(ok,[[0,O(0,{transform:'scale(0)'})],[.6,E(O(0,{transform:'scale(0)'}),SP)],[.67,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  states(s,[['WIREFRAME',0,.3],['DESIGN',.3,.58],['LIVE',.58,.95]],D);fadeOut(s,'#E4F4EC',D)});

/* 4 · Systems: four apps passing data by hand become one simple tool */
micro('mi4','#EEEAFF',function(s){var D=9000,AC='#6B4EFF';
  var P=[[80,58,'XLS','#3F8F63'],[240,58,'MAIL','#3E6BD6'],[80,142,'CAL','#E08A2E'],[240,142,'INV','#9A6BD8']];
  var W=[[0,1,'M97 58C140 30 180 86 223 58'],[2,3,'M97 142C140 170 180 114 223 142'],[0,3,'M94 70C150 96 170 104 226 130'],[1,2,'M226 70C170 96 150 104 94 130']];
  var wires=G(s,{});W.forEach(function(w,i){var p=el(wires,'path',{d:w[2],fill:'none',stroke:INK,'stroke-width':1.5,'stroke-opacity':.3,'stroke-dasharray':'2 4'});
    for(var k=0;k<2;k++){var d=el(wires,'rect',{x:-3,y:-3,width:6,height:6,rx:1.5,fill:P[w[k?1:0]][3]});d.style.offsetPath="path('"+w[2]+"')";d.style.offsetRotate='0deg';
      var st=k?'100%':'0%',en=k?'0%':'100%',o=(i*.025+k*.07);tl(d,[[0,{offsetDistance:st,opacity:0}],[o,E({offsetDistance:st,opacity:1},LIN)],[o+.2,{offsetDistance:en,opacity:1}],[o+.21,{offsetDistance:en,opacity:0}],[1,{offsetDistance:en,opacity:0}]],D)}});
  tl(wires,[[0,{opacity:1}],[.26,E({opacity:1},EZ)],[.34,{opacity:0}],[.95,{opacity:0}],[1,{opacity:1}]],D);
  var one=fb(G(s,{}));card(one,106,58,108,86);el(one,'rect',{x:106,y:58,width:108,height:16,rx:8,fill:AC});el(one,'rect',{x:106,y:66,width:108,height:8,fill:AC});el(one,'circle',{cx:116,cy:66,r:2.6,fill:WH});bar(one,124,63.5,30,'rgba(255,255,255,.7)');
  tl(one,[[0,O(0,{transform:'scale(.15)'})],[.32,E(O(0,{transform:'scale(.15)'}),OQ)],[.46,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  P.forEach(function(p,i){var ry=84+i*14,tx=121,dx=tx-p[0],dy=ry+2.5-p[1];
    var g=fb(G(s,{}));el(g,'rect',{x:p[0]-17,y:p[1]-17,width:34,height:34,rx:9,fill:p[3]});var tt=el(g,'text',{x:p[0],y:p[1]+3,'text-anchor':'middle',fill:WH,style:MONO+';font-size:7.5px;letter-spacing:.04em'},p[2]);
    tl(g,[[0,O(1,{transform:'translate(0px,0px) scale(1) rotate(0deg)'})],[.06,{transform:'translate(0px,-2px) scale(1) rotate(-3deg)'}],[.12,{transform:'translate(0px,0px) scale(1) rotate(2deg)'}],[.18,{transform:'translate(0px,-1px) scale(1) rotate(-1deg)'}],[.24,{transform:'translate(0px,0px) scale(1) rotate(0deg)'}],
      [.3+i*.03,E({transform:'translate(0px,0px) scale(1) rotate(0deg)'},'cubic-bezier(.65,0,.35,1)')],[.46+i*.03,{transform:'translate('+dx+'px,'+dy+'px) scale(.29) rotate(0deg)'}],[.95,O(1,{transform:'translate('+dx+'px,'+dy+'px) scale(.29) rotate(0deg)'})],[.97,O(0,{transform:'translate('+dx+'px,'+dy+'px) scale(.29) rotate(0deg)'})],[1,O(0,{transform:'translate(0px,0px) scale(1) rotate(0deg)'})]],D);
    tl(tt,[[0,{opacity:1}],[.32+i*.03,{opacity:1}],[.38+i*.03,{opacity:0}],[.97,{opacity:0}],[1,{opacity:1}]],D);
    var lb=el(s,'text',{x:130,y:ry+5,fill:INK,style:MONO+';font-size:6.5px;letter-spacing:.06em'},p[2]);var rb=el(s,'rect',{x:152,y:ry+.5,width:i%2?30:40,height:5,rx:2.5,fill:GR});var sd=fb(el(s,'circle',{cx:202,cy:ry+3,r:3.4,fill:AC}));
    [lb,rb].forEach(function(e){tl(e,[[0,O(0,T(-6,0))],[.47+i*.03,E(O(0,T(-6,0)),OQ)],[.53+i*.03,O(1,T(0,0))],[1,O(1,T(0,0))]],D)});
    tl(sd,[[0,O(0,{transform:'scale(0)'})],[.6+i*.04,E(O(0,{transform:'scale(0)'}),SP)],[.65+i*.04,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D)});
  states(s,[['MANY TOOLS',0,.4],['ONE SYSTEM',.4,.95]],D);fadeOut(s,'#EEEAFF',D)});

/* 5 · Ecommerce: add, it flies to the cart, sales go up */
micro('mi5','#FDEBEC',function(s){var D=8000,AC='#E5484D';
  card(s,36,40,96,124);el(s,'rect',{x:44,y:48,width:80,height:62,rx:5,fill:'#F8D5D6'});el(s,'circle',{cx:84,cy:79,r:17,fill:AC});bar(s,44,118,52,INK);bar(s,44,127,30);
  var btn=fb(G(s,{}));var bR=el(btn,'rect',{x:44,y:140,width:80,height:16,rx:8,fill:INK});var t1=el(btn,'text',{x:84,y:151,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:700;font-size:8px'},'Add to cart');var t2=el(btn,'text',{x:84,y:151,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:700;font-size:8px'},'Added');
  tl(btn,[[0,{transform:'scale(1)'}],[.2,E({transform:'scale(1)'},OQ)],[.215,{transform:'scale(.94)'}],[.25,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  tl(bR,[[0,{fill:INK}],[.21,{fill:INK}],[.23,{fill:AC}],[1,{fill:AC}]],D);tl(t1,[[0,{opacity:1}],[.21,{opacity:1}],[.23,{opacity:0}],[1,{opacity:0}]],D);tl(t2,[[0,{opacity:0}],[.21,{opacity:0}],[.23,{opacity:1}],[1,{opacity:1}]],D);
  var cart=fb(G(s,{}));el(cart,'path',{d:'M230 38h6l7 24h26l6-18h-35',fill:'none',stroke:INK,'stroke-width':3,'stroke-linejoin':'miter'});el(cart,'circle',{cx:247,cy:69,r:3,fill:INK});el(cart,'circle',{cx:265,cy:69,r:3,fill:INK});
  tl(cart,[[0,{transform:'scale(1)'}],[.36,E({transform:'scale(1)'},SP)],[.4,{transform:'scale(1.15)'}],[.46,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  var bd=fb(G(s,{}));el(bd,'circle',{cx:276,cy:38,r:8,fill:AC});el(bd,'text',{x:276,y:41.5,'text-anchor':'middle',fill:WH,style:FONT+';font-weight:800;font-size:9px'},'1');
  tl(bd,[[0,O(0,{transform:'scale(0)'})],[.37,E(O(0,{transform:'scale(0)'}),SP)],[.43,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  var fl=el(s,'circle',{cx:0,cy:0,r:9,fill:AC});tl(fl,[[0,O(0,T(84,79))],[.22,E(O(1,T(84,79)),'cubic-bezier(.3,0,.7,1)')],[.3,T(170,22,.75)],[.37,E(T(256,52,.4),IQ)],[.38,O(0,T(256,52,.4))],[1,O(0,T(256,52,.4))]],D);
  card(s,178,92,108,72);el(s,'text',{x:188,y:108,fill:INK,'fill-opacity':.5,style:MONO+';font-size:7px;letter-spacing:.1em'},'SALES');
  el(s,'polyline',{points:'188,150 204,144 220,147 236,136 252,139',fill:'none',stroke:INK,'stroke-width':2.5,'stroke-linejoin':'round','stroke-linecap':'round'});
  var up=el(s,'path',{d:'M252 139L272 118',fill:'none',stroke:AC,'stroke-width':2.5,'stroke-linecap':'round'});draw(up,.46,.56,D);
  var pt=fb(el(s,'circle',{cx:272,cy:118,r:4.5,fill:AC}));tl(pt,[[0,O(0,{transform:'scale(0)'})],[.55,E(O(0,{transform:'scale(0)'}),SP)],[.6,O(1,{transform:'scale(1)'})],[1,O(1,{transform:'scale(1)'})]],D);
  var c=arrow(s);tl(c.g,[[0,O(0,T(150,190))],[.05,E(O(1,T(150,190)),OQ)],[.17,T(98,150)],[.2,T(98,150)],[.28,E(T(98,150),IQ)],[.36,O(0,T(150,190))],[1,O(0,T(150,190))]],D);
  tl(c.a,[[0,{transform:'scale(1)'}],[.205,{transform:'scale(1)'}],[.215,{transform:'scale(.8)'}],[.235,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]],D);
  states(s,[['VISIT',0,.22],['ORDER',.22,.95]],D);fadeOut(s,'#FDEBEC',D)});

/* 6 · Automation: the night does the work */
micro('mi6','#141B33',function(s,bg){var D=8500,AC='#F5B700',NI='#141B33',DAY='#FFF1D6';
  tl(bg,[[0,{fill:NI}],[.42,{fill:NI}],[.55,{fill:'#4A3F7A'}],[.62,{fill:'#F6B38A'}],[.74,{fill:DAY}],[.92,{fill:DAY}],[1,{fill:NI}]],D);
  var LT='#E9E6F5',SW=[[0,LT],[.565,LT],[.6,INK],[.92,INK],[1,LT]];var hz=el(s,'rect',{x:40,y:121,width:240,height:2.5,rx:1.25,fill:LT});tl(hz,SW.map(function(k){return [k[0],{fill:k[1]}]}),D);
  var skc=el(s,'clipPath',{id:'mi6sky'});el(skc,'rect',{x:0,y:0,width:320,height:121});var sky=G(s,{'clip-path':'url(#mi6sky)'});var body=G(sky,{});var sun=el(body,'circle',{cx:0,cy:0,r:12,fill:'#E9E6F5'});var cut=el(body,'circle',{cx:6,cy:-5,r:10,fill:NI});
  var N=10,kf=[[0,E(T(68,142),OQ)]];for(var i=0;i<=N;i++){var a=Math.PI*(1-i/N);kf.push([.05+i*(.74/N),E(T(160+Math.cos(a)*92,118-Math.sin(a)*80),LIN)])}
  kf.push([.84,E(T(252,118),IQ)]);kf.push([.9,T(252,142)]);kf.push([1,T(252,142)]);tl(body,kf,D);
  tl(sun,[[0,{fill:'#E9E6F5'}],[.4,{fill:'#E9E6F5'}],[.5,{fill:AC}],[.95,{fill:AC}],[1,{fill:'#E9E6F5'}]],D);
  tl(cut,[[0,{fill:NI}],[.42,{fill:NI}],[.55,{fill:'#4A3F7A'}],[.62,{fill:'#F6B38A'}],[1,{fill:NI}]],D);tl(cut,[[0,{opacity:1,transform:'translate(0px,0px)'}],[.4,E({opacity:1,transform:'translate(0px,0px)'},OQ)],[.5,{opacity:1,transform:'translate(15px,-13px)'}],[.53,{opacity:0,transform:'translate(15px,-13px)'}],[.97,{opacity:0,transform:'translate(0px,0px)'}],[1,{opacity:1,transform:'translate(0px,0px)'}]],D);
  [0,1,2].forEach(function(i){var x=126+i*26,y=144,t=.22+i*.18;var bx=el(s,'rect',{x:x,y:y,width:16,height:16,rx:3,fill:LT,'fill-opacity':.14,stroke:LT,'stroke-width':2.5});
    tl(bx,SW.map(function(k){return [k[0],{stroke:k[1],fill:k[1]}]}),D);
    var f=fb(G(s,{}));el(f,'rect',{x:x,y:y,width:16,height:16,rx:3,fill:AC});el(f,'path',{d:'M'+(x+4)+' '+(y+8)+'l3 3 6-6',fill:'none',stroke:INK,'stroke-width':2.5});
    tl(f,[[0,O(0,{transform:'scale(0)'})],[t,E(O(0,{transform:'scale(0)'}),SP)],[t+.06,O(1,{transform:'scale(1)'})],[.9,O(1,{transform:'scale(1)'})],[.95,O(0,{transform:'scale(.6)'})],[1,O(0,{transform:'scale(0)'})]],D)});
  var a1=el(s,'text',{x:20,y:184,fill:'#E9E6F5','fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'02:00 · NOBODY AWAKE');var a2=el(s,'text',{x:20,y:184,fill:INK,'fill-opacity':.6,style:MONO+';font-size:9px;letter-spacing:.12em'},'07:00 · ALL DONE');
  tl(a1,[[0,{opacity:1}],[.555,{opacity:1}],[.585,{opacity:0}],[.95,{opacity:0}],[1,{opacity:1}]],D);tl(a2,[[0,{opacity:0}],[.6,{opacity:0}],[.64,{opacity:1}],[.9,{opacity:1}],[.94,{opacity:0}],[1,{opacity:0}]],D)});

if(reduce)ANIMS.forEach(function(x){x[0].pause();x[0].currentTime=x[1]*0.88});
});

/* ---------- LG: the passage to The Lab ---------- */
(function(){var sx=$('sx');if(!sx)return;
  var hatch=$('sxHatch'),seam=$('sxSeam'),cmp=$('sxCmp'),c1=$('sxC1'),c2=$('sxC2'),ph=$('sxPh'),bar=$('sxBar'),msg=$('sxMsg'),wall=$('sxWall'),back=$('sxBack'),cor=$('sxCor'),flash=$('sxFlash');
  var S0=$('sxS0'),SC=$('sxSC'),S3=$('sxS3'),st='idle',timers=[],k1=false,k2=false,win=null;
  function later(f,ms){var t=setTimeout(f,reduce?Math.min(ms,60):ms);timers.push(t);return t}
  function only(s){[S0,SC,S3].forEach(function(x){x.classList.toggle('on',x===s)})}
  /* 1 · the same lift as everywhere; at LG three quick turns of the key make it a keypad */
  var lift=Lift($('sxLift'),SITEF,{key:true,atLG:function(){return st==='idle'},secret:{code:['04','02','05','01'],onUnlock:function(){unlock()}},
    onPick:function(k){if(st!=='idle')return;lift.call(k);lift.show(two(+k),SITE[k][0]);later(function(){lift.clear();lift.show('LG','Machine Room')},900)},onKey:function(){}});
  lift.key(true);lift.show('LG','Machine Room');
  function L(t){lift.show('LG',t)}
  /* 2 · the seams light up, a piece of the page comes away */
  function unlock(){st='open';var R=lift.el;R.classList.remove('flick');void R.offsetWidth;R.classList.add('flick');
    var e=seam.children,E='cubic-bezier(.7,0,.2,1)';seam.style.opacity=1;
    [[e[0],'scaleX'],[e[1],'scaleY'],[e[2],'scaleX'],[e[3],'scaleY']].forEach(function(x,i){x[0].animate([{transform:x[1]+'(0)'},{transform:x[1]+'(1)'}],{duration:reduce?1:260,delay:reduce?0:300+i*240,easing:'linear',fill:'both'})});
    later(function(){seam.animate([{opacity:1},{opacity:.3},{opacity:1},{opacity:.4},{opacity:1}],{duration:500});
      hatch.animate([{transform:'translateZ(0)'},{transform:'translateZ(-14px)'}],{duration:reduce?1:260,easing:'ease-in',fill:'forwards'})},1350);
    later(function(){cmp.classList.add('on');
      hatch.animate([{transform:'translateZ(-14px) rotateX(0deg)',boxShadow:'0 0 0 rgba(0,0,0,0)'},{transform:'translateZ(30px) rotateX(-8deg)',offset:.25,boxShadow:'0 30px 60px rgba(0,0,0,.6)'},{transform:'translateZ(60px) rotateX(-104deg)',boxShadow:'0 30px 60px rgba(0,0,0,0)'}],{duration:reduce?1:1250,easing:'cubic-bezier(.6,0,.25,1)',fill:'forwards'});
      later(function(){c1.focus({preventScroll:true})},1000)},1700)}
  /* 3 · two keys within 8 seconds */
  c1.addEventListener('click',function(){if(st!=='open'||k1)return;k1=true;c1.classList.add('on');$('sxK1').classList.add('on');start()});
  c2.addEventListener('click',function(){if(st!=='open'||!k1||k2)return;phoneKey()});
  function start(){msg.textContent='Waiting for your phone…';ph.classList.add('wait');
    win=bar.animate([{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:8000,easing:'linear',fill:'forwards'});win.onfinish=function(){if(!k2)fail()};
    later(function(){if(!k2)phoneKey()},reduce?60:1900)}
  function phoneKey(){k2=true;ph.classList.remove('wait');c2.classList.add('on');$('sxK2').classList.add('on');if(win)win.pause();msg.textContent='Two keys accepted.';later(passage,850)}
  function fail(){msg.textContent='Too late. Turn both keys again.';k1=false;c1.classList.remove('on');$('sxK1').classList.remove('on');ph.classList.remove('wait')}
  /* 4 · the corridor: depth, lights with glow, floor lines, light from under the door */
  var G=el(cor,'g',{}),lights=[],glows=[],pools=[],N9=10,fr=[];G.style.transformOrigin='300px 205px';
  var df=el(cor,'defs',{}),rg=el(df,'radialGradient',{id:'sxGlow'});el(rg,'stop',{offset:'0','stop-color':'#F1EEE7','stop-opacity':.55});el(rg,'stop',{offset:'1','stop-color':'#F1EEE7','stop-opacity':0});
  for(var i=0;i<N9;i++){var s=1/(1+i*.5),w=640*s,h=420*s;fr.push([300-w/2,205-h/2,w,h,s])}
  fr.forEach(function(f,i){el(G,'rect',{x:f[0],y:f[1],width:f[2],height:f[3],fill:'none',stroke:'#F1EEE7','stroke-opacity':Math.max(.04,.24-i*.022).toFixed(3),'stroke-width':1})});
  var z=fr[N9-1],a=fr[0];
  for(var j=0;j<=8;j++){var t=j/8;el(G,'line',{x1:a[0]+a[2]*t,y1:a[1]+a[3],x2:z[0]+z[2]*t,y2:z[1]+z[3],stroke:'#F1EEE7','stroke-opacity':.09,'stroke-width':1})}
  [[a[0],a[1],z[0],z[1]],[a[0]+a[2],a[1],z[0]+z[2],z[1]],[a[0],a[1]+a[3],z[0],z[1]+z[3]],[a[0]+a[2],a[1]+a[3],z[0]+z[2],z[1]+z[3]]].forEach(function(l){el(G,'line',{x1:l[0],y1:l[1],x2:l[2],y2:l[3],stroke:'#F1EEE7','stroke-opacity':.28,'stroke-width':1})});
  fr.forEach(function(f,i){if(i===N9-1)return;var s=f[4];
    glows.push(el(G,'ellipse',{cx:300,cy:f[1]+18*s,rx:90*s,ry:34*s,fill:'url(#sxGlow)',opacity:0}));
    pools.push(el(G,'ellipse',{cx:300,cy:f[1]+f[3]-6*s,rx:70*s,ry:7*s,fill:'url(#sxGlow)',opacity:0}));
    lights.push(el(G,'rect',{x:300-30*s,y:f[1]+8*s,width:60*s,height:4*s,rx:2*s,fill:'#F1EEE7',opacity:.07}))});
  var dw=z[2]*.36,dh=z[3]*.86,dx=300-dw/2,dy=z[1]+z[3]-dh;
  el(G,'rect',{x:dx,y:dy,width:dw,height:dh,fill:'#141413',stroke:'#F1EEE7','stroke-opacity':.6,'stroke-width':.8});
  var dseam=el(G,'line',{x1:300,y1:dy,x2:300,y2:dy+dh,stroke:'#F1EEE7','stroke-width':.8,opacity:0}),dsill=el(G,'rect',{x:dx,y:dy+dh-1.2,width:dw,height:1.2,fill:'#F1EEE7',opacity:0});
  function passage(){st='passage';L('The passage');
    S0.animate([{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(-80deg)',opacity:0}],{duration:reduce?1:1000,easing:'cubic-bezier(.7,0,.2,1)',fill:'forwards'});
    later(function(){only(SC);var O={duration:reduce?1:300,fill:'forwards'};
      lights.forEach(function(l,i){var d=reduce?0:250+i*160;l.animate([{opacity:.07},{opacity:1}],Object.assign({delay:d},O));glows[i].animate([{opacity:0},{opacity:1}],Object.assign({delay:d},O));pools[i].animate([{opacity:0},{opacity:.6}],Object.assign({delay:d+60},O))});
      dseam.animate([{opacity:0},{opacity:.9}],{duration:reduce?1:500,delay:reduce?0:1700,fill:'forwards'});dsill.animate([{opacity:0},{opacity:1}],{duration:reduce?1:500,delay:reduce?0:1700,fill:'forwards'});
      G.animate([{transform:'scale(1) translateY(0)'},{transform:'scale(1.25) translateY(2px)',offset:.35},{transform:'scale(3.9) translateY(-8px)'}],{duration:reduce?1:2600,delay:reduce?0:1500,easing:'cubic-bezier(.5,0,.75,.1)',fill:'forwards'});
      later(door,4000)},700)}
  /* 5 · the door with the symbol splits, a short flash, The Lab */
  function door(){var h=wall.children,E='cubic-bezier(.7,0,.2,1)';wall.classList.add('on');[h[0],h[1]].forEach(function(x){x.animate([{opacity:0},{opacity:1}],{duration:reduce?1:220,fill:'both'})});
    later(function(){only(S3);L('The Lab');flash.animate([{opacity:0},{opacity:.22},{opacity:0}],{duration:reduce?1:520,easing:'ease-out'});
      h[0].animate([{transform:'translateX(0)'},{transform:'translateX(-101%)'}],{duration:reduce?1:1100,easing:E,fill:'forwards'});
      h[1].animate([{transform:'translateX(0)'},{transform:'translateX(101%)'}],{duration:reduce?1:1100,easing:E,fill:'forwards'});
      S3.querySelector('h4').animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:reduce?1:900,delay:reduce?0:500,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'});
      later(function(){wall.classList.remove('on');st='lab'},1200)},650)}
  back.addEventListener('click',function(){timers.forEach(clearTimeout);timers=[];
    [S0,hatch,seam,G,bar,dseam,dsill].concat([].slice.call(seam.children)).concat([].slice.call(wall.children)).concat(lights,glows,pools).forEach(function(x){x.getAnimations().forEach(function(a){a.cancel()})});
    seam.style.opacity=0;cmp.classList.remove('on');wall.classList.remove('on');st='idle';k1=k2=false;[c1,c2].forEach(function(c){c.classList.remove('on')});$('sxK1').classList.remove('on');$('sxK2').classList.remove('on');ph.classList.remove('wait');
    msg.textContent='Turn both keys within 8 seconds.';only(S0);lift.relock();lift.key(true);L('Machine Room');lift.el.querySelector('.cyl').focus({preventScroll:true})});
})();

/* ---------- the thread: the square stops at the point you are reading ---------- */
(function(){var F=[].slice.call(document.querySelectorAll('.filo')).filter(function(f){return f.querySelector('.fl-q')===null||f.closest('.card')===null});
  F.forEach(function(f){if(!f.querySelector('.fl-l')){f.insertAdjacentHTML('afterbegin','<i class="fl-l"></i><i class="fl-q"></i>')}});
  var tk=false;function run(){tk=false;F.forEach(function(f){if(f.closest('.card'))return;var q=f.querySelector('.fl-q'),pts=[].slice.call(f.children).filter(function(c){return c.tagName!=='I'}),y0=innerHeight*.45,pick=pts[0];
    pts.forEach(function(p){if(p.getBoundingClientRect().top<y0)pick=p});q.style.transform='translateY('+(pick.offsetTop+20)+'px)'})}
  addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(run)}},{passive:true});addEventListener('resize',run);run()})();

/* ---------- 08: doors ---------- */
var en=$('entry'),edl=en.querySelector('.dr.l'),edr=en.querySelector('.dr.r'),ebusy=false;
function esize(){en.style.setProperty('--sw',Math.round(en.clientHeight*0.36*0.503)+'px')}esize();addEventListener('resize',esize);
function eopen(){if(ebusy)return;ebusy=true;if(reduce){edl.style.transform='translateX(-101%)';edr.style.transform='translateX(101%)';ebusy=false;return}
  setTimeout(function(){var E='cubic-bezier(.7,0,.2,1)';edl.animate([{transform:'translateX(0)'},{transform:'translateX(-101%)'}],{duration:900,easing:E,fill:'forwards'});
    edr.animate([{transform:'translateX(0)'},{transform:'translateX(101%)'}],{duration:900,easing:E,fill:'forwards'}).onfinish=function(){ebusy=false}},900)}
function ereset(){[edl,edr].forEach(function(d){d.getAnimations().forEach(function(a){a.cancel()})})}
en.addEventListener('click',function(){if(ebusy)return;ereset();eopen()});
new IntersectionObserver(function(es){if(es[0].isIntersecting&&!ebusy){ereset();eopen()}},{threshold:.6}).observe(en);

/* ---------- 03: the descent demo ---------- */
var bld=$('bld'),hdr=$('hdr'),nw=$('nw'),nm=$('nm'),aU=$('aU'),aD=$('aD'),pnl=$('pnl');
var secs=[].slice.call(bld.querySelectorAll('section')),cur=-1,bLast=0,btm;
pnl.innerHTML=secs.map(function(s,i){return '<button data-i="'+i+'" aria-label="Floor '+s.dataset.f+'"><span>'+s.dataset.f+' · '+s.dataset.n+'</span><i></i></button>'}).join('');
var pb=[].slice.call(pnl.querySelectorAll('button'));
pb.forEach(function(b){b.addEventListener('click',function(){bld.scrollTo({top:secs[+b.dataset.i].offsetTop-46,behavior:reduce?'auto':'smooth'})})});
function setF(i){var down=i>cur;cur=i;var s=secs[i];hdr.setAttribute('data-luce',s.dataset.luce);nm.textContent=s.dataset.n;pnl.classList.toggle('dk',s.dataset.luce==='notte');
  pb.forEach(function(b,j){b.classList.toggle('on',j===i)});var nb=document.createElement('b');nb.textContent=s.dataset.f;nw.innerHTML='';nw.appendChild(nb);
  if(!reduce)nb.animate([{transform:'translateY('+(down?'-100%':'100%')+')'},{transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'})}
function pick(){var y=bld.scrollTop+46+bld.clientHeight*0.35,i=0;secs.forEach(function(s,j){if(s.offsetTop<=y)i=j});if(i!==cur)setF(i)}
bld.addEventListener('scroll',function(){var y=bld.scrollTop;aD.classList.toggle('on',y>bLast);aU.classList.toggle('on',y<bLast);bLast=y;clearTimeout(btm);btm=setTimeout(function(){aD.classList.remove('on');aU.classList.remove('on')},260);pick()},{passive:true});
setF(0);

/* ---------- 02: signals ---------- */
var sg=$('sigs');
document.querySelectorAll('#sigL button').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('#sigL button').forEach(function(x){x.classList.toggle('on',x===b)});sg.setAttribute('data-luce',b.dataset.l)})});
var wob=$('wob'),wT=$('wobT'),wS=$('wobS'),wM=$('wobM'),st=0,arrow=wS.innerHTML;
var SEND='<div class="sig sm v3 s-send"><i></i><i></i><i></i><b class="q1"></b><b class="q2"></b><b class="q3"></b></div>',DONE='<div class="sig sm one"><b style="position:static"></b></div>';
wob.addEventListener('click',function(){if(st===1)return;if(st===2){st=0;wT.textContent='Start a work order';wS.innerHTML=arrow;wM.textContent='Tocca il bottone';return}
  st=1;wT.textContent='Sending';wS.innerHTML=SEND;wM.textContent='Sending work order';
  setTimeout(function(){st=2;wT.textContent='Received · No. 015';wS.innerHTML=DONE;wM.textContent="We'll reply within two working days"},reduce?300:2300)});
var sr=$('srch'),srT=$('srchT'),q='booking system',qi=0;
function typeQ(){sr.classList.add('on');srT.textContent=q.slice(0,++qi);if(qi<q.length)setTimeout(typeQ,90);else setTimeout(function(){sr.classList.remove('on');srT.textContent='4 results · booking system';setTimeout(function(){qi=0;srT.textContent='Search work';setTimeout(typeQ,900)},2600)},1200)}
if(!reduce)setTimeout(typeQ,1200);

/* ---------- 01: components ---------- */
document.querySelectorAll('#woO button').forEach(function(b){b.addEventListener('click',function(){b.classList.toggle('on')})});
$('woS').addEventListener('click',function(){var L2=$('woL'),K2=$('woK');L2.innerHTML=SEND;K2.textContent='Sending work order';setTimeout(function(){L2.innerHTML=DONE;K2.textContent='Received: work order No. 015. Example reply.'},reduce?0:1900)});
var R=[['014','Client A','Hospitality','Booking system and app','+30% bookings'],['013','Client B','Retail','Ecommerce and stock','2× online orders'],['012','Client C','Services','Back office','40 h saved a month'],['011','Client D','Hospitality','Website and brand','+18% enquiries']];
function reg(f){$('regB').innerHTML=R.filter(function(r){return f==='All'||r[2]===f}).map(function(r){return '<tr><td>'+r[0]+'</td><td><b>'+r[1]+'</b></td><td>'+r[3]+'</td><td class="r">'+r[4]+'</td></tr>'}).join('')}
reg('All');document.querySelectorAll('#regF button').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('#regF button').forEach(function(x){x.classList.toggle('on',x===b)});reg(b.textContent)})});
var names=[['forward','Forward'],['external','External'],['down','Down'],['up','Up'],['open','Open'],['close','Close'],['floors','Floors'],['menu','Menu'],['search','Search'],['write','Write'],['access','Access'],['done','Done']];
function svg(k){return '<svg viewBox="0 0 24 24"><path d="'+IC[k]+'"/></svg>'}
$('icons').innerHTML=names.map(function(n){return '<div>'+svg(n[0])+'<div class="x1">'+svg(n[0])+'</div><span>'+n[1]+'</span></div>'}).join('');
function cons(id,k,marks){var g='';for(var i=0;i<=24;i++){var w=(i%4===0)?.06:.03;g+='<line x1="'+i+'" y1="0" x2="'+i+'" y2="24" stroke="currentColor" stroke-opacity=".22" stroke-width="'+w+'"/><line x1="0" y1="'+i+'" x2="24" y2="'+i+'" stroke="currentColor" stroke-opacity=".22" stroke-width="'+w+'"/>'}
  $(id).innerHTML=g+'<path d="'+IC[k]+'" fill="currentColor" fill-opacity=".9"/>'+(marks||'')}
var mk='stroke="#B83A2C" stroke-width=".12" fill="none"';
cons('consA','write','<rect x="2" y="5" width="20" height="14" '+mk+' stroke-dasharray=".4 .3"/>');
cons('consB','close','<line x1="4.6" y1="6.6" x2="6.6" y2="4.6" '+mk+'/><line x1="17.4" y1="4.6" x2="19.4" y2="6.6" '+mk+'/>');
cons('consC','search','<circle cx="10" cy="10" r="6" '+mk+' stroke-dasharray=".4 .3"/>');

/* ---------- motion tracks, counters, posters ---------- */
var E={carro:'cubic-bezier(.65,0,.35,1)',corsa:'cubic-bezier(.7,0,.2,1)',scatto:'cubic-bezier(.2,.8,.2,1)'},Dd={carro:1100,corsa:800,scatto:280};
if(!reduce)document.querySelectorAll('.trk i').forEach(function(i){var k=i.getAttribute('data-e'),w=i.parentNode.clientWidth-22;i.animate([{transform:'translateX(0)'},{transform:'translateX('+w+'px)'}],{duration:Dd[k],easing:E[k],iterations:Infinity,direction:'alternate',delay:400,endDelay:700})});
function count(el,to,dur,fmt){var t0=null;function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur);k=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(to*k));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);var id=e.target.id;
  if(id==='cnt')count(e.target,30,reduce?1:1400,function(v){return '+'+v});
  if(id==='ser')count(e.target,14,reduce?1:1600,function(v){return ('00'+Math.max(1,v)).slice(-3)});
  if(id==='hrs')count(e.target,120,reduce?1:1800,function(v){return v});
  if(id==='bf'&&!reduce){e.target.querySelectorAll('.subs div').forEach(function(d,i){d.animate([{transform:'translateX(0)',opacity:1},{transform:'translateX(0)',opacity:1,offset:.25},{transform:'translateX(70%)',opacity:0,offset:.5},{transform:'translateX(70%)',opacity:0,offset:.8},{transform:'translateX(0)',opacity:1}],{duration:5200,delay:i*90,easing:'cubic-bezier(.7,0,.2,1)',iterations:Infinity})})}
})},{threshold:.4});
['cnt','ser','hrs','bf'].forEach(function(i){io.observe($(i))});
var stp=$('stamp');if(!reduce){new IntersectionObserver(function(es){if(es[0].isIntersecting){stp.animate([{transform:'scale(1.35)',opacity:0},{transform:'scale(.96)',opacity:1,offset:.7},{transform:'scale(1)',opacity:1}],{duration:520,delay:1700,easing:'cubic-bezier(.3,0,.2,1)',fill:'both'})}},{threshold:.5}).observe(stp)}
var clk=$('clk'),ord=$('ord'),mins=192,o=148;
if(!reduce)setInterval(function(){mins=(mins+1)%1440;o+=Math.random()<.7?1:2;clk.textContent=('0'+Math.floor(mins/60)).slice(-2)+':'+('0'+mins%60).slice(-2);ord.textContent=o},900);
if(!reduce){var p2=document.querySelector('.pf.p2');var LN=940,CY=12000;
  for(var i=1;i<=4;i++){(function(i){var c=p2.querySelector('.c'+i),t=p2.querySelector('.t'+i);var s=0.06+(i-1)*0.12,e=s+0.08;
    c.animate([{transform:'translateY('+(-i*LN)+'px)',offset:0},{transform:'translateY('+(-i*LN)+'px)',offset:s,easing:'cubic-bezier(.7,0,.25,1)'},{transform:'translateY(0px)',offset:e},{transform:'translateY(0px)',offset:.82,easing:'cubic-bezier(.7,0,.3,1)'},{transform:'translateY('+(-i*LN)+'px)',offset:.92},{transform:'translateY('+(-i*LN)+'px)',offset:1}],{duration:CY,iterations:Infinity});
    t.animate([{opacity:0,offset:0},{opacity:0,offset:e},{opacity:1,offset:e+.03},{opacity:1,offset:.8},{opacity:0,offset:.84},{opacity:0,offset:1}],{duration:CY,iterations:Infinity})})(i)}}
})();
</script>
