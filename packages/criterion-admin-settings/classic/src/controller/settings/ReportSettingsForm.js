Ext.define('criterion.controller.settings.ReportSettingsForm', function() {

    return {
        alias : 'controller.criterion_report_settings_form',

        extend : 'criterion.controller.FormView',

        handleActivate : function() {
            if (!this.checkViewIsActive()) {
                return
            }

            var me = this,
                view = this.getView(),
                reportSettings = this.getViewModel().getStore('reportSettings');

            view.setLoading(true, null);

            reportSettings.load({
                callback : function(store) {
                    if (!reportSettings.count()) {
                        reportSettings.add({});
                    }

                    view.setLoading(false);
                    me.handleRecordLoad(reportSettings.getAt(0));
                }
            });
        },

        handleRecordLoad : function(record) {
            var view = this.getView(),
                vm = this.getViewModel(),
                organizationLogo = this.lookup('organizationLogo');

            vm.set({
                record : record,
                editMode : !record.phantom
            });

            if (!record.phantom) {
                organizationLogo.updateLogo(record.getId(), 'REPORT_SETTINGS');

                view.loadRecord(record);
            } else {
                organizationLogo.setNoLogo();
            }

            this.callParent(arguments);
        },

        handleUpdate : function() {
            var me = this,
                record = this.getRecord();

            if (!this.getView().getForm().isValid()) {
                this.focusInvalidField();
                return;
            }

            record.save({
                callback : function() {
                    criterion.Utils.toast(i18n.gettext('Settings saved.'));
                    me.handleActivate();
                }
            });
        },

        handleLogoUploadSuccess : function() {
            var record = this.getRecord();

            record.set('modified', new Date());
            record.save();
        },

        handleDateFormatChange : function(cmp, value) {
            Ext.query('small.dateFormatDemo', false)[0].setHtml(Ext.util.Format.date(new Date(), value || 'g:i A'));
        },

        handleTimeFormatChange : function(cmp, value) {
            Ext.query('small.timeFormatDemo', false)[0].setHtml(Ext.util.Format.date(new Date(), value || 'g:i A'));
        },

        handleDecimalSeparatorChange : function(cmp, newVal) {
            this.getViewModel().set('record.decimalSeparator', newVal);
        },

        handleThousandSeparatorChange : function(cmp, newVal) {
            this.getViewModel().set('record.thousandSeparator', newVal);
        }
    };

});
