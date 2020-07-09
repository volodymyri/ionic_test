Ext.define('ess.view.Payroll', function() {

    return {
        alias : 'widget.ess_modern_payroll',

        extend : 'Ext.Container',

        requires : [
            'ess.view.payroll.PayHistory',
            'ess.view.payroll.PayHistoryInfo'
        ],

        cls : 'ess-modern-payroll',

        layout : 'card',

        viewModel : {
            data : {
                title : i18n.gettext('Pay History'),
                detailsMode : false
            }
        },

        listeners : {
            activate : function() {
                this.setActiveItem(this.down('ess_modern_payroll_pay_history'));
            }
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                bind : {
                    title : '{title}'
                },

                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-file-download',
                        hidden : true,
                        bind : {
                            hidden : '{!detailsMode}'
                        },
                        listeners : {
                            tap : function() {
                                this.up('ess_modern_payroll').down('criterion_payroll_pay_history_info').fireEvent('downloadPayrollReport');
                            }
                        }
                    },
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-more-horiz',
                        hidden : true,
                        bind : {
                            hidden : '{!detailsMode}'
                        },
                        listeners : {
                            tap : function() {
                                this.up('ess_modern_payroll').down('criterion_payroll_pay_history_info').fireEvent('showDownloadSettings');
                            }
                        }
                    }
                ]
            },

            {
                xtype : 'ess_modern_payroll_pay_history'
            },
            {
                xtype : 'criterion_payroll_pay_history_info',
                height : '100%',

                listeners : {
                    close : function() {
                        var main = this.up();
                        main.getLayout().setAnimation({
                                type: 'slide',
                                direction: 'right'
                            }
                        );
                        main.setActiveItem(main.down('ess_modern_payroll_pay_history'));
                        main.getViewModel().set({
                            title : i18n.gettext('Pay History'),
                            detailsMode : false
                        });
                    }
                }
            }
        ]

    };

});
