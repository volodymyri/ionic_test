Ext.define('criterion.controller.settings.hr.Project', function() {

    return {
        alias : 'controller.criterion_settings_project',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.store.employer.Tasks',
            'criterion.view.MultiRecordPickerRemote'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init() {
            // delay for setup vm (blinking error)
            this.handleAfterRecordLoad = Ext.Function.createDelayed(this.handleAfterRecordLoad, 100, this);

            this.callParent(arguments);
        },

        handleAfterRecordLoad(record) {
            let vm = this.getViewModel(),
                employerId = record.get('employerId'),
                employer = Ext.StoreManager.lookup('Employers').getById(employerId),
                employerWorkLocations = vm.get('employerWorkLocations');

            vm.set('blockedState', true);

            employer && employer.employerWorkLocations().cloneToStore(employerWorkLocations);

            Ext.promise.Promise.all([
            vm.get('certifiedRates').loadWithPromise({
                params : {
                    employerId
                }
                })
            ]).always(_ => {
                vm.set('blockedState', false);
            });
        },

        updateRecord(record, handler) {
            let projectId = record.getId(),
                aCertifiedRate = Ext.Array.map(this.lookup('certifiedRateField').getValue(), v => parseInt(v, 10)),
                certifiedRates = record.certifiedRate();

            if (Ext.isEmpty(aCertifiedRate)) {
                // clean up
                certifiedRates.removeAll();
            } else {
                certifiedRates.each(rec => {
                    if (!Ext.Array.contains(aCertifiedRate, rec.get('certifiedRateId'))) {
                        // removed
                        certifiedRates.remove(rec);
                    }
                });

                Ext.Array.each(aCertifiedRate, v => {
                    let certifiedRateId = parseInt(v, 10);

                    if (certifiedRates.findBy(rec => rec.get('certifiedRateId') === certifiedRateId) === -1) {
                        // new value
                        certifiedRates.add({
                            projectId,
                            certifiedRateId
                        });
                    }
                });
            }

            this.callParent(arguments);
        },

        handleAddTask() {
            let me = this,
                vm = this.getViewModel(),
                record = vm.get('record'),
                store = record.tasks(),
                selectTask;

            selectTask = Ext.create('criterion.view.MultiRecordPickerRemote', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Tasks'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Code'),
                                dataIndex : 'code',
                                flex : 1
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 2
                            }
                        ],
                        storeParams : {
                            employerId : record.get('employerId'),
                            isActive : true
                        },
                        excludedIds : Ext.Array.map(store.getRange(), item => item.get('taskId'))
                    },
                    stores : {
                        inputStore : Ext.create('criterion.store.employer.Tasks', {
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        })
                    }
                }
            });

            selectTask.show();
            selectTask.on('selectRecords', me.selectTasks, me);

            me.setCorrectMaskZIndex(true);
        },

        selectTasks(selectedRecords) {
            let me = this,
                projectId = this.getViewModel().get('record.id');

            this.setCorrectMaskZIndex(false);

            Ext.Array.each(selectedRecords, record => {
                me.addTaskRecord({
                    projectId,
                    taskId : record.getId(),
                    name : record.get('name'),
                    code : record.get('code'),
                    description : record.get('description')
                }).$relatedPhantom = true;
            });
        },

        addTaskRecord(data) {
            return this.getViewModel().get('record.tasks').add(data)[0];
        }

    }

});
