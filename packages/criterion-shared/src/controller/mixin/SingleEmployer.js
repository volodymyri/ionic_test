/**
 * Handles employers' store is loaded and checks if only one employers is available
 */
Ext.define('criterion.controller.mixin.SingleEmployer', function() {

    var MIXIN_ID = 'singleEmployer';

    function handleEmployersLoaded(employers, employees) {
        var vm = this.getViewModel(),
            isSingleEmployer = employers.count() < 2;

        if (vm) {
            vm.set('isSingleEmployer', isSingleEmployer);

            if (isSingleEmployer && Ext.isFunction(this.handleIsSingleEmployer)) {
                this.handleIsSingleEmployer();
            }
        }
    }

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {
            id : MIXIN_ID,

            after : {
                constructor : 'initMixin'
            }
        },

        initMixin : function() {
            var listenTo = {};

            listenTo.global = {
                baseStoresLoaded : handleEmployersLoaded
            };

            this.listen(listenTo);
        }

    }

});
