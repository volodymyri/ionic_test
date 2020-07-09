Ext.define('criterion.controller.person.Goals', function() {

    return {

        alias : 'controller.criterion_person_goals',

        extend : 'criterion.controller.employee.GridView',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        init() {
            this.handleChangeWeight = Ext.Function.createBuffered(this.handleChangeWeight, 1000, this);
            
            this.callParent(arguments);
        },

        load(opts) {
            let reviewScaleDetails = this.getViewModel().getStore('reviewScaleDetails'),
                me = this,
                dfd = Ext.create('Ext.Deferred');

            if (reviewScaleDetails.isLoaded() || reviewScaleDetails.isLoading()) {
                this.callParent(arguments).then(_ => {
                    dfd.resolve();
                    me.afterMainStoreLoaded();
                });
            } else {
                reviewScaleDetails.loadWithPromise().then(_ => {
                    me.load(opts);
                });
            }

            return dfd.promise;
        },

        afterMainStoreLoaded() {},

        handleAfterEdit() {
            this.callParent(arguments);
            this.load();
        },

        scaleRenderer(value, metaData, record, rowIndex, colIndex, store) {
            let reviewScaleDetails = this.getViewModel().getStore('reviewScaleDetails'),
                scale = value && reviewScaleDetails.getById(value);

            return scale && scale.get('name');
        },

        handleChangeWeight() {
            let store = this.getView().getStore(),
                weights = {},
                values;

            store.each(function(rec) {
                let weightInPercent = rec.get('weightInPercent'),
                    reviewId = rec.get('reviewId');

                rec.set('weight', weightInPercent / 100);

                if (!weights[reviewId]) {
                    weights[reviewId] = 0;
                }

                weights[reviewId] += rec.get('weightInPercent');
            });

            values = Ext.Object.getValues(weights);

            if (Ext.Array.sum(values) === (100 * values.length)) {
                store.syncWithPromise().then(function() {
                    criterion.Utils.toast(i18n.gettext('Weight changes saved.'));
                });
            }
        }

    };

});
