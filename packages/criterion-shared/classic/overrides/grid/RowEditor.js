Ext.define('criterion.overrides.grid.RowEditor', {

    override : 'Ext.grid.RowEditor',

    viewModel : true // it's need for to connect related fields see packages/criterion-shared/classic/src/view/common/geocode/ValidationBase.js:174

});
