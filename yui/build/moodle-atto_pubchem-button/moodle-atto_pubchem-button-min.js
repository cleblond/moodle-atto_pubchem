YUI.add("moodle-atto_pubchem-button",function(e,t){var n="atto_pubchem",r="pubchem_width",i="pubchem_height",s="atto_pubchem",o={INPUTSUBMIT:"atto_media_urlentrysubmit",INPUTCANCEL:"atto_media_urlentrycancel",WIDTHCONTROL:"widthcontrol",HEIGHTCONTROL:"heightcontrol"},u='<form class="atto_form"><div id="{{elementid}}_{{innerform}}" class="left-align"><strong>{{get_string "instructions" component}}</strong><br><input type="radio" name="database" id="pubchem" value="pubchem" checked="checked"><label for="pubchem">PubChem   </label><input type="radio" name="database" id="rcsb" value="rcsb"><label for="rcsb">RCSB PDB</label><table><tr><td><label for="{{elementid}}_{{WIDTHCONTROL}}">{{get_string "search" component}}</label></td><td><input class="search" size="60" id="search" name="search"value="{{defaultsearch}}" /></td><td><button class="{{CSS.INPUTSUBMIT}}">{{get_string "searchbutton" component}}</button></td><td><button class="pubchem_insert">{{get_string "insertbutton" component}}</button></td></tr></table></div></form><div class="pubcheminfo"></div><iframe style="border: none; width: 100%; height: 500px;" id="pubchemiframe" src="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/catechol/PNG"></iframe><div class="rcsb"><div class="rcsbinfo"></div><div class="rcsbdiv"></div></div>',a='<img src="{{url}}" alt="{{alt}}" {{#if width}}width="{{width}}" {{/if}}{{#if height}}height="{{height}}" {{/if}}{{#if presentation}}role="presentation" {{/if}}style="{{alignment}}{{margin}}{{customstyle}}"{{#if classlist}}class="{{classlist}}" {{/if}}{{#if id}}id="{{id}}" {{/if}}/>';e.namespace("M.atto_pubchem").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{_usercontextid:null,_filename:null,_form:null,initializer:function(e){this._usercontextid=e.usercontextid;var t=(new Date).getTime();this._filename=t;var n=this.get("host"),r=n.get("filepickeroptions");if(!r.image||!r.image.itemid)return;this._itemid=r.image.itemid;if(this.get("disabled"))return;this.addButton({icon:"icon",iconComponent:"atto_pubchem",buttonName:"icon",callback:this._displayDialogue,callbackArgs:"icon"})},_displayDialogue:function(t,r){t.preventDefault();var i=this.getDialogue({headerContent:M.util.get_string("dialogtitle",n),width:"768px",heigth:"600px",focusAfterHide:r}),s=this._getFormContent(r),o=e.Node.create("<div></div>");o.append(s),i.set("bodyContent",o),i.show(),this.markUpdated()},_getFormContent:function(t){var s=e.Handlebars.compile(u),a=e.Node.create(s({elementid:this.get("host").get("elementid"),CSS:o,WIDTHCONTROL:r,HEIGHTCONTROL:i,component:n,defaultsearch:this.get("defaultsearch"),defaultheight:this.get("defaultheight"),clickedicon:t}));return this._form=a,this._form.one("."+o.INPUTSUBMIT).on("click",this._getPubChemData,this),this._form.one(".pubchem_insert").on("click",this._setImage,this),this._form.one(".pbdlink").on("click",this._getPDB,this),a},_getPubChemData:function(t){t.preventDefault();var n=e.one("[name=database]:checked").get("value");console.log(n);var r=e.one("#search"),i=r.get("value"),s=e.one("#pubchemiframe");if(n=="pubchem")e.one("#pubchemiframe").show(),e.one(".rcsb").hide(),console.log(i),console.log(s),s.setAttribute("src","https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"+i+"/PNG"),console.log("pubchem search");else{e.one("#pubchemiframe").hide(),e.one(".rcsb").show();function o(t){var n=new XMLHttpRequest;n.open("GET","http://www.rcsb.org/pdb/rest/describePDB?structureId="+t,!0),n.send(),n.onreadystatechange=function(){if(n.readyState===4){if(n.status===200){var r=n.responseXML;console.log(r);var i=r.getElementsByTagName("PDB");return title=i[0].getAttribute("title"),singleresult='<a class = "pdblink" id = "'+t+'" href="http://www.rcsb.org/pdb/explore.do?structureId='+t+'">'+t+"  </a>"+title+"<br/>",rcsbinfo=e.one(".rcsbinfo"),innerhtml=rcsbinfo.get("innerHTML"),rcsbinfo.set("innerHTML",innerhtml+singleresult),title}alert("XMLHttpRequest Failed")}}}var u=new XMLHttpRequest;u.onreadystatechange=function(){if(u.readyState===4)if(u.status===200){var e=u.responseText,t=e.split("\n"),n="<div>";for(var r=0;r<10;r++)title=o(t[r]),singleresult='<a href="http://www.rcsb.org/pdb/explore.do?structureId='+t[r]+'">'+t[r]+"  </a>"+title+"<br/>",n+=singleresult;n+="</div>",console.log(n)}else alert("XMLHttpRequest Failed")},querytext="<orgPdbQuery><version>head</version><queryType>org.pdb.query.simple.AdvancedKeywordQuery</queryType><description>Text Search for: chymotrypsin</description><queryId>57ADC790</queryId><resultCount>594</resultCount><runtimeStart>2015-11-06T01:16:49Z</runtimeStart><runtimeMilliseconds>34</runtimeMilliseconds><keywords>Chymotrypsin</keywords></orgPdbQuery>",u.open("POST","http://www.rcsb.org/pdb/rest/search",!0),u.setRequestHeader("Content-type","application/x-www-form-urlencoded"),u.send(querytext)}},_setImage:function(e){alert("HERE I AM")},_setImage:function(t){var n=this._form,r=e.one(".search").get("value"),i="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"+r+"/PNG";alt=r,margin="",customstyle="",classlist=[],host=this.get("host"),t.preventDefault(),host.focus();if(i!==""){var s=e.Handlebars.compile(a);imagehtml=s({url:i,alt:alt,margin:margin,customstyle:customstyle,classlist:classlist.join(" ")}),this.get("host").insertContentAtFocusPoint(imagehtml),this.markUpdated()}this.getDialogue({focusAfterHide:null}).hide()}},{ATTRS:{disabled:{value:!1},usercontextid:{value:null},defaultsearch:{value:"Benzene"},defaultheight:{value:"100"},path:{value:""}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});
