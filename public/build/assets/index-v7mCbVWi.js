import{L as O}from"./main-BZMVmuB9.js";import{P as A}from"./page-header-CWp0LBfO.js";import{S,h as V}from"./swiper-BfXv2vbg.js";import{A as R}from"./autoplay-ojOLjLUg.js";import E from"./portfolio-BGlh02ce.js";import G from"./market-graph-DcvGT4jy.js";import H from"./news-CG1kG5k2.js";import M from"./recent-activity-DSFrbdY0.js";import z from"./top-performers-B6zKUAYU.js";import W from"./currencies-C6MTG-dA.js";import j from"./trading-uE-yK4sJ.js";import{_ as q}from"./btc-B5FWdm-f.js";import{_ as J}from"./ltc-Cy5Ela39.js";import{_ as K}from"./eth-z8T8Pqxe.js";import{_ as Q}from"./bnb-CRV-P0nW.js";import{_ as U}from"./dash-AnerGkxt.js";import{_ as X}from"./usdt-BqrYWmT7.js";import{_ as Y}from"./neo-Co5pxp6w.js";import{_ as Z}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{r as s,c as p,w as t,o as c,a as e,d as b,g as y,f as o,n as m,t as n,h as d,F as w}from"./app-BWABJYdq.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-dark-BbIT5rJd.js";import"./logo-light-BfYujB8V.js";import"./getChartColorsArray-DXKIp7ac.js";import"./img-1-DTaidu05.js";import"./img-2-CEPKryFh.js";import"./img-3-DK__eNi3.js";import"./img-6-B3jhxWU1.js";import"./vue-feather-icons.es-DhCg6NIe.js";import"./aave-DEriFJUW.js";import"./doge-DT2X2tI0.js";const ee={data(){return{chartcolors:{colors:["#f17171"]},cyptoWidgets:[{id:1,icon:"ri-money-dollar-circle-fill",label:"Total Invested",counter:"2390.68",badge:"ri-arrow-up-s-fill",badgeColor:"primary",percentage:"6.24"},{id:2,icon:"ri-arrow-up-circle-fill",label:"Total Change",counter:"19523.25",badge:"ri-arrow-up-s-fill",badgeColor:"secondary",percentage:"3.67"},{id:3,icon:"ri-arrow-down-circle-fill",label:"Day Change",counter:"14799.44",badge:"ri-arrow-down-s-fill",badgeColor:"success",percentage:"4.80"}],cryptoSlider:[{id:1,img:q,label:"Bitcoin",price:"$1,523,647",change:"+13.11%",changeClass:"success",coinName:"btc",chartsColor:"#0ab39c",chartOptions:{chart:{width:"100%",height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#3cd188"]},series:[{name:"Bitcoin",data:[85,68,35,90,8,11,26,54]}]},{id:2,img:J,label:"Litecoin",price:"$2,145,687",change:"+15.08%",changeClass:"success",coinName:"ltc",chartsColor:"#0ab39c",chartOptions:{chart:{width:"100%",height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#3cd188"]},series:[{name:"Litecoin",data:[25,50,41,87,12,36,9,54]}]},{id:3,img:K,label:"Ethereum",price:"$3,312,870",change:"+08.57%",changeClass:"success",coinName:"etc",chartsColor:"#0ab39c",chartOptions:{chart:{width:"100%",height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#3cd188"]},series:[{name:"Ethereum",data:[36,21,65,22,35,50,29,44]}]},{id:4,img:Q,label:"Binance",price:"$1,820,045",change:"-09.21%",changeClass:"danger",coinName:"bnb",chartsColor:"#F06548",chartOptions:{chart:{width:"100%",height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#F06548"]},series:[{name:"Binance",data:[30,58,29,89,12,36,9,54]}]},{id:5,img:U,label:"Dash",price:"$9,458,153",change:"+12.07%",changeClass:"success",coinName:"dash",chartsColor:"#0ab39c",chartOptions:{chart:{width:"100%",height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#3cd188"]},series:[{name:"Dash",data:[24,68,39,86,29,42,11,58]}]},{id:6,img:X,label:"Tether",price:"$5,201,458",change:"+14.99%",changeClass:"success",coinName:"usdt",chartsColor:"#0ab39c",chartOptions:{chart:{width:"100%",height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#3cd188"]},series:[{name:"Dash",data:[13,76,12,85,25,60,9,54]}]},{id:7,img:Y,label:"NEO",price:"$6,147,957",change:"-05.07%",changeClass:"danger",coinName:"neo",chartsColor:"#F06548",chartOptions:{chart:{width:"100%",height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#F06548"]},series:[{name:"Neo",data:[9,66,41,89,12,36,25,54]}]}],chartOptions:{chart:{width:130,height:46,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#67b173"]},Autoplay:R}},components:{Layout:O,PageHeader:A,Portfolio:E,MarketGraph:G,RecentActivity:M,TopProgram:z,News:H,Currencies:W,Trading:j,Swiper:S,SwiperSlide:V}},te={class:"d-flex align-items-center"},oe={class:"avatar-sm flex-shrink-0"},ae={class:"flex-grow-1 ms-3"},se={class:"text-uppercase fw-semibold fs-12 text-muted mb-1"},re={class:"mb-0"},le={class:"counter-value"},ie={class:"flex-shrink-0 align-self-end"},ne={class:"float-end"},ce={class:"d-flex align-items-center"},de=["src"],pe={class:"ms-2 mb-0 fs-14"},me={class:"mb-1 mt-4"},he={class:"text-success fs-13 fw-medium mb-0"},fe={class:"text-muted ms-2 fs-10 text-uppercase"};function ue(_e,l,ge,be,h,ye){const x=s("PageHeader"),C=s("Portfolio"),r=s("BCol"),u=s("BCardBody"),_=s("BCard"),i=s("BRow"),v=s("MarketGraph"),g=s("BDropdownItem"),k=s("BDropdown"),B=s("apexchart"),T=s("swiper-slide"),N=s("swiper"),L=s("Currencies"),P=s("Trading"),F=s("RecentActivity"),I=s("TopProgram"),$=s("News"),D=s("Layout");return c(),p(D,null,{default:t(()=>[e(x,{title:"Crypto",pageTitle:"Dashboards"}),e(i,null,{default:t(()=>[e(r,{xxl:"3"},{default:t(()=>[e(C)]),_:1}),e(r,{xxl:"9","order-xxl":"0",class:"order-first"},{default:t(()=>[e(i,null,{default:t(()=>[(c(!0),b(w,null,y(h.cyptoWidgets,(a,f)=>(c(),p(r,{lg:"4",md:"6",key:f},{default:t(()=>[e(_,{"no-body":""},{default:t(()=>[e(u,null,{default:t(()=>[o("div",te,[o("div",oe,[o("span",{class:m(`avatar-title bg-light text-${a.badgeColor} rounded-circle fs-3`)},[o("i",{class:m(`${a.icon} align-middle`)},null,2)],2)]),o("div",ae,[o("p",se,n(a.label),1),o("h4",re,[l[0]||(l[0]=d(" $ ")),o("span",le,n(a.counter),1)])]),o("div",ie,[o("span",{class:m({"badge bg-success-subtle text-success":a.badge=="ri-arrow-up-s-fill","badge bg-danger-subtle text-danger":a.badge=="ri-arrow-down-s-fill"})},[o("i",{class:m(`${a.badge} align-middle me-1`)},null,2),d(" "+n(a.percentage)+" %",1)],2)])])]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1}),e(i,null,{default:t(()=>[e(r,{xl:"12"},{default:t(()=>[e(v)]),_:1})]),_:1})]),_:1})]),_:1}),e(i,null,{default:t(()=>[e(r,{lg:"12"},{default:t(()=>[e(N,{class:"cryptoSlider",slidesPerView:1,loop:!1,spaceBetween:24,modules:[h.Autoplay],autoplay:{delay:2500,disableOnInteraction:!1},breakpoints:{640:{slidesPerView:2},768:{slidesPerView:2.5},1024:{slidesPerView:3},1200:{slidesPerView:5}}},{default:t(()=>[(c(!0),b(w,null,y(h.cryptoSlider,(a,f)=>(c(),p(T,{key:f},{default:t(()=>[e(_,{"no-body":""},{default:t(()=>[e(u,null,{default:t(()=>[o("div",ne,[e(k,{variant:"link",class:"card-header-dropdown","toggle-class":"text-reset p-0 arrow-none","menu-class":"dropdown-menu-end","aria-haspopup":"true",offset:{alignmentAxis:-110,crossAxis:0,mainAxis:0}},{"button-content":t(()=>l[1]||(l[1]=[o("span",{class:"text-muted fs-18"},[o("i",{class:"mdi mdi-dots-horizontal"})],-1)])),default:t(()=>[e(g,null,{default:t(()=>l[2]||(l[2]=[d("Details")])),_:1}),e(g,null,{default:t(()=>l[3]||(l[3]=[d("Cancel")])),_:1})]),_:1})]),o("div",ce,[o("img",{src:a.img,class:"bg-light rounded-circle p-1 avatar-xs img-fluid",alt:""},null,8,de),o("h6",pe,n(a.label),1)]),e(i,{class:"align-items-end g-0"},{default:t(()=>[e(r,{cols:"6"},{default:t(()=>[o("h5",me,n(a.price),1),o("p",he,[d(n(a.change)+" ",1),o("span",fe,"("+n(a.coinName)+")",1)])]),_:2},1024),e(r,{cols:"6"},{default:t(()=>[(c(),p(B,{class:"apex-charts",options:a.chartOptions,height:"50",dir:"ltr",series:a.series.length>0?a.series:[],key:a.id},null,8,["options","series"]))]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1},8,["modules"])]),_:1})]),_:1}),e(i,null,{default:t(()=>[e(r,{xl:"8"},{default:t(()=>[e(L)]),_:1}),e(r,{xl:"4"},{default:t(()=>[e(P)]),_:1})]),_:1}),e(i,null,{default:t(()=>[e(r,{xxl:"4",lg:"6"},{default:t(()=>[e(F)]),_:1}),e(r,{xxl:"4",lg:"6"},{default:t(()=>[e(I)]),_:1}),e(r,{xxl:"4",lg:"6"},{default:t(()=>[e($)]),_:1})]),_:1})]),_:1})}const ot=Z(ee,[["render",ue]]);export{ot as default};
