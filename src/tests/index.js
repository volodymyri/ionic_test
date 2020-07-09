var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
    title : 'Criterion Test Suite',

    testClass : criterion.TestSuite,

    defaultTimeout : 20000
});

var ess, web, modern;

function getOpts(response) {
    var overrides = [];

    for (var className in response.classes) {
        if (response.classes.hasOwnProperty(className) && className.indexOf('criterion') != -1 && className.indexOf('override') != -1) {
            overrides.push(className);
        }
    }

    console.log(`Found ${Object.keys(response.paths).length} paths and ${overrides.length} overrides`);

    return {
        paths : response.paths,
        overrides : overrides
    }
}

Promise.all([
    '/src/web/default.json',
    '/src/ess/bootstrap/classic.json',
    '/src/ess/bootstrap/modern.json'
].map(url => fetch(url).then(r => r.json()))).then(jsons => {

    web = getOpts(jsons[0]);
    ess = getOpts(jsons[1]);
    modern = getOpts(jsons[2]);

    var bootstrap = {
        classic : [
            'criterion.SecurityManager',
            'criterion.Application',
            'criterion.consts.Api',
            'criterion.consts.Dict',
            'criterion.consts.Glyph',
            'criterion.consts.Route',
            'criterion.data.validator.Range', // fixme - should be required by application/model
            'criterion.data.validator.Relation', // fixme should be required by application/model
            'criterion.Consts',
            'criterion.Utils',
            'criterion.CodeDataManager',
            'criterion.ux.window.MessageBox'
        ],
        modern : [
            'criterion.SecurityManager',
            'criterion.consts.Route',
            'criterion.consts.Api',
            'criterion.consts.Dict',
            'criterion.consts.Glyph',
            'criterion.Consts',
            'criterion.Utils',
            'criterion.CodeDataManager'
        ]
    };

    Harness.start(
        {
            group : 'Web - Unit',
            hostPageUrl : '../web/test-env.html?siestaUnit',
            loaderPath : web.paths,
            items : [
                {
                    url : '../web/tests/unit/gridview.t.js',
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.view.GridView',
                        'criterion.view.FormView'
                    ])
                },
                {
                    url : '../web/tests/unit/currencyfield.t.js',
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.LocalizationManager'
                    ])
                },
                {
                    url : '../web/tests/unit/codedetailfield.t.js',
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.ux.form.field.CodeDetail'
                    ])
                },
                {
                    url : '../web/tests/unit/tagfield.t.js',
                    requires : bootstrap.classic.concat(web.overrides)
                },
                {
                    url : '../web/tests/unit/datetime.t.js',
                    requires : bootstrap.classic.concat(web.overrides)
                },
                {
                    url : '../web/tests/unit/cardrouter.t.js',
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.app.ViewController',
                        'criterion.controller.mixin.CardRouter',
                        'criterion.ux.tab.Panel'
                    ])
                },
                {
                    url : '../web/tests/unit/tabpanel.t.js',
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.ux.tab.Panel'
                    ])
                },
                {
                    url : '../web/tests/unit/inputmask.t.js',
                    requires : bootstrap.classic.concat(web.overrides)
                },
                {
                    url : '../web/tests/unit/toggleslide.t.js',
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.ux.form.field.ToggleSlide'
                    ])
                },
                {
                    url : '../web/tests/unit/field.security.t.js',
                    requires : bootstrap.classic.concat(web.overrides)
                },
                {
                    url : '../web/tests/unit/data.layer.t.js',
                    requires : [].concat(web.overrides).concat([
                        'criterion.consts.Api',
                        'criterion.consts.Dict',
                        'criterion.consts.Glyph',
                        'criterion.consts.Route',
                        'criterion.Consts',
                        'criterion.Utils',
                        'criterion.CodeDataManager',
                        'criterion.data.Model',
                        'criterion.data.Store'
                    ])
                },
                {
                    url : '../web/tests/unit/multi.record.picker.remote.alt.t.js',
                    requires : bootstrap.classic.concat(web.overrides)
                }
            ]
        },
        /* not support for now
        {
            group : 'Web - Integration',
            hostPageUrl : '../web/test-env.html?siestaUnit',
            loaderPath : web.paths,
            items : [
                {
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.ux.form.field.CodeDetail',
                        'criterion.view.employee.Wizard'
                    ]),
                    url : '../web/tests/integration/employee/employee.wizard.t.js'
                },
                {
                    requires : bootstrap.classic.concat(web.overrides).concat([
                        'criterion.ux.form.field.CodeDetail',
                        'criterion.view.CustomFieldsContainer',
                        'criterion.view.employee.Position'
                    ]),
                    url : '../web/tests/integration/assignment.t.js'
                }
            ]
        },
        */
        {
            group : 'ESS Classic - Unit',
            hostPageUrl : '../ess/classic-test-env.html?siestaUnit',
            loaderPath : ess.paths,
            items : [

                /* here just blanks
                {
                    requires : bootstrap.classic.concat(ess.overrides),
                    url : '../ess/tests/classic/unit/criterion_time_field.t.js'
                },
                {
                    requires : bootstrap.classic.concat(ess.overrides).concat([
                        'criterion.store.employee.attendance.Dashboard',
                        'criterion.view.ess.time.attendanceDashboard.PeriodWidget'
                    ]),
                    url : '../ess/tests/classic/unit/time/attendance_dashboard_period_widget.t.js'
                }
                */
            ]
        },
        /* not support for now
        {
            group : 'ESS Classic - Integration',
            hostPageUrl : '../ess/classic-test-env.html?siestaUnit',
            loaderPath : ess.paths,
            items : [
                {
                    requires : [].concat(bootstrap.classic, ess.overrides, [
                        'criterion.view.employee.timesheet.Vertical'
                    ]),
                    url : '../ess/tests/classic/integration/timesheet/timesheet.vertical.js'
                },
                {
                    requires : [].concat(bootstrap.classic, ess.overrides, [
                        'criterion.view.employee.timesheet.Horizontal',
                        'criterion.data.field.TimeZone'
                    ]),
                    url : '../ess/tests/classic/integration/timesheet/timesheet.horizontal.button.js'
                },
                {
                    requires : bootstrap.classic.concat(ess.overrides).concat([
                        'criterion.view.ess.time.AttendanceDashboard',
                        'criterion.ux.form.field.Tag',
                        'criterion.ux.form.field.ToggleSlide'
                    ]),
                    url : '../ess/tests/classic/integration/time/attendance_dashboard.t.js'
                },
                {
                    requires : [].concat(bootstrap.classic, ess.overrides, [
                        'ess.Application',
                        'criterion.data.field.TimeZone',
                        'criterion.data.field.DateTimeZone',
                        'criterion.view.employee.timesheet.dashboard.TeamPunch',
                        'criterion.ux.plugin.Sidebar',
                        'criterion.ux.grid.Panel'
                    ]),
                    url : '../ess/tests/classic/integration/timesheet/dashboard/team_punch.t.js'
                }
            ]
        },
        */
        {
            group : 'ESS Modern - Unit',
            hostPageUrl : '../ess/modern-test-env.html?siestaUnit&modern',
            loaderPath : modern.paths,
            items : [
                {
                    requires : [].concat(bootstrap.modern, modern.overrides, [
                        'criterion.data.field.TimeZone',
                        'criterion.ux.field.Time',
                    ]),
                    url : '../ess/tests/modern/unit/criterion_timefield.t.js'
                }
            ]
        }
    );
});

