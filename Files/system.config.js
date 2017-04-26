// map tells the System loader where to look for things
var map = {
  'background':                         '.tmp/js',
  'shelf':                              '.tmp/js',
  'rxjs':                               'lib/js/rxjs',
  '@angular':                           'lib/js/@angular',
  'zone.js':                            'lib/js/zone.js/dist',
  'angular-2-local-storage':            'lib/js/angular-2-local-storage',
  'ng2-sharebuttons':                   'lib/js/ng2-sharebuttons',
};

// packages tells the System loader how to load when no filename and/or no extension
var packages = {
  'background':                         { main: 'modules/background/main', defaultExtension: 'js' },
  'shelf':                              { main: 'modules/shelf/main', defaultExtension: 'js' },
  'rxjs':                               { defaultExtension: 'js' },
  'zone.js':                            { main: 'zone', defaultExtension: 'js' },
  'angular-2-local-storage':            { main: 'dist/index.js', defaultExtension: 'js' },
  'ng2-sharebuttons':                   { main: 'index.js', defaultExtension: 'js' },
};

var packageNames = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/http',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
  '@angular/testing',
  '@angular/upgrade',
];

// add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
packageNames.forEach(function(pkgName) {
  packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});

System.config({
  map: map,
  packages: packages
});
