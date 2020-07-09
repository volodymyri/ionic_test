Ext.define('criterion.view.settings.learning.class.ClassAttachments', function() {

    var DICT = criterion.consts.Dict,
        SYSTEM_ATTRIBUTE = '1',
        classAttachmentTypeFilter = function(item) {
            return item.get('attribute4') === SYSTEM_ATTRIBUTE;
        };

    return {

        alias : 'widget.criterion_settings_learning_class_attachments',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.learning.class.ClassAttachments',
            'criterion.store.employer.course.class.ClassAttachments'
        ],

        title : i18n.gettext('Class attachments'),

        viewModel : {
            data : {
                typeId : null,
                name : null,
                attachmentFile : null
            },
            stores : {
                attachments : {
                    type : 'criterion_employer_course_class_attachments'
                }
            }
        },

        controller : {
            type : 'criterion_settings_learning_class_attachments'
        },

        listeners : {
            show : 'handleShow'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 0,
        closable : true,
        modal : true,
        alwaysOnTop : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : '70%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                modal : true
            }
        ],

        items : [
            {
                xtype : 'criterion_form',
                reference : 'form',
                layout : 'hbox',
                bodyPadding : 10,
                items : [
                    {
                        xtype : 'container',
                        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,
                        layout : 'hbox',
                        flex : 1,
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                                editable : false,
                                bind : '{typeId}',
                                name : 'attachmentTypeId',
                                emptyText : i18n.gettext('Type'),
                                allowBlank : false,
                                filterFn : classAttachmentTypeFilter
                            },
                            {
                                xtype : 'textfield',
                                allowBlank : false,
                                emptyText : i18n.gettext('Name'),
                                bind : '{name}',
                                name : 'name'
                            },
                            {
                                xtype : 'criterion_filefield',
                                name : 'content',
                                reference : 'attachmentFile',
                                allowBlank : false,
                                emptyText : i18n.gettext('File'),
                                bind : {
                                    rawValue : '{attachmentFile}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        formBind : true,
                        handler : 'handleAddClick'
                    }

                ]
            },
            {
                xtype : 'criterion_gridpanel',
                reference : 'attachmentsGrid',
                flex : 1,
                bind : {
                    store : '{attachments}'
                },
                columns : [
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Type'),
                        dataIndex : 'documentTypeCd',
                        flex : 1,
                        codeDataId : DICT.DOCUMENT_RECORD_TYPE
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        dataIndex : 'name',
                        flex : 1
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-download-outline'],
                                tooltip : i18n.gettext('View'),
                                action : 'viewaction'
                            },
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            }
                        ]
                    }
                ],
                listeners : {
                    viewaction : 'handleAttachmentView',
                    removeaction : 'handleRemoveAttachment'
                },
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Close'),
                cls : 'criterion-btn-primary',
                handler : 'handleClose'
            }
        ]
    }
});
