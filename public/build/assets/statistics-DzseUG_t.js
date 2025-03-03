import{L as _}from"./main-BZMVmuB9.js";import{P as k}from"./page-header-CWp0LBfO.js";import{U as B}from"./vue-feather-icons.es-DhCg6NIe.js";import{g as u}from"./getChartColorsArray-DXKIp7ac.js";import{_ as z}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{r as n,c as C,w as l,o as A,a as e,f as t,h as o}from"./app-BWABJYdq.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-dark-BbIT5rJd.js";import"./logo-light-BfYujB8V.js";const L={setup(){return{jobsummarychartseries:[{name:"Application Sent  ",data:[33,28,30,35,40,55,70,110,150,180,210,250]},{name:" Interviews",data:[20,26,45,32,42,53,59,70,78,97,110,125]},{name:" Hired",data:[12,17,45,42,24,35,42,75,102,108,156,199]},{name:" Rejected",data:[8,13,22,27,32,34,46,59,65,97,100,110]}],jobsummarychartchartOptions:{chart:{height:320,type:"area",toolbar:"false"},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2},xaxis:{categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},colors:u('["--vz-success","--vz-primary", "--vz-info", "--vz-danger"]'),fill:{opacity:.06,colors:u('["--vz-success","--vz-primary", "--vz-info", "--vz-danger"]'),type:"solid"}},yournetworkchartseries:[{name:"Following",data:[80,50,30,40,100,20]},{name:"Followers",data:[20,30,40,80,20,80]}],yournetworkchartchartOptions:{chart:{height:341,type:"radar",dropShadow:{enabled:!0,blur:1,left:1,top:1},toolbar:{show:!1}},stroke:{width:2},fill:{opacity:.2},legend:{show:!0,fontWeight:500,offsetX:0,offsetY:-8,markers:{width:8,height:8,radius:6},itemMargin:{horizontal:10,vertical:0}},markers:{size:0},colors:u('["--vz-primary", "--vz-secondary"]'),xaxis:{categories:["2016","2017","2018","2019","2020","2021"]}},userbydeviceseries:[78.56,105.02,42.89],userbydevicechartOptions:{labels:["Desktop","Mobile","Tablet"],chart:{type:"donut",height:219},plotOptions:{pie:{size:100,donut:{size:"76%"}}},dataLabels:{enabled:!1},legend:{show:!1,position:"bottom",horizontalAlign:"center",offsetX:0,offsetY:0,markers:{width:20,height:6,radius:2},itemMargin:{horizontal:12,vertical:0}},stroke:{width:0},yaxis:{labels:{formatter:function(y){return y+"k Users"}},tickAmount:4,min:0},colors:u('["--vz-primary", "--vz-secondary", "--vz-success"]')},visitorgraphseries:[{data:[{x:"USA",y:321},{x:"Russia",y:165},{x:"India",y:184},{x:"China",y:98},{x:"Canada",y:84},{x:"Brazil",y:31},{x:"UK",y:70},{x:"Australia",y:30},{x:"Germany",y:44},{x:"Italy",y:68},{x:"Israel",y:28},{x:"Indonesia",y:19},{x:"Bangladesh",y:29}]}],visitorgraphchartOptions:{legend:{show:!1},chart:{height:350,type:"treemap",toolbar:{show:!1}},title:{text:"Visitors Location",align:"center",style:{fontWeight:500}},colors:u('["--vz-primary", "--vz-primary-rgb, 0.65", "--vz-secondary", "--vz-secondary-rgb, 0.75","--vz-primary-rgb, 0.4", "--vz-success"]'),plotOptions:{treemap:{distributed:!0,enableShades:!1}}},chartcolors:{colors:["#f7666e"]},chartoptions:{chart:{width:140,type:"area",sparkline:{enabled:!0},toolbar:{show:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:1.5},fill:{type:"gradient",gradient:{shadeIntensity:1,inverseColors:!1,opacityFrom:.45,opacityTo:.05,stops:[50,100,100,100]}},colors:["#3cd188"]}}},components:{Layout:_,PageHeader:k,UsersIcon:B}},I={class:"d-flex"},M={class:"flex-grow-1 p-3"},O={class:"mb-0 text-muted"},S={class:"d-flex"},T={class:"flex-grow-1 p-3"},U={class:"mb-0 text-muted"},R={class:"d-flex"},D={class:"flex-grow-1 p-3"},Y={class:"mb-0 text-muted"},H={class:"d-flex"},W={class:"flex-grow-1 p-3"},j={class:"mb-0 text-muted"},J={class:"d-flex"},N={class:"flex-shrink-0"},V={class:"flex-shrink-0"},F={class:"table-responsive mt-3"},P={class:"table table-borderless table-sm table-centered align-middle table-nowrap mb-0"},G={class:"border-0"},X={class:"text-muted mb-0"},K={class:"text-muted mb-0"},q={class:"text-muted mb-0"},E={class:"flex-shrink-0"},Q={class:"flex-shrink-0"};function Z(y,s,$,r,ss,ts){const w=n("PageHeader"),p=n("BBadge"),i=n("apexchart"),d=n("BCard"),m=n("BCol"),g=n("BRow"),a=n("BDropdownItem"),f=n("BDropdown"),c=n("BCardHeader"),x=n("BCardBody"),b=n("BCardTitle"),h=n("UsersIcon"),v=n("Layout");return A(),C(v,null,{default:l(()=>[e(w,{title:"Statistics",pageTitle:"Jobs"}),e(g,null,{default:l(()=>[e(m,{xl:"3",md:"6"},{default:l(()=>[e(d,{"no-body":"",class:"card-height-100"},{default:l(()=>[t("div",I,[t("div",M,[s[2]||(s[2]=t("h5",{class:"mb-3"},"Application",-1)),t("p",O,[e(p,{class:"bg-light text-success mb-0"},{default:l(()=>s[0]||(s[0]=[t("i",{class:"ri-arrow-up-line align-middle"},null,-1),o(" 16.24 % ")])),_:1}),s[1]||(s[1]=o(" vs. previous month "))])]),t("div",null,[e(i,{class:"apex-charts",width:"140px",height:"90px",dir:"ltr",series:[{name:"Results",data:[0,110,95,75,120]}],options:{...r.chartoptions}},null,8,["options"])])])]),_:1})]),_:1}),e(m,{xl:"3",md:"6"},{default:l(()=>[e(d,{"no-body":"",class:"card-height-100"},{default:l(()=>[t("div",S,[t("div",T,[s[5]||(s[5]=t("h5",{class:"mb-3"},"Interviewed",-1)),t("p",U,[e(p,{class:"bg-light text-success mb-0"},{default:l(()=>s[3]||(s[3]=[t("i",{class:"ri-arrow-up-line align-middle"},null,-1),o(" 34.24 % ")])),_:1}),s[4]||(s[4]=o(" vs. previous month "))])]),t("div",null,[e(i,{class:"apex-charts",width:"140px",height:"90px",dir:"ltr",series:[{name:"Results",data:[0,68,35,90,99]}],options:{...r.chartoptions}},null,8,["options"])])])]),_:1})]),_:1}),e(m,{xl:"3",md:"6"},{default:l(()=>[e(d,{"no-body":"",class:"card-height-100"},{default:l(()=>[t("div",R,[t("div",D,[s[8]||(s[8]=t("h5",{class:"mb-3"},"Hired",-1)),t("p",Y,[e(p,{class:"bg-light text-success mb-0"},{default:l(()=>s[6]||(s[6]=[t("i",{class:"ri-arrow-up-line align-middle"},null,-1),o(" 6.67 % ")])),_:1}),s[7]||(s[7]=o(" vs. previous month "))])]),t("div",null,[e(i,{class:"apex-charts",width:"140px",height:"90px",dir:"ltr",series:[{name:"Results",data:[0,36,110,95,130]}],options:{...r.chartoptions}},null,8,["options"])])])]),_:1})]),_:1}),e(m,{xl:"3",md:"6"},{default:l(()=>[e(d,{"no-body":"",class:"card-height-100"},{default:l(()=>[t("div",H,[t("div",W,[s[11]||(s[11]=t("h5",{class:"mb-3"},"Rejected",-1)),t("p",j,[e(p,{class:"bg-light text-danger mb-0"},{default:l(()=>s[9]||(s[9]=[t("i",{class:"ri-arrow-down-line align-middle"},null,-1),o(" 3.24 % ")])),_:1}),s[10]||(s[10]=o(" vs. previous month "))])]),t("div",null,[e(i,{class:"apex-charts",width:"140px",height:"90px",dir:"ltr",series:[{name:"Results",data:[0,98,85,90,67]}],options:{...r.chartoptions,...r.chartcolors}},null,8,["options"])])])]),_:1})]),_:1})]),_:1}),e(g,null,{default:l(()=>[e(m,{xl:"8"},{default:l(()=>[e(d,{"no-body":""},{default:l(()=>[e(c,null,{default:l(()=>[t("div",J,[s[17]||(s[17]=t("h5",{class:"card-title mb-0 flex-grow-1"},"Visitor Graph",-1)),t("div",N,[e(f,{variant:"link",class:"card-header-dropdown","toggle-class":"my-n3 text-reset dropdown-btn arrow-none","menu-class":"dropdown-menu-end","aria-haspopup":"true",offset:{alignmentAxis:2,crossAxis:0,mainAxis:0}},{"button-content":l(()=>s[12]||(s[12]=[t("span",{class:"fw-semibold text-uppercase fs-12"},"Sort by: ",-1),t("span",{class:"text-muted"},[o("Current Week"),t("i",{class:"mdi mdi-chevron-down ms-1"})],-1)])),default:l(()=>[e(a,null,{default:l(()=>s[13]||(s[13]=[o("Today")])),_:1}),e(a,null,{default:l(()=>s[14]||(s[14]=[o("Last Week")])),_:1}),e(a,null,{default:l(()=>s[15]||(s[15]=[o("Last Month")])),_:1}),e(a,null,{default:l(()=>s[16]||(s[16]=[o("Current Year")])),_:1})]),_:1})])])]),_:1}),e(x,null,{default:l(()=>[e(i,{class:"apex-charts",dir:"ltr",height:"350",series:r.visitorgraphseries,options:r.visitorgraphchartOptions},null,8,["series","options"])]),_:1})]),_:1})]),_:1}),e(m,{xl:"4"},{default:l(()=>[e(d,{"no-body":"",class:"card-height-100"},{default:l(()=>[e(c,{class:"align-items-center d-flex"},{default:l(()=>[e(b,{class:"mb-0 flex-grow-1"},{default:l(()=>s[18]||(s[18]=[o("Users by Device")])),_:1}),t("div",V,[e(f,{variant:"link",class:"card-header-dropdown","toggle-class":"my-n3 text-reset dropdown-btn arrow-none","menu-class":"dropdown-menu-end","aria-haspopup":"true",offset:{alignmentAxis:2,crossAxis:0,mainAxis:0}},{"button-content":l(()=>s[19]||(s[19]=[t("span",{class:"text-muted fs-16"},[t("i",{class:"mdi mdi-dots-vertical align-middle"})],-1)])),default:l(()=>[e(a,null,{default:l(()=>s[20]||(s[20]=[o("Today")])),_:1}),e(a,null,{default:l(()=>s[21]||(s[21]=[o("Last Week")])),_:1}),e(a,null,{default:l(()=>s[22]||(s[22]=[o("Last Month")])),_:1}),e(a,null,{default:l(()=>s[23]||(s[23]=[o("Current Year")])),_:1})]),_:1})])]),_:1}),e(x,null,{default:l(()=>[e(i,{class:"apex-charts",dir:"ltr",height:"219",series:r.userbydeviceseries,options:r.userbydevicechartOptions},null,8,["series","options"]),t("div",F,[t("table",P,[t("tbody",G,[t("tr",null,[s[25]||(s[25]=t("td",null,[t("h4",{class:"text-truncate fs-14 fs-medium mb-0"},[t("i",{class:"ri-stop-fill align-middle fs-18 text-primary me-2"}),o("Desktop Users")])],-1)),t("td",null,[t("p",X,[e(h,{width:"24",height:"24",class:"me-2 icon-sm"}),s[24]||(s[24]=o("78.56k "))])]),s[26]||(s[26]=t("td",{class:"text-end"},[t("p",{class:"text-success fw-medium fs-12 mb-0"},[t("i",{class:"ri-arrow-up-s-fill fs-5 align-middle"}),o("2.08% ")])],-1))]),t("tr",null,[s[28]||(s[28]=t("td",null,[t("h4",{class:"text-truncate fs-14 fs-medium mb-0"},[t("i",{class:"ri-stop-fill align-middle fs-18 text-warning me-2"}),o("Mobile Users")])],-1)),t("td",null,[t("p",K,[e(h,{width:"24",height:"24",class:"me-2 icon-sm"}),s[27]||(s[27]=o("105.02k "))])]),s[29]||(s[29]=t("td",{class:"text-end"},[t("p",{class:"text-danger fw-medium fs-12 mb-0"},[t("i",{class:"ri-arrow-down-s-fill fs-5 align-middle"}),o("10.52% ")])],-1))]),t("tr",null,[s[31]||(s[31]=t("td",null,[t("h4",{class:"text-truncate fs-14 fs-medium mb-0"},[t("i",{class:"ri-stop-fill align-middle fs-18 text-info me-2"}),o("Tablet Users")])],-1)),t("td",null,[t("p",q,[e(h,{width:"24",height:"24",class:"me-2 icon-sm"}),s[30]||(s[30]=o("42.89k "))])]),s[32]||(s[32]=t("td",{class:"text-end"},[t("p",{class:"text-danger fw-medium fs-12 mb-0"},[t("i",{class:"ri-arrow-down-s-fill fs-5 align-middle"}),o("7.36% ")])],-1))])])])])]),_:1})]),_:1})]),_:1})]),_:1}),e(g,null,{default:l(()=>[e(m,{xxl:"4",md:"6"},{default:l(()=>[e(d,{"no-body":"",class:"card-height-100"},{default:l(()=>[e(c,{class:"align-items-center d-flex"},{default:l(()=>[e(b,{class:"mb-0 flex-grow-1"},{default:l(()=>s[33]||(s[33]=[o("Your Network Summary")])),_:1}),t("div",E,[e(f,{variant:"link",class:"card-header-dropdown","toggle-class":"my-n3 text-reset dropdown-btn arrow-none","menu-class":"dropdown-menu-end","aria-haspopup":"true",offset:{alignmentAxis:-45,crossAxis:0,mainAxis:0}},{"button-content":l(()=>s[34]||(s[34]=[t("span",{class:"fw-semibold text-uppercase fs-12"},"Sort by: ",-1),t("span",{class:"text-muted"},[o("Monthly"),t("i",{class:"mdi mdi-chevron-down ms-1"})],-1)])),default:l(()=>[e(a,null,{default:l(()=>s[35]||(s[35]=[o("Today")])),_:1}),e(a,null,{default:l(()=>s[36]||(s[36]=[o("Weekly")])),_:1}),e(a,null,{default:l(()=>s[37]||(s[37]=[o("Monthly")])),_:1}),e(a,null,{default:l(()=>s[38]||(s[38]=[o("Yearly")])),_:1})]),_:1})])]),_:1}),e(x,{class:"pb-0"},{default:l(()=>[e(i,{class:"apex-charts",dir:"ltr",height:"341",series:r.yournetworkchartseries,options:r.yournetworkchartchartOptions},null,8,["series","options"])]),_:1})]),_:1})]),_:1}),e(m,{xxl:"8",md:"6"},{default:l(()=>[e(d,{"no-body":"",class:"card-height-100"},{default:l(()=>[e(c,{class:"align-items-center d-flex"},{default:l(()=>[e(b,{class:"mb-0 flex-grow-1"},{default:l(()=>s[39]||(s[39]=[o("Jobs Summary")])),_:1}),t("div",Q,[e(f,{variant:"link",class:"card-header-dropdown","toggle-class":"my-n3 text-reset dropdown-btn arrow-none","menu-class":"dropdown-menu-end","aria-haspopup":"true",offset:{alignmentAxis:-45,crossAxis:0,mainAxis:0}},{"button-content":l(()=>s[40]||(s[40]=[t("span",{class:"fw-semibold text-uppercase fs-12"},"Sort by: ",-1),t("span",{class:"text-muted"},[o("Current Year"),t("i",{class:"mdi mdi-chevron-down ms-1"})],-1)])),default:l(()=>[e(a,null,{default:l(()=>s[41]||(s[41]=[o("Today")])),_:1}),e(a,null,{default:l(()=>s[42]||(s[42]=[o("Last Week")])),_:1}),e(a,null,{default:l(()=>s[43]||(s[43]=[o("Last Month")])),_:1}),e(a,null,{default:l(()=>s[44]||(s[44]=[o("Current Year")])),_:1})]),_:1})])]),_:1}),e(x,{class:"px-0"},{default:l(()=>[e(i,{class:"apex-charts",height:"320",dir:"ltr",series:r.jobsummarychartseries,options:r.jobsummarychartchartOptions},null,8,["series","options"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const gs=z(L,[["render",Z]]);export{gs as default};
