YUI.add('moodle-atto_pubchem-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
/*
 * @package    atto_pubchem
 * @copyright  2014 onwards Carl LeBlond
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * @module moodle-atto_pubchem-button
 */
/**
 * Atto text editor pubchem plugin.
 *
 * @namespace M.atto_pubchem
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */
var COMPONENTNAME = 'atto_pubchem';
var WIDTHCONTROL = 'pubchem_width';
var HEIGHTCONTROL = 'pubchem_height';
var LOGNAME = 'atto_pubchem';
var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel',
        WIDTHCONTROL: 'widthcontrol',
        HEIGHTCONTROL: 'heightcontrol'
    };
var TEMPLATE = '' + '<form class="atto_form">' +
    '<div id="{{elementid}}_{{innerform}}" class="left-align">' +
    '<strong>{{get_string "instructions" component}}</strong><br>' +
    '<input type="radio" name="database" id="pubchem" value="pubchem" checked="checked">' +
    '<label for="pubchem">PubChem   </label>' +
    '<input type="radio" name="database" id="rcsb" value="rcsb">' +
    '<label for="rcsb">RCSB PDB</label>' +
    '<table>' +
    '<tr><td><label for="{{elementid}}_{{WIDTHCONTROL}}">{{get_string "search" component}}</label></td>' +
    '<td><input class="search" size="60" id="search" name="search"' +
    'value="{{defaultsearch}}" /></td>' +
    '<td><button class="{{CSS.INPUTSUBMIT}}">{{get_string "searchbutton" component}}</button></td>' +
    '<td><button class="pubchem_insert">{{get_string "insertbutton" component}}</button></td>' +
    '</tr></table>' +
    '<input type="radio" name="exact" id="exact" value="yes" checked="checked">' +
    '<label for="exact">Exact match  </label>' +
    '<input type="radio" name="exact" id="notexact" value="no">' +
    '<label for="notexact">Partial match</label>' +
    '<div style="overflow:auto;" id="pubchem" class="pubchem">' +
    '<div id="pubchemoverview" class="pubchemoverview"></div>' +
    '<div style="max-height: 400px; overflow:auto;" id="pubchemdiv" class="pubchemdiv">' +
    '<button class="pubchem_searchret">Return</button>' +
    '</div>' +
    '<ul style="max-height: 400px; overflow:auto;" id="pubcheminfo" class="pubcheminfo"></ul></div>' +
    '<div class="rcsb">' +
    '<div style="max-height: 400px; overflow:auto;" id="rcsbdiv" class="rcsbdiv">' +
    '<button class="rcsb_searchret">Return</button></div>' +
    '<ul style="max-height: 400px; overflow:auto;" id="rcsbinfo" class="rcsbinfo"></ul></div>' +
    '</div>' +
    '</form>';


        var IMAGETEMPLATE = '' +
            '<img src="{{url}}" alt="{{alt}}" ' +
                '{{#if width}}width="{{width}}" {{/if}}' +
                '{{#if height}}height="{{height}}" {{/if}}' +
                '{{#if presentation}}role="presentation" {{/if}}' +
                'style="{{alignment}}{{margin}}{{customstyle}}"' +
                '{{#if classlist}}class="{{classlist}}" {{/if}}' +
                '{{#if id}}id="{{id}}" {{/if}}' +
                '/>';




Y.namespace('M.atto_pubchem').Button = Y.Base.create('button', Y.M.editor_atto
    .EditorPlugin, [], {
        _usercontextid: null,
        _filename: null,


    /**
     * A reference to the currently open form.
     *
     * @param _form
     * @type Node
     * @private
     */
    _form: null,


    pdbid: null,
        /**
         * Initialize the button
         *
         * @method Initializer
         */
        initializer: function(config) {
            this._usercontextid = config.usercontextid;
            this._contextid = config.contextid;
            //console.log(this.get('contextid'));
            //console.log(config.contextid);
            var timestamp = new Date().getTime();
            this._filename = timestamp;
            var host = this.get('host');
            var options = host.get('filepickeroptions');

           //if (options.image && options.image.itemid) {
                this._itemid = options.image.itemid;
            //} else {
            //    return;
            //}


            // If we don't have the capability to view then give up.
            if (this.get('disabled')) {
                return;
            }
            // Add the pubchem icon/buttons
            this.addButton({
                icon: 'icon',
                iconComponent: 'atto_pubchem',
                buttonName: 'icon',
                callback: this._displayDialogue,
                callbackArgs: 'icon'
            });
        },
        /**
         * Display the pubchem Dialogue
         *
         * @method _displayDialogue
         * @private
         */
        _displayDialogue: function(e, clickedicon) {
            e.preventDefault();
            var dialogue = this.getDialogue({
                headerContent: M.util.get_string('dialogtitle',
                    COMPONENTNAME),
                width: '768px',
                height: '600px',
                focusAfterHide: clickedicon
            });


            //append buttons to iframe
            var buttonform = this._getFormContent(clickedicon);
            var bodycontent = Y.Node.create('<div></div>');
            //bodycontent.append(buttonform).append(iframe);
            bodycontent.append(buttonform);
            //set to bodycontent
            dialogue.set('bodyContent', bodycontent);
            dialogue.show();
            this.markUpdated();
        },
        /**
         * Return the dialogue content for the tool, attaching any required
         * events.
         *
         * @method _getDialogueContent
         * @return {Node} The content to place in the dialogue.
         * @private
         */
        _getFormContent: function(clickedicon) {
            var template = Y.Handlebars.compile(TEMPLATE),
                content = Y.Node.create(template({
                    elementid: this.get('host').get('elementid'),
                    CSS: CSS,
                    WIDTHCONTROL: WIDTHCONTROL,
                    HEIGHTCONTROL: HEIGHTCONTROL,
                    component: COMPONENTNAME,
                    defaultsearch: this.get('defaultsearch'),
                    defaultheight: this.get('defaultheight'),
                    clickedicon: clickedicon
                }));
            this._form = content;
            this._form.one(".pubchem_insert").set('disabled', true);
            this._form.one('#pubchemdiv').hide();
            this._form.one('#rcsbdiv').hide();
            this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._getPubChemData,this);
            this._form.one('.pubchem_insert').on('click', this._insertRecord,this);
            //this._form.one('.pubcheminfo').on('click', alert("It worked"),"ul li.pubchemsearchres");
            this._form.one('.pubcheminfo').on('click', this._viewPCRecord,"#pubchem ul li", this);
            //this._form.one('.rcsbinfo').on('click', this._viewRCSBRecord, this);
            this._form.one('.rcsbinfo').delegate('click', this._viewRCSBRecord, '.pdblink', this);
            this._form.one('.pubchem_searchret').on('click', this._PCReturn, this);
            this._form.one('.rcsb_searchret').on('click', this._RCSBReturn, this);
            //this._form.one('.pubcheminfo').delegate('click', this._doIT, '#pubchem', 'ul li a.pubchemsearchres');

            return content;
        },
//


        _PCReturn: function(e) {
             e.preventDefault()
             Y.one('#pubchemdiv').hide();
             Y.one('#pubcheminfo').show();
             Y.one(".pubchem_insert").set('disabled', true);
        },


        _RCSBReturn: function(e) {
             e.preventDefault()
             Y.one('#rcsbdiv').hide();
             Y.one('#rcsbinfo').show();
             Y.one(".pubchem_insert").set('disabled', true);
        },



        _viewPCRecord: function(e) {
		    e.preventDefault();

		Y.one(".pubchem_insert").set('disabled', false);
		Y.one('.pubcheminfo').hide();
		Y.one('#pubchemdiv').show();
		var currentTarget = e.currentTarget; // #container
		var target = e.target; // #container or a descendant
		var id = target.get("parentNode").get("id");

		//Y.one('#pubchemdiv').get('childNodes').remove();
		var length = Y.one('#pubchemdiv').get('children').size();
		//console.log(Y.one('#pubchemdiv').get('children').size());
		//console.log(Y.one('#pubchemdiv').get('children').slice(-1).item(0));
		if (length > 1) {
		Y.one('#pubchemdiv').get('children').slice(-1).item(0).remove();
		}
		//Y.one('#pubchemdiv').set('innerHTML',Y.one('#'+id));
		Y.one('#pubchemdiv').insert('<div>'+Y.one('#'+id).get('innerHTML')+'</div>');
		    //console.log(target.get("parentNode").get("id"));
		//alert("Here");
        },


        _viewRCSBRecord: function(e, config) {
		e.preventDefault();
		console.log('viewRCSBRecord');
		Y.one(".pubchem_insert").set('disabled', false);
		Y.one('.rcsbinfo').hide();
		Y.one('#rcsbdiv').show();
		var currentTarget = e.currentTarget; // #container
		var target = e.target; // #container or a descendant
                
		var id = target.get("id");
                pdbid = id;
                html = target.get("parentNode").get('innerHTML');

                imghtml = '<img class="img-responsive" src="http://www.rcsb.org/pdb/images/'+pdbid+'_bio_r_500.jpg" height="350" width="350"></img>'

		//Y.one('#pubchemdiv').get('childNodes').remove();
		var length = Y.one('#rcsbdiv').get('children').size();
		//console.log(Y.one('#pubchemdiv').get('children').size());
		//console.log(Y.one('#pubchemdiv').get('children').slice(-1).item(0));
		//linktopdb = '<a href="http://www.rcsb.org/pdb/files/'+id+'.pdb.gz">'+id+'(You must not have JMOL filter installed or enabled</a>';
		if (length > 1) {
		Y.one('#rcsbdiv').get('children').slice(-1).item(0).remove();
		}
		//Y.one('#pubchemdiv').set('innerHTML',Y.one('#'+id));

		Y.one('#rcsbdiv').insert('<div>'+html+imghtml+'</div>');


        },



    _loadPreview: function(id, preview) {
        var previewNode = Y.one('.rcsbdiv');

        if (preview.status === 200) {
            previewNode.setHTML(preview.responseText);

            Y.fire(M.core.event.FILTER_CONTENT_UPDATED, {nodes: (new Y.NodeList(previewNode))});
        }
    },



        _getPubChemData: function(e) {
            e.preventDefault();

            var dbselected = Y.one('[name=database]:checked').get('value');
            //console.log(dbselected);
            
            var pubchemsearchnode = Y.one('#search');
            var searchtext = pubchemsearchnode.get('value');
            var iframe = Y.one('#pubchemiframe');
            Y.one(".pubchem_insert").set('disabled', true);
//////PUBCHEM CODE HERE
            if (dbselected == 'pubchem') {
                Y.one('.pubchem').show();
                Y.one('.rcsb').hide();
                pubcheminfo = Y.one('.pubcheminfo').set('innerHTML', "");
                //pubcheminfo.set('innerHTML', "");
                //Y.one('#pubchemiframe').show();

                //console.log(searchtext);
                //console.log('pubchem search');

                function getTitleforCID (cid) {
                var xhrdesc = new XMLHttpRequest();

                xhrdesc.open("GET", 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + cid + '/property/IUPACName,MolecularWeight,MolecularFormula/JSON', true);
                xhrdesc.send();
                console.log("in getTitleforCID");
                //console.log(cid);
                xhrdesc.onreadystatechange = function() {
                    if (xhrdesc.readyState === 4) {
                        if (xhrdesc.status === 200) {

                            var result = xhrdesc.responseText;
                            var jsonresult = JSON.parse(result);
                            //console.log(jsonresult);
                            //console.log(jsonresult.PropertyTable.Properties.IUPACName);
                            //preferredname = jsonresult.PC_Compounds[0].props[8].value.sval;
                            preferredname = jsonresult.PropertyTable.Properties[0].IUPACName;
                            //console.log(result);
                            //var pdbtag = result.getElementsByTagName("PDB");
                            //title = pdbtag[0].getAttribute('title');
                            singleresult = '<li id="'+cid+'"><img style="cursor: pointer; cursor: hand;" height="200px" width="200px" class = "pcimage" src="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + cid + '/PNG" ></img><a class="pubchemsearchres" href="">'+preferredname+'</a></li>';
                          
                            pubcheminfo = Y.one('.pubcheminfo');
                            innerhtml = pubcheminfo.get('innerHTML');  
                            pubcheminfo.set('innerHTML', innerhtml + singleresult);
                            //console.log(cid);

                            //this._form.one('.pubcheminfo').on('click', alert("HHEREREEE"),this);
                            //return title;
                            
                        } else {
                            alert('XMLHttpRequest Failed CID');

                        }
                    }

                };


                }


                ///search by keywords
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                       // var placeholder = self.editor.one('#' + uploadid);
                        if (xhr.status === 200) {
                            //var result = JSON.parse(xhr.responseText);
                            var result = xhr.responseXML;
                            var cidtag = result.getElementsByTagName("CID");
                            //var searchresults = '<div>';
                            var totalhits = cidtag.length;
                            var hitstoshow = totalhits > 3 ? 3 : totalhits;
                            pubchem = Y.one('.pubchemoverview');
                            //innerhtml = pubchemdiv.get('innerHTML');  
                            //Y.one('.pubchem').prepend("<b>"+totalhits+" hits found!</b><br/>");
                            pubchem.set('innerHTML', "<b>"+totalhits+" hits found!</b><br/>")
                            for (var i=0; i < hitstoshow; i++){
                            
                            //console.log(cidtag[i]);
                            cid = cidtag[i].innerHTML;
                            title = getTitleforCID(cid);
                                //if ( i == 0 ) {Y.one('.pubchemsearchres').on('click', this._getPDB,this);}
                            }

                        } else {
                            alert('XMLHttpRequest Failed CID list');

                        }
                    }
                };
                //iframe.setAttribute('src', 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/methylenechloride/cids/XML?name_type=word');

                var exactsearch = Y.one('[name=exact]:checked').get('value');
                if (exactsearch == 'yes') {
                xhr.open("GET", 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+searchtext+'/cids/XML', true);
                } else {
                xhr.open("GET", 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+searchtext+'/cids/XML?name_type=word', true);
                }

                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send();

////RCSB CODE HERE
            } else {
                Y.one('.pubchem').hide();
                Y.one('.rcsb').show();
                rcsbinfo = Y.one('.rcsbinfo');
                innerhtml = rcsbinfo.set('innerHTML', "");

                function getTitleforPDBids (pdbids) {
                var xhrdesc = new XMLHttpRequest();
                //xhrdesc.open("GET", 'http://www.rcsb.org/pdb/rest/describePDB?structureId=' + pdbid, true);
                xhrdesc.open("GET", 'http://www.rcsb.org/pdb/rest/customReport.csv?pdbids='+pdbids+'&customReportColumns=structureId,structureTitle,experimentalTechnique,publicationYear,journalName,pubmedId,title,experimentalTechnique&format=xml', true);


                xhrdesc.send();

                xhrdesc.onreadystatechange = function() {
                    if (xhrdesc.readyState === 4) {
                        if (xhrdesc.status === 200) {
                            var result = xhrdesc.responseXML;
                            //console.log(result);
                            var records = result.getElementsByTagName("record");
                            //console.log(records);
                            //console.log(records.length);
                            innerhtml = '';
                           for (var i = 0; i < records.length; i++) {
                            //console.log(i);
                            title = records[i].getElementsByTagName('dimStructure.structureTitle')[0].innerHTML;
                            pdbids = records[i].getElementsByTagName('dimStructure.structureId')[0].innerHTML;
                            citationtitle = records[i].getElementsByTagName('dimStructure.title')[0].innerHTML;
                            citationyear = records[i].getElementsByTagName('dimStructure.publicationYear')[0].innerHTML;
                            pubmedid = records[i].getElementsByTagName('dimStructure.pubmedId')[0].innerHTML;
                            technique = records[i].getElementsByTagName('dimStructure.experimentalTechnique')[0].innerHTML;
                            citationjournal = records[i].getElementsByTagName('dimStructure.journalName')[0].innerHTML;
                            //citationtitle = records[i].getElementsByTagName('dimStructure.title')[0].innerHTML;
                            //pdbid = records[i].getElementsByTagName('dimStructure.structureId')[0].innerHTML;

                            //http://www.rcsb.org/pdb/images/4FU0_bio_r_500.jpg
                            imghtml = '<img src="http://www.rcsb.org/pdb/images/'+pdbids+'_bio_r_500.jpg" height="150" width="150"></img>'



                            //console.log(title);
                            innerhtml += '<li><a class = "pdblink" id = "'+pdbids+'" href="http://www.rcsb.org/pdb/explore.do?structureId='+pdbids+'">'+pdbids+'  </a>'+title+'<ul><li>Title: '+citationtitle+'</li><li>Technique: '+technique+'</li><li>Journal: '+citationjournal+'</li><li>Year: '+citationyear+'</li><li>Link to PubMed: '+pubmedid+'</li></ul></li>';
                            
                            //innerhtml = rcsbinfo.get('innerHTML');
                            innerhtml=innerhtml+imghtml;  
                            
                           }
                           rcsbinfo = Y.one('.rcsbinfo');
			   rcsbinfo.set('innerHTML', innerhtml);



                            //title = pdbtag[0].getAttribute('title');
                            
                            //return title;
                            
                        } else {
                            alert('XMLHttpRequest Failed');

                        }
                    }

                };
                }

                


                ///search by keywords
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                       // var placeholder = self.editor.one('#' + uploadid);
                        if (xhr.status === 200) {
                            //var result = JSON.parse(xhr.responseText);
                            var result = xhr.responseText;
                            //var res = result.split("\n");
                            resultcsv = result.replace(/(?:\r\n|\r|\n)/g, "\,");
                            totalhits = resultcsv.split("\,").length;
                            //console.log(resultcsv);
                            //for (var i=0; i < res.length; i++){
                            var searchresults = '<div>';

                            //var totalhits = res.length;
                            var hitstoshow = totalhits > 20 ? 20 : totalhits;
                            rcsbdiv = Y.one('.rcsbdiv');
                            //innerhtml = rcsbdiv.get('innerHTML');  
                            rcsbinfo.set('innerHTML', "<b>"+totalhits+" hits found</b><br/>")


                            pubchem = Y.one('.pubchemoverview');
                            //innerhtml = pubchemdiv.get('innerHTML');  
                            //Y.one('.pubchem').prepend("<b>"+totalhits+" hits found!</b><br/>");
                            pubchem.set('innerHTML', "<b>"+totalhits+" hits found!</b><br/>")

                            searchxml = getTitleforPDBids(resultcsv);
                            //console.log(searchxml);

                        } else {
                            alert('XMLHttpRequest Failed');

                        }
                    }
                };
			  querytext = '<orgPdbQuery>' +
			    '<version>head</version>' +
			    '<queryType>org.pdb.query.simple.AdvancedKeywordQuery</queryType>' +
			   // '<description>Text Search for: chymotrypsin</description>' +
			   // '<queryId>57ADC790</queryId>' +
			   // '<runtimeMilliseconds>34</runtimeMilliseconds>' +
			    '<keywords>'+searchtext+'</keywords>' +
			  '</orgPdbQuery>';

                xhr.open("POST", "http://www.rcsb.org/pdb/rest/search", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(querytext);

            }

        },


        _uploadFile: function(filedata, filename) {
            var xhr = new XMLHttpRequest();
            var ext = "pdb";
            host = this.get('host');
            host.focus();
            // file received/failed
            var this_=this;
            xhr.onreadystatechange = (function() {
                return function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var resp = xhr.responseXML;
                            x = resp.getElementsByTagName("error");
                            //console.log(x[0].innerHTML);
                            //inserthtml = 
                             var wwwroot = M
                                .cfg.wwwroot;
                             var filesrc =
                                wwwroot +
                                '/draftfile.php/' +
                                this_
                                ._usercontextid +
                                '/user/draft/' +
                                this_
                                ._itemid +
                                '/' +
                                x[0].innerHTML;
                            content =
                                '<a  href="' +
                                filesrc +
                                '" alt="PDB File Link">'+x[0].innerHTML+'</a>';
                            console.log(content);
                            //console.log(this_.get('host'));       
                            host.insertContentAtFocusPoint(content);
                            this_.markUpdated();
                            this_.getDialogue({focusAfterHide: null}).hide(); 




                        }
                    }
                };
            })(this);
            var params = "datatype=uploadfile";
//            params += "&paramone=" + encodeURIComponent(filedata);
            params += "&paramone=" + filedata;
            params += "&paramtwo=" + ext;
            params += "&paramthree=image";
            params += "&requestid=" + filename;
            params += "&contextid=" + this._usercontextid;
            params += "&component=user";
            params += "&filearea=draft";
            params += "&itemid=" + this._itemid;
            xhr.open("POST", M.cfg.wwwroot +
                "/lib/editor/atto/plugins/pubchem/pubchemfilelib.php",
                true);
            xhr.setRequestHeader("Content-Type",
                "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Content-length", params.length);
            xhr.setRequestHeader("Connection", "close");
            xhr.send(params);
        },



    _insertRecord: function(e) {

            e.preventDefault();
            var dbselected = Y.one('[name=database]:checked').get('value');
            //host = this.get('host');
            //host.setSelection(this._currentSelection);
////PUBCHEM code
if (dbselected == 'pubchem') {
            console.log('Insert Pubchem image');

  searchtext = Y.one('.search').get('value');
            imagehtml = '<img src="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+searchtext+'/PNG"/>' +
            '<a href="https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+searchtext+'/SDF?record_type=3d">HERE</a>';

            console.log(imagehtml);
            this.get('host').insertContentAtFocusPoint(imagehtml);

            this.markUpdated();
        //}
} else {
       ////RCSB code
       console.log("Insert RCSB Code into Page");
       console.log(pdbid);
       Y.one('.rcsbdiv')
       htmlnode = Y.one('.rcsbdiv');
       htmlnode.one('.rcsb_searchret').remove();
       //inserthtml=Y.one('.rcsbdiv').get('innerHTML');
       inserthtml=htmlnode.get('innerHTML');

       console.log(inserthtml);

       //ajax to save pdb in repo
               //fileurl = "http://www.rcsb.org/pdb/files/4hhb.pdb.gz";
               fileurl = "http://www.rcsb.org/pdb/files/"+pdbid+".pdb";
                //xhr.open("GET", "http://www.rcsb.org/pdb/rest/search", true);
                //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                //xhr.send(querytext);
                var this_=this;
                var host = this.get('host');
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                       // var placeholder = self.editor.one('#' + uploadid);
                        if (xhr.status === 200) {
                        //got response so perform ajax to add file to repo
                            var filecontent = xhr.responseText;
                            //console.log(filecontent);

                            var options = host.get('filepickeroptions').image;
                            //console.log(host.get('filepickeroptions'));
                            //console.log(options);
                            var savepath = (options.savepath === undefined) ? '/' : options.savepath;
                            //var filename = new Date().getTime();
                            var filename = '';
                            var thefilename = pdbid+filename;
                            this_._uploadFile(filecontent, thefilename);

                        }
                    }
                };
                xhr.open("GET", fileurl, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(querytext);

}

     /*   this.getDialogue({
            focusAfterHide: null
        }).hide(); */

    },

    }, {
        ATTRS: {
            disabled: {
                value: false
            },
            usercontextid: {
                value: null
            },
            defaultsearch: {
                value: 'acetone'
            },
            defaultheight: {
                value: '100'
            },
            contextid: {
            value: null
            },
            path: {
                value: ''
            }
        }
    });


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
