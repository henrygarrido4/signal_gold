import{L as g}from"./main-BZMVmuB9.js";import{P as b}from"./page-header-CWp0LBfO.js";import{C as O}from"./card-header-CUdfcL6r.js";import{_ as S}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{r as p,c as w,w as t,o as T,a as l,f as n,h as o}from"./app-BWABJYdq.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-dark-BbIT5rJd.js";import"./logo-light-BfYujB8V.js";import"./prism-DW4a_EzJ.js";const V={components:{Layout:g,PageHeader:b,CardHeader:O},data(){return{exManualSelected:null,exMultiOptions:[{value:"a",text:"Open this select menu (select menu size)"},{value:"b",text:"One"},{value:"c",text:"Two"},{value:"d",text:"Three"},{value:"e",text:"Four"},{value:"f",text:"Five"}],exMultiSelected:["a"]}}},B={class:"live-preview"},M={class:"live-preview"},y={class:"live-preview"};function D(U,e,C,_,s,z){const c=p("PageHeader"),m=p("CardHeader"),u=p("BFormSelectOption"),d=p("BFormSelect"),i=p("BCol"),r=p("BRow"),f=p("BCardBody"),v=p("BCard"),x=p("Layout");return T(),w(x,null,{default:t(()=>[l(c,{title:"Form Select",pageTitle:"Forms"}),l(r,null,{default:t(()=>[l(i,{lg:"12"},{default:t(()=>[l(v,{"no-body":""},{default:t(()=>[l(m,{title:"Default Select"}),l(f,null,{default:t(()=>[e[19]||(e[19]=n("p",{class:"text-muted"},[o(" Use "),n("code",null,"<select>"),o(" attribute with numerous options to show value with choice's option. ")],-1)),n("div",B,[l(r,null,{default:t(()=>[l(i,{lg:"6"},{default:t(()=>[l(d,{modelValue:s.exManualSelected,"onUpdate:modelValue":e[0]||(e[0]=a=>s.exManualSelected=a),class:"mb-3","aria-label":"Default select example"},{default:t(()=>[l(u,{value:null},{default:t(()=>e[7]||(e[7]=[o("Select your Status")])),_:1}),l(u,{value:"1"},{default:t(()=>e[8]||(e[8]=[o("Declined Payment")])),_:1}),l(u,{value:"2"},{default:t(()=>e[9]||(e[9]=[o("Delivery Error")])),_:1}),l(u,{value:"3"},{default:t(()=>e[10]||(e[10]=[o("Wrong Amount")])),_:1})]),_:1},8,["modelValue"])]),_:1}),l(i,{lg:"6"},{default:t(()=>[l(d,{modelValue:s.exManualSelected,"onUpdate:modelValue":e[1]||(e[1]=a=>s.exManualSelected=a),class:"form-select rounded-pill mb-3","aria-label":"Default select example"},{default:t(()=>[l(u,{value:null},{default:t(()=>e[11]||(e[11]=[o("Search for services")])),_:1}),l(u,{value:"1"},{default:t(()=>e[12]||(e[12]=[o("Information Architecture")])),_:1}),l(u,{value:"2"},{default:t(()=>e[13]||(e[13]=[o("UI/UX Design")])),_:1}),l(u,{value:"3"},{default:t(()=>e[14]||(e[14]=[o("Back End Development")])),_:1})]),_:1},8,["modelValue"])]),_:1}),l(i,{lg:"6"},{default:t(()=>[l(d,{modelValue:s.exManualSelected,"onUpdate:modelValue":e[2]||(e[2]=a=>s.exManualSelected=a),class:"form-select","aria-label":"Disabled select example",disabled:""},{default:t(()=>[l(u,{value:null},{default:t(()=>e[15]||(e[15]=[o("Open this select menu (Disabled)")])),_:1}),l(u,{value:"1"},{default:t(()=>e[16]||(e[16]=[o("One")])),_:1}),l(u,{value:"2"},{default:t(()=>e[17]||(e[17]=[o("Two")])),_:1}),l(u,{value:"3"},{default:t(()=>e[18]||(e[18]=[o("Three")])),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),e[20]||(e[20]=n("div",{class:"d-none code-view"},[n("pre",{class:"language-markup"},[o(""),n("code",null,` <select class="form-select mb-3" aria-label="Default select example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>`),o(`

`),n("code",null,` <select class="form-select rounded-pill mb-3" aria-label="Default select example">
    <option selected>Search for services</option>
    <option value="1">Information Architecture</option>
    <option value="2">UI/UX Design</option>
    <option value="3">Back End Development</option>
</select>`),o(`

`),n("code",null,`<select class="form-select" aria-label="Disabled select example" disabled>
    <option selected>Open this select menu (Disabled)</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1}),l(r,null,{default:t(()=>[l(i,{lg:"12"},{default:t(()=>[l(v,{"no-body":""},{default:t(()=>[l(m,{title:"Menu Size"}),l(f,null,{default:t(()=>[e[22]||(e[22]=n("p",{class:"text-muted"},[o(" Use "),n("code",null,"multiple"),o(" attribute to select multiple values and "),n("code",null,'size="your value"'),o(" attribute to show a number of choice option within a select area. ")],-1)),n("div",M,[l(r,{class:"gy-4"},{default:t(()=>[l(i,{lg:"6"},{default:t(()=>[l(d,{class:"form-select",multiple:"","aria-label":"multiple select example"},{default:t(()=>e[21]||(e[21]=[n("option",{selected:""}," Open this select menu (multiple select option) ",-1),n("option",{value:"1"},"One",-1),n("option",{value:"2"},"Two",-1),n("option",{value:"3"},"Three",-1)])),_:1})]),_:1}),l(i,{lg:"6"},{default:t(()=>[l(d,{modelValue:s.exMultiSelected,"onUpdate:modelValue":e[3]||(e[3]=a=>s.exMultiSelected=a),options:s.exMultiOptions,multiple:"","select-size":3},null,8,["modelValue","options"])]),_:1})]),_:1})]),e[23]||(e[23]=n("div",{class:"d-none code-view"},[n("pre",{class:"language-markup",style:{height:"275px"}},[o(""),n("code",null,`<select class="form-select" multiple aria-label="multiple select example">
    <option selected>Open this select menu (multiple select option)</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>`),o(`

`),n("code",null,`<select class="form-select" size="3" aria-label="size 3 select example">
    <option selected>Open this select menu (select menu size)</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
    <option value="4">Four</option>
    <option value="5">Five</option>
</select>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1}),l(r,null,{default:t(()=>[l(i,{lg:"12"},{default:t(()=>[l(v,{"no-body":""},{default:t(()=>[l(m,{title:"Select Size"}),l(f,null,{default:t(()=>[e[36]||(e[36]=n("p",{class:"text-muted"},[o(" Use "),n("code",null,"form-select-sm"),o(" class to set small select size and "),n("code",null,"form-select-lg"),o(" class to form-select class to set large select size. No such class is required for default select size. ")],-1)),n("div",y,[l(r,{class:"align-items-center g-3"},{default:t(()=>[l(i,{lg:"4"},{default:t(()=>[l(d,{modelValue:s.exManualSelected,"onUpdate:modelValue":e[4]||(e[4]=a=>s.exManualSelected=a),class:"form-select-sm"},{default:t(()=>[l(u,{value:null},{default:t(()=>e[24]||(e[24]=[o("Open this select menu")])),_:1}),l(u,{value:"1"},{default:t(()=>e[25]||(e[25]=[o("One")])),_:1}),l(u,{value:"2"},{default:t(()=>e[26]||(e[26]=[o("Two")])),_:1}),l(u,{value:"3"},{default:t(()=>e[27]||(e[27]=[o("Three")])),_:1})]),_:1},8,["modelValue"])]),_:1}),l(i,{lg:"4"},{default:t(()=>[l(d,{modelValue:s.exManualSelected,"onUpdate:modelValue":e[5]||(e[5]=a=>s.exManualSelected=a),class:"form-select"},{default:t(()=>[l(u,{value:null},{default:t(()=>e[28]||(e[28]=[o("Open this select menu")])),_:1}),l(u,{value:"1"},{default:t(()=>e[29]||(e[29]=[o("One")])),_:1}),l(u,{value:"2"},{default:t(()=>e[30]||(e[30]=[o("Two")])),_:1}),l(u,{value:"3"},{default:t(()=>e[31]||(e[31]=[o("Three")])),_:1})]),_:1},8,["modelValue"])]),_:1}),l(i,{lg:"4"},{default:t(()=>[l(d,{modelValue:s.exManualSelected,"onUpdate:modelValue":e[6]||(e[6]=a=>s.exManualSelected=a),class:"form-select-lg"},{default:t(()=>[l(u,{value:null},{default:t(()=>e[32]||(e[32]=[o("Open this select menu")])),_:1}),l(u,{value:"1"},{default:t(()=>e[33]||(e[33]=[o("One")])),_:1}),l(u,{value:"2"},{default:t(()=>e[34]||(e[34]=[o("Two")])),_:1}),l(u,{value:"3"},{default:t(()=>e[35]||(e[35]=[o("Three")])),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),e[37]||(e[37]=n("div",{class:"d-none code-view"},[n("pre",{class:"language-markup",style:{height:"275px"}},[n("code",null,`<select class="form-select form-select-sm  mb-3" aria-label=".form-select-sm example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>`),o(`

`),n("code",null,`<select class="form-select mb-3" aria-label=".form-select-lg example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>`),o(`

`),n("code",null,`<select class="form-select form-select-lg" aria-label=".form-select-lg example">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
</select>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const G=S(V,[["render",D]]);export{G as default};
