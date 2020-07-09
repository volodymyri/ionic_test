Ext.define('criterion.controller.settings.Benefits', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        requires : [
            'criterion.ux.form.CloneForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.Cloning'
        ],

        recordTitleField : 'planTitle',

        alias : 'controller.criterion_settings_benefits',

        load(opts = {}) {
            let view = this.getView(),
                vm = this.getViewModel();

            if (!view || view.destroyed || !vm) {
                return;
            }

            view.getSelectionModel().deselectAll();

            return Ext.promise.Promise.all([
                this.callParent(arguments),
                vm.getStore('webForms').loadWithPromise()
            ]);
        },

        cancelEdit(record) {
            this.load();
        },

        // todo check this
        remove(record) {
            let me = this;

            this.callParent(arguments);
            this.getView().getStore().sync({
                failure : function() {
                    me.load();
                },
                scope : this
            });
        },

        // todo check this
        handleAfterEdit() {
            this.callParent(arguments);
            this.load();
        },

        handleSelectionChange(g, selection) {
            this.getViewModel().set('selectionCount', selection.length);
        },

        handleClone() {
            let picker,
                me = this,
                view = this.getView(),
                selection = view.getSelection(),
                employerId = selection[0].get('employerId'),
                selectedPlans = Ext.Array.map(selection, select => select.get('name')),
                selectionCount = selectedPlans.length;

            picker = Ext.create('criterion.ux.form.CloneForm', {
                title : i18n.gettext('Clone Plans to Employer'),

                viewModel : {
                    data : {
                        employerId : employerId
                    }
                },

                items : [
                    {
                        xtype : 'textarea',
                        readOnly : true,
                        value : selectedPlans.join('\r\n'),
                        fieldLabel : selectionCount + ' ' + i18n.gettext('Plan') + (selectionCount > 1 ? 's' : '')
                    },
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        allowBlank : false,
                        bind : {
                            value : '{employerId}'
                        }
                    }
                ]
            });

            picker.show();
            picker.on({
                cancel : () => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                clone : data => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                    me.clonePlans(data, employerId);
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        clonePlans(data, employerId) {
            let view = this.getView(),
                plans = Ext.Array.map(view.getSelection(), select => ({
                    id : select.getId(),
                    name : select.get('name') + criterion.Consts.CLONE_PREFIX,
                    code : select.get('code') + criterion.Consts.CLONE_PREFIX
                }));

            this.actCloneItems(
                i18n.gettext('Clone benefit plan') + (plans.length > 1 ? 's' : ''),
                criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_CLONE,
                data,
                employerId,
                plans
            );
        },

        getFullCloneUrl(url, data, item) {
            return Ext.String.format(url, item.id, data.employerId);
        },

        getParamsForCloning(data, item) {
            return {
                name : item.name,
                code : item.code
            }
        }
    };
});
