Ext.define('criterion.controller.payroll.GenerateForm', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'controller.criterion_payroll_generate_form',

        extend : 'criterion.app.ViewController',

        handleGenerate : function() {
            var form = this.getView();

            if (form.isValidSection('', true)) {
                form.fireEvent('generate', form.getValues());
            }
        },

        handleCancel : function() {
            this.getView().close();
        },

        handleEmployerChange : function(combo, employerId) {
            var me = this,
                vw = me.getView(),
                taxFilingCd,
                ptsc;

            vw.setLoading(true);
            Ext.Deferred.sequence([
                () => {
                    return criterion.Api.requestWithPromise({
                        url : API.EMPLOYER_PAYROLL_SETTINGS + '/?employerId=' + employerId,
                    }).then((result) => {
                        if (result && result[0]) {
                            taxFilingCd = result[0].taxFilingCd;
                        }
                    });
                },
                () => {
                    if (taxFilingCd) {
                        return criterion.CodeDataManager.getCodeDetailRecordStrict('id', taxFilingCd, criterion.consts.Dict.PTSC).then((record) => {
                            ptsc = record.get('code');
                        });
                    }
                }
            ]).always(function() {
                let generateType = me.lookup('generateType'),
                    store = generateType.getStore();

                store.filter('ptsc', ptsc);
                if (store.getCount()) {
                    generateType.setValue(store.getAt(0).get('value'));
                }
                vw.setLoading(false);
            });
        }

    }
});
