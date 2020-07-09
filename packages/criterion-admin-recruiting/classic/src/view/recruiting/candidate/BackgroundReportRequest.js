Ext.define('criterion.view.recruiting.candidate.BackgroundReportRequest', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_background_report_request',

        extend : 'criterion.ux.Panel',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                modal : true
            }
        ],

        closable : true,

        width : criterion.Consts.UI_CONFIG.MODAL_MEDIUM_WIDTH,

        title : i18n.gettext('Background Report'),

        bodyPadding : 20,

        items : [
            {
                xtype : 'criterion_form',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n.gettext('External Service'),
                        name : 'externalSystemCd',
                        codeDataId : criterion.consts.Dict.EXTERNAL_SYSTEM_NAME,
                        editable : false,
                        autoSetFirst : true,
                        allowBlank : false,
                        bind : {
                            filterValues : {
                                attribute : 'attribute1',
                                value : '1',
                                strict : true
                            }
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        name : 'packageCd',
                        fieldLabel : i18n.gettext('Package'),
                        codeDataId : criterion.consts.Dict.BACKGROUND_CHECK_PACKAGE,
                        editable : false,
                        autoSetFirst : true,
                        allowBlank : false
                    },
                    {
                        xtype : 'criterion_code_detail_field_multi_select',
                        codeDataId : criterion.consts.Dict.BACKGROUND_CHECK_SUB_PACKAGE,
                        fieldLabel : i18n.gettext('Additional Products'),
                        name : 'subPackageCd'
                    }
                ]
            }
        ],

        constructor : function() {
            this.bbar = [
                '->',
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        scope : this,
                        click : 'onRequest'
                    },
                    text : i18n.gettext('Request')
                }
            ];

            this.callParent(arguments);
        },
        
        onRequest : function() {
            var form = this.down('criterion_form');

            if (form.isValid()) {
                this.fireEvent('doRequest', form.getForm().getValues())
            }
        }

    };

});

