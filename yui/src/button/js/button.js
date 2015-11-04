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
    },
    SELECTORS = {
        WIDTHCONTROL: '.widthcontrol',
        HEIGHTCONTROL: '.heightcontrol'
    };
var TEMPLATE = '' + '<form class="atto_form">' +
    '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
    '<strong>{{get_string "instructions" component}}</strong>' +
    '<table><tr><td><label for="{{elementid}}_{{WIDTHCONTROL}}">{{get_string "search" component}}</label></td>' +
    '<td><input class="{{CSS.WIDTHCONTROL}}" size="60" id="pubchemsearch" name="{{elementid}}_{{WIDTHCONTROL}}"' +
    'value="{{defaultsearch}}" /></td>' +
    '<td><button class="{{CSS.INPUTSUBMIT}}">{{get_string "searchbutton" component}}</button></td>' +
    '<td><button class="pubchem_insert">{{get_string "insertbutton" component}}</button></td>' +
    '</tr></table></div>' + '</form>';
Y.namespace('M.atto_pubchem').Button = Y.Base.create('button', Y.M.editor_atto
    .EditorPlugin, [], {
        _usercontextid: null,
        _filename: null,
        /**
         * Initialize the button
         *
         * @method Initializer
         */
        initializer: function(config) {
            this._usercontextid = config.usercontextid;
            var timestamp = new Date().getTime();
            this._filename = timestamp;
            var host = this.get('host');
            var options = host.get('filepickeroptions');
            if (options.image && options.image.itemid) {
                this._itemid = options.image.itemid;
            } else {
                Y.log(
                    'Plugin PoodLL Anywhere not available because itemid is missing.',
                    'warn', LOGNAME);
                return;
            }
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
                focusAfterHide: clickedicon
            });
            //var d = new Date();
            //var marvinjsid = d.getTime();
            //var iframe = Y.Node.create('<div>hello World</div>');




            var iframe = Y.Node.create('<iframe></iframe>');
            iframe.setStyles({
                height: '510px',
                border: 'none',
                width: '100%'
            });
            //iframe.setAttribute('src', this._getIframeURL());
            iframe.setAttribute('src', 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/catechol/PNG');
            iframe.setAttribute('id', 'pubchem');
            iframe.setAttribute('data-toolbars', 'reaction');

            //append buttons to iframe
            var buttonform = this._getFormContent(clickedicon);
            var bodycontent = Y.Node.create('<div></div>');
            bodycontent.append(buttonform).append(iframe);
            //bodycontent.append(buttonform);
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
            this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._getPubChemData,
                this);
            this._form.one('.pubchem_insert').on('click', this._getImgURL,
                this);
            return content;
        },
        _getIframeURL: function() {

            srchtml = '<html>Hello World<hthml>';

            return this.get('path') + '/editor.html';
        },
        _uploadFile: function(filedata, recid, filename) {
            var xhr = new XMLHttpRequest();
            var ext = "png";
            console.log('in uploadFile');
            // file received/failed
            xhr.onreadystatechange = (function() {
                return function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var resp = xhr.responseText;
                            var start = resp.indexOf(
                                "success<error>");
                            if (start < 1) {
                                return;
                            }
                        }
                    }
                };
            })(this);
            var params = "datatype=uploadfile";
            params += "&paramone=" + encodeURIComponent(filedata);
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
        _getPubChemData: function(e) {
            e.preventDefault();


            var pubchemsearchnode = Y.one('#pubchemsearch');
            var searchtext = pubchemsearchnode.get('value');
            
            iframe = Y.one('#pubchem');
            iframe.setAttribute('src', 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+searchtext+'/PNG');
            //this._form.one('#pubchem').setAttribute('src', 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/benzene/PNG');
            console.log(iframe);
            console.log('HERE');

        },



        _getImgURL: function(e) {
            e.preventDefault();
            console.log('in getImgURL');
            this.getDialogue({
                focusAfterHide: null
            }).hide();
            var widthcontrol = this._form.one(SELECTORS.WIDTHCONTROL);
            var newwidth = '';
            var filename = new Date().getTime();
            var thefilename = "upfile_" + filename + ".png";
            var divContent = '';
            if (!widthcontrol.get('value')) {
                newwidth = this.get('defaultwidth');
            } else {
                newwidth = widthcontrol.get('value');
            }
            //var heightcontrol = this._form.one(SELECTORS.HEIGHTCONTROL);
            var newheight = '';
            // If no file is there to insert, don't do it.
            /*if (!heightcontrol.get('value')) {
                newheight = this.get('defaultheight');
            } else {
                newheight = heightcontrol.get('value');
            }*/


            this._uploadFile(imgURL,"1",filename);



            test(source,thefilename);
            var referringpage = this;
            Y.Get.js([this.get('path') + '/gui/gui.nocache.js', this.get(
                    'path') + '/js/marvinjslauncher.js',
                   this.get('path') + '/gui/lib/promise-0.1.1.min.js'], function(err) {
                if (err) {
                    return;
                }
                var marvinController;
                MarvinJSUtil.getEditor("#" + marvinjsid).then(function(
                    sketcherInstance) {
                    marvinController = new MarvinControllerClass(
                        sketcherInstance);
                    var exportPromise = marvinController.sketcherInstance
                        .exportStructure("mrv", null);
                    exportPromise.then(function(source) {
                        var imgsettings = {
                            'carbonLabelVisible': false,
                            'chiralFlagVisible': true,
                            'valenceErrorVisible': true,
                            'lonePairsVisible': true,
                            'implicitHydrogen': "TERMINAL_AND_HETERO",
                            'width': newwidth,
                            'height': newheight
                        };

                        function test(source,
                            thefilename) {
                            var imgURL = marvin
                                .ImageExporter
                                .mrvToDataUrl(
                                    source,
                                    "image/png",
                                    imgsettings
                                );
                            referringpage._uploadFile(
                                imgURL,
                                "1",
                                filename
                            );
                            var wwwroot = M
                                .cfg.wwwroot;
                            // It will store in mdl_question with the "@@PLUGINFILE@@/myfile.mp3" for the filepath.
                            var filesrc =
                                wwwroot +
                                '/draftfile.php/' +
                                referringpage
                                ._usercontextid +
                                '/user/draft/' +
                                referringpage
                                ._itemid +
                                '/' +
                                thefilename;
                            divContent =
                                "<img name=\"pict\" src=\"" +
                                filesrc +
                                "\" alt=\"MarvinJS PNG\"/>";
                            referringpage.editor.focus();
                            referringpage.get('host').insertContentAtFocusPoint(divContent);
                            referringpage.markUpdated();
                        }
                       /* marvin.onReady(function() {
                            test(source,
                                thefilename
                            );
                        }); */
                    });
                });
                MarvinControllerClass = (function() {
                    function MarvinControllerClass(
                        sketcherInstance) {
                        this.sketcherInstance =
                            sketcherInstance;
                    }
                    return MarvinControllerClass;
                }());
            });
        }


    }, {
        ATTRS: {
            disabled: {
                value: false
            },
            usercontextid: {
                value: null
            },
            defaultsearch: {
                value: 'Benzene'
            },
            defaultheight: {
                value: '100'
            },
            path: {
                value: ''
            }
        }
    });
