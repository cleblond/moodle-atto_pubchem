YUI.add("moodle-atto_pubchem-button",function(e,t){var n="atto_pubchem",r="pubchem_width",i="pubchem_height",s="atto_pubchem",o={INPUTSUBMIT:"atto_media_urlentrysubmit",INPUTCANCEL:"atto_media_urlentrycancel",WIDTHCONTROL:"widthcontrol",HEIGHTCONTROL:"heightcontrol"},u='<form class="atto_form"><div id="{{elementid}}_{{innerform}}" class="left-align"><strong>{{get_string "instructions" component}}</strong><br><input type="radio" name="database" id="pubchem" value="pubchem" checked="checked"><label for="pubchem">PubChem   </label><input type="radio" name="database" id="rcsb" value="rcsb"><label for="rcsb">RCSB PDB</label><table><tr><td><label for="{{elementid}}_{{WIDTHCONTROL}}">{{get_string "search" component}}</label></td><td><input class="search" size="60" id="search" name="search"value="{{defaultsearch}}" /></td><td><button class="{{CSS.INPUTSUBMIT}}">{{get_string "searchbutton" component}}</button></td><td><button class="pubchem_insert">{{get_string "insertbutton" component}}</button></td></tr></table><input type="radio" name="exact" id="exact" value="yes" checked="checked"><label for="exact">Exact match  </label><input type="radio" name="exact" id="notexact" value="no"><label for="notexact">Partial match</label><div style="overflow:auto;" id="pubchem" class="pubchem"><div id="pubchemoverview" class="pubchemoverview"></div><div style="max-height: 400px; overflow:auto;" id="pubchemdiv" class="pubchemdiv"><button class="pubchem_searchret">Return</button></div><ul style="max-height: 400px; overflow:auto;" id="pubcheminfo" class="pubcheminfo"></ul></div><div class="rcsb"><div style="max-height: 400px; overflow:auto;" id="rcsbdiv" class="rcsbdiv"><button class="rcsb_searchret">Return</button></div><ul style="max-height: 400px; overflow:auto;" id="rcsbinfo" class="rcsbinfo"></ul></div></div></form>',a='<img src="{{url}}" alt="{{alt}}" {{#if width}}width="{{width}}" {{/if}}{{#if height}}height="{{height}}" {{/if}}{{#if presentation}}role="presentation" {{/if}}style="{{alignment}}{{margin}}{{customstyle}}"{{#if classlist}}class="{{classlist}}" {{/if}}{{#if id}}id="{{id}}" {{/if}}/>';e.namespace("M.atto_pubchem").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{_usercontextid:null,_filename:null,_form:null,initializer:function(e){this._usercontextid=e.usercontextid,this._contextid=e.contextid,console.log(e.contextid);var t=(new Date).getTime();this._filename=t;var n=this.get("host"),r=n.get("filepickeroptions");if(this.get("disabled"))return;this.addButton({icon:"icon",iconComponent:"atto_pubchem",buttonName:"icon",callback:this._displayDialogue,callbackArgs:"icon"})},_displayDialogue:function(t,r){t.preventDefault();var i=this.getDialogue({headerContent:M.util.get_string("dialogtitle",n),width:"768px",height:"600px",focusAfterHide:r}),s=this._getFormContent(r),o=e.Node.create("<div></div>");o.append(s),i.set("bodyContent",o),i.show(),this.markUpdated()},_getFormContent:function(t){var s=e.Handlebars.compile(u),a=e.Node.create(s({elementid:this.get("host").get("elementid"),CSS:o,WIDTHCONTROL:r,HEIGHTCONTROL:i,component:n,defaultsearch:this.get("defaultsearch"),defaultheight:this.get("defaultheight"),clickedicon:t}));return this._form=a,this._form.one(".pubchem_insert").set("disabled",!0),this._form.one("#pubchemdiv").hide(),this._form.one("#rcsbdiv").hide(),this._form.one("."+o.INPUTSUBMIT).on("click",this._getPubChemData,this),this._form.one(".pubchem_insert").on("click",this._setImage,this),this._form.one(".pubcheminfo").on("click",this._viewPCRecord,"#pubchem ul li",this),this._form.one(".rcsbinfo").on("click",this._viewRCSBRecord,this),this._form.one(".pubchem_searchret").on("click",this._PCReturn,this),this._form.one(".rcsb_searchret").on("click",this._RCSBReturn,this),a},_PCReturn:function(t){t.preventDefault(),e.one("#pubchemdiv").hide(),e.one("#pubcheminfo").show(),e.one(".pubchem_insert").set("disabled",!0)},_RCSBReturn:function(t){t.preventDefault(),e.one("#rcsbdiv").hide(),e.one("#rcsbinfo").show(),e.one(".pubchem_insert").set("disabled",!0)},_viewPCRecord:function(t){t.preventDefault(),e.one(".pubchem_insert").set("disabled",!1),e.one(".pubcheminfo").hide(),e.one("#pubchemdiv").show();var n=t.currentTarget,r=t.target,i=r.get("parentNode").get("id"),s=e.one("#pubchemdiv").get("children").size();s>1&&e.one("#pubchemdiv").get("children").slice(-1).item(0).remove(),e.one("#pubchemdiv").insert("<div>"+e.one("#"+i).get("innerHTML")+"</div>")},_viewRCSBRecord:function(t,n){t.preventDefault(),console.log("viewRCSBRecord"),e.one(".pubchem_insert").set("disabled",!1),e.one(".rcsbinfo").hide(),e.one("#rcsbdiv").show();var r=t.currentTarget,i=t.target,s=i.get("parentNode").get("id"),o=e.one("#rcsbdiv").get("children").size();linktopdb='<a href="http://www.rcsb.org/pdb/files/'+s+'.pdb.gz">'+s+"</a>",o>1&&e.one("#rcsbdiv").get("children").slice(-1).item(0).remove(),e.one("#rcsbdiv").insert("<div>"+e.one("#"+s).get("innerHTML")+"<br/>"+linktopdb+"</div>"),htmltofilter="<div>"+e.one("#"+s).get("innerHTML")+"<br/>"+linktopdb+"</div>"},_getPubChemData:function(t){t.preventDefault();var n=e.one("[name=database]:checked").get("value"),r=e.one("#search"),i=r.get("value"),s=e.one("#pubchemiframe");e.one(".pubchem_insert").set("disabled",!0);if(n=="pubchem"){e.one(".pubchem").show(),e.one(".rcsb").hide(),pubcheminfo=e.one(".pubcheminfo").set("innerHTML","");function o(t){var n=new XMLHttpRequest;n.open("GET","https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/"+t+"/property/IUPACName,MolecularWeight,MolecularFormula/JSON",!0),n.send(),console.log("in getTitleforCID"),n.onreadystatechange=function(){if(n.readyState===4)if(n.status===200){var r=n.responseText,i=JSON.parse(r);console.log(i),console.log(i.PropertyTable.Properties.IUPACName),preferredname=i.PropertyTable.Properties[0].IUPACName,singleresult='<li id="'+t+'"><img style="cursor: pointer; cursor: hand;" height="200px" width="200px" class = "pcimage" src="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/'+t+'/PNG" ></img><a class="pubchemsearchres" href="">'+
preferredname+"</a></li>",pubcheminfo=e.one(".pubcheminfo"),innerhtml=pubcheminfo.get("innerHTML"),pubcheminfo.set("innerHTML",innerhtml+singleresult),console.log(t)}else alert("XMLHttpRequest Failed CID")}}var u=new XMLHttpRequest;u.onreadystatechange=function(){if(u.readyState===4)if(u.status===200){var t=u.responseXML,n=t.getElementsByTagName("CID"),r=n.length,i=r>3?3:r;pubchem=e.one(".pubchemoverview"),pubchem.set("innerHTML","<b>"+r+" hits found!</b><br/>");for(var s=0;s<i;s++)cid=n[s].innerHTML,title=o(cid)}else alert("XMLHttpRequest Failed CID list")};var a=e.one("[name=exact]:checked").get("value");a=="yes"?u.open("GET","https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"+i+"/cids/XML",!0):u.open("GET","https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"+i+"/cids/XML?name_type=word",!0),u.setRequestHeader("Content-type","application/x-www-form-urlencoded"),u.send()}else{e.one(".pubchem").hide(),e.one(".rcsb").show(),rcsbinfo=e.one(".rcsbinfo"),innerhtml=rcsbinfo.set("innerHTML","");function f(t){var n=new XMLHttpRequest;n.open("GET","http://www.rcsb.org/pdb/rest/customReport.csv?pdbids="+t+"&customReportColumns=structureId,structureTitle,experimentalTechnique&format=xml",!0),n.send(),n.onreadystatechange=function(){if(n.readyState===4)if(n.status===200){var t=n.responseXML,r=t.getElementsByTagName("record");console.log(r),console.log(r.length),innerhtml="";for(var i=0;i<r.length;i++)title=r[i].getElementsByTagName("dimStructure.structureTitle")[0].innerHTML,pdbid=r[i].getElementsByTagName("dimStructure.structureId")[0].innerHTML,innerhtml+='<li id="'+pdbid+'"><a class = "pdblink" id = "'+pdbid+'" href="http://www.rcsb.org/pdb/explore.do?structureId='+pdbid+'">'+pdbid+"  </a>"+title+"</li>";rcsbinfo=e.one(".rcsbinfo"),rcsbinfo.set("innerHTML",innerhtml)}else alert("XMLHttpRequest Failed")}}var u=new XMLHttpRequest;u.onreadystatechange=function(){if(u.readyState===4)if(u.status===200){var t=u.responseText;resultcsv=t.replace(/(?:\r\n|\r|\n)/g,","),totalhits=resultcsv.split(",").length,console.log(resultcsv);var n="<div>",r=totalhits>20?20:totalhits;rcsbdiv=e.one(".rcsbdiv"),rcsbinfo.set("innerHTML","<b>"+totalhits+" hits found</b><br/>"),pubchem=e.one(".pubchemoverview"),pubchem.set("innerHTML","<b>"+totalhits+" hits found!</b><br/>"),searchxml=f(resultcsv),console.log(searchxml)}else alert("XMLHttpRequest Failed")},querytext="<orgPdbQuery><version>head</version><queryType>org.pdb.query.simple.AdvancedKeywordQuery</queryType><description>Text Search for: chymotrypsin</description><queryId>57ADC790</queryId><runtimeMilliseconds>34</runtimeMilliseconds><keywords>"+i+"</keywords>"+"</orgPdbQuery>",u.open("POST","http://www.rcsb.org/pdb/rest/search",!0),u.setRequestHeader("Content-type","application/x-www-form-urlencoded"),u.send(querytext)}},_setImage:function(t){t.preventDefault();var n=e.one("[name=database]:checked").get("value");if(n=="pubchem"){var r=this._form,i=e.one(".search").get("value"),s="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"+i+"/PNG";alt=i,margin="",customstyle="",classlist=[],host=this.get("host"),t.preventDefault(),host.focus();if(s!==""){var o=e.Handlebars.compile(a);imagehtml=o({url:s,alt:alt,margin:margin,customstyle:customstyle,classlist:classlist.join(" ")}),this.get("host").insertContentAtFocusPoint(imagehtml),this.markUpdated()}}else console.log("Insert RCSB Code into Page");this.getDialogue({focusAfterHide:null}).hide()}},{ATTRS:{disabled:{value:!1},usercontextid:{value:null},defaultsearch:{value:"acetonitrile"},defaultheight:{value:"100"},contextid:{value:null},path:{value:""}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});
