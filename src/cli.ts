#! /usr/bin/env node

//
// Pageman - HTML, Markdown and Legend mixer that Loves Jekyll...
//    Copyright 2016 by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import pageman    = require('./pageman');
    import chokidar   = require('chokidar');
    import fs         = require('fs');
    import path       = require('path');

//
// ─── CONSTS ─────────────────────────────────────────────────────────────────────
//

    const fileFormat = '.kfml';

//
// ─── COMMAND LINE ARGS ──────────────────────────────────────────────────────────
//

    var legendNoLinking = false;

//
// ─── BASE LANGUAGE EXTENSIONS ───────────────────────────────────────────────────
//

    Array.prototype['contains'] = function( obj ) {
        var index = this.length;
        while ( index-- ) {
            if ( this[ index ] === obj ) {
                return true;
            }
        }
        return false;
    }

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    /** Where we start off */
    function main( ) { 
        // our arguments
        let args = process.argv.slice( 2 );

        // parsing options
        if ( args['contains']( '--legend-no-linking' ) ) {
            args = args.slice( args.indexOf( '--legend-no-linking' ) , 1 );
            legendNoLinking = true;
        }

        console.log( args );

        // command switching...
        if ( args.length > 0 ) {
            if ( args[ 0 ] === '-w' ) {
                watchDirectory( );
            } else {
                compileListOfFiles( args );
            }
        } else {
            compileDirectory( );
        }
    }

    main( );

//
// ─── COMPILE DIRECTORY ──────────────────────────────────────────────────────────
//

    /**
     * Compiles every file within the directory and the sub directories....
     */
    function compileDirectory ( ) {
        forEachFileInDirDo( process.cwd( ) , filepath => {
            loadCompileAndStoreFile( filepath );
        });
    }

//
// ─── CHECK FOR WATCH MODE ───────────────────────────────────────────────────────
//

    /**
     * Watches every file in the directory and the sub directories....
     */
    function watchDirectory ( ) {
        console.log('Pageman Watch Server: Running.');
        let watcher = chokidar.watch( process.cwd( ) , {
            ignored: /.*(\.git|node_modules|_site).*/gi
        });
        watcher.on( 'change', compileWatchFile );
        watcher.on( 'add', path => watcher.add( path ) );
    }

//
// ─── COMPILE WATCH FILE ─────────────────────────────────────────────────────────
//

    function compileWatchFile( address: string ) {
        if ( address.endsWith( fileFormat ) ) {
            console.log(`Change at ${ new Date( ).toUTCString( ) }.`);
            loadCompileAndStoreFile( address );
        }
    }

//
// ─── OPERATE ON EVERY FILE ON THE DIR... ────────────────────────────────────────
//

    /** 
     * Does a certain task to all the files within a directory and it's sub directories...
     */
    function forEachFileInDirDo( baseDir: string, operation: ( filepath: string ) => any ) {
        fs.readdir( baseDir , ( err , files ) => {
            if ( err ) {
                console.log(`--> PME005: Could not open directory "${ baseDir }"`);
                return;
            } else {
                files.forEach( address => {
                    let filePath = path.join( baseDir , address );
                    if ( fs.statSync( filePath ).isDirectory( ) ) {
                        forEachFileInDirDo( filePath , filePath => {
                            operation( filePath );
                        });
                    } else {
                        if ( address.endsWith( fileFormat ) ) {
                            operation( filePath );
                        }
                    }
                });
            }
        })
    }

//
// ─── COMPILE LIST OF FILES ──────────────────────────────────────────────────────
//

    /**
     * Compiles and saves a list of files.
     */
    function compileListOfFiles ( addresses: string[ ] ) {
        addresses.forEach( address => {
            if ( address.endsWith( fileFormat ) ) {
                loadCompileAndStoreFile( address );
            } else {
                console.log(`--> PME004: Supplied files must be of type "${ fileFormat }".`);
            }
        });
    }

//
// ─── LOADING THE FILE ───────────────────────────────────────────────────────────
//

    /**
     * opens a file, compiles it's code and stores the result with the
     * some file name but of type '.html'
     */
    function loadCompileAndStoreFile( address: string ) {
        // do we have the file?
        fs.exists( address , exists => {
            if ( exists ) {
                // opening the file
                fs.readFile( address, 'utf8', ( err, data ) => {
                    // if could not open the file
                    if ( err ) {
                        console.log('--> PME002: Could not open the file.');
                        return;
                    }
                    // could open the file
                    let compiledSource = pageman.compile( data.toString( ) , {
                        legendNoLinking: legendNoLinking
                    });
                    // now saving the file...
                    fs.writeFile( getResultFileAddress( address ), compiledSource, err => {
                        if ( err ) {
                            console.log(`--> PME003: Could not save result of "${ address }".`)
                        } else {
                            console.log(`--> Pageman: "${ address }" successfully compiled.`);
                        }
                    });
                });
            } else {
                console.log(`--> PME001: File '${ address }' does not exists.`);
            }
        });
    }

//
// ─── GET SAVE FILE ADDRESS ──────────────────────────────────────────────────────
//

    /**
     * Generates the final HTML address based on the 'pm' file address.
     * **yourFile.pm** `-->`** /somewhere/yourFile.html **
     */
    function getResultFileAddress( address: string ) {
        return `${ address.substr( 0, address.length - fileFormat.length ) }.html`;
    }

// ────────────────────────────────────────────────────────────────────────────────