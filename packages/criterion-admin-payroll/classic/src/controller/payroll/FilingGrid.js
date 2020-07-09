Ext.define('criterion.controller.payroll.FilingGrid', function() {

    const TAX_FILING_TYPES = criterion.Consts.TAX_FILING_TYPES,
        T4_FILE_TYPES = criterion.Consts.T4_FILE_TYPES,
        TRANSMISSION_FILE_TYPE = criterion.consts.Dict.TRANSMISSION_FILE_TYPE,
        API = criterion.consts.Api.API;

    return {
        alias : 'controller.criterion_payroll_filing_grid',

        extend : 'criterion.controller.GridView',

        mixins : [
            'criterion.controller.mixin.SingleEmployer'
        ],

        handleActivate : function() {
            if (!this.checkViewIsActive()) {
                return;
            }

            if (criterion.CodeDataManager.getStore(TRANSMISSION_FILE_TYPE).isLoaded()) {
                this.load();
            } else {
                criterion.CodeDataManager.load([TRANSMISSION_FILE_TYPE], this.load, this);
            }
        },

        load : function() {
            if (!this.checkViewIsActive()) {
                return;
            }

            var view = this.getView(),
                store = this.getViewModel().getStore('transmissionFiles'),
                generateType = this.lookup('generateType').getValue(),
                generateTypeFirstCapital = generateType.charAt(0).toUpperCase(),
                employerId = this.lookup('employerCombo').getValue(),
                startDate = this.lookup('startDate').getValue(),
                endDate = this.lookup('endDate').getValue(),
                year = this.lookup('yearCombo').getValue(),
                params;

            if (!criterion.CodeDataManager.getStore(TRANSMISSION_FILE_TYPE).isLoaded()) {
                return;
            }

            view.setLoading(true);

            params = {
                type : generateTypeFirstCapital
            };

            if (employerId) {
                params.employerId = employerId;
            }

            if (startDate && generateType === TAX_FILING_TYPES.PERIOD) {
                params.startDate = Ext.Date.format(startDate, criterion.consts.Api.DATE_FORMAT);
            }

            if (endDate && generateType === TAX_FILING_TYPES.PERIOD) {
                params.endDate = Ext.Date.format(endDate, criterion.consts.Api.DATE_FORMAT);
            }

            if (year) {
                params.year = year;
            }

            store.getProxy().setExtraParams(params);

            store.loadWithPromise()
                .always(function() {
                    view.setLoading(false);
                });

        },

        handleSearch : function() {
            this.load();
        },

        handleGenerate : function() {
            var form = Ext.create('criterion.view.payroll.GenerateForm', {
                viewModel : {
                    stores : {
                        years : this.getViewModel().get('years')
                    }
                }
            });

            form.show();
            form.on('generate', function(values) {
                this.generateTransmission(values, form);

            }, this);
        },

        generateTransmission : function(values, form) {
            let me = this,
                generateType = values['generateType'],
                isPost = true,
                fileType,
                url;

            switch (generateType) {
                case TAX_FILING_TYPES.QUARTER:
                    url = API.EMPLOYER_PAYROLL_BATCH_GENERATE_QUARTERLY_CERIDIAN_XML;
                    break;
                case TAX_FILING_TYPES.ANNUAL:
                    url = API.EMPLOYER_PAYROLL_BATCH_GENERATE_ANNUAL_CERIDIAN_XML;
                    break;
                case TAX_FILING_TYPES.T4:
                    fileType = values['fileType'];
                    switch (fileType) {
                        case T4_FILE_TYPES.XML.value:
                            url = API.EMPLOYER_PAYROLL_BATCH_GENERATE_T4;
                            break;
                        case T4_FILE_TYPES.PDF_SINGLE.value:
                            url = API.EMPLOYER_T4_GENERATE_PDF;
                            isPost = false;
                            break;
                        case T4_FILE_TYPES.PDF_MULTIPLE.value:
                            url = API.EMPLOYER_T4_GENERATE_ZIP;
                            isPost = false;
                            break;
                    }
                    break;
            }

            if (url) {
                if (isPost) {
                    form.setLoading(true);

                    criterion.Api.requestWithPromise({
                        url : url,
                        method : 'POST',
                        jsonData : values
                    }).then({
                        success : function() {
                            criterion.Utils.toast(i18n.gettext('Successfully generated.'));
                        }
                    })
                        .always(function() {
                            form.setLoading(false);
                            form.close();

                            me.load();
                        });
                } else {
                    form.close();

                    window.open(criterion.Api.getSecureResourceUrl(url + '?' + Ext.Object.toQueryString({employerId : values['employerId'], year : values['year']})), '_blank');
                }
            }
        },

        handleDownloadAction : function(record) {
            window.open(criterion.Api.getSecureResourceUrl(API.EMPLOYER_PAYROLL_BATCH_DOWNLOAD_FILE + record.getId()));
            this.load();
        }
    }
});
