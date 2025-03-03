import{s as J}from"./default-Jr7rUdQV.js";import{L as q}from"./main-BZMVmuB9.js";import{P as Y}from"./page-header-CWp0LBfO.js";import{a as R}from"./msoeawqm-Cg0RqasO.js";import{a as W}from"./gsqxdxog-DrHTRIvl.js";import{S as z}from"./sweetalert2.esm.all-CumHaNCI.js";import{H as L,r as c,I as G,c as K,w as n,o as g,a as o,f as t,h as r,l as _,J as x,d as b,g as P,t as v,F as S,e as j,n as k}from"./app-BWABJYdq.js";import{L as X}from"./lottie-CsSeM3tt.js";import{_ as U}from"./multi-user-BQIy0pl8.js";import{_ as Z}from"./user-dummy-img-DD-_gRNm.js";import{_ as $}from"./avatar-10-Jege67Fs.js";import{_ as ee}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-dark-BbIT5rJd.js";import"./logo-light-BfYujB8V.js";const te={components:{Layout:q,PageHeader:Y,lottie:X,Multiselect:J},data(){return{multi_user_image:U,user_dummy_image:Z,timeConfig:{enableTime:!1,dateFormat:"d M, Y"},date2:null,defaultOptions:{animationData:R},defaultOptions1:{animationData:W},searchQuery:null,addContactModal:!1,page:1,perPage:8,pages:[],value:null,tagvalue:null,tagoption:[{value:"Lead",label:"Lead"},{value:"Partner",label:"Partner"},{value:"Exiting",label:"Exiting"},{value:"Long-tern",label:"Long-tern"}],contactsList:[],submitted:!1,dataEdit:!1,deleteModal:!1,event:{_id:"",image_src:"",name:"",company:"",designation:"",email:"",last_contacted:"",lead_score:"",phone:"",tags:[],time:""}}},computed:{displayedPosts(){return this.paginate(this.contactsList)},resultQuery(){if(this.searchQuery){const l=this.searchQuery.toLowerCase();return this.displayedPosts.filter(e=>e.company.toLowerCase().includes(l)||e.designation.toLowerCase().includes(l)||e.email.toLowerCase().includes(l)||e.image_src.toLowerCase().includes(l)||e.last_contacted.toLowerCase().includes(l)||e.lead_score.toString().toLowerCase().includes(l)||e.name.toLowerCase().includes(l)||e.phone.toLowerCase().includes(l))}else return this.displayedPosts}},watch:{contactsList(){this.setPages()}},created(){this.setPages()},filters:{trimWords(l){return l.split(" ").splice(0,20).join(" ")+"..."}},methods:{handleSubmit(){if(this.dataEdit)this.submitted=!0,this.submitted&&this.event.name&&this.event.company&&this.event.designation&&this.event.email&&this.event.phone&&this.event.lead_score&&this.event.tags&&(this.addContactModal=!1,L.patch(`https://api-node.themesbrand.website/apps/contact/${this.event._id}`,this.event).then(l=>{const e=l.data.data;this.contactsList=this.contactsList.map(d=>d._id.toString()==e._id.toString()?{...d,...e}:d)}).catch(l=>{console.log(l)}));else if(this.submitted=!0,this.submitted&&this.event.name&&this.event.company&&this.event.designation&&this.event.email&&this.event.phone&&this.event.lead_score&&this.event.tags){const l={_id:Math.floor(Math.random()*100+20)-20,image_src:U,last_contacted:this.dateFormat(),...this.event};this.addContactModal=!1,L.post("https://api-node.themesbrand.website/apps/contact",l).then(e=>{this.contactsList.unshift(e.data.data)}).catch(e=>{console.log(e)})}},onSort(l){this.direction=this.direction==="asc"?"desc":"asc";const e=[...this.contactsList];e.sort((d,m)=>{const s=d[l]<m[l]?-1:d[l]>m[l]?1:0;return this.direction==="asc"?s:-s}),this.contactsList=e},editDetails(l){this.dataEdit=!0,this.addContactModal=!0,this.event={...l},this.submitted=!1},toggleModal(){this.addContactModal=!0,this.dataEdit=!1,this.event={},this.submitted=!1},deleteModalToggle(l){this.deleteModal=!0,this.event._id=l._id},deleteData(){this.event._id&&(L.delete(`https://api-node.themesbrand.website/apps/contact/${this.event._id}`).then(l=>{l.data.status==="success"&&(this.contactsList=this.contactsList.filter(e=>e._id!=this.event._id))}).catch(l=>{console.log(l)}),this.deleteModal=!1)},dateFormat(){var l=new Date,e=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return l.getDate()+" "+e[l.getMonth()]+", "+l.getFullYear()},showdetail(l){document.getElementById("image").setAttribute("src",l.image_src),document.getElementById("name").innerHTML=l.name,document.getElementById("company").innerHTML=l.company,document.getElementById("designation").innerHTML=l.designation,document.getElementById("email").innerHTML=l.email,document.getElementById("phoneno").innerHTML=l.phone,document.getElementById("leadscoreno").innerHTML=l.lead_score,document.getElementById("tags").innerHTML="",l.tags.forEach(e=>{document.getElementById("tags").innerHTML+='&nbsp;<span class="badge bg-primary-subtle text-primary">'+e+"</span>"}),document.getElementById("lastdate").innerHTML=l.last_contacted,document.getElementById("lasttime").innerHTML=l.time},setPages(){let l=Math.ceil(this.contactsList.length/this.perPage);this.pages=[];for(let e=1;e<=l;e++)this.pages.push(e)},paginate(l){let e=this.page,d=this.perPage,m=e*d-d,s=e*d;return l.slice(m,s)},deleteMultiple(){let l=[];var e=document.getElementsByName("chk_child");if(e.forEach(function(s){if(s.checked==!0){var a=s.parentNode.parentNode.parentNode,u=a.querySelector(".id a").innerHTML;l.push(u)}}),typeof l<"u"&&l.length>0)if(confirm("Are you sure you want to delete this?")){var d=this.contactsList;l.forEach(function(s){d=d.filter(function(a){return a._id!=s})}),this.contactsList=d,document.getElementById("checkAll").checked=!1;var m=document.getElementsByName("chk_child");m.forEach(function(s){s.checked==!0&&(s.checked=!1,s.closest("tr").classList.remove("table-active"))})}else return!1;else z.fire({title:"Please select at least one checkbox",confirmButtonClass:"btn btn-info",buttonsStyling:!1,showCloseButton:!0})}},beforeMount(){L.get("https://api-node.themesbrand.website/apps/contact").then(l=>{var d,m;const e=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];this.contactsList=[],(m=(d=l==null?void 0:l.data)==null?void 0:d.data)==null||m.forEach(s=>{var a=new Date(s.last_contacted);s.last_contacted=a.getDate()+" "+e[a.getMonth()]+", "+a.getFullYear();var u=a.getHours(),p=a.getMinutes(),y=u>=12?"PM":"AM";u=u%12,u=u||12,u=u<10?"0"+u:u,p=p<10?"0"+p:p;var w=u+":"+p+" "+y;s.time=w,s.image_src="https://api-node.themesbrand.website/images/users/"+s.image_src,this.contactsList.push(s)})}).catch(l=>{console.log(l)})},mounted(){var l=document.getElementById("checkAll");l&&(l.onclick=function(){var d=document.querySelectorAll('.form-check-all input[type="checkbox"]');l.checked==!0?d.forEach(function(m){m.checked=!0,m.closest("tr").classList.add("table-active"),document.getElementById("remove-actions").style.display="block"}):d.forEach(function(m){m.checked=!1,m.closest("tr").classList.remove("table-active"),document.getElementById("remove-actions").style.display="none"})});var e=document.querySelectorAll("#contactList .form-check-input");Array.from(e).forEach(function(d){d.addEventListener("change",function(m){var s=document.querySelectorAll("#contactList .form-check-input:checked").length;m.target.closest("tr").classList.contains("table-active"),s>0?document.getElementById("remove-actions").style.display="block":document.getElementById("remove-actions").style.display="none"})})}},se={class:"d-flex align-items-center flex-wrap gap-2"},le={class:"flex-grow-1"},oe={class:"flex-shrink-0"},ne={class:"hstack text-nowrap gap-2"},ie={class:"search-box"},ae={class:"d-flex align-items-center gap-2"},de={class:"table-responsive table-card mb-3"},re={class:"table align-middle table-nowrap mb-0",id:"customerTable"},me={class:"table-light"},ce={class:"list form-check-all"},ue={class:"id",style:{display:"none"}},pe={class:""},fe={class:"d-flex align-items-center"},ge={class:"flex-shrink-0"},ve=["src"],be={class:"flex-grow-1 ms-2 name"},ye={class:"company_name"},he={class:"email_id"},_e={class:"phone"},ke={class:"lead_score"},xe={class:"tags"},Ce={class:"date"},we={class:"text-muted time"},Le={class:"list-inline hstack gap-2 mb-0"},Me={class:"list-inline-item edit",title:"Call"},Be={class:"list-inline-item edit",title:"Message"},Ee={class:"list-inline-item"},De={key:0,class:"noresult"},Ie={class:"text-center"},Pe={key:0,class:"d-flex justify-content-end mt-3"},Se={class:"pagination-wrap hstack gap-2"},Ae={class:"pagination listjs-pagination mb-0"},Te=["onClick"],Ve={class:"list-inline mb-0"},Ne={class:"list-inline-item avatar-xs"},He={class:"list-inline-item avatar-xs"},je={class:"list-inline-item avatar-xs"},Ue={class:"table-responsive table-card"},Fe={class:"table table-borderless mb-0"},Qe={id:"tags",class:"hstack gap-1"},Oe={class:"text-center"},Je={class:"position-relative d-inline-block"},qe={class:"avatar-lg p-1"},Ye={class:"avatar-title bg-light rounded-circle"},Re=["src"],We={class:"hstack gap-2 justify-content-end mt-3"},ze={class:"mt-2 text-center"},Ge={class:"d-flex gap-2 justify-content-center mt-4 mb-2"};function Ke(l,e,d,m,s,a){const u=c("PageHeader"),p=c("BButton"),y=c("BDropdownItem"),w=c("BDropdown"),A=c("BCardHeader"),M=c("BCard"),f=c("BCol"),T=c("Multiselect"),B=c("BRow"),h=c("BLink"),E=c("BBadge"),V=c("lottie"),D=c("BCardBody"),F=c("b-form"),N=c("BModal"),Q=c("Layout"),H=G("b-tooltip");return g(),K(Q,null,{default:n(()=>[o(u,{title:"Contacts",pageTitle:"CRM"}),o(B,null,{default:n(()=>[o(f,{lg:"12"},{default:n(()=>[o(M,{"no-body":""},{default:n(()=>[o(A,null,{default:n(()=>[t("div",se,[t("div",le,[o(p,{variant:"primary",class:"add-btn me-1",onClick:a.toggleModal},{default:n(()=>e[23]||(e[23]=[t("i",{class:"ri-add-fill me-1 align-bottom"},null,-1),r(" Add Contacts ")])),_:1},8,["onClick"])]),t("div",oe,[t("div",ne,[o(p,{variant:"soft-danger",id:"remove-actions",onClick:a.deleteMultiple},{default:n(()=>e[24]||(e[24]=[t("i",{class:"ri-delete-bin-2-line"},null,-1)])),_:1},8,["onClick"]),o(p,{variant:"secondary"},{default:n(()=>e[25]||(e[25]=[t("i",{class:"ri-filter-2-line me-1 align-bottom"},null,-1),r(" Filters ")])),_:1}),o(p,{variant:"soft-success"},{default:n(()=>e[26]||(e[26]=[r("Import")])),_:1}),o(w,{variant:"link",class:"card-header-dropdown","toggle-class":"btn btn-soft-info arrow-none","menu-class":"dropdown-menu-end",offset:{alignmentAxis:-105,crossAxis:0,mainAxis:10}},{"button-content":n(()=>e[27]||(e[27]=[t("i",{class:"ri-more-2-fill"},null,-1)])),default:n(()=>[o(y,null,{default:n(()=>e[28]||(e[28]=[r("All")])),_:1}),o(y,null,{default:n(()=>e[29]||(e[29]=[r("Last Week")])),_:1}),o(y,null,{default:n(()=>e[30]||(e[30]=[r("Last Month")])),_:1}),o(y,null,{default:n(()=>e[31]||(e[31]=[r("Last Year")])),_:1})]),_:1})])])])]),_:1})]),_:1})]),_:1}),o(f,{xxl:"9"},{default:n(()=>[o(M,{"no-body":"",id:"contactList"},{default:n(()=>[o(A,null,{default:n(()=>[o(B,{class:"g-3"},{default:n(()=>[o(f,{md:"4"},{default:n(()=>[t("div",ie,[_(t("input",{type:"text",class:"form-control search",placeholder:"Search for contact...","onUpdate:modelValue":e[0]||(e[0]=i=>s.searchQuery=i)},null,512),[[x,s.searchQuery]]),e[32]||(e[32]=t("i",{class:"ri-search-line search-icon"},null,-1))])]),_:1}),o(f,{md:"auto",class:"ms-auto"},{default:n(()=>[t("div",ae,[e[33]||(e[33]=t("span",{class:"text-muted flex-shrink-0"},"Sort by: ",-1)),o(T,{class:"form-control",style:{width:"150px"},modelValue:s.value,"onUpdate:modelValue":e[1]||(e[1]=i=>s.value=i),"close-on-select":!0,searchable:!0,"create-option":!0,options:[{value:"Name",label:"Name"},{value:"Company",label:"Company"},{value:"Lead",label:"Lead"}]},null,8,["modelValue"])])]),_:1})]),_:1})]),_:1}),o(D,null,{default:n(()=>[t("div",null,[t("div",de,[t("table",re,[t("thead",me,[t("tr",null,[e[34]||(e[34]=t("th",{scope:"col",style:{width:"50px"}},[t("div",{class:"form-check"},[t("input",{class:"form-check-input",type:"checkbox",id:"checkAll",value:"option"})])],-1)),t("th",{class:"sort","data-sort":"name",scope:"col",onClick:e[2]||(e[2]=i=>a.onSort("name"))},"Name"),t("th",{class:"sort","data-sort":"company_name",scope:"col",onClick:e[3]||(e[3]=i=>a.onSort("company"))}," Company "),t("th",{class:"sort","data-sort":"email_id",scope:"col",onClick:e[4]||(e[4]=i=>a.onSort("email"))}," Email ID "),t("th",{class:"sort","data-sort":"phone",scope:"col",onClick:e[5]||(e[5]=i=>a.onSort("phone"))}," Phone No "),t("th",{class:"sort","data-sort":"lead_score",scope:"col",onClick:e[6]||(e[6]=i=>a.onSort("lead_score"))}," Lead Score "),t("th",{class:"sort","data-sort":"Designation",scope:"col",onClick:e[7]||(e[7]=i=>a.onSort("tags"))}," Tags "),t("th",{class:"sort","data-sort":"date",scope:"col",onClick:e[8]||(e[8]=i=>a.onSort("last_contacted"))}," Last Contacted "),e[35]||(e[35]=t("th",{scope:"col"},"Action",-1))])]),t("tbody",ce,[(g(!0),b(S,null,P(a.resultQuery,(i,I)=>(g(),b("tr",{key:I},[e[44]||(e[44]=t("th",{scope:"row"},[t("div",{class:"form-check"},[t("input",{class:"form-check-input",type:"checkbox",name:"chk_child",value:"option1"})])],-1)),t("td",ue,[o(h,{href:"javascript:void(0);",class:"fw-medium link-primary"},{default:n(()=>[r(v(i._id),1)]),_:2},1024)]),t("td",pe,[t("div",fe,[t("div",ge,[t("img",{src:i.image_src,alt:"",class:"user_image avatar-xs rounded-circle"},null,8,ve)]),t("div",be,v(i.name),1)])]),t("td",ye,v(i.company),1),t("td",he,v(i.email),1),t("td",_e,v(i.phone),1),t("td",ke,v(i.lead_score),1),t("td",xe,[(g(!0),b(S,null,P(i.tags,(C,O)=>(g(),b("span",{key:O},[e[36]||(e[36]=r("  ")),o(E,{variant:"primary-subtle",class:"bg-primary-subtle text-primary"},{default:n(()=>[r(v(C),1)]),_:2},1024)]))),128))]),t("td",null,[t("span",Ce,v(i.last_contacted),1),e[37]||(e[37]=r(" ")),t("small",we,v(i.time),1)]),t("td",null,[t("ul",Le,[_((g(),b("li",Me,[o(h,{href:"javascript:void(0);",class:"text-muted d-inline-block"},{default:n(()=>e[38]||(e[38]=[t("i",{class:"ri-phone-line fs-16"},null,-1)])),_:1})])),[[H,void 0,void 0,{hover:!0}]]),_((g(),b("li",Be,[o(h,{href:"javascript:void(0);",class:"text-muted d-inline-block"},{default:n(()=>e[39]||(e[39]=[t("i",{class:"ri-question-answer-line fs-16"},null,-1)])),_:1})])),[[H,void 0,void 0,{hover:!0}]]),t("li",Ee,[o(w,{variant:"link","toggle-class":"btn btn-soft-secondary btn-sm dropdown arrow-none","menu-class":"dropdown-menu-end",offset:{alignmentAxis:-130,crossAxis:0,mainAxis:10}},{"button-content":n(()=>e[40]||(e[40]=[t("i",{class:"ri-more-fill align-middle"},null,-1)])),default:n(()=>[o(y,{onClick:C=>a.showdetail(i)},{default:n(()=>e[41]||(e[41]=[t("i",{class:"ri-eye-fill align-bottom me-2 text-muted"},null,-1),r(" View")])),_:2},1032,["onClick"]),o(y,{onClick:C=>a.editDetails(i)},{default:n(()=>e[42]||(e[42]=[t("i",{class:"ri-pencil-fill align-bottom me-2 text-muted"},null,-1),r(" Edit ")])),_:2},1032,["onClick"]),o(y,{onClick:C=>a.deleteModalToggle(i)},{default:n(()=>e[43]||(e[43]=[t("i",{class:"ri-delete-bin-fill align-bottom me-2 text-muted"},null,-1),r(" Delete ")])),_:2},1032,["onClick"])]),_:2},1024)])])])]))),128))])]),a.resultQuery.length<1?(g(),b("div",De,[t("div",Ie,[o(V,{class:"avatar-xl",colors:"primary:#121331,secondary:#08a88a",options:s.defaultOptions,height:75,width:75},null,8,["options"]),e[45]||(e[45]=t("h5",{class:"mt-2"},"Sorry! No Result Found",-1)),e[46]||(e[46]=t("p",{class:"text-muted mb-0"}," We've searched more than 150+ Orders We did not find any orders for you search. ",-1))])])):j("",!0)]),a.resultQuery.length>=1?(g(),b("div",Pe,[t("div",Se,[o(h,{class:"page-item pagination-prev",href:"#",disabled:s.page<=1,onClick:e[9]||(e[9]=i=>s.page--)},{default:n(()=>e[47]||(e[47]=[r(" Previous ")])),_:1},8,["disabled"]),t("ul",Ae,[(g(!0),b(S,null,P(s.pages,(i,I)=>(g(),b("li",{class:k({active:i==s.page,disabled:i=="..."}),key:I,onClick:C=>s.page=i},[o(h,{class:"page",href:"#"},{default:n(()=>[r(v(i),1)]),_:2},1024)],10,Te))),128))]),o(h,{class:"page-item pagination-next",href:"#",disabled:s.page>=s.pages.length,onClick:e[10]||(e[10]=i=>s.page++)},{default:n(()=>e[48]||(e[48]=[r(" Next ")])),_:1},8,["disabled"])])])):j("",!0)])]),_:1})]),_:1})]),_:1}),o(f,{xxl:"3"},{default:n(()=>[o(M,{"no-body":"",id:"contact-view-detail"},{default:n(()=>[o(D,{class:"text-center"},{default:n(()=>[e[52]||(e[52]=t("div",{class:"position-relative d-inline-block"},[t("img",{src:$,id:"image",alt:"",class:"avatar-lg rounded-circle img-thumbnail"}),t("span",{class:"contact-active position-absolute rounded-circle bg-success"},[t("span",{class:"visually-hidden"})])],-1)),e[53]||(e[53]=t("h5",{class:"mt-4 mb-1",id:"name"},"Tonya Noble",-1)),e[54]||(e[54]=t("p",{class:"text-muted",id:"company"},"Nesta Technologies",-1)),t("ul",Ve,[t("li",Ne,[o(h,{href:"javascript:void(0);",class:"avatar-title bg-success-subtle text-success fs-15 rounded"},{default:n(()=>e[49]||(e[49]=[t("i",{class:"ri-phone-line"},null,-1)])),_:1})]),t("li",He,[o(h,{href:"javascript:void(0);",class:"avatar-title bg-danger-subtle text-danger fs-15 rounded"},{default:n(()=>e[50]||(e[50]=[t("i",{class:"ri-mail-line"},null,-1)])),_:1})]),t("li",je,[o(h,{href:"javascript:void(0);",class:"avatar-title bg-warning-subtle text-warning fs-15 rounded"},{default:n(()=>e[51]||(e[51]=[t("i",{class:"ri-question-answer-line"},null,-1)])),_:1})])])]),_:1}),o(D,null,{default:n(()=>[e[63]||(e[63]=t("h6",{class:"text-muted text-uppercase fw-semibold mb-3"},"Personal Information",-1)),e[64]||(e[64]=t("p",{class:"text-muted mb-4"},"Hello, I'm Tonya Noble, The most effective objective is one that is tailored to the job you are applying for. It states what kind of career you are seeking, and what skills and experiences.",-1)),t("div",Ue,[t("table",Fe,[t("tbody",null,[e[58]||(e[58]=t("tr",null,[t("td",{class:"fw-medium",scope:"row"},"Designation"),t("td",{id:"designation"},"Lead Designer / Developer")],-1)),e[59]||(e[59]=t("tr",null,[t("td",{class:"fw-medium",scope:"row"},"Email ID"),t("td",{id:"email"},"tonyanoble@velzon.com")],-1)),e[60]||(e[60]=t("tr",null,[t("td",{class:"fw-medium",scope:"row"},"Phone No"),t("td",{id:"phoneno"},"414-453-5725")],-1)),e[61]||(e[61]=t("tr",null,[t("td",{class:"fw-medium",scope:"row"},"Lead Score"),t("td",{id:"leadscoreno"},"154")],-1)),t("tr",null,[e[57]||(e[57]=t("td",{class:"fw-medium",scope:"row"},"Tags",-1)),t("td",Qe,[o(E,{variant:"primary-subtle",class:"bg-primary-subtle text-primary"},{default:n(()=>e[55]||(e[55]=[r("Lead")])),_:1}),o(E,{variant:"primary-subtle",class:"bg-primary-subtle text-primary"},{default:n(()=>e[56]||(e[56]=[r("Partner")])),_:1})])]),e[62]||(e[62]=t("tr",null,[t("td",{class:"fw-medium",scope:"row"},"Last Contacted"),t("td",null,[t("span",{id:"lastdate"},"15 Dec, 2021 "),t("small",{class:"text-muted",id:"lasttime"},"08:58AM")])],-1))])])])]),_:1})]),_:1})]),_:1})]),_:1}),o(N,{modelValue:s.addContactModal,"onUpdate:modelValue":e[19]||(e[19]=i=>s.addContactModal=i),id:"showmodal","hide-footer":"","title-class":"exampleModalLabel","header-class":"bg-info-subtle p-3",class:"v-modal-custom",centered:"",title:s.dataEdit?"Edit Contact":"Add Contact"},{default:n(()=>[o(F,{action:"",id:"addform",class:"tablelist-form",autocomplete:"off"},{default:n(()=>[e[81]||(e[81]=t("input",{type:"hidden",id:"id"},null,-1)),o(B,{class:"g-3"},{default:n(()=>[o(f,{lg:"12"},{default:n(()=>[t("div",Oe,[t("div",Je,[e[65]||(e[65]=t("div",{class:"position-absolute bottom-0 end-0"},[t("label",{for:"customer-image-input",class:"mb-0","data-bs-toggle":"tooltip","data-bs-placement":"right","aria-label":"Select Image","data-bs-original-title":"Select Image"},[t("div",{class:"avatar-xs cursor-pointer"},[t("div",{class:"avatar-title bg-light border rounded-circle text-muted"},[t("i",{class:"ri-image-fill"})])])]),t("input",{class:"form-control d-none",value:"",id:"customer-image-input",type:"file",accept:"image/png, image/gif, image/jpeg"})],-1)),t("div",qe,[t("div",Ye,[t("img",{src:s.event.image_src||s.user_dummy_image,id:"customer-img",class:"avatar-md rounded-circle object-fit-cover"},null,8,Re)])])])]),t("div",null,[e[66]||(e[66]=t("label",{for:"name-field",class:"form-label"},"Name",-1)),_(t("input",{type:"text",id:"customername",class:k(["form-control",{"is-invalid":s.submitted&&!s.event.name}]),placeholder:"Enter name","onUpdate:modelValue":e[11]||(e[11]=i=>s.event.name=i)},null,2),[[x,s.event.name]]),e[67]||(e[67]=t("div",{class:"invalid-feedback"},"Please enter a name.",-1))])]),_:1}),o(f,{lg:"12"},{default:n(()=>[t("div",null,[e[68]||(e[68]=t("label",{for:"company_name-field",class:"form-label"},"Company Name",-1)),_(t("input",{type:"text",id:"companyname",class:k(["form-control",{"is-invalid":s.submitted&&!s.event.company}]),placeholder:"Enter company name","onUpdate:modelValue":e[12]||(e[12]=i=>s.event.company=i)},null,2),[[x,s.event.company]]),e[69]||(e[69]=t("div",{class:"invalid-feedback"},"Please enter a company name.",-1))])]),_:1}),o(f,{lg:"12"},{default:n(()=>[t("div",null,[e[70]||(e[70]=t("label",{for:"designation-field",class:"form-label"},"Designation",-1)),_(t("input",{type:"text",id:"designation-field",class:k(["form-control",{"is-invalid":s.submitted&&!s.event.designation}]),placeholder:"Enter designation","onUpdate:modelValue":e[13]||(e[13]=i=>s.event.designation=i)},null,2),[[x,s.event.designation]]),e[71]||(e[71]=t("div",{class:"invalid-feedback"},"Please enter a designation.",-1))])]),_:1}),o(f,{lg:"12"},{default:n(()=>[t("div",null,[e[72]||(e[72]=t("label",{for:"email_id-field",class:"form-label"},"Email ID",-1)),_(t("input",{type:"text",id:"emailid",class:k(["form-control",{"is-invalid":s.submitted&&!s.event.email}]),placeholder:"Enter email","onUpdate:modelValue":e[14]||(e[14]=i=>s.event.email=i)},null,2),[[x,s.event.email]]),e[73]||(e[73]=t("div",{class:"invalid-feedback"},"Please enter a email.",-1))])]),_:1}),o(f,{lg:"6"},{default:n(()=>[t("div",null,[e[74]||(e[74]=t("label",{for:"phone-field",class:"form-label"},"Phone",-1)),_(t("input",{type:"text",id:"phone",class:k(["form-control",{"is-invalid":s.submitted&&!s.event.phone}]),placeholder:"Enter phone no","onUpdate:modelValue":e[15]||(e[15]=i=>s.event.phone=i)},null,2),[[x,s.event.phone]]),e[75]||(e[75]=t("div",{class:"invalid-feedback"},"Please enter a phone number.",-1))])]),_:1}),o(f,{lg:"6"},{default:n(()=>[t("div",null,[e[76]||(e[76]=t("label",{for:"lead_score-field",class:"form-label"},"Lead Score",-1)),_(t("input",{type:"text",id:"leadscore",class:k(["form-control",{"is-invalid":s.submitted&&!s.event.lead_score}]),placeholder:"Enter value","onUpdate:modelValue":e[16]||(e[16]=i=>s.event.lead_score=i)},null,2),[[x,s.event.lead_score]]),e[77]||(e[77]=t("div",{class:"invalid-feedback"},"Please enter a lead score.",-1))])]),_:1}),t("div",null,[e[78]||(e[78]=t("label",{for:"",class:"form-label"},"Tags",-1)),o(T,{mode:"tags","close-on-select":!0,searchable:!0,"create-option":!1,options:s.tagoption,modelValue:s.event.tags,"onUpdate:modelValue":e[17]||(e[17]=i=>s.event.tags=i),class:k({"is-invalid":s.submitted&&!s.event.tags})},null,8,["options","modelValue","class"]),e[79]||(e[79]=t("div",{class:"invalid-feedback"},"Please select a tags.",-1))])]),_:1}),t("div",We,[o(p,{type:"button",variant:"light",onClick:e[18]||(e[18]=i=>s.addContactModal=!1),id:"edtclosemodal"},{default:n(()=>e[80]||(e[80]=[r("Close")])),_:1}),o(p,{type:"button",variant:"success",id:"add-btn",onClick:a.handleSubmit},{default:n(()=>[r(v(s.dataEdit?"Update":"Add Contact"),1)]),_:1},8,["onClick"])])]),_:1})]),_:1},8,["modelValue","title"]),o(N,{modelValue:s.deleteModal,"onUpdate:modelValue":e[22]||(e[22]=i=>s.deleteModal=i),"modal-class":"zoomIn","hide-footer":"","no-close-on-backdrop":"",centered:""},{default:n(()=>[t("div",ze,[o(V,{class:"avatar-xl",colors:"primary:#f7b84b,secondary:#f06548",options:s.defaultOptions1,height:100,width:100},null,8,["options"]),e[82]||(e[82]=t("div",{class:"mt-4 pt-2 fs-15 mx-4 mx-sm-5"},[t("h4",null,"You are about to delete a contact ?"),t("p",{class:"text-muted mx-4 mb-0"},"Deleting your contact will remove all of your information from our database.")],-1))]),t("div",Ge,[t("button",{type:"button",class:"btn w-sm btn-light",onClick:e[20]||(e[20]=i=>s.deleteModal=!1)},"Close"),t("button",{type:"button",class:"btn w-sm btn-danger",id:"delete-record",onClick:e[21]||(e[21]=(...i)=>a.deleteData&&a.deleteData(...i))},"Yes, Delete It!")])]),_:1},8,["modelValue"])]),_:1})}const bt=ee(te,[["render",Ke]]);export{bt as default};
