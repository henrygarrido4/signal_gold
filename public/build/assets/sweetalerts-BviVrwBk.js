import{S as n}from"./sweetalert2.esm.all-CumHaNCI.js";import{L as y}from"./main-BZMVmuB9.js";import{P as w}from"./page-header-CWp0LBfO.js";import{_ as x}from"./logo-dark-BbIT5rJd.js";import{_ as k}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{r as u,c as h,w as i,o as v,a as s,h as l,f as e}from"./app-BWABJYdq.js";import"./simplebar-vue.esm-CZuBtKrH.js";import"./avatar-2-C9CWE8xV.js";import"./avatar-3-CcIxMpdW.js";import"./avatar-5-BPjc6EDL.js";import"./russia-pMTSjNGF.js";import"./logo-signal-9z7U6Iga.js";import"./logo-light-BfYujB8V.js";const A={components:{Layout:y,PageHeader:w},methods:{showAlert(){n.fire("Any fool can use a computer!")},titleText(){n.fire("The Internet?","That thing is still around?","question")},successmsg(){n.fire("Good job!","You clicked the button!","success")},position(){n.fire({position:"top-end",icon:"success",title:"Your work has been saved",showConfirmButton:!1,timer:1500})},confirm(){n.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#34c38f",cancelButtonColor:"#f46a6a",confirmButtonText:"Yes, delete it!"}).then(o=>{o.value&&n.fire("Deleted!","Your file has been deleted.","success")})},cancel(){const o=n.mixin({customClass:{confirmButton:"btn btn-success",cancelButton:"btn btn-danger ml-2"},buttonsStyling:!1});o.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",confirmButtonText:"Yes, delete it!",cancelButtonText:"No, cancel!",showCancelButton:!0}).then(t=>{t.value?o.fire("Deleted!","Your file has been deleted.","success"):t.dismiss===n.DismissReason.cancel&&o.fire("Cancelled","Your imaginary file is safe :)","error")})},saError(){n.fire({title:"Oops...",text:"Something went wrong!",icon:"error",customClass:{confirmButton:"btn btn-primary w-xs mt-2"},buttonsStyling:!1,footer:'<BLink href="">Why do I have this issue?</BLink>',showCloseButton:!0})},content(){n.fire({imageUrl:"https://placeholder.pics/svg/300x1500",imageHeight:1500,imageAlt:"A tall image",customClass:{confirmButton:"btn btn-primary w-xs mt-2"},buttonsStyling:!1,showCloseButton:!0})},threeButton(){n.fire({title:"Do you want to save the changes?",showDenyButton:!0,showCancelButton:!0,confirmButtonText:"Save",customClass:{confirmButton:"btn btn-success w-xs me-2",cancelButton:"btn btn-danger w-xs",denyButton:"btn btn-info w-xs me-2"},buttonsStyling:!1,denyButtonText:"Don't save",showCloseButton:!0}).then(function(o){o.isConfirmed?n.fire({title:"Saved!",icon:"success",confirmButtonClass:"btn btn-primary w-xs",buttonsStyling:!1}):o.isDenied&&n.fire({title:"Changes are not saved",icon:"info",customClass:{confirmButton:"btn btn-primary w-xs"},buttonsStyling:!1})})},imageHeader(){n.fire({title:"Sweet!",text:"Modal with a custom image.",imageUrl:x,imageHeight:20,confirmButtonColor:"#556ee6"})},timer(){let o;n.fire({title:"Auto close alert!",html:"I will close in <b></b> milliseconds.",timer:2e3,timerProgressBar:!0,onBeforeOpen:()=>{n.showLoading(),o=setInterval(()=>{n.getContent().querySelector("b").textContent=n.getTimerLeft()},100)},onClose:()=>{clearInterval(o)}}).then(t=>{t.dismiss===n.DismissReason.timer&&console.log("I was closed by the timer")})},custom(){n.fire({title:"<i>HTML</i> <u>example</u>",icon:"info",html:'You can use <b>bold text</b>, <BLink href="//Themesbrand.in/">links</BLink> and other HTML tags',showCancelButton:!0,customClass:{cancelButton:"btn btn-danger",confirmButton:"btn btn-success me-2"},buttonsStyling:!1,confirmButtonText:'<i class="ri-thumb-up-fill align-bottom me-1"></i> Great!',cancelButtonText:'<i class="ri-thumb-down-fill align-bottom"></i>'})},customBackground(){n.fire({title:"Custom width, padding, background.",width:600,padding:100,confirmButtonColor:"#556ee6",background:"#fff url(//subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/geometry.png)"})},ajax(){n.fire({title:"Submit email to run ajax request",input:"email",showCancelButton:!0,confirmButtonText:"Submit",showLoaderOnConfirm:!0,confirmButtonColor:"#556ee6",cancelButtonColor:"#f46a6a",preConfirm:o=>new Promise(function(t,m){setTimeout(function(){o==="taken@example.com"?Promise.reject(new Error("This email is already taken.")):t()},2e3)}),allowOutsideClick:!1}).then(o=>{n.fire({title:"Ajax request finished!",html:"Submitted email: "+o})})},chain(){n.mixin({input:"text",confirmButtonText:"Next &rarr;",showCancelButton:!0,confirmButtonColor:"#556ee6",cancelButtonColor:"#74788d",progressSteps:["1","2","3"]}).queue([{title:"Question 1",text:"Chaining swal2 modals is easy"},"Question 2","Question 3"]).then(o=>{o.value&&n.fire({title:"All done!",html:"Your answers: <pre><code>"+JSON.stringify(o.value)+"</code></pre>",confirmButtonText:"Lovely!"})})},dynamicQueue(){var o="https://api.ipify.org?format=json";n.queue([{title:"Your public IP",confirmButtonText:"Show my public IP",text:"Your public IP will be received via AJAX request",showLoaderOnConfirm:!0,preConfirm:()=>fetch(o).then(t=>t.json()).then(t=>n.insertQueueStep(t.ip)).catch(()=>{n.insertQueueStep({type:"error",title:"Unable to get your public IP"})})}])}}},T={class:"table-responsive"},S={class:"table table-nowrap align-middle justify-content-center mb-0"},_={class:"text-center"},L={class:"text-center"},z={class:"text-center"},H={class:"text-center"},I={class:"text-center"},Y={class:"text-center"},j={class:"text-center"},P={class:"text-center"},q={class:"text-center"},D={class:"text-center"},N={class:"text-center"},O={class:"text-center"},Q={class:"text-center"},E={class:"text-center"};function M(o,t,m,U,R,r){const d=u("PageHeader"),c=u("BCardTitle"),f=u("BCardHeader"),a=u("BButton"),p=u("BCardBody"),C=u("BCard"),b=u("BCol"),g=u("BRow"),B=u("Layout");return v(),h(B,null,{default:i(()=>[s(d,{title:"Sweet Alert",pageTitle:"Advance UI"}),s(g,null,{default:i(()=>[s(b,{lg:"12"},{default:i(()=>[s(C,{"no-body":""},{default:i(()=>[s(f,null,{default:i(()=>[s(c,{class:"mb-0"},{default:i(()=>t[0]||(t[0]=[l("Examples")])),_:1})]),_:1}),s(p,null,{default:i(()=>[t[30]||(t[30]=e("p",{class:"text-muted"}," Here are the various types of beautiful, responsive, customizable, and accessible sweet alerts. ",-1)),e("div",T,[e("table",S,[t[29]||(t[29]=e("thead",null,[e("tr",null,[e("th",{scope:"col",style:{width:"50%"}},"Sweet Alert Type"),e("th",{scope:"col",class:"text-center"}," Sweet Alert Examples ")])],-1)),e("tbody",null,[e("tr",null,[t[2]||(t[2]=e("td",null,"A Basic Message",-1)),e("td",_,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-basic",onClick:r.showAlert},{default:i(()=>t[1]||(t[1]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[4]||(t[4]=e("td",null,"A Title with a Text Under",-1)),e("td",L,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-title",onClick:r.titleText},{default:i(()=>t[3]||(t[3]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[6]||(t[6]=e("td",null,"A success message!",-1)),e("td",z,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-success",onClick:r.successmsg},{default:i(()=>t[5]||(t[5]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[8]||(t[8]=e("td",null," A modal with a title, an error icon, a text, and a footer ",-1)),e("td",H,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-error",onClick:r.saError},{default:i(()=>t[7]||(t[7]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[10]||(t[10]=e("td",null,"A modal window with a long content inside",-1)),e("td",I,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-longcontent",onClick:r.content},{default:i(()=>t[9]||(t[9]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[12]||(t[12]=e("td",null,' A warning message, with a function attached to the "Confirm"-button... ',-1)),e("td",Y,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-warning",onClick:r.confirm},{default:i(()=>t[11]||(t[11]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[14]||(t[14]=e("td",null,' By passing a parameter, you can execute something else for "Cancel". ',-1)),e("td",j,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-params",onClick:r.cancel},{default:i(()=>t[13]||(t[13]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[16]||(t[16]=e("td",null,"A message with custom Image Header",-1)),e("td",P,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-image",onClick:r.imageHeader},{default:i(()=>t[15]||(t[15]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[18]||(t[18]=e("td",null,"A message with auto close timer",-1)),e("td",q,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-close",onClick:r.timer},{default:i(()=>t[17]||(t[17]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[20]||(t[20]=e("td",null,"Custom HTML description and buttons",-1)),e("td",D,[s(a,{variant:"primary",size:"sm",type:"button",id:"custom-html-alert",onClick:r.custom},{default:i(()=>t[19]||(t[19]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[22]||(t[22]=e("td",null,"A dialog with three buttons",-1)),e("td",N,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-dialog-three-btn",onClick:r.threeButton},{default:i(()=>t[21]||(t[21]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[24]||(t[24]=e("td",null,"A custom positioned dialog",-1)),e("td",O,[s(a,{variant:"primary",size:"sm",type:"button",id:"sa-position",onClick:r.position},{default:i(()=>t[23]||(t[23]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[26]||(t[26]=e("td",null,"A message with custom width, padding and background",-1)),e("td",Q,[s(a,{variant:"primary",size:"sm",type:"button",id:"custom-padding-width-alert",onClick:r.customBackground},{default:i(()=>t[25]||(t[25]=[l(" Click me ")])),_:1},8,["onClick"])])]),e("tr",null,[t[28]||(t[28]=e("td",null,"Ajax request example",-1)),e("td",E,[s(a,{variant:"primary",size:"sm",type:"button",id:"ajax-alert",onClick:r.ajax},{default:i(()=>t[27]||(t[27]=[l(" Click me ")])),_:1},8,["onClick"])])])])])])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const it=k(A,[["render",M]]);export{it as default};
