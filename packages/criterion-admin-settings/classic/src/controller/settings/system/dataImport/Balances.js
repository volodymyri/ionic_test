Ext.define('criterion.controller.settings.system.dataImport.Balances', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_balances',

        submitHandler : function() {
            let validateAccruals = this.lookup('validateAccruals').getValue(),
                tolerance = this.lookup('tolerance').getValue();

            this.pushForm({
                windowTitle : i18n.gettext('Time Off Balances Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.BALANCES_IMPORT,
                    data : Ext.Object.merge({
                        balancesFile : this.templateFile,
                        employerId : this.getSelectedEmployerId(),
                        validateAccruals
                    }, tolerance ? { tolerance } : {})
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.BALANCES_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.BALANCES_IMPORT_UPDATE,
                    orderedParams : [
                        this.getSelectedEmployerId(),
                        criterion.Api.getEmployeeId(),
                        validateAccruals,
                        tolerance
                    ],
                    additionalParams : tolerance ? { tolerance } : null
                }
            });
        }
    }
});
