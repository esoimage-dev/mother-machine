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
.mmfilm{--fmf:"Hanken",system-ui,sans-serif;--fmm:"DMMono",ui-monospace,monospace;margin-top:4px}
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

<header class="bar" id="bar" data-luce="carta"><a class="blogo" href="#top" aria-label="Mother Machine"><span class="lgB" data-a="heroS"><i class="lgF" aria-hidden="true">&#xE000;</i></span><span class="lgS" data-a="heroW"><i class="lgF" aria-hidden="true">&#xE000;</i></span></a><button class="dispB disp3" id="dispB" aria-label="Open the floors panel" aria-expanded="false" aria-controls="navLift"><span class="dn"><span class="dir" id="bA"></span><span class="rl nw" id="bN"><b>11</b></span></span><span class="rl nm" id="bL"><b>Il sito</b></span><span class="kb" id="bK" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span></button></header>
<div class="navdim" id="navDim"></div>
<nav class="flr navlift" id="navLift" data-luce="notte" aria-label="Floors"></nav>
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
      <div><span>Offerta</span><b>Systems dentro (software, gestionali, app in codice), Brand fuori (identità, siti, UI e UX). Un solo studio.</b></div>
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
        <div class="frow" data-luce="notte"><span class="fn">05</span><div><b>Home</b><p>Si apre al buio: la frase che respira, il film in una finestra, un bottone. Poi si accende il bianco: i lavori, cosa costruiamo, come lavoriamo.</p></div><span class="fc">Notte, poi bianco</span></div>
        <div class="frow" data-luce="notte"><span class="fn">04</span><div><b>Work</b><p>Il registro delle macchine. Ogni progetto è una stanza del piano: 04 · No. 014, con la sua pagina.</p></div><span class="fc">Notte</span></div>
        <div class="frow" data-luce="carta"><span class="fn">03</span><div><b>Brand</b><p>Il fuori: identità, siti e app (UI e UX), negozi online, art direction, grafica. I lavori dei clienti con i loro colori: qui la cornice è bianca perché il colore lo porta il contenuto.</p></div><span class="fc">Bianco</span></div>
        <div class="frow" data-luce="macchina"><span class="fn">02</span><div><b>Systems</b><p>Il dentro: custom software, gestionali e CRM, app in codice, CMS, automazioni. Sta sopra la machine room: è il piano più vicino alla macchina. Il sistema dal vivo.</p></div><span class="fc">Grigio</span></div>
        <div class="frow" data-luce="rosa2"><span class="fn">01</span><div><b>Studio</b><p>Chi siamo e come lavoriamo: Survey, Build, Run. La torre del marchio in apertura.</p></div><span class="fc">Rosa</span></div>
        <div class="frow" data-luce="rosa2"><span class="fn">G</span><div><b>Contact</b><p>Tell us what slows you down. L'ordine di lavoro. Il primo incontro è gratuito.</p></div><span class="fc">Rosa</span></div>
        <div class="gline"><span>Ground level</span></div>
        <div class="frow" data-luce="notte"><span class="fn">LG</span><div><b>Machine Room</b><p>Sottoterra, solo con la chiave. Il nostro backoffice, sistema No. 001.</p></div><span class="fc">Notte · key only</span></div>
      </div>
    </div>
    <div class="rl">
      <div><span>Regola 1</span><b>Una pagina, un piano.</b><p>Cambiare pagina è la corsa dell'ascensore: porte, display che conta, porte che si aprono già nella luce nuova.</p></div>
      <div><span>Regola 2</span><b>La pulsantiera è il menu.</b><p>Dall'alto in basso, l'ordine dei bottoni è l'ordine dei piani. Un menu solo, niente doppioni.</p></div>
      <div><span>Regola 3</span><b>Le sezioni sono locali.</b><p>Dentro una pagina: 05.1, 05.2. Una pagina può aprirsi al buio, poi si accende la sua luce e non cambia più; il nero o il rosa entrano solo come finestre.</p></div>
      <div><span>Regola 4</span><b>Ogni pagina ha la porta per G.</b><p>In fondo a ogni piano, una fascia rosa porta al piano terra: il contatto è sempre a un piano di distanza.</p></div>
    </div>
  </div>
  <div class="sub"><h3>La home, dal vivo <small>05.1 apertura · 05.2 lavori · 05.3 cosa costruiamo · prova col mouse, e sul telefono col dito</small></h3>
    <div class="livehome">
      <figure class="lhd"><div class="lhd-in"><iframe data-live title="Home, desktop" tabindex="-1"></iframe><span class="lhl mo">Loading the page</span></div><figcaption class="lab">Desktop · 1440 × 900 · scorri dentro</figcaption></figure>
      <figure class="lhm"><div class="lhm-in"><iframe data-live title="Home, telefono" tabindex="-1"></iframe><span class="lhl mo">Loading</span></div><figcaption class="lab">Telefono · 390 × 844</figcaption></figure>
    </div>
    <div class="rl">
      <div><span>05.1 · Apertura</span><b>La frase che respira</b><p>Si apre al buio. "The machine behind your business." in Hanken variabile: le lettere vicine al cursore o al dito prendono peso da 110 a 900; se nessuno la tocca, un'onda la attraversa piano. In alto il peso dal vivo.</p></div>
      <div><span>05.1 · Bottone</span><b>Il punto che vola</b><p>"Start a project", e sotto "Free first call." Sul bottone il punto di "business." vola nel quadrato e il pomodoro sale dal basso; uscendo torna nella frase. Bottone e finestra del film sono larghi uguali.</p></div>
      <div><span>05.1 · Film</span><b>La finestra</b><p>A destra gira muto, da solo, la parte a colori del film. Al clic si allarga a tutto schermo e riparte da zero con la musica. Sul telefono la finestra non c'è: c'è "Watch the film".</p></div>
      <div><span>05.2 · Lavori</span><b>Si accende il bianco</b><p>Tre copertine disegnate nei colori del cliente, il risultato che conta fino al suo valore. In fondo "See all work". Sul telefono le schede scorrono di lato.</p></div>
      <div><span>05.3 · Cosa costruiamo</span><b>Il momento mother</b><p>Una scena arrotondata con gli archi della m che si muovono, pomodoro su rosa, e reagiscono al mouse. Ogni tanto si allineano e formano la m del marchio. Due schede di vetro, Systems e Brand: salgono al passaggio, si clicca solo "Explore".</p></div>
      <div><span>Testata e pulsantiera</span><b>La colonna dei piani</b><p>A destra il piano e la colonna di sei quadrati. Aprila: la pulsantiera con la chiave per LG. Le regole sono al piano 03.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Machine e mother <small>più o meno metà e metà</small></h3>
    <p class="lead">La struttura (piani, segnali, numeri, etichette) è la parte machine: dice che sappiamo costruire. Il contenuto (lavori, colore, persone, illustrazioni, frasi umane) è la parte mother: dice che sappiamo fare marchi per chiunque. Oggi la struttura pesa un po' di più perché i progetti sono pochi; ogni lavoro nuovo sposta l'equilibrio verso il contenuto.</p>
    <div class="anat">
      <div class="apage" data-luce="macchina">
        <div class="abar"><div data-a="line"></div><span class="tg2 m">Machine</span><span class="ad">02 · Systems</span></div>
        <div class="asill"><span class="an">02</span><span class="lab">Systems</span><span class="tg2 m">Machine</span></div>
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
  <div class="sub"><h3>Vetro e gradiente <small>la lingua mother, usata poco</small></h3>
    <p class="lead">Machine è squadrato: righe, quadrati, numeri, angoli vivi. Mother è morbido: vetro, gradienti, archi in movimento, angoli tondi. Le due lingue non si mescolano nello stesso pezzo. Il vetro rompe il ritmo del sito, per questo vale solo se è raro.</p>
    <div class="rl">
      <div><span>Regola 1</span><b>Un momento mother per pagina.</b><p>Una sola scena di vetro e gradiente per pagina, come 05.3 nella home. Il resto della pagina è machine.</p></div>
      <div><span>Regola 2</span><b>Il vetro funzionale è scuro e quasi squadrato.</b><p>La pulsantiera e la barra quando scorre: vetro scuro, 3 px di angolo, si legge sempre. Mai vetro sui contenuti.</p></div>
      <div><span>Regola 3</span><b>Leggero, sempre.</b><p>Niente sfocatura dal vivo sopra cose che si muovono: il campo è una tela piccola ingrandita, il vetro ne ridisegna una copia sfocata. Si muove solo con spostamenti e opacità, si ferma fuori schermo, 60 fotogrammi.</p></div>
      <div><span>Regola 4</span><b>Il pomodoro solo dove risponde.</b><p>Il punto che lampeggia, il bottone chiamato, la luce del cursore, la m che si forma. Non sui titoli, non sulle frecce, non sui fondi.</p></div>
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
  <div class="sub"><h3>Il film: The machine behind your business <small>38 secondi · dal vivo in codice · con musica</small></h3>
    <div id="mmfilm" class="mmfilm"></div>
    <div class="rl">
      <div><span>01 · 02</span><b>Brand</b><p>Il logo si smonta e si ricostruisce sulle sue linee guida, si seleziona come in Figma, si stira e torna a posto. Il colore allaga lo schermo: dodici schede, un interruttore cambia tema. Poi Brand, Systems col peso di Hanken da 100 a 900, Code.</p></div>
      <div><span>03</span><b>Runtime</b><p>Glitch, terminale, piove il codice vero del logo. I caratteri disegnano la m, che si compila in puntini; ogni puntino diventa un arco e il campo cresce tondo dalla lettera. Tre onde, poi tutto pomodoro.</p></div>
      <div><span>04 · 05</span><b>Systems</b><p>Otto app vere per otto settori: clinica, corriere, palestra, pizzeria e altre dietro. La pizzeria si apre, Start service, il venerdì sera va da solo: 214 coperti, zero errori.</p></div>
      <div><span>06 · Uso</span><b>Firma e regole</b><p>Il nero nasce dal pallino "0 errors", la m sale, la frase, e si chiude sul logo identico al primo fotogramma. Parte quando entra nello schermo, va una volta, suono spento di default. Nel sito non nell'hero: più sotto, come prova. MP4 solo per i social.</p></div>
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
  <header class="flh"><span class="n">07</span><div><span class="k">Floor 07</span><h2>Il colore dice su che piano sei</h2><p>Sette colori. Il bianco è il fondo, la carta è la superficie calda, il pomodoro è il nostro colore: va solo su quello che si muove o risponde. Caldo per mother, freddo per machine. Il rosa non è mai un dettaglio: è un posto.</p></div></header>
  <div class="sub">
    <div class="chips">
      <div class="chip"><i style="background:#FBFAF7;box-shadow:inset 0 0 0 1px rgba(18,18,17,.14)"></i><b>Bianco</b><span>#FBFAF7</span><em>Mother · si parla, si legge. Il fondo di default</em></div>
      <div class="chip"><i style="background:#F4F2EC;box-shadow:inset 0 0 0 1px rgba(18,18,17,.1)"></i><b>Carta</b><span>#F4F2EC</span><em>La superficie calda sopra il bianco: schede, citazioni, stampa</em></div>
      <div class="chip"><i style="background:#121211"></i><b>Inchiostro</b><span>#121211</span><em>Testo e marchio, in ogni luce</em></div>
      <div class="chip"><i style="background:#BEC2BF"></i><b>Grigio macchina</b><span>#BEC2BF</span><em>Machine · si spiega: metodo, tempi, tecnica</em></div>
      <div class="chip"><i style="background:#0F0F0E"></i><b>Notte</b><span>#0F0F0E</span><em>Machine · si vede girare: prova, sistemi dal vivo</em></div>
      <div class="chip"><i style="background:#EEC3B1"></i><b>Rosa pelle</b><span>#EEC3B1</span><em>Mother · ci si incontra: pagine intere, poster, copertine</em></div>
      <div class="chip"><i style="background:#FF5B3A"></i><b>Pomodoro</b><span>#FF5B3A</span><em>Il nostro colore. Solo su ciò che si muove o risponde: il punto, il bottone, i segnali, il film</em></div>
    </div>
  </div>
  <div class="sub"><h3>Un colore, un tipo di piano</h3>
    <div class="cmap">
      <div data-luce="carta"><span class="k">Bianco · mother</span><h4>Si parla.</h4><span class="who">I piani dove si legge e si racconta.</span><ul><li>Home, dopo l'apertura</li><li>Brand, con i lavori a colori</li><li>Testi, casi, pagine progetto</li></ul><span class="never">È il fondo di default. Se hai un dubbio, è bianco.</span></div>
      <div data-luce="macchina"><span class="k">Grigio · machine</span><h4>Si spiega.</h4><span class="who">I piani del metodo e della tecnica.</span><ul><li>Systems</li><li>Metodo, tempi, tecnologia</li><li>Schede tecniche, infografiche</li></ul><span class="never">Mai per il contatto, mai per i risultati.</span></div>
      <div data-luce="notte"><span class="k">Notte · machine</span><h4>Si vede girare.</h4><span class="who">I piani dove le macchine sono accese, e l'apertura della home.</span><ul><li>L'apertura della home</li><li>Il sistema dal vivo, come finestra</li><li>Machine Room</li></ul><span class="never">Sopra solo carta e il pomodoro dei segnali. Niente rosa sul nero.</span></div>
      <div data-luce="rosa2"><span class="k">Rosa · mother</span><h4>Ci si incontra.</h4><span class="who">Le pagine delle persone, e le copertine.</span><ul><li>Studio, contatto, ordine di lavoro</li><li>La porta per G in fondo a ogni pagina</li><li>Poster, copertine, social, inviti</li></ul><span class="never">Mai piccolo: niente testo, righe, bottoni o accenti rosa.</span></div>
    </div>
    <div class="rules">
      <div><span>Regola 1</span><b>Un colore, un tipo di piano.</b><p>In due scroll si impara che il grigio è il metodo e il nero è la prova, senza che nessuno lo dica.</p></div>
      <div><span>Regola 2</span><b>Il rosa è sempre una superficie intera.</b><p>Pagine intere (Studio, contatto), la fascia della porta per G, poster e copertine. Fuori dal sito è il colore che ci fa riconoscere.</p></div>
      <div><span>Regola 3</span><b>Il testo è inchiostro o carta.</b><p>Mai testo colorato. Il marchio è sempre del colore del testo. L'unico pomodoro dentro una frase è il punto finale: è un segnale, non una lettera.</p></div>
      <div><span>Regola 4</span><b>Un cambio di colore è un cambio di piano.</b><p>Il colore cambia con la corsa dell'ascensore. Unica eccezione: una pagina può aprirsi al buio, come la cabina prima che si accenda la luce; scendendo si accende il piano.</p></div>
      <div><span>Regola 5</span><b>Il pomodoro si muove.</b><p>Va solo su ciò che si muove o risponde: il punto che lampeggia, il bottone che si accende, il peso che scorre, il film. Mai titoli, mai fondi di pagina nel sito.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Sì e no</h3>
    <div class="dd">
      <div><div class="fr" style="background:#EEC3B1"><span style="font:700 34px/1 var(--f-body);letter-spacing:-.04em;color:#121211">Ground floor.</span></div><span class="v y">Sì</span><p>Rosa come superficie piena, testo in inchiostro.</p></div>
      <div><div class="fr" style="background:#0F0F0E"><span style="font:700 40px/1 var(--f-body);letter-spacing:-.04em;color:#F1EEE7">+30%</span></div><span class="v y">Sì</span><p>Sul nero i numeri sono carta. Pesano di più.</p></div>
      <div><div class="fr" style="background:#0F0F0E"><span style="font:700 40px/1 var(--f-body);letter-spacing:-.04em;color:#EEC3B1">+30%</span></div><span class="v n">No</span><p>Rosa come accento sul nero: è l'uso che lo faceva sembrare messo a caso.</p></div>
      <div><div class="fr" style="background:#BEC2BF"><div style="height:46px;width:70%;background:#EEC3B1"></div></div><span class="v n">No</span><p>Rosa sul grigio, o testo rosa sulla carta: spariscono.</p></div>
      <div><div class="fr" style="background:#0F0F0E"><span style="font:300 40px/1 var(--f-body);letter-spacing:-.05em;color:#F4F2EC">business<span style="color:#FF5B3A">.</span></span></div><span class="v y">Sì</span><p>Il pomodoro come segnale: il punto che lampeggia, il bottone che si accende.</p></div>
      <div><div class="fr" style="background:#FBFAF7"><span style="font:700 34px/1 var(--f-body);letter-spacing:-.04em;color:#FF5B3A">Our work.</span></div><span class="v n">No</span><p>Titoli o testi in pomodoro: diventa un sito qualunque.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Gli stessi pezzi, in ogni luce</h3>
    <div class="luci">
      <div class="mini" data-luce="carta"><nav><div data-a="line"></div><span>04</span></nav><div class="in"><span class="lab">Bianco</span><h4>The machine behind your business.</h4><span class="bt">Start a project</span></div><div class="nm"><b>+30%</b><span class="lab">bookings · example</span></div></div>
      <div class="mini" data-luce="macchina"><nav><div data-a="line"></div><span>01</span></nav><div class="in"><span class="lab">Grigio</span><h4>Three floors. Fixed timelines.</h4><span class="bt">How we work</span></div><div class="nm"><b>6 wks</b><span class="lab">first release</span></div></div>
      <div class="mini" data-luce="notte"><nav><div data-a="line"></div><span>03</span></nav><div class="in"><span class="lab">Notte</span><h4>The system, live.</h4><span class="bt">Open the back office</span></div><div class="nm"><b>148</b><span class="lab">orders tonight</span></div></div>
      <div class="mini" data-luce="rosa2"><nav><div data-a="line"></div><span>G</span></nav><div class="in"><span class="lab">Rosa</span><h4>Tell us what slows you down.</h4><span class="bt">Start a work order</span></div><div class="nm"><b>2 days</b><span class="lab">to reply</span></div></div>
    </div>
    <div class="states"><span class="st2"><i style="background:#2F7D5B"></i>Running</span><span class="st2"><i style="background:#B7791F"></i>Attention</span><span class="st2"><i style="background:#B83A2C"></i>Error</span><span class="note" style="align-self:center">Colori di stato: solo dentro le interfacce dei sistemi, sempre con la parola accanto. Mai nel marchio, nei titoli o nei fondi.</span></div>
    <div class="ctr"><table><thead><tr><th>Luce</th><th>Testo inchiostro</th><th>Testo carta</th><th>Distacco dalla carta</th><th>Verdetto</th></tr></thead><tbody>
      <tr><td>Bianco</td><td>18.0 : 1</td><td>n/a</td><td>n/a</td><td>Base</td></tr>
      <tr><td>Carta</td><td>16.7 : 1</td><td>n/a</td><td>1.1 : 1</td><td>Superficie, non fondo</td></tr>
      <tr><td>Grigio macchina</td><td>10.4 : 1</td><td>n/a</td><td>1.61 : 1</td><td>Distacco chiaro, testo comodo</td></tr>
      <tr><td>Rosa pelle</td><td>11.7 : 1</td><td>n/a</td><td>1.43 : 1</td><td>Solo superficie piena</td></tr>
      <tr><td>Notte</td><td>n/a</td><td>17.1 : 1</td><td>17.1 : 1</td><td>Sopra solo carta</td></tr>
      <tr><td>Pomodoro</td><td>6.1 : 1</td><td>n/a</td><td>3.0 : 1</td><td>Segnali e bottoni, mai testo</td></tr>
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
    <div><span class="k">Inside · custom software</span><h4>Systems</h4><p>The tools your company runs on. Built around how you actually work, not the other way round.</p>
      <ul><li>Custom software<span>core</span></li><li>Back offices and CRM<span>core</span></li><li>Apps and portals<span>core</span></li><li>CMS and catalogues<span>core</span></li><li>Automations<span>core</span></li></ul></div>
    <div><span class="k">Outside · the face</span><h4>Brand</h4><p>Identity, interfaces and art direction, so the company looks as good as it runs. Same team, same standards.</p>
      <ul><li>Brand identity<span></span></li><li>Websites and apps<span></span></li><li>Online shops<span></span></li><li>Art direction<span></span></li><li>Visual design<span></span></li></ul></div>
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
    <div><span>Menu</span><b>Una pulsantiera sola</b><p>Identica ovunque: vetro scuro quasi squadrato, quattro viti. Una colonna di bottoni quadrati con il numero, il nome del piano e una riga di cosa c'è. Si apre sopra la pagina; scegli un piano e si chiude. Sul telefono è un pannello a tutta altezza.</p></div>
    <div><span>Header</span><b>Il logo vero, la colonna dei piani</b><p>Il logo intero è appeso sotto la barra e si ripiega quando scorri. A destra il piano, solo il piano, e la colonna di sei quadrati: è il palazzo, quello acceso pomodoro è dove sei. Niente hamburger, niente frecce: la colonna apre la pulsantiera.</p></div>
    <div><span>Quadratini</span><b>Sono i locali, non i piani</b><p>Nel sito i quadratini a lato indicano i punti della pagina (05.1, 05.2), da 3 a 8, solo sulle pagine lunghe. I piani si cambiano solo con la pulsantiera.</p></div>
    <div><span>Corsa</span><b>Un passaggio, mai un cancello</b><p>Un piano dura circa un secondo, ogni piano in più un po' di più, mai oltre due. Ogni pagina ha il suo indirizzo: da un link o da Google si entra diretti.</p></div>
  </div>
  <div class="sub"><h3>Dentro una pagina: i locali <small>la home, scorri dentro il riquadro</small></h3>
    <div class="bldw" data-luce="carta">
      <div class="bld" id="bld">
        <div class="hdr" id="hdr" data-luce="carta"><div data-a="line"></div><div class="disp2"><div class="nw" id="nw"><b>05</b></div><span class="nm" id="nm">Home</span><span class="kbm" aria-hidden="true"><i class="lit"></i><i></i><i></i><i></i><i></i><i></i></span></div></div>
        <section data-luce="carta" data-f="05.1" data-n="Opening"><div class="sill"><span class="n">05.1</span><span class="t">Home · Opening</span></div><h5>The machine behind your business.</h5><p class="s">We design and build the software companies run on, and the brands they're known by.</p></section>
        <section data-luce="carta" data-f="05.2" data-n="Proof"><div class="sill"><span class="n">05.2</span><span class="t">Proof</span></div><h5>Results, not deliverables.</h5><div class="win" data-luce="notte"><span class="lab">Window on 04 · Work</span><div class="big">3×</div><p class="s">Example figure. Every project ends with a real number.</p></div></section>
        <section data-luce="carta" data-f="05.3" data-n="What we build"><div class="sill"><span class="n">05.3</span><span class="t">What we build</span></div><h5>One studio. The inside and the outside.</h5><div class="two"><div><b>Systems</b><span>Custom software, back offices, apps, CMS, automations</span></div><div><b>Brand</b><span>Identity, websites and apps, online shops, art direction, visual design</span></div></div></section>
        <section data-luce="carta" data-f="05.4" data-n="How we work"><div class="sill"><span class="n">05.4</span><span class="t">How we work</span></div><h5>Three floors. Fixed timelines.</h5><div class="st3"><div><span>01</span>Survey</div><div><span>02</span>Build</div><div><span>03</span>Run</div></div></section>
        <section data-luce="rosa2" data-f="G" data-n="The door to G"><div class="sill"><span class="n">G</span><span class="t">The door to the ground floor</span></div><h5>Tell us what slows you down.</h5><span class="cta">Start a work order <svg viewBox="0 0 24 24"><path d="/*I:forward*/"/></svg></span></section>
      </div>
      <div class="pnl" id="pnl"></div>
    </div>
    <div class="three">
      <div><span class="k">1 · Il display</span><b>Dove sei.</b><p>Nella barra: il numero del piano e il nome, mai il locale. Durante la corsa i numeri girano come un contatore e a sinistra lampeggia una freccia nera; da fermo la freccia non c'è.</p></div>
      <div><span class="k">2 · La pulsantiera</span><b>Dove puoi andare.</b><p>Chiusa è la colonna di sei quadrati: al passaggio si allungano in righe e il nome diventa "All floors". Aperta è il pannello dell'ascensore: il bottone del piano dove sei è acceso.</p></div>
      <div><span class="k">3 · La soglia</span><b>Dove sei arrivato.</b><p>Ogni piano si apre con il suo numero in mono, il nome piccolo e una riga. Chi arriva a metà pagina capisce subito.</p></div>
    </div>
  </div>
  <div class="sub"><h3>La pulsantiera e la corsa <small>premi un piano</small></h3>
    <p class="lead">La pulsantiera è un componente solo: il menu del sito, la navigazione di questo manuale, le prove qui sotto. Bottoni quadrati con il numero, il nome, una riga di cosa c'è. Il piano dove sei è acceso e retroilluminato; al passaggio compare un anello dentro il bottone; premuto si schiaccia e l'anello lampeggia pomodoro finché non arrivi. In fondo LG, Machine room: un bottone uguale agli altri, chiuso. Accanto c'è il cilindro della chiave: "Staff only"; premuto da chiuso, "Not without the key."; girata la chiave, "Going down."; arrivati, "You found it.". Ci può arrivare chiunque, basta girarla. La corsa è il cambio piano: le porte si chiudono, il display conta i piani, le porte si aprono già con la luce nuova.</p>
    <div class="ldemo"><div class="flr fdemo" id="lift03"></div><div class="shaft" id="shaft03" style="aspect-ratio:auto;min-height:420px"><div class="pg"></div><div class="door l"></div><div class="door r"></div><i class="mark"></i><div class="disp"><div class="ar"><i class="u"></i><i class="d"></i></div><div class="roll"><b>05</b></div><span class="nm">Home</span></div></div></div>
    <div class="rule2">
      <div><span class="k">Pagine</span><b>Ogni pagina è un piano.</b><p>Home, Work, Brand, Systems, Studio, Contact: i bottoni della pulsantiera, dall'alto in basso. Un menu solo.</p></div>
      <div><span class="k">Sezioni</span><b>Ogni sezione è un locale.</b><p>Dentro la pagina si scorre: 05.1, 05.2. I locali li dicono le soglie; il display e la pulsantiera restano sui piani.</p></div>
    </div>
  </div>
  <div class="sub"><h3>Piani, locali, nomi</h3>
    <div class="grid2">
      <div class="card"><div class="demo" style="place-items:stretch;align-content:center"><div class="map" style="background:transparent"><table><thead><tr><th>Piano</th><th>Pagina</th><th>Luce</th></tr></thead><tbody>
        <tr><td>05</td><td>Home</td><td><i class="sw" style="background:#F4F2EC"></i>Carta</td></tr>
        <tr><td>04</td><td>Work</td><td><i class="sw" style="background:#0F0F0E"></i>Notte</td></tr>
        <tr><td>03</td><td>Brand</td><td><i class="sw" style="background:#F4F2EC"></i>Carta</td></tr>
        <tr><td>02</td><td>Systems</td><td><i class="sw" style="background:#BEC2BF"></i>Grigio</td></tr>
        <tr><td>01</td><td>Studio</td><td><i class="sw" style="background:#EEC3B1"></i>Rosa</td></tr>
        <tr><td>G</td><td>Contact</td><td><i class="sw" style="background:#EEC3B1"></i>Rosa</td></tr>
        <tr><td>LG</td><td>Machine Room · key only</td><td><i class="sw" style="background:#0F0F0E"></i>Notte</td></tr>
      </tbody></table></div></div>
        <div class="txt"><b>Il sito, piano per piano</b><p>Il colore segue il tipo di pagina. LG è in fondo al pannello, chiuso: si apre girando la chiave.</p></div></div>
      <div class="card"><div class="demo" style="place-items:stretch;align-content:center"><div class="secs"><div class="s"><span>02</span><b>Systems</b><em>#02</em></div><div class="s"><span>02.1</span><b>Back offices and CRM</b><em>#02.1</em></div><div class="s"><span>02.2</span><b>Apps and portals</b><em>#02.2</em></div><div class="s"><span>02.3</span><b>CMS and catalogues</b><em>#02.3</em></div></div></div>
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
  <header class="flh"><span class="n">02</span><div><span class="k">Floor 02</span><h2>Segnali e stati: quadrati che dicono cosa succede</h2><p>Il quadrato è lo stesso della pulsantiera, degli stati, del bottone e del cursore. Come si muove dice cosa sta facendo il sito. Prende il colore del testo, quindi funziona in ogni luce; quando si accende, è pomodoro.</p></div></header>
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
    <div class="card"><div class="demo"><div class="curd"><div><i class="c1"></i><b>Here</b><span>Il cursore: un quadrato pieno nel colore del testo</span></div><div><i class="c2"></i><b>Your turn</b><span>Su quello che si preme si apre: una cornice con la luce pomodoro</span></div><div class="nb"><i class="c3"></i><b>Sul nero</b><span>Carta, e si inverte sopra le lettere chiare</span></div></div></div>
      <div class="txt"><b>Il cursore</b><p>Sul sito il cursore è il segnale stesso: un quadrato pieno del colore del testo dove stai. Su quello che si preme si apre in una cornice con dentro la luce pomodoro: è la presa, come il bottone Start a project. Premendo, la luce riempie la cornice. Nessun ritardo, segue il mouse esatto. Sui campi di testo torna la barretta, sui telefoni non c'è. Muovi il mouse su questa pagina: è già lui.</p></div></div>
    <div class="card"><div class="demo" data-luce="notte"><div class="pdemo"><span class="pw">business<i class="pdot"></i></span><a class="mmb" href="#f02" onclick="return false">Start a project<span class="sq"><i></i></span></a></div></div>
      <div class="txt"><b>Il punto</b><p>Il punto della frase di apertura è il segnale Running in pomodoro: lampeggia a scatti. Vai sul bottone: il punto vola nel suo quadrato e il pomodoro sale dal basso, come Sending. Quando esci, torna nella frase. Qui ridotto; dal vivo nel piano 11.</p></div></div>
  </div>
</div></section>

<!-- ============ 01 COMPONENTS ============ -->
<section class="fl" data-luce="macchina" data-f="01" data-n="Componenti" id="f01"><div class="in">
  <header class="flh"><span class="n">01</span><div><span class="k">Floor 01</span><h2>Componenti</h2><p>I pezzi con cui si monta il sito. Stesse regole ovunque: angoli vivi, una riga sottile per separare, il colore che sale dal basso come un piano.</p></div></header>
  <p class="note" style="max-width:72ch">Riferimento alto per elementi e comportamento: i siti delle fonderie Klim, Dinamo, Grilli Type, Displaay, Fontshare, Pangram Pangram e Lineto. Non per il contenuto ma per la qualità di linee, forme, bottoni, form, uso del logo (anche nel footer) e animazioni degli elementi.</p>
  <div class="grid3">
    <div class="card"><div class="demo"><div class="filo" style="max-width:300px;display:grid;gap:14px"><i class="fl-l"></i><i class="fl-q" style="transform:translateY(46px)"></i><p style="font-size:14px;margin:0">Survey. We map how your business really works.</p><p style="font-size:14px;margin:0">Build. We design and ship in short, fixed cycles.</p><p style="font-size:14px;margin:0">Run. We keep it running and make it better.</p></div></div>
      <div class="txt"><b>Il filo</b><p>Una riga con un quadratino che scende di punto in punto mentre leggi, come la cabina nel vano. Per testi lunghi: metodo, casi studio, Studio. Lo vedi al lavoro nel piano 04.</p></div></div>
    <div class="card"><div class="demo"><div class="btns"><a class="mmb" href="#f01" onclick="return false">Start a project<span class="sq"><i></i></span></a><a class="mml" href="#f01" onclick="return false">See all work<i><svg viewBox="0 0 24 24"><path d="M5 12h12M12 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg></i></a><a class="lnk" href="#f01">Read the case</a></div></div>
      <div class="txt"><b>Bottoni e link</b><p>Il principale è testo e un quadrato nero: la presa. Al passaggio il pomodoro sale dal basso e nel quadrato si accende il punto. Uno solo per schermata, sempre al contrario della luce. Il secondario ha la freccia nel quadrato, che diventa pomodoro. Il numero del piano nel bottone è uscito: non lo capiva nessuno.</p></div></div>
    <div class="card"><div class="demo"><a class="wc wcm" href="#f01" onclick="return false">
        <div class="wv" style="--c:#1F4E5F"><div class="art a1">
          <div class="bm1"><b>Birrificio Mare</b><span>Back office</span></div>
          <div class="wui u1"><div class="wuh"><span>Orders · today</span><span>Fri 18</span></div><div class="wub"><b>128</b><i class="wsp"><s style="height:40%"></s><s style="height:62%"></s><s style="height:48%"></s><s style="height:80%"></s><s style="height:70%"></s><s style="height:100%"></s></i></div>
            <ul><li><span>Keg 30 L · Lido Bar</span><em class="ok">Delivered</em></li><li><span>Keg 20 L · Molo 7</span><em class="go">On the way</em></li><li><span>Case IPA · Bagno Sole</span><em class="wt">Packing</em></li></ul></div>
          <div class="wui u2"><span>Route 3</span><b>6 stops</b><i><s style="width:66%"></s></i></div>
        </div><span class="wcta mo"><i></i>View project</span></div>
        <div class="wm mo"><span>No. 014</span><span>Systems</span></div><h3>Birrificio Mare</h3><p>Orders, kegs and deliveries in one back office.</p>
        <div class="wn"><b>3×</b><span>orders handled per person</span></div></a></div>
      <div class="txt"><b>La scheda progetto</b><p>La copertina è il lavoro del cliente disegnato piatto, nei suoi colori: il suo gestionale, il suo sacchetto, la sua agenda. Sotto: numero, settore, nome, una riga, il risultato in grande con una riga sola sotto. Al passaggio la copertina si avvicina e compare View project. Mai telefoni finti.</p></div></div>
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
      <li>La lente di vetro sull'hero<span>14 ottobre</span></li>
      <li>Le frecce nella testata e il menu hamburger, il locale nel display (05.1)<span>14 ottobre</span></li>
      <li>Il quadratino colorato del piano nella pulsantiera, le righe che si riempiono del colore del piano, il pannello a due colonne, il braille<span>14 ottobre</span></li>
      <li>Il cursore pomodoro pieno sui bottoni<span>14 ottobre</span></li>
      <li>I numeri grandi dei piani dietro le schede di vetro<span>14 ottobre</span></li>
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
    <div class="ldemo"><div class="flr fdemo" id="lift13"></div><div class="shaft tall" id="shaft13"><div class="pg"></div><div class="pg13" id="v13" hidden></div><div class="door l"><div class="sym" data-a="iconS"></div></div><div class="door r"><div class="sym" data-a="iconS"></div></div><i class="mark"></i><div class="disp"><div class="ar"><i class="u"></i><i class="d"></i></div><div class="roll"><b>G</b></div><span class="nm">Contact</span></div></div></div>
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
var l03=Floors($('lift03'),SITEF,{keys:false,onPick:function(k){k=+k;if(k===-1){$('fLG').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){l03.cur(sh03.cur);if(!mr.at13)keyTo13()},reduce?50:1100);return}if(sh03.busy||k===sh03.cur)return;l03.call(k);sh03.ride(k,function(lv,d){}).then(function(){l03.cur(sh03.cur)})}});
l03.cur(5);
if(!reduce){var once=false;new IntersectionObserver(function(es){if(es[0].isIntersecting&&!once){once=true;setTimeout(function(){l03.call(3);sh03.ride(3,function(lv,d){}).then(function(){l03.cur(3)})},700)}},{threshold:.5}).observe($('shaft03'))}

/* ---------- 13: machine room ---------- */
var shEl=$('shaft13');
function sw13(){shEl.style.setProperty('--sw',Math.round(shEl.clientHeight*0.30*0.503)+'px')}sw13();addEventListener('resize',sw13);
var mr={at13:false,inside:false};
var DASH='<div class="mdash"><nav><span class="h">Site floors</span><div class="i">Home<span>05</span></div><div class="i">Work<span>04</span></div><div class="i">Brand<span>03</span></div><div class="i">Systems<span>02</span></div><div class="i">Studio<span>01</span></div><div class="i">Contact<span>G</span></div><span class="h">Machine Room</span><div class="i on">Work orders<span>LG</span></div><div class="i">Projects<span>No.</span></div><div class="i">Clients<span></span></div></nav><main><div class="top"><b>Work orders</b><div class="sig sm one s-live" style="color:#F1EEE7"><i style="opacity:0"></i><b></b></div></div><div class="kp"><div><b>3</b><span>New this week</span></div><div><b>2</b><span>In build</span></div><div><b>14</b><span>Running</span></div></div><div style="overflow-x:auto"><table><thead><tr><th>No.</th><th>Client</th><th>What</th><th>Status</th></tr></thead><tbody><tr><td>015</td><td>Client A</td><td>Booking system</td><td><span class="stt"><i style="border:1.5px solid #F1EEE7;box-sizing:border-box"></i>Your turn</span></td></tr><tr><td>014</td><td>Client B</td><td>Back office and app</td><td><span class="stt"><i style="background:#B7791F"></i>Attention</span></td></tr><tr><td>013</td><td>Client C</td><td>Ecommerce</td><td><span class="stt"><i style="background:#2F7D5B"></i>Running</span></td></tr><tr><td>012</td><td>Client D</td><td>Brand identity</td><td><span class="stt"><i style="background:#F1EEE7"></i>Delivered</span></td></tr></tbody></table></div><div class="sigf"><span>Built by Mother Machine · No. 001</span><span>LG · Lower ground</span></div></main></div>';
var LOGIN='<div class="login"><span class="tl">LG</span><span class="tr">Machine Room · lower ground<br>Authorised staff only</span><div class="bx"><div class="mk"><em class="e0">0</em><em class="e1">LG</em><button class="cyl" id="cyl13" aria-label="Turn your key"><i></i></button></div><h4>Turn your key.</h4><span class="hint2" id="h13">Passkey · fingerprint, face or key</span><span class="alt">Use email instead</span></div></div>';
var v13=$('v13');function draw13(pg,k){if(k!==-1){v13.hidden=true;drawSite(pg,k);return}v13.hidden=false;v13.innerHTML=mr.inside?DASH:LOGIN;if(!mr.inside)bindKey()}
var sh13=Shaft(shEl,SITE,draw13);sh13.set(0);
function bindKey(){var c=$('cyl13'),h=$('h13');if(!c)return;c.addEventListener('click',function(){if(c.classList.contains('on'))return;c.classList.add('on');
  setTimeout(function(){h.innerHTML='<span class="sig sm v3 s-send" style="color:#F1EEE7"><i></i><i></i><i></i><b class="q1"></b><b class="q2"></b><b class="q3"></b></span>Checking key'},reduce?0:700);
  setTimeout(function(){h.innerHTML='<span class="sig sm one" style="color:#F1EEE7"><b style="position:static"></b></span>Key accepted'},reduce?0:2000);
  setTimeout(async function(){if(reduce){mr.inside=true;draw13(shEl.querySelector('.pg'),-1);return}await sh13.close(true);await new Promise(function(r){setTimeout(r,650)});mr.inside=true;draw13(shEl.querySelector('.pg'),-1);await sh13.open()},reduce?0:2700)})}
function keyTo13(){if(sh13.busy)return;mr.at13=true;l13.call(-1);setTimeout(function(){sh13.ride(-1,function(lv,d){}).then(function(){l13.cur(-1)})},reduce?0:420)}
var l13=Floors($('lift13'),SITEF,{keys:false,start:0,onPick:function(k){k=+k;if(k===-1){if(!mr.at13)keyTo13();return}if(sh13.busy||k===sh13.cur)return;mr.at13=false;mr.inside=false;l13.call(k);sh13.ride(k,function(lv,d){}).then(function(){l13.cur(sh13.cur)})}});
l13.cur(0);

/* ---------- manual navigation: bar display, rail, panel ---------- */
/*HDRJS*/
var FLS=[].slice.call(document.querySelectorAll('section.fl[data-f]')),bar=$('bar'),rail=$('rail'),navL=$('navLift'),curI=-1;
var NAVF=FLS.filter(function(s){return s.dataset.f!=='LG'}).map(function(s){var h=s.querySelector('.flh h2');return {k:s.id,label:s.dataset.f,name:s.dataset.n,luce:s.dataset.luce,desc:h?h.textContent:''}});
var navDim=$('navDim');function openNav(on){navL.classList.toggle('on',on);navDim.classList.toggle('on',on);document.body.classList.toggle('navopen',on);HDR.open(on)}
navDim.addEventListener('click',function(){openNav(false)});
var nav=Floors(navL,NAVF,{cls:'fc',keys:false,start:NAVF[0].k,onPick:function(id){if(id==='-1')id='fLG';var t=nav.call(id);setTimeout(function(){openNav(false);$(id).scrollIntoView({behavior:reduce?'auto':'smooth'})},reduce?0:t)}});
rail.innerHTML=NAVF.map(function(f){return '<button data-id="'+f.k+'" aria-label="Floor '+f.label+'"><span>'+f.label+' · '+f.name+'</span><i></i></button>'}).join('');
var rb=[].slice.call(rail.querySelectorAll('button'));rb.forEach(function(b){b.addEventListener('click',function(){$(b.dataset.id).scrollIntoView({behavior:reduce?'auto':'smooth'})})});
$('dispB').addEventListener('click',function(e){e.stopPropagation();openNav(!navL.classList.contains('on'))});
addEventListener('keydown',function(e){if(e.key==='Escape')openNav(false)});
/* the real logo hangs below the bar at the top, then folds into the bar */
if(document.fonts&&document.fonts.load){Promise.all([document.fonts.load('20px MMLogoS','\uE000'),document.fonts.load('20px MMLogoW','\uE000')]).then(function(){if(document.fonts.check('20px MMLogoS','\uE000')&&document.fonts.check('20px MMLogoW','\uE000'))document.documentElement.classList.add('mmfont')}).catch(function(){})}
function mini(){bar.classList.toggle('fold',scrollY>30)}addEventListener('scroll',mini,{passive:true});mini();
/* nella testata i sei quadrati sono il palazzo: si accende quello alla stessa altezza del piano del manuale */
function setNav(i){var s=FLS[i],down=i>curI;curI=i;var l=s.dataset.luce;bar.setAttribute('data-luce',l);rail.setAttribute('data-luce',l);
  HDR.show(s.dataset.f,s.dataset.n,Math.round(i/(FLS.length-1)*5),down?-1:1);
  rb.forEach(function(b){b.classList.toggle('on',b.dataset.id===s.id)});nav.cur(s.dataset.f==='LG'?'-1':s.id)}
function pickNav(){var y=scrollY+innerHeight*0.4,i=0;FLS.forEach(function(s,j){if(s.offsetTop<=y)i=j});if(i!==curI)setNav(i)}
addEventListener('scroll',pickNav,{passive:true});
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
var bld=$('bld'),hdr=$('hdr'),nw=$('nw'),nm=$('nm'),pnl=$('pnl');
var secs=[].slice.call(bld.querySelectorAll('section')),cur=-1,bLast=0,btm;
pnl.innerHTML=secs.map(function(s,i){return '<button data-i="'+i+'" aria-label="Floor '+s.dataset.f+'"><span>'+s.dataset.f+' · '+s.dataset.n+'</span><i></i></button>'}).join('');
var pb=[].slice.call(pnl.querySelectorAll('button'));
pb.forEach(function(b){b.addEventListener('click',function(){bld.scrollTo({top:secs[+b.dataset.i].offsetTop-46,behavior:reduce?'auto':'smooth'})})});
/* la testata resta sul piano (05 Home): i locali li dicono le soglie e i quadratini a lato */
function setF(i){cur=i;var s=secs[i];hdr.setAttribute('data-luce',s.dataset.luce);pnl.classList.toggle('dk',s.dataset.luce==='notte');
  pb.forEach(function(b,j){b.classList.toggle('on',j===i)})}
function pick(){var y=bld.scrollTop+46+bld.clientHeight*0.35,i=0;secs.forEach(function(s,j){if(s.offsetTop<=y)i=j});if(i!==cur)setF(i)}
bld.addEventListener('scroll',pick,{passive:true});
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
<script>var LG={"parts": {"fr": "M0.0 -1267.6 L0.7 -1284.8 L1.8 -1294.6 L3.0 -1303.1 L6.7 -1319.9 L9.3 -1329.3 L12.1 -1337.4 L15.1 -1345.4 L19.0 -1354.4 L26.8 -1369.6 L31.1 -1376.9 L36.5 -1385.0 L42.2 -1392.8 L47.5 -1399.4 L58.9 -1411.9 L65.0 -1417.7 L72.2 -1424.1 L79.7 -1430.0 L86.5 -1434.9 L100.7 -1443.8 L109.1 -1448.2 L116.6 -1451.8 L132.0 -1457.9 L141.1 -1460.7 L149.1 -1462.9 L165.3 -1466.0 L178.2 -1467.5 L190.0 -1468.0 L203.0 -1467.7 L214.8 -1466.6 L226.5 -1464.8 L238.0 -1462.3 L250.5 -1458.6 L261.6 -1454.6 L272.5 -1449.8 L283.1 -1444.3 L294.3 -1437.6 L304.1 -1430.7 L313.5 -1423.3 L323.3 -1414.4 L331.7 -1405.8 L339.8 -1396.4 L347.9 -1405.8 L357.1 -1415.3 L367.0 -1424.1 L377.4 -1432.1 L388.3 -1439.5 L399.6 -1446.0 L411.4 -1451.8 L423.5 -1456.7 L435.9 -1460.7 L447.4 -1463.7 L460.1 -1466.0 L473.0 -1467.5 L486.0 -1468.0 L499.0 -1467.6 L511.9 -1466.3 L524.7 -1464.1 L535.1 -1461.7 L545.3 -1458.6 L555.3 -1455.0 L565.2 -1450.8 L573.7 -1446.6 L583.1 -1441.4 L592.1 -1435.6 L600.9 -1429.3 L609.3 -1422.5 L617.3 -1415.3 L624.1 -1408.4 L631.3 -1400.3 L638.1 -1391.9 L644.5 -1383.0 L649.7 -1374.8 L655.2 -1365.3 L660.6 -1354.4 L665.4 -1343.2 L669.5 -1331.6 L672.9 -1319.9 L675.7 -1307.9 L677.7 -1295.8 L679.0 -1283.6 L679.6 -1271.3 L679.6 -0.0 L589.6 -0.0 L589.6 -1267.6 L589.2 -1278.0 L587.9 -1289.8 L585.7 -1300.6 L582.7 -1311.2 L578.9 -1321.4 L574.4 -1331.2 L569.1 -1340.4 L563.1 -1349.0 L556.4 -1356.9 L549.2 -1364.1 L541.5 -1370.4 L533.2 -1375.9 L524.6 -1380.4 L515.7 -1384.0 L506.6 -1386.6 L496.6 -1388.3 L487.2 -1388.8 L477.8 -1388.3 L467.8 -1386.6 L458.7 -1384.0 L449.8 -1380.4 L441.2 -1375.9 L432.9 -1370.4 L425.2 -1364.1 L418.0 -1356.9 L411.3 -1349.0 L405.3 -1340.4 L400.0 -1331.2 L395.5 -1321.4 L391.7 -1311.2 L388.7 -1300.6 L386.5 -1289.8 L385.2 -1278.0 L384.8 -1267.6 L384.8 -0.0 L294.8 -0.0 L294.8 -1267.6 L294.4 -1278.0 L293.2 -1289.1 L291.1 -1299.9 L287.9 -1311.2 L284.1 -1321.4 L279.6 -1331.2 L274.3 -1340.4 L268.3 -1349.0 L261.6 -1356.9 L254.4 -1364.1 L246.7 -1370.4 L238.4 -1375.9 L229.8 -1380.4 L220.9 -1384.0 L211.8 -1386.6 L201.8 -1388.3 L192.4 -1388.8 L183.0 -1388.3 L173.0 -1386.6 L163.9 -1384.0 L155.0 -1380.4 L146.4 -1375.9 L138.1 -1370.4 L130.4 -1364.1 L123.2 -1356.9 L116.5 -1349.0 L110.5 -1340.4 L105.2 -1331.2 L100.7 -1321.4 L96.6 -1310.5 L93.7 -1299.9 L91.6 -1289.1 L90.4 -1278.0 L90.0 -1267.6 L90.0 -0.0 L0.0 -0.0 L0.0 -1267.6Z", "t0": "M2250.2 -940.0 L2160.2 -940.0 L2160.2 -1205.2 L2159.7 -1219.8 L2158.6 -1231.0 L2156.8 -1242.1 L2154.5 -1253.1 L2151.6 -1263.9 L2148.0 -1274.4 L2144.4 -1283.7 L2139.8 -1293.7 L2134.6 -1303.4 L2129.0 -1312.8 L2122.8 -1321.7 L2116.1 -1330.2 L2108.3 -1338.9 L2100.7 -1346.4 L2091.9 -1354.0 L2083.6 -1360.3 L2074.9 -1366.0 L2065.9 -1371.2 L2056.6 -1375.7 L2047.1 -1379.5 L2036.4 -1383.0 L2026.6 -1385.5 L2016.6 -1387.3 L2005.5 -1388.5 L1995.4 -1388.8 L1985.3 -1388.5 L1974.2 -1387.3 L1964.2 -1385.5 L1954.4 -1383.0 L1944.7 -1379.9 L1935.1 -1376.1 L1925.9 -1371.7 L1915.9 -1366.0 L1906.4 -1359.7 L1898.0 -1353.3 L1890.1 -1346.4 L1882.5 -1338.9 L1875.3 -1331.0 L1868.0 -1321.7 L1861.8 -1312.8 L1856.2 -1303.4 L1851.0 -1293.7 L1846.4 -1283.7 L1842.8 -1274.4 L1839.2 -1263.9 L1836.3 -1253.1 L1834.0 -1242.1 L1832.2 -1231.0 L1831.1 -1219.8 L1830.6 -1205.2 L1830.6 -940.0 L1740.6 -940.0 L1740.6 -1710.0 L1830.6 -1710.0 L1830.6 -1405.6 L1841.1 -1414.3 L1852.5 -1422.8 L1864.4 -1430.6 L1875.3 -1437.0 L1886.5 -1442.8 L1899.3 -1448.6 L1911.0 -1453.2 L1924.4 -1457.6 L1938.0 -1461.3 L1950.3 -1463.9 L1964.2 -1466.0 L1976.7 -1467.3 L1989.1 -1467.9 L2003.2 -1467.9 L2017.3 -1467.0 L2029.7 -1465.6 L2042.0 -1463.6 L2055.8 -1460.5 L2069.4 -1456.7 L2081.2 -1452.6 L2094.4 -1447.4 L2105.8 -1442.1 L2116.9 -1436.2 L2129.1 -1428.9 L2139.5 -1421.9 L2150.9 -1413.4 L2161.8 -1404.2 L2171.1 -1395.5 L2179.9 -1386.4 L2189.4 -1375.6 L2198.2 -1364.3 L2205.5 -1353.9 L2213.9 -1340.3 L2221.6 -1326.2 L2228.3 -1311.7 L2234.2 -1296.8 L2239.2 -1281.5 L2243.3 -1265.9 L2246.4 -1250.1 L2248.6 -1234.2 L2249.7 -1221.3 L2250.2 -1206.8 L2250.2 -940.0ZM3040.2 -940.0 L2950.2 -940.0 L2950.3 -1272.5 L2951.1 -1287.2 L2952.8 -1300.6 L2955.4 -1313.9 L2958.8 -1326.9 L2961.4 -1335.1 L2964.8 -1344.3 L2968.7 -1353.3 L2972.9 -1362.1 L2977.6 -1370.6 L2982.6 -1378.9 L2988.1 -1387.0 L2993.9 -1394.7 L3000.0 -1402.2 L3005.7 -1408.4 L3012.5 -1415.3 L3019.6 -1421.7 L3027.0 -1427.8 L3034.7 -1433.5 L3042.7 -1438.9 L3050.9 -1443.8 L3059.3 -1448.2 L3067.9 -1452.3 L3076.7 -1455.9 L3085.6 -1459.0 L3094.7 -1461.7 L3103.9 -1463.9 L3112.0 -1465.5 L3121.4 -1466.8 L3130.8 -1467.6 L3140.2 -1468.0 L3149.7 -1467.9 L3159.1 -1467.3 L3168.5 -1466.2 L3177.8 -1464.6 L3187.1 -1462.6 L3196.2 -1460.1 L3205.2 -1457.1 L3215.1 -1453.2 L3224.9 -1448.8 L3234.3 -1443.8 L3243.5 -1438.2 L3252.4 -1432.1 L3261.0 -1425.6 L3269.2 -1418.5 L3277.0 -1411.0 L3284.4 -1403.1 L3291.3 -1394.7 L3297.8 -1386.0 L3303.9 -1376.9 L3309.4 -1367.4 L3314.5 -1357.7 L3318.7 -1348.4 L3218.9 -1348.4 L3211.4 -1357.4 L3203.1 -1365.4 L3194.2 -1372.3 L3184.1 -1378.4 L3174.1 -1382.9 L3163.2 -1386.3 L3152.0 -1388.3 L3141.3 -1388.8 L3130.1 -1387.9 L3118.9 -1385.5 L3108.7 -1382.0 L3098.3 -1376.8 L3088.3 -1370.4 L3079.1 -1362.7 L3070.6 -1353.8 L3063.0 -1343.9 L3058.2 -1336.2 L3054.1 -1328.6 L3050.6 -1320.8 L3047.3 -1311.9 L3044.8 -1303.5 L3042.7 -1294.2 L3041.3 -1285.4 L3040.4 -1275.8 L3040.2 -1267.6 L3040.2 -940.0ZM1289.5 -1193.4 L1288.9 -1180.3 L1287.6 -1167.2 L1285.8 -1154.2 L1283.3 -1141.3 L1280.2 -1128.5 L1276.5 -1115.9 L1272.2 -1103.5 L1267.3 -1091.4 L1261.8 -1079.5 L1255.8 -1067.9 L1249.3 -1056.6 L1242.2 -1045.7 L1234.6 -1035.1 L1226.5 -1024.9 L1217.9 -1015.2 L1208.9 -1005.9 L1199.4 -997.1 L1189.6 -988.7 L1179.3 -980.9 L1167.3 -972.7 L1156.4 -966.0 L1145.1 -959.9 L1133.5 -954.3 L1121.7 -949.4 L1109.6 -945.0 L1097.4 -941.3 L1085.0 -938.2 L1072.5 -935.7 L1059.8 -933.8 L1047.1 -932.6 L1034.4 -932.0 L1021.6 -932.1 L1008.9 -932.9 L996.2 -934.2 L983.6 -936.2 L971.1 -938.9 L958.7 -942.2 L946.5 -946.0 L934.5 -950.6 L922.8 -955.7 L911.3 -961.4 L900.1 -967.6 L889.2 -974.5 L878.6 -981.8 L868.4 -989.7 L858.6 -998.1 L849.2 -1007.0 L840.2 -1016.4 L831.7 -1026.2 L823.7 -1036.4 L816.1 -1047.0 L809.1 -1058.0 L802.6 -1069.3 L796.6 -1081.0 L791.3 -1092.9 L786.5 -1105.1 L782.2 -1117.5 L778.6 -1130.1 L775.6 -1142.9 L773.2 -1155.8 L771.4 -1168.8 L770.2 -1181.9 L769.6 -1195.1 L769.7 -1208.2 L770.4 -1221.4 L771.8 -1234.4 L773.7 -1247.4 L776.3 -1260.3 L779.4 -1273.1 L783.2 -1285.6 L787.6 -1298.0 L792.6 -1310.1 L798.1 -1322.0 L804.2 -1333.5 L810.8 -1344.8 L818.0 -1355.7 L825.6 -1366.2 L833.8 -1376.3 L842.4 -1386.0 L851.5 -1395.2 L861.0 -1404.0 L870.9 -1412.3 L881.2 -1420.1 L891.9 -1427.3 L902.8 -1434.0 L914.1 -1440.1 L925.7 -1445.7 L937.5 -1450.6 L949.6 -1455.0 L961.8 -1458.7 L974.2 -1461.8 L986.7 -1464.3 L999.4 -1466.2 L1012.1 -1467.4 L1024.8 -1468.0 L1037.6 -1467.9 L1050.3 -1467.1 L1063.0 -1465.8 L1075.6 -1463.8 L1086.6 -1461.5 L1098.9 -1458.3 L1111.2 -1454.5 L1123.2 -1450.0 L1135.0 -1445.0 L1146.5 -1439.4 L1157.8 -1433.2 L1168.7 -1426.4 L1179.3 -1419.1 L1189.6 -1411.3 L1199.4 -1402.9 L1208.9 -1394.1 L1217.9 -1384.8 L1226.5 -1375.1 L1234.6 -1364.9 L1242.2 -1354.3 L1249.3 -1343.4 L1255.8 -1332.1 L1261.8 -1320.5 L1267.3 -1308.6 L1272.2 -1296.5 L1276.5 -1284.1 L1280.2 -1271.5 L1283.3 -1258.7 L1285.8 -1245.8 L1287.6 -1232.8 L1288.9 -1219.7 L1289.5 -1206.6 L1289.5 -1193.4ZM1199.5 -1204.6 L1199.1 -1213.9 L1198.3 -1223.1 L1197.1 -1232.3 L1195.5 -1241.4 L1193.4 -1250.4 L1191.0 -1259.2 L1188.2 -1267.9 L1185.0 -1276.5 L1181.4 -1284.9 L1177.5 -1293.1 L1172.7 -1302.0 L1168.0 -1309.7 L1163.0 -1317.1 L1157.6 -1324.2 L1152.0 -1331.0 L1146.1 -1337.5 L1139.8 -1343.7 L1133.4 -1349.5 L1126.6 -1355.0 L1119.7 -1360.1 L1112.5 -1364.8 L1105.1 -1369.2 L1097.5 -1373.1 L1089.8 -1376.6 L1081.9 -1379.6 L1073.9 -1382.3 L1065.8 -1384.5 L1057.6 -1386.2 L1049.4 -1387.5 L1041.1 -1388.4 L1032.7 -1388.8 L1024.4 -1388.7 L1016.1 -1388.2 L1007.8 -1387.2 L999.5 -1385.8 L991.3 -1384.0 L983.3 -1381.6 L975.3 -1378.9 L967.4 -1375.7 L959.8 -1372.1 L952.2 -1368.1 L944.9 -1363.7 L937.8 -1358.9 L930.9 -1353.7 L924.2 -1348.1 L917.8 -1342.2 L911.6 -1335.9 L905.8 -1329.3 L900.2 -1322.4 L894.9 -1315.2 L890.0 -1307.8 L885.4 -1300.0 L881.2 -1292.0 L877.3 -1283.9 L873.8 -1275.4 L870.6 -1266.9 L867.9 -1258.1 L865.5 -1249.2 L863.5 -1240.2 L861.9 -1231.1 L860.8 -1222.0 L860.0 -1212.7 L859.6 -1203.5 L859.7 -1193.1 L860.2 -1183.8 L861.1 -1174.6 L862.5 -1165.4 L864.2 -1156.4 L866.3 -1147.4 L868.8 -1138.6 L874.6 -1122.4 L878.2 -1114.1 L882.2 -1105.9 L886.5 -1098.0 L891.2 -1090.3 L896.2 -1082.9 L901.6 -1075.8 L907.2 -1069.0 L913.1 -1062.5 L919.4 -1056.3 L925.8 -1050.5 L932.6 -1045.0 L939.5 -1039.9 L946.7 -1035.2 L954.1 -1030.8 L961.7 -1026.9 L969.4 -1023.4 L977.3 -1020.4 L985.3 -1017.7 L993.4 -1015.5 L1001.6 -1013.8 L1009.8 -1012.5 L1018.1 -1011.6 L1026.5 -1011.2 L1034.8 -1011.3 L1043.1 -1011.8 L1051.4 -1012.8 L1059.7 -1014.2 L1067.9 -1016.0 L1082.9 -1020.7 L1090.8 -1023.9 L1098.5 -1027.4 L1106.0 -1031.4 L1113.4 -1035.7 L1120.5 -1040.5 L1127.5 -1045.6 L1134.2 -1051.2 L1140.6 -1057.0 L1146.8 -1063.3 L1152.7 -1069.8 L1158.3 -1076.7 L1163.6 -1083.8 L1168.6 -1091.3 L1173.2 -1099.0 L1177.5 -1106.9 L1181.4 -1115.1 L1185.0 -1123.5 L1188.2 -1132.1 L1191.0 -1140.8 L1193.4 -1149.6 L1195.5 -1158.6 L1197.1 -1167.7 L1198.3 -1176.9 L1199.1 -1186.1 L1199.5 -1195.4 L1199.5 -1204.6ZM2858.0 -1234.4 L2859.8 -1214.8 L2860.2 -1196.7 L2859.4 -1178.6 L2857.3 -1160.4 L2434.0 -1160.4 L2436.9 -1147.4 L2440.9 -1134.2 L2445.6 -1121.4 L2451.3 -1109.0 L2457.7 -1097.0 L2464.9 -1085.7 L2472.8 -1074.9 L2481.5 -1064.9 L2490.7 -1055.5 L2500.6 -1047.0 L2511.0 -1039.3 L2521.0 -1033.0 L2532.3 -1026.9 L2543.9 -1021.8 L2555.9 -1017.7 L2568.1 -1014.6 L2579.4 -1012.6 L2590.8 -1011.5 L2602.3 -1011.2 L2612.7 -1011.7 L2624.1 -1013.1 L2634.4 -1015.1 L2645.5 -1018.0 L2655.5 -1021.5 L2666.2 -1026.0 L2675.7 -1030.8 L2685.8 -1036.9 L2694.6 -1043.0 L2703.1 -1049.7 L2712.0 -1057.8 L2720.4 -1066.5 L2727.8 -1075.2 L2830.3 -1075.2 L2823.2 -1062.2 L2814.6 -1048.4 L2805.2 -1035.1 L2796.0 -1023.7 L2785.2 -1011.7 L2773.6 -1000.3 L2761.4 -989.7 L2749.9 -980.9 L2737.9 -972.7 L2724.2 -964.4 L2709.9 -957.0 L2695.3 -950.6 L2681.8 -945.5 L2666.5 -940.9 L2650.9 -937.1 L2636.8 -934.7 L2624.1 -933.1 L2611.4 -932.2 L2598.6 -932.0 L2585.8 -932.4 L2573.1 -933.5 L2560.5 -935.1 L2547.9 -937.5 L2535.5 -940.4 L2523.2 -944.0 L2511.1 -948.2 L2499.2 -953.0 L2487.6 -958.4 L2476.2 -964.4 L2465.2 -971.0 L2454.4 -978.1 L2444.0 -985.7 L2434.0 -993.9 L2424.4 -1002.5 L2415.2 -1011.7 L2406.5 -1021.2 L2398.2 -1031.3 L2390.4 -1041.7 L2383.1 -1052.5 L2376.4 -1063.6 L2370.2 -1075.1 L2364.5 -1086.9 L2359.4 -1099.0 L2354.9 -1111.3 L2350.9 -1123.8 L2348.0 -1134.9 L2345.2 -1147.7 L2343.0 -1160.7 L2341.5 -1173.7 L2340.5 -1186.8 L2340.2 -1200.0 L2340.5 -1213.2 L2341.5 -1226.3 L2343.0 -1239.3 L2345.2 -1252.3 L2348.0 -1265.1 L2351.9 -1279.4 L2355.9 -1291.8 L2360.6 -1304.1 L2365.8 -1316.1 L2371.7 -1327.8 L2378.0 -1339.2 L2384.9 -1350.3 L2392.3 -1361.0 L2400.2 -1371.3 L2408.6 -1381.2 L2417.5 -1390.7 L2426.8 -1399.7 L2436.5 -1408.2 L2446.6 -1416.2 L2457.1 -1423.7 L2467.9 -1430.7 L2479.0 -1437.1 L2490.5 -1443.0 L2502.2 -1448.2 L2514.1 -1452.9 L2526.3 -1456.9 L2538.6 -1460.4 L2551.0 -1463.2 L2563.6 -1465.3 L2576.3 -1466.9 L2589.0 -1467.8 L2603.4 -1468.0 L2616.1 -1467.5 L2628.9 -1466.4 L2641.5 -1464.6 L2654.0 -1462.2 L2666.5 -1459.1 L2678.7 -1455.5 L2690.8 -1451.2 L2702.6 -1446.3 L2714.2 -1440.8 L2725.6 -1434.8 L2736.6 -1428.2 L2747.3 -1421.0 L2757.6 -1413.3 L2767.6 -1405.1 L2777.2 -1396.4 L2786.3 -1387.2 L2795.0 -1377.5 L2803.2 -1367.5 L2811.8 -1355.7 L2819.0 -1344.8 L2825.6 -1333.5 L2831.7 -1322.0 L2837.2 -1310.1 L2842.2 -1298.0 L2846.6 -1285.6 L2850.4 -1273.1 L2853.5 -1260.3 L2856.1 -1247.4 L2858.0 -1234.4ZM2766.4 -1239.6 L2761.9 -1258.1 L2756.9 -1273.3 L2750.6 -1288.0 L2743.8 -1301.0 L2735.5 -1314.3 L2726.2 -1326.8 L2716.7 -1337.5 L2705.6 -1348.1 L2693.8 -1357.6 L2681.3 -1366.0 L2668.1 -1373.1 L2655.5 -1378.5 L2641.5 -1383.1 L2627.2 -1386.4 L2613.7 -1388.2 L2599.2 -1388.8 L2585.6 -1388.1 L2571.1 -1386.0 L2556.9 -1382.6 L2542.9 -1377.8 L2529.4 -1371.7 L2516.4 -1364.3 L2504.0 -1355.7 L2493.2 -1346.7 L2482.2 -1335.9 L2472.2 -1324.2 L2463.0 -1311.5 L2455.5 -1299.0 L2448.4 -1284.9 L2442.4 -1270.1 L2437.5 -1254.8 L2434.0 -1239.6 L2766.4 -1239.6ZM1469.6 -1710.0 L1469.6 -1460.0 L1677.6 -1460.0 L1677.6 -1380.8 L1469.6 -1380.8 L1469.6 -940.0 L1379.6 -940.0 L1379.6 -1710.0 L1469.6 -1710.0Z", "c1": "M0.0 -327.6 L0.8 -346.0 L2.6 -360.6 L5.5 -375.1 L9.3 -389.3 L14.2 -403.2 L20.0 -416.6 L26.8 -429.6 L34.4 -442.0 L42.9 -453.8 L53.1 -465.8 L63.2 -476.1 L74.0 -485.6 L85.5 -494.2 L97.6 -502.0 L110.1 -508.8 L123.2 -514.6 L137.7 -519.7 L151.4 -523.4 L165.3 -526.0 L180.6 -527.6 L195.9 -528.0 L211.3 -527.0 L225.3 -525.0 L240.3 -521.7 L253.9 -517.5 L268.2 -511.8 L282.1 -504.9 L295.3 -496.9 L307.0 -488.6 L319.0 -478.5 L330.1 -467.6 L339.8 -456.4 L346.2 -464.0 L353.7 -471.9 L361.5 -479.3 L369.8 -486.3 L378.4 -492.8 L387.3 -498.9 L396.5 -504.3 L406.0 -509.3 L415.8 -513.7 L425.7 -517.5 L435.9 -520.7 L446.2 -523.4 L456.6 -525.5 L467.2 -526.9 L477.8 -527.8 L488.4 -528.0 L497.8 -527.7 L507.2 -526.9 L516.6 -525.6 L525.9 -523.9 L535.1 -521.7 L544.2 -519.0 L553.1 -515.9 L561.9 -512.3 L570.5 -508.2 L578.9 -503.8 L587.1 -498.9 L595.1 -493.5 L602.8 -487.8 L610.2 -481.7 L617.3 -475.3 L624.1 -468.4 L630.5 -461.3 L636.7 -453.8 L642.4 -446.0 L647.8 -437.9 L652.8 -429.6 L657.4 -421.0 L661.6 -412.2 L665.4 -403.2 L668.7 -394.0 L671.7 -384.6 L674.1 -375.1 L676.1 -365.5 L677.5 -357.0 L678.7 -347.2 L679.4 -337.4 L679.6 -327.6 L589.6 -327.6 L589.1 -339.5 L587.6 -351.2 L585.2 -362.8 L581.8 -374.0 L577.5 -384.7 L572.3 -394.9 L566.4 -404.5 L560.1 -412.8 L552.6 -420.8 L544.6 -428.0 L536.0 -434.1 L527.0 -439.3 L517.5 -443.4 L507.8 -446.3 L497.9 -448.1 L487.8 -448.8 L477.8 -448.3 L467.8 -446.6 L458.1 -443.8 L448.6 -439.9 L439.5 -434.8 L430.8 -428.8 L422.7 -421.8 L414.8 -413.3 L408.0 -404.5 L402.1 -394.9 L396.9 -384.7 L392.6 -374.0 L389.2 -362.8 L386.8 -351.2 L385.3 -339.5 L384.8 -327.6 L294.8 -327.6 L294.3 -339.5 L292.8 -351.2 L290.4 -362.8 L287.0 -374.0 L282.7 -384.7 L277.9 -394.3 L272.0 -403.9 L265.3 -412.8 L257.8 -420.8 L249.8 -428.0 L241.2 -434.1 L232.2 -439.3 L222.7 -443.4 L213.0 -446.3 L203.1 -448.1 L193.0 -448.8 L183.0 -448.3 L173.0 -446.6 L163.3 -443.8 L153.8 -439.9 L144.7 -434.8 L136.0 -428.8 L127.9 -421.8 L120.4 -413.8 L113.6 -405.1 L107.6 -395.6 L102.4 -385.4 L98.0 -374.7 L94.6 -363.5 L92.0 -351.2 L90.5 -339.5 L90.0 -327.6 L0.0 -327.6Z", "t1": "M2442.3 -0.0 L2352.3 -0.0 L2352.3 -265.2 L2351.8 -279.8 L2350.7 -291.0 L2348.9 -302.1 L2346.6 -313.1 L2343.7 -323.9 L2340.1 -334.4 L2336.5 -343.7 L2331.9 -353.7 L2326.7 -363.4 L2321.1 -372.8 L2314.9 -381.7 L2308.2 -390.2 L2300.4 -398.9 L2292.8 -406.4 L2284.0 -414.0 L2275.7 -420.3 L2267.0 -426.0 L2257.9 -431.2 L2248.7 -435.7 L2238.2 -439.9 L2228.5 -443.0 L2218.6 -445.5 L2208.7 -447.3 L2198.6 -448.4 L2187.5 -448.8 L2176.4 -448.4 L2166.3 -447.3 L2156.3 -445.5 L2146.5 -443.0 L2135.8 -439.5 L2126.3 -435.7 L2117.0 -431.2 L2108.0 -426.0 L2099.3 -420.3 L2090.9 -414.0 L2082.2 -406.4 L2074.6 -398.9 L2067.4 -391.0 L2060.7 -382.5 L2053.9 -372.8 L2048.3 -363.4 L2043.1 -353.7 L2038.5 -343.7 L2034.8 -334.4 L2031.3 -323.9 L2028.4 -313.1 L2026.1 -302.1 L2024.3 -291.0 L2023.2 -279.8 L2022.7 -265.2 L2022.7 -0.0 L1932.7 -0.0 L1932.7 -770.0 L2022.7 -770.0 L2022.7 -465.6 L2033.2 -474.3 L2044.6 -482.8 L2056.5 -490.6 L2067.4 -497.0 L2080.0 -503.5 L2091.4 -508.6 L2103.1 -513.2 L2116.5 -517.6 L2130.1 -521.3 L2142.4 -523.9 L2154.7 -525.8 L2168.7 -527.3 L2182.8 -528.0 L2195.3 -527.9 L2209.3 -527.0 L2221.8 -525.6 L2234.1 -523.6 L2247.9 -520.5 L2261.5 -516.7 L2273.3 -512.6 L2286.4 -507.4 L2297.8 -502.1 L2310.3 -495.4 L2321.2 -488.9 L2331.6 -481.9 L2343.0 -473.4 L2353.9 -464.2 L2363.2 -455.5 L2372.0 -446.4 L2381.4 -435.6 L2390.3 -424.3 L2397.6 -413.9 L2406.0 -400.3 L2413.7 -386.2 L2420.4 -371.7 L2426.3 -356.8 L2431.3 -341.5 L2435.4 -325.9 L2438.5 -310.1 L2440.7 -294.2 L2441.8 -281.3 L2442.3 -266.8 L2442.3 -0.0ZM1199.6 -57.2 L1184.5 -44.7 L1174.0 -37.2 L1163.3 -30.1 L1152.2 -23.6 L1140.8 -17.7 L1129.1 -12.4 L1117.2 -7.7 L1105.1 -3.5 L1092.8 -0.0 L1080.3 2.9 L1066.2 5.3 L1053.5 6.9 L1040.8 7.8 L1028.0 8.0 L1015.2 7.6 L1002.5 6.5 L989.9 4.9 L975.8 2.2 L963.3 -0.9 L951.1 -4.5 L939.0 -8.8 L927.2 -13.7 L914.1 -19.9 L902.8 -26.0 L891.9 -32.7 L881.2 -39.9 L870.9 -47.7 L861.0 -56.0 L851.5 -64.8 L842.4 -74.0 L832.7 -84.9 L824.6 -95.1 L817.0 -105.7 L809.9 -116.6 L803.4 -127.9 L797.4 -139.5 L791.9 -151.4 L787.0 -163.5 L782.2 -177.5 L778.6 -190.1 L775.6 -202.9 L772.9 -217.4 L771.2 -230.5 L770.1 -243.6 L769.6 -256.7 L769.8 -269.9 L770.7 -284.6 L772.2 -297.7 L774.6 -312.3 L777.4 -325.1 L780.8 -337.8 L784.8 -350.3 L789.4 -362.6 L794.6 -374.6 L800.3 -386.3 L806.6 -397.8 L813.4 -408.9 L821.7 -421.0 L829.6 -431.3 L838.0 -441.2 L846.9 -450.7 L856.2 -459.7 L865.9 -468.2 L876.0 -476.2 L885.2 -482.8 L893.2 -488.2 L902.8 -494.0 L912.7 -499.4 L922.8 -504.3 L933.1 -508.8 L943.5 -512.9 L954.1 -516.5 L964.9 -519.6 L974.2 -521.8 L985.1 -524.1 L996.2 -525.8 L1007.3 -527.0 L1018.4 -527.8 L1029.6 -528.0 L1040.8 -527.8 L1051.9 -527.0 L1063.0 -525.8 L1074.1 -524.1 L1085.0 -521.8 L1095.9 -519.1 L1106.6 -516.0 L1115.7 -512.9 L1126.1 -508.8 L1135.0 -505.0 L1145.1 -500.1 L1155.0 -494.8 L1164.6 -489.0 L1174.0 -482.8 L1183.2 -476.2 L1192.1 -469.2 L1199.6 -462.8 L1199.6 -520.0 L1289.6 -520.0 L1289.6 -0.0 L1199.6 -0.0 L1199.6 -57.2ZM1199.5 -265.8 L1199.1 -275.0 L1198.2 -284.3 L1196.9 -293.4 L1195.2 -302.5 L1192.9 -312.6 L1190.4 -321.4 L1187.4 -330.1 L1184.2 -338.6 L1180.5 -346.9 L1176.5 -355.1 L1172.1 -363.0 L1167.4 -370.6 L1162.3 -378.0 L1157.0 -385.1 L1151.3 -391.9 L1145.3 -398.3 L1139.1 -404.5 L1132.5 -410.3 L1125.8 -415.7 L1118.8 -420.7 L1111.6 -425.4 L1104.2 -429.7 L1096.6 -433.5 L1088.8 -437.0 L1080.9 -440.0 L1072.9 -442.6 L1064.8 -444.7 L1056.6 -446.4 L1048.3 -447.6 L1039.0 -448.5 L1030.6 -448.8 L1022.3 -448.6 L1014.0 -448.0 L1005.7 -446.9 L997.5 -445.4 L989.3 -443.4 L981.3 -441.0 L973.3 -438.2 L965.5 -434.9 L957.9 -431.2 L950.4 -427.0 L943.1 -422.5 L936.0 -417.6 L928.3 -411.6 L921.8 -405.9 L915.4 -399.9 L909.4 -393.5 L903.6 -386.8 L898.2 -379.8 L893.1 -372.5 L888.3 -364.9 L883.8 -357.1 L879.7 -349.0 L875.9 -340.7 L872.5 -332.3 L869.5 -323.6 L866.9 -314.8 L864.7 -305.9 L862.9 -296.8 L861.4 -287.7 L860.4 -278.5 L859.8 -269.3 L859.6 -260.0 L859.8 -250.7 L860.4 -241.5 L861.4 -232.3 L862.9 -223.2 L864.7 -214.1 L866.9 -205.2 L869.5 -196.4 L872.5 -187.7 L875.9 -179.3 L879.7 -171.0 L883.8 -162.9 L888.3 -155.1 L893.1 -147.5 L902.9 -134.1 L908.7 -127.3 L914.7 -120.9 L920.9 -114.8 L927.5 -109.0 L934.3 -103.7 L941.3 -98.7 L948.5 -94.0 L956.0 -89.8 L970.4 -83.0 L978.3 -80.0 L986.3 -77.4 L994.4 -75.3 L1002.6 -73.6 L1010.9 -72.4 L1019.2 -71.6 L1027.5 -71.2 L1035.9 -71.3 L1044.2 -71.9 L1052.5 -72.9 L1060.7 -74.4 L1068.9 -76.3 L1076.9 -78.7 L1084.9 -81.5 L1092.7 -84.7 L1100.4 -88.3 L1107.9 -92.4 L1115.2 -96.9 L1128.3 -106.3 L1135.0 -111.9 L1141.4 -117.8 L1147.6 -124.1 L1153.4 -130.7 L1159.0 -137.6 L1164.3 -144.8 L1169.2 -152.2 L1173.8 -160.0 L1178.0 -168.0 L1181.9 -176.1 L1185.4 -184.6 L1188.6 -193.1 L1191.3 -201.9 L1193.7 -210.8 L1195.7 -219.8 L1197.3 -228.9 L1198.4 -238.0 L1199.2 -247.3 L1199.6 -256.5 L1199.5 -265.8ZM1869.7 -135.2 L1861.0 -119.4 L1854.0 -108.4 L1845.5 -96.4 L1837.5 -86.2 L1829.0 -76.4 L1820.0 -67.0 L1810.6 -58.1 L1800.8 -49.7 L1790.6 -41.8 L1778.7 -33.6 L1767.8 -26.8 L1756.5 -20.6 L1745.0 -15.0 L1733.2 -10.0 L1721.2 -5.5 L1708.9 -1.7 L1695.0 1.8 L1682.5 4.3 L1669.8 6.2 L1657.1 7.4 L1644.4 8.0 L1631.6 7.9 L1618.9 7.1 L1606.2 5.8 L1593.6 3.8 L1581.1 1.1 L1568.7 -2.2 L1556.5 -6.0 L1544.5 -10.6 L1532.8 -15.7 L1519.9 -22.1 L1508.7 -28.5 L1496.5 -36.3 L1486.0 -43.8 L1475.9 -51.8 L1466.2 -60.3 L1456.9 -69.3 L1447.0 -80.0 L1438.6 -90.0 L1430.8 -100.4 L1423.4 -111.1 L1416.6 -122.2 L1410.3 -133.7 L1403.9 -146.9 L1398.8 -159.0 L1394.3 -171.3 L1390.3 -183.8 L1387.0 -196.5 L1384.3 -209.3 L1382.2 -222.3 L1380.7 -235.4 L1379.8 -248.5 L1379.6 -261.6 L1380.0 -274.8 L1381.0 -287.9 L1382.9 -302.6 L1385.2 -315.5 L1388.2 -328.3 L1392.2 -342.5 L1396.5 -354.9 L1401.3 -367.1 L1406.6 -379.0 L1412.6 -390.7 L1419.1 -402.0 L1426.1 -413.0 L1433.7 -423.6 L1441.7 -433.8 L1450.2 -443.6 L1459.2 -453.0 L1467.4 -460.8 L1477.1 -469.2 L1487.3 -477.2 L1497.8 -484.6 L1508.7 -491.5 L1519.9 -497.9 L1529.9 -503.0 L1541.6 -508.2 L1553.5 -512.9 L1565.7 -516.9 L1578.0 -520.4 L1590.4 -523.2 L1603.0 -525.3 L1615.7 -526.9 L1628.4 -527.8 L1639.6 -528.0 L1652.4 -527.7 L1665.1 -526.7 L1677.7 -525.1 L1690.3 -522.9 L1701.2 -520.4 L1713.5 -516.9 L1725.7 -512.9 L1737.6 -508.2 L1749.3 -503.0 L1760.8 -497.1 L1771.9 -490.7 L1788.0 -480.1 L1802.1 -469.2 L1815.4 -457.5 L1827.9 -444.8 L1840.6 -430.0 L1851.2 -415.7 L1861.0 -400.6 L1869.7 -384.8 L1767.2 -384.8 L1756.8 -396.7 L1745.8 -407.4 L1734.0 -417.0 L1721.6 -425.4 L1708.5 -432.6 L1694.9 -438.5 L1679.9 -443.4 L1665.6 -446.6 L1654.2 -448.1 L1642.7 -448.8 L1631.3 -448.6 L1619.8 -447.5 L1608.5 -445.6 L1597.3 -442.9 L1586.3 -439.3 L1575.5 -434.9 L1561.3 -427.6 L1547.8 -418.9 L1535.0 -408.8 L1523.1 -397.5 L1512.2 -385.1 L1502.4 -371.5 L1493.8 -357.1 L1486.4 -341.8 L1480.3 -325.8 L1475.5 -309.2 L1472.1 -292.3 L1470.1 -275.0 L1469.6 -257.7 L1470.5 -240.3 L1472.9 -223.2 L1476.6 -206.3 L1480.3 -194.2 L1484.6 -182.4 L1490.2 -170.0 L1496.0 -159.0 L1502.4 -148.5 L1510.2 -137.6 L1517.9 -128.1 L1526.2 -119.3 L1535.8 -110.5 L1545.2 -103.0 L1554.9 -96.3 L1566.0 -89.8 L1576.5 -84.7 L1588.3 -80.0 L1599.3 -76.6 L1610.5 -74.0 L1620.9 -72.4 L1632.3 -71.4 L1642.7 -71.2 L1654.2 -71.9 L1664.5 -73.2 L1674.8 -75.3 L1685.9 -78.4 L1695.9 -81.8 L1705.6 -86.0 L1716.0 -91.4 L1725.2 -96.9 L1734.9 -103.7 L1744.2 -111.2 L1752.2 -118.6 L1759.8 -126.5 L1767.2 -135.2 L1869.7 -135.2ZM2642.1 -0.0 L2552.1 -0.0 L2552.1 -520.0 L2642.1 -520.0 L2642.1 -0.0ZM2751.9 -0.0 L2751.9 -268.4 L2752.8 -287.7 L2755.1 -306.9 L2756.8 -316.5 L2759.1 -327.5 L2764.3 -346.1 L2770.7 -364.3 L2778.4 -381.9 L2787.3 -398.9 L2793.1 -408.5 L2798.4 -416.5 L2809.7 -431.9 L2822.2 -446.4 L2831.0 -455.5 L2840.3 -464.2 L2848.7 -471.4 L2858.7 -479.1 L2867.7 -485.5 L2878.4 -492.3 L2889.3 -498.5 L2900.6 -504.1 L2910.6 -508.6 L2922.3 -513.2 L2934.2 -517.1 L2946.3 -520.5 L2958.5 -523.3 L2970.8 -525.4 L2983.3 -526.9 L2995.7 -527.8 L3006.7 -528.0 L3019.2 -527.7 L3031.7 -526.7 L3044.1 -525.2 L3056.4 -523.0 L3068.6 -520.1 L3080.7 -516.7 L3092.5 -512.6 L3104.2 -508.0 L3115.6 -502.8 L3126.8 -497.0 L3137.7 -490.6 L3148.2 -483.7 L3157.2 -477.2 L3167.1 -469.4 L3176.6 -461.0 L3183.5 -454.4 L3191.2 -446.4 L3197.6 -439.3 L3204.6 -430.7 L3210.4 -423.0 L3216.8 -413.9 L3222.8 -404.4 L3228.4 -394.7 L3232.9 -386.2 L3237.7 -376.1 L3242.1 -365.8 L3245.5 -356.8 L3249.1 -346.1 L3252.3 -335.3 L3254.6 -325.9 L3256.9 -314.9 L3259.0 -302.2 L3260.3 -291.0 L3261.1 -279.7 L3261.5 -268.4 L3261.5 -0.0 L3171.5 -0.0 L3171.5 -265.2 L3171.0 -279.8 L3169.9 -291.0 L3168.1 -302.1 L3165.8 -313.1 L3162.9 -323.9 L3159.3 -334.4 L3155.2 -344.7 L3150.6 -354.7 L3145.9 -363.4 L3140.3 -372.8 L3133.4 -382.5 L3126.7 -391.0 L3119.6 -398.9 L3112.0 -406.4 L3103.2 -414.0 L3094.9 -420.3 L3086.2 -426.0 L3077.1 -431.2 L3067.9 -435.7 L3058.4 -439.5 L3047.7 -443.0 L3037.8 -445.5 L3027.9 -447.3 L3017.8 -448.4 L3006.7 -448.8 L2995.6 -448.4 L2985.5 -447.3 L2975.5 -445.5 L2965.7 -443.0 L2955.0 -439.5 L2945.5 -435.7 L2936.2 -431.2 L2927.2 -426.0 L2918.5 -420.3 L2910.1 -414.0 L2901.4 -406.4 L2893.8 -398.9 L2886.6 -391.0 L2879.3 -381.7 L2873.1 -372.8 L2867.5 -363.4 L2862.3 -353.7 L2857.7 -343.7 L2854.0 -334.4 L2850.5 -323.9 L2847.6 -313.1 L2845.3 -302.1 L2843.5 -291.0 L2842.4 -279.8 L2841.9 -265.2 L2841.9 -0.0 L2751.9 -0.0ZM3869.5 -292.8 L3871.1 -274.8 L3871.5 -256.7 L3870.7 -238.6 L3868.6 -220.4 L3445.3 -220.4 L3448.2 -207.4 L3452.1 -194.2 L3456.9 -181.4 L3462.6 -169.0 L3469.0 -157.0 L3476.2 -145.7 L3484.1 -134.9 L3492.8 -124.9 L3502.0 -115.5 L3511.9 -107.0 L3522.3 -99.3 L3533.2 -92.4 L3544.5 -86.5 L3556.2 -81.5 L3568.2 -77.4 L3579.3 -74.6 L3590.7 -72.6 L3601.1 -71.6 L3611.5 -71.2 L3623.0 -71.6 L3634.4 -72.9 L3645.7 -75.1 L3655.8 -77.7 L3666.8 -81.5 L3677.5 -86.0 L3687.0 -90.8 L3696.2 -96.3 L3705.9 -103.0 L3714.4 -109.7 L3723.3 -117.8 L3731.7 -126.5 L3739.1 -135.2 L3841.6 -135.2 L3834.5 -122.2 L3825.9 -108.4 L3816.5 -95.1 L3806.3 -82.5 L3795.3 -70.5 L3784.9 -60.3 L3772.7 -49.7 L3759.9 -39.9 L3747.9 -31.8 L3734.1 -23.6 L3719.8 -16.3 L3705.1 -10.0 L3690.0 -4.5 L3676.2 -0.4 L3660.6 3.2 L3644.9 5.8 L3632.2 7.1 L3619.5 7.9 L3606.7 8.0 L3594.0 7.4 L3581.2 6.2 L3568.6 4.3 L3556.1 1.8 L3545.2 -0.9 L3533.0 -4.5 L3520.9 -8.8 L3509.1 -13.7 L3497.4 -19.2 L3486.1 -25.2 L3475.1 -31.8 L3464.4 -39.0 L3454.1 -46.7 L3444.1 -54.9 L3434.5 -63.6 L3426.5 -71.7 L3417.8 -81.2 L3409.5 -91.3 L3401.7 -101.7 L3394.4 -112.5 L3387.7 -123.6 L3381.4 -135.1 L3375.8 -146.9 L3370.7 -159.0 L3366.2 -171.3 L3362.2 -183.8 L3358.9 -196.5 L3356.2 -209.3 L3354.1 -222.3 L3352.6 -235.4 L3351.7 -248.5 L3351.5 -261.6 L3351.9 -274.8 L3352.9 -287.9 L3354.5 -300.9 L3356.8 -313.9 L3359.7 -326.7 L3363.2 -339.4 L3367.2 -351.8 L3371.9 -364.1 L3377.1 -376.1 L3382.9 -387.8 L3389.3 -399.2 L3396.2 -410.3 L3403.6 -421.0 L3411.5 -431.3 L3419.9 -441.2 L3428.8 -450.7 L3438.1 -459.7 L3447.8 -468.2 L3457.9 -476.2 L3468.4 -483.7 L3479.2 -490.7 L3490.3 -497.1 L3501.8 -503.0 L3514.9 -508.8 L3526.9 -513.4 L3539.1 -517.4 L3551.4 -520.7 L3563.9 -523.5 L3576.5 -525.6 L3589.2 -527.0 L3601.9 -527.8 L3614.7 -528.0 L3627.4 -527.5 L3640.1 -526.4 L3652.8 -524.6 L3665.3 -522.2 L3677.8 -519.1 L3690.0 -515.5 L3702.1 -511.2 L3713.9 -506.3 L3727.0 -500.1 L3738.3 -494.0 L3749.2 -487.3 L3759.9 -480.1 L3770.2 -472.3 L3781.3 -462.9 L3790.8 -454.1 L3799.8 -444.8 L3808.4 -435.1 L3816.5 -424.9 L3824.1 -414.3 L3831.2 -403.4 L3837.7 -392.1 L3843.7 -380.5 L3849.2 -368.6 L3854.1 -356.5 L3858.4 -344.1 L3862.1 -331.5 L3865.2 -318.7 L3867.7 -305.8 L3869.5 -292.8ZM3777.7 -299.6 L3773.2 -318.1 L3768.1 -333.3 L3761.9 -348.0 L3755.1 -361.0 L3746.8 -374.3 L3737.5 -386.8 L3728.0 -397.5 L3716.9 -408.1 L3705.1 -417.6 L3692.5 -426.0 L3680.4 -432.6 L3666.8 -438.5 L3652.8 -443.1 L3639.5 -446.2 L3625.0 -448.2 L3610.4 -448.8 L3595.9 -448.0 L3581.4 -445.8 L3567.2 -442.3 L3554.2 -437.8 L3540.7 -431.7 L3527.7 -424.3 L3515.3 -415.7 L3504.5 -406.7 L3493.5 -395.9 L3483.4 -384.2 L3474.3 -371.5 L3466.8 -359.0 L3459.6 -344.9 L3453.6 -330.1 L3448.8 -314.8 L3445.3 -299.6 L3777.7 -299.6ZM2642.1 -680.0 L2552.1 -680.0 L2552.1 -770.0 L2642.1 -770.0 L2642.1 -680.0Z"}, "bounds": [0.0, -8.0, 3871.4886786536795, 1710.0]};</script>
<script>/* ===== Mother Machine · animazione grafica, primi secondi =====
   Un solo orologio: render(t) disegna il fotogramma al tempo t. Deterministico, esportabile in video. */
var MM=(function(){
var NS='http://www.w3.org/2000/svg',XL='http://www.w3.org/1999/xlink',RUN0=9.5,INS=6.2,STK0=RUN0+5.65,STKD=5.85,OFF=RUN0+5.65+5.85-9.92,AD=15.1+RUN0+5.65+5.85-9.92,PREr=.95,G=1.2,DRIFT=.1,RAMP=.22;
/* pause di lettura: [tempo dell'animazione, secondi reali]. La velocità rallenta e riparte con una rampa morbida, mai di colpo. */
var HOLDS=[[5.3,.45],[6.3,.32],[8.92,.12],[9.48,.1],[STK0+.52,.15],[STK0+1.25,.35],[STK0+3.05,.45],[STK0+4.38,.4],[STK0+5.12,.3],[12.1+OFF,.55],[14.3+OFF,1.5]];
/* velocità a zone: l'apertura col logo gommoso va più svelta, il resto respira */
/* velocità a zone, in base a quanto c'è da leggere: [inizio, fine, fattore] (più alto = più lento) */
var ZONES=[[1.3,3.5,.9],[3.5,5.8,.85],[RUN0+3.05,RUN0+5.65,.95],[STK0,STK0+STKD,1.32],[OFF+10.0,OFF+12.25,1.3]];
function GOF(a){function sm(x){x=cl(x);return x*x*(3-2*x)}var g=1.15;ZONES.forEach(function(z){var w=sm((a-z[0])/.2)*(1-sm((a-z[1])/.2));g+=(z[2]-1.15)*w});return g}
var TB=(function(){var dt=1/240,ta=[0],x=0,a=0,k=0,st='run',hs=0,RA=.07,RR=.24;
  while(a<AD&&ta.length<90000){var w=0;
    if(st==='run'){if(k<HOLDS.length){var d=HOLDS[k][0]-a;if(d<RA){var q=cl(1-d/RA);w=q*q*(3-2*q)}if(a>=HOLDS[k][0]){st='hold';hs=x}}}
    else{var e=x-hs,H=HOLDS[k][1];if(e<H)w=1;else{var o=cl((e-H)/RR);w=1-o*o*(3-2*o);if(o>=1){st='run';k++}}}
    a+=((1/GOF(a))*(1-w)+DRIFT*w)*dt;x+=dt;ta.push(Math.min(a,AD))}return {ta:ta,dt:dt}})();
var DUR0=(TB.ta.length-1)*TB.dt+.6+PREr;
function MAP(tr){var i=tr/TB.dt,k=Math.floor(i);if(k>=TB.ta.length-1)return AD;return TB.ta[k]+(TB.ta[k+1]-TB.ta[k])*(i-k)}
var K={carta:'#F4F2EC',ink:'#141413',tomato:'#FF5B3A',cobalt:'#2D46E0',sun:'#FFC23D',mint:'#36C2A0',lilac:'#B9A6FF',mut:'#8C8A82'};
function E(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function U(id,a,p){var e=E('use',a,p);e.setAttribute('href','#'+id);e.setAttributeNS(XL,'xlink:href','#'+id);return e}
function cl(x){return x<0?0:x>1?1:x}function P(t,a,b){return cl((t-a)/(b-a))}function lerp(a,b,x){return a+(b-a)*x}
var ez={out3:function(x){return 1-Math.pow(1-x,3)},in3:function(x){return x*x*x},io3:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
 back:function(x,s){s=s||1.9;var c=s+1;return 1+c*Math.pow(x-1,3)+s*Math.pow(x-1,2)},
 el:function(x){if(x===0||x===1)return x;return Math.pow(2,-9*x)*Math.sin((x*9-.75)*2*Math.PI/3)+1}};
function f(n){return (+n).toFixed(2)}
/* regole di movimento: tre durate, due curve, un rimbalzo. Tutto il resto deriva da qui. */
var D={fast:.18,med:.32,slow:.56};
function op(e,v){v=cl(v);e.setAttribute('opacity',f(v));var d=v<=.001?'none':'';if(e.style.display!==d)e.style.display=d}
/* griglia finale: 4 x 3 */
var SWAP={'#141413':'#2D46E0','#2D46E0':'#141413','#36C2A0':'#FF5B3A','#FF5B3A':'#36C2A0'};
var GX=56,GY=74,CW=360,CH=240,GG=16,MAIN=5;
function cellXY(i){return [GX+(i%4)*(CW+GG),GY+Math.floor(i/4)*(CH+GG)]}

function anchors(d){/* punti d'ancora: dove il tracciato gira */
  var n=d.match(/-?\d+(\.\d+)?/g).map(Number),pts=[];for(var i=0;i<n.length;i+=2)pts.push([n[i],n[i+1]]);
  var out=[],last=null;for(var j=1;j<pts.length-1;j++){var a=pts[j-1],b=pts[j],c=pts[j+1];
    var t1=Math.atan2(b[1]-a[1],b[0]-a[0]),t2=Math.atan2(c[1]-b[1],c[0]-b[0]),dt=Math.abs(((t2-t1)*180/Math.PI+540)%360-180);
    if(dt>32&&(!last||Math.hypot(b[0]-last[0],b[1]-last[1])>90)){out.push(b);last=b}}
  return out}

function build(host,LG){LGP=LG.parts;
  var sv=E('svg',{viewBox:'0 0 1600 900',preserveAspectRatio:'xMidYMid slice',role:'img','aria-label':'Mother Machine, animazione del logo'},host);sv.style.cssText='display:block;width:100%;height:100%';
  var df=E('defs',{},sv),A={sv:sv};
  var ht=E('pattern',{id:'ht',width:8,height:8,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);E('circle',{cx:4,cy:4,r:1.6,fill:K.ink,opacity:.18},ht);
  var htS=E('pattern',{id:'htS',width:70,height:70,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);E('circle',{cx:35,cy:35,r:21,fill:K.sun},htS);
  var htB=E('pattern',{id:'htB',width:70,height:70,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);A.htBc=E('circle',{cx:35,cy:35,r:24,fill:K.tomato},htB);
  var all=E('g',{id:'lgAll'},df);['fr','c1','t0','t1'].forEach(function(k){E('path',{d:LG.parts[k]},all)});
  var mOnly=E('g',{id:'lgM'},df);['fr','c1'].forEach(function(k){E('path',{d:LG.parts[k]},mOnly)});
  var mDraw=E('g',{id:'lgMd'},df);['fr','c1'].forEach(function(k){E('path',{d:LG.parts[k],pathLength:1},mDraw)});
  var htC=E('pattern',{id:'htC',width:9,height:9,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);E('circle',{cx:4.5,cy:4.5,r:2.2,fill:K.cobalt,opacity:.55},htC);
  var cpE0=E('clipPath',{id:'cpE0'},df);A.e0r=E('rect',{x:740,y:-1760,width:0,height:900},cpE0);
  var cpE1=E('clipPath',{id:'cpE1'},df);A.e1r=E('rect',{x:740,y:-830,width:0,height:900},cpE1);
  var cpW=E('clipPath',{id:'cpW'},df);E('rect',{x:120,y:70,width:1360,height:760,rx:22},cpW);
  /* ritagli condivisi del logo che si costruisce */
  var cpF=E('clipPath',{id:'cpF'},df);E('rect',{x:-60,y:-2000,width:800,height:2010},cpF);
  var cpT0=E('clipPath',{id:'cpT0'},df);A.t0r=E('rect',{x:740,y:-1760,width:0,height:900},cpT0);
  var cpT1=E('clipPath',{id:'cpT1'},df);A.t1r=E('rect',{x:740,y:-830,width:0,height:900},cpT1);
  var cpFl=E('clipPath',{id:'cpFl'},df);A.flC=E('circle',{cx:0,cy:0,r:0},cpFl);A.flR=E('rect',{x:0,y:0,width:0,height:0},cpFl);

  E('rect',{width:1600,height:900,fill:K.carta},sv);
  var root=sv;sv=A.cam=E('g',{},root);
  /* ---------- griglia di varianti (sotto tutto, entra alla fine) ---------- */
  A.cells=[];var cg=A.cg=E('g',{},sv);
  for(var i=0;i<12;i++){if(i===MAIN){A.cells.push(null);continue}var xy=cellXY(i);
    var g=E('g',{},cg),inner=E('g',{},g),inB=E('g',{opacity:0},g);CELL[i](inner);if(CELL2[i])CELL2[i](inB);A.cells.push({g:g,a:inner,b:CELL2[i]?inB:null,x:xy[0],y:xy[1]})}
  /* ---------- allagamento pomodoro ---------- */
  A.flood=E('g',{'clip-path':'url(#cpFl)'},sv);A.floodR=E('rect',{width:1600,height:900,fill:K.tomato},A.flood);E('rect',{width:1600,height:900,fill:'url(#ht)'},A.flood);
  A.fd=[];var fdg=A.fdg=E('g',{},sv);for(var yy=0,row=0;yy<=912;yy+=21,row++)for(var xx=(row%2)*10.5;xx<=1612;xx+=21)A.fd.push({e:E('circle',{cx:xx,cy:yy,r:0,fill:K.tomato},fdg),x:xx,y:yy,r:0});
  A.gd=[];[['baseline','0',700],['x-height','528',700-528*.36],['ascender','1468',700-1468*.36]].forEach(function(q){var g=E('g',{opacity:0},sv);
    var l=E('line',{x1:800,x2:800,y1:q[2],y2:q[2],stroke:K.cobalt,'stroke-width':1},g);var lb=txt(g,120,q[2]-9,q[0],12,K.cobalt);var vl=txt(g,1480,q[2]-9,q[1],12,K.cobalt,null,500,'end');A.gd.push({g:g,l:l,lb:lb,vl:vl})});
  A.gv=[-16,696].map(function(x){return E('line',{x1:0,x2:0,y1:0,y2:0,stroke:K.cobalt,'stroke-width':1,'stroke-dasharray':'4 5',opacity:0},sv)});
  /* ---------- il logo, due copie: inchiostro, e carta dentro l'allagamento ---------- */
  function copy(col,clip){var g=E('g',clip?{'clip-path':clip}:{},sv),x=E('g',{},g);
    var fw=E('g',{'clip-path':'url(#cpF)'},x),fr=E('path',{d:LG.parts.fr,fill:col},fw);E('path',{d:LG.parts.c1,fill:col},x);
    E('path',{d:LG.parts.t0,fill:col,'clip-path':'url(#cpT0)'},x);E('path',{d:LG.parts.t1,fill:col,'clip-path':'url(#cpT1)'},x);return {g:g,x:x,fr:fr}}
  A.ink=copy(K.ink);A.cart=copy(K.carta,'url(#cpFl)');
  /* cursori di scrittura */
  A.car0=E('rect',{x:740,y:-1640,width:64,height:640,fill:K.tomato},A.ink.x);A.car1=E('rect',{x:740,y:-700,width:64,height:640,fill:K.tomato},A.ink.x);
  /* modalità contorni */
  A.outl=E('g',{opacity:0},sv);U('lgAll',{fill:'none',stroke:K.cobalt,'stroke-width':6.5},A.outl);
  ['fr','c1','t0','t1'].forEach(function(k){anchors(LG.parts[k]).forEach(function(p){E('rect',{x:f(p[0]-15),y:f(p[1]-15),width:30,height:30,fill:K.carta,stroke:K.cobalt,'stroke-width':5.5},A.outl)})});
  /* ---------- selezione stile Figma ---------- */
  A.sel=E('g',{opacity:0},sv);
  A.box=E('rect',{fill:'none',stroke:K.cobalt,'stroke-width':2,pathLength:1,'stroke-dasharray':'1 1'},A.sel);
  A.hd=[];for(var h=0;h<8;h++)A.hd.push(E('rect',{width:12,height:12,fill:'#fff',stroke:K.cobalt,'stroke-width':2},A.sel));
  A.dim=E('g',{},A.sel);A.dimR=E('rect',{height:26,rx:5,fill:K.cobalt},A.dim);A.dimT=E('text',{y:18,'font-family':'DMMono,monospace','font-size':14,'font-weight':500,fill:'#fff','text-anchor':'middle'},A.dim);
  A.nm=E('text',{'font-family':'DMMono,monospace','font-size':14,'font-weight':500,fill:K.cobalt},A.sel);A.nm.textContent='Mother Machine · logo';
  /* etichetta: non si deforma */
  A.tag=E('g',{opacity:0},sv);E('rect',{x:0,y:-17,width:172,height:34,rx:17,fill:K.ink},A.tag);E('circle',{cx:18,cy:0,r:6,fill:K.tomato},A.tag);
  var tt=E('text',{x:32,y:5.5,'font-family':'DMMono,monospace','font-size':14,'font-weight':500,fill:K.carta},A.tag);tt.textContent='Never stretch it.';
  /* tasto ⌘Y */
  A.key=E('g',{opacity:0,transform:'translate(56 826)'},sv);E('rect',{width:64,height:44,rx:9,fill:K.ink},A.key);
  var kt=E('text',{x:32,y:29,'font-family':'DMMono,monospace','font-size':18,'font-weight':500,fill:K.carta,'text-anchor':'middle'},A.key);kt.textContent='⌘Y';
  var kl=E('text',{x:80,y:28,'font-family':'DMMono,monospace','font-size':14,'font-weight':500,fill:K.ink},A.key);kl.textContent='Outline';
  /* campioni di colore */
  A.sw=[];[K.tomato,K.cobalt,K.sun,K.mint,K.ink].forEach(function(c,i){var g=E('g',{opacity:0},sv);E('circle',{r:22,fill:c},g);A.sw.push(g)});
  A.ring=E('circle',{r:31,fill:'none',stroke:K.ink,'stroke-width':3,opacity:0},sv);
  /* cursore */
  buildType(A,root);buildRun(A,host);buildStack(A,root);buildDash(A,root);buildEnd(A,root);
  A.cur=E('g',{},root);var ca=E('g',{transform:'scale(1.55)'},A.cur);
  E('path',{d:'M0 0 L0 26 L7 19.5 L11.5 29.5 L16 27.5 L11.5 18 L20 18 Z',fill:K.ink,stroke:'#fff','stroke-width':2,'stroke-linejoin':'round'},ca);
  A.clk=E('circle',{r:0,fill:'none',stroke:K.ink,'stroke-width':2.5,opacity:0},sv);
  return A}

/* ---------- contenuti delle celle (coordinate 0..360 x 0..240) ---------- */
function bg(g,c,dots){CELL.lastBg=E('rect',{width:CW,height:CH,rx:18,fill:c},g);CELL.lastC=c;if(dots)E('rect',{width:CW,height:CH,rx:18,fill:'url(#ht)'},g)}
function logo(g,id,col,x,y,s,extra){var w=E('g',{transform:'translate('+x+' '+y+') scale('+s+')'},g);var a={fill:col};for(var k in extra||{})a[k]=extra[k];return U(id,a,w)}
function txt(g,x,y,s,size,col,fam,w,anchor){var e=E('text',{x:x,y:y,'font-family':fam||'DMMono,monospace','font-size':size,'font-weight':w||500,fill:col,'text-anchor':anchor||'start'},g);e.textContent=s;return e}
var CELL={
 0:function(g){bg(g,K.ink);logo(g,'lgAll',K.sun,40,170,.0723);txt(g,22,32,'NIGHT MODE',12,K.sun)},
 1:function(g){bg(g,K.cobalt,1);logo(g,'lgM',K.carta,134,214,.135)},
 2:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   var L=['<svg viewBox="0 0 3871 1718">','  <path fill="#FF5B3A"','   d="M0 -1267.6 L0.7 -1284.8','   L1.8 -1294.6 L3.0 -1303.1','   L6.7 -1319.9 L9.3 -1329.3','   L12.1 -1337.4 L15.1 …"/>','</svg>'];
   L.forEach(function(s,i){txt(g,20,40+i*25,String(i+1).padStart(2,'0'),12.5,K.mut);txt(g,52,40+i*25,s,12.5,i===1?K.tomato:K.ink)});
   CELL.caret=E('rect',{x:110,y:183,width:9,height:18,fill:K.tomato},g)},
 3:function(g){bg(g,K.mint,1);CELL.ol=logo(g,'lgAll','none',40,170,.0723,{stroke:K.ink,'stroke-width':16,'stroke-dasharray':'140 70'})},
 4:function(g){bg(g,K.sun,1);CELL.aa=txt(g,26,176,'Aa',150,K.cobalt,'Hanken,sans-serif',700);txt(g,24,212,'HANKEN GROTESK 700',12,K.ink);txt(g,336,32,'06',12,K.ink,null,500,'end')},
 6:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   txt(g,26,46,'ORDERS · TODAY',12,K.mut);txt(g,26,96,'128',48,K.ink,'Hanken,sans-serif',700);
   E('rect',{x:26,y:150,width:132,height:46,rx:23,fill:K.ink},g);txt(g,92,179,'Run',16,K.carta,'Hanken,sans-serif',600,'middle');
   var tg=E('g',{transform:'translate(250 152)'},g);CELL.tgB=E('rect',{width:84,height:42,rx:21,fill:K.ink},tg);CELL.tgK=E('circle',{cx:21,cy:21,r:16,fill:'#fff'},tg)},
 7:function(g){bg(g,K.tomato,1);txt(g,22,32,'APP',12,K.ink);
   var cpp=E('clipPath',{id:'cp7'},g);E('rect',{width:CW,height:CH,rx:18},cpp);var ph=E('g',{transform:'translate(214 40)'},E('g',{'clip-path':'url(#cp7)'},g));E('rect',{width:116,height:236,rx:22,fill:K.ink},ph);E('rect',{x:7,y:7,width:102,height:222,rx:16,fill:K.carta},ph);
   E('rect',{x:40,y:14,width:36,height:8,rx:4,fill:K.ink},ph);
   E('rect',{x:17,y:34,width:82,height:58,rx:8,fill:K.sun},ph);E('rect',{x:17,y:100,width:82,height:9,rx:4.5,fill:K.ink},ph);E('rect',{x:17,y:115,width:52,height:9,rx:4.5,fill:'#C9C6BD'},ph);
   E('rect',{x:17,y:136,width:82,height:30,rx:15,fill:K.tomato},ph);CELL.nt=E('g',{opacity:0},ph);E('rect',{x:10,y:28,width:96,height:28,rx:9,fill:K.ink},CELL.nt);E('circle',{cx:23,cy:42,r:4,fill:K.tomato},CELL.nt);txt(CELL.nt,32,46,'New order',11,K.carta);
   txt(g,22,150,'New order',22,K.ink,'Hanken,sans-serif',700);txt(g,22,178,'1 × cake · 24.00',13,K.ink)},
 8:function(g){bg(g,K.ink);logo(g,'lgM','url(#htB)',134,214,.135)},
 9:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   for(var c=0;c<12;c++)E('rect',{x:20+c*27.5,y:20,width:22,height:200,fill:K.tomato,opacity:.12},g);
   CELL.blk=E('rect',{x:20,y:120,width:157,height:100,fill:K.cobalt},g);E('rect',{x:185,y:20,width:157,height:56,fill:K.ink},g);txt(g,20,46,'12 COL',12,K.ink)},
 10:function(g){bg(g,K.cobalt,1);var h=[60,96,74,130,112,160,142];CELL.bars=[];
   h.forEach(function(v,i){CELL.bars.push(E('rect',{x:30+i*44,y:200-v,width:30,height:v,fill:i===5?K.sun:K.carta},g))});txt(g,30,36,'OPERATIONS',12,K.carta)},
 11:function(g){bg(g,K.carta);E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g);
   txt(g,22,32,'COLOR · 05',12,K.ink);
   CELL.pal=[];[[K.tomato,'FF5B3A'],[K.cobalt,'2D46E0'],[K.sun,'FFC23D'],[K.mint,'36C2A0'],[K.ink,'141413']].forEach(function(c,i){CELL.pal.push(E('rect',{x:22+i*64,y:50,width:58,height:136,rx:8,fill:c[0]},g));txt(g,22+i*64,208,c[1],11,K.ink)})}
};

/* secondo stato delle schede: l'interruttore cambia tema, contenuti e funzioni */
function brd(g){E('rect',{x:.75,y:.75,width:CW-1.5,height:CH-1.5,rx:17,fill:'none',stroke:'#D9D6CC','stroke-width':1.5},g)}
var CELL2={
 0:function(g){bg(g,K.carta);brd(g);logo(g,'lgAll',K.ink,40,170,.0723);txt(g,22,32,'DAY MODE',12,K.ink)},
 1:function(g){bg(g,K.ink);logo(g,'lgM','none',134,214,.135,{stroke:K.carta,'stroke-width':12})},
 2:function(g){bg(g,K.carta);brd(g);E('rect',{x:46,y:48,width:302,height:24,rx:4,fill:K.sun,opacity:.5},g);
   var L=['<svg viewBox="0 0 3871 1718">','  <path fill="#2D46E0"','   d="M0 -1267.6 L0.7 -1284.8','   L1.8 -1294.6 L3.0 -1303.1','   L6.7 -1319.9 L9.3 -1329.3','   L12.1 -1337.4 L15.1 …"/>','</svg>  // theme: blue'];
   L.forEach(function(s,i){txt(g,20,40+i*25,String(i+1).padStart(2,'0'),12.5,K.mut);txt(g,52,40+i*25,s,12.5,i===1?K.cobalt:i===6?'#1E9C7B':K.ink)})},
 3:function(g){bg(g,K.tomato,1);logo(g,'lgAll',K.ink,40,170,.0723)},
 7:function(g){bg(g,K.mint,1);txt(g,22,32,'APP · DARK',12,K.ink);
   var cpp=E('clipPath',{id:'cp7b'},g);E('rect',{width:CW,height:CH,rx:18},cpp);var ph=E('g',{transform:'translate(214 40)'},E('g',{'clip-path':'url(#cp7b)'},g));
   E('rect',{width:116,height:236,rx:22,fill:K.ink},ph);E('rect',{x:7,y:7,width:102,height:222,rx:16,fill:'#262624'},ph);E('rect',{x:40,y:14,width:36,height:8,rx:4,fill:K.ink},ph);
   E('rect',{x:17,y:34,width:82,height:58,rx:8,fill:K.cobalt},ph);E('rect',{x:17,y:100,width:82,height:9,rx:4.5,fill:K.carta},ph);E('rect',{x:17,y:115,width:52,height:9,rx:4.5,fill:'#5A5953'},ph);E('rect',{x:17,y:136,width:82,height:30,rx:15,fill:K.sun},ph);
   txt(g,22,150,'Shipped',22,K.ink,'Hanken,sans-serif',700);txt(g,22,178,'1 × cake · on its way',13,K.ink)},
 8:function(g){bg(g,K.cobalt);logo(g,'lgM','url(#htS)',134,214,.135)},
 9:function(g){bg(g,K.carta);brd(g);for(var c=0;c<6;c++)E('rect',{x:20+c*54,y:20,width:48,height:200,fill:K.cobalt,opacity:.1},g);
   E('rect',{x:20,y:20,width:156,height:110,fill:K.tomato},g);E('rect',{x:182,y:140,width:156,height:80,fill:K.ink},g);txt(g,182,46,'6 COL',12,K.ink)},
 10:function(g){bg(g,K.ink);txt(g,30,36,'OPERATIONS · LIVE',12,K.sun);var v=[60,96,74,130,112,160,142],pts=v.map(function(h,i){return [44+i*44,206-h]});
   CELL2.line=E('path',{d:'M'+pts.map(function(p){return p.join(' ')}).join('L'),fill:'none',stroke:K.sun,'stroke-width':4,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},g);
   pts.forEach(function(p,i){E('circle',{cx:p[0],cy:p[1],r:i===5?7:4.5,fill:i===5?K.tomato:K.carta},g)})},
 11:function(g){bg(g,K.carta);brd(g);txt(g,22,32,'COLOR · THEME B',12,K.ink);
   [[K.cobalt,'2D46E0'],[K.sun,'FFC23D'],[K.tomato,'FF5B3A'],[K.ink,'141413'],[K.mint,'36C2A0']].forEach(function(c,i){E('rect',{x:22+i*64,y:50,width:58,height:136,rx:8,fill:c[0]},g);txt(g,22+i*64,208,c[1],11,K.ink)})}
};
/* trasformazione del logo principale al tempo t */
function LX(t){
  if(t<1.5){/* caduta vera: accelera fino a terra, si allunga mentre cade, si schiaccia all'impatto, fa un piccolo rimbalzo e si assesta */
    var fp=P(t,0,.36),yoff=-740*(1-fp*fp),sx=1,sy=1;if(t<.36){sy=1+.2*fp;sx=1-.08*fp}
    var im=P(t,.36,.5);if(im>0&&im<1){var k=Math.sin(Math.PI*im);sy=1-.26*k;sx=1+.18*k}
    var hp=P(t,.48,.62);if(hp>0&&hp<1){yoff-=30*Math.sin(Math.PI*hp);sy=1+.06*Math.sin(Math.PI*hp);sx=1-.03*Math.sin(Math.PI*hp)}
    var st2=P(t,.62,.72);if(st2>0&&st2<1){var k2=Math.sin(Math.PI*st2);sy=1-.07*k2;sx=1+.05*k2}
    var cam=ez.io3(P(t,.95,1.5));
    return {ax:340,ay:0,X:lerp(800,369.3,cam),Y:lerp(700,679.8,cam)+yoff,s:lerp(.36,.27,cam),sx:sx,sy:sy}}
  if(t<4.4){var sx2=1,sy2=1,sk=0;
    if(t>=2.1&&t<2.62){var d=ez.out3(P(t,2.1,2.42)),tn=P(t,2.42,2.62);d=d*(1+.04*Math.sin(tn*Math.PI));sx2=1+.36*d;sy2=1-.12*d;sk=-5*d}
    else if(t>=2.62){var u=t-2.62,e=Math.exp(-4.2*u),c=Math.cos(15*u);sx2=1+.36*e*c;sy2=1-.12*e*c+.07*e*Math.sin(15*u);sk=-5*e*Math.cos(13*u)}
    return {ax:1935,ay:-851,X:800,Y:450,s:.27,sx:sx2,sy:sy2,sk:sk}}
  var g=ez.io3(P(t,4.4,4.92));return {ax:1935,ay:-851,X:lerp(800,612,g),Y:450,s:lerp(.27,.0723,g),sx:1,sy:1}}
function mp(L,x,y){return [L.X+(x-L.ax)*L.s*L.sx,L.Y+(y-L.ay)*L.s*L.sy]}
function curAt(t,A){
  var L=LX(Math.min(t,2.62)),rh=mp(L,3871,-851);rh=[rh[0]+16,rh[1]];
  if(t<1.5)return [1700,1050];
  if(t<2.05){var p=ez.io3(P(t,1.5,2.05));return [lerp(1700,rh[0],p),lerp(1050,rh[1],p)+Math.sin(p*Math.PI)*-60]}
  if(t<3.4)return rh;
  var sw=[672,800];
  if(t<3.85){var q=ez.io3(P(t,3.4,3.85));return [lerp(rh[0],sw[0],q),lerp(rh[1],sw[1],q)+Math.sin(q*Math.PI)*-40]}
  if(t<5.3)return sw;
  var tg=[1104,512];if(t<5.95){var r=ez.io3(P(t,5.3,5.66));return [lerp(sw[0],tg[0],r),lerp(sw[1],tg[1],r)]}
  var u=ez.in3(P(t,5.95,6.18));return [lerp(tg[0],1750,u),lerp(tg[1],1100,u)]}

function camAt(t){
  var a=ez.io3(P(t,2.05,2.4)),b=ez.io3(P(t,2.7,3.2)),z1=.06*(a-b);
  var c=ez.io3(P(t,3.92,4.38)),d=ez.io3(P(t,4.4,5.05)),z2=.08*(c-d);
  if(t<3.6)return {px:1000,py:450,sx:1000,sy:450,s:1+z1};
  if(t<6.4)return {px:672,py:800,sx:672,sy:800,s:1+z2};
  var dv=ez.in3(P(t,6.42,6.98)),k=ez.io3(P(t,6.42,6.98));var P0=[236,450];
  return {px:P0[0],py:P0[1],sx:lerp(P0[0],800,k),sy:450,s:Math.pow(5.2,dv)}}
var MM_URL=/url=1/.test(location.hash),LGP=null,MC=null;function meas(str,w,size){if(!MC)MC=document.createElement('canvas').getContext('2d');MC.font=w+' '+size+'px "Hanken"';return MC.measureText(str).width}
/* ---------- momento 2: le parole ---------- */
var SY={x0:520,x1:1080,y:742};
function wghtAt(t){return 100+800*ez.io3(P(t,8.2,8.9))}
function buildType(A,root){var L=A.TL=E('g',{opacity:0},root);
  E('rect',{width:1600,height:900,fill:K.sun},L);E('rect',{width:1600,height:900,fill:'url(#ht)'},L);
  A.bigAa=txt(L,-1,741,'Aa',780,K.cobalt,'Hanken,sans-serif',700);
  txt(L,56,74,'HANKEN GROTESK · VARIABLE 100 TO 900',14,K.ink);txt(L,1544,74,'MOTHER MACHINE · TYPE',14,K.ink,null,500,'end');
  E('rect',{x:56,y:92,width:1488,height:2,fill:K.ink},L);E('rect',{x:56,y:806,width:1488,height:2,fill:K.ink},L);
  txt(L,56,840,'BRAND · SYSTEMS · CODE',14,K.ink);A.tCount=txt(L,1544,840,'01 / 03',14,K.ink,null,500,'end');
  A.bref=txt(L,0,-2000,'Brand.',300,K.ink,'Hanken,sans-serif',700);
  A.brand=[];'Brand.'.split('').forEach(function(ch){var e=txt(L,0,0,ch,300,K.ink,'Hanken,sans-serif',700);A.brand.push(e)});
  A.sys=E('text',{x:800,y:0,'text-anchor':'middle','font-family':'Hanken,sans-serif','font-size':232,fill:K.cobalt},L);A.sys.textContent='Systems.';
  var sl=A.sl=E('g',{opacity:0},L);E('rect',{x:SY.x0,y:SY.y-3,width:SY.x1-SY.x0,height:6,rx:3,fill:K.ink,opacity:.25},sl);A.slF=E('rect',{x:SY.x0,y:SY.y-3,width:0,height:6,rx:3,fill:K.cobalt},sl);
  A.slK=E('circle',{cx:SY.x0,cy:SY.y,r:15,fill:K.carta,stroke:K.ink,'stroke-width':3},sl);txt(sl,SY.x0,SY.y-26,'wght',16,K.ink);A.slV=txt(sl,SY.x1,SY.y-26,'100',16,K.ink,null,500,'end');
  A.code=txt(L,0,0,'',300,K.ink,'Hanken,sans-serif',700);A.caret=E('rect',{width:18,height:220,fill:K.tomato},L);
  A.dot=E('circle',{r:0,fill:K.tomato},L)}
function renderType(A,t,tr){var on=t>6.975&&t<RUN0+.75;op(A.TL,on?1:0);if(!on)return;
  if(CELL.aa)A.bigAa.style.fontWeight=CELL.aa.style.fontWeight;
  var ax=ez.in3(P(t,6.98,6.98+D.med));A.bigAa.setAttribute('transform','translate(0 '+f(-900*ax)+')');op(A.bigAa,1-P(t,7.2,7.3));
  var by=560,size=300,W=A.bref.getComputedTextLength(),x=800-W/2;
  A.brand.forEach(function(e,i){var a=7.0+i*.05,p=P(t,a,a+D.med),ex=ez.in3(P(t,7.66+i*.025,7.66+i*.025+D.fast));
    var y=by-(1-ez.back(p,1.3))*520-ex*760;e.setAttribute('x',f(x+A.bref.getStartPositionOfChar(i).x));e.setAttribute('y',f(y));op(e,p>0?1:0)});
  A.tCount.textContent=t<7.9?'01 / 03':t<9.0?'02 / 03':'03 / 03';
  var w=wghtAt(t),se=ez.back(P(t,7.94,7.94+D.med),1.4),sx=ez.in3(P(t,8.95,8.95+D.fast));
  A.sys.style.fontWeight=Math.round(w);A.sys.setAttribute('y',f(530));A.sys.setAttribute('transform','translate('+f(-1800*sx)+' 0) translate(800 450) scale('+f(.4+.6*se)+') translate(-800 -450)');op(A.sys,t>7.94?1:0);
  var so=ez.back(P(t,7.98,7.98+D.med));op(A.sl,t>7.98&&t<9.05?1-P(t,8.95,9.05):0);A.sl.setAttribute('transform','translate(0 '+f(40*(1-so))+')');
  var kx=SY.x0+(SY.x1-SY.x0)*(w-100)/800;A.slK.setAttribute('cx',f(kx));A.slF.setAttribute('width',f(kx-SY.x0));A.slV.textContent=Math.round(w);
  var full='Code',n=Math.floor(P(t,9.05,9.42)*4.999);A.code.textContent=full;var cw=A.code.getComputedTextLength()+70,cx0=800-cw/2;
  A.code.textContent=full.slice(0,n);var cur=n?A.code.getComputedTextLength():0;A.code.setAttribute('x',f(cx0));A.code.setAttribute('y',f(by));
  var dotT=9.46;A.caret.setAttribute('x',f(cx0+cur+8));A.caret.setAttribute('y',f(by-212));op(A.caret,t>9.02&&t<dotT&&(Math.floor(tr*4)%2===0||t<9.44)?1:0);
  var dg=ez.in3(P(t,9.56,9.96)),dp=ez.back(P(t,dotT,dotT+D.fast),2.4);A.dot.setAttribute('cx',f(cx0+cur+44));A.dot.setAttribute('cy',f(by-24));A.dot.setAttribute('r',f(t<dotT?0:24*dp*(1+.25*Math.max(0,Math.sin((t-dotT)*9))*(t<RUN0+.3?1:0))))}
/* ---------- momento nuovo: RUNTIME. Glitch, il codice del logo piove, si ferma a formare la m, si compila in retino, esplode in un campo di archi ---------- */
function hsh(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
var RC={cw:16,rh:22,cols:100,rows:41,mx:657,mb:760,ms:.42};
function buildRun(A,host){var cv=A.rc=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:none;z-index:1';host.appendChild(cv);A.rx=cv.getContext('2d');
  var m=new Path2D(),M=new DOMMatrix([RC.ms,0,0,RC.ms,RC.mx,RC.mb]);m.addPath(new Path2D(LGP.fr),M);m.addPath(new Path2D(LGP.c1),M);A.mPath=m;
  A.data=(LGP.fr+LGP.t0).replace(/\s+/g,'').slice(0,3000);
  var ins=[],tc=document.createElement('canvas').getContext('2d');for(var c=0;c<RC.cols;c++){ins[c]=[];for(var r=0;r<RC.rows;r++)ins[c][r]=tc.isPointInPath(m,c*RC.cw+8,r*RC.rh+14)}A.ins=ins;
  /* la pioggia: ogni colonna ha più gocce che scendono una dopo l'altra, sempre alla stessa velocità */
  A.mcol=ins.map(function(col){return col.some(function(x){return x})});A.rs=[];A.lk=[];
  for(var ca=0;ca<RC.cols;ca++){var vv=17+hsh(ca+50)*17,LL=7+hsh(ca+90)*12,st=[],t0=.35+hsh(ca)*.8,mc=A.mcol[ca];
    for(var kk=0;kk<9;kk++){st.push(t0);t0+=(mc?.42:.95)+hsh(ca*3.1+kk*7.7)*(mc?.3:.7)}A.rs.push({v:vv,L:LL,s:st});
    /* ogni carattere della m aspetta il suo momento, sparso tra 0,7 e 1,55: la prima goccia che ci passa sopra dopo quel momento si ferma lì */
    A.lk[ca]=[];for(var ra=0;ra<RC.rows;ra++){if(!ins[ca][ra]){A.lk[ca][ra]=99;continue}var e=.7+.65*hsh(ca*13.3+ra*7.1)+.2*(ra/RC.rows),best=99;
      st.forEach(function(s0){var tk=s0+ra/vv;if(tk>=e&&tk<best)best=tk});A.lk[ca][ra]=best}}
  /* distanza di ogni cella dalla m: serve a far crescere il campo dalla lettera verso fuori */
  var dist=[],q=[],ky=RC.rh/RC.cw;for(var c2=0;c2<RC.cols;c2++)for(var r2=0;r2<RC.rows;r2++)if(ins[c2][r2])q.push([c2,r2]);
  for(var c3=0;c3<RC.cols;c3++){dist[c3]=[];for(var r3=0;r3<RC.rows;r3++){var best=1e9;if(!ins[c3][r3])for(var h=0;h<q.length;h++){var dx=c3-q[h][0],dy=(r3-q[h][1])*ky,d2=dx*dx+dy*dy;if(d2<best)best=d2}else best=0;dist[c3][r3]=Math.sqrt(best)}}A.dist=dist}
function renderRun(A,t,tr){var u=t-RUN0,on=u>.14&&t<STK0+.02;var cv=A.rc;var d=on?'block':'none';if(cv.style.display!==d)cv.style.display=d;if(!on)return;
  var W=cv.clientWidth,H=cv.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  var x=A.rx,sc=Math.max(W/1600,H/900)*dpr;x.setTransform(sc,0,0,sc,(W*dpr-1600*sc)/2,(H*dpr-900*sc)/2);x.clearRect(0,0,1600,900);
  var C=[K.tomato,K.cobalt,K.sun,K.mint,K.carta];
  /* 1. glitch: lo schermo si rompe a strisce */
  if(u<.48){var g=P(u,.14,.46);for(var i=0;i<26;i++){if(hsh(i+3)<g){var y=hsh(i)*900,h=6+hsh(i+7)*70,ox=(hsh(i+11)-.5)*120*(1-g);x.fillStyle=K.ink;x.fillRect(ox,y,1600,h*(.4+g));if(hsh(i+5)<.3){x.fillStyle=C[i%2?0:1];x.fillRect(ox+hsh(i+9)*800,y,200+hsh(i+2)*600,3)}}}return}
  x.fillStyle=K.ink;x.fillRect(0,0,1600,900);
  var lockOn=u>1.45,rainOut=1-P(u,2.4,2.72),dimR=1-.45*P(u,1.9,2.2),comp=u>2.72?P(u,2.72,3.0):0,sweep=640+330*comp;
  x.font='500 17px "DMMono", ui-monospace, monospace';x.textBaseline='middle';x.textAlign='center';
  if(u<3.05){
  /* la pioggia continua; dove passa la m alcuni caratteri si fermano, uno qua e uno là: la m si forma dalla cascata, verde chiaro, poi diventa gialla dall'alto */
  for(var c=0;c<RC.cols;c++){var Rs=A.rs[c],v=Rs.v,L=Rs.L,cx=c*RC.cw+8;
    for(var r=0;r<RC.rows;r++){var cy=r*RC.rh+14,inside=A.ins[c][r],lt=inside?A.lk[c][r]:99;
      if(u>=lt){var ch=A.data[(c*131+r*17+Math.floor(lt*12+c))%A.data.length];
        if(cx<sweep&&comp>0){x.globalAlpha=1;x.fillStyle=K.sun;x.beginPath();x.arc(cx,cy,7.2,0,6.283);x.fill()}
        else{var ty=2.22+(r-7)/27*.3+hsh(c*5.1)*.04,yel=u>=ty+.05,fl=u<lt+.09||(u>=ty&&u<ty+.05);
          x.globalAlpha=1;x.fillStyle=fl?K.carta:yel?K.sun:'#8DFFDB';x.fillText(ch,cx,cy)}continue}
      if(rainOut<=0)continue;var dd=99;for(var q=0;q<Rs.s.length;q++){var d0=(u-Rs.s[q])*v-r;if(d0>=0&&d0<dd)dd=d0}if(dd>L)continue;
      var b=1-dd/L;x.globalAlpha=.78*b*rainOut*dimR*(inside?.6:1);x.fillStyle=dd<1?K.carta:(hsh(c*7+r)<.06?K.tomato:K.mint);
      x.fillText(A.data[(c*131+r*17+Math.floor(u*12+c))%A.data.length],cx,cy)}}}
  x.globalAlpha=1;
  /* 2. i puntini della m diventano archi; il campo cresce dalla m mentre la camera entra; un'onda sola lo gira e lo fa pomodoro */
  if(u>=3.05){var mo=ez.out3(P(u,3.05,3.3)),z=1+1.7*ez.io3(P(u,3.25,4.6)),gr=(u-3.25)*58,wf=(u-3.8)*80,wf2=(u-4.3)*95,wf3=(u-4.75)*100,merge=P(u,5.2,5.62);
    if(merge>.3){x.fillStyle=K.tomato;x.globalAlpha=P(merge,.3,.7);x.fillRect(0,0,1600,900);x.globalAlpha=1}
    x.save();x.translate(800,452);x.scale(z,z);x.translate(-800,-452);x.lineCap='butt';
    var lw=3.4+15*ez.in3(merge);
    for(var c=0;c<RC.cols;c++){var cx=c*RC.cw+8,sx=800+(cx-800)*z;if(sx<-30||sx>1630)continue;
      for(var r=0;r<RC.rows;r++){var cy=r*RC.rh+14,sy=452+(cy-452)*z;if(sy<-30||sy>930)continue;
        var dd=A.dist[c][r],inside=dd===0,pp=inside?mo:ez.out3(cl((gr-dd)/3));if(pp<=0)continue;
        var qf=cl((wf-dd)/5),q2=cl((wf2-dd)/5),q3=cl((wf3-dd)/5),ang=Math.PI*ez.io3(qf)+Math.PI/2*ez.io3(q2)+Math.PI/2*ez.io3(q3),col=qf>.5?K.tomato:(inside?K.sun:K.carta);
        if(inside&&mo<1){x.fillStyle=K.sun;x.beginPath();x.arc(cx,cy,7.2*(1-mo),0,6.283);x.fill()}
        x.save();x.translate(cx,cy+1);x.rotate(ang);x.scale(pp,pp);x.strokeStyle=col;x.globalAlpha=inside||qf>.5?1:.85;x.lineWidth=lw;
        x.beginPath();x.moveTo(-5.5,7);x.lineTo(-5.5,0);x.arc(0,0,5.5,Math.PI,0);x.lineTo(5.5,7);x.stroke();x.restore()}}
    x.restore();x.globalAlpha=1;if(merge>=1){x.fillStyle=K.tomato;x.fillRect(0,0,1600,900)}}
  /* 3. terminale */
  var tA=1-P(u,5.0,5.25);x.globalAlpha=tA;x.textAlign='left';x.font='500 15px "DMMono", ui-monospace, monospace';
  function lab(s,xx,yy,col,al,a){x.textAlign=al;var w=x.measureText(s).width;x.globalAlpha=tA;x.fillStyle=K.ink;x.fillRect(al==='right'?xx-w-10:xx-10,yy-13,w+20,26);x.globalAlpha=tA*a;x.fillStyle=col;x.fillText(s,xx,yy)}
  lab('MOTHER MACHINE · RUNTIME',56,44,K.carta,'left',.55);lab('FRAME '+String(Math.floor(tr*60)).padStart(5,'0'),1544,44,K.carta,'right',.55);
  var cmd='> mother --compile logo.svg',n=Math.floor(P(u,.8,1.5)*cmd.length);if(u>.7)lab(cmd.slice(0,n)+(Math.floor(tr*3)%2&&u<1.6?'_':''),56,850,K.mint,'left',1);
  if(u>2.8)lab('✓ 1 mark · 2 floors · 0 errors',56,822,K.sun,'left',1);
  if(u>3.3)lab('GROWING · 4100 ARCHES · SEED 0412',1544,850,K.carta,'right',.55);x.textAlign='left'
  x.globalAlpha=1}
/* ---------- i prodotti: otto app vere per otto settori; quattro scorrono con la loro funzione, una si apre ---------- */
var SW=1000,SH=560,HB=48,BR=[
 {n:'Riverside Clinic',a:K.cobalt,tc:K.carta,ic:'cross',meta:'AGENDA · MON 12 OCT',body:'clinic'},
 {n:'Swift Couriers',a:K.sun,tc:K.ink,ic:'truck',meta:'LIVE · 38 DELIVERIES',body:'map'},
 {n:'Pulse Gym',a:K.mint,tc:K.ink,ic:'bell',meta:'CHECK-IN · FRONT DESK',body:'gym'},
 {n:'Pizzeria Uno',a:K.tomato,tc:K.carta,ic:'pizza',meta:'FLOOR · FRI 20:30',body:'floor'},
 {n:'Northside Realty',a:K.ink,tc:K.carta,ic:'house',meta:'CRM · 24 LEADS',body:'gen'},
 {n:'Harbour Hotel',a:K.cobalt,tc:K.carta,ic:'key',meta:'ROOMS · 86% FULL',body:'gen'},
 {n:'Lumen Optics',a:K.sun,tc:K.ink,ic:'glasses',meta:'STOCK · 1,204 ITEMS',body:'gen'},
 {n:'North Brewing Co.',a:K.tomato,tc:K.carta,ic:'beer',meta:'TANKS · 6 ACTIVE',body:'gen'}];
var TINT={mint:'#BFE9DD',sun:'#FFE7AE',cob:'#C9D0F7',tom:'#FFD0C4',line:'#E4E1D8',land:'#E8E4D8',white:'#FFFFFF'};
function icon(g,kind,x,y,sc){var i=E('g',{transform:'translate('+x+' '+y+') scale('+(sc||1)+')'},g);
  if(kind==='pizza'){E('path',{d:'M-10 -8 Q0 -13 10 -8 L0 12 Z',fill:K.sun},i);E('path',{d:'M-10 -8 Q0 -13 10 -8 L9 -5 Q0 -9.5 -9 -5 Z',fill:'#C98A4B'},i);
    [[-3,-2,2.3],[3.2,1,2.1],[-.4,5.6,1.7]].forEach(function(c){E('circle',{cx:c[0],cy:c[1],r:c[2],fill:K.tomato},i)})}
  if(kind==='truck'){E('rect',{x:-12,y:-6,width:14,height:11,rx:1.5,fill:K.cobalt},i);E('path',{d:'M2 -2 H7.5 L11 2 V5 H2 Z',fill:K.cobalt},i);E('path',{d:'M4 0 H7 L9 2.3 H4 Z',fill:K.carta},i);
    E('circle',{cx:-7,cy:6.5,r:2.8,fill:K.ink},i);E('circle',{cx:6,cy:6.5,r:2.8,fill:K.ink},i)}
  if(kind==='glasses'){[-6.5,6.5].forEach(function(cx){E('circle',{cx:cx,cy:1,r:5.6,fill:K.cobalt,'fill-opacity':.25,stroke:K.ink,'stroke-width':2.6},i)});E('path',{d:'M-1.4 0 Q0 -2 1.4 0',fill:'none',stroke:K.ink,'stroke-width':2},i)}
  if(kind==='bell'){E('rect',{x:-8,y:-1.5,width:16,height:3,fill:K.ink},i);E('rect',{x:-12,y:-7,width:3.5,height:14,rx:1,fill:K.ink},i);E('rect',{x:-8.5,y:-5,width:3,height:10,rx:1,fill:K.mint},i);
    E('rect',{x:8.5,y:-7,width:3.5,height:14,rx:1,fill:K.ink},i);E('rect',{x:5.5,y:-5,width:3,height:10,rx:1,fill:K.mint},i)}
  if(kind==='cross'){E('rect',{x:-3.2,y:-10,width:6.4,height:20,rx:1.2,fill:K.cobalt},i);E('rect',{x:-10,y:-3.2,width:20,height:6.4,rx:1.2,fill:K.cobalt},i)}
  if(kind==='house'){E('path',{d:'M-11 -1 L0 -11 L11 -1 V11 H-11 Z',fill:K.ink},i);E('rect',{x:-3,y:3,width:6,height:8,fill:K.carta},i)}
  if(kind==='key'){E('circle',{cx:-5,cy:0,r:6,fill:'none',stroke:K.cobalt,'stroke-width':3.2},i);E('path',{d:'M1 0 H12 M8 0 V5 M11 0 V4',stroke:K.cobalt,'stroke-width':3,fill:'none'},i)}
  if(kind==='beer'){E('rect',{x:-8,y:-6,width:12,height:16,rx:2,fill:K.sun},i);E('path',{d:'M-9 -6 Q-9 -12 -3 -11 Q1 -14 5 -10 Q8 -10 6 -6 Z',fill:K.carta,stroke:K.ink,'stroke-width':1},i);E('path',{d:'M4 -2 H8 Q11 -2 11 2 V4 Q11 7 8 7 H4',fill:'none',stroke:K.sun,'stroke-width':2.6},i)}
  if(kind==='check'){E('path',{d:'M-8 0 L-2 6 L9 -6',fill:'none',stroke:K.carta,'stroke-width':3.4,'stroke-linecap':'round','stroke-linejoin':'round'},i)}
  if(kind==='ticket'){E('rect',{x:-8,y:-10,width:16,height:20,rx:2,fill:K.carta},i);E('path',{d:'M-4 -4 H4 M-4 0 H4 M-4 4 H1',stroke:K.ink,'stroke-width':1.8},i)}
  if(kind==='phone'){E('rect',{x:-7,y:-11,width:14,height:22,rx:3,fill:K.carta},i);E('rect',{x:-4,y:-7,width:8,height:10,rx:1,fill:K.tomato},i)}
  if(kind==='flame'){E('path',{d:'M0 -11 C5 -6 8 -2 7 4 C6 9 3 11 0 11 C-3 11 -6 9 -7 4 C-8 -1 -4 -3 -3 -7 C-1 -4 0 -3 1 -2 C2 -5 1 -8 0 -11 Z',fill:K.carta},i)}
  return i}
function gymIc(g,i,x,y){var c=E('g',{transform:'translate('+x+' '+y+')'},g);
  if(i===0){E('circle',{cx:-6,cy:4,r:5,fill:'none',stroke:K.ink,'stroke-width':2},c);E('circle',{cx:7,cy:4,r:5,fill:'none',stroke:K.ink,'stroke-width':2},c);E('path',{d:'M-6 4 L-1 -5 H5 L7 4 M-1 -5 L-3 -8',fill:'none',stroke:K.ink,'stroke-width':2},c)}
  if(i===1){E('circle',{cx:0,cy:-7,r:3,fill:K.ink},c);E('path',{d:'M-9 7 L0 -2 L9 7 M-6 2 H6',fill:'none',stroke:K.ink,'stroke-width':2.2,'stroke-linecap':'round'},c)}
  if(i===2){E('circle',{cx:0,cy:3,r:7,fill:K.ink},c);E('path',{d:'M-5 -2 V-6 Q-5 -9 0 -9 Q5 -9 5 -6 V-2',fill:'none',stroke:K.ink,'stroke-width':2.2},c)}
  if(i===3){E('rect',{x:-10,y:2,width:20,height:5,rx:2.5,fill:K.ink},c);E('circle',{cx:0,cy:-5,r:5,fill:'none',stroke:K.ink,'stroke-width':2.2},c)}}
function head(g,b,w,h){E('path',{d:'M16 0 H'+(w-16)+' Q'+w+' 0 '+w+' 16 V'+h+' H0 V16 Q0 0 16 0 Z',fill:b.a},g);E('circle',{cx:30,cy:h/2,r:14,fill:K.carta},g);icon(g,b.ic,30,h/2,.78);
  txt(g,54,h/2+6,b.n,18,b.tc,'Hanken,sans-serif',700);var m=txt(g,w-22,h/2+4,b.meta,12,b.tc,null,500,'end');m.setAttribute('opacity',.75);
  if(b.body==='floor')return svcBtn(g)}
/* Start service: un tasto vero della barra dell'app, accanto all'orario. Stato: pronto, sotto il cursore, premuto, in servizio, finito */
function svcBtn(g){var o=E('g',{transform:'translate(650 9)'},g),bt=E('g',{},o);var r=E('rect',{width:160,height:30,rx:15,fill:K.carta},bt);
  var pl=E('path',{d:'M15 9.5 L23 15 L15 20.5 Z',fill:K.tomato},bt);var dt=E('circle',{cx:19,cy:15,r:4.5,fill:K.mint,opacity:0},bt);
  var t=txt(bt,32,20,'Start service',13,K.ink,'Hanken,sans-serif',700);return {g:o,b:bt,r:r,pl:pl,dt:dt,t:t}}
function chip(g,x,y,t,bg,fg,w){E('rect',{x:x,y:y-14,width:w||(t.length*7.6+18),height:22,rx:11,fill:bg},g);return txt(g,x+9,y+1.5,t,11.5,fg)}
/* ---- corpi delle app ---- */
var BODY={
 clinic:function(g,A){var docs=[['JB','Dr. Bennett'],['LC','Dr. Collins'],['AF','Dr. Fraser']];
   ['09:00','10:00','11:00','12:00','13:00'].forEach(function(h,i){var y=118+i*86;txt(g,24,y+4,h,12,K.mut);E('rect',{x:90,y:y,width:890,height:1,fill:TINT.line},g)});
   docs.forEach(function(d,i){var x=100+i*296;E('circle',{cx:x+16,cy:82,r:15,fill:[TINT.cob,TINT.mint,TINT.sun][i]},g);txt(g,x+16,86.5,d[0],11,K.ink,null,500,'middle');txt(g,x+40,88,d[1],15,K.ink,'Hanken,sans-serif',600)});
   function ap(c,y,h,col,t1,t2){var x=100+c*296;E('rect',{x:x,y:y,width:280,height:h,rx:8,fill:col},g);E('rect',{x:x,y:y,width:5,height:h,rx:2.5,fill:K.ink,opacity:.5},g);txt(g,x+16,y+24,t1,14,K.ink,'Hanken,sans-serif',600);txt(g,x+16,y+42,t2,11,K.ink)}
   ap(0,124,70,TINT.mint,'Check-up · Carter','09:05 · 30 MIN');ap(0,300,96,TINT.sun,'Follow-up · Green','11:10 · 45 MIN');
   ap(1,124,150,TINT.cob,'Surgery · Morgan','09:05 · 90 MIN');ap(2,124,60,TINT.sun,'Exam · Reed','09:05 · 20 MIN');ap(2,386,90,TINT.mint,'Visit · Brooks','12:10 · 40 MIN');
   A.cSlot=E('rect',{x:396,y:300,width:280,height:80,rx:8,fill:'none',stroke:K.cobalt,'stroke-width':2,'stroke-dasharray':'6 5'},g);
   var nb=A.cNew=E('g',{},g);E('rect',{x:0,y:0,width:280,height:80,rx:8,fill:K.cobalt},nb);txt(nb,16,28,'Visit · Ross M.',15,K.carta,'Hanken,sans-serif',700);txt(nb,16,50,'11:10 · 40 MIN · NEW',11,K.carta);
   A.cLink=E('path',{d:'M676 340 C690 340 690 330 704 330',fill:'none',stroke:K.cobalt,'stroke-width':2.5,pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},g);
   var sm=A.cSms=E('g',{opacity:0},g);E('rect',{x:4,y:8,width:262,height:72,rx:14,fill:K.ink,opacity:.12},sm);E('rect',{x:0,y:0,width:262,height:72,rx:14,fill:TINT.white},sm);
   E('circle',{cx:28,cy:36,r:15,fill:K.cobalt},sm);E('rect',{x:21,y:26,width:14,height:20,rx:3,fill:'none',stroke:K.carta,'stroke-width':2},sm);
   txt(sm,52,28,'SMS · ROSS M.',10,K.mut);txt(sm,52,50,'See you Tue at 11:10',14,K.ink,'Hanken,sans-serif',600);A.cSent=chip(sm,198,20,'SENT ✓',K.mint,K.ink,56).parentNode},
 map:function(g,A){var mp=E('g',{},g);E('rect',{x:0,y:HB,width:640,height:SH-HB,fill:TINT.land},mp);
   E('path',{d:'M0 420 Q160 380 260 450 T640 400 V560 H0Z',fill:TINT.cob,opacity:.8},mp);E('rect',{x:420,y:90,width:150,height:110,rx:10,fill:TINT.mint},mp);
   for(var i=0;i<7;i++)E('rect',{x:40+i*92,y:HB,width:10,height:SH-HB,fill:K.carta},mp);for(var j=0;j<5;j++)E('rect',{x:0,y:96+j*96,width:640,height:10,fill:K.carta},mp);
   E('path',{d:'M0 330 L640 150',stroke:K.carta,'stroke-width':14},mp);
   var rd='M60 500 L60 390 L230 390 L230 200 L414 200 L414 110 L560 110';A.rBase=E('path',{d:rd,fill:'none',stroke:K.ink,'stroke-width':4,'stroke-dasharray':'2 9','stroke-linecap':'round',opacity:.5},mp);
   A.rLine=E('path',{d:rd,fill:'none',stroke:K.cobalt,'stroke-width':7,'stroke-linejoin':'round','stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},mp);
   E('rect',{x:46,y:486,width:28,height:28,rx:4,fill:K.ink},mp);var pin=E('g',{transform:'translate(560 110)'},mp);E('path',{d:'M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0Z',fill:K.tomato},pin);E('circle',{cx:0,cy:-22,r:5,fill:K.carta},pin);
   var vn=A.van=E('g',{},mp);E('circle',{r:22,fill:K.carta},vn);icon(vn,'truck',0,0,1.25);
   var eta=A.eta=E('g',{},mp);E('rect',{x:0,y:0,width:112,height:34,rx:17,fill:K.ink},eta);A.etaT=txt(eta,56,22,'ETA 12 MIN',12,K.sun,null,500,'middle');
   var cc=E('g',{},g);E('rect',{x:660,y:68,width:320,height:122,rx:14,fill:TINT.white},cc);E('circle',{cx:700,cy:110,r:22,fill:K.sun},cc);txt(cc,700,117,'M',18,K.ink,'Hanken,sans-serif',700,'middle');
   txt(cc,734,106,'Mark · Van 3',16,K.ink,'Hanken,sans-serif',700);txt(cc,734,126,'#2041 · 12 KING ST',10,K.mut);
   E('circle',{cx:930,cy:120,r:30,fill:'none',stroke:TINT.line,'stroke-width':7},cc);A.etaRing=E('circle',{cx:930,cy:120,r:30,fill:'none',stroke:K.cobalt,'stroke-width':7,pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,transform:'rotate(-90 930 120)','stroke-linecap':'round'},cc);
   A.etaN=txt(cc,930,124,'12',18,K.ink,'Hanken,sans-serif',700,'middle');txt(cc,930,138,'MIN',8,K.mut,null,500,'middle');txt(cc,680,174,'4.9 ★ · 1,204 DELIVERIES',10,K.mut);
   var tl=E('g',{},g);E('rect',{x:660,y:204,width:320,height:242,rx:14,fill:TINT.white},tl);E('rect',{x:691,y:240,width:4,height:170,rx:2,fill:TINT.line},tl);A.tlFill=E('rect',{x:691,y:240,width:4,height:0,rx:2,fill:K.cobalt},tl);
   A.tl=[['Picked up','18:41'],['On the way','18:44'],['Nearby','18:52'],['Delivered','18:55']].map(function(st,i){var y=240+i*56.7;var d=E('circle',{cx:693,cy:y,r:9,fill:TINT.white,stroke:TINT.line,'stroke-width':3},tl);
     var l=txt(tl,716,y+5,st[0],15,K.ink,'Hanken,sans-serif',600);var tm=txt(tl,962,y+5,st[1],11,K.mut,null,500,'end');return {d:d,l:l,tm:tm}});
   [['38','TODAY'],['97%','ON TIME']].forEach(function(c,i){var x=660+i*164;E('rect',{x:x,y:460,width:156,height:80,rx:14,fill:i?K.ink:K.sun},g);txt(g,x+16,500,c[0],26,i?K.carta:K.ink,'Hanken,sans-serif',700);txt(g,x+16,524,c[1],10,i?K.carta:K.ink)})},
 gym:function(g,A){var p=E('g',{},g);E('rect',{x:24,y:68,width:500,height:470,rx:16,fill:K.ink},p);
   E('circle',{cx:62,cy:108,r:20,fill:TINT.sun},p);txt(p,62,114,'JR',14,K.ink,'Hanken,sans-serif',700,'middle');txt(p,92,104,'Julia R. · Leg day',17,K.carta,'Hanken,sans-serif',700);txt(p,92,124,'COACH LUKE · LIVE SESSION',10,K.sun);
   var rc=[[K.tomato,124,'MOVE'],[K.sun,96,'REPS'],[K.mint,68,'TIME']];A.rings=rc.map(function(r){E('circle',{cx:200,cy:330,r:r[1],fill:'none',stroke:r[0],'stroke-opacity':.18,'stroke-width':22},p);
     return E('circle',{cx:200,cy:330,r:r[1],fill:'none',stroke:r[0],'stroke-width':22,'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,transform:'rotate(-90 200 330)'},p)});
   A.ringPct=txt(p,200,342,'0%',36,K.carta,'Hanken,sans-serif',700,'middle');
   rc.forEach(function(r,i){E('circle',{cx:362,cy:420+i*26,r:6,fill:r[0]},p);txt(p,376,425+i*26,r[2],11,K.carta)});
   txt(p,362,176,'HEART RATE',10,K.sun);A.bpm=txt(p,362,222,'128',40,K.carta,'Hanken,sans-serif',700);txt(p,450,222,'BPM',11,K.carta);
   var hr='M362 300';for(var q=0;q<=20;q++){var x=362+q*7.5,y=q%5===2?262:q%5===3?318:290;hr+=' L'+x+' '+y}A.hr=E('path',{d:hr,fill:'none',stroke:K.tomato,'stroke-width':3,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},p);
   txt(g,546,96,'Workout plan',16,K.ink,'Hanken,sans-serif',700);txt(g,976,96,'5 EXERCISES · 45 MIN',10,K.mut,null,500,'end');
   A.ex=[['Squat','4 × 12',2],['Deadlift','4 × 8',2],['Lunges','3 × 12',3],['Leg press','3 × 10',0],['Bike','10 min',1]].map(function(e,i){var y=118+i*82;var row=E('g',{},g);
     var bgR=E('rect',{x:540,y:y,width:436,height:70,rx:12,fill:TINT.white},row);E('circle',{cx:580,cy:y+35,r:20,fill:[TINT.sun,TINT.tom,TINT.mint,TINT.cob,TINT.sun][i]},row);gymIc(row,e[2],580,y+35);
     txt(row,612,y+32,e[0],16,K.ink,'Hanken,sans-serif',700);txt(row,612,y+52,e[1],11,K.mut);var ck=E('g',{opacity:0},row);E('circle',{cx:944,cy:y+35,r:15,fill:K.mint},ck);icon(ck,'check',944,y+35,.7);
     return {bg:bgR,ck:ck}})},
 floor:function(g,A){A.fpC=floorPlan(g,true)},
 gen:function(g,A,b){E('rect',{x:24,y:72,width:300,height:200,rx:12,fill:TINT.white},g);E('rect',{x:340,y:72,width:300,height:200,rx:12,fill:TINT.white},g);E('rect',{x:656,y:72,width:320,height:200,rx:12,fill:TINT.white},g)}
};
function buildStack(A,root){var L0=A.SL=E('g',{opacity:0},root);E('rect',{width:1600,height:900,fill:K.tomato},L0);E('rect',{width:1600,height:900,fill:'url(#ht)'},L0);var L=A.SLc=E('g',{},L0);
  A.stk=[];for(var k=BR.length-1;k>=0;k--){var b=BR[k],g=E('g',{},L);
    E('rect',{x:6,y:22,width:SW,height:SH,rx:18,fill:K.ink,opacity:.2},g);E('rect',{x:0,y:0,width:SW,height:SH,rx:16,fill:K.carta},g);
    var body=E('g',{},g);BODY[b.body](body,A,b);var hd=E('g',{},g);head(hd,b,SW,HB);A.stk[k]={g:g,body:body}}
  A.ghost=[0,1,2].map(function(){var gh=E('g',{opacity:0},L);E('rect',{width:240,height:480,rx:36,fill:K.ink},gh);return gh});
  A.bang=E('g',{opacity:0},L);[-60,-25,10,45,80].forEach(function(a,i){var r=a*Math.PI/180;E('path',{d:'M'+f(Math.cos(r)*-40)+' '+f(Math.sin(r)*-40)+' L'+f(Math.cos(r)*-90)+' '+f(Math.sin(r)*-90),stroke:i%2?K.carta:K.ink,'stroke-width':7,'stroke-linecap':'round'},A.bang)});
  var ph=A.ph=E('g',{opacity:0},L);E('rect',{x:8,y:20,width:240,height:480,rx:36,fill:K.ink,opacity:.22},ph);E('rect',{x:0,y:0,width:240,height:480,rx:36,fill:K.ink},ph);
  E('rect',{x:10,y:10,width:220,height:460,rx:27,fill:K.carta},ph);E('rect',{x:90,y:20,width:60,height:10,rx:5,fill:K.ink},ph);
  E('circle',{cx:38,cy:64,r:13,fill:K.sun},ph);icon(ph,'truck',38,64,.7);txt(ph,58,70,'Swift Couriers',16,K.ink,'Hanken,sans-serif',700);
  txt(ph,24,106,'Your order',22,K.ink,'Hanken,sans-serif',700);
  E('rect',{x:20,y:120,width:200,height:150,rx:14,fill:TINT.land},ph);for(var mi=0;mi<4;mi++){E('rect',{x:20,y:150+mi*34,width:200,height:5,fill:K.carta},ph);E('rect',{x:52+mi*50,y:120,width:5,height:150,fill:K.carta},ph)}
  var prd='M40 252 L40 220 L104 220 L104 152 L196 152';A.pRB=E('path',{d:prd,fill:'none',stroke:K.ink,'stroke-width':3,'stroke-dasharray':'2 6',opacity:.5},ph);
  A.pR=E('path',{d:prd,fill:'none',stroke:K.cobalt,'stroke-width':5,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},ph);
  E('circle',{cx:196,cy:152,r:7,fill:K.tomato},ph);A.pVan=E('circle',{r:8,fill:K.cobalt,stroke:K.carta,'stroke-width':3},ph);
  txt(ph,24,300,'ARRIVING IN',11,K.mut);A.pEta=txt(ph,24,346,'12 min',40,K.ink,'Hanken,sans-serif',700);
  [['Packed',1],['On the way',1],['At door',0]].forEach(function(st,i){var y=374+i*0;var x=28+i*74;E('circle',{cx:x,cy:378,r:6,fill:st[1]?K.mint:TINT.line},ph);txt(ph,x-6,400,st[0],9.5,K.ink)});
  E('rect',{x:20,y:414,width:200,height:44,rx:22,fill:K.sun},ph);txt(ph,120,442,'Call courier',14,K.ink,'Hanken,sans-serif',700,'middle')}
/* la sala della pizzeria, vista dall'alto. Disegnata una volta per la card e una per la versione aperta */
var TB18=[];(function(){for(var r=0;r<3;r++)for(var c=0;c<6;c++){var round=(c+r)%3===0;TB18.push({x:72+c*94,y:132+r*124,round:round,seats:round?2:4,id:r*6+c+1})}
  TB18.forEach(function(t){t.rank=Math.hypot(t.x-40,t.y-520)});var o=TB18.slice().sort(function(a,b){return a.rank-b.rank});o.forEach(function(t,i){t.ord=i})})();
var TSTATE=[TINT.white,K.sun,K.cobalt,K.mint,K.tomato];
function floorPlan(g,card){var R={tb:[]};E('rect',{x:20,y:64,width:620,height:476,rx:12,fill:'#EFECE3'},g);txt(g,38,90,'FLOOR · 18 TABLES',11,K.mut);var lgx=358;[['FREE',TINT.white,45],['SEATED',K.sun,56],['ORDERED',K.cobalt,62],['SERVED',K.mint,56],['PAID',K.tomato,45]].forEach(function(q){E('circle',{cx:lgx+4,cy:86,r:4.5,fill:q[1],stroke:K.ink,'stroke-opacity':q[1]===TINT.white?.3:0,'stroke-width':1.2},g);txt(g,lgx+13,90,q[0],9.5,K.mut);lgx+=q[2]});
  E('rect',{x:40,y:486,width:470,height:30,rx:8,fill:TINT.line},g);txt(g,56,506,'BAR',11,K.mut);E('rect',{x:540,y:486,width:80,height:30,rx:8,fill:K.ink},g);txt(g,580,506,'PASS',11,K.carta,null,500,'middle');
  TB18.forEach(function(t){var tg=E('g',{transform:'translate('+t.x+' '+t.y+')'},g);
    if(t.round){[-26,26].forEach(function(dx){E('circle',{cx:dx,cy:0,r:6,fill:K.ink,opacity:.22},tg)});var sh=E('circle',{r:19,fill:TINT.white,stroke:K.ink,'stroke-opacity':.18,'stroke-width':1.5},tg)}
    else{[[-30,-8],[22,-8],[-8,-30],[-8,22]].forEach(function(d){E('rect',{x:d[0],y:d[1],width:d[0]===-8?16:8,height:d[0]===-8?8:16,rx:3,fill:K.ink,opacity:.22},tg)});var sh=E('rect',{x:-20,y:-20,width:40,height:40,rx:7,fill:TINT.white,stroke:K.ink,'stroke-opacity':.18,'stroke-width':1.5},tg)}
    txt(tg,0,4,String(t.id),10,K.ink,null,500,'middle');R.tb.push({g:tg,sh:sh,st:-1,t:t})});
  var kc=E('g',{},g);E('rect',{x:656,y:64,width:324,height:150,rx:12,fill:TINT.white},kc);txt(kc,674,92,'Kitchen',15,K.ink,'Hanken,sans-serif',700);txt(kc,962,92,'IN QUEUE',10,K.mut,null,500,'end');
  R.kq=txt(kc,962,124,'0',30,K.ink,'Hanken,sans-serif',700,'end');R.kt=[];for(var q=0;q<6;q++){E('rect',{x:674.75+q*48,y:150.75,width:38.5,height:44.5,rx:5,fill:'none',stroke:TINT.line,'stroke-width':1.5,'stroke-dasharray':'4 3'},kc);var kg=E('g',{opacity:0},kc);E('rect',{x:674+q*48,y:150,width:40,height:46,rx:5,fill:K.sun},kg);txt(kg,694+q*48,170,'T'+[7,3,12,5,16,9][q],10.5,K.ink,null,500,'middle');E('rect',{x:682+q*48,y:180,width:24,height:3,rx:1.5,fill:K.ink,opacity:.35},kg);E('rect',{x:682+q*48,y:187,width:16,height:3,rx:1.5,fill:K.ink,opacity:.35},kg);R.kt.push(kg)}
  var dc=E('g',{},g);E('rect',{x:656,y:226,width:324,height:150,rx:12,fill:TINT.white},dc);txt(dc,674,254,'Delivery',15,K.ink,'Hanken,sans-serif',700);R.rdn=txt(dc,962,254,'0 RIDERS OUT',10,K.mut,null,500,'end');
  E('rect',{x:674,y:266,width:288,height:96,rx:8,fill:TINT.land},dc);[300,330].forEach(function(y){E('rect',{x:674,y:y,width:288,height:5,fill:K.carta},dc)});[740,820,900].forEach(function(x){E('rect',{x:x,y:266,width:5,height:96,fill:K.carta},dc)});
  R.rd=[0,1,2].map(function(i){return E('circle',{r:6,fill:K.cobalt,stroke:K.carta,'stroke-width':2.5,cx:680,cy:302,opacity:0,style:'display:none'},dc)});
  var tn=E('g',{},g);E('rect',{x:656,y:388,width:324,height:152,rx:12,fill:K.ink},tn);txt(tn,674,416,'TONIGHT',10,K.carta,null,500);txt(tn,674,446,'COVERS',10,K.sun);R.cov=txt(tn,674,494,'38',40,K.carta,'Hanken,sans-serif',700);
  txt(tn,820,446,'REVENUE',10,K.sun);R.rev=txt(tn,820,494,'€ 1,140',30,K.carta,'Hanken,sans-serif',700);
  R.res=E('g',{opacity:0},g);E('rect',{x:0,y:0,width:196,height:40,rx:20,fill:K.ink},R.res);E('circle',{cx:22,cy:20,r:7,fill:K.sun},R.res);txt(R.res,38,25,'Ross · 4 · 21:00',13,K.carta);
  R.flow=[];for(var c0=0;c0<8;c0++)R.flow.push(E('path',{fill:'none',stroke:K.tomato,'stroke-width':2.4,'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,opacity:0},g));
  R.chips=[];for(var c=0;c<8;c++)R.chips.push(E('rect',{width:26,height:18,rx:4,fill:K.tomato,opacity:0},g));
  R.kd=E('path',{d:'M818 214 V226',stroke:K.cobalt,'stroke-width':3,fill:'none',opacity:0},g);
  R.spark=E('path',{fill:'none',stroke:K.sun,'stroke-width':2.4,'stroke-linejoin':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},tn);R.sparkD=[];
  return R}
function setTable(T,st){if(T.st===st)return;T.st=st;T.sh.setAttribute('fill',TSTATE[st]);T.sh.setAttribute('stroke-opacity',st?0:.18)}
var CARD_SEATED=[2,5,9,10,14,17];
/* coreografia: le card si alzano, tre fanno vedere la loro funzione e vengono buttate via, la pizzeria si apre */
var SWP=[[1.5,1.78],[3.22,3.5],[4.44,4.72]],EXP=[5.35,5.85],PEEK=[[-300,850,-16],[1880,40,14],[-330,165,-9]];
function stkShift(v){var s=0;SWP.forEach(function(w){s+=ez.io3(P(v,w[0],w[1]))});return s}
function phBump(v){return ez.io3(P(v,2.12,2.5))}
function cardGeom(k,v){var f2=k-stkShift(v),cx=800,cy,s,rot=0,o=1;
  var qx=1,qy=1;cy=505-Math.max(0,f2)*42;s=1-Math.max(0,f2)*.055;
  if(k===1){var bb=phBump(v);cx-=140*bb;s*=1-.16*bb}
  if(f2<0&&k<3){var e=ez.io3(Math.min(1,-f2)),dd=PEEK[k],ex0=ez.io3(P(v,EXP[0],EXP[1])),dx=dd[0]<800?-1:1,dy=dd[1]<450?-1:1;cx=lerp(cx,dd[0]+dx*700*ex0,e);cy=lerp(cy,dd[1]+dy*500*ex0,e);rot=lerp(rot,dd[2],e);s=lerp(s,1,e)}
  var d=(BR.length-1-k)*.045,ri=ez.out3(P(v,d,d+.5));cy+=820*(1-ri);
  var ex=ez.io3(P(v,EXP[0],EXP[1]));if(k===3){cy=lerp(cy,450,ex);s=lerp(s,1360/SW,ex)}else if(k>3){o=1-ex;cy+=240*ex}
  return {cx:cx,cy:cy,s:s,rot:rot,o:o,ex:ex,qx:qx,qy:qy}}
function renderStack(A,t){var v=t-STK0,on=v>=0&&v<STKD+.12;op(A.SL,on?1:0);if(!on)return;
  A.stk.forEach(function(c,k){var G2=cardGeom(k,v);c.g.setAttribute('transform','translate('+f(G2.cx)+' '+f(G2.cy)+') rotate('+f(G2.rot)+') scale('+f(G2.s*G2.qx)+' '+f(G2.s*G2.qy)+') translate('+(-SW/2)+' '+(-SH/2)+')');op(c.g,G2.o)});

  /* clinica: l'appuntamento entra da fuori e si incastra */
  var a1=ez.out3(P(v,.62,.98)),la=P(v,.98,1.12);A.cNew.setAttribute('transform','translate('+f(lerp(1180,396,a1))+' '+f(lerp(-80,300,a1))+') rotate('+f(16*(1-a1))+' 140 40) scale('+f(1.35-.35*a1+.04*Math.sin(Math.PI*la))+')');
  op(A.cSlot,1-P(v,.95,1.0));op(A.cNew,v>.6?1:0);A.cLink.setAttribute('stroke-dashoffset',f(1-ez.io3(P(v,1.02,1.14))));var sm=ez.back(P(v,1.1,1.1+D.med),1.3);op(A.cSms,v>1.1?1:0);A.cSms.setAttribute('transform','translate(704 296) scale('+f(.6+.4*sm)+')');
  /* logistica: il furgone entra e segue il percorso; l'ETA scende, gli stati cambiano */
  var rp=ez.io3(P(v,1.95,3.05));A.rLine.setAttribute('stroke-dashoffset',f(1-rp));var len=A.rBase.getTotalLength?A.rBase.getTotalLength():1;
  var vin=ez.out3(P(v,1.8,1.98)),pt=A.rBase.getPointAtLength?A.rBase.getPointAtLength(len*rp):{x:60,y:500};op(A.van,v>1.78?1:0);A.van.setAttribute('transform','translate('+f(lerp(-260,pt.x,vin))+' '+f(lerp(620,pt.y,vin))+')');
  A.eta.setAttribute('transform','translate('+f(pt.x+26)+' '+f(pt.y-56)+')');A.etaT.textContent='ETA '+Math.max(1,Math.round(12-11*rp))+' MIN';
  A.etaRing.setAttribute('stroke-dashoffset',f(1-rp));A.etaN.textContent=String(Math.max(1,Math.round(12-11*rp)));
  var lv=rp*3;A.tlFill.setAttribute('height',f(170*Math.min(1,lv/3)));A.tl.forEach(function(st,i){var on2=v>1.85&&lv>=i-.02;st.d.setAttribute('fill',on2?K.cobalt:TINT.white);st.d.setAttribute('stroke',on2?K.cobalt:TINT.line);st.l.setAttribute('opacity',on2?1:.4)});
  /* telefono: entra di corsa con la scia, colpisce il desktop (scossa, schiacciamento), rimbalza e si sistema accanto; poi resta a pezzo in basso a destra */
  /* il telefono scivola dentro mentre il desktop gli fa spazio; un'inclinazione che si raddrizza e un'ombra che si posa */
  var pi=ez.out3(P(v,2.06,2.48)),pe=ez.io3(P(v,3.22,3.5)),pex=ez.io3(P(v,EXP[0],EXP[1]));op(A.ph,v>2.04?1-P(v,EXP[0]+.3,EXP[1]):0);
  var pxx=lerp(1820,1100,pi),pyy=lerp(330,265,pi)-14*Math.sin(Math.PI*pi),prt=lerp(10,0,ez.io3(P(v,2.1,2.55)));
  pxx=lerp(pxx,1470+300*pex,pe);pyy=lerp(pyy,590+300*pex,pe);prt=lerp(prt,20,pe);
  A.ph.setAttribute('transform','translate('+f(pxx)+' '+f(pyy)+') rotate('+f(prt)+' 120 240)');
  A.ghost.forEach(function(gh){op(gh,0)});op(A.bang,0);
  A.pR.setAttribute('stroke-dashoffset',f(1-rp));var pl=A.pRB.getTotalLength?A.pRB.getTotalLength():1,pp=A.pRB.getPointAtLength?A.pRB.getPointAtLength(pl*rp):{x:40,y:252};
  A.pVan.setAttribute('cx',f(pp.x));A.pVan.setAttribute('cy',f(pp.y));A.pEta.textContent=Math.max(1,Math.round(12-11*rp))+' min';
  /* palestra: il badge entra, scansione, benvenuto, il corso si riempie */
  var rg=[ez.io3(P(v,3.55,4.25)),ez.io3(P(v,3.62,4.3)),ez.io3(P(v,3.7,4.32))],tgt=[.86,.78,.92];A.rings.forEach(function(r,i){r.setAttribute('stroke-dashoffset',f(1-tgt[i]*rg[i]))});
  A.ringPct.textContent=Math.round(82*rg[0])+'%';A.hr.setAttribute('stroke-dashoffset',f(1-ez.io3(P(v,3.55,4.3))));A.bpm.textContent=String(Math.round(128+14*ez.io3(P(v,3.6,4.3))));
  A.ex.forEach(function(e,i){var a=3.66+i*.17,done=v>a&&i<4,cur=v>a-.17&&!done&&i<=4&&v>3.55;op(e.ck,done?ez.back(P(v,a,a+.15)):0);e.bg.setAttribute('fill',cur?TINT.sun:TINT.white)});
  /* cucina: un ordine nuovo cade nella colonna, uno passa a pronto */
  var C=A.fpC,T7=TB18[6];C.tb.forEach(function(T,i){setTable(T,CARD_SEATED.indexOf(i)>=0?(i%3===0?3:1):0)});
  var rk=ez.out3(P(v,4.8,5.08)),rl=P(v,5.08,5.2);op(C.res,v>4.78?1-P(v,5.18,5.26):0);C.res.setAttribute('transform','translate('+f(lerp(1150,T7.x-98,rk))+' '+f(lerp(-120,T7.y-58,rk))+') rotate('+f(14*(1-rk))+' 98 20)');
  if(v>5.16){setTable(C.tb[6],1);var pp2=ez.back(P(v,5.16,5.36),2);C.tb[6].g.setAttribute('transform','translate('+T7.x+' '+T7.y+') scale('+f(.7+.3*pp2)+')')}else C.tb[6].g.setAttribute('transform','translate('+T7.x+' '+T7.y+')');
  C.cov.textContent=v>5.16?'42':'38'}
function curStk(v,A){var off=[1750,1100];function go(a,b,t0,t1){var p=ez.io3(P(v,t0,t1));return [lerp(a[0],b[0],p),lerp(a[1],b[1],p)-Math.sin(p*Math.PI)*40]}
  function grab(k){var g=cardGeom(Math.min(k,2),Math.min(v,SWP[k][0]));return [g.cx+260*g.s,g.cy+120*g.s]}
  if(v<1.25)return off;if(v<1.5)return go(off,grab(0),1.25,1.5);if(v<1.62)return grab(0);if(v<1.95)return go(grab(0),off,1.62,1.95);
  if(v<2.97)return off;if(v<3.22)return go(off,grab(1),2.97,3.22);if(v<3.34)return grab(1);if(v<3.7)return go(grab(1),off,3.34,3.7);
  if(v<4.19)return off;if(v<4.44)return go(off,grab(2),4.19,4.44);if(v<4.56)return grab(2);
  var g3=cardGeom(3,v),hd=[g3.cx+(-SW/2+150)*g3.s,g3.cy+(-SH/2+24)*g3.s];if(v<5.25)return go(grab(2),hd,4.72,5.1);if(v<5.45)return hd;return go(hd,off,5.45,5.8)}
function stkPress(v){return (v>1.5&&v<1.62)||(v>3.22&&v<3.34)||(v>4.44&&v<4.56)||(v>5.22&&v<5.32)}
/* ---------- momento 3: la pizzeria aperta. Start service: il venerdì sera si mette in moto da solo ---------- */
function buildDash(A,root){var L=A.DL=E('g',{opacity:0},root);E('rect',{width:1600,height:900,fill:K.tomato},L);E('rect',{width:1600,height:900,fill:'url(#ht)'},L);
  A.dgrid=E('g',{},L);A.dcam=E('g',{},L);L=A.dcam;var W=A.win=E('g',{},L);E('rect',{x:128,y:100,width:1360,height:760,rx:22,fill:K.ink,opacity:.2},W);var in_=E('g',{'clip-path':'url(#cpW)'},W);
  E('rect',{x:120,y:70,width:1360,height:760,rx:22,fill:K.carta},in_);var hb=E('g',{transform:'translate(120 70) scale(1.36)'},in_);var b3={};for(var kk in BR[3])b3[kk]=BR[3][kk];b3.meta='';A.sb=head(hb,b3,SW,HB);
  A.cnt=txt(in_,1450,108,'FLOOR · FRI 20:30',16,K.carta,null,500,'end');
  var body=E('g',{transform:'translate(120 70) scale(1.36)'},in_);A.fpB=floorPlan(body,false);

  A.stamp=E('g',{opacity:0},body);var st=E('g',{transform:'rotate(-8)'},A.stamp);E('rect',{x:-170,y:-42,width:340,height:84,rx:12,fill:K.carta,opacity:.9},st);E('rect',{x:-170,y:-42,width:340,height:84,rx:12,fill:'none',stroke:K.tomato,'stroke-width':6},st);txt(st,0,15,'FULL HOUSE ✓',40,K.tomato,'Hanken,sans-serif',800,'middle');
  A.toast=E('g',{opacity:0},L);E('rect',{x:6,y:12,width:380,height:72,rx:36,fill:K.ink,opacity:.25},A.toast);E('rect',{x:0,y:0,width:380,height:72,rx:36,fill:K.ink},A.toast);E('circle',{cx:38,cy:36,r:9,fill:K.mint},A.toast);
  txt(A.toast,62,32,'Friday night · 214 covers',18,K.carta,'Hanken,sans-serif',700);txt(A.toast,62,54,'0 ERRORS · AUTOPILOT',12,K.sun)}
function svT(i){return 10.45+TB18[i].ord*.055}
function renderDash(A,t){var on=t>9.9&&t<12.9;op(A.DL,on?1:0);if(!on)return;op(A.dgrid,0);var B=A.fpB;
  op(A.win,1);
  var B2=A.sb,live=t>10.36,hov=t>10.2&&!live,prs=P(t,10.3,10.34)*(1-P(t,10.36,10.42)),done2=t>11.65;
  B2.r.setAttribute('fill',live?K.ink:hov?K.sun:K.carta);B2.t.setAttribute('fill',live?K.carta:K.ink);B2.t.textContent=done2?'Service complete':live?'Service live':'Start service';
  op(B2.pl,live?0:1);op(B2.dt,live?1:0);B2.dt.setAttribute('r',f(done2?4.5:4.5+1.6*Math.max(0,Math.sin((t-10.36)*9))));
  B2.b.setAttribute('transform','translate(80 15) scale('+f(1-.06*prs)+') translate(-80 -15)');
  A.cnt.textContent=t>11.65?'0 ERRORS · FRI 20:30':t>10.36?'LIVE · FRI 20:30':'FLOOR · FRI 20:30';
  B.tb.forEach(function(T,i){var s0=svT(i),st=CARD_SEATED.indexOf(i)>=0||i===6?(i%3===0?3:1):0;if(t>s0)st=1;if(t>s0+.22)st=2;if(t>s0+.5)st=3;if(t>s0+.82&&T.t.ord%4===0)st=4;setTable(T,st);
    var pp=P(t,s0,s0+.2),d2=P(t,11.62+T.t.ord*.012,11.82+T.t.ord*.012),sc=pp>0&&pp<1?1+.18*Math.sin(Math.PI*pp):d2>0&&d2<1?1+.14*Math.sin(Math.PI*d2):1,tr='translate('+T.t.x+' '+T.t.y+') scale('+f(sc)+')';if(T._tr!==tr){T._tr=tr;T.g.setAttribute('transform',tr)}});
  B.chips.forEach(function(c,i){var T=TB18[(i*5+3)%18],a=svT((i*5+3)%18)+.22,p=P(t,a,a+.35),tx=700+(i%6)*48;op(c,p>0&&p<1?1:0);var x=lerp(T.x,tx,ez.io3(p)),y=lerp(T.y,170,ez.io3(p))-60*Math.sin(Math.PI*p);c.setAttribute('x',f(x-13));c.setAttribute('y',f(y-9));
    var fl=B.flow[i];if(!fl._d){fl.setAttribute('d','M'+T.x+' '+T.y+' Q'+f((T.x+tx)/2)+' '+f(Math.min(T.y,170)-70)+' '+tx+' 170');fl._d=1}fl.setAttribute('stroke-dashoffset',f(1-ez.io3(p)));op(fl,p>0?.55*(1-P(t,a+.35,a+.55))*(1-P(t,11.45,11.6)):0)});
  op(B.kd,t>10.7&&t<11.7?1:0);
  if(!B.sparkD.length){for(var q=0;q<=24;q++)B.sparkD.push([674+q*12,532-14*(q/24)-6*Math.sin(q*.9)*(q/24)]);B.spark.setAttribute('d','M'+B.sparkD.map(function(p){return f(p[0])+' '+f(p[1])}).join('L'))}
  var kq=Math.round(Math.min(6,Math.max(0,(t-10.6)*9))*(1-P(t,11.4,11.8))+2*P(t,11.4,11.8));B.kq.textContent=String(t>10.5?kq+6:0);B.kt.forEach(function(k,i){op(k,t>10.62+i*.08?(i%2?.55:1):0)});
  var rp=P(t,10.7,11.7);B.rd.forEach(function(r,i){var u=cl(rp*1.4-i*.2);op(r,t>10.7+i*.1?1:0);r.setAttribute('cx',f(680+270*u));r.setAttribute('cy',f([302,332,272][i]+(i===2?30*u:0)))});B.rdn.textContent=(t>10.7?Math.min(6,1+Math.floor((t-10.7)*7)):0)+' RIDERS OUT';
  var cv=ez.io3(P(t,10.42,11.6));B.spark.setAttribute('stroke-dashoffset',f(1-cv));B.cov.textContent=String(Math.round(42+(214-42)*cv));B.rev.textContent='€ '+Math.round(1140+(4860-1140)*cv).toLocaleString('en-US');
  op(A.stamp,0);
  var ts=ez.back(P(t,11.78,11.78+D.med),1.3);op(A.toast,t>11.78?1:0);A.toast.setAttribute('transform','translate('+f(1140+460*(1-ts))+' 786)');
}
/* ---------- momento 4: chiusura e loop ---------- */
function buildEnd(A,root){var L=A.EL=E('g',{opacity:0},root);
  var cpEC=E('clipPath',{id:'cpEC'},L);A.eCc=E('circle',{cx:800,cy:410,r:0},cpEC);
  var xi=A.eXi=E('g',{transform:'translate(277.5 639.8) scale(.27)'},L);U('lgM',{fill:K.ink,'clip-path':'url(#cpEM)'},xi);E('path',{d:LGP.t0,fill:K.ink,'clip-path':'url(#cpE0)'},xi);E('path',{d:LGP.t1,fill:K.ink,'clip-path':'url(#cpE1)'},xi);
  A.eC=E('circle',{cx:800,cy:410,r:0,fill:K.ink},L);
  var g=A.eG=E('g',{'clip-path':'url(#cpEC)'},L),x=A.eX=E('g',{transform:'translate(277.5 639.8) scale(.27)'},g);
  var cpEM=E('clipPath',{id:'cpEM'},x);A.emr=E('rect',{x:-80,y:0,width:840,height:0},cpEM);
  A.eFill=U('lgM',{fill:K.carta,'clip-path':'url(#cpEM)'},x);
  E('path',{d:LGP.t0,fill:K.carta,'clip-path':'url(#cpE0)'},x);E('path',{d:LGP.t1,fill:K.carta,'clip-path':'url(#cpE1)'},x);
  /* la frase in DMMono maiuscolo, spaziata: geometrica e a tratto unico come il logo, stesso bianco */
  A.tagl=txt(L,800,770,'THE MACHINE BEHIND YOUR BUSINESS.',30,K.carta,'DMMono,monospace',500,'middle');A.tagl.setAttribute('letter-spacing','5');
  A.url=txt(L,800,814,'mothermachine.studio',15,K.carta,'Hanken,sans-serif',400,'middle');A.url.setAttribute('opacity',0)}
function renderEnd(A,t){var on=t>12.4;op(A.EL,on?1:0);if(!on)return;
  var back=ez.io3(P(t,14.6,15.02)),opn=P(t,12.42,12.42+D.slow*.8),cy=410+40*ez.io3(P(t,14.6,15.02)),cx=800,r;
  /* il nero nasce dal pallino verde della notifica (0 errori) e copre tutto; poi, a schermo pieno, il centro passa sul logo */
  if(opn<1){cx=1178;cy=822;r=9+2100*ez.io3(opn)}else r=1900*(1-back);
  [A.eC,A.eCc].forEach(function(c){c.setAttribute('r',f(r));c.setAttribute('cx',f(cx));c.setAttribute('cy',f(cy))});
  var mh=1500*ez.io3(P(t,12.72,12.72+D.slow));A.emr.setAttribute('y',f(-mh+10));A.emr.setAttribute('height',f(mh));
  var w0=ez.io3(P(t,13.3,13.72)),w1=ez.io3(P(t,13.38,13.8));A.e0r.setAttribute('width',f(2700*w0));A.e1r.setAttribute('width',f(3200*w1));
  var LT='translate(277.5 '+f(639.8+cy-410)+') scale(.27)';A.eX.setAttribute('transform',LT);A.eXi.setAttribute('transform',LT);
  var tp=ez.out3(P(t,13.8,13.8+D.slow));op(A.tagl,tp*(1-P(t,14.45,14.6)));A.tagl.setAttribute('transform','translate(0 '+f(14*(1-tp))+')');
  if(MM_URL)op(A.url,.6*P(t,14.0,14.0+D.med)*(1-P(t,14.45,14.6)));}
function cur2(t,A){
  var off=[1750,1100];function go(a,b,t0,t1){var p=ez.io3(P(t,t0,t1));return [lerp(a[0],b[0],p),lerp(a[1],b[1],p)-Math.sin(p*Math.PI)*40]}
  var k0=[SY.x0+4,SY.y+6];
  if(t<7.9)return off;if(t<8.2)return go(off,k0,7.9,8.2);
  if(t<8.95){var w=wghtAt(t);return [SY.x0+(SY.x1-SY.x0)*(w-100)/800+4,SY.y+6]}
  if(t<9.35)return go([SY.x1+4,SY.y+6],off,8.95,9.35);
  var T=[120+742*1.36,70+22*1.36];
  if(t<10.05)return off;if(t<10.3)return go(off,T,10.05,10.3);if(t<10.42)return T;if(t<10.75)return go(T,off,10.42,10.75);return off}
/* prima dell'inizio: si parte dal logo intero, che si smonta (parole che rientrano, la m che perde un piano), salta via e ricade */
function renderPre(A,p){var w=1-ez.io3(P(p,0,.36));A.t0r.setAttribute('width',f(2700*w));A.t1r.setAttribute('width',f(3200*w));op(A.car0,0);op(A.car1,0);
  var g=1-ez.io3(P(p,.26,.56)),dy=940*(1-g);A.ink.fr.setAttribute('transform','translate(0 '+f(dy)+')');
  /* anticipazione schiacciata, poi lancio: parte veloce e rallenta salendo, allungata nella direzione del moto */
  var k=ez.io3(P(p,.3,.62)),sq=Math.sin(Math.PI*P(p,.56,.7)),jp=P(p,.66,1),up=-770*(1-(1-jp)*(1-jp));
  var sx=1+.15*sq,sy=1-.22*sq;if(jp>0){sy=1+.22*(1-jp);sx=1-.1*(1-jp)}
  A.ink.x.setAttribute('transform','translate('+f(lerp(369.3,800,k))+' '+f(lerp(679.8,700,k)+up)+') scale('+f(lerp(.27,.36,k)*sx)+' '+f(lerp(.27,.36,k)*sy)+') translate(-340 0)')}
function render(A,t){
  var tr=cl(t/DUR0)*DUR0,pre=tr<PREr;t=pre?0:MAP(tr-PREr);
  var L=LX(t);
  var T='translate('+f(L.X)+' '+f(L.Y)+') skewX('+f(L.sk||0)+') scale('+f(L.s*L.sx)+' '+f(L.s*L.sy)+') translate('+f(-L.ax)+' '+f(-L.ay)+')';
  A.ink.x.setAttribute('transform',T);A.cart.x.setAttribute('transform',T);A.outl.setAttribute('transform',T);
  /* la m cresce di un piano */
  var grow=ez.back(P(t,.55,.95),1.6),dy=940*(1-grow);A.ink.fr.setAttribute('transform','translate(0 '+f(dy)+')');A.cart.fr.setAttribute('transform','translate(0 '+f(dy)+')');
  /* le parole si scrivono, guidate da un cursore pomodoro */
  var p0=ez.io3(P(t,.98,1.42)),p1=ez.io3(P(t,1.08,1.52));
  A.t0r.setAttribute('width',f(2700*p0));A.t1r.setAttribute('width',f(3200*p1));
  A.car0.setAttribute('x',f(740+2700*p0));op(A.car0,t>.98&&t<1.5?1:0);A.car0.setAttribute('width',f(64*(1-P(t,1.38,1.5))));
  A.car1.setAttribute('x',f(740+3080*p1));op(A.car1,t>1.08&&t<1.6?1:0);A.car1.setAttribute('width',f(64*(1-P(t,1.48,1.6))));
  /* selezione */
  var bA=mp(L,0,-1718),bB=mp(L,3871,10),pad=16,bx=bA[0]-pad,by=bA[1]-pad,bw=bB[0]-bA[0]+pad*2,bh=bB[1]-bA[1]+pad*2;
  var selOn=t>1.42&&t<3.9;op(A.sel,selOn?1-P(t,3.82,3.9):0);
  A.box.setAttribute('x',f(bx));A.box.setAttribute('y',f(by));A.box.setAttribute('width',f(bw));A.box.setAttribute('height',f(bh));
  A.box.setAttribute('stroke-dashoffset',f(1-ez.out3(P(t,1.42,1.72))));
  var hp=[[0,0],[.5,0],[1,0],[1,.5],[1,1],[.5,1],[0,1],[0,.5]];
  A.hd.forEach(function(h,i){var s=ez.back(P(t,1.52+i*.025,1.77+i*.025));var x=bx+bw*hp[i][0],y=by+bh*hp[i][1];
    var grab=(i===3&&t>2.05&&t<2.62)?1.35:1;h.setAttribute('transform','translate('+f(x)+' '+f(y)+') scale('+f(s*grab)+') translate(-6 -6)');h.setAttribute('fill',i===3&&t>2.05&&t<2.62?K.cobalt:'#fff')});
  var W=Math.round(bw-pad*2),H=Math.round(bh-pad*2);A.dimT.textContent=W+' × '+H;var dw=W>999?118:104;
  A.dimR.setAttribute('x',f(-dw/2));A.dimR.setAttribute('width',dw);A.dimR.setAttribute('fill',(t>2.1&&t<2.62)?K.tomato:K.cobalt);
  A.dim.setAttribute('transform','translate('+f(bx+bw/2)+' '+f(by+bh+12)+')');op(A.dim,P(t,1.64,1.78));
  A.nm.setAttribute('x',f(bx));A.nm.setAttribute('y',f(by-12));op(A.nm,P(t,1.62,1.76));
  /* cursore */
  var CM=camAt(t);op(A.cam,t>7.02?0:1);A.cam.setAttribute('transform','translate('+f(CM.sx)+' '+f(CM.sy)+') scale('+f(CM.s)+') translate('+f(-CM.px)+' '+f(-CM.py)+')');
  var c=curAt(t,A),cs=t<6.45?[CM.sx+(c[0]-CM.px)*CM.s,CM.sy+(c[1]-CM.py)*CM.s]:c;var t2c=t>RUN0?Math.max(RUN0,t-OFF):t;if(t>=6.45)cs=cur2(t2c,A);if(t>=STK0&&t<STK0+STKD+.1)cs=curStk(t-STK0,A);
  var vS=t-STK0,press=(t>2.03&&t<2.62)||(t>3.86&&t<3.98)||(t>5.8&&t<5.9)||(t>8.15&&t<8.95)||(t2c>10.3&&t2c<10.38)||stkPress(vS)?.86:1;A.cur.setAttribute('transform','translate('+f(cs[0])+' '+f(cs[1])+') scale('+press+')');
  /* "non si deforma" */
  var tg=ez.back(P(t,2.42,2.62)),tgo=P(t,3.0,3.12);op(A.tag,t>2.42?1-tgo:0);A.tag.setAttribute('transform','translate('+f(bx+bw/2-86)+' '+f(by+bh+66)+') scale('+f(tg)+')');
  /* contorni: ⌘Y */
  var om=t>3.24&&t<3.52;op(A.outl,om?1:0);op(A.ink.g,(om||t>4.3)?0:1);
  op(A.key,t>3.14&&t<3.7?1:0);A.key.setAttribute('transform','translate(56 '+f(826+30*(1-ez.out3(P(t,3.14,3.3))))+')');
  /* campioni */
  A.sw.forEach(function(g,i){var s=ez.back(P(t,3.42+i*.04,3.64+i*.04)),o=1-P(t,4.05,4.25);op(g,t>3.42?o:0);g.setAttribute('transform','translate('+f(672+i*64)+' 800) scale('+f(s)+')')});
  A.ring.setAttribute('cx',672);A.ring.setAttribute('cy',800);op(A.ring,t>3.9?1-P(t,4.05,4.25):0);
  /* click */
  var ck=P(t,3.9,4.25);A.clk.setAttribute('cx',672);A.clk.setAttribute('cy',800);A.clk.setAttribute('r',f(10+60*ez.out3(ck)));op(A.clk,ck>0&&ck<1?1-ck:0);
  /* allagamento: cerchio dal click, poi diventa la cella */
  var fr=ez.in3(P(t,3.92,4.34))*1;A.flC.setAttribute('cx',672);A.flC.setAttribute('cy',800);A.flC.setAttribute('r',f(t<4.36?1900*Math.sqrt(fr):0));
  var g2=ez.io3(P(t,4.4,4.92)),cx=cellXY(MAIN);
  if(t>=4.36){A.flR.setAttribute('x',f(lerp(0,cx[0],g2)));A.flR.setAttribute('y',f(lerp(0,cx[1],g2)));A.flR.setAttribute('width',f(lerp(1600,CW,g2)));A.flR.setAttribute('height',f(lerp(900,CH,g2)));A.flR.setAttribute('rx',f(18*g2))}
  else A.flR.setAttribute('width',0);
  /* griglia di varianti */
  A.cells.forEach(function(cc,i){if(!cc)return;var dx=(i%4)-(MAIN%4),dyy=Math.floor(i/4)-Math.floor(MAIN/4),d=Math.hypot(dx,dyy);
    var a=4.62+d*.075+(i%3)*.02,p=P(t,a,a+.5),s=.9+.1*ez.back(p,1.4),r=(1-ez.out3(p))*((i%2)?-3:3);
    var d6=Math.hypot((i%4)-2,Math.floor(i/4)-1),fa=5.92+d6*.06,q=P(t,fa,fa+.2),fy=Math.abs(Math.cos(Math.PI*q));
    if(cc.b){op(cc.a,q>.5?0:1);op(cc.b,q>.5?1:0)}
    cc.g.setAttribute('transform','translate('+f(cc.x+CW/2)+' '+f(cc.y+CH/2+36*(1-ez.out3(p)))+') rotate('+f(r)+') scale('+f(s)+' '+f(s*Math.max(fy,.02))+') translate('+(-CW/2)+' '+(-CH/2)+')');op(cc.g,ez.out3(P(t,a,a+D.fast)))});
  A.floodR.setAttribute('fill',t>5.92+.06+.1?K.cobalt:K.tomato);
  /* sbuffo di puntini quando la m tocca terra */
  /* righe guida: quando la m tocca terra si tracciano linea di base e altezza della x; quando cresce, l'ascendente */
  /* le righe seguono il logo: stessa trasformazione, quindi restano esatte anche quando la camera si muove */
  var go=1-P(t,1.3,1.3+D.med),LG0=LX(Math.min(t,1.6)),cxm=mp(LG0,340,0)[0];
  A.gd.forEach(function(q,i){var a=[.36,.44,.72][i],p=ez.io3(P(t,a,a+D.slow)),hw=680*p,y=mp(LG0,0,[0,-528,-1468][i])[1];
    op(q.g,t>a?go:0);q.l.setAttribute('x1',f(cxm-hw));q.l.setAttribute('x2',f(cxm+hw));q.l.setAttribute('y1',f(y));q.l.setAttribute('y2',f(y));
    q.lb.setAttribute('x',f(cxm-680));q.lb.setAttribute('y',f(y-9));q.vl.setAttribute('x',f(cxm+680));q.vl.setAttribute('y',f(y-9));var lo=P(t,a+.22,a+.22+D.fast);op(q.lb,lo);op(q.vl,lo)});
  A.gv.forEach(function(l,i){var a=.48+i*.05,p=ez.io3(P(t,a,a+D.slow)),b=mp(LG0,i?696:-16,40),tp=mp(LG0,0,-528-940*ez.back(P(t,.55,.95),1.6)-40);
    l.setAttribute('x1',f(b[0]));l.setAttribute('x2',f(b[0]));l.setAttribute('y1',f(b[1]));l.setAttribute('y2',f(lerp(b[1],tp[1],p)));op(l,t>a?.9*go:0)});
  /* retino sul bordo dell'allagamento: puntini che crescono fino a diventare colore pieno */
  var R0=t<4.36?1900*Math.sqrt(fr):0,BND=230;
  if(t>3.9&&t<4.4){A.flC.setAttribute('r',f(Math.max(0,R0-BND*.82)));A.fd.forEach(function(d){var dd=Math.hypot(d.x-672,d.y-800),u=(R0-dd)/BND,r=u<=0||u>=.9?0:12.2*Math.pow(u/.9,.75);if(Math.abs(r-d.r)>.05){d.r=r;d.e.setAttribute('r',f(r))}});A.fdOn=1}
  else if(A.fdOn){A.fd.forEach(function(d){d.r=0;d.e.setAttribute('r',0)});A.fdOn=0}
  /* micro-loop nelle schede */
  if(CELL.aa&&t<6.975)CELL.aa.style.fontWeight=Math.round(t>4.9?520+360*Math.sin(tr*2.6):700);
  A.htBc.setAttribute('r',f(24+9*Math.sin(tr*3.2)));
  if(CELL.ol)CELL.ol.setAttribute('stroke-dashoffset',f(-tr*520));
  if(CELL.nt){var nn=ez.back(P(t,5.3,5.3+D.med));op(CELL.nt,nn>0?1:0);CELL.nt.setAttribute('transform','translate(0 '+f(-30*(1-nn))+')')}
  if(CELL.pal)CELL.pal.forEach(function(r,i){var w=Math.max(0,Math.sin(tr*3.6-i*.8));r.setAttribute('y',f(50-16*w*w*(t>4.95?1:0)))});
  if(CELL.blk){var bk=tr*1.4,st=Math.floor(bk),fx=ez.io3(cl((bk-st)*2.2)),pos=[0,4,6,2],a0=pos[((st%4)+4)%4],a1=pos[((st+1)%4+4)%4];CELL.blk.setAttribute('x',f(20+27.5*(t>4.9?lerp(a0,a1,fx):0)))}
  if(CELL2.line)CELL2.line.setAttribute('stroke-dashoffset',f(1-ez.io3(P(t,6.08,6.08+D.slow))));
  op(A.flood,t>3.9?1:0);op(A.cart.g,t>3.9?1:0);op(A.fdg,t>3.9&&t<4.4?1:0);op(A.cg,t>4.55&&t<7.05?1:0);
  var t2=t>RUN0?Math.max(RUN0,t-OFF):t;
  renderType(A,t,tr);renderRun(A,t,tr);renderStack(A,t);if(pre)renderPre(A,tr/PREr);renderDash(A,t2);renderEnd(A,t2);
  /* piccoli segni di vita nelle celle */
  if(CELL.caret)op(CELL.caret,Math.floor(tr*2.4)%2?1:0);
  if(CELL.tgK){var on=P(t,5.85,6.02);CELL.tgK.setAttribute('cx',f(21+42*ez.back(on)*(on>0?1:0)));CELL.tgB.setAttribute('fill',on>.5?K.tomato:K.ink)}
  if(CELL.bars)CELL.bars.forEach(function(b,i){var hgt=[60,96,74,130,112,160,142][i]*ez.back(P(t,4.9+i*.04,5.25+i*.04));b.setAttribute('y',f(200-hgt));b.setAttribute('height',f(Math.max(0,hgt)))});
}
/* da tempo dell'animazione a secondi reali: serve al suono per cadere sul fotogramma giusto */
function REAL0(a){var ta=TB.ta,lo=0,hi=ta.length-1;if(a<=0)return PREr;if(a>=ta[hi])return PREr+hi*TB.dt;while(hi-lo>1){var m=(lo+hi)>>1;if(ta[m]<a)lo=m;else hi=m}var fr=(a-ta[lo])/Math.max(1e-9,ta[hi]-ta[lo]);return PREr+(lo+fr)*TB.dt}
/* montaggio sulla musica: il film si allunga o si accorcia di pochissimo perché ogni taglio grande cada sull'inizio di una battuta.
   La musica va dritta a 131 BPM, senza mai ripartire. [tempo dell'animazione, battito] */
var BPM=131,BT=60/BPM,WAN=[3.92,6.98,RUN0+.14,STK0,10.36+OFF,11.66+OFF,12.42+OFF,15.02+OFF],WAB=[11,20,28,40,64,68,72,82];
var WO,WM,DUR,API;
function pw(x,X,Y){if(x<=X[0])return Y[0];for(var i=1;i<X.length;i++)if(x<=X[i])return Y[i-1]+(Y[i]-Y[i-1])*(x-X[i-1])/(X[i]-X[i-1]);return Y[Y.length-1]+(x-X[X.length-1])}
/* ms: dove cade ogni taglio nella musica, in secondi. Di base i battiti a 131 BPM; con una traccia vera arrivano dall'analisi dei suoi battiti */
function setWarp(ms,bpm){WO=[0];WM=[0];WAN.forEach(function(a,i){WO.push(REAL0(a));WM.push(ms[i])});WO.push(DUR0);WM.push(WM[WM.length-1]+DUR0-WO[WO.length-2]);DUR=WM[WM.length-1];if(API){API.DUR=DUR;if(bpm)API.BPM=bpm}}
setWarp(WAB.map(function(b){return b*BT}));
function REAL(a){return pw(REAL0(a),WO,WM)}
function renderW(A,t){render(A,pw(Math.min(t,DUR),WM,WO))}
API={build:build,render:renderW,DUR:DUR,BPM:BPM,warp:setWarp,anchors:function(){return WAN.map(REAL0)},MAP:MAP,REAL:REAL,K:K,PREr:PREr,OFF:OFF,RUN0:RUN0,STK0:STK0,TB18:TB18,cellXY:cellXY,MAIN:MAIN};return API})();
</script>
<script>/* ===== Mother Machine · suono e musica =====
   Nessun file audio. Effetti e musica sono sintetizzati nel browser e agganciati all'orologio dell'animazione.
   La musica è composta qui (originale, nessun diritto da pagare): stesso tempo per tutto il film, ma ogni sezione
   riparte esattamente sul taglio del film. Gli effetti sono pochi e asciutti: la musica porta l'emozione. */
var MMS=(function(){
var AC=null,master=null,bus=null,NB=null,REV=null,DLY=null,on=false,vol=.7,idx=0,LOOK=.26,cues=[],MK=1.45,TRK=null,TBUF=null,TOFF=0,TGAIN=1;
var BPM=131,BT=60/BPM;
function h(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
var TR=0;/* trasposizione della musica, solo mentre suona una nota della canzone */
function nt(n){return 261.63*Math.pow(2,(n+TR)/12)}
function cl(x){return x<0?0:x>1?1:x}function P(t,a,b){return cl((t-a)/(b-a))}
function io3(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function pan(x){return Math.max(-.7,Math.min(.7,(x-800)/800*.6))}

/* ---------- motore ---------- */
function ir(ctx,sec){var n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(2,n,ctx.sampleRate);
  for(var c=0;c<2;c++){var d=b.getChannelData(c);for(var i=0;i<n;i++){var k=i/n;d[i]=(h(i*.37+c*91)*2-1)*Math.pow(1-k,3.4)*(k<.01?k/.01:1)}}return b}
function setup(ctx,dest){AC=ctx;bus=null;
  var sh=AC.createBiquadFilter();sh.type='highshelf';sh.frequency.value=9000;sh.gain.value=-4;
  var comp=AC.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=10;comp.ratio.value=3;comp.attack.value=.006;comp.release.value=.2;
  var lim=AC.createDynamicsCompressor();lim.threshold.value=-2;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.08;
  master=AC.createGain();master.gain.value=vol*MK;var hp0=AC.createBiquadFilter();hp0.type='highpass';hp0.frequency.value=32;master.connect(hp0);hp0.connect(sh);sh.connect(comp);comp.connect(lim);lim.connect(dest||AC.destination);
  /* riverbero corto e scuro */
  var rv=AC.createConvolver();rv.buffer=ir(AC,2.2);var rhp=AC.createBiquadFilter();rhp.type='highpass';rhp.frequency.value=300;var rlp=AC.createBiquadFilter();rlp.type='lowpass';rlp.frequency.value=6000;
  REV=AC.createGain();REV.connect(rhp);rhp.connect(rv);rv.connect(rlp);var rg=AC.createGain();rg.gain.value=.32;rlp.connect(rg);rg.connect(master);
  /* eco a tempo (croma puntata) per i pluck */
  var dl=AC.createDelay(2);dl.delayTime.value=BT*.75;var fb=AC.createGain();fb.gain.value=.34;var dlp=AC.createBiquadFilter();dlp.type='lowpass';dlp.frequency.value=2600;
  DLY=AC.createGain();DLY.connect(dl);dl.connect(dlp);dlp.connect(fb);fb.connect(dl);var dg=AC.createGain();dg.gain.value=.5;dlp.connect(dg);dg.connect(master);
  NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);var d=NB.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=h(i*.731+.5)*2-1;
  newBus()}
/* una sessione di ascolto: si taglia di netto quando metti pausa o salti */
function newBus(){if(bus){var o=bus,n=AC.currentTime;o.g.gain.setTargetAtTime(0,n,.012);if(o.src){try{o.src.stop(n+.08)}catch(e){}}setTimeout(function(){try{o.g.disconnect();o.w.disconnect();o.e.disconnect()}catch(e){}},250)}
  var g=AC.createGain(),w=AC.createGain(),e=AC.createGain();g.connect(master);w.connect(REV);e.connect(DLY);
  var dr=AC.createWaveShaper();dr.curve=CURVE();dr.oversample='2x';var drg=AC.createGain();drg.gain.value=.55;dr.connect(drg);
  var sfx=AC.createGain();sfx.gain.value=1.35;sfx.connect(g);var mus=AC.createGain();mus.gain.value=.27*(SG[STYLE]||1);/* mix della musica: meno fango sui medio bassi, più presenza e un filo d'aria */var q1=AC.createBiquadFilter();q1.type='peaking';q1.frequency.value=240;q1.Q.value=.9;q1.gain.value=-2.5;var q2=AC.createBiquadFilter();q2.type='peaking';q2.frequency.value=2700;q2.Q.value=.8;q2.gain.value=3;var q3=AC.createBiquadFilter();q3.type='highshelf';q3.frequency.value=7500;q3.gain.value=3.5;mus.connect(q1);q1.connect(q2);q2.connect(q3);q3.connect(g);var duck=AC.createGain();var mf=AC.createBiquadFilter();mf.type='lowpass';mf.frequency.value=20000;mf.Q.value=.7;duck.connect(mf);mf.connect(mus);drg.connect(duck);
  bus={g:g,w:w,e:e,sfx:sfx,mus:mus,duck:duck,drive:dr,mf:mf}}
function CURVE(){if(CURVE.c)return CURVE.c;var n=2048,c=new Float32Array(n);for(var i=0;i<n;i++){var x=i/(n-1)*2-1;c[i]=Math.tanh(2.6*x)/Math.tanh(2.6)}return CURVE.c=c}
function out(o){var g=AC.createGain(),last=g,p=null;if(AC.createStereoPanner){p=AC.createStereoPanner();p.pan.value=o.pan||0;g.connect(p);last=p}
  last.connect(o.to==='m'?bus.mus:o.to==='d'?bus.duck:o.to==='x'?bus.drive:bus.sfx);
  if(o.rev){var s=AC.createGain();s.gain.value=o.rev;last.connect(s);s.connect(bus.w)}
  if(o.echo){var s2=AC.createGain();s2.gain.value=o.echo;last.connect(s2);s2.connect(bus.e)}return {g:g,p:p}}
function env(g,w,o){var a=o.a||.003,d=o.d||.2,v=o.v;g.setValueAtTime(0,w);
  if(o.peak){g.linearRampToValueAtTime(v,w+d*o.peak);g.linearRampToValueAtTime(0,w+d)}
  else if(o.sus){g.linearRampToValueAtTime(v,w+a);g.setValueAtTime(v,w+d-o.rel);g.linearRampToValueAtTime(0,w+d)}
  else{g.linearRampToValueAtTime(v,w+a);g.exponentialRampToValueAtTime(.0001,w+a+d)}return o.peak||o.sus?d:a+d}
function tone(w,o){var os=AC.createOscillator();os.type=o.type||'sine';os.frequency.setValueAtTime(o.f,w);if(o.f1)os.frequency.exponentialRampToValueAtTime(o.f1,w+(o.gl||o.d||.2));if(o.det)os.detune.value=o.det;
  var q=out(o),len=env(q.g.gain,w,o),src=os;
  if(o.lp){var f=AC.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(o.lp,w);if(o.lp1)f.frequency.exponentialRampToValueAtTime(o.lp1,w+(o.lpt||len));f.Q.value=o.lq||.7;src.connect(f);src=f}
  if(o.hp){var hf=AC.createBiquadFilter();hf.type='highpass';hf.frequency.value=o.hp;src.connect(hf);src=hf}
  src.connect(q.g);
  if(o.pan1!==undefined&&q.p)q.p.pan.linearRampToValueAtTime(o.pan1,w+len);
  os.start(w);os.stop(w+len+.05)}
function noise(w,o){var s=AC.createBufferSource();s.buffer=NB;s.loop=true;
  var f=AC.createBiquadFilter();f.type=o.type||'bandpass';f.Q.value=o.q||1;f.frequency.setValueAtTime(o.f,w);
  var q=out(o),len=env(q.g.gain,w,o);if(o.f1)f.frequency.exponentialRampToValueAtTime(o.f1,w+len);
  var src=f;if(o.lp){var l2=AC.createBiquadFilter();l2.type='lowpass';l2.frequency.value=o.lp;f.connect(l2);src=l2}
  if(o.pan1!==undefined&&q.p)q.p.pan.linearRampToValueAtTime(o.pan1,w+len);
  s.connect(f);src.connect(q.g);s.start(w,h(w*13.1)*1.5);s.stop(w+len+.05)}

/* ---------- effetti: asciutti, corti, senza melodie ---------- */
var S={
 tap:function(w,v,p){noise(w,{f:2300,q:1.1,d:.012,v:v*.7,pan:p});tone(w,{f:170,f1:110,gl:.04,d:.05,v:v,pan:p})},
 tick:function(w,v,p){noise(w,{type:'highpass',f:5200,d:.006,v:v,pan:p})},
 click:function(w,v,p){noise(w,{f:3000,q:.9,d:.012,v:v,pan:p});tone(w,{f:1200,f1:800,gl:.015,d:.018,v:v*.25,pan:p});noise(w+.075,{f:3800,q:.9,d:.008,v:v*.3,pan:p})},
 key:function(w,v,s,p){noise(w,{f:1700+h(s)*1400,q:1.2,d:.022,v:v,pan:p});tone(w,{f:150+h(s+1)*50,f1:90,gl:.025,d:.04,v:v*.5,pan:p})},
 air:function(w,d,f0,f1,v,p0,p1,pk){noise(w,{f:f0,f1:f1,q:.8,d:d,v:v,peak:pk||.6,pan:p0||0,pan1:p1,lp:2200,rev:.1})},
 thud:function(w,v,p){tone(w,{f:95,f1:42,gl:.12,d:.32,v:v,pan:p});noise(w,{type:'lowpass',f:500,d:.05,v:v*.35,pan:p})},
 flick:function(w,v,p){noise(w,{f:1800,f1:700,q:1.4,d:.04,v:v,pan:p,lp:3000})},
 swell:function(w,d,v){noise(w,{type:'lowpass',f:200,f1:2200,d:d,v:v,peak:.8,rev:.2});tone(w,{f:45,f1:70,gl:d,d:d,v:v*.8,peak:.8})},
 glitch:function(w,d,v,s){var n=Math.floor(d/.026);for(var k=0;k<n;k++){var r=h(s+k*1.7),tw=w+k*.026;if(r<.5)tone(tw,{type:'square',f:60+h(s+k*3.1)*900,d:.014+h(k+s)*.016,v:v*(.3+r),lp:2400,pan:(h(k*5.3+s)-.5)});
   else if(r<.8)noise(tw,{f:600+h(k*2.2)*3000,q:2.5,d:.016,v:v*.6,pan:(h(k*1.9)-.5)*.8})}},
 rain:function(w,d,v,s,dens){var n=Math.floor(d*dens);for(var k=0;k<n;k++){var u=h(s+k*.91),tw=w+u*d,e=Math.sin(Math.PI*u);noise(tw,{type:'highpass',f:4000+h(s+k*2.3)*3000,d:.006,v:v*(.25+.75*e)*(.4+h(k*7.7)*.6),pan:(h(s+k*4.1)-.5)*1.4})}},
 riser:function(w,d,v){noise(w,{f:300,f1:5000,q:.8,d:d,v:v,peak:.96,rev:.2,lp:7000})},
 hit:function(w,v){tone(w,{f:70,f1:38,gl:.25,d:.6,v:v});noise(w,{type:'lowpass',f:1600,d:.18,v:v*.35,rev:.4})},
 ripple:function(w,d,v,f0,s){/* un'onda che gira le tessere: tanti scatti piccoli che si allargano e si spengono */
   var n=30;for(var k=0;k<n;k++){var u=Math.pow(k/n,.85),tw=w+u*d,e=Math.sin(Math.PI*Math.min(1,k/n*1.15)),p=(h(s+k*3.3)-.5)*1.4;
     noise(tw,{f:f0*(1+.35*h(s+k)),q:3,d:.012,v:v*e*(.5+.5*h(k*7.1+s)),pan:p});if(k%3===0)tone(tw,{type:'triangle',f:f0*.5*(1+.2*h(k+s)),d:.02,v:v*.35*e,pan:p})}
   noise(w,{f:350,f1:900,q:1.2,d:d,v:v*.5,peak:.4,lp:1500})},
 motor:function(w,d,v,p0,p1){/* il furgone elettrico: un ronzio morbido che sale un filo, e il rotolare delle gomme */
   tone(w,{type:'triangle',f:95,f1:150,gl:d,d:d,v:v,peak:.5,lp:420,pan:p0,pan1:p1});tone(w,{type:'triangle',f:190,f1:300,gl:d,d:d,v:v*.25,peak:.5,lp:700,pan:p0,pan1:p1});
   noise(w,{f:380,f1:620,q:1.6,d:d,v:v*.6,peak:.45,lp:1000,pan:p0,pan1:p1})},
 blip:function(w,f,v,p){tone(w,{f:f,d:.05,v:v,pan:p,rev:.12});noise(w,{type:'highpass',f:6000,d:.004,v:v*.5,pan:p})},
 print:function(w,v,p){for(var i=0;i<4;i++)noise(w+i*.016,{f:1400+i*120,q:2.5,d:.01,v:v*(1-i*.18),pan:p})},
 stretch:function(w,d,v){/* gomma che si tende: un cigolio filtrato che sale e un tono basso che tira */
   noise(w,{f:260,f1:1300,q:4,d:d,v:v,peak:.92,lp:2400,pan:.2,pan1:.45});tone(w,{type:'triangle',f:70,f1:150,gl:d,d:d,v:v*.8,peak:.92,lp:500,pan:.3})},
 wobble:function(w,v){/* il rilascio: uno schiocco morbido e poi l'elastico che oscilla e si calma */
   noise(w,{f:2800,f1:500,q:1.2,d:.07,v:v*.7,pan:.3});
   for(var k=0;k<6;k++){var a=Math.exp(-4.2*k*.209),tw=w+k*.205;tone(tw,{f:k%2?118:96,f1:k%2?104:88,gl:.12,d:.16,v:v*a,lp:420,pan:(k%2?.4:.1)})}},
 whomp:function(w,v){tone(w,{f:60,f1:32,gl:.6,d:1.2,v:v});noise(w,{type:'lowpass',f:180,f1:900,d:.7,v:v*.4,peak:.45,rev:.4})}
};

/* ---------- strumenti della musica ---------- */
function duck(w,depth){var g=bus.duck.gain;g.cancelScheduledValues(w);g.setValueAtTime(1,w);g.linearRampToValueAtTime(depth||.45,w+.01);g.linearRampToValueAtTime(1,w+BT*.8)}
var I={
 kick:function(w,v){tone(w,{f:170,f1:50,gl:.06,d:.36,v:v,to:'m'});tone(w,{f:52,d:.22,v:v*.5,a:.01,to:'m'});noise(w,{type:'highpass',f:2500,d:.005,v:v*.22,to:'m'});duck(w)},
 soft:function(w,v){tone(w,{f:120,f1:48,gl:.07,d:.3,v:v,lp:300,to:'m'})},
 snare:function(w,v){noise(w,{f:1900,q:.7,d:.17,v:v,to:'m',rev:.2});noise(w,{type:'highpass',f:6000,d:.07,v:v*.35,to:'m'});tone(w,{f:200,f1:150,gl:.05,d:.09,v:v*.5,to:'m'})},
 clap:function(w,v){for(var i=0;i<3;i++)noise(w+i*.01,{f:1250,q:1.3,d:i<2?.01:.14,v:v*(i<2?.7:1),to:'m',rev:.24})},
 hat:function(w,v,p,open){noise(w,{type:'highpass',f:7800,d:open?.16:.028,v:v,pan:p||0,to:'m'})},
 shk:function(w,v,p){noise(w,{f:9500,q:2,d:.035,v:v,pan:p||0,to:'m'})},
 crash:function(w,v){noise(w,{type:'highpass',f:4500,d:1.8,v:v,to:'m',rev:.35})},
 sub:function(w,v){tone(w,{f:62,f1:34,gl:.7,d:.9,v:v,to:'m'})},
 riser:function(w,d,v){noise(w,{f:400,f1:7000,q:.9,d:d,v:v,peak:.98,to:'m',rev:.3,lp:8000})},
 bass:function(w,n,d,v){tone(w,{f:nt(n),d:d,v:v*.8,sus:1,a:.005,rel:.03,to:'d'});[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.22,sus:1,a:.005,rel:.03,lp:420,lp1:260,lpt:d,lq:1.2,to:'d'})})},
 stab:function(w,ch,v,d,lp){ch.forEach(function(n,i){[-6,6].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d||.22,v:v*.09,lp:lp||2200,lp1:500,lpt:.2,pan:j?.3:-.3,to:'d',rev:.25,echo:.18})})})},
 ep:function(w,ch,v,d){ch.forEach(function(n,i){var tw=w+i*.012,f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:(i%2?.18:-.18),to:'m',rev:.35});
   c.frequency.value=f;m.frequency.value=f;mg.gain.setValueAtTime(f*1.6,tw);mg.gain.exponentialRampToValueAtTime(f*.08,tw+.6);m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
   var len=env(q.g.gain,tw,{v:v,a:.004,d:d||2.6});m.start(tw);c.start(tw);m.stop(tw+len+.05);c.stop(tw+len+.05)})},
 pad:function(w,d,ch,v,lp,lp1){ch.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),det:(i%2?4:-4),d:d,v:v*.12,sus:1,a:Math.min(.8,d*.3),rel:Math.min(.9,d*.35),lp:lp||900,lp1:lp1,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.35});tone(w,{f:nt(n+12),d:d,v:v*.03,sus:1,a:Math.min(.8,d*.3),rel:Math.min(.9,d*.35),to:'d',rev:.4})})},
 pluck:function(w,n,v,p,lp){tone(w,{type:'square',f:nt(n),d:.18,v:v*.3,lp:lp||1600,lp1:280,lpt:.15,pan:p,to:'d',echo:.45,rev:.15});tone(w,{type:'triangle',f:nt(n),d:.24,v:v*.5,pan:p,to:'d',echo:.35})}
};
/* accordi in Fa maggiore */
var CH={F9:[-7,-3,0,4,7],AM7:[-3,0,4,7],DM9:[-10,-7,-3,0,4],BB7:[-2,2,5,9],CE:[-8,-5,0,4],DM:[-10,-7,-3,2],C:[-5,0,4,7],F:[-7,-3,0,5]};
var ROOT={F9:-19,AM7:-15,DM9:-22,BB7:-14,CE:-20,DM:-22,C:-12,F:-19};
var ARP=[0,2,1,3,2,4,3,1];

/* ---------- la musica: un solo tempo, 131 BPM, dall'inizio alla fine. Il film è montato sui battiti, mai il contrario ---------- */
function music(M,C0){var B=60/M.BPM;function C(b,f){C0(b*B,f)}
  function bar(b0,b1,fn){for(var b=b0;b<b1;b+=4)fn(b)}
  function beats(b0,b1,fn){for(var b=b0;b<b1;b++)fn(b)}
  var SW=B*.035;/* un filo di swing sui sedicesimi in levare */
  function hats(b0,b1,v,open){beats(b0,b1,function(b){[0,.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.hat(w+(i%2?SW:0),v*[.45,.3,1,.35][i],(i-1.5)*.15,open&&i===2&&b%2===1)})})})}
  function groove(b0,b1,o){o=o||{};beats(b0,b1,function(b){C(b,function(w){I.kick(w,o.k||.6)});if(o.clap!==false&&(b%2===1))C(b,function(w){I.clap(w,o.c||.2)})});hats(b0,b1,o.h||.08,o.open)}
  function bassline(b0,ch,pat,v){pat.forEach(function(s){C(b0+s[0],function(w){I.bass(w,ROOT[ch]+(s[2]||0),s[1]*B*.9,v)})})}
  var BL=[[0,.75],[.75,.25,12],[1.5,.5],[2,.75],[2.75,.25,12],[3.5,.5,7]];
  var BL16=[];for(var i=0;i<16;i++)BL16.push([i*.25,.2,(i%4===2?12:0)]);
  function stabs(b0,ch,v,lp){[.5,1.75,2.5,3.5].forEach(function(s){C(b0+s,function(w){I.stab(w,CH[ch],v,.2,lp)})})}
  function arp(b0,b1,ch,v,lp){for(var e=0;b0+e*.5<b1;e++)(function(e){var n=CH[ch][ARP[e%8]%CH[ch].length]+12;C(b0+e*.5,function(w){I.pluck(w,n,v*(e%2?.7:1),(e%2?.3:-.3),lp)})})(e)}
  /* 1 · apertura (battute 1-5): piano elettrico, arpeggio che si apre, un battito che sale */
  C(0,function(w){I.ep(w,CH.F9,.045,4.2)});C(8,function(w){I.ep(w,CH.DM9,.045,4.2)});C(16,function(w){I.ep(w,CH.BB7,.045,2.4)});
  C(0,function(w){I.pad(w,16*B,CH.F9.concat([12]),.4,500,1100)});C(16,function(w){I.pad(w,4*B,CH.BB7,.45,900,2400)});
  arp(4,8,'F9',.16,900);arp(8,16,'DM9',.2,1200);arp(16,19.5,'BB7',.24,1700);
  beats(12,19,function(b){C(b,function(w){I.soft(w,.18+(b-12)*.03)})});
  beats(16,19,function(b){C(b+.5,function(w){I.hat(w,.05)})});
  C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code (battute 6-7) */
  C(20,function(w){I.crash(w,.1);I.sub(w,.4)});
  groove(20,28,{});bassline(20,'F9',BL,.42);bassline(24,'AM7',BL,.42);stabs(20,'F9',.5);stabs(24,'AM7',.5);
  C(20,function(w){I.pad(w,8*B,CH.F9,.3,1200)});
  /* 3 · Runtime (battute 8-10): più scuro, basso a sedicesimi, niente stab */
  groove(29,38,{c:.12,h:.06});
  bassline(28,'DM',BL16,.32);bassline(32,'BB7',BL16,.32);bassline(36,'C',BL16.slice(0,8),.32);
  C(28,function(w){I.pad(w,4*B,CH.DM,.45,600,900)});C(32,function(w){I.pad(w,4*B,CH.BB7,.45,800,1400)});C(36,function(w){I.pad(w,4*B,CH.C,.45,1000,3000)});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.05+r*.02)})})(r);
  C(36,function(w){I.riser(w,4*B,.06)});
  /* 4 · le app (battute 11-16): luminoso, pieno */
  C(40,function(w){I.crash(w,.12);I.sub(w,.4)});
  var AP=['F9','CE','DM9','BB7','F9','CE'];
  groove(40,61,{open:true});
  AP.forEach(function(ch,i){var b=40+i*4;if(b>=60){bassline(b,ch,BL.slice(0,3),.42);stabs(b,ch,.45);return}bassline(b,ch,BL,.42);stabs(b,ch,.5);if(i>=2)arp(b,b+4,ch,.12,1500)});
  /* la pizzeria si apre: la batteria si toglie, resta l'attesa */
  C(61.5,function(w){I.pad(w,2.5*B,CH.C,.5,900,2600)});arp(61.5,64,'C',.18,1800);C(62,function(w){I.riser(w,2*B,.06)});
  /* 5 · Start service (battuta 17) e Service complete (battuta 18) */
  C(64,function(w){I.crash(w,.1);I.sub(w,.35)});
  groove(64,68,{h:.09});bassline(64,'BB7',BL,.44);stabs(64,'BB7',.5);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.14);I.sub(w,.45);I.stab(w,CH.F9,.9,.5,3000)});
  groove(68,72,{h:.09,open:true});bassline(68,'F9',BL,.44);stabs(68,'F9',.5);C(68,function(w){I.pad(w,4*B,CH.F9,.35,1500)});
  /* 6 · finale: niente batteria. Piano elettrico e pad, la frase, il logo */
  C(72,function(w){I.ep(w,CH.DM9,.05,3.6);I.pad(w,4*B,CH.DM9,.4,700);I.bass(w,-22,3*B,.2)});
  /* la frase: l'accordo resta e scende piano fino al silenzio, il filtro si chiude. Nessun suono nuovo sul logo finale */
  C(76,function(w){I.ep(w,CH.BB7.concat([12]),.045,6);var d=12*B;CH.BB7.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),det:(i%2?4:-4),d:d,v:.045,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-14),d:d*.8,v:.12,peak:.1,to:'d'})})}

/* ---------- altre musiche nel codice: stessa struttura e stessi tempi della A, armonia, melodia e suoni diversi ---------- */
var J={
 bleep:function(w,n,v,p,d){tone(w,{type:'square',f:nt(n)*1.012,f1:nt(n),gl:.015,d:d||.09,v:v*.35,lp:2600,lp1:900,lpt:d||.09,pan:p,to:'d',echo:.25,rev:.1})},
 rim:function(w,v,p){noise(w,{f:1750,q:3,d:.02,v:v,pan:p||0,to:'m'});tone(w,{f:820,d:.018,v:v*.4,pan:p||0,to:'m'})},
 snap:function(w,v,p){noise(w,{f:2600,q:1.3,d:.035,v:v,pan:p||0,to:'m',rev:.28})},
 sbass:function(w,n,v,d){tone(w,{type:'sawtooth',f:nt(n),d:d||.16,v:v*.4,lp:1100,lp1:180,lpt:d||.16,lq:2,to:'d'});tone(w,{f:nt(n),d:(d||.16)+.04,v:v*.75,to:'d'})},
 acid:function(w,n,v,cut,d){tone(w,{type:'sawtooth',f:nt(n),d:d||.13,v:v,lp:cut,lp1:cut*.35,lpt:d||.13,lq:9,to:'d',echo:.2})},
 bell:function(w,n,v,p){tone(w,{f:nt(n),d:.9,v:v,pan:p,to:'d',rev:.35,echo:.2});tone(w,{f:nt(n)*3.01,d:.18,v:v*.2,pan:p,to:'d'})},
 clav:function(w,ch,v,p){ch.forEach(function(n){tone(w,{type:'square',f:nt(n),d:.075,v:v*.12,lp:2400,lp1:1100,lpt:.07,hp:500,pan:p,to:'d'})})},
 brass:function(w,ch,v,d){ch.forEach(function(n,i){[-8,8].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d||.3,v:v*.07,a:.02,lp:900,lp1:2600,lpt:.08,pan:(i%2?.3:-.3),to:'d',rev:.25})})})},
 blip:function(w,n,v,p){tone(w,{f:nt(n),d:.03,v:v,pan:p,to:'d'})}
};
function H(M,C0){var B=60/M.BPM;return {B:B,C:function(b,f){C0(b*B,f)},beats:function(b0,b1,fn){for(var b=b0;b<b1;b++)fn(b)}}}

/* B · meccanica e giocosa, Do maggiore. Bleep piccoli, basso staccato che salta, drum machine con rim e schiocchi, mai cassa in quattro */
function musicB(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={C:[0,4,7,11],EM:[4,7,11,14],F:[5,9,12,16],G:[7,11,14,16],AM:[-3,0,4,7],G7:[7,11,14,17]},RT={C:-24,EM:-20,F:-19,G:-17,AM:-15,G7:-17};
  function hook(b,ch,v,lp){var c=CH[ch];[[0,c[0]+12],[.75,c[1]+12],[1.5,c[2]+12],[2,c[1]+12],[2.75,c[3]+12],[3.5,c[2]+12]].forEach(function(x){C(b+x[0],function(w){J.bleep(w,x[1],v,(x[0]%1?.25:-.25))})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.5)});if(k===2)C(b+.5,function(w){I.kick(w,(o.k||.5)*.6)});
    if(k===1||k===3){C(b,function(w){J.rim(w,.1,-.2);J.snap(w,.09,.25)})}C(b+.5,function(w){I.hat(w,.05,.2)});if(o.sh)[.25,.75].forEach(function(s){C(b+s,function(w){I.shk(w,.03,-.3)})})})}
  function bass(b,ch,v){[[0,0],[.5,12],[1.5,0],[2,12],[2.75,0],[3.5,7]].forEach(function(x){C(b+x[0],function(w){J.sbass(w,RT[ch]+x[1],v)})})}
  /* apertura: un orologio che ticchetta e il motivo filtrato che si apre */
  beats(0,19,function(b){C(b,function(w){J.rim(w,b%4?.03:.05,.4)})});
  C(0,function(w){I.pad(w,8*B,CH.C,.3,600,1200)});C(8,function(w){I.pad(w,8*B,CH.AM,.3,700,1500)});
  [4,8,12,16].forEach(function(b,i){hook(b,['C','AM','F','G'][i],.08+i*.04,0)});
  beats(12,19,function(b){C(b,function(w){I.soft(w,.16+(b-12)*.03)})});C(16,function(w){I.riser(w,4*B,.06)});
  /* Brand, Systems, Code */
  C(20,function(w){I.crash(w,.08);I.sub(w,.35)});
  drums(20,28,{sh:1});[[20,'C'],[24,'EM']].forEach(function(x){bass(x[0],x[1],.42);hook(x[0],x[1],.2)});
  /* Matrix: la macchina si accende. Linea acida a sedicesimi che apre il filtro, poi un arpeggio da computer che corre */
  C(28,function(w){for(var s=0;s<6;s++)I.kick(w+s*B/4,.25+s*.05)});
  var SEQ=[0,12,0,7,0,10,12,3],RTS=[-15,-19,-17];
  for(var s=0;s<4*10;s++)(function(s){var b=29+s*.25,bar=Math.min(2,Math.floor((b-28)/4));if(b>=38.75)return;C(b,function(w){J.acid(w,RTS[bar]+SEQ[s%8],.075,350+2600*Math.pow((b-29)/10,1.6))})})(s);
  for(var a=0;a<16;a++)(function(a){C(35+a*.25,function(w){J.bleep(w,[9,12,16,19,21,24,28,31][a%8]+12,.06+a*.004,(a%2?.4:-.4),.06)})})(a);
  beats(29,38,function(b){if(b%2===1)C(b,function(w){I.kick(w,.45)});C(b+.5,function(w){I.hat(w,.06,.3)});C(b+.75,function(w){I.hat(w,.03,-.3)});if(b%2===0)C(b,function(w){J.rim(w,.08)})});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.04+r*.02)})})(r);
  /* le app */
  C(40,function(w){I.crash(w,.1);I.sub(w,.35)});
  drums(40,61,{sh:1});['C','EM','F','G','C','EM'].forEach(function(ch,i){var b=40+i*4;if(b>=60){bass(b,ch,.4);return}bass(b,ch,.42);hook(b,ch,.2)});
  C(61.5,function(w){I.pad(w,2.5*B,CH.G7,.4,900,2600)});[61.5,62,62.5,63,63.5].forEach(function(b,i){C(b,function(w){J.bleep(w,[19,23,26,29,31][i],.12,(i%2?.3:-.3))})});
  /* Start service e Service complete */
  C(64,function(w){I.crash(w,.08);I.sub(w,.3)});drums(64,68,{sh:1});bass(64,'G7',.44);hook(64,'G7',.2);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.12);I.sub(w,.4);I.stab(w,CH.C.concat([12,16]),.8,.45,3000)});drums(68,72,{sh:1});bass(68,'C',.44);hook(68,'C',.22);
  /* finale */
  C(72,function(w){I.ep(w,[-15,-8,-5,0,4],.045,3.6);I.bass(w,-15,3*B,.16)});
  C(76,function(w){I.ep(w,[-7,-3,0,4,9],.045,6);var d=12*B;[-7,-3,0,4].forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d,v:.04,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}

/* C · piano elettrico, Re maggiore. Accordi caldi sincopati, campanelli, schiocchi di dita, basso rotondo: da video prodotto */
function musicC(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={D:[-10,-3,1,4,6],BM:[-13,-6,-3,2,6],G:[-5,2,6,11],A:[-3,1,4,6],EM:[-8,-1,2,7],GM:[-5,-2,2,7]},RT={D:-22,BM:-25,G:-17,A:-15,EM:-20,GM:-17};
  function keys(b,ch,v){[[0,.5],[.75,.3],[1.5,.4],[2.5,.4],[3.25,.3]].forEach(function(x){C(b+x[0],function(w){I.ep(w,CH[ch],v*(x[1]/.5),.45)})})}
  function bells(b,ch,v){var c=CH[ch],n=c.length;[[.5,c[3%n]+12],[1.5,c[(n-1)]+12],[2.75,c[2]+12],[3.5,c[3%n]+12]].forEach(function(x,i){C(b+x[0],function(w){J.bell(w,x[1],v,(i%2?.3:-.3))})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0)C(b,function(w){I.kick(w,.5)});if(k===1)C(b+.5,function(w){I.kick(w,.3)});if(k===2)C(b+.5,function(w){I.kick(w,.45)});
    if(k===1||k===3)C(b,function(w){J.snap(w,.12,(k===1?-.2:.2));I.clap(w,.08)});[.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.shk(w,i===1?.04:.025,(i-1)*.3)})});if(k===3)C(b+.75,function(w){J.rim(w,.06,.3)})})}
  function bass(b,ch,v){v*=.55;[[0,1.4],[1.5,.4],[2,1.4],[3.5,.4]].forEach(function(x,i){C(b+x[0],function(w){I.bass(w,RT[ch]+(i===3?7:0),x[1]*B,v)})})}
  /* apertura: accordi che respirano e campanelli */
  C(0,function(w){I.ep(w,CH.D,.035,4)});C(8,function(w){I.ep(w,CH.BM,.035,4)});C(16,function(w){I.ep(w,CH.G,.035,2.4)});
  C(0,function(w){I.pad(w,16*B,CH.D,.25,500,1000)});bells(4,'D',.025);bells(8,'BM',.03);bells(12,'BM',.035);bells(16,'G',.04);
  beats(12,19,function(b){C(b,function(w){I.soft(w,.15+(b-12)*.03)})});beats(16,19,function(b){C(b+.5,function(w){I.shk(w,.03)})});C(16,function(w){I.riser(w,4*B,.06)});
  /* Brand, Systems, Code */
  C(20,function(w){I.crash(w,.08);I.sub(w,.3)});drums(20,28);[[20,'D'],[24,'BM']].forEach(function(x){keys(x[0],x[1],.05);bass(x[0],x[1],.4);bells(x[0],x[1],.03)});
  /* Matrix: sequenza di basso a sedicesimi col filtro che sale, e una pioggia di dati in alto */
  C(28,function(w){for(var s=0;s<4;s++)J.snap(w+s*B/4,.06+s*.02)});
  var SQ=[0,0,12,0,7,0,10,12],RS=[-13,-17,-15];
  for(var s=0;s<40;s++)(function(s){var b=29+s*.25,bar=Math.min(2,Math.floor((b-28)/4));if(b>=38.75)return;C(b,function(w){J.acid(w,RS[bar]+SQ[s%8],.06,300+1800*Math.pow((b-29)/10,1.4),.12)})})(s);
  for(var d=0;d<48;d++)(function(d){if(h2(d)<.45)return;var b=30+d*.1875;if(b>=38.5)return;C(b,function(w){J.blip(w,[26,29,31,33,36,38][Math.floor(h2(d+7)*6)]+12,.03,(h2(d+3)-.5)*1.4)})})(d);
  beats(29,38,function(b){if(b%2===0)C(b,function(w){I.kick(w,.45)});if(b%2===1)C(b,function(w){J.snap(w,.1)});[.25,.5,.75].forEach(function(x){C(b+x,function(w){I.shk(w,.025)})})});
  C(36,function(w){I.riser(w,4*B,.06)});
  /* le app */
  C(40,function(w){I.crash(w,.1);I.sub(w,.3)});drums(40,61);
  ['D','BM','G','A','D','BM'].forEach(function(ch,i){var b=40+i*4;bass(b,ch,.4);if(b>=60)return;keys(b,ch,.055);if(i%2===0)bells(b,ch,.03)});
  C(61.5,function(w){I.ep(w,CH.A,.05,2.4);I.pad(w,2.5*B,CH.A,.4,900,2200)});bells(61,'A',.04);
  /* Start service e Service complete */
  C(64,function(w){I.crash(w,.08)});drums(64,68);keys(64,'EM',.055);bass(64,'EM',.42);C(66,function(w){keys(66,'A',.05)});
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){J.snap(w,.04+r2*.02)})})(r2);
  C(68,function(w){I.crash(w,.12);I.sub(w,.35);I.ep(w,CH.D.concat([13]),.07,2)});drums(68,72);keys(68,'D',.06);bass(68,'D',.42);bells(68,'D',.035);
  /* finale */
  C(72,function(w){I.ep(w,CH.BM,.045,3.6);I.bass(w,-25,3*B,.15)});
  C(76,function(w){I.ep(w,CH.G.concat([14]),.045,6);var d2=12*B;CH.G.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d2,v:.04,peak:.12,lp:900,lp1:220,lpt:d2,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-17),d:d2*.8,v:.1,peak:.1,to:'d'})})}
function h2(n){n=Math.sin(n*91.7+13.1)*43758.5453;return n-Math.floor(n)}

/* D · funky, Sol dorico. Basso sincopato, clavinet, fiati corti, battito in levare */
function musicD(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={GM:[-2,2,5,9],C9:[4,7,10,14],EB:[-9,-2,2,7],F:[-7,0,5,9],BB:[-2,2,5,9,14]};
  function bassV(b,root,v){[[0,0],[.75,0],[1,12],[1.5,0],[2.25,3],[2.5,5],[3,0],[3.5,7]].forEach(function(x){C(b+x[0],function(w){J.sbass(w,root+x[1],v,.14)})})}
  function clavV(b,ch,v){[.25,.75,1.25,1.75,2.25,2.75,3.5].forEach(function(s,i){C(b+s,function(w){J.clav(w,CH[ch],v*(i===3?1.4:1),(i%2?.3:-.3))})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0)C(b,function(w){I.kick(w,.55)});if(k===0)C(b+.75,function(w){I.kick(w,.35)});if(k===2)C(b+.5,function(w){I.kick(w,.45)});
    if(k===1||k===3)C(b,function(w){I.clap(w,.18)});[0,.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.hat(w,[.04,.025,.07,.025][i],(i-1.5)*.2,k===3&&i===2)})})})}
  /* apertura: clavinet filtrato e tic, il basso entra quando il colore allaga */
  beats(0,19,function(b){C(b+.5,function(w){J.rim(w,.035,.3)})});C(0,function(w){I.pad(w,16*B,CH.GM,.3,500,1100)});
  [4,8,12,16].forEach(function(b,i){clavV(b,i%2?'C9':'GM',.25+i*.12)});
  [12,16].forEach(function(b){bassV(b,b===12?-17:-24,.25)});C(16,function(w){I.riser(w,4*B,.06)});
  /* Brand, Systems, Code */
  C(20,function(w){I.crash(w,.08);I.sub(w,.35);J.brass(w,CH.GM,.9,.25)});drums(20,28);bassV(20,-17,.42);bassV(24,-24,.42);clavV(20,'GM',.8);clavV(24,'C9',.8);C(27.5,function(w){J.brass(w,CH.C9,.8,.2)});
  /* Matrix: linea acida in Sol minore che sale e si apre, sopra il glitch */
  C(28,function(w){for(var s=0;s<6;s++)J.rim(w+s*B/4,.05+s*.02)});
  var SQ=[0,12,0,10,0,7,3,12,0,0,12,5,0,10,7,3];
  for(var s=0;s<40;s++)(function(s){var b=29+s*.25;if(b>=38.75)return;var bar=Math.floor((b-29)/4);C(b,function(w){J.acid(w,-17+[0,-2,3][Math.min(2,bar)]+SQ[s%16],.09,300+3200*Math.pow((b-29)/10,1.7),.12)})})(s);
  beats(29,38,function(b){C(b,function(w){I.kick(w,b%2?.35:.5)});C(b+.5,function(w){I.hat(w,.06,.2)});if(b%2===1)C(b,function(w){I.clap(w,.1)})});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.04+r*.02)})})(r);
  /* le app */
  C(40,function(w){I.crash(w,.1);I.sub(w,.35);J.brass(w,CH.GM,1,.3)});drums(40,61);
  for(var i=0;i<6;i++)(function(i){var b=40+i*4,c=i%2?'C9':'GM',root=i%2?-24:-17;bassV(b,root,.42);if(b>=60)return;clavV(b,c,.8);if(i%2===1)C(b+3.5,function(w){J.brass(w,CH[c],.8,.2)})})(i);
  C(61.5,function(w){I.pad(w,2.5*B,CH.F,.4,900,2400)});clavV(60.5,'F',.6);
  /* Start service e Service complete */
  C(64,function(w){I.crash(w,.08);J.brass(w,CH.EB,.8,.25)});drums(64,68);bassV(64,-21,.44);clavV(64,'EB',.8);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.12);I.sub(w,.4);J.brass(w,CH.GM.concat([12]),1.2,.5)});drums(68,72);bassV(68,-17,.44);clavV(68,'GM',.8);
  /* finale */
  C(72,function(w){I.ep(w,[-9,-2,2,7,10],.045,3.6);I.bass(w,-21,3*B,.15)});
  C(76,function(w){I.ep(w,CH.BB,.045,6);var d=12*B;CH.BB.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d,v:.04,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-14),d:d*.8,v:.1,peak:.1,to:'d'})})}
var MUS={a:music,b:musicB,c:musicC,d:musicD},STYLE='j',SG={a:1,b:1.7,c:1,d:1.65};

/* E · un tema solo, Fa lidio. Il tema si presenta piano, esplode sulla Aa, passa nel Matrix come arpeggio filtrato,
   torna pieno sulle app, arriva al massimo su Service complete e chiude lento sul logo. Basso a impulsi, drum machine con swing */
var JE={
 pluck:function(w,n,v,p,lp){[-7,7].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:.26,v:v*.16,lp:lp||4200,lp1:650,lpt:.2,lq:1.2,pan:p+(dt>0?.15:-.15),to:'d',echo:.42,rev:.18})});
   tone(w,{type:'square',f:nt(n-12),d:.14,v:v*.08,lp:1400,lp1:400,lpt:.12,pan:p,to:'d'});tone(w,{f:nt(n+12),d:.12,v:v*.12,pan:p,to:'d',rev:.25})},
 glass:function(w,n,v,p){tone(w,{f:nt(n),d:1.4,v:v,pan:p,to:'m',rev:.45,echo:.25});tone(w,{f:nt(n)*2.001,d:.5,v:v*.25,pan:p,to:'m'});tone(w,{type:'triangle',f:nt(n),d:.05,v:v*.3,pan:p,to:'m'})},
 pulse:function(w,n,v,d){tone(w,{f:nt(n),d:d,v:v*.5,sus:1,a:.004,rel:.03,to:'d'});[-6,6].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.17,sus:1,a:.004,rel:.03,lp:650,lp1:260,lpt:d,lq:1.4,to:'d'})})}
};
function musicE(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B,SW=B*.04;
  var CH={F:[-7,-3,0,4,7],GF:[-5,-1,2,7],AM:[-3,0,4,7],G:[-5,-1,2,9],DM:[-10,-7,-3,0,4],BB:[-2,2,5,9],C:[-5,0,4,7]};
  var RT={F:-19,GF:-19,AM:-15,G:-17,DM:-22,BB:-14,C:-12};
  /* il tema: stesso ritmo ogni battuta, le note seguono l'accordo */
  var RH=[0,.75,1.5,2,3],TH={F:[17,16,12,19,17],GF:[19,14,11,14,19],AM:[16,12,9,16,19],G:[19,14,11,21,19],DM:[17,14,9,16,12],BB:[17,14,10,21,17],C:[16,12,7,19,16]};
  function theme(b,ch,v,lp,octUp){TH[ch].forEach(function(n,i){C(b+RH[i],function(w){JE.pluck(w,n+(octUp||0),v,(i%2?.25:-.25),lp)})})}
  function themeGlass(b,ch,v){TH[ch].forEach(function(n,i){C(b+RH[i],function(w){JE.glass(w,n+12,v,(i%2?.3:-.3))})})}
  function bassP(b,ch,v,end){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(end&&t>=end)return;C(t,function(w){JE.pulse(w,RT[ch]+(e===7?12:0),v*(e%2?.75:1),B*.42)})})(e)}
  function hats(b0,b1,v){beats(b0,b1,function(b){[0,.25,.5,.75].forEach(function(s,i){C(b+s,function(w){I.hat(w+(i%2?SW:0),v*[.5,.28,1,.32][i],(i-1.5)*.15,b%4===3&&i===2)})})})}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.58)});if(k===1)C(b+.5,function(w){I.kick(w,(o.k||.58)*.55)});
    if(k===1||k===3)C(b,function(w){I.clap(w,o.c||.19);J.snap(w,.05,.2)});if(k===3)C(b+.75,function(w){J.rim(w,.05,-.3)})});hats(b0,b1,o.h||.075)}
  function pad(b,ch,beatsN,v,lp,lp1){C(b,function(w){I.pad(w,beatsN*B+.05,CH[ch],v,lp,lp1)})}
  /* 1 · apertura: il tema si presenta piano, sul vetro; un orologio sottile; il basso entra quando il colore allaga */
  pad(0,'F',8,.35,500,900);pad(8,'GF',8,.35,700,1300);pad(16,'F',4,.4,900,2200);
  themeGlass(0,'F',.02);themeGlass(8,'GF',.025);
  beats(2,19,function(b){C(b+.5,function(w){J.rim(w,.025,.35)})});
  bassP(12,'F',.2);bassP(16,'GF',.26,19.5);beats(12,19,function(b){C(b,function(w){I.soft(w,.16+(b-12)*.025)})});
  theme(16,'GF',.12,1600);C(16,function(w){I.riser(w,4*B,.06)});
  /* 2 · Brand, Systems, Code: il tema esplode */
  C(20,function(w){I.crash(w,.09);I.sub(w,.35)});
  drums(20,28);bassP(20,'F',.4);bassP(24,'GF',.4);theme(20,'F',.26);theme(24,'GF',.26);pad(20,'F',4,.25,1400);pad(24,'GF',4,.25,1400);
  /* 3 · Matrix: stesso tema, suonato dalla macchina. Arpeggio filtrato che si apre battuta dopo battuta, il basso e la batteria non si fermano */
  C(28,function(w){I.sub(w,.25)});
  var MX=[['DM',28],['BB',32],['C',36]];
  MX.forEach(function(x,bi){var ch=x[0],b=x[1];bassP(b,ch,.36,b===36?38:0);pad(b,ch,4,.3,500+bi*300,900+bi*700);
    var tn=TH[ch];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(t>=39.5)return;var n=tn[[0,2,1,3,4,2,1,0][s%8]]+(s%4===3?12:0);
      C(t,function(w){J.acid(w,n-12,.05+bi*.012,500+2600*Math.pow((t-28)/11.5,1.5),.11)})})(s);
    theme(b,ch,.1+bi*.04,900+bi*900)});
  drums(28,38,{k:.52,c:.13,h:.06});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){I.snare(w,.04+r*.02)})})(r);C(36,function(w){I.riser(w,4*B,.06)});
  /* 4 · le app: tema pieno, il secondo giro un'ottava sopra */
  C(40,function(w){I.crash(w,.1);I.sub(w,.38)});
  var AP=['F','GF','AM','G','F','GF'];drums(40,61);
  AP.forEach(function(ch,i){var b=40+i*4;bassP(b,ch,.4,61.5);pad(b,ch,4,.24,1500);if(b<60)theme(b,ch,.24,4200,i>=4?12:0)});
  /* la pizzeria si apre: resta il tema sul vetro, in attesa */
  pad(61.5,'G',2.5,.42,900,2400);themeGlass(61.5,'G',.03);C(62,function(w){I.riser(w,2*B,.06)});
  /* 5 · Start service e Service complete: il massimo */
  C(64,function(w){I.crash(w,.08);I.sub(w,.32)});drums(64,68);bassP(64,'BB',.42);theme(64,'BB',.26);pad(64,'BB',2,.25,1600);pad(66,'C',2,.25,2000);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){I.snare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.14);I.sub(w,.42);I.stab(w,CH.F.concat([12,16]),.75,.5,3200)});
  drums(68,72);bassP(68,'F',.42);theme(68,'F',.28,4500,12);pad(68,'F',4,.3,1800);
  /* 6 · finale: il tema lento, morbido, sul logo */
  C(72,function(w){I.ep(w,CH.DM,.045,3.6);I.bass(w,-22,3*B,.15)});
  [0,1,2,3,4].forEach(function(i){C(76+RH[i]*1.5,function(w){JE.glass(w,TH.F[i]+12,.028,(i%2?.25:-.25))})});
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){tone(w,{type:'triangle',f:nt(n),d:d,v:.04,peak:.12,lp:900,lp1:220,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.4})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.e=musicE;SG.e=1;
/* F · synthwave e French touch, La minore (La min, Fa, Do, Sol: gli accordi "eroici", non tristi).
   Lead supersaw saturato con un'ottava sotto e un filo di glide, basso che rotola in ottavi saltando d'ottava, arpeggio a sedicesimi,
   cassa secca e rullante grande col riverbero tagliato di netto, campane FM metalliche. Il tema c'è dall'inizio alla fine */
var JF={
 lead:function(w,n,d,v,prev,p){var f=nt(n),f0=prev!=null?nt(prev):f;
   [-16,-9,-3,3,9,16].forEach(function(dt,i){tone(w,{type:'sawtooth',f:f0,f1:f,gl:.04,det:dt,d:d,v:v*.075,sus:1,a:.006,rel:.06,lp:3800,lp1:1700,lpt:Math.min(d,.35),pan:(p||0)+(i-2.5)*.12,to:'x',echo:.22,rev:.2})});
   tone(w,{type:'square',f:f0/2,f1:f/2,gl:.04,d:d,v:v*.09,sus:1,a:.006,rel:.06,lp:1600,pan:p||0,to:'x'})},
 bass:function(w,n,v,d){tone(w,{type:'sawtooth',f:nt(n),d:d,v:v*.3,sus:1,a:.004,rel:.03,lp:1300,lp1:260,lpt:d*.8,lq:3,to:'x'});tone(w,{type:'square',f:nt(n),d:d,v:v*.12,sus:1,a:.004,rel:.03,lp:700,to:'x'});tone(w,{f:nt(n<-20?n:n-12),d:d,v:v*.55,sus:1,a:.004,rel:.03,to:'d'})},
 arp:function(w,n,v,cut,p){tone(w,{type:'sawtooth',f:nt(n),d:.11,v:v,lp:cut,lp1:cut*.3,lpt:.1,lq:4,pan:p,to:'d',echo:.35});tone(w,{type:'square',f:nt(n),d:.07,v:v*.4,lp:cut*.8,pan:-p,to:'d'})},
 strings:function(w,d,ch,v,lp){ch.forEach(function(n,i){[-11,0,11].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.05,sus:1,a:Math.min(.35,d*.25),rel:Math.min(.5,d*.3),lp:lp||1800,pan:(j-1)*.45,to:'d',rev:.35})})})},
 gsnare:function(w,v){noise(w,{f:1900,q:.6,d:.2,v:v,to:'m'});tone(w,{f:190,f1:150,gl:.05,d:.12,v:v*.6,to:'m'});
   /* il riverbero tagliato: una coda di rumore piena che si chiude di colpo */
   var s=AC.createBufferSource();s.buffer=NB;var f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=2200;f.Q.value=.5;var q=out({to:'m',pan:0});
   q.g.gain.setValueAtTime(0,w);q.g.gain.linearRampToValueAtTime(v*.55,w+.01);q.g.gain.linearRampToValueAtTime(v*.42,w+.2);q.g.gain.linearRampToValueAtTime(0,w+.23);s.connect(f);f.connect(q.g);s.start(w,h(w*3.3));s.stop(w+.3)},
 tom:function(w,n,v){tone(w,{f:nt(n),f1:nt(n)*.6,gl:.18,d:.28,v:v,to:'m',rev:.25})},
 fm:function(w,n,v,p,d){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.4,echo:.3});
   c.frequency.value=f;m.frequency.value=f*3.5;mg.gain.setValueAtTime(f*4,w);mg.gain.exponentialRampToValueAtTime(f*.2,w+(d||1.2));m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
   var len=env(q.g.gain,w,{v:v,a:.002,d:d||1.2});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)}
};
function musicF(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={AM:[-3,0,4,9],F:[-7,-3,0,5],C:[-5,0,4,7],G:[-5,-1,2,7],DM:[-10,-7,-3,2],E:[-8,-4,-1,4]};
  var RT={AM:-27,F:-31,C:-24,G:-29,DM:-22,E:-20};/* note di basso, il basso salta d'ottava */
  /* il gancio: frase A (domanda) e frase B (risposta), ritmo puntato riconoscibile. [battito, nota, durata] */
  var PA=[[[0,16,.7],[.75,21,.7],[1.5,19,.45],[2,16,.95],[3,14,.45],[3.5,16,.45]],[[0,12,.7],[.75,9,.7],[1.5,12,.45],[2,14,1.8]]];
  var PB=[[[0,16,.7],[.75,21,.7],[1.5,19,.45],[2,16,.95],[3,19,.45],[3.5,21,.45]],[[0,23,.7],[.75,21,.7],[1.5,19,.45],[2,14,1.8]]];
  var last=null;
  function phrase(b,ph,v,oct){ph.forEach(function(bar,bi){bar.forEach(function(x){var n=x[1]+(oct||0),pv=last;last=n;C(b+bi*4+x[0],function(w){JF.lead(w,n,x[2]*B,v,pv,0)})})})}
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v,B*.45)})})(e)}
  function arp(b,ch,v,c0,c1,rate,until){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){JF.arp(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2&&o.push)C(b+.75,function(w){I.kick(w,.35)});
    if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)});
    C(b+.5,function(w){I.hat(w,.085,.2,k===3)});if(o.h16)[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,.03,-.25)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura: arpeggio che si apre, archi, la cassa entra quando il colore allaga, tom e silenzio prima della Aa */
  [['AM',0],['F',4],['C',8],['G',12],['AM',16]].forEach(function(x,i){arp(x[1],x[0],.035+i*.01,450+i*250,700+i*350,.25,19.5);pad(x[1],x[0],4,.5,700+i*200)});
  C(4,function(w){JF.fm(w,16,.03,-.3,1.6)});C(6,function(w){JF.fm(w,21,.025,.3,1.6)});C(12,function(w){JF.fm(w,19,.03,-.2,1.6)});
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18,18.5,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-12,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code: entra tutto, il gancio fa la domanda */
  C(20,function(w){I.crash(w,.1);I.sub(w,.4);JF.fm(w,21,.04,0,2)});
  drums(20,28,{});bass(20,'AM',.44);bass(24,'F',.44);pad(20,'AM',4,.4);pad(24,'F',4,.4);arp(20,'AM',.03,1800,1800,.25);arp(24,'F',.03,1800,1800,.25);
  phrase(20,PA,.2);
  /* 3 · Matrix: stessa canzone, la macchina prende il comando. Il basso continua, l'arpeggio raddoppia di velocità e il filtro sale,
     le campane metalliche ripetono le prime note del gancio */
  C(28,function(w){I.sub(w,.3)});
  [['AM',28],['F',32],['G',36]].forEach(function(x,i){bass(x[1],x[0],.4,x[1]===36?38:0);pad(x[1],x[0],4,.35,900+i*400);arp(x[1],x[0],.04,600+i*900,1400+i*1100,.125,38.75);
    [0,.75,1.5].forEach(function(s,j){C(x[1]+s,function(w){JF.fm(w,[16,21,19][j]+12,.03,(j-1)*.4,.7)})});C(x[1]+2.5,function(w){JF.fm(w,[16,12,14][i]+12,.025,.2,.9)})});
  drums(28,38,{h16:1,push:1});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.02)})})(r);[39,39.25,39.5].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-12,-15][i],.3)})});
  /* 4 · le app: il gancio intero, domanda e risposta */
  C(40,function(w){I.crash(w,.12);I.sub(w,.42)});
  var AP=['AM','F','C','G','AM','F'];drums(40,61,{h16:1});
  AP.forEach(function(ch,i){var b=40+i*4;bass(b,ch,.44,61.5);pad(b,ch,4,.4);arp(b,ch,.028,2000,2000,.25,61.5)});
  last=null;phrase(40,PA,.22);phrase(48,PB,.22);phrase(56,[PA[0]],.22,12);
  /* la pizzeria si apre: la batteria si toglie, resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,'G',2.5,.55,1600);arp(61.5,'G',.04,900,2600,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-3,-7,-10,-14][i],.28)})});
  /* 5 · Start service: il gancio sale; Service complete: il massimo, su Do maggiore */
  C(64,function(w){I.crash(w,.1);I.sub(w,.35)});drums(64,68,{h16:1});bass(64,'F',.46,66);bass(66,'G',.46);pad(64,'F',2,.4);pad(66,'G',2,.4);
  last=null;[[64,21,.45],[64.5,23,.45],[65,24,.95],[66,23,.45],[66.5,24,.45],[67,26,.9]].forEach(function(x){var pv=last;last=x[1];C(x[0],function(w){JF.lead(w,x[1],x[2]*B,.22,pv,0)})});
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.45);I.stab(w,CH.C.concat([12,16]),.9,.5,3400);JF.fm(w,28,.05,0,2.5)});
  drums(68,72,{h16:1,push:1});bass(68,'C',.46);pad(68,'C',4,.45);arp(68,'C',.03,2200,2200,.25);
  [[68,28,1.4],[69.5,26,.45],[70,24,.95],[71,23,.45],[71.5,21,.45]].forEach(function(x){var pv=last;last=x[1];C(x[0],function(w){JF.lead(w,x[1],x[2]*B,.22,pv,0)})});
  /* 6 · finale: la batteria si ferma, gli archi restano, le campane rifanno il gancio piano sul logo */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-27+12,3*B,.15)});
  [[72,16],[72.75,21],[73.5,19],[74,16]].forEach(function(x,i){C(x[0],function(w){JF.fm(w,x[1]+12,.03,(i%2?.3:-.3),1.6)})});
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'});JF.fm(w,24,.03,0,3)})}
MUS.f=musicF;SG.f=1;
/* G · synthwave più tech, La minore (La min, Sol, Fa, Sol: il giro che spinge). Niente campane. Lead più scuro e ruvido che suona un riff
   a sedicesimi col ritmo sempre uguale. Matrix marcato ma dentro la canzone: batteria a metà tempo, basso acido, arpeggio a trentaduesimi, pad a scatti */
var JG={
 lead:function(w,n,d,v,prev,lp){var f=nt(n),f0=prev!=null?nt(prev):f;
   [-12,-4,4,12].forEach(function(dt,i){tone(w,{type:'sawtooth',f:f0,f1:f,gl:.03,det:dt,d:d,v:v*.09,sus:1,a:.004,rel:.04,lp:lp||2600,lp1:(lp||2600)*.45,lpt:Math.min(d,.18),lq:3,pan:(i-1.5)*.18,to:'x',echo:.18,rev:.12})});
   tone(w,{type:'square',f:f0,f1:f,gl:.03,d:d,v:v*.07,sus:1,a:.004,rel:.04,lp:(lp||2600)*.8,to:'x'});tone(w,{type:'square',f:f0/2,f1:f/2,gl:.03,d:d,v:v*.08,sus:1,a:.004,rel:.04,lp:900,to:'x'})},
 chop:function(w,ch,v,lp,p){ch.forEach(function(n,i){tone(w,{type:'sawtooth',f:nt(n),det:(i%2?7:-7),d:.09,v:v*.06,lp:lp,pan:p,to:'d'})})}
};
function musicG(M,C0){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={AM:[-3,0,4,9],G:[-5,-1,2,7],F:[-7,-3,0,5],E:[-8,-4,-1,4],DM:[-10,-7,-3,2]};
  var RT={AM:-27,G:-29,F:-31,E:-32,DM:-22};
  /* il riff: stesso ritmo in ogni battuta, le note cambiano con l'accordo */
  var RC=[[0,.45],[.75,.22],[1,.45],[1.75,.22],[2,.45],[2.75,.22],[3,.7]];
  var RF={AM:[9,12,16,14,12,9,16],G:[14,11,14,16,19,14,11],F:[9,12,17,16,12,9,17],G2:[19,17,16,14,11,14,11]};
  var last=null;
  function riff(b,key,v,lp,oct){RF[key].forEach(function(n,i){n+=(oct||0);var pv=last;last=n;C(b+RC[i][0],function(w){JG.lead(w,n,RC[i][1]*B,v,pv,lp)})})}
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v,B*.45)})})(e)}
  function acidB(b,ch,v,c0,c1,until){var sq=[0,12,0,0,12,0,7,12,0,12,0,0,10,0,12,7];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(until&&t>=until)return;C(t,function(w){J.acid(w,RT[ch]+12+sq[s],v,c0+(c1-c0)*s/16,.11)})})(s)}
  function arp(b,ch,v,c0,c1,rate,until){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){JF.arp(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(o.half){if(k===0)C(b,function(w){I.kick(w,.66)});if(k===1)C(b+.75,function(w){I.kick(w,.38)});if(k===2)C(b,function(w){JF.gsnare(w,.2);I.clap(w,.1)})}
    else{if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})}
    C(b+.5,function(w){I.hat(w,.08,.2,!o.half&&k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,o.half?.05:.028,-.25)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura: archi scuri, arpeggio filtrato, il riff si sente lontano e si avvicina; la cassa entra col colore */
  [['AM',0],['G',4],['F',8],['G',12],['AM',16]].forEach(function(x,i){pad(x[1],x[0],4,.45,600+i*150);arp(x[1],x[0],.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  last=null;riff(12,'F',.1,900);riff(16,'AM',.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});
  drums(20,28);bass(20,'AM',.44);bass(24,'G',.44);pad(20,'AM',4,.35,1400);pad(24,'G',4,.35,1400);
  last=null;riff(20,'AM',.2);riff(24,'G',.2);
  /* 3 · Matrix: la macchina prende il comando */
  C(28,function(w){I.sub(w,.5);JF.gsnare(w,.22);I.crash(w,.08)});
  [['AM',28],['F',32],['E',36]].forEach(function(x,i){var b=x[1],ch=x[0];acidB(b,ch,.08,400+i*700,900+i*1300,38.75);arp(b,ch,.035,700+i*800,1300+i*1200,.125,38.75);
    for(var s=0;s<16;s++)(function(s){if(s%3===1)return;C(b+s*.25,function(w){JG.chop(w,CH[ch],.9,1200+i*600,(s%2?.3:-.3))})})(s);
    C(b,function(w){I.bass(w,RT[ch]+12,4.02*B,.2);JF.strings(w,4.4*B,CH[ch],.3,700+i*350)})});
  drums(28,38,{half:1});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.022)})})(r);[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.3)})});
  /* 4 · le app: il riff intero, quattro battute, poi riparte */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});
  var AP=[['AM','AM'],['G','G'],['F','F'],['G','G2'],['AM','AM'],['G','G']];drums(40,61);
  last=null;AP.forEach(function(x,i){var b=40+i*4;bass(b,x[0],.44,61.5);pad(b,x[0],4,.35,1500);if(i>=2)arp(b,x[0],.022,1600,1600,.25,61.5);if(b<60)riff(b,x[1],.21,i>=4?3000:2600)});
  /* la pizzeria si apre: resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,'G',2.5,.5,1500);arp(61.5,'G',.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service: il riff un'ottava sopra; Service complete: il massimo, su Fa, epico */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,'F',.46,66);bass(66,'G',.46);pad(64,'F',2,.4);pad(66,'G',2,.4);
  last=null;riff(64,'F',.21,3000,12);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH.F.concat([12,17]),.9,.5,3000)});
  drums(68,72);bass(68,'F',.46);pad(68,'F',4,.45,1800);arp(68,'F',.026,2000,2000,.25);
  [[68,21,1.4],[69.5,19,.45],[70,17,.95],[71,16,.45],[71.5,12,.45]].forEach(function(x){var pv=last;last=x[1];C(x[0],function(w){JG.lead(w,x[1],x[2]*B,.21,pv,3000)})});
  /* 6 · finale: batteria ferma, archi; il riff lontano, filtrato, e si spegne sul Fa */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-15,3*B,.15)});
  last=null;riff(72,'AM',.08,1100);
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.g=musicG;SG.g=1;
/* ---------- la G con tre melodie diverse. Tutto il resto della G resta identico ---------- */
var JH={/* ottone di synth: si apre lento, raddoppiato all'ottava sotto */
 brass:function(w,n,d,v,lp){lp=lp||2600;[[0,1],[-12,.6]].forEach(function(o){[-14,-7,0,7,14].forEach(function(dt,i){tone(w,{type:'sawtooth',f:nt(n+o[0]),det:dt,d:d,v:v*.06*o[1],sus:1,a:.07,rel:.18,lp:lp*.3,lp1:lp,lpt:.28,lq:1.5,pan:(i-2)*.15,to:'x',rev:.25,echo:.12})})})}};
var JI={/* il filtro che parla: dente di sega in tre risonanze che si spostano come una vocale */
 V:{a:[800,1150,2900],o:[450,800,2830],i:[300,2100,2950],e:[420,1700,2600]},
 talk:function(w,n,d,v,from,to){var f=nt(n),o1=AC.createOscillator(),o2=AC.createOscillator();o1.type=o2.type='sawtooth';o1.frequency.value=f;o2.frequency.value=f;o2.detune.value=9;
   var q=out({to:'x',rev:.15,echo:.2}),len=env(q.g.gain,w,{v:v,sus:1,a:.006,d:d,rel:.05}),src=AC.createGain();src.gain.value=.5;o1.connect(src);o2.connect(src);
   var A=JI.V[from]||JI.V.a,Z=JI.V[to]||A;A.forEach(function(fq,k){var bp=AC.createBiquadFilter();bp.type='bandpass';bp.Q.value=7;bp.frequency.setValueAtTime(fq,w);bp.frequency.linearRampToValueAtTime(Z[k],w+Math.min(d,.22));
     var gk=AC.createGain();gk.gain.value=[1,.7,.35][k]*2.2;src.connect(bp);bp.connect(gk);gk.connect(q.g)});
   var lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=500;var gl=AC.createGain();gl.gain.value=.3;src.connect(lp);lp.connect(gl);gl.connect(q.g);
   o1.start(w);o2.start(w);o1.stop(w+len+.05);o2.stop(w+len+.05)}};
var JJ={/* accordi a colpi secchi e un ping metallico */
 stab:function(w,ch,v,lp){lp=lp||2600;ch.forEach(function(n,i){[-6,6].forEach(function(dt,j){tone(w,{type:j?'square':'sawtooth',f:nt(n)*1.02,f1:nt(n),gl:.02,det:dt,d:.17,v:v*.075,lp:lp,lp1:lp*.28,lpt:.15,lq:2,pan:(i-1.5)*.2,to:'x',rev:.18,echo:.15})})})},
 ping:function(w,n,v,p){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.3,echo:.3});
   c.frequency.value=f;m.frequency.value=f*1.41;mg.gain.setValueAtTime(f*2.2,w);mg.gain.exponentialRampToValueAtTime(f*.05,w+.45);m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
   var len=env(q.g.gain,w,{v:v,a:.001,d:.55});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)}};
JJ.dark=function(w,ch,v,lp){lp=lp||2200;ch.forEach(function(n,i){[-7,7].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:.22,v:v*.075,lp:lp,lp1:lp*.24,lpt:.15,lq:1.3,pan:(i-1.5)*.22,to:'x',rev:.22,echo:.16})})});
  tone(w,{type:'triangle',f:nt(ch[0]-12),d:.2,v:v*.12,lp:600,to:'d'})};
JJ.ping2=function(w,n,v,p){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.32,echo:.3});
  c.frequency.value=f;m.frequency.value=f*1.41;mg.gain.setValueAtTime(f*1.3,w);mg.gain.exponentialRampToValueAtTime(f*.04,w+.35);m.connect(mg);mg.connect(c.frequency);c.connect(q.g);
  var len=env(q.g.gain,w,{v:v,a:.002,d:.7});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)};
var MELS={
 h:{/* Tron: poche note lunghe, salti larghi, note tenute che cambiano colore sotto gli accordi */
  N:{AM:[[0,16,1.45],[1.5,21,2.4]],G:[[0,19,1.45],[1.5,14,2.4]],F:[[0,21,1.45],[1.5,16,2.4]],G2:[[0,14,.95],[1,16,.95],[2,11,1.9]]},
  bar:function(C,B,b,key,v,lp,oct){this.N[key].forEach(function(x){C(b+x[0],function(w){JH.brass(w,x[1]+(oct||0),x[2]*B,v*1.35,lp)})})},
  done:function(C,B){[[68,21,1.95],[70,24,1.95]].forEach(function(x){C(x[0],function(w){JH.brass(w,x[1],x[2]*B,.24,3200)})})}},
 i:{/* Daft Punk: riff basso con tanto spazio, il filtro che parla */
  N:{AM:[[0,-3,.4,'a','o'],[.75,-3,.2,'o','a'],[1,0,.45,'a','e'],[2.5,4,.4,'e','i'],[3,2,.7,'o','a']],
     G:[[0,-5,.4,'a','o'],[.75,-5,.2,'o','a'],[1,-1,.45,'a','e'],[2.5,2,.4,'e','i'],[3,-1,.7,'o','a']],
     F:[[0,-7,.4,'a','o'],[.75,-7,.2,'o','a'],[1,-3,.45,'a','e'],[2.5,0,.4,'e','i'],[3,4,.7,'i','o']],
     G2:[[0,-5,.4,'a','o'],[.75,-1,.2,'o','a'],[1,2,.45,'a','e'],[2,4,.9,'e','i'],[3,2,.45,'o','a'],[3.5,-1,.4,'a','o']]},
  bar:function(C,B,b,key,v,lp,oct){this.N[key].forEach(function(x){C(b+x[0],function(w){JI.talk(w,x[1]+12+(oct||0),x[2]*B,v*(lp&&lp<1500?.6:1)*.9,x[3],x[4])})})},
  done:function(C,B){[[68,21,.9,'a','o'],[69,24,.9,'o','e'],[70,21,1.9,'e','i']].forEach(function(x){C(x[0],function(w){JI.talk(w,x[1],x[2]*B,.2,x[3],x[4])})})}},
 j:{/* Apple e Teenage Engineering, più seria: stessi colpi sincopati, accordi stretti e più bassi (settime, seste, seconde),
     suono scuro senza il blip che scende, ping un'ottava sotto e morbido. A Start service non sale d'ottava, si apre il filtro */
  CH:{AM:[7,9,12,16],G:[4,7,9,14],F:[4,5,9,12],G2:[2,7,9,14]},P:{AM:16,F:21,G2:19},
  bar:function(C,B,b,key,v,lp,oct){var ch=this.CH[key];if(oct)lp=(lp||2600)*1.25;[[0,1],[.75,.6],[2,.9],[2.75,.6],[3.5,.75]].forEach(function(x){C(b+x[0],function(w){JJ.dark(w,ch,v*x[1]*1.55,lp)})});
    var p=this.P[key];if(p!=null)C(b+(key==='G2'?3:1.5),function(w){JJ.ping2(w,p,v*.2,.2)})},
  done:function(C,B){var ch=[0,4,5,9,12];[[68,1.5],[68.75,.7],[70,1.1],[70.75,.7],[71.5,.9]].forEach(function(x){C(x[0],function(w){JJ.dark(w,ch,.21*x[1],3000)})});
    C(68,function(w){JJ.ping2(w,21,.05,0)});C(70,function(w){JJ.ping2(w,24,.04,.3)})}}
};
function musicGX(M,C0,MEL){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B;
  var CH={AM:[-3,0,4,9],G:[-5,-1,2,7],F:[-7,-3,0,5],E:[-8,-4,-1,4],DM:[-10,-7,-3,2]};
  var RT={AM:-27,G:-29,F:-31,E:-32,DM:-22};
  /* il riff: stesso ritmo in ogni battuta, le note cambiano con l'accordo */
  var RC=[[0,.45],[.75,.22],[1,.45],[1.75,.22],[2,.45],[2.75,.22],[3,.7]];
  var RF={AM:[9,12,16,14,12,9,16],G:[14,11,14,16,19,14,11],F:[9,12,17,16,12,9,17],G2:[19,17,16,14,11,14,11]};
  var last=null;
  function riff(b,key,v,lp,oct){MEL.bar(C,B,b,key,v,lp,oct)}
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v,B*.45)})})(e)}
  function acidB(b,ch,v,c0,c1,until){var sq=[0,12,0,0,12,0,7,12,0,12,0,0,10,0,12,7];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(until&&t>=until)return;C(t,function(w){J.acid(w,RT[ch]+12+sq[s],v,c0+(c1-c0)*s/16,.11)})})(s)}
  function arp(b,ch,v,c0,c1,rate,until){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){JF.arp(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(o.half){if(k===0)C(b,function(w){I.kick(w,.66)});if(k===1)C(b+.75,function(w){I.kick(w,.38)});if(k===2)C(b,function(w){JF.gsnare(w,.2);I.clap(w,.1)})}
    else{if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})}
    C(b+.5,function(w){I.hat(w,.08,.2,!o.half&&k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,o.half?.05:.028,-.25)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura: archi scuri, arpeggio filtrato, il riff si sente lontano e si avvicina; la cassa entra col colore */
  [['AM',0],['G',4],['F',8],['G',12],['AM',16]].forEach(function(x,i){pad(x[1],x[0],4,.45,600+i*150);arp(x[1],x[0],.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  last=null;riff(12,'F',.1,900);riff(16,'AM',.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});
  drums(20,28);bass(20,'AM',.44);bass(24,'G',.44);pad(20,'AM',4,.35,1400);pad(24,'G',4,.35,1400);
  last=null;riff(20,'AM',.2);riff(24,'G',.2);
  /* 3 · Matrix: la macchina prende il comando */
  C(28,function(w){I.sub(w,.5);JF.gsnare(w,.22);I.crash(w,.08)});
  [['AM',28],['F',32],['E',36]].forEach(function(x,i){var b=x[1],ch=x[0];acidB(b,ch,.1,500+i*700,1000+i*1300,38.75);arp(b,ch,.042,800+i*800,1400+i*1200,.125,38.75);
    for(var s=0;s<16;s++)(function(s){if(s%3===1)return;C(b+s*.25,function(w){JG.chop(w,CH[ch],.9,1200+i*600,(s%2?.3:-.3))})})(s);
    C(b,function(w){I.bass(w,RT[ch]+12,4.02*B,.27);JF.strings(w,4.4*B,CH[ch],.4,800+i*350)})});
  drums(28,38,{half:1});
  for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.022)})})(r);[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.3)})});
  /* 4 · le app: il riff intero, quattro battute, poi riparte */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});
  var AP=[['AM','AM'],['G','G'],['F','F'],['G','G2'],['AM','AM'],['G','G']];drums(40,61);
  last=null;AP.forEach(function(x,i){var b=40+i*4;bass(b,x[0],.44,61.5);pad(b,x[0],4,.35,1500);if(i>=2)arp(b,x[0],.022,1600,1600,.25,61.5);if(b<60)riff(b,x[1],.21,i>=4?3000:2600)});
  /* la pizzeria si apre: resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,'G',2.5,.5,1500);arp(61.5,'G',.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service: il riff un'ottava sopra; Service complete: il massimo, su Fa, epico */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,'F',.46,66);bass(66,'G',.46);pad(64,'F',2,.4);pad(66,'G',2,.4);
  last=null;riff(64,'F',.21,3000,12);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH.F.concat([12,17]),.9,.5,3000)});
  drums(68,72);bass(68,'F',.46);pad(68,'F',4,.45,1800);arp(68,'F',.026,2000,2000,.25);
  MEL.done(C,B);
  /* 6 · finale: batteria ferma, archi; il riff lontano, filtrato, e si spegne sul Fa */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-15,3*B,.15)});
  last=null;riff(72,'AM',.08,1100);
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.h=function(M,C0){musicGX(M,C0,MELS.h)};MUS.i=function(M,C0){musicGX(M,C0,MELS.i)};MUS.j=function(M,C0){musicGX(M,C0,MELS.j)};SG.h=SG.i=SG.j=1;
/* ---------- K, L, M: tre canzoni nuove sulla stessa struttura e batteria della G ----------
   Regole: cambiare giro di accordi, basso, arpeggio e tema (non solo il suono del tema). Niente La min, Sol, Fa, Sol.
   Accordi con settime, none e sospesi (adulti, non tristi). Tema di tre note per battuta, registro medio, salti di quarta e quinta,
   spazio in ogni battuta. Basso con un ritmo suo, niente ottava che rimbalza. Niente campanelli.
   Runtime: la musica non si ferma. Un colpo forte sul glitch, la band va dietro un vetro (filtro che si riapre in tre battute),
   davanti piove un arpeggio digitale, la batteria resta uguale. */
function penv(g,w,v,d){var a=.003,k=Math.min(.22,d*.45);g.setValueAtTime(0,w);g.linearRampToValueAtTime(v,w+a);g.exponentialRampToValueAtTime(v*.32,w+a+k);
  g.linearRampToValueAtTime(v*.22,w+Math.max(a+k+.01,d-.06));g.linearRampToValueAtTime(0,w+Math.max(a+k+.02,d));return Math.max(a+k+.02,d)}
var FX={/* il vetro: filtro passa basso su tutta la band (la batteria resta fuori) */
 filt:function(w,f0,f1,d,q){var f=bus&&bus.mf;if(!f)return;f.frequency.cancelScheduledValues(w);f.Q.cancelScheduledValues(w);f.frequency.setValueAtTime(f0,w);f.frequency.exponentialRampToValueAtTime(f1,w+d);
   f.Q.setValueAtTime(q||.7,w);f.Q.linearRampToValueAtTime(.7,w+d)},
 /* l'impatto del Runtime: risucchio che sale e si taglia, colpo sub, crash */
 impact:function(w,B){noise(w-B*1.5,{f:300,f1:6500,q:1.2,d:B*1.5,v:.06,peak:.99,to:'m',rev:.2});tone(w,{f:68,f1:28,gl:1.2,d:1.4,v:.55,to:'m'});
   noise(w,{type:'lowpass',f:900,f1:120,d:.5,v:.22,to:'m',rev:.3});I.crash(w,.11)}};
var JK={
 /* lama: FM a rapporto 2 (vuoto, metallico, non campana) più un corpo di seghe filtrate */
 blade:function(w,n,d,v,p,lp){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.22,echo:.24});
   c.frequency.value=f;m.frequency.value=f*2;mg.gain.setValueAtTime(f*2.4,w);mg.gain.exponentialRampToValueAtTime(f*.3,w+Math.min(.45,d));m.connect(mg);mg.connect(c.frequency);
   var lf=AC.createBiquadFilter();lf.type='lowpass';lf.frequency.value=lp||3400;c.connect(lf);lf.connect(q.g);var len=penv(q.g.gain,w,v,d);
   m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05);
   [-8,8].forEach(function(dt){tone(w,{type:'sawtooth',f:f,det:dt,d:d,v:v*.32,sus:1,a:.008,rel:Math.min(.2,d*.4),lp:Math.min(lp||3400,2400),lp1:650,lpt:Math.min(d,.5),lq:1.4,pan:(p||0)+dt*.03,to:'d',rev:.18})})},
 /* pioggia digitale: arpeggio a trentaduesimi davanti al vetro */
 rain:function(w,n,v,cut,p){tone(w,{type:'square',f:nt(n),d:.06,v:v,lp:cut,lp1:cut*.4,lpt:.05,lq:3,pan:p,to:'m',echo:.25});tone(w,{type:'sawtooth',f:nt(n+12),d:.04,v:v*.35,lp:cut*1.4,pan:-p,to:'m'})}};
var JL={
 /* il basso che canta: due seghe e un'onda quadra nel filtro risonante, più il sub */
 growl:function(w,n,v,d,lp){lp=lp||2300;[-8,8].forEach(function(dt,i){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:v*.2,sus:1,a:.004,rel:.03,lp:lp,lp1:lp*.24,lpt:Math.min(d,.22),lq:5,pan:i?.12:-.12,to:'x'})});
   tone(w,{type:'square',f:nt(n),d:d,v:v*.1,sus:1,a:.004,rel:.03,lp:lp*.5,lp1:240,lpt:d,to:'x'});tone(w,{f:nt(n<-20?n:n-12),d:d,v:v*.5,sus:1,a:.004,rel:.03,to:'d'})}};
var JM={
 /* pluck morbido: due seghe e una quadra un'ottava sotto, il filtro si chiude piano */
 pluck:function(w,n,d,v,p,lp){lp=lp||3000;[-10,10].forEach(function(dt,i){var o=AC.createOscillator();o.type='sawtooth';o.frequency.value=nt(n);o.detune.value=dt;
     var f=AC.createBiquadFilter();f.type='lowpass';f.Q.value=2;f.frequency.setValueAtTime(lp,w);f.frequency.exponentialRampToValueAtTime(Math.max(300,lp*.28),w+Math.min(d,.6));
     var q=out({pan:(p||0)+(i?.22:-.22),to:'d',rev:.25,echo:.28}),len=penv(q.g.gain,w,v*.11,d);o.connect(f);f.connect(q.g);o.start(w);o.stop(w+len+.05)});
   tone(w,{type:'square',f:nt(n-12),d:d,v:v*.05,sus:1,a:.004,rel:Math.min(.2,d*.4),lp:900,lp1:300,lpt:d,pan:p||0,to:'d'});
   tone(w,{f:nt(n+12),d:.35,v:v*.035,pan:-(p||0),to:'d',echo:.3})},
 /* basso a impulsi: ottavi dritti sulla stessa nota, accento sul battito, il filtro respira */
 pulse:function(w,n,v,d,cut){tone(w,{type:'sawtooth',f:nt(n),d:d,v:v*.26,sus:1,a:.004,rel:.03,lp:cut,lp1:cut*.3,lpt:d*.9,lq:2.5,to:'x'});tone(w,{f:nt(n<-20?n:n-12),d:d,v:v*.55,sus:1,a:.004,rel:.03,to:'d'})}};

function musicN(M,C0,S){var h=H(M,C0),C=h.C,beats=h.beats,B=h.B,P=S.P,CH=S.CH,RT=S.RT,bar=0;
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})
    C(b+.5,function(w){I.hat(w,.08,.2,k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,.028,-.25)})});
    if(o.sh)[.125,.375,.625,.875].forEach(function(s){C(b+s,function(w){I.shk(w,.018,.35)})})})}
  function pad(b,ch,n,v,lp){var c=CH[ch];C(b,function(w){JF.strings(w,n*B+.05,c,v*4/c.length,lp)})}
  function arp(b,ch,v,c0,c1,rate,until,rain){var c=CH[ch],seq=S.ARP.map(function(k){return c[k%c.length]+12+(k>=c.length?12:0)}),n=Math.round(4/rate);
    for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;C(t,function(w){(rain?JK.rain:JF.arp)(w,seq[i%seq.length],v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function bass(b,ch,v,until,lp){S.bass(C,B,b,ch,v,until,lp)}
  function hook(b,ch,v,lp,oct){S.hook(C,B,b,ch,bar++%2,v,lp,oct||0)}
  function tease(b,ch,v,lp){if(S.teaseBass)bass(b,ch,S.bv*v*2.6,null,lp);else hook(b,ch,v,lp)}
  /* 1 · apertura: archi scuri sul giro nuovo, arpeggio filtrato, il tema lontano che si avvicina */
  [P[0],P[1],P[2],P[3],P[0]].forEach(function(ch,i){pad(i*4,ch,4,.45,600+i*150);arp(i*4,ch,.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  bar=1;tease(12,P[3],.1,900);bar=0;tease(16,P[0],.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});drums(20,28);bar=0;
  [P[0],P[1]].forEach(function(ch,i){var b=20+i*4;bass(b,ch,S.bv);pad(b,ch,4,.35,1400);hook(b,ch,.2)});
  /* 3 · Runtime: niente stacco. Colpo forte, la band dietro il vetro che si riapre, la pioggia digitale davanti, batteria uguale */
  C(28,function(w){FX.impact(w,B);FX.filt(w,520,9000,11.6*B,5)});C(40,function(w){FX.filt(w,9000,20000,.05)});
  drums(28,40,{sh:1});
  S.MX.forEach(function(ch,i){var b=28+i*4;bass(b,ch,S.bv);pad(b,ch,4,.38,900+i*400);hook(b,ch,.2);arp(b,ch,.024+i*.004,1500+i*900,2600+i*1200,.125,39.5,1)});
  C(36,function(w){I.riser(w,4*B,.06)});[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.2)})});
  /* 4 · le app: il tema intero, poi riparte */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});drums(40,61);bar=0;
  [0,1,2,3,0,1].forEach(function(k,i){var b=40+i*4,ch=P[k];bass(b,ch,S.bv,61.5);pad(b,ch,4,.35,1500);if(i>=2)arp(b,ch,.022,1600,1600,.25,61.5);if(b<60)hook(b,ch,.21,i>=4?3200:2800)});
  /* la pizzeria si apre: resta l'arpeggio sugli archi, tom verso Start service */
  pad(61.5,P[1],2.5,.5,1500);arp(61.5,P[1],.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service e Service complete */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,S.SV[0],S.bv,66);bass(66,S.SV[1],S.bv,68);pad(64,S.SV[0],2,.4);pad(66,S.SV[1],2,.4);
  bar=0;hook(64,S.SV[0],.25,3400,S.svOct||0);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH[S.DONE].concat([CH[S.DONE][0]+24]),.9*4/CH[S.DONE].length,.5,3000)});
  drums(68,72);bass(68,S.DONE,S.bv);pad(68,S.DONE,4,.45,1800);arp(68,S.DONE,.026,2000,2000,.25);S.done(C,B);
  /* 6 · finale: batteria ferma, archi, il tema lontano; si spegne sull'accordo aperto */
  C(72,function(w){JF.strings(w,4*B,CH[P[0]],.45*4/CH[P[0]].length,1200);I.bass(w,RT[P[0]]+12,3*B,.15)});
  bar=0;hook(72,P[0],.08,1100);
  C(76,function(w){var d=12*B,c=CH[S.FADE];c.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022*4/c.length,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(S.FRT),d:d*.8,v:.1,peak:.1,to:'d'})})}

var SONGS={
 /* K · Monolite. La min 9, Fa maj7 con l'undicesima, Re min 9, accordo per quarte su Mi. Il tema: colpi di accordo e tre note
    (Mi, Si, Re) che restano quasi uguali mentre sotto cambia l'armonia: ogni volta suonano diverse. Basso sincopato */
 k:{P:['a','f','d','e'],MX:['d','e','e'],SV:['d','e'],DONE:'f',FADE:'f',FRT:-19,bv:.46,
  CH:{a:[-3,0,4,7,11],f:[-7,-3,0,4,11],d:[-10,-7,-3,0,4],e:[-8,-3,2,7,11]},RT:{a:-27,f:-31,d:-22,e:-20},
  ARP:[0,2,4,2,1,3,5,3],
  MO:{a:[16,11,14],f:[16,11,12],d:[16,11,14],e:[16,14,9]},
  bass:function(C,B,b,ch,v,until){var r=this.RT[ch];[[0,0,.55],[.75,0,.2],[1.5,12,.2],[2,0,.4],[2.75,0,.2],[3.25,7,.2],[3.5,12,.25]].forEach(function(x){var t=b+x[0];if(until&&t>=until)return;
    C(t,function(w){JF.bass(w,r+x[1],v,x[2]*B)})})},
  hook:function(C,B,b,ch,par,v,lp,oct){var c=this.CH[ch].map(function(n){return n+oct}),m=this.MO[ch];
    (par?[[.5,.75],[1.25,.6]]:[[0,1],[.75,.55],[1.5,.8]]).forEach(function(x){C(b+x[0],function(w){JJ.stab(w,c,v*x[1]*1.05,lp)})});
    [[2,.6],[2.75,.6],[3.5,1.25]].forEach(function(x,i){var n=m[i]+oct;C(b+x[0],function(w){JK.blade(w,n,x[1]*B,v*.55,i===1?.25:-.15,lp?lp+600:3600)})})},
  done:function(C,B){var c=this.CH.f.map(function(n){return n+12});[[68,1.4],[68.75,.7],[69.5,.9]].forEach(function(x){C(x[0],function(w){JJ.stab(w,c,.23*x[1],3200)})});
    [[70,16,.7],[70.75,23,.7],[71.5,21,2.2]].forEach(function(x){C(x[0],function(w){JK.blade(w,x[1],x[2]*B,.17,0,4200)})})}},

 /* L · Circuito. La dorico: La min 11, La min 7, Do maj7, Re con la nona. Il tema è il basso: un riff a sedicesimi con lo stesso ritmo,
    che sale e cambia la fine (domanda e risposta). Sopra, poche note lunghe e scure, accordi corti sul rullante */
 l:{P:['a','a2','c','d'],MX:['c','d','d'],SV:['c','d'],DONE:'f',FADE:'f',FRT:-19,bv:.5,
  CH:{a:[-3,0,2,7],a2:[-3,0,4,7],c:[-5,0,4,11],d:[-6,-3,2,4],f:[-7,-3,0,4,7]},RT:{a:-27,a2:-27,c:-24,d:-22,f:-31},
  ARP:[0,3,1,3,2,3,1,3],
  R:[[0,.4],[.75,.2],[1.25,.2],[1.5,.3],[2.25,.2],[2.5,.2],[3,.35],[3.5,.35]],
  RF:{a:[-27,-15,-17,-15,-12,-15,-20,-17],a2:[-27,-15,-17,-15,-12,-10,-8,-10],c:[-24,-12,-13,-12,-8,-12,-17,-13],d:[-22,-10,-12,-10,-6,-8,-10,-15],f:[-31,-19,-20,-19,-15,-19,-24,-20]},
  TOP:{a:[[0,16,3],[3,14,4.8]],a2:[],c:[[0,16,3],[3,18,4.6]],d:[],f:[]},
  bass:function(C,B,b,ch,v,until,lp){var nn=this.RF[ch];this.R.forEach(function(x,i){var t=b+x[0];if(until&&t>=until)return;C(t,function(w){JL.growl(w,nn[i],v*(i===0?1:.85),x[1]*B,lp)})})},
  teaseBass:1,
  hook:function(C,B,b,ch,par,v,lp,oct){var c=this.CH[ch].map(function(n){return n+12+oct});
    [1,3].forEach(function(s){C(b+s,function(w){JJ.stab(w,c,v*.55,Math.min(lp||1800,1800))})});
    var cut=(b===64);this.TOP[ch].forEach(function(x){var d=cut?Math.min(x[2],3.9-x[0]):x[2];C(b+x[0],function(w){JH.brass(w,x[1]+oct,d*B,v*.5,lp?Math.min(lp,2200):2200)})})},
  done:function(C,B){[[68,16,1.4],[69.5,19,.45],[70,21,2]].forEach(function(x){C(x[0],function(w){JH.brass(w,x[1],x[2]*B,.18,3000)})});
    var c=this.CH.f.map(function(n){return n+12});[69,71].forEach(function(s){C(s,function(w){JJ.stab(w,c,.14,2400)})})}},

 /* M · Vetro. Re minore, basso che scende: Re min 9, La min 7 su Do, Si bemolle maj7, Sol min 9 (e La sospeso per tornare).
    Il tema: tre note a quinte e quarte, la stessa forma che scende col basso. Basso a impulsi dritti, nessun salto */
 m:{P:['dm','amc','bb','gm'],MX:['bb','gm','asus'],SV:['gm','asus'],DONE:'bb',FADE:'bb',FRT:-14,bv:.48,
  CH:{dm:[-7,-3,0,4],amc:[-5,-3,0,4],bb:[-7,-2,2,9],gm:[-2,2,5,9],asus:[-5,-3,2,4]},RT:{dm:-22,amc:-24,bb:-26,gm:-29,asus:-27},
  ARP:[0,2,1,3,0,2,4,3],
  MO:{dm:[14,9,16],amc:[12,7,14],bb:[10,5,12],gm:[9,14,17],asus:[9,14,16]},
  bass:function(C,B,b,ch,v,until){var r=this.RT[ch];for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;
    C(t,function(w){JM.pulse(w,r,v*(e%2?.6:1),(e%2?.3:.45)*B,e%2?700:1100+e*60)})})(e)},
  hook:function(C,B,b,ch,par,v,lp,oct){var m=this.MO[ch],c=this.CH[ch].map(function(n){return n+12+oct});
    [[0,1],[1.5,.5],[2,1.5]].forEach(function(x,i){var n=m[i]+oct;C(b+x[0],function(w){JM.pluck(w,n,x[1]*B,v*1.6,i===1?.2:-.12,lp?lp+400:3400)})});
    C(b+3.5,function(w){JJ.stab(w,c,v*(par?.75:.5),lp||2400)})},
  done:function(C,B){var c=this.CH.bb.map(function(n){return n+12});[[68,1.4],[68.75,.7],[69.5,.9]].forEach(function(x){C(x[0],function(w){JJ.stab(w,c,.23*x[1],3200)})});
    [[70,17,.7],[70.75,22,.7],[71.5,21,2.2]].forEach(function(x){C(x[0],function(w){JM.pluck(w,x[1],x[2]*B,.38,0,4000)})})}}
};
MUS.k=function(M,C0){musicN(M,C0,SONGS.k)};MUS.l=function(M,C0){musicN(M,C0,SONGS.l)};MUS.m=function(M,C0){musicN(M,C0,SONGS.m)};SG.k=SG.l=SG.m=1.22;
/* ---------- J2 e J3: la J più seria. Stesso ritmo, stessa struttura.
   Un tono sotto (Sol minore), colpi di accordo un'ottava più giù con accordi di nona, senza il cinguettio d'attacco e senza onda quadra,
   il ping non è più una campanella ed è più basso, il basso batte l'ottava solo di passaggio, battute pari e dispari diverse (respiro).
   J2: Runtime come la J. J3: Runtime morbido, la musica continua e passa dietro un vetro ---------- */
var JN={
 stab:function(w,ch,v,lp){lp=lp||2200;var k=4/ch.length;ch.forEach(function(n,i){[-7,7].forEach(function(dt,j){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:.2,v:v*.08*k,lp:lp,lp1:lp*.22,lpt:.17,lq:1.6,pan:(i-(ch.length-1)/2)*.16+(j?.08:-.08),to:'x',rev:.1,echo:.14})})});
   tone(w,{f:nt(ch[0]-12),d:.16,v:v*.1,to:'d'})},
 ping:function(w,n,v,p){var f=nt(n),c=AC.createOscillator(),m=AC.createOscillator(),mg=AC.createGain(),q=out({pan:p||0,to:'d',rev:.28,echo:.3});
   c.frequency.value=f;m.frequency.value=f*2;mg.gain.setValueAtTime(f*1.6,w);mg.gain.exponentialRampToValueAtTime(f*.06,w+.3);m.connect(mg);mg.connect(c.frequency);
   var lf=AC.createBiquadFilter();lf.type='lowpass';lf.frequency.value=2600;c.connect(lf);lf.connect(q.g);
   var len=env(q.g.gain,w,{v:v,a:.002,d:.7});m.start(w);c.start(w);m.stop(w+len+.05);c.stop(w+len+.05)}};
MELS.j2={
 CH:{AM:[-3,0,4,7,11],G:[-5,-1,2,7,9],F:[-7,-3,0,4,7],G2:[-5,0,2,7,9]},P:{AM:4,F:9,G2:7},
 RA:[[0,1],[.75,.55],[2,.9],[2.75,.55],[3.5,.7]],RB:[[0,1],[.75,.45],[2,.85],[2.75,.45]],
 bar:function(C,B,b,key,v,lp,oct){var ch=this.CH[key].map(function(n){return n+(oct||0)}),odd=Math.round(b/4)%2;(odd?this.RB:this.RA).forEach(function(x){C(b+x[0],function(w){JN.stab(w,ch,v*x[1]*1.6,lp)})});
   var p=this.P[key];if(p!=null&&!odd)C(b+(key==='G2'?3:1.5),function(w){JN.ping(w,p+12+(oct||0),v*.14,.2)})},
 done:function(C,B){var ch=[-7,-3,0,4,7,12];[[68,1.5],[68.75,.7],[70,1.1],[70.75,.7],[71.5,.9]].forEach(function(x){C(x[0],function(w){JN.stab(w,ch,.3*x[1],3000)})});
   C(68,function(w){JN.ping(w,21,.05,0)});C(70,function(w){JN.ping(w,24,.04,.3)})}};
function musicJ2(M,C00,soft){var KEY=-2,C0=function(t,f){C00(t,function(w){TR=KEY;try{f(w)}finally{TR=0}})};
  var h=H(M,C0),C=h.C,beats=h.beats,B=h.B,MEL=MELS.j2;
  var CH={AM:[-3,0,4,9],G:[-5,-1,2,7],F:[-7,-3,0,5],E:[-8,-4,-1,4],DM:[-10,-7,-3,2]};
  var RT={AM:-27,G:-29,F:-31,E:-32,DM:-22};
  function riff(b,key,v,lp,oct){MEL.bar(C,B,b,key,v,lp,oct)}
  /* il basso: la nota sul battito, l'ottava solo come ombra corta */
  function bass(b,ch,v,until){for(var e=0;e<8;e++)(function(e){var t=b+e*.5;if(until&&t>=until)return;C(t,function(w){JF.bass(w,RT[ch]+(e%2?12:0),v*(e%2?.55:1),B*(e%2?.28:.45))})})(e)}
  function acidB(b,ch,v,c0,c1,until){var sq=[0,12,0,0,12,0,7,12,0,12,0,0,10,0,12,7];for(var s=0;s<16;s++)(function(s){var t=b+s*.25;if(until&&t>=until)return;C(t,function(w){J.acid(w,RT[ch]+12+sq[s],v,c0+(c1-c0)*s/16,.11)})})(s)}
  function arp(b,ch,v,c0,c1,rate,until,rain){var c=CH[ch],seq=[0,1,2,3,2,1,2,3].map(function(k){return c[k]+12}),n=Math.round(4/rate);for(var i=0;i<n;i++)(function(i){var t=b+i*rate;if(until&&t>=until)return;
    C(t,function(w){(rain?JK.rain:JF.arp)(w,seq[i%8]+(i%8===3?12:0),v,c0+(c1-c0)*(i/n),(i%2?.3:-.3))})})(i)}
  function drums(b0,b1,o){o=o||{};beats(b0,b1,function(b){var k=b%4;
    if(o.half){if(k===0)C(b,function(w){I.kick(w,.66)});if(k===1)C(b+.75,function(w){I.kick(w,.38)});if(k===2)C(b,function(w){JF.gsnare(w,.2);I.clap(w,.1)})}
    else{if(k===0||k===2)C(b,function(w){I.kick(w,o.k||.62)});if(k===2)C(b+.75,function(w){I.kick(w,.32)});if(k===1||k===3)C(b,function(w){JF.gsnare(w,o.s||.16);I.clap(w,.08)})}
    C(b+.5,function(w){I.hat(w,.08,.2,!o.half&&k===3)});[.25,.75].forEach(function(s){C(b+s,function(w){I.hat(w,o.half?.05:.028,-.25)})});
    if(o.sh)[.125,.375,.625,.875].forEach(function(s){C(b+s,function(w){I.shk(w,.018,.35)})})})}
  function pad(b,ch,n,v,lp){C(b,function(w){JF.strings(w,n*B+.05,CH[ch],v,lp)})}
  /* 1 · apertura */
  [['AM',0],['G',4],['F',8],['G',12],['AM',16]].forEach(function(x,i){pad(x[1],x[0],4,.45,600+i*150);arp(x[1],x[0],.028+i*.006,400+i*180,600+i*260,.25,19.5)});
  riff(12,'F',.1,900);riff(16,'AM',.14,1400);
  beats(12,19,function(b){C(b,function(w){I.kick(w,.22+(b-12)*.04)})});
  [18.5,18.75,19,19.25].forEach(function(b,i){C(b,function(w){JF.tom(w,[-8,-10,-13,-15][i],.25)})});C(16,function(w){I.riser(w,4*B,.07)});
  /* 2 · Brand, Systems, Code */
  C(20,function(w){I.crash(w,.1);I.sub(w,.42)});
  drums(20,28);bass(20,'AM',.44);bass(24,'G',.44);pad(20,'AM',4,.35,1400);pad(24,'G',4,.35,1400);
  riff(20,'AM',.2);riff(24,'G',.2);
  /* 3 · Runtime */
  if(!soft){
    C(28,function(w){I.sub(w,.5);JF.gsnare(w,.22);I.crash(w,.08)});
    [['AM',28],['F',32],['E',36]].forEach(function(x,i){var b=x[1],ch=x[0];acidB(b,ch,.08,400+i*700,900+i*1300,38.75);arp(b,ch,.035,700+i*800,1300+i*1200,.125,38.75);
      for(var s=0;s<16;s++)(function(s){if(s%3===1)return;C(b+s*.25,function(w){JG.chop(w,CH[ch],.9,1200+i*600,(s%2?.3:-.3))})})(s);
      C(b,function(w){I.bass(w,RT[ch]+12,4.02*B,.2);JF.strings(w,4.4*B,CH[ch],.3,700+i*350)})});
    drums(28,38,{half:1});
    for(var r=0;r<8;r++)(function(r){C(38+r*.25,function(w){JF.gsnare(w,.05+r*.022)})})(r);[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.3)})});
  }else{
    /* niente stacco: colpo, la band dietro il vetro che si riapre in tre battute, la pioggia digitale davanti, batteria uguale */
    C(28,function(w){FX.impact(w,B);FX.filt(w,520,9000,11.6*B,5)});C(40,function(w){FX.filt(w,9000,20000,.05)});
    drums(28,40,{sh:1});
    [['F',28,'F'],['G',32,'G'],['G',36,'G2']].forEach(function(x,i){var b=x[1],ch=x[0];bass(b,ch,.44);pad(b,ch,4,.38,900+i*400);riff(b,x[2],.2);arp(b,ch,.024+i*.004,1500+i*900,2600+i*1200,.125,39.5,1)});
    C(36,function(w){I.riser(w,4*B,.06)});[39,39.25,39.5,39.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-6,-9,-12,-15][i],.2)})});
  }
  /* 4 · le app */
  C(40,function(w){I.crash(w,.12);I.sub(w,.45)});
  var AP=[['AM','AM'],['G','G'],['F','F'],['G','G2'],['AM','AM'],['G','G']];drums(40,61);
  AP.forEach(function(x,i){var b=40+i*4;bass(b,x[0],.44,61.5);pad(b,x[0],4,.35,1500);if(i>=2)arp(b,x[0],.022,1600,1600,.25,61.5);if(b<60)riff(b,x[1],.21,i>=4?2800:2400)});
  /* la pizzeria si apre */
  pad(61.5,'G',2.5,.5,1500);arp(61.5,'G',.035,800,2400,.125,64);[63,63.25,63.5,63.75].forEach(function(b,i){C(b,function(w){JF.tom(w,[-5,-8,-11,-14][i],.28)})});
  /* 5 · Start service: il tema un'ottava sopra (ora è nel registro di prima); Service complete */
  C(64,function(w){I.crash(w,.1);I.sub(w,.38)});drums(64,68);bass(64,'F',.46,66);bass(66,'G',.46,68);pad(64,'F',2,.4);pad(66,'G',2,.4);
  riff(64,'F',.19,2800,12);
  for(var r2=0;r2<8;r2++)(function(r2){C(66+r2*.25,function(w){JF.gsnare(w,.05+r2*.025)})})(r2);
  C(68,function(w){I.crash(w,.16);I.sub(w,.48);I.stab(w,CH.F.concat([12,17]),.9,.5,3000)});
  drums(68,72);bass(68,'F',.46);pad(68,'F',4,.45,1800);arp(68,'F',.026,2000,2000,.25);
  MEL.done(C,B);
  /* 6 · finale */
  C(72,function(w){JF.strings(w,4*B,CH.AM,.45,1200);I.bass(w,-15,3*B,.15)});
  riff(72,'AM',.08,1100);
  C(76,function(w){var d=12*B;CH.F.forEach(function(n,i){[-9,9].forEach(function(dt){tone(w,{type:'sawtooth',f:nt(n),det:dt,d:d,v:.022,peak:.12,lp:1100,lp1:200,lpt:d,pan:(i%2?.35:-.35),to:'d',rev:.45})})});tone(w,{f:nt(-19),d:d*.8,v:.1,peak:.1,to:'d'})})}
MUS.j2=function(M,C0){musicJ2(M,C0,0)};MUS.j3=function(M,C0){musicJ2(M,C0,1)};SG.j2=SG.j3=1;
/* ---------- gli effetti, calcolati dal motore ---------- */
function build(M){var L=[],R=M.REAL,PR=M.PREr,OFF=M.OFF,RUN0=M.RUN0,STK0=M.STK0;
  function C(t,f){L.push({t:t,f:f})}
  function A(a,f){C(R(a),f)}function Ru(u,f){A(RUN0+u,f)}function Rv(v,f){A(STK0+v,f)}function R2(t2,f){A(t2+OFF,f)}
  function steps(a0,a1,fn,stepv,cb){var prev=Math.floor(fn(a0)/stepv);for(var a=a0;a<=a1;a+=.001){var c=Math.floor(fn(a)/stepv);if(c!==prev){cb(a,c);prev=c}}}
  /* apertura: la m cade e tocca terra; le parole si scrivono a tasti */
  A(.36,function(w){S.thud(w,.42)});
  for(var k=0;k<7;k++)(function(k){A(1.0+k*.07,function(w){S.key(w,.028,k+40,-.2+k*.1)})})(k);
  A(1.42,function(w){S.tick(w,.04)});
  A(2.04,function(w){S.click(w,.13,.5)});
  A(2.1,function(w){S.stretch(w,R(2.44)-R(2.1),.07)});
  A(2.62,function(w){S.wobble(w,.16)});
  A(3.24,function(w){S.key(w,.06,7,-.7);S.key(w+.035,.06,8,-.7)});A(3.52,function(w){S.tick(w,.03,-.7)});
  A(3.87,function(w){S.click(w,.15,-.1)});
  A(3.92,function(w){S.swell(w,R(4.36)-R(3.92)+.1,.1)});
  for(var c=0;c<12;c++){if(c===M.MAIN)continue;(function(c){var dx=(c%4)-(M.MAIN%4),dy=Math.floor(c/4)-Math.floor(M.MAIN/4),d=Math.hypot(dx,dy),a=4.62+d*.075+(c%3)*.02,xy=M.cellXY(c);
    A(a+.06,function(w){S.tap(w,.04,pan(xy[0]+180))});
    var d6=Math.hypot((c%4)-2,Math.floor(c/4)-1),fa=5.92+d6*.06;A(fa+.1,function(w){S.flick(w,.028,pan(xy[0]+180))})})(c)}
  A(5.8,function(w){S.click(w,.13,.2)});
  A(6.98,function(w){S.hit(w,.28)});
  /* Brand. Systems. Code. */
  for(var b=0;b<6;b++)(function(b){A(7.0+b*.05+.15,function(w){S.key(w,.05,b+60,-.35+b*.14)})})(b);
  A(8.15,function(w){S.click(w,.12,-.3)});
  steps(8.2,8.9,function(t){return 100+800*io3(P(t,8.2,8.9))},100,function(a,c){A(a,function(w){S.tick(w,.028,-.33+(c-1)*.09)})});
  for(var q=1;q<=4;q++)(function(q){A(9.05+.37*q/4.999,function(w){S.key(w,.09,q+80,-.3+q*.12)})})(q);
  A(9.46,function(w){S.tap(w,.1,.3)});
  /* Runtime */
  Ru(.14,function(w){S.glitch(w,R(RUN0+.48)-R(RUN0+.14),.05,3)});
  for(var j=1;j<=27;j++)(function(j){Ru(.8+.7*j/27,function(w){S.key(w,.022,j+100,-.6)})})(j);
  Ru(.58,function(w){S.rain(w,R(RUN0+2.75)-R(RUN0+.58),.022,11,34)});
  Ru(3.06,function(w){S.tap(w,.06)});
  /* la m che nasce dalla pioggia: scatti sparsi mentre i caratteri si fermano, poi un soffio quando diventa gialla (16:9 e verticale) */
  for(var mt=0;mt<16;mt++)(function(mt){Ru(.78+mt*.085+((mt*7)%5)*.012,function(w){S.tick(w,.014,-.45+((mt*5)%9)*.11)})})(mt);
  Ru(2.2,function(w){S.air(w,R(RUN0+2.58)-R(RUN0+2.2),1200,4200,.022,-.2,.2,.8)});Ru(2.6,function(w){S.tick(w,.03,0);S.tap(w,.035,0)});
  [[3.8,2600],[4.3,3000],[4.75,3500]].forEach(function(x,i){Ru(x[0],function(w){S.ripple(w,R(RUN0+x[0]+.62)-R(RUN0+x[0]),.07,x[1],i*17+5)})});
  if(M.V){
  /* verticale: portatile e telefono, il telefono viene davanti, multitasking, tre scorrimenti, la pizzeria */
  Rv(.28,function(w){S.tap(w,.05,.2)});
  Rv(.35,function(w){S.motor(w,R(STK0+1.55)-R(STK0+.35),.075,-.2,.1)});
  Rv(1.55,function(w){S.click(w,.11,.3)});
  Rv(1.64,function(w){S.air(w,R(STK0+2.05)-R(STK0+1.64),600,1600,.03,.3,0,.6)});
  Rv(2.08,function(w){S.tap(w,.04,0)});
  [[2.4,2.68,-.6],[3.3,3.58,-.6],[4.44,4.72,-.6]].forEach(function(x){Rv(x[0]-.02,function(w){S.click(w,.1,.3);S.air(w+.02,R(STK0+x[1])-R(STK0+x[0]),900,350,.035,.4,x[2],.3)})});
  Rv(3.0,function(w){S.tap(w,.07)});
  Rv(3.1,function(w){S.tick(w,.04,.25);S.tick(w+.06,.028,.25)});
  for(var e=0;e<4;e++)(function(e){Rv(3.72+e*.15+.05,function(w){S.tick(w,.035,.4)})})(e);
  [[3.62,4.28,.86,5200],[3.68,4.32,.78,4300],[3.74,4.36,.92,3600]].forEach(function(r,i){
    steps(STK0+r[0],STK0+r[1]+.01,function(t){return io3(P(t-STK0,r[0],r[1]))*r[2]},.045,function(a,c){A(a,function(w){noise(w,{f:r[3],q:4,d:.008,v:.03,pan:-.35+i*.05})})});
    Rv(r[1],function(w){S.tap(w,.045,-.3)})});
  [3.66,4.04,4.42].forEach(function(v){Rv(v,function(w){tone(w,{f:62,f1:46,gl:.07,d:.13,v:.11,lp:200});tone(w+.15,{f:58,f1:44,gl:.07,d:.11,v:.07,lp:200})})});
  Rv(5.08,function(w){S.tap(w,.07,-.2)});
  Rv(5.22,function(w){S.click(w,.12,0)});
  }else{
  /* le app: solo i gesti che contano */
  Rv(.98,function(w){S.tap(w,.07)});
  Rv(1.12,function(w){S.tick(w,.04,.25);S.tick(w+.06,.028,.25)});
  [[1.5,1.78,-.6],[3.22,3.5,.6],[4.44,4.72,-.6]].forEach(function(x){Rv(x[0],function(w){S.click(w,.12,.1);S.air(w+.02,R(STK0+x[1])-R(STK0+x[0]),900,350,.035,.1,x[2],.3)})});
  Rv(1.95,function(w){S.motor(w,R(STK0+3.05)-R(STK0+1.95),.075,-.45,-.1)});
  Rv(2.44,function(w){S.tap(w,.05,.4)});
  for(var e=0;e<4;e++)(function(e){Rv(3.66+e*.17+.05,function(w){S.tick(w,.035,.4)})})(e);
  /* palestra: gli anelli girano come una ghiera, uno scatto ogni pezzetto di giro; quando si fermano, un tocco morbido.
     Sotto, il battito che sale da 128 a 142 */
  [[3.55,4.25,.86,5200],[3.62,4.3,.78,4300],[3.7,4.32,.92,3600]].forEach(function(r,i){
    steps(STK0+r[0],STK0+r[1]+.01,function(t){return io3(P(t-STK0,r[0],r[1]))*r[2]},.045,function(a,c){A(a,function(w){noise(w,{f:r[3],q:4,d:.008,v:.03,pan:-.35+i*.05})})});
    Rv(r[1],function(w){S.tap(w,.045,-.3)})});
  [3.6,4.02,4.42].forEach(function(v){Rv(v,function(w){tone(w,{f:62,f1:46,gl:.07,d:.13,v:.11,lp:200});tone(w+.15,{f:58,f1:44,gl:.07,d:.11,v:.07,lp:200})})});
  Rv(5.08,function(w){S.tap(w,.07,-.2)});
  Rv(5.22,function(w){S.click(w,.12,-.4)});
  }
  /* start service */
  R2(10.3,function(w){S.click(w,.15,.4)});
  M.TB18.forEach(function(T){R2(10.45+T.ord*.055+.03,function(w){S.tap(w,.022,pan(120+T.x*1.36))})});
  var NF=[1760,2093,2349,2637];
  M.TB18.forEach(function(T,i){R2(10.45+T.ord*.055+.22,function(w){S.blip(w,NF[i%4],.022,pan(120+T.x*1.36))})});
  for(var ci=0;ci<8;ci++)(function(ci){var T=M.TB18[(ci*5+3)%18],a=10.45+T.ord*.055+.22+.35;R2(a,function(w){S.tick(w,.04,.3);S.blip(w+.01,NF[(ci+1)%4]*2,.014,.3)})})(ci);
  for(var kt=0;kt<6;kt++)(function(kt){R2(10.62+kt*.08,function(w){S.print(w,.045,.3)})})(kt);
  R2(11.98,function(w){S.tap(w,.06,.5)});
  /* finale */
  R2(12.42,function(w){S.whomp(w,.32)});
  /* il cerchio si richiude sul logo e torna il bianco: un respiro appena, poi un tocco piccolissimo quando si chiude */
  R2(14.6,function(w){var d=R(15.02+OFF)-R(14.6+OFF);S.air(w,d+.05,1400,4200,.02,0,0,.8);tone(w,{f:330,f1:494,gl:d,d:d+.05,v:.012,peak:.85,lp:1500,rev:.3})});
  R2(15.02,function(w){tone(w,{f:740,f1:560,gl:.04,d:.11,v:.022,lp:2600,rev:.25,echo:.2});tone(w,{f:130,f1:90,gl:.06,d:.14,v:.05,lp:300});noise(w,{f:5200,q:2,d:.01,v:.02})});
  if(!TRK)MUS[STYLE](M,C);
  L.sort(function(a,b){return a.t-b.t});return L}

/* ---------- riproduzione agganciata all'orologio dell'animazione ---------- */
function lat(){return (AC.outputLatency||AC.baseLatency||0)}
function seek(t){idx=0;while(idx<cues.length&&cues[idx].t<t-.02)idx++;if(AC&&bus)newBus()}
function startTrack(t,now,l){var s=AC.createBufferSource();s.buffer=TBUF;var g=AC.createGain();g.gain.value=TGAIN;s.connect(g);g.connect(bus.g);var o=TOFF+t+l;if(o<0)s.start(now-o,0);else if(o<TBUF.duration)s.start(now,o);bus.src=s}
function decode(){if(TRK&&!TBUF&&AC&&!decode.busy){decode.busy=1;var ab=TRK;AC.decodeAudioData(ab.slice(0),function(b){if(TRK===ab){TBUF=b;TGAIN=level(b)}decode.busy=0},function(){decode.busy=0})}}
/* porta ogni traccia allo stesso volume, sotto gli effetti */
function level(b){var d=b.getChannelData(0),s2=0,n=0;for(var i=0;i<d.length;i+=7){s2+=d[i]*d[i];n++}var r=Math.sqrt(s2/n)||.1;return Math.min(2,.033/r)}
function update(t,playing,speed){if(!on||!AC||!playing)return;speed=speed||1;var now=AC.currentTime,l=lat(),lim=t+LOOK*speed;
  if(TBUF&&!bus.src&&speed===1)startTrack(t,now,l);
  while(idx<cues.length&&cues[idx].t<lim){var c=cues[idx];if(c.t>=t-.04){try{c.f(Math.max(now,now+(c.t-t)/speed-l))}catch(e){}}idx++}}
return {
  init:function(M){cues=build(M)},
  style:function(x){STYLE=MUS[x]?x:'a'},
  /* una traccia vera al posto della musica sintetica: ArrayBuffer del file e da dove parte (secondi) */
  track:function(ab,off){TRK=ab;TOFF=off||0;TBUF=null;decode.busy=0;decode()},
  /* fine del film: la musica scende in 1,8 secondi */
  end:function(){if(AC&&bus){var n=AC.currentTime;bus.g.gain.cancelScheduledValues(n);bus.g.gain.setValueAtTime(bus.g.gain.value,n);bus.g.gain.linearRampToValueAtTime(0,n+1.8)}},cues:function(){return cues},S:S,
  enable:function(t){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return false;setup(new C())}if(AC.resume)AC.resume();on=true;decode();seek(t);return true},
  disable:function(){on=false;if(AC&&bus)newBus()},
  isOn:function(){return on},
  state:function(){return {track:!!TRK,ready:!!TBUF,playing:!!(bus&&bus.src)}},
  volume:function(v){vol=v;if(master)master.gain.setTargetAtTime(v*MK,AC.currentTime,.03)},
  seek:seek,update:update,
  /* tutta la colonna sonora fuori tempo reale: per controllarla e per il video dei social */
  offline:function(M,dur,sr,part){sr=sr||48000;var oc=new OfflineAudioContext(2,Math.ceil(sr*dur),sr);var keep=[AC,master,bus,NB,REV,DLY];setup(oc);
    if(part==='sfx')bus.mus.gain.value=0;if(part==='mus')bus.sfx.gain.value=0;
    var L=build(M);L.forEach(function(c){c.f(Math.max(0,c.t))});
    var go=function(){return oc.startRendering()};
    if(TRK&&part!=='sfx'){var tb=TRK;go=function(){return oc.decodeAudioData(tb.slice(0)).then(function(b){var s=oc.createBufferSource();s.buffer=b;var g=oc.createGain();g.gain.value=level(b);var e=M.DUR;g.gain.setValueAtTime(g.gain.value,e);g.gain.linearRampToValueAtTime(0,e+1.8);s.connect(g);g.connect(bus.g);s.start(Math.max(0,-TOFF),Math.max(0,TOFF));return oc.startRendering()})}}
    return go().then(function(b){AC=keep[0];master=keep[1];bus=keep[2];NB=keep[3];REV=keep[4];DLY=keep[5];return b})}
}})();
</script>
<script>/* ===== Mother Machine · player del film =====
   Un componente solo, da montare dove serve: MMFilm.mount(elemento). Disegna il film dal vivo (SVG e canvas),
   parte quando entra nello schermo, va una volta e si ferma sul logo. Capitoli, suono spento di default, volume.
   I tasti (spazio, M) funzionano solo quando il player ha il fuoco, così non rubano lo scorrimento della pagina. */
var MMFilm=(function(){
var CSS='.fm{--fc:#F4F2EC;--fi:#141413;--fm:#6B6A64;--fl:#D9D6CC;--ft:#FF5B3A;font-family:var(--fmf,"Hanken Grotesk",system-ui,sans-serif);color:var(--fi)}'+
'.fm-st{position:relative;aspect-ratio:16/9;background:var(--fc);overflow:hidden;outline:1px solid var(--fl)}'+
'.fm-gr{position:absolute;inset:0;pointer-events:none;z-index:2}'+
'.fm-ch{display:flex;gap:4px;margin-top:10px}'+
'.fm-sg{flex:1 1 0;min-width:0;background:none;border:0;padding:8px 0 0;cursor:pointer;text-align:left;color:var(--fm);font:500 11px/1.2 var(--fmm,"DM Mono",ui-monospace,monospace);letter-spacing:.08em;text-transform:uppercase;display:grid;gap:7px}'+
'.fm-sg i{display:block;height:3px;background:var(--fl);position:relative;overflow:hidden;transition:height .18s cubic-bezier(.33,1,.68,1)}'+
'.fm-sg b{position:absolute;inset:0 auto 0 0;width:0;background:var(--ft)}'+
'.fm-sg span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.fm-sg:hover i,.fm-sg:focus-visible i{height:6px}.fm-sg.on{color:var(--fi)}'+
'.fm button:focus-visible{outline:2px solid #2D46E0;outline-offset:3px}'+
'.fm-ct{display:flex;gap:10px;align-items:center;margin-top:14px;font:500 12px var(--fmm,"DM Mono",ui-monospace,monospace);letter-spacing:.06em;text-transform:uppercase}'+
'.fm-ct button{font:inherit;letter-spacing:inherit;text-transform:inherit;background:var(--fi);color:var(--fc);border:0;border-radius:999px;height:40px;padding:0 16px;cursor:pointer;display:inline-flex;align-items:center;gap:9px}'+
'.fm-ct .fm-ic{width:40px;padding:0;justify-content:center}'+
'.fm-ct .fm-sn{background:transparent;color:var(--fi);box-shadow:inset 0 0 0 1.5px var(--fi)}'+
'.fm-ct .fm-sn.live{background:var(--ft);box-shadow:none;color:var(--fi)}'+
'.fm-sn .fm-eq{display:none}.fm-sn.live .fm-eq{display:inline-flex}.fm-sn.live .fm-x{display:none}'+
'.fm-eq{gap:2px;align-items:flex-end;height:12px}.fm-eq u{width:2px;height:3px;background:currentColor;display:block}'+
'.live .fm-eq u{animation:fmeq .9s ease-in-out infinite alternate}.live .fm-eq u:nth-child(2){animation-delay:-.3s}.live .fm-eq u:nth-child(3){animation-delay:-.6s}'+
'@keyframes fmeq{to{height:12px}}'+
'.fm-ct input{width:110px;accent-color:var(--ft)}.fm-ct input[hidden]{display:none}'+
'.fm-ct .fm-sp{flex:1}.fm-tm{font-variant-numeric:tabular-nums;color:var(--fm)}'+
'.fm-sg em{font-style:normal}'+
'@media (max-width:600px){.fm-sg em{display:none}}'+
'@media (max-width:820px){.fm-sg span{font-size:10px;letter-spacing:.04em}.fm-tm{display:none}.fm-ct input{width:80px}}'+
'@media (prefers-reduced-motion:reduce){.live .fm-eq u{animation:none;height:8px}}';
var IC={play:'<svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1.5v13l12-6.5z" fill="currentColor"/></svg>',pause:'<svg width="14" height="16" viewBox="0 0 14 16"><rect x="1" y="1" width="4" height="14" rx="1" fill="currentColor"/><rect x="9" y="1" width="4" height="14" rx="1" fill="currentColor"/></svg>',again:'<svg width="16" height="16" viewBox="0 0 16 16"><path d="M13.5 8.5A5.5 5.5 0 1 1 8 3h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.5 0.5L12.5 3l-3 2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
function mount(root,opt){opt=opt||{};
  if(!document.getElementById('fm-css')){var s=document.createElement('style');s.id='fm-css';s.textContent=CSS;document.head.appendChild(s)}
  root.classList.add('fm');root.setAttribute('tabindex','-1');
  root.innerHTML='<div class="fm-st"><div class="fm-gr"></div></div><div class="fm-ch"></div>'+
    '<div class="fm-ct"><button class="fm-ic fm-pl" aria-label="Play"></button>'+
    '<button class="fm-sn" aria-pressed="false"><svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><path d="M1 4.5h3L8 1v12L4 9.5H1z" fill="currentColor"/><path class="fm-x" d="M11 5l4 4M15 5l-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span class="fm-eq" aria-hidden="true"><u></u><u></u><u></u></span><span class="fm-snl">Sound off</span></button>'+
    '<input class="fm-vol" type="range" min="0" max="100" value="70" aria-label="Volume" hidden><span class="fm-sp"></span><span class="fm-tm"></span></div>';
  function q(c){return root.querySelector(c)}
  var st=q('.fm-st'),A=MM.build(st,LG),DUR=MM.DUR,t=0,play=false,last=null,dirty=true,started=false,pl=q('.fm-pl'),sn=q('.fm-sn'),snl=q('.fm-snl'),vol=q('.fm-vol'),tm=q('.fm-tm'),ch=q('.fm-ch');
  /* grana */
  var c=document.createElement('canvas');c.width=c.height=220;var x=c.getContext('2d'),im=x.createImageData(220,220);
  for(var i=0;i<im.data.length;i+=4){im.data[i]=im.data[i+1]=im.data[i+2]=20;im.data[i+3]=Math.random()<.5?Math.random()*26|0:0}x.putImageData(im,0,0);q('.fm-gr').style.background='url('+c.toDataURL()+')';
  MMS.init(MM);
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(RM){t=DUR;started=true}
  var R=MM.REAL,O=MM.OFF,CH=[['01','Mark',0],['02','Type',R(6.42)],['03','Runtime',R(MM.RUN0)],['04','Apps',R(MM.STK0)],['05','Service',R(9.9+O)],['06','Sign-off',R(12.4+O)]];
  CH.forEach(function(cc,i){var e=CH[i+1]?CH[i+1][2]:DUR;cc.push(e);var b=document.createElement('button');b.className='fm-sg';b.style.flexGrow=(e-cc[2]).toFixed(3);b.innerHTML='<i><b></b></i><span>'+cc[0]+'<em> '+cc[1]+'</em></span>';b.setAttribute('aria-label','Chapter '+cc[0]+', '+cc[1]);
    b.onclick=function(ev){var r=b.getBoundingClientRect(),onTrack=ev.detail&&ev.clientY-r.top<13,k=onTrack?Math.max(0,Math.min(1,(ev.clientX-r.left)/r.width)):0;seek(cc[2]+(e-cc[2])*k,true)};ch.appendChild(b);cc.el=b;cc.fill=b.querySelector('b')});
  function label(){var k=t>=DUR?'again':play?'pause':'play';if(pl._k!==k){pl._k=k;pl.innerHTML=IC[k];pl.setAttribute('aria-label',k==='again'?'Replay':k==='pause'?'Pause':'Play')}}
  function draw(){var xx=Math.min(t,DUR);MM.render(A,xx);tm.textContent=xx.toFixed(1)+' / '+DUR.toFixed(1);
    CH.forEach(function(cc){var p=Math.max(0,Math.min(1,(xx-cc[2])/(cc[3]-cc[2])));cc.fill.style.width=(p*100).toFixed(2)+'%';cc.el.classList.toggle('on',xx>=cc[2]&&xx<cc[3]+(cc[3]>=DUR?1:0))});dirty=false}
  function seek(v,go){t=Math.max(0,Math.min(DUR,v));started=true;if(go)play=t<DUR;MMS.seek(t);dirty=true;label()}
  function loop(ts){if(last!==null&&play){t+=(ts-last)/1000;if(t>=DUR){t=DUR;play=false;label();MMS.end()}dirty=true;MMS.update(t,play,1)}last=ts;if(dirty)draw();requestAnimationFrame(loop)}
  pl.onclick=function(){if(t>=DUR)seek(0,true);else{play=!play;started=true;MMS.seek(t);dirty=true;label()}};
  sn.onclick=function(){if(MMS.isOn()){MMS.disable();sn.classList.remove('live');snl.textContent='Sound off';sn.setAttribute('aria-pressed','false');vol.hidden=true;return}
    if(!MMS.enable(t))return;sn.classList.add('live');snl.textContent='Sound on';sn.setAttribute('aria-pressed','true');vol.hidden=false;
    if(!sn._first){sn._first=1;seek(0,true)}else if(t>=DUR)seek(0,true);else{if(!play){play=true;label()}MMS.seek(t)}};
  vol.oninput=function(){MMS.volume(vol.value/100)};
  root.addEventListener('keydown',function(e){if(e.target&&e.target.tagName==='INPUT')return;if(e.code==='Space'&&e.target===root){e.preventDefault();pl.click()}if(e.key==='m'||e.key==='M')sn.click()});
  st.addEventListener('click',function(){root.focus({preventScroll:true});pl.click()});
  document.addEventListener('visibilitychange',function(){if(document.hidden&&play){play=false;MMS.seek(t);label()}});
  if('IntersectionObserver' in window){var auto=false;new IntersectionObserver(function(e){var v=e[0].isIntersecting;if(v&&!started){started=true;play=true;label()}else if(v&&auto){auto=false;play=true;MMS.seek(t);label()}else if(!v&&play&&opt.pauseOutside!==false){play=false;auto=true;MMS.seek(t);label()}},{threshold:.4}).observe(st)}else{started=true;play=true}
  label();draw();requestAnimationFrame(loop);
  return {seek:function(v){t=v;play=false;draw()},dur:DUR}}
return {mount:mount}})();
</script>
<script>(function(){var el=document.getElementById('mmfilm');if(!el)return;var done=false;function go(){if(done)return;done=true;MMFilm.mount(el)}
var F=document.fonts;if(F&&F.load)Promise.all(['700 100px "Hanken"','100 100px "Hanken"','400 20px "DMMono"','500 20px "DMMono"'].map(function(x){return F.load(x)})).then(go,go);setTimeout(go,2500);if(!F)go()})();</script>

