#! /usr/bin/env node

//
// Pageman - HTML, Markdown and Legend mixer that Loves Jekyll...
//    Copyright 2016 by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    // core
    import pageman   = require('./pageman');

    // third party
    import parseArgs = require('minimist');

    // node
    import fs        = require('fs');
    import path      = require('path');

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    /** Where we start off */
    function main( ) { 
        // our arguments
        let args = parseArgs( process.argv.slice( 2 ) );

        // command switching...
        if ( args._.length === 0 ) {
            operateOnEveryFileOnDir( process.cwd( ) );
        } else {
            compileListOfFiles( args._ );
        }
    }

    main( );

//
// ─── OPERATE ON EVERY FILE ON THE DIR... ────────────────────────────────────────
//

    function operateOnEveryFileOnDir( baseDir ) {
        fs.readdir( baseDir , ( err , files ) => {
            if ( err ) {
                console.log(`--> PME005: Could not open directory "${ baseDir }"`);
                return;
            } else {
                files.forEach( address => {
                    let filePath = path.join( baseDir , address );
                    if ( fs.statSync( filePath ).isDirectory( ) ) {
                        operateOnEveryFileOnDir( filePath );
                    } else {
                        if ( address.endsWith( '.pm' ) ) {
                            loadCompileAndStoreFile( filePath );
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
            if ( address.endsWith('.pm') ) {
                loadCompileAndStoreFile( address );
            } else {
                console.log('--> PME004: Supplied files must be of type ".pm".');
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
                    let compiledSource = pageman.compile( data.toString( ) );
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
        return `${ address.substr( 0, address.length - 3 ) }.html`;
    }

// ────────────────────────────────────────────────────────────────────────────────