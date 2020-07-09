Ext.define('criterion.view.codeTable.CodeTableForm', function() {

    return {
        alias : 'widget.criterion_settings_codetable_form',

        extend : 'criterion.view.FormView',

        header : {
            title : i18n.gettext('Code Table Details'),
            cls : ''
        },

        viewModel : {
            data : {},
            formulas : {
                hideDelete : function(data) {
                    return data('isCreate');
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : '25 10',

        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDER,

        setButtonConfig : function() {
            this.buttons = [
                {
                    xtype : 'button',
                    text : i18n.gettext('Delete'),
                    cls : 'criterion-btn-remove',
                    listeners : {
                        click : function() {
                            var form = this.up('criterion_settings_codetable_form');
                            form.fireEvent('remove', form.getRecord(), form);
                        }
                    },
                    bind : {
                        hidden : '{hideDelete}',
                        disabled : '{detailsCount}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    cls : 'criterion-btn-light',
                    text : i18n.gettext('Cancel'),
                    listeners : {
                        click : 'handleCancelClick'
                    }
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Save'),
                    listeners : {
                        click : function() {
                            var form = this.up('criterion_settings_codetable_form'),
                                record = form.getRecord();

                            if (form.isValid()) {
                                form.updateRecord(record);
                                form.fireEvent('save', record, form);
                            }
                        }
                    }
                }
            ];
        },

        items : [
            {
                xtype : 'textfield',
                name : 'name',
                fieldLabel : i18n.gettext('Name'),
                allowBlank : false,
                bind : {
                    readOnly : '{!isCreate}'
                }
            },
            {
                xtype : 'textfield',
                name : 'description',
                fieldLabel : i18n.gettext('Description'),
                allowBlank : false
            },

            {
                xtype : 'textfield',
                name : 'attribute1Caption',
                fieldLabel : i18n.gettext('Attribute1 Caption')
            },
            {
                xtype : 'textfield',
                name : 'attribute2Caption',
                fieldLabel : i18n.gettext('Attribute2 Caption')
            },
            {
                xtype : 'textfield',
                name : 'attribute3Caption',
                fieldLabel : i18n.gettext('Attribute3 Caption')
            },
            {
                xtype : 'textfield',
                name : 'attribute4Caption',
                fieldLabel : i18n.gettext('Attribute4 Caption')
            },
            {
                xtype : 'textfield',
                name : 'attribute5Caption',
                fieldLabel : i18n.gettext('Attribute5 Caption')
            },
            {
                xtype : 'hiddenfield',
                name : 'isCustom',
                value : true
            },
            {
                xtype : 'hiddenfield',
                name : 'isSystem',
                value : false
            }
        ],

        loadRecord : function(record) {
            var vm = this.getViewModel();

            if (record) {
                vm.set('detailsCount', criterion.CodeDataManager.getStore(record.getId()).count());
            }

            this.callParent(arguments);
        }
    };
});
