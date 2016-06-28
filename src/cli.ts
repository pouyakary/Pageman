#! /usr/bin/env node

//
// Pageman - HTML, Markdown and Legend mixer that Loves Jekyll...
//    Copyright 2016 by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import pageman   = require('./pageman');
    import parseArgs = require('minimist');
    import fs        = require('fs');
    import path      = require('path');

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    function main( ) { 
        // our arguments
        let args = parseArgs( process.argv.slice( 2 ) );

        // compiling files
        args._.forEach( arg => {
            loadCompileAndStoreFile( arg );
        });
    }

    main( );

//
// ─── LOADING THE FILE ───────────────────────────────────────────────────────────
//

    function loadCompileAndStoreFile( address: string ) {
        // our file path
        let filePath = path.join( __dirname , address );
        // do we have the file?
        fs.exists( filePath , exists => {
            if ( exists ) {
                // opening the file
                fs.readFile( address, 'utf8', ( err, data ) => {
                    // if could not open the file
                    if ( err ) { 
                        console.log('--> PME002: Could not open the file'); 
                        return; 
                    }
                    // could open the file
                    let compiledSource = pageman.compile( data.toString( ) );
                    // now saving the file...
                    fs.writeFile( getResultFileAddress( address ), compiledSource, err => {
                        if ( err ) {
                            console.log(`--> PME003: Could not save result of "${ address }".`)
                        } else {
                            console.log(`--> Pageman: "${ address }" successfully compiled`);
                        }
                    });
                });
            } else {
                console.log(`--> PME001: File '${ address }' does not exists`);
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
        return `${ process.cwd( ) }/${ address.substr( 0, address.length - 3 ) }.html`;
    }

// ────────────────────────────────────────────────────────────────────────────────