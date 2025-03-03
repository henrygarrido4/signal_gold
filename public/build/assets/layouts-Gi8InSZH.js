import{C as h}from"./component-GK_D4hhz.js";/* empty css                  */import{s as S}from"./default-Jr7rUdQV.js";import{L as _}from"./main-BZMVmuB9.js";import{P as C}from"./page-header-CWp0LBfO.js";import{C as E}from"./card-header-CUdfcL6r.js";import{_ as k}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{r as d,c as N,w as t,o as z,a as l,f as o,h as s}from"./app-BWABJYdq.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-dark-BbIT5rJd.js";import"./logo-light-BfYujB8V.js";import"./prism-DW4a_EzJ.js";const U={data(){return{value:null,value1:null,value5:null,value2:null,value3:null,value4:null,config:{wrap:!0,altFormat:"M j, Y",altInput:!0,dateFormat:"d M, Y"},date:null,date1:null,date3:null}},components:{Layout:_,PageHeader:C,CardHeader:E,Multiselect:S,flatPickr:h}},L={class:"live-preview"},P={class:"mb-3"},V={class:"mb-3"},A={class:"mb-3"},T={class:"mb-3"},D={class:"mb-3"},G={class:"mb-3"},M={class:"mb-3"},Z={class:"mb-3"},R={class:"text-end"},j={class:"text-muted"},H={class:"live-preview"},q={class:"form-check d-flex"},O={class:"text-end"},J={class:"live-preview"},W={class:"mb-3"},Y={class:"mb-3"},K={class:"mb-3"},Q={class:"mb-3"},X={class:"mb-3"},$={class:"text-end"},ll={class:"live-preview"},el={class:"text-end"},ol={class:"live-preview"},tl={class:"live-preview"},al={class:"live-preview"},sl={class:"input-group"},nl={class:"form-check d-flex"},rl={class:"input-group"},il={class:"col-auto"},dl={class:"form-check d-flex"},ml={class:"col-auto"},cl={class:"live-preview"},ul={class:"input-group"},pl={class:"form-check d-flex"},fl={class:"live-preview"},bl={class:"form-floating"},vl={class:"form-floating"},yl={class:"form-floating"},gl={class:"form-floating"},Il={class:"form-floating"},xl={class:"form-floating"},Fl={class:"form-floating"},wl={class:"form-floating"},Bl={class:"text-end"};function hl(Sl,e,_l,Cl,i,El){const x=d("PageHeader"),c=d("CardHeader"),n=d("BFormInput"),a=d("BCol"),v=d("Multiselect"),f=d("BButton"),r=d("BRow"),b=d("BForm"),u=d("BCardBody"),p=d("BCard"),F=d("router-link"),y=d("BFormCheckbox"),g=d("flat-pickr"),I=d("BFormTextarea"),w=d("BFormSelect"),B=d("Layout");return z(),N(B,null,{default:t(()=>[l(x,{title:"Form Layout",pagetitle:"Forms"}),l(r,null,{default:t(()=>[l(a,{xxl:"6"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Form Grid"}),l(u,null,{default:t(()=>[e[17]||(e[17]=o("p",{class:"text-muted"},[s(" More complex forms can be built using our grid classes. Use these for form layouts that require multiple columns, varied widths, and additional alignment options. "),o("span",{class:"fw-medium"},[s("Requires the "),o("code",null,"$enable-grid-classes"),s(" Sass variable to be enabled")]),s(" (on by default). ")],-1)),o("div",L,[l(b,{action:"javascript:void(0);"},{default:t(()=>[l(r,null,{default:t(()=>[l(a,{md:"6"},{default:t(()=>[o("div",P,[e[8]||(e[8]=o("label",{for:"firstNameinput",class:"form-label"},"First Name",-1)),l(n,{type:"text",class:"form-control",placeholder:"Enter your firstname",id:"firstNameinput"})])]),_:1}),l(a,{md:"6"},{default:t(()=>[o("div",V,[e[9]||(e[9]=o("label",{for:"lastNameinput",class:"form-label"},"Last Name",-1)),l(n,{type:"text",class:"form-control",placeholder:"Enter your lastname",id:"lastNameinput"})])]),_:1}),l(a,{md:"12"},{default:t(()=>[o("div",A,[e[10]||(e[10]=o("label",{for:"compnayNameinput",class:"form-label"},"Company Name",-1)),l(n,{type:"text",class:"form-control",placeholder:"Enter company name",id:"compnayNameinput"})])]),_:1}),l(a,{md:"6"},{default:t(()=>[o("div",T,[e[11]||(e[11]=o("label",{for:"phonenumberInput",class:"form-label"},"Phone Number",-1)),l(n,{type:"tel",class:"form-control",placeholder:"+(245) 451 45123",id:"phonenumberInput"})])]),_:1}),l(a,{md:"6"},{default:t(()=>[o("div",D,[e[12]||(e[12]=o("label",{for:"emailidInput",class:"form-label"},"Email Address",-1)),l(n,{type:"email",class:"form-control",placeholder:"example@gamil.com",id:"emailidInput"})])]),_:1}),l(a,{md:"12"},{default:t(()=>[o("div",G,[e[13]||(e[13]=o("label",{for:"address1ControlTextarea",class:"form-label"},"Address",-1)),l(n,{type:"text",class:"form-control",placeholder:"Address 1",id:"address1ControlTextarea"})])]),_:1}),l(a,{md:"6"},{default:t(()=>[o("div",M,[e[14]||(e[14]=o("label",{for:"citynameInput",class:"form-label"},"City",-1)),l(n,{type:"email",class:"form-control",placeholder:"Enter your city",id:"citynameInput"})])]),_:1}),l(a,{md:"6"},{default:t(()=>[o("div",Z,[e[15]||(e[15]=o("label",{for:"ForminputState",class:"form-label"},"State",-1)),l(v,{modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=m=>i.value=m),"close-on-select":!0,searchable:!0,"create-option":!0,options:[{value:"choose",label:"Choose..."},{value:"...",label:"..."}]},null,8,["modelValue"])])]),_:1}),l(a,{lg:"12"},{default:t(()=>[o("div",R,[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[16]||(e[16]=[s(" Submit ")])),_:1})])]),_:1})]),_:1})]),_:1})]),e[18]||(e[18]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"375px"}},[s(""),o("code",null,`<BForm action="javascript:void(0);">
<div class="row">
<div class="col-6">
<div class="mb-3">
<label for="firstNameinput" class="form-label">First Name</label>
<BFormInput type="text" class="form-control" placeholder="Enter your firstname" id="firstNameinput">
</div>
</div><!--end col-->
<div class="col-6">
<div class="mb-3">
<label for="lastNameinput" class="form-label">Last Name</label>
<BFormInput type="text" class="form-control" placeholder="Enter your lastname" id="lastNameinput">
</div>
</div><!--end col-->
<div class="col-12">
<div class="mb-3">
<label for="compnayNameinput" class="form-label">Company Name</label>
<BFormInput type="text" class="form-control" placeholder="Enter company name" id="compnayNameinput">
</div>
</div><!--end col-->
<div class="col-6">
<div class="mb-3">
<label for="phonenumberInput" class="form-label">Phone Number</label>
<BFormInput type="tel" class="form-control" placeholder="+(245) 451 45123" id="phonenumberInput">
</div>
</div><!--end col-->
<div class="col-6">
<div class="mb-3">
<label for="emailidInput" class="form-label">Email Address</label>
<BFormInput type="email" class="form-control" placeholder="example@gamil.com" id="emailidInput">
</div>
</div><!--end col-->
<div class="col-12">
<div class="mb-3">
<label for="address1ControlBFormTextarea" class="form-label">Address</label>
<BFormInput type="text" class="form-control" placeholder="Address 1" id="address1ControlBFormTextarea">
</div>
</div><!--end col-->
<div class="col-6">
<div class="mb-3">
<label for="citynameInput" class="form-label">City</label>
<BFormInput type="email" class="form-control" placeholder="Enter your city" id="citynameInput">
</div>
</div><!--end col-->
<div class="col-6">
<div class="mb-3">
<label for="ForminputState" class="form-label">State</label>
<select id="ForminputState" class="form-select">
<option selected>Choose...</option>
<option>...</option>
</select>
</div>
</div><!--end col-->
<div class="col-lg-12">
<div class="text-end">
<button type="submit" class="btn btn-primary">Submit</button>
</div>
</div><!--end col-->
</div><!--end row-->
</BForm>`)])],-1))]),_:1})]),_:1})]),_:1}),l(a,{xxl:"6"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Gutters"}),l(u,null,{default:t(()=>[o("p",j,[e[20]||(e[20]=s(" By adding ")),l(F,{to:"/docs/5.1/layout/gutters/",class:"text-decoration-underline"},{default:t(()=>e[19]||(e[19]=[s("gutter modifier classes")])),_:1}),e[21]||(e[21]=s(", you can have control over the gutter width in as well the inline as block direction. ")),e[22]||(e[22]=o("span",{class:"fw-medium"},[s("Also requires the "),o("code",null,"$enable-grid-classes"),s(" Sass variable to be enabled")],-1)),e[23]||(e[23]=s(" (on by default). "))]),o("div",H,[l(b,{action:"javascript:void(0);",class:"row g-3"},{default:t(()=>[l(a,{md:"12"},{default:t(()=>[e[24]||(e[24]=o("label",{for:"fullnameInput",class:"form-label"},"Name",-1)),l(n,{type:"text",class:"form-control",id:"fullnameInput",placeholder:"Enter your name"})]),_:1}),l(a,{md:"6"},{default:t(()=>[e[25]||(e[25]=o("label",{for:"inputEmail4",class:"form-label"},"Email",-1)),l(n,{type:"email",class:"form-control",id:"inputEmail4",placeholder:"Email"})]),_:1}),l(a,{md:"6"},{default:t(()=>[e[26]||(e[26]=o("label",{for:"inputPassword4",class:"form-label"},"Password",-1)),l(n,{type:"password",class:"form-control",id:"inputPassword4",placeholder:"Password"})]),_:1}),l(a,{cols:"12"},{default:t(()=>[e[27]||(e[27]=o("label",{for:"inputAddress",class:"form-label"},"Address",-1)),l(n,{type:"text",class:"form-control",id:"inputAddress",placeholder:"1234 Main St"})]),_:1}),l(a,{cols:"12"},{default:t(()=>[e[28]||(e[28]=o("label",{for:"inputAddress2",class:"form-label"},"Address 2",-1)),l(n,{type:"text",class:"form-control",id:"inputAddress2",placeholder:"Apartment, studio, or floor"})]),_:1}),l(a,{md:"6"},{default:t(()=>[e[29]||(e[29]=o("label",{for:"inputCity",class:"form-label"},"City",-1)),l(n,{type:"text",class:"form-control",id:"inputCity",placeholder:"Enter your city"})]),_:1}),l(a,{md:"4"},{default:t(()=>[e[30]||(e[30]=o("label",{for:"inputState",class:"form-label"},"State",-1)),l(v,{modelValue:i.value2,"onUpdate:modelValue":e[1]||(e[1]=m=>i.value2=m),"close-on-select":!0,searchable:!0,"create-option":!0,options:[{value:"choose",label:"Choose..."},{value:"...",label:"..."}]},null,8,["modelValue"])]),_:1}),l(a,{md:"2"},{default:t(()=>[e[31]||(e[31]=o("label",{for:"inputZip",class:"form-label"},"Zip",-1)),l(n,{type:"text",class:"form-control",id:"inputZip",placeholder:"Zin code"})]),_:1}),l(a,{cols:"12"},{default:t(()=>[o("div",q,[l(y,{class:"form-check-input",type:"checkbox",id:"gridCheck"}),e[32]||(e[32]=o("label",{class:"form-check-label",for:"gridCheck"}," Check me out ",-1))])]),_:1}),l(a,{cols:"12"},{default:t(()=>[o("div",O,[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[33]||(e[33]=[s(" Sign in ")])),_:1})])]),_:1})]),_:1})]),e[34]||(e[34]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"375px"}},[s(""),o("code",null,`<BForm action="javascript:void(0);" class="row g-3">
<div class="col-md-12">
<label for="fullnameInput" class="form-label">Name</label>
<BFormInput type="text" class="form-control" id="fullnameInput" placeholder="Enter your name">
</div>
<div class="col-md-6">
<label for="inputEmail4" class="form-label">Email</label>
<BFormInput type="email" class="form-control" id="inputEmail4" placeholder="Email">
</div>
<div class="col-md-6">
<label for="inputPassword4" class="form-label">Password</label>
<BFormInput type="password" class="form-control" id="inputPassword4" placeholder="Password">
</div>
<div class="col-12">
<label for="inputAddress" class="form-label">Address</label>
<BFormInput type="text" class="form-control" id="inputAddress" placeholder="1234 Main St">
</div>
<div class="col-12">
<label for="inputAddress2" class="form-label">Address 2</label>
<BFormInput type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor">
</div>
<div class="col-md-6">
<label for="inputCity" class="form-label">City</label>
<BFormInput type="text" class="form-control" id="inputCity" placeholder="Enter your city">
</div>
<div class="col-md-4">
<label for="inputState" class="form-label">State</label>
<select id="inputState" class="form-select">
<option selected>Choose...</option>
<option>...</option>
</select>
</div>
<div class="col-md-2">
<label for="inputZip" class="form-label">Zip</label>
<BFormInput type="text" class="form-control" id="inputZip" placeholder="Zin code">
</div>
<div class="col-12">
<div class="form-check">
<BFormInput class="form-check-input" type="checkbox" id="gridCheck">
<label class="form-check-label" for="gridCheck">
Check me out
</label>
</div>
</div>
<div class="col-12">
<div class="text-end">
<button type="submit" class="btn btn-primary">Sign in</button>
</div>
</div>
</BForm>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1}),l(r,null,{default:t(()=>[l(a,{xxl:"6"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Vertical Form"}),l(u,null,{default:t(()=>[e[41]||(e[41]=o("p",{class:"text-muted"},[s(" Example of vertical form using "),o("code",null,"form-control"),s(" class. No need to specify row and col class to create vertical form. ")],-1)),o("div",J,[l(b,{action:"javascript:void(0);"},{default:t(()=>[o("div",W,[e[35]||(e[35]=o("label",{for:"employeeName",class:"form-label"},"Employee Name",-1)),l(n,{type:"text",class:"form-control",id:"employeeName",placeholder:"Enter emploree name"})]),o("div",Y,[e[36]||(e[36]=o("label",{for:"employeeUrl",class:"form-label"},"Employee Department URL",-1)),l(n,{type:"url",class:"form-control",id:"employeeUrl",placeholder:"Enter emploree url"})]),o("div",K,[e[37]||(e[37]=o("label",{for:"StartleaveDate",class:"form-label"},"Start Leave Date",-1)),l(g,{modelValue:i.date,"onUpdate:modelValue":e[2]||(e[2]=m=>i.date=m),class:"form-control"},null,8,["modelValue"])]),o("div",Q,[e[38]||(e[38]=o("label",{for:"EndleaveDate",class:"form-label"},"End Leave Date",-1)),l(g,{modelValue:i.date1,"onUpdate:modelValue":e[3]||(e[3]=m=>i.date1=m),class:"form-control"},null,8,["modelValue"])]),o("div",X,[e[39]||(e[39]=o("label",{for:"VertimeassageInput",class:"form-label"},"Message",-1)),l(I,{class:"form-control",id:"VertimeassageInput",rows:"3",placeholder:"Enter your message"})]),o("div",$,[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[40]||(e[40]=[s(" Add Leave ")])),_:1})])]),_:1})]),e[42]||(e[42]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"375px"}},[s(""),o("code",null,`<BForm action="">
<div class="mb-3">
<label for="employeeName" class="form-label">Employee Name</label>
<BFormInput type="text" class="form-control" id="employeeName" placeholder="Enter emploree name">
</div>
<div class="mb-3">
<label for="employeeUrl" class="form-label">Employee Department URL</label>
<BFormInput type="url" class="form-control" id="employeeUrl" placeholder="Enter emploree url">
</div>
<div class="mb-3">
<label for="StartleaveDate" class="form-label">Start Leave Date</label>
<BFormInput type="date" class="form-control" id="StartleaveDate">
</div>
<div class="mb-3">
<label for="EndleaveDate" class="form-label">End Leave Date</label>
<BFormInput type="date" class="form-control" id="EndleaveDate">
</div>
<div class="mb-3">
<label for="VertimeassageInput" class="form-label">Message</label>
<BFormTextarea class="form-control" id="VertimeassageInput" rows="3" placeholder="Enter your message"></BFormTextarea>
</div>
<div class="text-end">
<button type="submit" class="btn btn-primary">Add Leave</button>
</div>
</BForm>`)])],-1))]),_:1})]),_:1})]),_:1}),l(a,{xxl:"6"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Horizontal Form"}),l(u,null,{default:t(()=>[e[51]||(e[51]=o("p",{class:"text-muted"},[s(" Create horizontal forms with the grid by adding the "),o("code",null,"row"),s(" class to form groups and using the "),o("code",null,"col-*-*"),s(" class to specify the width of your labels and controls. Be sure to add "),o("code",null,"col-form-label"),s(" class to your "),o("code",null,"<label>"),s("s as well so they’re vertically centered with their associated form controls. ")],-1)),o("div",ll,[l(b,{action:"javascript:void(0);"},{default:t(()=>[l(r,{class:"mb-3"},{default:t(()=>[l(a,{lg:"3"},{default:t(()=>e[43]||(e[43]=[o("label",{for:"nameInput",class:"form-label"},"Name",-1)])),_:1}),l(a,{lg:"9"},{default:t(()=>[l(n,{type:"text",class:"form-control",id:"nameInput",placeholder:"Enter your name"})]),_:1})]),_:1}),l(r,{class:"mb-3"},{default:t(()=>[l(a,{lg:"3"},{default:t(()=>e[44]||(e[44]=[o("label",{for:"websiteUrl",class:"form-label"},"Website URL",-1)])),_:1}),l(a,{lg:"9"},{default:t(()=>[l(n,{type:"url",class:"form-control",id:"websiteUrl",placeholder:"Enter your url"})]),_:1})]),_:1}),l(r,{class:"mb-3"},{default:t(()=>[l(a,{lg:"3"},{default:t(()=>e[45]||(e[45]=[o("label",{for:"dateInput",class:"form-label"},"Date",-1)])),_:1}),l(a,{lg:"9"},{default:t(()=>[l(g,{modelValue:i.date3,"onUpdate:modelValue":e[4]||(e[4]=m=>i.date3=m),class:"form-control"},null,8,["modelValue"])]),_:1})]),_:1}),l(r,{class:"mb-3"},{default:t(()=>[l(a,{lg:"3"},{default:t(()=>e[46]||(e[46]=[o("label",{for:"timeInput",class:"form-label"},"Time",-1)])),_:1}),l(a,{lg:"9"},{default:t(()=>[l(n,{type:"time",class:"form-control","data-provider":"timepickr","data-time-basic":"true",id:"timeInput"})]),_:1})]),_:1}),l(r,{class:"mb-3"},{default:t(()=>[l(a,{lg:"3"},{default:t(()=>e[47]||(e[47]=[o("label",{for:"leaveemails",class:"form-label"},"Email Id",-1)])),_:1}),l(a,{lg:"9"},{default:t(()=>[l(n,{type:"email",class:"form-control",id:"leaveemails",placeholder:"Enter your email"})]),_:1})]),_:1}),l(r,{class:"mb-3"},{default:t(()=>[l(a,{lg:"3"},{default:t(()=>e[48]||(e[48]=[o("label",{for:"contactNumber",class:"form-label"},"Contact Number",-1)])),_:1}),l(a,{lg:"9"},{default:t(()=>[l(n,{type:"number",class:"form-control",id:"contactNumber",placeholder:"+91 9876543210"})]),_:1})]),_:1}),l(r,{class:"mb-3"},{default:t(()=>[l(a,{lg:"3"},{default:t(()=>e[49]||(e[49]=[o("label",{for:"meassageInput",class:"form-label"},"Message",-1)])),_:1}),l(a,{lg:"9"},{default:t(()=>[l(I,{class:"form-control",id:"meassageInput",rows:"3",placeholder:"Enter your message"})]),_:1})]),_:1}),o("div",el,[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[50]||(e[50]=[s(" Add Leave ")])),_:1})])]),_:1})]),e[52]||(e[52]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"375px"}},[s(""),o("code",null,`<BForm action="">
<div class="row mb-3">
<div class="col-lg-3">
<label for="nameInput" class="form-label">Name</label>
</div>
<div class="col-lg-9">
<BFormInput type="text" class="form-control" id="nameInput" placeholder="Enter your name">
</div>
</div>
<div class="row mb-3">
<div class="col-lg-3">
<label for="websiteUrl" class="form-label">Website URL</label>
</div>
<div class="col-lg-9">
<BFormInput type="url" class="form-control" id="websiteUrl" placeholder="Enter your url">
</div>
</div>
<div class="row mb-3">
<div class="col-lg-3">
<label for="dateInput" class="form-label">Date</label>
</div>
<div class="col-lg-9">
<BFormInput type="date" class="form-control" id="dateInput">
</div>
</div>
<div class="row mb-3">
<div class="col-lg-3">
<label for="timeInput" class="form-label">Time</label>
</div>
<div class="col-lg-9">
<BFormInput type="time" class="form-control" id="timeInput">
</div>
</div>
<div class="row mb-3">
<div class="col-lg-3">
<label for="leaveemails" class="form-label">Email Id</label>
</div>
<div class="col-lg-9">
<BFormInput type="email" class="form-control" id="leaveemails" placeholder="Enter your email">
</div>
</div>
<div class="row mb-3">
<div class="col-lg-3">
<label for="contactNumber" class="form-label">Contact Number</label>
</div>
<div class="col-lg-9">
<BFormInput type="number" class="form-control" id="contactNumber" placeholder="+91 9876543210">
</div>
</div>
<div class="row mb-3">
<div class="col-lg-3">
<label for="meassageInput" class="form-label">Message</label>
</div>
<div class="col-lg-9">
<BFormTextarea class="form-control" id="meassageInput" rows="3" placeholder="Enter your message"></BFormTextarea>
</div>
</div>
<div class="text-end">
<button type="submit" class="btn btn-primary">Add Leave</button>
</div>
</BForm>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1}),l(r,null,{default:t(()=>[l(a,{lg:"12"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Horizontal Form Label Sizing "}),l(u,null,{default:t(()=>[e[56]||(e[56]=o("p",{class:"text-muted"},[s(" Use "),o("code",null,"col-form-label-sm"),s(" class to set small size form label or "),o("code",null,"col-form-label-lg"),s(" class to set large size form label to <label>. No such class is required for the default size form label. ")],-1)),o("div",ol,[l(r,{class:"align-items-center g-3"},{default:t(()=>[l(a,{xxl:"4"},{default:t(()=>[l(r,null,{default:t(()=>[e[53]||(e[53]=o("label",{for:"colFormLabelSm",class:"col-sm-2 col-form-label col-form-label-sm"},"Email",-1)),l(a,{sm:"10"},{default:t(()=>[l(n,{type:"email",class:"form-control form-control-sm",id:"colFormLabelSm",placeholder:"col-form-label-sm"})]),_:1})]),_:1})]),_:1}),l(a,{xxl:"4"},{default:t(()=>[l(r,null,{default:t(()=>[e[54]||(e[54]=o("label",{for:"colFormLabel",class:"col-sm-2 col-form-label"},"Email",-1)),l(a,{sm:"10"},{default:t(()=>[l(n,{type:"email",class:"form-control",id:"colFormLabel",placeholder:"col-form-label"})]),_:1})]),_:1})]),_:1}),l(a,{xxl:"4"},{default:t(()=>[l(r,null,{default:t(()=>[e[55]||(e[55]=o("label",{for:"colFormLabelLg",class:"col-sm-2 col-form-label col-form-label-lg"},"Email",-1)),l(a,{sm:"10"},{default:t(()=>[l(n,{type:"email",class:"form-control form-control-lg",id:"colFormLabelLg",placeholder:"col-form-label-lg"})]),_:1})]),_:1})]),_:1})]),_:1})]),e[57]||(e[57]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"275px"}},[s(""),o("code",null,`<!-- Col Form Label Small -->
<div class="row">
<label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Email</label>
<div class="col-sm-10">
<BFormInput type="email" class="form-control form-control-sm" id="colFormLabelSm" placeholder="col-form-label-sm">
</div>
</div>`),s(`

`),o("code",null,`<!-- Col Form Label Default -->
<div class="row">
<label for="colFormLabel" class="col-sm-2 col-form-label">Email</label>
<div class="col-sm-10">
<BFormInput type="email" class="form-control" id="colFormLabel" placeholder="col-form-label">
</div>
</div>`),s(`

`),o("code",null,`<!-- Col Form Label Large -->
<div class="row">
<label for="lg" class="col-sm-2 col-form-label col-form-label-lg">Email</label>
<div class="col-sm-10">
<BFormInput type="email" class="form-control form-control-lg" id="colFormLabelSm" placeholder="col-form-label-lg">
</div>
</div>`)])],-1))]),_:1})]),_:1})]),_:1}),l(a,{lg:"12"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Column Sizing"}),l(u,null,{default:t(()=>[e[58]||(e[58]=o("p",{class:"text-muted"},[s(" Use "),o("code",null,"col-sm-"),s(" class with required size value to set column size as per your requirement. ")],-1)),o("div",tl,[l(r,{class:"g-3"},{default:t(()=>[l(a,{sm:"6"},{default:t(()=>[l(n,{type:"text",class:"form-control",placeholder:"Firstname","aria-label":"First-Name"})]),_:1}),l(a,{sm:"6"},{default:t(()=>[l(n,{type:"text",class:"form-control",placeholder:"Lastname","aria-label":"Last-Name"})]),_:1}),l(a,{sm:"4"},{default:t(()=>[l(n,{type:"text",class:"form-control",placeholder:"Email id","aria-label":"Email Id"})]),_:1}),l(a,{sm:"4"},{default:t(()=>[l(n,{type:"password",class:"form-control",placeholder:"Password","aria-label":"Password"})]),_:1}),l(a,{sm:"4"},{default:t(()=>[l(n,{type:"password",class:"form-control",placeholder:"Confirm Password","aria-label":"confirm-password"})]),_:1}),l(a,{sm:"7"},{default:t(()=>[l(n,{type:"text",class:"form-control",placeholder:"City","aria-label":"City"})]),_:1}),l(a,{sm:""},{default:t(()=>[l(n,{type:"text",class:"form-control",placeholder:"State","aria-label":"State"})]),_:1}),l(a,{sm:""},{default:t(()=>[l(n,{type:"text",class:"form-control",placeholder:"Zip","aria-label":"Zip"})]),_:1})]),_:1})]),e[59]||(e[59]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"275px"}},[s(""),o("code",null,`<div class="row g-3">
<div class="col-sm-6">
<BFormInput type="text" class="form-control" placeholder="Firstname" aria-label="First-Name">
</div><!--end col-->
<div class="col-sm-6">
<BFormInput type="text" class="form-control" placeholder="Lastname" aria-label="Last-Name">
</div><!--end col-->
<div class="col-sm-4">
<BFormInput type="text" class="form-control" placeholder="Email id" aria-label="Email Id">
</div><!--end col-->
<div class="col-sm-4">
<BFormInput type="password" class="form-control" placeholder="Password" aria-label="Password">
</div><!--end col-->
<div class="col-sm-4">
<BFormInput type="password" class="form-control" placeholder="Confirm Password" aria-label="confirm-password">
</div><!--end col-->
<div class="col-sm-7">
<BFormInput type="text" class="form-control" placeholder="City" aria-label="City">
</div><!--end col-->
<div class="col-sm">
<BFormInput type="text" class="form-control" placeholder="State" aria-label="State">
</div><!--end col-->
<div class="col-sm">
<BFormInput type="text" class="form-control" placeholder="Zip" aria-label="Zip">
</div><!--end col-->
</div><!--end row-->`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1}),l(r,null,{default:t(()=>[l(a,{lg:"12"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Auto Sizing"}),l(u,null,{default:t(()=>[e[72]||(e[72]=o("p",{class:"text-muted"},[s(" Change "),o("code",null,"col"),s(" class to "),o("code",null,"col-auto"),s(" class so that your columns only take up as much space as needed. Put another way, the column sizes itself based on the contents. ")],-1)),o("div",al,[l(b,{action:"javascript:void(0);"},{default:t(()=>[l(r,{class:"gy-2 gx-3 mb-3 align-items-center"},{default:t(()=>[l(a,{sm:"auto"},{default:t(()=>[e[60]||(e[60]=o("label",{class:"visually-hidden",for:"autoSizingInput"},"Name",-1)),l(n,{type:"text",class:"form-control",id:"autoSizingInput",placeholder:"Jane Doe"})]),_:1}),l(a,{sm:"auto"},{default:t(()=>[e[62]||(e[62]=o("label",{class:"visually-hidden",for:"autoSizingInputGroup"},"Username",-1)),o("div",sl,[e[61]||(e[61]=o("div",{class:"input-group-text"},"@",-1)),l(n,{type:"text",class:"form-control",id:"autoSizingInputGroup",placeholder:"Username"})])]),_:1}),l(a,{sm:"auto"},{default:t(()=>[e[63]||(e[63]=o("label",{class:"visually-hidden",for:"autoSizingSelect"},"Preference",-1)),l(v,{class:"w-lg",modelValue:i.value3,"onUpdate:modelValue":e[5]||(e[5]=m=>i.value3=m),"close-on-select":!0,searchable:!0,"create-option":!0,options:[{value:"1",label:"One"},{value:"2",label:"Two"},{value:"3",label:"Three"}]},null,8,["modelValue"])]),_:1}),l(a,{sm:"auto"},{default:t(()=>[o("div",nl,[l(y,{class:"form-check-input",type:"checkbox",id:"autoSizingCheck"}),e[64]||(e[64]=o("label",{class:"form-check-label",for:"autoSizingCheck"}," Remember me ",-1))])]),_:1}),l(a,{sm:"auto"},{default:t(()=>[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[65]||(e[65]=[s(" Submit ")])),_:1})]),_:1})]),_:1})]),_:1}),l(b,{action:"javascript:void(0);"},{default:t(()=>[l(r,{class:"gx-3 gy-2 align-items-center"},{default:t(()=>[l(a,{sm:"3"},{default:t(()=>[e[66]||(e[66]=o("label",{class:"visually-hidden",for:"specificSizeInputName"},"Name",-1)),l(n,{type:"text",class:"form-control",id:"specificSizeInputName",placeholder:"Jane Doe"})]),_:1}),l(a,{sm:"3"},{default:t(()=>[e[68]||(e[68]=o("label",{class:"visually-hidden",for:"specificSizeInputGroupUsername"},"Username",-1)),o("div",rl,[e[67]||(e[67]=o("div",{class:"input-group-text"},"@",-1)),l(n,{type:"text",class:"form-control",id:"specificSizeInputGroupUsername",placeholder:"Username"})])]),_:1}),l(a,{sm:"3"},{default:t(()=>[e[69]||(e[69]=o("label",{class:"visually-hidden",for:"specificSizeSelect"},"Preference",-1)),l(v,{modelValue:i.value4,"onUpdate:modelValue":e[6]||(e[6]=m=>i.value4=m),"close-on-select":!0,searchable:!0,"create-option":!0,options:[{value:"1",label:"One"},{value:"2",label:"Two"},{value:"3",label:"Three"}]},null,8,["modelValue"])]),_:1}),o("div",il,[o("div",dl,[l(y,{class:"form-check-input",type:"checkbox",id:"autoSizingCheck2"}),e[70]||(e[70]=o("label",{class:"form-check-label",for:"autoSizingCheck2"}," Remember me ",-1))])]),o("div",ml,[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[71]||(e[71]=[s(" Submit ")])),_:1})])]),_:1})]),_:1})]),e[73]||(e[73]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"275px"}},[s(""),o("code",null,`<BForm action="javascript:void(0);">
<div class="row gy-2 gx-3 mb-3 align-items-center">
<div class="col-sm-auto">
<label class="visually-hidden" for="autoSizingInput">Name</label>
<BFormInput type="text" class="form-control" id="autoSizingInput" placeholder="Jane Doe">
</div><!--end col-->
<div class="col-sm-auto">
<label class="visually-hidden" for="autoSizingInputGroup">Username</label>
<div class="input-group">
<div class="input-group-text">@</div>
<BFormInput type="text" class="form-control" id="autoSizingInputGroup" placeholder="Username">
</div>
</div><!--end col-->
<div class="col-sm-auto">
<label class="visually-hidden" for="autoSizingSelect">Preference</label>
<select class="form-select" id="autoSizingSelect">
<option selected>Choose...</option>
<option value="1">One</option>
<option value="2">Two</option>
<option value="3">Three</option>
</select>
</div><!--end col-->
<div class="col-sm-auto">
<div class="form-check">
<BFormInput class="form-check-input" type="checkbox" id="autoSizingCheck">
<label class="form-check-label" for="autoSizingCheck">
Remember me
</label>
</div>
</div><!--end col-->
<div class="col-sm-auto">
<button type="submit" class="btn btn-primary">Submit</button>
</div><!--end col-->
</div><!--end row-->
</BForm>`),s(`

`),o("code",null,`<BForm>
<div class="row gx-3 gy-2 align-items-center">
<div class="col-sm-3">
<label class="visually-hidden" for="specificSizeInputName">Name</label>
<BFormInput type="text" class="form-control" id="specificSizeInputName" placeholder="Jane Doe">
</div><!--end col-->
<div class="col-sm-3">
<label class="visually-hidden" for="specificSizeInputGroupUsername">Username</label>
<div class="input-group">
<div class="input-group-text">@</div>
<BFormInput type="text" class="form-control" id="specificSizeInputGroupUsername" placeholder="Username">
</div>
</div><!--end col-->
<div class="col-sm-3">
<label class="visually-hidden" for="specificSizeSelect">Preference</label>
<Multiselect class="form-select" id="specificSizeSelect">
<option selected>Choose...</option>
<option value="1">One</option>
<option value="2">Two</option>
<option value="3">Three</option>
</Multiselect>
</div><!--end col-->
<div class="col-auto">
<div class="form-check">
<BFormInput class="form-check-input" type="checkbox" id="autoSizingCheck2">
<label class="form-check-label" for="autoSizingCheck2">
Remember me
</label>
</div>
</div><!--end col-->
<div class="col-auto">
<button type="submit" class="btn btn-primary">Submit</button>
</div><!--end col-->
</div>
</BForm>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1}),l(r,null,{default:t(()=>[l(a,{lg:"12"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Inline Forms"}),l(u,null,{default:t(()=>[e[79]||(e[79]=o("p",{class:"text-muted"},[s(" Use "),o("code",null,"row-cols-*"),s(" class to set form inline. ")],-1)),o("div",cl,[l(b,{action:"javascript:void(0);"},{default:t(()=>[l(r,{class:"row-cols-lg-auto g-3 align-items-center"},{default:t(()=>[l(a,{cols:"12"},{default:t(()=>[e[75]||(e[75]=o("label",{class:"visually-hidden",for:"inlineFormInputGroupUsername"},"Username",-1)),o("div",ul,[e[74]||(e[74]=o("div",{class:"input-group-text"},"@",-1)),l(n,{type:"text",class:"form-control",id:"inlineFormInputGroupUsername",placeholder:"Username"})])]),_:1}),l(a,{cols:"12"},{default:t(()=>[e[76]||(e[76]=o("label",{class:"visually-hidden",for:"inlineFormSelectPref"},"Preference",-1)),l(v,{class:"w-md",modelValue:i.value5,"onUpdate:modelValue":e[7]||(e[7]=m=>i.value5=m),"close-on-select":!0,searchable:!0,"create-option":!0,options:[{value:"1",label:"One"},{value:"2",label:"Two"},{value:"3",label:"Three"}]},null,8,["modelValue"])]),_:1}),l(a,{cols:"12"},{default:t(()=>[o("div",pl,[l(y,{class:"form-check-input",type:"checkbox",id:"inlineFormCheck"}),e[77]||(e[77]=o("label",{class:"form-check-label",for:"inlineFormCheck"}," Remember me ",-1))])]),_:1}),l(a,{cols:"12"},{default:t(()=>[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[78]||(e[78]=[s(" Submit ")])),_:1})]),_:1})]),_:1})]),_:1})]),e[80]||(e[80]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"275px"}},[s(""),o("code",null,`<BForm action="javascript:void(0);">
<div class="row row-cols-lg-auto g-3 align-items-center">
<div class="col-12">
<label class="visually-hidden" for="inlineFormInputGroupUsername">Username</label>
<div class="input-group">
<div class="input-group-text">@</div>
<BFormInput type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Username">
</div>
</div><!--end col-->
<div class="col-12">
<label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
<BFormSelect class="form-select" id="inlineFormSelectPref">
<option selected>Choose...</option>
<option value="1">One</option>
<option value="2">Two</option>
<option value="3">Three</option>
</BFormSelect>
</div><!--end col-->
<div class="col-12">
<div class="form-check">
<BFormInput class="form-check-input" type="checkbox" id="inlineFormCheck">
<label class="form-check-label" for="inlineFormCheck">
Remember me
</label>
</div>
</div><!--end col-->
<div class="col-12">
<button type="submit" class="btn btn-primary">Submit</button>
</div><!--end col-->
</div><!--end row-->
</BForm>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1}),l(r,null,{default:t(()=>[l(a,{lg:"12"},{default:t(()=>[l(p,{"no-body":""},{default:t(()=>[l(c,{title:"Floating Labels"}),l(u,null,{default:t(()=>[e[91]||(e[91]=o("p",{class:"text-muted"},[s(" Use "),o("code",null,"form-floating"),s(" class to enable floating labels with Bootstrap’s textual form fields. ")],-1)),o("div",fl,[l(b,{action:"#"},{default:t(()=>[l(r,{class:"g-3"},{default:t(()=>[l(a,{lg:"6"},{default:t(()=>[o("div",bl,[l(n,{type:"text",class:"form-control",id:"firstnamefloatingInput",placeholder:"Enter your firstname"}),e[81]||(e[81]=o("label",{for:"firstnamefloatingInput"},"First Name",-1))])]),_:1}),l(a,{lg:"6"},{default:t(()=>[o("div",vl,[l(n,{type:"text",class:"form-control",id:"lastnamefloatingInput",placeholder:"Enter your Lastname"}),e[82]||(e[82]=o("label",{for:"lastnamefloatingInput"},"Last Name",-1))])]),_:1}),l(a,{lg:"4"},{default:t(()=>[o("div",yl,[l(n,{type:"email",class:"form-control",id:"emailfloatingInput",placeholder:"Enter your email"}),e[83]||(e[83]=o("label",{for:"emailfloatingInput"},"Email Address",-1))])]),_:1}),l(a,{lg:"4"},{default:t(()=>[o("div",gl,[l(n,{type:"password",class:"form-control",id:"passwordfloatingInput",placeholder:"Enter your password"}),e[84]||(e[84]=o("label",{for:"passwordfloatingInput"},"Password",-1))])]),_:1}),l(a,{lg:"4"},{default:t(()=>[o("div",Il,[l(n,{type:"password",class:"form-control",id:"passwordfloatingInput1",placeholder:"Confirm password"}),e[85]||(e[85]=o("label",{for:"passwordfloatingInput1"},"Confirm Password",-1))])]),_:1}),l(a,{lg:"4"},{default:t(()=>[o("div",xl,[l(n,{type:"text",class:"form-control",id:"cityfloatingInput",placeholder:"Enter your city"}),e[86]||(e[86]=o("label",{for:"cityfloatingInput"},"City",-1))])]),_:1}),l(a,{lg:"4"},{default:t(()=>[o("div",Fl,[l(w,null,{default:t(()=>e[87]||(e[87]=[o("option",{value:""},"Choose...",-1),o("option",{value:"1"},"USA",-1),o("option",{value:"2"},"Brazil",-1),o("option",{value:"3"},"France",-1),o("option",{value:"4"},"Germany",-1)])),_:1}),e[88]||(e[88]=o("label",{for:"floatingSelect"},"Country",-1))])]),_:1}),l(a,{lg:"4"},{default:t(()=>[o("div",wl,[l(n,{type:"number",class:"form-control",id:"zipfloatingInput",placeholder:"Enter your zipcode"}),e[89]||(e[89]=o("label",{for:"zipfloatingInput"},"Zipcode",-1))])]),_:1}),l(a,{lg:"12"},{default:t(()=>[o("div",Bl,[l(f,{type:"submit",variant:"primary"},{default:t(()=>e[90]||(e[90]=[s(" Submit ")])),_:1})])]),_:1})]),_:1})]),_:1})]),e[92]||(e[92]=o("div",{class:"d-none code-view"},[o("pre",{class:"language-markup",style:{height:"275px"}},[s(""),o("code",null,`<BForm action="#">
<div class="row g-3">
<div class="col-lg-6">
<div class="form-floating">
<BFormInput type="text" class="form-control" id="firstnamefloatingInput" placeholder="Enter your firstname">
<label for="firstnamefloatingInput">First Name</label>
</div>
</div>
<div class="col-lg-6">
<div class="form-floating">
<BFormInput type="text" class="form-control" id="lastnamefloatingInput" placeholder="Enter your Lastname">
<label for="lastnamefloatingInput">Last Name</label>
</div>
</div>
<div class="col-lg-4">
<div class="form-floating">
<BFormInput type="email" class="form-control" id="emailfloatingInput" placeholder="Enter your email">
<label for="emailfloatingInput">Email Address</label>
</div>
</div>
<div class="col-lg-4">
<div class="form-floating">
<BFormInput type="password" class="form-control" id="passwordfloatingInput" placeholder="Enter your password">
<label for="passwordfloatingInput">Password</label>
</div>
</div>
<div class="col-lg-4">
<div class="form-floating">
<BFormInput type="password" class="form-control" id="passwordfloatingInput1" placeholder="Confirm password">
<label for="passwordfloatingInput1">Confirm Password</label>
</div>
</div>
<div class="col-lg-4">
<div class="form-floating">
<BFormInput type="text" class="form-control" id="cityfloatingInput" placeholder="Enter your city">
<label for="cityfloatingInput">City</label>
</div>
</div>
<div class="col-lg-4">
<div class="form-floating">
<BFormSelect class="form-select" id="floatingSelect" aria-label="Floating label select example">
<option selected>USA</option>
<option value="1">Brazil</option>
<option value="2">France</option>
<option value="3">Germany</option>
</BFormSelect>
<label for="floatingSelect">Country</label>
</div>
</div>
<div class="col-lg-4">
<div class="form-floating">
<BFormInput type="number" class="form-control" id="zipfloatingInput" placeholder="Enter your zipcode">
<label for="zipfloatingInput">Zipcode</label>
</div>
</div>
<div class="col-lg-12">
<div class="text-end">
<button type="submit" class="btn btn-primary">Submit</button>
</div>
</div>
</div>
</BForm>`)])],-1))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const Ol=k(U,[["render",hl]]);export{Ol as default};
