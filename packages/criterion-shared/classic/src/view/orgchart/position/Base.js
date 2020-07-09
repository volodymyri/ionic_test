/**
 * @deprecated
 */
Ext.define('criterion.view.orgchart.position.Base', function() {

    var personNameSubTpl = '<div class="personName">' +
        '<p class="h1 blue">{personName} <span class="gotoProfile"></span></p>' +
        '</div>';

    var phoneSubTpl = '<tpl if="phone !== null">' +
        '<p class="nowrap glyphed" title="{phone}"><span class="ion ion-ios7-telephone"></span> <span>{phone}</span></p>' +
        '</tpl>';

    var emailSubTpl = '<p class="nowrap glyphed" title="{email}"><span class="ion ion-ios7-email-outline"></span> <span>{email}</span></p>';

    return {
        alias : 'widget.criterion_orgchart_position_base',
        extend : 'Ext.Component',

        tpl : new Ext.XTemplate(
            '<div class="criterion-org-position-wrap position-{type}">',
            '<div class="menu-holder"></div>',
            '<div class="content">',
            '<div class="col-1">',
            '<tpl if="type === \'unfilled\'">',
            '<span class="label-orange">Unfilled</span>',
            '<tpl else>',
            '<tpl if="personId !== null">',
                '<img src="' + criterion.consts.Api.API.PERSON_LOGO + '/{personId}?' + criterion.Api.getAuthorizationParameters() + '" />',
            '<tpl else>',
                '<img src="' + criterion.consts.Api.API.EMPLOYEE_NO_PHOTO + '" />',
            '</tpl>',
            '</tpl>',
            '</div>',
            '<div class="col-2">',
            '<tpl if="type === \'full\'">',
            personNameSubTpl,
            '<div class="left">',
            '<p><span class="label-blue">{jobCode}</span></p>',
            '<p><span>Effective date </span> {effectiveDate:date("m/d/Y")}</p>',
            '</div>',
            '<div class="right">',
            '<tpl if="supervisorName !== null">',
            '<p><span class="label-blue">Reports to</span> {supervisorName}</p>',
            '</tpl>',
            phoneSubTpl,
            emailSubTpl,
            '</div>',
            '<tpl elseif="type === \'short\'">',
            '<p class="h1 blue">{personName} <span class="gotoProfile"></span></p>',
            '<p><span> {jobCode}</span></p>',
            phoneSubTpl,
            emailSubTpl,
            '<tpl elseif="type === \'unfilled\'">',
            '<p>&nbsp;</p>',
            '<p style="text-align: center"><span> {jobCode}</span></p>',
            '<div class="fill-btn-wrap"></div> ',
            '<tpl elseif="type === \'empty\'">',
            '</tpl>',
            '</div>',
            '</div>',
            '<tpl if="subordinatesCount || openSubordinatePositionCount">',
            '<div class="footer">',
            '<p>managing <span class="label-orange">{[this.getSubordinates(values.subordinatesCount, values.openSubordinatePositionCount)]}</span></p>',
            '</div>',
            '</tpl>',
            '</div>',
            {
                getSubordinates : function(subordinates, openSubordinates) {
                    var html = subordinates ? subordinates : '';

                    if (openSubordinates) {
                        var openText = i18n.gettext('{0} Open');

                        html += Ext.util.Format.format(subordinates ? ' (' + openText + ')' : openText, openSubordinates);
                    }
                    return html;
                }
            }
        ),

        data : {},
        isShortForm : true,

        initComponent : function() {
            var me = this;

            this.callParent(arguments);
        },

        update : function(data, loadScripts, callback) {
            if (Ext.Object.isEmpty(data) || (data.personId === null && data.positionId === null)) {
                data = {
                    photoFilePath : criterion.consts.Api.API.EMPLOYEE_NO_PHOTO,
                    personId : null
                };
                data.type = 'empty';
            } else if (data.personId === null) {
                data.type = 'unfilled';
            } else {
                data.type = this.isShortForm ? 'short' : "full";
            }

            this.callParent(arguments);
        },

        menuRenderer : Ext.emptyFn,

        /**
         * @protected
         */
        getMenuHolderCmp : function() {
            return this.el.down('.menu-holder');
        },

        afterRender : function() {
            var me = this;

            if (!me.parentItemId) {
                throw new Error("Property 'parentItemId' not found");
            }

            this.callParent(arguments);

            if (this.data && this.editable) {
                if (this.data.personId === null) {
                    new Ext.Button({
                        text : i18n.gettext('fill position'),
                        itemId : me.parentItemId + '_fillPositionBtn',
                        renderTo : this.el.down('.fill-btn-wrap'),
                        action : 'fill-position',
                        positionId : this.data.positionId,
                        cls : 'btn-fill'
                    });
                } else {
                    new Ext.Button({
                        itemId : me.parentItemId + '_goProfileBtn',
                        renderTo : this.el.down('.gotoProfile'),
                        glyph : 0xf152,
                        cls : 'criterion-btn-light',
                        action : 'goto-profile',
                        personId : this.data.personId
                    });
                }
            }

            this.menuRenderer();
        }
    }

});
