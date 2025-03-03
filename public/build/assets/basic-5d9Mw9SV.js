import{j as x,Z as b,r as o,d as _,a as s,f as e,i as h,w as l,F as y,o as w,h as d,t as B}from"./app-BWABJYdq.js";import{_ as C}from"./logo-light-BfYujB8V.js";import{_ as L}from"./_plugin-vue_export-helper-DlAUqK2U.js";const N={methods:{getInputElement(n){return document.getElementById("digit"+n+"-input")},moveToNext(n){this.getInputElement(n).value.length===1&&(n!==4?this.getInputElement(n+1).focus():(this.getInputElement(n).blur(),console.log("submit code")))}},components:{Link:x,Head:b}},T={class:"auth-page-wrapper pt-5"},k={class:"auth-page-content"},D={class:"text-center mt-sm-5 mb-4 text-white-50"},E={class:"p-2 mt-4"},V={class:"mb-3"},I={class:"mb-3"},K={class:"mb-3"},$={class:"mb-3"},F={class:"mt-3"},H={class:"mt-4 text-center"},R={class:"mb-0"},S={class:"footer"},j={class:"text-center"},z={class:"mb-0 text-muted"};function P(n,t,Y,A,M,a){const g=o("Head"),u=o("Link"),i=o("BCol"),r=o("BRow"),c=o("BButton"),f=o("BCardBody"),v=o("BCard"),p=o("BContainer");return w(),_(y,null,[s(g,{title:"Two Step Verification"}),e("div",T,[t[17]||(t[17]=h('<div class="auth-one-bg-position auth-one-bg" id="auth-particles"><div class="bg-overlay"></div><div class="shape"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120"><path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path></svg></div></div>',1)),e("div",k,[s(p,null,{default:l(()=>[s(r,null,{default:l(()=>[s(i,{lg:"12"},{default:l(()=>[e("div",D,[e("div",null,[s(u,{href:"/",class:"d-inline-block auth-logo"},{default:l(()=>t[4]||(t[4]=[e("img",{src:C,alt:"",height:"20"},null,-1)])),_:1})]),t[5]||(t[5]=e("p",{class:"mt-3 fs-15 fw-medium"},"Premium Admin & Dashboard Template",-1))])]),_:1})]),_:1}),s(r,{class:"justify-content-center"},{default:l(()=>[s(i,{md:"8",lg:"6",xl:"5"},{default:l(()=>[s(v,{"no-body":"",class:"mt-4"},{default:l(()=>[s(f,{class:"p-4"},{default:l(()=>[t[12]||(t[12]=e("div",{class:"mb-4"},[e("div",{class:"avatar-lg mx-auto"},[e("div",{class:"avatar-title bg-light text-primary display-5 rounded-circle"},[e("i",{class:"ri-mail-line"})])])],-1)),e("div",E,[t[11]||(t[11]=e("div",{class:"text-muted text-center mb-4 mx-lg-3"},[e("h4",{class:""},"Verify Your Email"),e("p",null,[d("Please enter the 4 digit code sent to "),e("span",{class:"fw-semibold"},"example@abc.com")])],-1)),e("form",null,[s(r,null,{default:l(()=>[s(i,{cols:"3"},{default:l(()=>[e("div",V,[t[6]||(t[6]=e("label",{for:"digit1-input",class:"visually-hidden"},"Dight 1",-1)),e("input",{type:"text",class:"form-control form-control-lg bg-light border-light text-center",onKeyup:t[0]||(t[0]=m=>a.moveToNext(1)),maxLength:"1",id:"digit1-input"},null,32)])]),_:1}),s(i,{cols:"3"},{default:l(()=>[e("div",I,[t[7]||(t[7]=e("label",{for:"digit2-input",class:"visually-hidden"},"Dight 2",-1)),e("input",{type:"text",class:"form-control form-control-lg bg-light border-light text-center",onKeyup:t[1]||(t[1]=m=>a.moveToNext(2)),maxLength:"1",id:"digit2-input"},null,32)])]),_:1}),s(i,{cols:"3"},{default:l(()=>[e("div",K,[t[8]||(t[8]=e("label",{for:"digit3-input",class:"visually-hidden"},"Dight 3",-1)),e("input",{type:"text",class:"form-control form-control-lg bg-light border-light text-center",onKeyup:t[2]||(t[2]=m=>a.moveToNext(3)),maxLength:"1",id:"digit3-input"},null,32)])]),_:1}),s(i,{cols:"3"},{default:l(()=>[e("div",$,[t[9]||(t[9]=e("label",{for:"digit4-input",class:"visually-hidden"},"Dight 4",-1)),e("input",{type:"text",class:"form-control form-control-lg bg-light border-light text-center",onKeyup:t[3]||(t[3]=m=>a.moveToNext(4)),maxLength:"1",id:"digit4-input"},null,32)])]),_:1})]),_:1})]),e("div",F,[s(c,{type:"button",variant:"secondary",class:"w-100"},{default:l(()=>t[10]||(t[10]=[d("Confirm")])),_:1})])])]),_:1})]),_:1}),e("div",H,[e("p",R,[t[14]||(t[14]=d("Didn't receive a code ? ")),s(u,{href:"/auth/reset-pwd-basic",class:"fw-semibold text-primary text-decoration-underline"},{default:l(()=>t[13]||(t[13]=[d("Resend")])),_:1})])])]),_:1})]),_:1})]),_:1})]),e("footer",S,[s(p,null,{default:l(()=>[s(r,null,{default:l(()=>[s(i,{lg:"12"},{default:l(()=>[e("div",j,[e("p",z,[d("© "+B(new Date().getFullYear())+" Velzon. Crafted with ",1),t[15]||(t[15]=e("i",{class:"mdi mdi-heart text-danger"},null,-1)),t[16]||(t[16]=d(" by Themesbrand"))])])]),_:1})]),_:1})]),_:1})])])],64)}const J=L(N,[["render",P]]);export{J as default};
