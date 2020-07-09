/**
 * @deprecated
 */
Ext.define('criterion.store.position.CompanyReports', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'Ext.data.TreeStore',
        alias: 'store.position_company_reports',

        requires: [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.position.TreeReport',
        autoLoad : false,
        autoSync : false,
        clearOnLoad: true,
        clearRemovedOnLoad: true,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_COMPANY_REPORT,
            appendId: false,
            reader: 'treeData'
        }
    };
});
