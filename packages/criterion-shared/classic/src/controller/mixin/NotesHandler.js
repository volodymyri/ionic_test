Ext.define('criterion.controller.mixin.NotesHandler', function() {

    return {

        extend : 'Ext.Mixin',

        mixinId : 'criterion_notes_handler',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        _getNotesPopupItems() {
            return [
                {
                    xtype : 'textarea',
                    reference : 'notesField',
                    maxLength : 250,
                    maxLengthText : i18n.gettext('The maximum length for this field is') + ' {0}',
                    bind : {
                        value : '{notes}',
                        disabled : '{!isEditable}'
                    },
                    flex : 1
                }
            ];
        },

        _onClickSaveNotes() {
            let wnd = this.up('criterion_window'),
                notesField = wnd.down('[reference=notesField]');

            if (!notesField.validate()) {
                return;
            }

            wnd.fireEvent('changeNotes', wnd.getViewModel().get('notes'));
        },

        showNotesPopup(notes, readOnlyMode) {
            let me = this,
                picker;

            picker = Ext.create('criterion.ux.window.Window', {
                title : i18n.gettext('Notes'),
                resizable : false,
                bodyPadding : 10,
                frame : true,
                modal : true,
                draggable : false,
                plugins : {
                    ptype : 'criterion_sidebar',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                    height : '50%',
                    modal : true
                },
                cls : 'criterion-modal',
                viewModel : {
                    data : {
                        notes : notes,
                        isEditable : !readOnlyMode
                    }
                },
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : this._getNotesPopupItems(),

                buttons : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        listeners : {
                            click : function() {
                                picker.fireEvent('close');
                            }
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Save'),
                        hidden : true,
                        bind : {
                            hidden : '{!isEditable}'
                        },
                        listeners : {
                            click : this._onClickSaveNotes
                        }
                    }
                ]
            });

            picker.on('show', function() {
                this.down('[reference=notesField]').focus();
            });

            picker.show();

            picker.on('changeNotes', function(notes) {
                me.setCorrectMaskZIndex(false);
                if (Ext.isFunction(me.changeNotes)) {
                    me.changeNotes(notes);
                }
                picker.destroy();
            });

            picker.on('close', function() {
                me.setCorrectMaskZIndex(false);
                picker.destroy();
            });

            this.setCorrectMaskZIndex(true);
        }
    }

});
