Ext.define('criterion.view.settings.EmployerBar', function() {

    return {

        extend : 'Ext.toolbar.Toolbar',

        alias : 'widget.criterion_settings_employer_bar',

        config : {
            allowBlank : false,
            labelWidth : null,
            minWidth : 380
        },

        defaultListenerScope : true,

        blockable : false,

        padding : '0',

        cls : 'criterion-settings-employer-bar',

        initComponent : function() {
            var labelWidth = this.getLabelWidth();

            this.items = [
                Ext.Object.merge({
                    xtype : 'criterion_employer_combo',
                    fieldLabel : i18n.gettext('Employer'),
                    listeners : {
                        change : 'onChange'
                    },
                    value : criterion.Api.getEmployerId(),
                    allowBlank : this.getAllowBlank(),
                    minWidth : this.getMinWidth(),
                    skipRequiredMark : true
                }, (labelWidth ? {labelWidth : labelWidth} : {}))
            ];

            this.callParent(arguments);

            Ext.GlobalEvents.on('employerChanged', this.onEmployerChange, this);

            if (this.blockable) {
                Ext.GlobalEvents.on('blockEmployerBar', this.onBlockEmployerBar, this, {
                    buffer : 1
                });
            }
        },

        onEmployerChange : function(employer, oldEmployer) {
            var combo = this.down('criterion_employer_combo');

            combo.suspendEvents(false);
            employer ? combo.setValue(employer.getId()) : null;
            combo.resumeEvents();
        },

        onBlockEmployerBar : function(state) {
            state ? this.hide() : this.show();
        },

        onChange : function(cmp, employerId) {
            if (!Ext.isEmpty(employerId)) {
                Ext.defer(function() {
                    // need to defer because data from chained Employer Bars may be not loaded at the point
                    criterion.Application.setEmployer(employerId);
                }, 10);
            }
        },

        setEmployerValue : function(employerId) {
            this.down('criterion_employer_combo').setValue(employerId);
        }

    }

});
