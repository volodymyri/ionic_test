Ext.define('criterion.view.person.course.EmployeeCourseAttachmentForm', function() {

    var DICT = criterion.consts.Dict,
        SYSTEM_ATTRIBUTE = '1',
        classAttachmentTypeFilter = function(item) {
            return item.get('attribute4') === SYSTEM_ATTRIBUTE;
        };

    return {
        alias : 'widget.criterion_person_course_attachment_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.person.course.EmployeeCourseAttachmentForm'
        ],

        controller : 'criterion_person_course_attachment_form',

        closeAction : 'hide',

        cls : 'criterion-modal',

        modal : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        viewModel : {
            data : {
                person : null,
                record : null
            },
            formulas : {
                cancelBtnText : function(get) {
                    return get('record.hasAttachment') ? i18n.gettext('Close') : i18n.gettext('Cancel');
                },
                hideDelete : function(get) {
                    return !get('record.hasAttachment') && !get('record.attachmentName');
                }
            }
        },

        bind : {
            title : '{person.fullName}: {record.name}'
        },

        items : [
            {
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            width : '100%'
                        },

                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                                allowBlank : false,
                                editable : false,
                                bind : {
                                    value : '{record.attachmentTypeCd}',
                                    readOnly : '{record.hasAttachment}'
                                },
                                name : 'attachmentTypeId',
                                emptyText : i18n.gettext('Type'),
                                filterFn : classAttachmentTypeFilter
                            },
                            {
                                xtype : 'textfield',
                                allowBlank : false,
                                emptyText : i18n.gettext('Name'),
                                bind : {
                                    value : '{record.attachmentName}',
                                    readOnly : '{record.hasAttachment}'
                                },
                                name : 'attachmentName'
                            },
                            {
                                xtype : 'criterion_filefield',
                                name : 'content',
                                reference : 'attachmentFile',
                                allowBlank : false,
                                emptyText : i18n.gettext('File'),
                                hidden : true,
                                bind : {
                                    hidden : '{record.hasAttachment}'
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                cls : 'criterion-btn-remove',
                handler : 'handleDelete',
                hidden : true,
                bind : {
                    hidden : '{hideDelete}'
                }
            },
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                handler : 'handleCancel',
                bind : {
                    text : '{cancelBtnText}'
                }
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                handler : 'handleDownload',
                text : i18n.gettext('Download'),
                hidden : true,
                bind : {
                    hidden : '{!record.hasAttachment}'
                }
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                handler : 'handleSubmit',
                formBind : true,
                hidden : true,
                text : i18n.gettext('Attach'),
                bind : {
                    hidden : '{record.hasAttachment}'
                }
            }
        ]
    };
});
