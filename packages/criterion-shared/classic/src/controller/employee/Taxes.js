Ext.define('criterion.controller.employee.Taxes', function() {

    return {
        alias : 'controller.criterion_employee_taxes',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.store.vertex.FilingStatuses',
            'criterion.view.TaxPicker',
            'criterion.model.employee.Tax'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        suppressIdentity : ['employeeGlobal'],

        isWorkflow : false,

        load : function() {
            var employeeId = this.getEmployeeId();

            if (employeeId) {
                this.getView().store.load({
                    params : {
                        employeeId : employeeId,
                        showApproved : true
                    }
                });
            }
        },

        handleAdd : function() {
            var me = this,
                picker = this.createPicker();

            picker.on('selectRecords', this.addTaxes, this);
            picker.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();

            me.setCorrectMaskZIndex(true);
        },

        /**
         * @protected
         */
        createPicker : function() {
            return Ext.create('criterion.view.TaxPicker', {
                viewModel : {
                    data : {
                        excludedIds : Ext.Array.map(this.getView().getStore().getRange(), function(item) {
                            return item.get('teFilingStatusId');
                        }),
                        employeeId : this.getEmployeeId()
                    }
                }
            })
        },

        /**
         * @protected
         * @param records
         */
        addTaxes : function(records) {
            var me = this,
                editor = this.getEditor(),
                employeeId = this.getEmployeeId(),
                hireDate = this.identity.employee.get('hireDate'),
                newRecords = [];

            Ext.Array.each(records, function(record) {
                newRecords.push(me.addRecord(Ext.create('criterion.model.employee.Tax', {
                    employeeId : employeeId,
                    taxNumber : record.get('taxNumber'),
                    geocode : record.get('geocode'),
                    schdist : record.get('schdist'),
                    effectiveDate : hireDate,
                    taxName : record.get('description')
                })));
            });

            editor = Ext.apply(editor, {
                viewModel : {
                    data : {
                        currentRecordIndex : 0,
                        records : newRecords
                    }
                }
            });

            this.startEdit(newRecords[0], editor, records);

            //this.updateGridToken(this.getNewEntityToken()); <-- doesn't work
        },

        startEdit : function(record, editor, records, taxes) {
            if (records && records.length > 1) {
                this.callParent(arguments)
            } else {
                if (editor.getViewModel) {
                    editor.getViewModel().set({
                        currentRecordIndex : 0,
                        records : [record],
                        taxes : taxes
                    })
                } else {
                    editor = Ext.Object.merge(editor, {
                        viewModel : {
                            data : {
                                currentRecordIndex : 0,
                                records : [record],
                                taxes : taxes
                            }
                        }
                    });
                }

                this.callParent(arguments)
            }
        }

    };

});
