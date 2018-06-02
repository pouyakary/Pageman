
//
// Copyright 2016-present by Pouya Kary <pouya@kary.us>
//


//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import colors = require('colors')
    import size   = require('window-size')

//
// ─── PRINT ──────────────────────────────────────────────────────────────────────
//

    export function print ( message: string, status: boolean = true ) {
        console.log(` ${ status? colors.green('\u2713'): colors.red('\u2715') } ${ message }\n`)
    }

//
// ─── PRINT TITLE ────────────────────────────────────────────────────────────────
//

    export function printTitle ( title: string ) {
        printHorizontalLine( )

        let spacings = ''
        for ( let index = 0; index < Math.floor( ( size.width - title.length - 2 ) / 2 ); index++ )
            spacings += '•'

        spacings = spacings.rainbow

        console.log( `${ spacings } ${ title } ${ spacings }` )

        printHorizontalLine( )
        console.log('')
    }

//
// ─── PRINTING HORIZONTAL LINE ───────────────────────────────────────────────────
//

    function printHorizontalLine ( ) {
        let line = ''
        for ( let index = 0; index < size.width; index++ )
            line += '\u2500'

        console.log( line.cyan )
    }

// ────────────────────────────────────────────────────────────────────────────────
