Ext.define('criterion.controller.payroll.payProcessing.GLExport', function() {

    var API = criterion.consts.Api.API,
        BATCH_STATUSES = criterion.Consts.BATCH_STATUSES,
        BATCH_AGGREGATED_STATUSES = criterion.Consts.BATCH_AGGREGATED_STATUSES,
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_pay_processing_gl_export',

        requires : [
            'criterion.store.acumatica.Branches'
        ],

        mixins : [
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        suspendSearch : true,

        handleActivate : function() {
            var me = this,
                employerId = this.lookupReference('employerCombo').getValue();

            me.suspendSearch = true;
            Ext.promise.Promise.all([
                this.getViewModel().getStore('gLSetup').loadWithPromise(),
                this.getViewModel().getStore('glExportApps').loadWithPromise(),
                criterion.CodeDataManager.load([DICT.BATCH_STATUS])
            ]).then(function() {
                me.suspendSearch = false;
                if (employerId) {
                    me.setEmployerId(employerId);
                }

                me.handleSearch();
            });
        },

        handleEmployerChange : function(combo, employerId) {
            this.setEmployerId(employerId);
        },

        setEmployerId : function(employerId) {
            var vm = this.getViewModel(),
                glsStore = vm.getStore('gLSetup'),
                recIndx;

            vm.set('gLSetupRecord', null);

            recIndx = glsStore.findExact('employerId', employerId);

            if (recIndx !== -1) {
                vm.set('gLSetupRecord', glsStore.getAt(recIndx));
            }

            if (this.checkViewIsActive()) {
                this.handleSearch();
            }
        },

        handleSearch : function() {

            if (this.suspendSearch) {
                return;
            }

            var vm = this.getViewModel(),
                batches = vm.getStore('batchesForExport'),
                employerId = this.lookup('employerCombo').getValue(),
                startDate = this.lookup('startDate').getValue(),
                endDate = this.lookup('endDate').getValue(),
                year = this.lookup('yearCombo').getValue(),
                status = this.lookup('statusCombo').getValue(),
                params = {};

            if (!criterion.CodeDataManager.getStore(DICT.BATCH_STATUS).isLoaded()) {
                return;
            }

            if (employerId) {
                params.employerId = employerId;
            }

            if (startDate) {
                params.startDate = Ext.Date.format(startDate, criterion.consts.Api.DATE_FORMAT);
            }

            if (endDate) {
                params.endDate = Ext.Date.format(endDate, criterion.consts.Api.DATE_FORMAT);
            }

            if (year) {
                params.year = year;
            }

            if (status === BATCH_AGGREGATED_STATUSES.OPEN) {
                // Open (this will show batches - To Be paid, Paid, Reversal)
                params['batchStatusCds'] = [
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.TO_BE_PAID, DICT.BATCH_STATUS).getId(),
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.PAID, DICT.BATCH_STATUS).getId(),
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.REVERSAL, DICT.BATCH_STATUS).getId()
                ].join(',');
            }

            if (status === BATCH_AGGREGATED_STATUSES.COMPLETED) {
                // Completed - show batches Completed and Reversal Completed
                params['batchStatusCds'] = [
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.COMPLETE, DICT.BATCH_STATUS).getId(),
                    criterion.CodeDataManager.getCodeDetailRecord('code', BATCH_STATUSES.REVERSAL_COMPLETE, DICT.BATCH_STATUS).getId()
                ].join(',');
            }

            batches.load({
                params : params
            });
        },

        _actExport : function(batchId, branchId) {
            let me = this,
                view = this.getView(),
                urlParams = {
                    batchId : batchId
                };

            if (branchId) {
                urlParams['branchId'] = branchId;
            }

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : API.GL_EXPORT_EXPORT,
                urlParams : urlParams,
                method : 'GET'
            }).then(function(res) {
                if (me.isDelayedResponse(res)) {
                    me.controlDeferredProcess(
                        i18n.gettext('Export'),
                        i18n.gettext('Export in progress'),
                        res.processId
                    );
                } else {
                    me.processingCheckResult(res);
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        showExportResult : function(res) {
            var resMsg = [];

            if (res['missingIncomes']) {
                resMsg.push(i18n.gettext('the following incomes has no GL account: ') + res.missingIncomes);
            }

            if (res['missingTaxes']) {
                resMsg.push(i18n.gettext('the following taxes has no GL account: ') + res.missingTaxes);
            }

            if (res['missingDeductions']) {
                resMsg.push(i18n.gettext('the following deductions has no GL account: ') + res.missingDeductions);
            }

            criterion.Msg.info({
                title : i18n.gettext('GL Export'),
                message : i18n.gettext('The record exported') + (resMsg.length ? ', ' + resMsg.join(',') : '') + '.'
            });
        },

        handleExport : function(widget) {
            var me = this,
                view = this.getView(),
                rec = widget.getWidgetRecord(),
                batchId = rec.getId();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : API.GL_EXPORT_PREVIEW,
                urlParams : {
                    batchId : batchId
                },
                method : 'GET'
            }).then(function(res) {
                widget.setUserCls('link-visited');

                me.widgetInProgress = widget;

                if (me.isDelayedResponse(res)) {
                    me.controlDeferredProcess(
                        i18n.gettext('Download'),
                        i18n.gettext('Download in progress'),
                        res.processId
                    );
                } else {
                    me.processingCheckResult(res);
                }
            }).otherwise(function() {
                view.setLoading(false);
            });
        },

        showPreview : function(res) {
            let me = this,
                view = me.getView(),
                widget = me.widgetInProgress,
                rec = widget.getWidgetRecord(),
                employerId = rec.get('employerId'),
                batchId = rec.getId(),
                glExportAppRecord = widget.glExportAppRecord,
                previewComponent,
                picker, acumaticaBranchesStore;

            me.widgetInProgress = null;
            if (res.responseFormat === criterion.Consts.GL_RESPONSE_FORMAT.XML) {
                previewComponent = {
                    xtype : 'component',
                    html : '<pre class="payload pre-scrollable">' + criterion.Utils.formatXml(res.content) + '</pre>'
                }
            } else {
                var content = res.content,
                    columns = [],
                    data = [],
                    fields = [];

                Ext.Array.sort(content.headers, function(a, b) {
                    a = a.index;
                    b = b.index;

                    if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    }
                    return 0;
                });

                Ext.Array.each(content.headers, function(header) {
                    columns.push({
                        xtype : 'gridcolumn',
                        dataIndex : 'col_' + header['index'],
                        flex : 1,
                        text : header['name']
                    });

                    fields.push({
                        name : 'col_' + header['index'],
                        type : 'string'
                    });
                });

                Ext.Array.each(content.details, function(detail) {
                    var dataItem = {};

                    Ext.Array.each(detail, function(detailItem) {
                        dataItem['col_' + detailItem['index']] = detailItem['value'];
                    });

                    data.push(dataItem);
                });

                previewComponent = {
                    xtype : 'criterion_gridpanel',
                    columns : columns,
                    store : Ext.create('Ext.data.Store', {
                        fields : fields,
                        data : data
                    })
                }
            }

            picker = Ext.create('criterion.ux.Panel', {
                title : i18n.gettext('Preview'),
                bodyPadding : 0,

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_FIXED_HEIGHT
                    }
                ],
                viewModel : {
                    data : {
                        branchId : null,
                        isGLInterfaceExportTypeFile : glExportAppRecord ? glExportAppRecord.getId() === criterion.Consts.GL_INTERFACE_EXPORT_TYPE_FILE_ID : false
                    },
                    formulas : {
                        showBranch : {
                            bind : {
                                bindTo : '{acumaticaBranches}',
                                deep : true
                            },
                            get : function(acumaticaBranches) {
                                return acumaticaBranches && acumaticaBranches.count() >= 1
                            }
                        },

                        canTransmit : {
                            bind : {
                                bindTo : '{acumaticaBranches}',
                                deep : true
                            },
                            get : function(acumaticaBranches) {
                                return acumaticaBranches && acumaticaBranches.count() >= 1 ? this.get('branchId') : true
                            }
                        }
                    },
                    stores : {
                        acumaticaBranches : {
                            type : 'criterion_acumatica_branches',
                            proxy : {
                                extraParams : {
                                    employerId : employerId
                                }
                            }
                        }
                    }
                },

                layout : 'fit',

                items : [
                    previewComponent
                ],

                bbar : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Download'),
                        cls : 'criterion-btn-primary',
                        listeners : {
                            click : function() {
                                window.open(criterion.Api.getSecureResourceUrl(API.GL_EXPORT_EXPORT_FILE + '?batchId=' + rec.getId()));
                            }
                        }
                    },
                    '->',
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Branch ID'),
                        labelWidth : 80,
                        displayField : 'name',
                        valueField : 'name',
                        queryMode : 'local',
                        allowBlank : false,
                        forceSelection : true,
                        autoSelect : true,
                        bind : {
                            value : '{branchId}',
                            store : '{acumaticaBranches}',
                            readOnly : '{acumaticaBranches.count <= 1}',
                            disabled : '{!showBranch}',
                            hidden : '{!showBranch || isGLInterfaceExportTypeFile}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        listeners : {
                            click : function() {
                                picker.close();
                            }
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Transmit'),
                        cls : 'criterion-btn-primary',
                        disabled : true,
                        bind : {
                            disabled : '{!canTransmit}',
                            hidden : '{isGLInterfaceExportTypeFile}'
                        },
                        listeners : {
                            click : function() {
                                var branchId = this.up('criterion_panel').getViewModel().get('branchId');

                                picker.close();
                                me._actExport(batchId, branchId);
                            }
                        }
                    }
                ]
            });

            view.setLoading(false);

            picker.show();

            picker.setLoading(true);
            acumaticaBranchesStore = picker.getViewModel().getStore('acumaticaBranches');
            acumaticaBranchesStore.loadWithPromise().then(() => {
                let first = acumaticaBranchesStore.getAt(0),
                    firstValue = first ? first.get('name') : null;

                picker.getViewModel().set('branchId', firstValue);
            }).always(() => {
                picker.setLoading(false);
            });
        },

        handleDownload : function(rec) {
            window.open(criterion.Api.getSecureResourceUrl(API.GL_EXPORT_EXPORT_FILE + '?batchId=' + rec.getId()));
        },

        processingCheckResult : function(res) {
            var me = this,
                originalResult = res.result;

            if (me.widgetInProgress) {
                me.showPreview(originalResult);
            } else {
                me.showExportResult(originalResult);
            }
        },

        handleRemove(record) {
            let me = this,
                view = this.getView();

            criterion.Msg.confirmDelete(
                {
                    title : i18n.gettext('Clear Data'),
                    message : i18n.gettext('Do you want to clear the data for that batch?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        view.setLoading(true);

                        criterion.Api.requestWithPromise({
                            url : API.GL_EXPORT_PREVIEW,
                            urlParams : {
                                batchId : record.getId()
                            },
                            method : 'DELETE'
                        }).then(() => {
                            me.handleSearch();
                        }).always(() => view.setLoading(false));
                    }
                }
            );
        }
    };
});
