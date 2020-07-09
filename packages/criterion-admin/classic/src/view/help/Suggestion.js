/**
 * @deprecated kill after 09.08.18
 */
Ext.define('criterion.view.help.Suggestion', function() {

    return {
        alias : 'widget.criterion_help_suggestion',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.help.Suggestion'
        ],

        controller : {
            type : 'criterion_help_suggestion',
            externalUpdate : false
        },

        listeners : {
            save : 'onSave'
        },

        bodyPadding : 20,

        noButtons : true,

        items : [
            {
                xtype : 'textfield',
                labelAlign : 'top',
                fieldLabel : i18n.gettext('Title'),
                maxLength : 100,
                bind : {
                    value : '{record.title}',
                    hidden : '{!isPhantom}'
                },
                hidden : true
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Suggestion'),
                labelAlign : 'top',
                bind : {
                    value : '{record.details}',
                    hidden : '{!isPhantom}'
                },
                hidden : true,
                height : 120
            },
            {
                xtype : 'component',
                cls : 'criterion-help-post-entry view-suggestion',
                hidden : true,
                bind : {
                    hidden : '{isPhantom}',
                    html : '<table>' +
                    '<tr><td class="label">{record.title}</td></tr>' +
                    '<tr><td>{record.details}</td></tr>' +
                    '<tr><td class="status">' + i18n.gettext('Status') +
                        '<span class="split">:</span>' +
                        '<span class="status {record.status}">{record.statusText}</span></td></tr>' +
                    '</table>'
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

                        margin : '0 0 0 10',

                        cls : 'criterion-btn-primary',

                        hidden : true,
                        bind : {
                            hidden : '{!isPhantom}'
                        },

                        listeners : {
                            click : 'handleSubmitClick'
                        },
                        text : i18n.gettext('Send')
                    }
                ]
            }
        ]
    };
});
