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
//    '</td><td></td><td></td><td></td></tr>' +
    '<table>' +
    '<tr><td><label for="{{elementid}}_{{WIDTHCONTROL}}">{{get_string "search" component}}</label></td>' +
    '<td><input class="pubchemsearch" size="60" id="pubchemsearch" name="pubchemsearch"' +
    'value="{{defaultsearch}}" /></td>' +
    '<td><button class="{{CSS.INPUTSUBMIT}}">{{get_string "searchbutton" component}}</button></td>' +
    '<td><button class="pubchem_insert">{{get_string "insertbutton" component}}</button></td>' +
    '</tr></table></div>' + '</form>';


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
            iframe.setAttribute('id', 'pubchemiframe');
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
            this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._getPubChemData,this);
            this._form.one('.pubchem_insert').on('click', this._setImage,this);
            return content;
        },

        _getPubChemData: function(e) {
            e.preventDefault();

            var dbselected = Y.one('[name=database]:checked').get('value');
            console.log(dbselected);

            var pubchemsearchnode = Y.one('#pubchemsearch');
            var searchtext = pubchemsearchnode.get('value');
            var iframe = Y.one('#pubchemiframe');

            if (dbselected == 'pubchem') {
                console.log(searchtext);

                console.log(iframe);
                iframe.setAttribute('src', 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+searchtext+'/PNG');
                //this._form.one('#pubchem').setAttribute('src', 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/benzene/PNG');
                //console.log(iframe);
                console.log('pubchem search');
            } else {
                var linkhtml = '<a href="http://www.rcsb.org/pdb/files/'+ searchtext  +'.pdb.gz">' + searchtext + '</a>';
                //var bodyNode = Y.one(document.body);
                //bodyNode.append(linkhtml); 
//                iframe.body.set('innerHTML', linkhtml);    
                //console.log('rcsb  search');
                iframe.insert('src', '');
                //var iframe = document.getElementById('pubchemiframe'),
                //iframedoc = iframe.contentDocument || iframe.contentWindow.document;
                //iframe.innerHTML = linkhtml;

            }

        },

    _setImage: function(e) {
        var form = this._form,
            //url = form.one('.' + CSS.INPUTURL).get('value'),
            searchtext = form.one('.pubchemsearch').get('value'),
            url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/'+searchtext+'/PNG';
            alt = searchtext,
            //width = form.one('.' + CSS.INPUTWIDTH).get('value'),
            //height = form.one('.' + CSS.INPUTHEIGHT).get('value'),
            //alignment = form.one('.' + CSS.INPUTALIGNMENT).get('value'),
            margin = '',
            //presentation = form.one('.' + CSS.IMAGEPRESENTATION).get('checked'),
            //constrain = form.one('.' + CSS.INPUTCONSTRAIN).get('checked'),
            //imagehtml,
            customstyle = '',
            //i,
            //css,
            classlist = [],
            host = this.get('host');

        e.preventDefault();

        // Focus on the editor in preparation for inserting the image.
        host.focus();
        if (url !== '') {

            var template = Y.Handlebars.compile(IMAGETEMPLATE);
            imagehtml = template({
                url: url,
                alt: alt,
               // width: width,
               // height: height,
               // presentation: presentation,
               // alignment: alignment,
                margin: margin,
                customstyle: customstyle,
                classlist: classlist.join(' ')
            });

            this.get('host').insertContentAtFocusPoint(imagehtml);

            this.markUpdated();
        }

        this.getDialogue({
            focusAfterHide: null
        }).hide();

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


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
