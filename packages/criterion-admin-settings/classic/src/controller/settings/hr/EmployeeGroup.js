Ext.define('criterion.controller.settings.hr.EmployeeGroup', function() {

    return {
        alias : 'controller.criterion_settings_employee_group',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.store.employeeGroup.member.Search'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAddEmployee : function() {
            var selectEmployees;

            selectEmployees = Ext.create('criterion.view.MultiRecordPickerRemote', {
                allowGridFilter : true,
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Employees'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string',
                                defaultSearch : true
                            }
                        ],
                        storeParams : {
                            employerId : criterion.Api.getEmployerId(),
                            isActive : true
                        },
                        excludedIds : Ext.Array.map(this.lookupReference('gridEmployees').getStore().getRange(), function(item) {
                            return item.get('employeeId');
                        })
                    },
                    stores : {
                        inputStore : {
                            type : 'criterion_employee_group_member_search',
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        }
                    }
                }
            });

            selectEmployees.show();
            selectEmployees.on('selectRecords', this.selectEmployees, this);
            this.setCorrectMaskZIndex(true);
        },

        selectEmployees : function(searchRecords) {
            var store = this.lookupReference('gridEmployees').getStore();

            this.setCorrectMaskZIndex(false);

            Ext.Array.each(searchRecords, function(record) {
                var personId = record.get('personId'),
                    person = Ext.create('criterion.model.Person', {
                        personId : personId
                    });

                person.loadWithPromise().then(function() {
                    store.add({
                        // employeeGroupId will be filled in the saving process
                        employeeId : record.getId(),
                        personId : personId,
                        person : person.getData()
                    });
                });
            });
        },

        onAfterSave : function(view, record) {
            view.fireEvent('afterSave', view, record, this.lookupReference('gridEmployees').getStore());
        },

        reloadEmployeeGroupMembers : function() {
            let vm = this.getViewModel(),
                record = this.getRecord();

            vm.set('disableAdd', true);

            this.lookup('gridEmployees').getStore().loadWithPromise({
                params : {
                    employeeGroupId : record.getId()
                }
            }).then(function() {
                vm.set('disableAdd', false);
            });
        },

        handleAfterRecordLoad : function(record) {
            this.callParent(arguments);

            if (!record.phantom) {
                this.reloadEmployeeGroupMembers();
            }
        },

        onChangeIsDynamic : function() {
            let record = this.getRecord();

            if (!record.phantom) {
                this.reloadEmployeeGroupMembers();
            }
        },

        handleSubmitClick : function() {
            var me = this,
                form = me.getView(),
                record = this.getRecord(),
                formula = record.get('formula');

            this.isNewRecord = record.phantom;

            if (form.isValid()) {
                if (record.get('isDynamic')) {
                    if (formula) {
                        form.setLoading(true);
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.EMPLOYEE_GROUP_VALIDATE_FORMULA,
                            params : {
                                formula : formula
                            },
                            method : 'GET'
                        }).then(function(valid) {
                            if (valid) {
                                me.updateRecord(record, me.handleRecordUpdate);
                            } else {
                                form.setLoading(false);
                                me.lookup('formulaField').markInvalid(i18n.gettext('Formula is invalid'));
                            }
                        }).otherwise(function() {
                            form.setLoading(false);
                        });
                    } else {
                        me.lookup('formulaField').markInvalid(i18n.gettext('Please fill selection criteria in a formula'));
                    }
                } else {
                    me.updateRecord(record, me.handleRecordUpdate);
                }
            } else {
                me.focusInvalidField();
            }
        },

        handleRecalculate : function() {
            var me = this,
                record = me.getRecord();
            // TODO: Add BE recalculate service instead of use PUT for saving and recalculating if no changes
            record.dirty = true;
            record.modified = {
                formula : record.get('formula')
            };
            me.updateRecord(record, me.handleRecordUpdate);
        }
    };

});
