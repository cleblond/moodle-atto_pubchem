YUI.add("moodle-atto_pubchem-button",function(e,t){var n="atto_pubchem",r="pubchem_width",i="pubchem_height",s="atto_pubchem",o={INPUTSUBMIT:"atto_media_urlentrysubmit",INPUTCANCEL:"atto_media_urlentrycancel",WIDTHCONTROL:"widthcontrol",HEIGHTCONTROL:"heightcontrol"},u={WIDTHCONTROL:".widthcontrol",HEIGHTCONTROL:".heightcontrol"},a='<form class="atto_form"><div id="{{elementid}}_{{innerform}}" class="left-align"><strong>{{get_string "instructions" component}}</strong><br><input type="radio" name="database" id="pubchem" value="pubchem"><label for="pubchem">PubChem   </label><input type="radio" name="database" id="rcsb" value="rcsb"><label for="rcsb">RCSB PDB</label><table><tr><td><label for="{{elementid}}_{{WIDTHCONTROL}}">{{get_string "search" component}}</label></td><td><input class="pubchemsearch" size="60" id="pubchemsearch" name="pubchemsearch"value="{{defaultsearch}}" /></td><td><button class="{{CSS.INPUTSUBMIT}}">{{get_string "searchbutton" component}}</button></td><td><button class="pubchem_insert">{{get_string "insertbutton" component}}</button></td></tr></table></div></form>';IMAGETEMPLATE='<img src="{{url}}" alt="{{alt}}" {{#if width}}width="{{width}}" {{/if}}{{#if height}}height="{{height}}" {{/if}}{{#if presentation}}role="presentation" {{/if}}style="{{alignment}}{{margin}}{{customstyle}}"{{#if classlist}}class="{{classlist}}" {{/if}}{{#if id}}id="{{id}}" {{/if}}/>',e.namespace("M.atto_pubchem").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{_usercontextid:null,_filename:null,_form:null,initializer:function(e){this._usercontextid=e.usercontextid;var t=(new Date).getTime();this._filename=t;var n=this.get("host"),r=n.get("filepickeroptions");if(!r.image||!r.image.itemid)return;this._itemid=r.image.itemid;if(this.get("disabled"))return;this.addButton({icon:"icon",iconComponent:"atto_pubchem",buttonName:"icon",callback:this._displayDialogue,callbackArgs:"icon"})},_displayDialogue:function(t,r){t.preventDefault();var i=this.getDialogue({headerContent:M.util.get_string("dialogtitle",n),width:"768px",focusAfterHide:r}),s=e.Node.create("<iframe></iframe>");s.setStyles({height:"510px",border:"none",width:"100%"}),s.setAttribute("src","https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/catechol/PNG"),s.setAttribute("id","pubchem"),s.setAttribute("data-toolbars","reaction");var o=this._getFormContent(r),u=e.Node.create("<div></div>");u.append(o).append(s),i.set("bodyContent",u),i.show(),this.markUpdated()},_getFormContent:function(t){var s=e.Handlebars.compile(a),u=e.Node.create(s({elementid:this.get("host").get("elementid"),CSS:o,WIDTHCONTROL:r,HEIGHTCONTROL:i,component:n,defaultsearch:this.get("defaultsearch"),defaultheight:this.get("defaultheight"),clickedicon:t}));return this._form=u,this._form.one("."+o.INPUTSUBMIT).on("click",this._getPubChemData,this),this._form.one(".pubchem_insert").on("click",this._setImage,this),u},_getIframeURL:function(){return srchtml="<html>Hello World<hthml>",this.get("path")+"/editor.html"},_uploadFile:function(e,t,n){var r=new XMLHttpRequest,i="png";console.log("in uploadFile"),r.onreadystatechange=function(){return function(){if(r.readyState===4&&r.status===200){var e=r.responseText,t=e.indexOf("success<error>");if(t<1)return}}}(this);var s="datatype=uploadfile";s+="&paramone="+encodeURIComponent(e),s+="&paramtwo="+i,s+="&paramthree=image",s+="&requestid="+n,s+="&contextid="+this._usercontextid,s+="&component=user",s+="&filearea=draft",s+="&itemid="+this._itemid,r.open("POST",M.cfg.wwwroot+"/lib/editor/atto/plugins/pubchem/pubchemfilelib.php",!0),r.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),r.setRequestHeader("Cache-Control","no-cache"),r.setRequestHeader("Content-length",s.length),r.setRequestHeader("Connection","close"),r.send(s)},_getPubChemData:function(t){t.preventDefault();var n=e.one("[name=database]:checked").get("value");console.log(n);if(n=="pubchem"){var r=e.one("#pubchemsearch"),i=r.get("value");console.log(i),iframe=e.one("#pubchem"),iframe.setAttribute("src","https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"+i+"/PNG"),console.log("pubchem search")}else console.log("rcsb  search")},_setImage:function(t){var n=this._form,r=n.one(".pubchemsearch").get("value"),i="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"+r+"/PNG";alt=r,margin="",customstyle="",classlist=[],host=this.get("host"),t.preventDefault(),host.focus();if(i!==""){var s=e.Handlebars.compile(IMAGETEMPLATE);imagehtml=s({url:i,alt:alt,margin:margin,customstyle:customstyle,classlist:classlist.join(" ")}),this.get("host").insertContentAtFocusPoint(imagehtml),this.markUpdated()}this.getDialogue({focusAfterHide:null}).hide()},_getImgURL:function(t){t.preventDefault(),console.log("in getImgURL"),this.getDialogue({focusAfterHide:null}).hide();var n=this._form.one(u.WIDTHCONTROL),r="",i=(new Date).getTime(),s="upfile_"+i+".png",o="";n.get("value")?r=n.get("value"):r=this.get("defaultwidth");var a="";this._uploadFile(imgURL,"1",i),test(source,s);var f=this;e.Get.js([this.get("path")+"/gui/gui.nocache.js",this.get("path")+"/js/marvinjslauncher.js",this.get("path")+"/gui/lib/promise-0.1.1.min.js"],function(e){if(e)return;var t;MarvinJSUtil.getEditor("#"+marvinjsid).then(function(e){t=new MarvinControllerClass(e);var n=t.sketcherInstance.exportStructure("mrv",null);n.then(function(e){function n(e,n){var r=marvin.ImageExporter.mrvToDataUrl(e,"image/png",t);f._uploadFile(r,"1",i);var s=M.cfg.wwwroot,u=s+"/draftfile.php/"+f._usercontextid+"/user/draft/"+f._itemid+"/"+n;o='<img name="pict" src="'+u+'" alt="MarvinJS PNG"/>',f.editor.focus(),f.get("host").insertContentAtFocusPoint(o),f.markUpdated()}var t={carbonLabelVisible:!1,chiralFlagVisible:!0,valenceErrorVisible:!0,lonePairsVisible:!0,implicitHydrogen:"TERMINAL_AND_HETERO",width:r,height:a}})}),MarvinControllerClass=function(){function e(e){this.sketcherInstance=e}return e}()})}},{ATTRS:{disabled:{value:!1},usercontextid:{value:null},defaultsearch:{value:"Benzene"},defaultheight:
{value:"100"},path:{value:""}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});
