Ext.define('ess.controller.scheduling.Base', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.ess_modern_scheduling_base',

        onEdit(record) {
            let view = this.getView(),
                vm = this.getViewModel(),
                parent = view.up(view.mainXtype),
                form = parent.down(view.formXtype);

            form.getViewModel().set('record', record);
            parent.getLayout().setAnimation({
                    type : 'fade',
                    direction : 'left'
                }
            );

            parent.setActiveItem(form);
            vm.set('activeViewIdx', 1);
            parent.fireEvent('actEdit');
        },

        onEditFinish() {
            let view = this.getView(),
                vm = this.getViewModel(),
                parent = view.up(view.mainXtype);

            parent.getLayout().setAnimation({
                    type : 'fade',
                    direction : 'right'
                }
            );

            parent.fireEvent('actFinishEdit');
            parent.setActiveItem(parent.down('[isWrapper]'));
            vm.set('activeViewIdx', 0);
            parent.getViewModel().set('modificationMode', false);
        },

        resetCardState() {
            let view = this.getView(),
                vm = this.getViewModel(),
                parent = view.up(view.mainXtype);

            parent && parent.setActiveItem(parent.down('[isWrapper]'));
            vm.set('activeViewIdx', 0);
        }
    };
});
