Ext.define('criterion.controller.settings.hr.Tasks', function() {

    function getCodeIdFromFieldName(fieldName) {
        return fieldName.indexOf('classificationId') !== -1 ? parseInt(fieldName.substr('classificationId'.length), 10) : null;
    }

    function getCodeFieldName(codeRecord) {
        return 'classificationId' + codeRecord.getId();
    }

    function getCodeDataNames() {
        var names = [], codesStore = this.getStore('codes');

        codesStore.each(function(rec) {
            names.push(criterion.CodeDataManager.getCodeTableNameById(rec.get('codeDataTypeId')));
        });

        return names;
    }

    /**
     * @memberOf web.controller.settings.Tasks
     */
    function makeGridColumnsConfig() {
        var columns = [];

        columns.push(
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Task Code'),
                dataIndex : 'code',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Task Name'),
                dataIndex : 'name',
                flex : 1
            }
        );

        for (var i = 0, I = this.getStore('codes').count(); i < I; i++) {
            var codeRecord = this.getStore('codes').getAt(i);

            columns.push({
                xtype : 'criterion_codedatacolumn',
                text : codeRecord.get('caption'),
                dataIndex : getCodeFieldName(codeRecord),
                codeDataId : criterion.CodeDataManager.getCodeTableNameById(codeRecord.get('codeDataTypeId')),
                flex : 1
            })
        }

        return columns;
    }

    /**
     * @memberOf web.controller.settings.Tasks
     */
    function makeGridStore() {
        var store,
            data = [],
            fields = [],
            codesStore = this.getStore('codes');

        Ext.Object.each(criterion.model.employer.Task.fieldsMap, function(name, field) {
            fields.push({
                name : field.name,
                type : field.type,
                allowNull : field.allowNull
            })
        });

        for (var i = 0; i < codesStore.count(); i++) {
            var codeRecord = codesStore.getAt(i);

            fields.push({
                name : getCodeFieldName(codeRecord),
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : codeRecord.get('codeDataTypeId')
            })
        }

        store = Ext.create('criterion.data.Store', {
            fields : fields,
            type : 'memory'
        });

        for (var i = 0; i < this.getStore('tasks').count(); i++) {
            var taskRecord = this.getStore('tasks').getAt(i),
                item = {};

            Ext.Object.each(taskRecord.getData(), function(name, value) {
                if (!Ext.isArray(value)) {
                    item[name] = value;
                } else { // process values sub-array
                    Ext.Array.each(value, function(classificationValue) {
                        var codeRecordIdx = codesStore.findExact('id', classificationValue['classificationId']);
                        if (codeRecordIdx !== -1) {
                            var codeRecord = codesStore.getAt(codeRecordIdx);
                            item[getCodeFieldName(codeRecord)] = classificationValue['selectedValueId'];
                        } else {
                            console && console.warn('Couldn\'t find corresponding classification code for classification value', classificationValue);
                        }
                    })
                }
            });

            data.push(item);
        }

        store.loadData(data);

        return store;
    }

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_tasks',

        requires : [
            'criterion.view.settings.hr.Task',
            'criterion.model.employer.Task',
            'criterion.model.employer.TaskClassification',
            'criterion.model.employer.Classification'
        ],

        editor : {
            xtype : 'criterion_settings_hr_task',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        },

        handleActivate : function() {
            this.getView().on('edit', this.handleSaveAction, this); // ?? todo refactor
        },

        getEmptyRecord : function() {
            return {
                employerId :  this.getEmployerId(),
                classificationCodeType : criterion.Consts.CLASSIFICATION_TYPES.TASKS
            };
        },

        load : function() {
            var promiseLoadTasks, promiseLoadCodes,
                me = this,
                view = this.getView();


            if (!this.getEmployerId()) {
                return
            }

            view.setLoading(true);

            promiseLoadTasks = this.getStore('tasks').loadWithPromise({
                params : {
                    employerId : this.getEmployerId(),
                    classificationType : criterion.Consts.CLASSIFICATION_TYPES.TASKS
                }
            });

            promiseLoadCodes = this.getStore('codes').loadWithPromise({
                params : {
                    employerId : this.getEmployerId(),
                    classificationType : criterion.Consts.CLASSIFICATION_TYPES.TASKS
                }
            });

            Ext.Deferred.all([promiseLoadCodes, promiseLoadTasks]).then(function() {
                var store = makeGridStore.call(me);

                criterion.CodeDataManager.load(getCodeDataNames.call(me),
                    function() {
                        me.getView().reconfigure(store, makeGridColumnsConfig.call(me));
                    }, me);

            }, null, null, me).always(function() {
                view.setLoading(false);
            });
        },

        remove : function(record) {
            var gridStore = this.getView().getStore(),
                tasksStore = this.getStore('tasks');

            if (!record.phantom) {
                tasksStore.remove(tasksStore.getById(record.getId()));
                tasksStore.sync();
            }

            gridStore.remove(record);
        },

        handleSaveAction : function(record) {
            var tasksStore = this.getStore('tasks'),
                me = this,
                view = this.getView(),
                taskRecord;

            view.setLoading(true, null);

            if (record.phantom) {
                taskRecord = Ext.create('criterion.model.employer.Task', {
                    employerId :  this.getEmployerId()
                });
                tasksStore.add(taskRecord);
            } else {
                taskRecord = tasksStore.getById(record.getId());
            }
            taskRecord.set(record.getChanges());

            tasksStore.syncWithPromise().then(function() {
                var taskClassificationStore = this.getStore('tasks_classifications');

                Ext.Object.each(record.getData(), function(fieldname, fieldvalue) {
                    var classificationId = getCodeIdFromFieldName(fieldname);

                    if (classificationId !== null && fieldvalue !== null) {

                        var valueData = Ext.create('criterion.model.employer.TaskClassification', {
                                taskId : taskRecord.getId(),
                                classificationId : classificationId,
                                selectedValueId : fieldvalue
                            }),
                            existingValueIndex = taskClassificationStore.findExact('classificationId', classificationId);
                        if (existingValueIndex === undefined || existingValueIndex == -1) {
                            valueData.data.id = undefined;
                            taskClassificationStore.add(valueData)
                        } else {
                            taskClassificationStore.getAt(existingValueIndex).set(valueData);
                        }
                    }
                });
                taskClassificationStore.syncWithPromise().then(function() {
                    view.setLoading(false, null);
                    me.load();
                });
            }, null, null, this)

        },

        _onCallbackLoad : function(editor, record) {
            this.callParent(arguments);

            editor.on('save', this.handleSaveAction, this);
        },

        onShow : function() {
            this.load();
        },

        onEmployerChange: function() {
            this.load();
        }
    };
});
