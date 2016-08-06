 
//
// Kary Framework for NodeJS
// Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import colors = require('colors');

//
// ─── PRINT ──────────────────────────────────────────────────────────────────────
//

    export function print ( message: string, status: boolean = true ) {
        console.log(` ${ status? colors.green('\u2713'): colors.red('\u2715') } \u2500 ${ message }\n`);
    }

// ────────────────────────────────────────────────────────────────────────────────
