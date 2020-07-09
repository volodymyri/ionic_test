Ext.define('criterion.controller.settings.performanceReviews.GroupsWeight', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_groups_weight',

        extend : 'criterion.app.ViewController',

        init : function() {
            this.handleChangeCompetencyWeight = Ext.Function.createBuffered(this.handleChangeCompetencyWeight, 100, this);
            this.callParent(arguments);
        },

        onShow : function() {
            var cancelBtn = this.lookup('cancelBtn');

            Ext.defer(function() {
                cancelBtn.focus();
            }, 100);

        },

        handleChangeCompetencyWeight : function() {
            var vm = this.getViewModel(),
                total = 0;

            if (!vm) {
                return;
            }

            vm.get('record.weights').each(function(cWeight) {
                total += cWeight.get('weightInPercent');
            });

            vm.set('totalCompetencyWeights', total);
        },

        onCancelHandler : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            vm.get('record.weights').each(function(cWeight) {
                var sequence = cWeight.get('sequence');

                cWeight.reject();
                cWeight.set('weightInPercent', cWeight.get('weight') * 100);
                cWeight.set('sequence', sequence); // we shouldn't change sequence
            });

            view.fireEvent('cancel');
            view.destroy();
        },

        onSaveButtonHandler : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            vm.get('record.weights').each(function(wRec) {
                wRec.set('weight', wRec.get('weightInPercent') / 100)
            });

            view.fireEvent('save');
            view.destroy();
        }
    };

});
