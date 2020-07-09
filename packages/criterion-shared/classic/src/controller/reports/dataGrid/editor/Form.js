Ext.define('criterion.controller.reports.dataGrid.editor.Form', function() {

    const FORM_MAX_FIELDS_AMOUNT = criterion.Consts.DATA_GRID_LIMITS.FORM_MAX_FIELDS_AMOUNT;

    return {

        extend : 'criterion.controller.reports.dataGrid.editor.Base',

        alias : 'controller.criterion_reports_data_grid_editor_form',

        requires : [
            'criterion.model.dataForm.Field',
            'criterion.model.webForm.Field'
        ],

        init() {
            let vm = this.getViewModel();

            this.prepareFormColumns = Ext.Function.createDelayed(this.prepareFormColumns, 1000, this);

            this.callParent(arguments);

            vm.bind({
                bindTo : '{formId}'
            }, this.prepareFormColumns, this);
        },

        handleColumnBeforeSelection() {
            let vm = this.getViewModel(),
                formsFields = vm.get('formsFields');

            // MYSQL can't handle more
            if (formsFields.getRange().length >= FORM_MAX_FIELDS_AMOUNT) {
                criterion.Msg.warning({
                    title : i18n.gettext('Maximum number of fields reached!'),
                    message : Ext.util.Format.format(i18n.gettext('The maximum number of fields available for selection is {0}'), FORM_MAX_FIELDS_AMOUNT)
                });

                return false;
            }
        },

        prepareFormColumns(formId) {
            let vm = this.getViewModel();

            vm.set('availables', null);

            if (!formId || !vm) {
                return;
            }

            let isDataform = !!vm.get('dataform'),
                formPrefix = isDataform ? 'dataform' : 'webform',
                fieldIdName = 'columnId',
                formsFields = vm.get('formsFields'),
                model = isDataform ? 'criterion.model.dataForm.Field' : 'criterion.model.webForm.Field',
                inputStore = Ext.create('Ext.data.Store', {
                    model : model,
                    filters : [
                        {
                            property : 'isMeaningfulInputField',
                            value : true,
                            exactMatch : true
                        }
                    ],
                    sorters : [{
                        property : 'label',
                        direction : 'ASC'
                    }]
                }),
                removeAbsent = [],
                filteredStore = Ext.create('Ext.data.Store', {
                    model : model
                });

            if (formId) {
                vm.get(formPrefix + '.formFields').cloneToStore(inputStore);
                inputStore.cloneToStore(filteredStore);
            }

            vm.set('availables', filteredStore);

            formsFields.each(item => {
                let id = item.get(fieldIdName),
                    column;

                column = filteredStore.getById(id);

                if (!column) {
                    removeAbsent.push(item);
                } else {
                    item.set('type', column.get('dataGridFieldType'));
                }
            });

            if (removeAbsent.length) {
                formsFields.remove(removeAbsent);
            }

            this.setSelectionFromUsed();
        },

        setSelectionFromUsed() {
            let vm = this.getViewModel(),
                fieldIdName = 'columnId',
                selectedIds,
                selected;

            selectedIds = Ext.Array.map(vm.get('formsFields').getRange(), item => item.get(fieldIdName));

            selected = Ext.Array.clean(Ext.Array.map(vm.get('availables').getRange(), item => (Ext.Array.contains(selectedIds, item.getId()) ? item : null)));

            this.lookup('availablesGrid').getSelectionModel().select(selected, false, true);
        },

        syncSelections(records) {
            let vm = this.getViewModel(),
                fieldIdName = 'columnId',
                recs = records || this.lookup('availablesGrid').getSelection(),
                formsFields = vm.get('formsFields'),
                selectedIds,
                existedIds,
                forAdd = [],
                forDelete = [];

            // delete
            selectedIds = Ext.Array.map(recs, item => item.getId());

            Ext.Array.each(formsFields.getRange(), item => {
                let id = item.get(fieldIdName);

                if (!Ext.Array.contains(selectedIds, id)) {
                    forDelete.push(item);
                }
            });

            forDelete.length && formsFields.remove(forDelete);

            // adding
            existedIds = Ext.Array.map(formsFields.getRange(), item => item.get(fieldIdName));

            Ext.Array.each(recs, item => {
                let id = item.getId(),
                    data;

                if (!Ext.Array.contains(existedIds, id)) {
                    data = {
                        label : item.get('label'),
                        type : item.get('dataGridFieldType')
                    };

                    data[fieldIdName] = id;

                    forAdd.push(data);
                }
            });

            forAdd.length && formsFields.add(forAdd);
        }
    }

});
