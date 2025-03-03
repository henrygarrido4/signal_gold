import{L as I}from"./main-BZMVmuB9.js";import{P as x}from"./page-header-CWp0LBfO.js";import{C as B}from"./component-GK_D4hhz.js";/* empty css                  */import{_ as C}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{r,c as _,w as o,o as q,a as l,f as e,h as n}from"./app-BWABJYdq.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-dark-BbIT5rJd.js";import"./logo-light-BfYujB8V.js";const j={data(){return{defaultDateConfig:{dateFormat:"d M, Y",defaultDate:""}}},components:{Layout:I,PageHeader:x,flatPickr:B}},J={class:"hstack justify-content-end gap-2"};function E(s,t,S,Y,d,k){const c=r("PageHeader"),m=r("BCardHeader"),a=r("BCol"),u=r("flat-pickr"),p=r("BButton"),f=r("BRow"),b=r("BCardBody"),g=r("BForm"),v=r("BCard"),y=r("Layout");return q(),_(y,null,{default:o(()=>[l(c,{title:"New Job",pageTitle:"Jobs"}),l(f,null,{default:o(()=>[l(a,{lg:"12"},{default:o(()=>[l(v,{"no-body":""},{default:o(()=>[l(g,{action:"#"},{default:o(()=>[l(m,null,{default:o(()=>t[2]||(t[2]=[e("h5",{class:"card-title mb-0"},"Create Job",-1)])),_:1}),l(b,null,{default:o(()=>[l(f,{class:"g-4"},{default:o(()=>[l(a,{lg:"6"},{default:o(()=>t[3]||(t[3]=[e("div",null,[e("label",{for:"job-title-Input",class:"form-label"},[n("Job Title "),e("span",{class:"text-danger"},"*")]),e("input",{type:"text",class:"form-control",id:"job-title-Input",placeholder:"Enter job title",required:""})],-1)])),_:1}),l(a,{lg:"6"},{default:o(()=>t[4]||(t[4]=[e("div",null,[e("label",{for:"job-position-Input",class:"form-label"},[n("Job Position "),e("span",{class:"text-danger"},"*")]),e("input",{type:"text",class:"form-control",id:"job-position-Input",placeholder:"Enter job position",required:""})],-1)])),_:1}),l(a,{lg:"6"},{default:o(()=>t[5]||(t[5]=[e("div",null,[e("label",{for:"job-category-Input",class:"form-label"},[n("Job Category "),e("span",{class:"text-danger"},"*")]),e("select",{class:"form-control","data-choices":"",name:"job-category-Input",required:""},[e("option",{value:""},"Select Category"),e("option",{value:"Accounting & Finance"},"Accounting & Finance"),e("option",{value:"Purchasing Manager"},"Purchasing Manager"),e("option",{value:"Education & training"},"Education & training"),e("option",{value:"Marketing & Advertising"},"Marketing & Advertising"),e("option",{value:"It / Software Jobs"},"It / Software Jobs"),e("option",{value:"Digital Marketing"},"Digital Marketing"),e("option",{value:"Administrative Officer"},"Administrative Officer"),e("option",{value:"Government Jobs"},"Government Jobs")])],-1)])),_:1}),l(a,{lg:"6"},{default:o(()=>t[6]||(t[6]=[e("div",null,[e("label",{for:"job-type-Input",class:"form-label"},[n("Job Type "),e("span",{class:"text-danger"},"*")]),e("select",{class:"form-control","data-choices":"",name:"job-type-Input",required:""},[e("option",{value:""},"Select job type"),e("option",{value:"Full Time"},"Full Time"),e("option",{value:"Part Time"},"Part Time"),e("option",{value:"Freelance"},"Freelance"),e("option",{value:"Internship"},"Internship")])],-1)])),_:1}),l(a,{lg:"12"},{default:o(()=>t[7]||(t[7]=[e("div",null,[e("label",{for:"description-field",class:"form-label"},[n("Description "),e("span",{class:"text-danger"},"*")]),e("textarea",{class:"form-control",id:"description-field",rows:"3",placeholder:"Enter description",required:""})],-1)])),_:1}),l(a,{md:"6"},{default:o(()=>t[8]||(t[8]=[e("div",null,[e("label",{for:"vancancy-Input",class:"form-label"},[n("No. of Vacancy "),e("span",{class:"text-danger"},"*")]),e("input",{type:"number",class:"form-control",id:"vancancy-Input",placeholder:"No. of vacancy",required:""})],-1)])),_:1}),l(a,{md:"6"},{default:o(()=>t[9]||(t[9]=[e("div",null,[e("label",{for:"experience-Input",class:"form-label"},[n("Experience "),e("span",{class:"text-danger"},"*")]),e("select",{class:"form-control","data-choices":"",name:"experience-Input"},[e("option",{value:""},"Select Experience"),e("option",{value:"0 Year"},"0 Year"),e("option",{value:"2 Years"},"2 Years"),e("option",{value:"3 Years"},"3 Years"),e("option",{value:"4 Years"},"4 Years"),e("option",{value:"5 Years"},"5 Years")])],-1)])),_:1}),l(a,{lg:"6"},{default:o(()=>[e("div",null,[t[10]||(t[10]=e("label",{for:"last-apply-date-Input",class:"form-label"},[n("Last Date of Apply "),e("span",{class:"text-danger"},"*")],-1)),l(u,{modelValue:s.date,"onUpdate:modelValue":t[0]||(t[0]=i=>s.date=i),config:d.defaultDateConfig,class:"form-control",placeholder:"Select date"},null,8,["modelValue","config"])])]),_:1}),l(a,{lg:"6"},{default:o(()=>[e("div",null,[t[11]||(t[11]=e("label",{for:"close-date-Input",class:"form-label"},[n("Close Date "),e("span",{class:"text-danger"},"*")],-1)),l(u,{modelValue:s.date,"onUpdate:modelValue":t[1]||(t[1]=i=>s.date=i),config:d.defaultDateConfig,class:"form-control",placeholder:"Select date"},null,8,["modelValue","config"])])]),_:1}),l(a,{md:"6"},{default:o(()=>t[12]||(t[12]=[e("div",null,[e("label",{for:"start-salary-Input",class:"form-label"},"Start Salary"),e("input",{type:"number",class:"form-control",id:"start-salary-Input",placeholder:"Enter start salary",required:""})],-1)])),_:1}),l(a,{md:"6"},{default:o(()=>t[13]||(t[13]=[e("div",null,[e("label",{for:"last-salary-Input",class:"form-label"},"Last Salary"),e("input",{type:"number",class:"form-control",id:"last-salary-Input",placeholder:"Enter end salary",required:""})],-1)])),_:1}),l(a,{md:"6"},{default:o(()=>t[14]||(t[14]=[e("div",null,[e("label",{for:"country-Input",class:"form-label"},[n("Country "),e("span",{class:"text-danger"},"*")]),e("input",{type:"text",class:"form-control",id:"country-Input",placeholder:"Enter country",required:""})],-1)])),_:1}),l(a,{md:"6"},{default:o(()=>t[15]||(t[15]=[e("div",null,[e("label",{for:"city-Input",class:"form-label"},[n("State "),e("span",{class:"text-danger"},"*")]),e("input",{type:"text",class:"form-control",id:"city-Input",placeholder:"Enter city",required:""})],-1)])),_:1}),l(a,{lg:"12"},{default:o(()=>t[16]||(t[16]=[e("div",null,[e("label",{for:"website-field",class:"form-label"},"Tags"),e("input",{class:"form-control",id:"choices-text-unique-values","data-choices":"","data-choices-text-unique-true":"",type:"text",value:"Design, Remote",required:""})],-1)])),_:1}),l(a,{lg:"12"},{default:o(()=>[e("div",J,[l(p,{type:"button",variant:"ghost-danger"},{default:o(()=>t[17]||(t[17]=[e("i",{class:"ri-close-line align-bottom"},null,-1),n(" Cancel ")])),_:1}),l(p,{type:"submit",variant:"primary"},{default:o(()=>t[18]||(t[18]=[n("Add Job")])),_:1})])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const U=C(j,[["render",E]]);export{U as default};
