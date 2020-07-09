Ext.define('criterion.view.ess.community.HtmlEditor', function() {

    var matchIndex, matchSel;

    return {
        //TODO: fix navigation, highlight current person, add styles.

        alias : [
            'widget.criterion_ess_community_html_editor'
        ],

        /**
         * TODO Move common functional to parent
         * @type criterion.ux.form.field.HtmlEditor
         */

        extend : 'criterion.ux.form.field.HtmlEditor',

        requires : [
            'criterion.store.community.Users',
            'Ext.view.BoundList'
        ],

        cls : 'criterion-ess-community-htmleditor',

        config : {
            communityId : null,

            emptyText : i18n.gettext('What\'s on your mind?'),

            autoCompleteSign : '@',
            searchField : 'searchName',
            insertField : 'shortName'
        },

        pickerTpl : Ext.create('Ext.XTemplate',
            '<ul class="x-list-plain"><tpl for=".">',
            '<li role="option" class="x-boundlist-item"><b>{firstName:lowercase}.{lastName:lowercase}</b> ({personName})</li>',
            '</tpl></ul>'
        ),

        store : null,

        /**
         * @private
         */
        picker : null,

        enableAlignments : false,

        afterRender : function() {
            this.callParent(arguments);
            this.add(this.createPicker());

            if (!this.emptyTextOverlay && this.getEmptyText()) {
                this.emptyTextOverlay = Ext.create('Ext.Component', {
                    renderTo : this.inputCmp.el,
                    cls : 'community-htmleditor-emptytext',
                    html : this.getEmptyText()
                });
            }
        },

        initEditor : function() {
            var me = this,
                docEl, fn;

            me.callParent(arguments);

            if (me.destroying || me.destroyed) {
                return
            }

            if (!me.getEditorBody() || !me.getEmptyText()) {
                return
            }

            docEl = Ext.get(me.getDoc());
            docEl.dom.body.style.paddingLeft = '8px';

            fn = Ext.Function.createBuffered(me.docElEvent, 10, me);
            docEl.on({
                keyup : fn,
                keydown : fn,
                paste : fn,
                click : Ext.Function.createBuffered(me.docImgSelect, 10, me),
                delegated : false
            });
        },

        docImgSelect(e, el) {
            if (el.tagName === 'IMG') {
                Ext.defer(() => {
                    el.focus();
                }, 200)
            }
        },

        docElEvent : function(e) {
            var dbody = this.getEditorBody();

            this.emptyTextOverlay && dbody && this.emptyTextOverlay.setVisible(!(this.sourceEditMode || dbody.innerHTML.replace(/\u200B/g, '').length));

            /**
             * @see Ext.form.field.HtmlEditor.syncValue
             * Detect if value is '<br>' works only for Gecko.
             * */

            if (this.getValue() === '<br>') {
                this.setValue('')
            }

            if (e.type === 'paste') {
                this.fireEvent('change');
            }

        },

        toggleSourceEdit : function(sourceEditMode) {
            var value = this.getValue();

            this.emptyTextOverlay && this.emptyTextOverlay.setVisible(!(sourceEditMode || value.replace(/\u200B/g, '').length));

            this.callParent(arguments);

            this.checkChange();
        },

        createPicker : function() {
            this.store = Ext.create('criterion.store.community.Users');

            if (this.getCommunityId()) {
                this.store.getProxy().setExtraParam('communityId', this.getCommunityId());
                this.store.load();
            }

            this.picker = Ext.create('Ext.view.BoundList', {
                hidden : true,
                pickerField : this,
                store : this.store,
                floating : true,
                tpl : this.pickerTpl,
                preserveScrollOnRefresh : true,

                loadingHeight : 70,
                minWidth : 70,
                maxHeight : 300,
                shadow : 'sides',

                listeners : {
                    scope : this,
                    select : this.onPickerSelect
                }
            });

            this.picker.getNavigationModel().navigateOnSpace = false;

            return this.picker;
        },

        setCommunityId : function(id) {
            if (id && this.store) {
                this.store.getProxy().setExtraParam('communityId', id);
                this.store.load();
            }

            this.callParent(arguments);
        },

        expandPicker : function(index, selection) {
            var me = this,
                picker = this.picker;

            if (picker && !picker.isVisible()) {
                picker.show();
                this.handlePickerAlign();

                picker.mon(Ext.getBody(), 'click', this.checkClick, this);

                me.scrollListeners = Ext.on({
                    scroll : me.onGlobalScroll,
                    scope : me,
                    destroyable : true
                });

                matchIndex = index;
                matchSel = selection;
            }
        },

        collapsePicker : function() {
            var picker = this.picker;

            if (picker && picker.isVisible()) {
                picker.hide();
                picker.getSelectionModel().deselectAll();
                picker.mun(Ext.getBody(), 'click', this.checkClick, this);

                this.scrollListeners.destroy();

                matchIndex = matchSel = null;
            }
        },

        handlePickerAlign : function() {
            if (this.picker && this.picker.isVisible() && this.picker.isFloating()) {
                this.picker.setWidth(this.inputEl.getWidth());
                this.picker.alignTo(this.inputEl, 'bl-tl?', [0, -2]);
            }
        },

        checkClick : function(e, el) {
            if (!Ext.fly(el).up('.x-boundlist') !== this.picker.el) {
                this.collapsePicker();
            }
        },

        onResize : function() {
            this.handlePickerAlign();
        },

        onPickerSelect : function(sel, record) {
            if (matchSel) {
                var doc = this.getDoc(),
                    range = matchSel.getRangeAt(0),
                    input = doc.createElement("input");

                input.setAttribute('type', 'button');
                input.setAttribute('disabled', true);
                input.setAttribute('style', "color: unset; font-weight: bold; border: none; background: none; padding: 0;");
                input.setAttribute('value', record.get(this.getInsertField()));
                input.setAttribute('personid', record.get('personId'));

                range.setStart(range.startContainer, matchIndex);
                range.deleteContents();
                range.insertNode(input);

                range.setStartAfter(input);
                range.setEndAfter(input);
                matchSel.removeAllRanges();
                matchSel.addRange(range);
                this.syncValue();
            }

            this.collapsePicker();
        },

        onChange : function(value) {
            var me = this,
                win = me.getWin(),
                sel, range;

            this.emptyTextOverlay && this.emptyTextOverlay.setVisible(!(this.sourceEditMode || value.replace(/\u200B/g, '').length));

            if (me.activated) {
                win.focus();
                if (win.getSelection) {
                    sel = win.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        var sign = me.getAutoCompleteSign();

                        range = sel.getRangeAt(0);

                        if (range.collapsed && range.startContainer.data && range.startContainer.data.substr(0, range.startOffset).indexOf(sign) > -1) {
                            var data = range.startContainer.data.substr(0, range.startOffset).concat(sign),
                                re = new RegExp(Ext.util.Format.format('{0}([\\w.]*){0}', sign), 'gi'),
                                match;

                            var matchArr = re.exec(data);

                            if (matchArr && matchArr.length) {
                                match = matchArr[1];

                                this.store.clearFilter();
                                if (match) {
                                    var field = this.getSearchField();

                                    this.store.filterBy(function(record) {
                                        return record.get(field).toLowerCase().indexOf(match.toLowerCase()) > -1;
                                    });
                                }
                                this.handlePickerAlign();

                                if (this.store.getCount()) {
                                    this.expandPicker(matchArr.index, sel);
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            this.collapsePicker();
        },

        onGlobalScroll : function() {
            this.collapsePicker();
        }
    }
});
