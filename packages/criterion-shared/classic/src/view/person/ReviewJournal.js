Ext.define('criterion.view.person.ReviewJournal', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'widget.criterion_person_review_journal',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.ReviewJournal',
            'criterion.ux.form.field.File'
        ],

        viewModel : {
            data : {
                maxFileSize : null,
                readOnly : false
            },
            formulas : {
                fileName : {
                    get : function(data) {
                        return data('record.attachmentName');
                    },
                    set : Ext.emptyFn
                },

                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_JOURNAL_ENTRIES, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_JOURNAL_ENTRIES, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        controller : 'criterion_person_review_journal',

        listeners : {
            afterSave : 'handleAfterSave'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'panel',
                frame : true,
                bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.TWO_COL_ACCORDION_CONTAINER,
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION,

                items : [
                    {
                        xtype : 'container',

                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Group'),
                                name : 'journalGroupCd',
                                codeDataId : criterion.consts.Dict.JOURNAL_GROUP,
                                readOnly : true,
                                bind : {
                                    value : '{record.journalGroupCd}',
                                    readOnly : '{readOnly}'
                                },
                                allowBlank : false
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Private'),
                                name : 'isPrivate',
                                readOnly : true,
                                bind : {
                                    value : '{record.isPrivate}',
                                    readOnly : '{readOnly}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Title'),
                                readOnly : true,
                                bind : {
                                    value : '{record.title}',
                                    readOnly : '{readOnly}'
                                },
                                name : 'title',
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_filefield',
                                name : 'document',
                                reference : 'fileSelector',

                                showFileButton : false,

                                buttonConfig : {
                                    text : '',
                                    glyph : criterion.consts.Glyph['plus']
                                },

                                fieldLabel : i18n.gettext('Attachment'),
                                bind : {
                                    rawValue : '{fileName}',
                                    showViewTrigger : '{fileName}',
                                    showFileButton : '{!readOnly}'
                                },
                                maxFileSizeUrl : API.EMPLOYEE_REVIEW_JOURNAL_MAX_FILE_SIZE,

                                listeners : {
                                    viewFile : 'onViewFile'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'panel',
                frame : true,
                flex : 1,
                margin : '25 0 0',
                bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'htmleditor',
                        name : 'description',
                        flex : 1,
                        enableAlignments : false,

                        readOnly : true,
                        bind : {
                            value : '{record.description}',
                            readOnly : '{readOnly}'
                        }
                    }
                ]
            }
        ]
    };

});
