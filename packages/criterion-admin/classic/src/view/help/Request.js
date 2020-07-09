Ext.define('criterion.view.help.Request', function() {

    return {
        alias : 'widget.criterion_help_request',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.help.Request'
        ],

        controller : {
            type : 'criterion_help_request',
            externalUpdate : true
        },

        bodyPadding : 20,

        noButtons : true,

        listeners : {
            afterrender : 'handleAfterRender'
        },

        viewModel : {
            data : {
                files : null,
                fileNames : ''
            }
        },

        items : [
            {
                xtype : 'container',
                cls : 'request-disclaimer',

                items : [
                    {
                        xtype : 'component',
                        cls : 'disclaimer-text',
                        padding : '15 20 5',
                        html : i18n.gettext('Before you submit a ticket, please check to see if your question has already been answered in our knowledge base.')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-transparent',
                        handler : 'onHelpClick',
                        text : i18n.gettext('View help articles')
                    }
                ]
            },
            {
                xtype : 'textfield',
                padding : '10 0 0',
                labelAlign : 'top',
                fieldLabel : i18n.gettext('Subject'),
                bind : '{record.subject}'
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Description'),
                labelAlign : 'top',
                bind : '{record.description}',
                height : 120
            },
            {
                xtype : 'component',
                padding : '0 0 10',
                cls : 'request-info',
                html : i18n.gettext('Please enter the details of your request. A member of our support staff will respond as soon as possible.')
            },
            {
                xtype : 'fieldcontainer',
                reference : 'imageHolder',
                fieldLabel : i18n.gettext('Attachments'),
                labelAlign : 'top',
                items : [
                    {
                        xtype : 'component',
                        height : 90,
                        cls : 'upload-zone',
                        html : '<div class="upload-text">' +
                                    '<span class="icon">&#' + criterion.consts.Glyph['ios7-cloud-upload'] + '</span>' +
                                    '<span class="add-holder"></span>' +
                                    '<span class="description">' + i18n.gettext('or drop files here') + '</span>' +
                                '</div>'
                    }
                ]
            },
            {
                xtype : 'component',
                padding : '0 0 20',
                cls : 'request-info',
                bind : {
                    html : '{fileNames}',
                    hidden : '{!fileNames}'
                }
            },
            {
                xtype : 'container',

                layout : {
                    type : 'hbox',
                    pack : 'end'
                },

                items : [
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',

                        margin : '0 10 0 0',

                        listeners : {
                            click : 'handleCancelClick'
                        },
                        text : i18n.gettext('Cancel')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        listeners : {
                            click : 'handleSubmitClick'
                        },
                        text : i18n.gettext('Submit')
                    }
                ]
            }
        ]
    };

});
