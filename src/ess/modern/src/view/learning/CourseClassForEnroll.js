Ext.define('ess.view.learning.CourseClassForEnroll', function() {

    return {
        alias : 'widget.ess_modern_learning_course_class_for_enroll',

        extend : 'Ext.form.Panel',

        viewModel : {},

        cls : 'ess-modern-learning-course',

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Class Details'),
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-arrow-back',
                        handler : function() {
                            this.up('ess_modern_learning_course_class_for_enroll').fireEvent('goBack');
                        }
                    }
                ]
            },
            {
                xtype : 'component',
                bind : {
                    html : '<span class="titleEl">Class Name:</span> {record.name}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Description:</span> {record.description}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Location:</span> {record.location}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Due Date:</span> {record.dueDate:date("m/d/Y")}'
                }
            },
            {
                xtype : 'container',
                layout : 'hbox',

                margin : '20 20 10 20',
                docked : 'bottom',
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Assign'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{record.openSpots == 0}'
                        },
                        handler : function() {
                            var main = this.up('ess_modern_learning_course_class_for_enroll'),
                                vm = main.getViewModel();

                            main.fireEvent('enrollClass', vm.get('record.id'));
                        }
                    }
                ]
            }
        ]

    };

});
