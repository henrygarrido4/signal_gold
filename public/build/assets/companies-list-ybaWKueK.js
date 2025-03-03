import{Z as H,j,r,c as x,w as s,o as u,a as o,f as e,h as d,d as y,g as L,t as c,F as C,n as M,e as F}from"./app-BWABJYdq.js";import{L as V}from"./main-BZMVmuB9.js";import{P as I}from"./page-header-CWp0LBfO.js";import{_ as D}from"./img-6-B7vc9TX1.js";import{d as A}from"./Jobs-5SzywK7I.js";import{C as E}from"./component-GK_D4hhz.js";/* empty css                  */import{_ as Q}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-dark-BbIT5rJd.js";import"./logo-light-BfYujB8V.js";import"./img-2-CEPKryFh.js";import"./img-4-BivurQMA.js";import"./img-7-BBkb8MrE.js";import"./img-3-DK__eNi3.js";import"./img-8-DlaxalRz.js";import"./img-2-Bb_SM_Y-.js";import"./img-3-DN-aBxcI.js";import"./img-4-hJ5AbXP7.js";import"./img-5-CP8-kZKO.js";import"./img-7-D2rbWVuw.js";import"./img-8-DLGGuBFI.js";import"./img-9-BD3stA9k.js";import"./avatar-1-oDBKIU2x.js";import"./avatar-4-rms8IJmS.js";import"./avatar-6-B0PpuAZw.js";import"./avatar-7-S7rLa7v8.js";import"./avatar-8-CIXqINoD.js";import"./avatar-9-D3UczYci.js";import"./avatar-10-Jege67Fs.js";import"./slack-C6SAzQvz.js";import"./mail_chimp-vhUQF1s3.js";import"./dropbox-BmMzeTl5.js";import"./dribbble-C2G5gHsC.js";const z={data(){return{page:1,perPage:16,pages:[],companies:A,defaultDateConfig:{dateFormat:"d M, Y",defaultDate:"04 Sep, 2023"}}},computed:{displayedPosts(){return this.paginate(this.companies)},resultQuery(){if(this.searchQuery){const i=this.searchQuery.toLowerCase();return this.displayedPosts.filter(t=>t.name.toLowerCase().includes(i)||t.industry_type.toLowerCase().includes(i)||t.vacancy.toLowerCase().includes(i)||t.since.toLowerCase().includes(i)||t.rating.toLowerCase().includes(i)||t.location.toLowerCase().includes(i))}else return this.displayedPosts}},watch:{companies(){this.setPages()}},created(){this.setPages()},mounted(){document.querySelectorAll(".custom-toggle").forEach(i=>{i.addEventListener("click",function(){i.classList.contains("active")?i.classList.remove("active"):i.classList.add("active")})})},methods:{showdetail(i){document.querySelector(".company-logo").setAttribute("src",i.image_src),document.querySelector(".overview-companyname").innerHTML=i.name,document.querySelector(".overview-industryType").innerHTML=i.industry_type,document.querySelector(".overview-companydesc").innerHTML=i.company_info,document.querySelector(".overview-company_location").innerHTML=i.location,document.querySelector(".overview-employee").innerHTML=i.employee,document.querySelector(".overview-vacancy").innerHTML=i.vacancy,document.querySelector(".overview-rating").innerHTML=i.rating,document.querySelector(".overview-website").innerHTML=i.website,document.querySelector(".overview-email").innerHTML=i.email,document.querySelector(".overview-since").innerHTML=i.since},setPages(){let i=Math.ceil(this.companies.length/this.perPage);this.pages=[];for(let t=1;t<=i;t++)this.pages.push(t)},paginate(i){let t=this.page,v=this.perPage,_=t*v-v,l=t*v;return i.slice(_,l)}},components:{Layout:V,PageHeader:I,flatPickr:E,Head:H,Link:j}},N={class:"avatar-sm mx-auto"},R={class:"avatar-title bg-light rounded"},U=["src"],J={class:"text-center"},O={class:"mt-3 company-name"},W={class:"d-none company-desc"},Y={class:"text-muted industry-type"},Z={class:"d-none"},G={class:"employee"},K={class:"location"},X={class:"rating"},$={class:"website"},ee={class:"email"},te={class:"since"},se={class:"vacancy"},oe={key:0,class:"pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0"},ie={class:"page-item"},ne={id:"page-num",class:"pagination"},le={id:"page-num",class:"pagination"},ae=["onClick"],re={class:"page-item"},de={class:"text-center"},ce={class:"list-inline mb-0"},me={class:"list-inline-item avatar-xs"},pe={class:"list-inline-item avatar-xs"},ue={class:"list-inline-item avatar-xs"},ve={class:"table-responsive table-card"},fe={class:"table table-borderless mb-4"},ge={class:"hstack gap-3"},ye={class:"d-flex align-items-center"};function we(i,t,v,_,l,h){const k=r("PageHeader"),m=r("BCol"),T=r("flat-pickr"),w=r("BButton"),f=r("BRow"),B=r("BForm"),p=r("BCardBody"),g=r("BCard"),a=r("BLink"),P=r("Link"),S=r("Layout");return u(),x(S,null,{default:s(()=>[o(k,{title:"Companies List",pageTitle:"Companies"}),o(f,null,{default:s(()=>[o(m,{xxl:"9"},{default:s(()=>[o(g,{"no-body":""},{default:s(()=>[o(p,null,{default:s(()=>[o(B,null,{default:s(()=>[o(f,{class:"g-3"},{default:s(()=>[o(m,{xxl:"5",sm:"6"},{default:s(()=>t[3]||(t[3]=[e("div",{class:"search-box"},[e("input",{type:"text",class:"form-control search bg-light border-light",id:"searchCompany",placeholder:"Search for company, industry type..."}),e("i",{class:"ri-search-line search-icon"})],-1)])),_:1}),o(m,{xxl:"3",sm:"6"},{default:s(()=>[o(T,{modelValue:i.date10,"onUpdate:modelValue":t[0]||(t[0]=n=>i.date10=n),config:l.defaultDateConfig,class:"form-control bg-light border-light flatpickr-input"},null,8,["modelValue","config"])]),_:1}),o(m,{xxl:"2",sm:"4"},{default:s(()=>t[4]||(t[4]=[e("div",{class:"input-light"},[e("select",{class:"form-control bg-light border-light","data-choices":"","data-choices-search-false":"",name:"choices-single-default",id:"idType"},[e("option",{value:"all",selected:""},"All"),e("option",{value:"Full Time"},"Full Time"),e("option",{value:"Part Time"},"Part Time"),e("option",{value:"Internship"},"Internship"),e("option",{value:"Freelance"},"Freelance")])],-1)])),_:1}),o(m,{xxl:"2",sm:"4"},{default:s(()=>[o(w,{type:"button",variant:"secondary",class:"w-100"},{default:s(()=>t[5]||(t[5]=[e("i",{class:"ri-equalizer-fill me-1 align-bottom"},null,-1),d(" Filters ")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),o(f,{class:"job-list-row",id:"companies-list"},{default:s(()=>[(u(!0),y(C,null,L(h.resultQuery,(n,b)=>(u(),x(m,{xxl:"3",md:"6",key:b},{default:s(()=>[o(g,{"no-body":"",class:"companiesList-card"},{default:s(()=>[o(p,null,{default:s(()=>[e("div",N,[e("div",R,[e("img",{src:n.image_src,alt:"",class:"avatar-xxs companyLogo-img"},null,8,U)])]),e("div",J,[o(a,{href:"#!"},{default:s(()=>[e("h5",O,c(n.name),1)]),_:2},1024),e("div",W,c(n.company_info),1),e("p",Y,c(n.industry_type),1),e("div",Z,[e("span",G,c(n.employee),1),e("span",K,c(n.location),1),e("span",X,c(n.rating),1),e("span",$,c(n.website),1),e("span",ee,c(n.email),1),e("span",te,c(n.since),1)])]),e("div",null,[o(w,{type:"button",variant:"soft-primary",class:"w-100 viewcompany-list",onClick:q=>h.showdetail(n)},{default:s(()=>[e("span",se,c(n.vacancy),1),t[6]||(t[6]=d(" Jobs Available"))]),_:2},1032,["onClick"])])]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1}),o(f,{class:"g-0 justify-content-end mb-4",id:"pagination-element"},{default:s(()=>[o(m,{sm:"6"},{default:s(()=>[l.pages.length>1?(u(),y("div",oe,[e("div",ie,[o(a,{href:"javascript:void(0);",class:"page-link",id:"page-prev",disabled:l.page<=1,onClick:t[1]||(t[1]=n=>l.page--)},{default:s(()=>t[7]||(t[7]=[d(" Previous")])),_:1},8,["disabled"])]),e("span",ne,[e("span",le,[(u(!0),y(C,null,L(l.pages,(n,b)=>(u(),y("div",{class:M(["page-item",{active:n==l.page,disabled:n=="..."}]),key:b,onClick:q=>l.page=n},[o(a,{class:"page-link clickPageNumber",href:"javascript:void(0);"},{default:s(()=>[d(c(n),1)]),_:2},1024)],10,ae))),128))])]),e("div",re,[o(a,{href:"javascript:void(0);",class:"page-link",id:"page-next",disabled:l.page>=l.pages.length,onClick:t[2]||(t[2]=n=>l.page++)},{default:s(()=>t[8]||(t[8]=[d("Next")])),_:1},8,["disabled"])])])):F("",!0)]),_:1})]),_:1})]),_:1}),o(m,{xxl:"3"},{default:s(()=>[o(g,{"no-body":"",id:"company-overview"},{default:s(()=>[o(p,null,{default:s(()=>[t[14]||(t[14]=e("div",{class:"avatar-lg mx-auto mb-3"},[e("div",{class:"avatar-title bg-light rounded"},[e("img",{src:D,alt:"",class:"avatar-sm company-logo",id:"company-logo"})])],-1)),e("div",de,[o(a,{href:"#!"},{default:s(()=>t[9]||(t[9]=[e("h5",{class:"overview-companyname",id:"overview-companyname"},"Syntyce Solutions",-1)])),_:1}),t[13]||(t[13]=e("p",{class:"text-muted overview-industryType",id:"overview-industryType"},"IT Department",-1)),e("ul",ce,[e("li",me,[o(a,{href:"javascript:void(0);",class:"avatar-title bg-success-subtle text-success fs-15 rounded"},{default:s(()=>t[10]||(t[10]=[e("i",{class:"ri-global-line"},null,-1)])),_:1})]),e("li",pe,[o(a,{href:"javascript:void(0);",class:"avatar-title bg-danger-subtle text-danger fs-15 rounded"},{default:s(()=>t[11]||(t[11]=[e("i",{class:"ri-mail-line"},null,-1)])),_:1})]),e("li",ue,[o(a,{href:"javascript:void(0);",class:"avatar-title bg-warning-subtle text-warning fs-15 rounded"},{default:s(()=>t[12]||(t[12]=[e("i",{class:"ri-question-answer-line"},null,-1)])),_:1})])])])]),_:1}),o(p,null,{default:s(()=>[t[26]||(t[26]=e("h6",{class:"text-muted text-uppercase fw-semibold mb-3"},"Information",-1)),t[27]||(t[27]=e("p",{class:"text-muted mb-4 overview-companydesc",id:"overview-companydesc"},"The IT department of a company ensures that the network of computers within the organization are well-connected and functioning properly. All the other departments within the company rely on them to ensure that their respective functions can go on seamlessly.",-1)),e("div",ve,[e("table",fe,[e("tbody",null,[t[17]||(t[17]=e("tr",null,[e("td",{class:"fw-medium",scope:"row"},"Industry Type"),e("td",{class:"overview-industryType",id:"overview-industryType"},"Chemical Industries")],-1)),t[18]||(t[18]=e("tr",null,[e("td",{class:"fw-medium",scope:"row"},"Location"),e("td",{class:"overview-company_location",id:"overview-company_location"},"Damascus, Syria")],-1)),t[19]||(t[19]=e("tr",null,[e("td",{class:"fw-medium",scope:"row"},"Employee"),e("td",{class:"overview-employee",id:"overview-employee"},"10-50")],-1)),t[20]||(t[20]=e("tr",null,[e("td",{class:"fw-medium",scope:"row"},"Vacancy"),e("td",{class:"overview-vacancy",id:"overview-vacancy"},"23")],-1)),t[21]||(t[21]=e("tr",null,[e("td",{class:"fw-medium",scope:"row"},"Rating"),e("td",null,[e("span",{class:"overview-rating",id:"overview-rating"},"4.8"),d(),e("i",{class:"ri-star-fill text-warning align-bottom"})])],-1)),e("tr",null,[t[16]||(t[16]=e("td",{class:"fw-medium",scope:"row"},"Website",-1)),e("td",null,[o(a,{href:"javascript:void(0);",class:"link-primary text-decoration-underline overview-website",id:"overview-website"},{default:s(()=>t[15]||(t[15]=[d("www.syntycesolution.com")])),_:1})])]),t[22]||(t[22]=e("tr",null,[e("td",{class:"fw-medium",scope:"row"},"Contact Email"),e("td",{class:"overview-email",id:"overview-email"},"info@syntycesolution.com")],-1)),t[23]||(t[23]=e("tr",null,[e("td",{class:"fw-medium",scope:"row"},"Since"),e("td",{class:"overview-since",id:"overview-since"},"1995")],-1))])])]),e("div",ge,[o(w,{type:"button",variant:"soft-success",class:"custom-toggle w-100","data-bs-toggle":"button"},{default:s(()=>t[24]||(t[24]=[e("span",{class:"icon-on"},[e("i",{class:"ri-add-line align-bottom me-1"}),d(" Follow")],-1),e("span",{class:"icon-off"},[e("i",{class:"ri-user-unfollow-line align-bottom me-1"}),d(" Unfollow")],-1)])),_:1}),o(a,{href:"#!",class:"btn btn-primary w-100"},{default:s(()=>t[25]||(t[25]=[d("More View "),e("i",{class:"ri-arrow-right-line align-bottom"},null,-1)])),_:1})])]),_:1})]),_:1}),o(g,{"no-body":"",class:"overflow-hidden shadow-none"},{default:s(()=>[o(p,{class:"bg-danger-subtle"},{default:s(()=>[e("div",ye,[t[29]||(t[29]=e("div",{class:"flex-shrink-0"},[e("div",{class:"avatar-sm"},[e("div",{class:"avatar-title bg-danger-subtle text-danger rounded-circle fs-17"},[e("i",{class:"ri-gift-line"})])])],-1)),t[30]||(t[30]=e("div",{class:"flex-grow-1 ms-2"},[e("h6",{class:"fs-16"},"Free trial"),e("p",{class:"text-muted mb-0"},"28 days left")],-1)),e("div",null,[o(P,{href:"/pages/pricing",class:"btn btn-danger"},{default:s(()=>t[28]||(t[28]=[d("Upgrade")])),_:1})])])]),_:1}),o(p,{class:"bg-danger-subtle border-top border-danger border-opacity-25 border-top-dashed"},{default:s(()=>[o(a,{href:"#!",class:"d-flex justify-content-between align-items-center text-body"},{default:s(()=>t[31]||(t[31]=[e("span",null,"See benefits",-1),e("i",{class:"ri-arrow-right-s-line fs-18"},null,-1)])),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const it=Q(z,[["render",we]]);export{it as default};
