#! /usr/bin/env node

//
// Copyright 2016-present by Pouya Kary <pouya@kary.us>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import * as pageman     from './pageman'
    import * as ui          from './kary/ui'
    import * as text        from './kary/text'
    import * as chokidar    from 'chokidar'
    import * as fs          from 'fs'
    import * as path        from 'path'
    import * as colors      from 'colors'

//
// ─── CONSTS ─────────────────────────────────────────────────────────────────────
//

    const fileFormat =
        '.pageman'
    const commandNoLegendLinking =
        '--no-legend-linking'

//
// ─── COMMAND LINE ARGS ──────────────────────────────────────────────────────────
//

    var legendNoLinking =
        false

//
// ─── CHECK IF ARRAY CONTAINS SOMETHING ──────────────────────────────────────────
//

    function checkIfArrayContains<T> ( array: T[ ], searchable: T ) {
        for ( const element of array )
            if ( element === searchable )
                return true
        return false
    }

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    /** Where we start off */
    function main () {
        // our arguments
        let args = process.argv.slice( 2 )

        // hello world
        ui.printTitle( 'Pageman' )

        // parsing options
        if ( checkIfArrayContains( args, commandNoLegendLinking ) ) {
            args = args.slice( args.indexOf( commandNoLegendLinking ), 1 )
            legendNoLinking = true
        }

        // command switching...
        if ( args.length > 0 )
            if ( args[0] === '-w' )
                watchDirectory( )
            else
                compileListOfFiles( args )
        else
            compileDirectory( )
    }

    main( )

//
// ─── COMPILE DIRECTORY ──────────────────────────────────────────────────────────
//

    /**
     * Compiles every file within the directory and the sub directories....
     */
    function compileDirectory ( ) {
        forEachFileInDirDo( process.cwd(), filePath => {
            loadCompileAndStoreFile( filePath )
        })
    }

//
// ─── CHECK FOR WATCH MODE ───────────────────────────────────────────────────────
//

    /**
     * Watches every file in the directory and the sub directories....
     */
    function watchDirectory () {
        ui.print( 'Pageman Watch Server: Running.' )
        const watcher = chokidar.watch( process.cwd(), {
            ignored: /.*(\.git|node_modules|_site).*/gi
        })
        watcher.on( 'change', compileWatchFile )
        watcher.on( 'add', path => watcher.add( path ) )
    }

//
// ─── COMPILE WATCH FILE ─────────────────────────────────────────────────────────
//

    function compileWatchFile ( address: string ) {
        if ( address.endsWith( fileFormat ) ) {
            ui.print( `Change at ${ new Date( ).toUTCString( ).green }.` )
            loadCompileAndStoreFile( address )
        }
    }

//
// ─── OPERATE ON EVERY FILE ON THE DIR... ────────────────────────────────────────
//

    /**
     * Does a certain task to all the files within a directory and it's sub directories...
     */
    function forEachFileInDirDo ( baseDir: string,
        operation: ( filePath: string ) => any ) {
        fs.readdir( baseDir, ( err, files ) => {
            if ( err ) {
                ui.print( `Could not open directory "${ baseDir.underline }"`, false )
                return
            } else {
                files.forEach( address => {
                    const filePath =
                        path.join( baseDir, address )

                    if ( fs.statSync( filePath ).isDirectory( ) )
                        forEachFileInDirDo( filePath, filePath => {
                            operation( filePath )
                        })
                    else
                        if ( address.endsWith( fileFormat ) )
                            operation( filePath )

                })
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
            if ( address.endsWith( fileFormat ) )
                loadCompileAndStoreFile( address )
            else
                ui.print( `Supplied files must be of type "${fileFormat}".`, false )
        })
    }

//
// ─── LOADING THE FILE ───────────────────────────────────────────────────────────
//

    /**
     * opens a file, compiles it's code and stores the result with the
     * some file name but of type '.html'
     */
    function loadCompileAndStoreFile ( address: string ) {
        // do we have the file?
        fs.exists( address, exists => {
            if ( exists ) {
                // opening the file
                fs.readFile( address, 'utf8', ( err, data ) => {

                    // if could not open the file
                    if ( err ) {
                        ui.print( 'Could not open the file.', false )
                        return
                    }

                    // could open the file
                    let compiledSource = pageman.compile( data.toString(), {
                        legendNoLinking: legendNoLinking
                    })

                    // now saving the file...
                    fs.writeFile( getResultFileAddress( address ),
                        compiledSource, err => {
                            if ( err )
                                ui.print( `Could not save result of "${address.underline}".`, false )
                            else
                                ui.print( `"${text.getFileName( address )}" successfully compiled.` )
                        })

                })
            } else {
                ui.print( `File '${ address }' does not exists.`, false )
            }
        })
    }

//
// ─── GET SAVE FILE ADDRESS ──────────────────────────────────────────────────────
//

    /**
     * Generates the final HTML address based on the 'pm' file address.
     * **yourFile.pm** `-->`** /somewhere/yourFile.html **
     */
    function getResultFileAddress ( address: string ) {
        return `${address.substr( 0, address.length - fileFormat.length )}.html`
    }

// ────────────────────────────────────────────────────────────────────────────────
