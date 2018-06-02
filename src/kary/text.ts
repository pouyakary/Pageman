
//
// Copyright 2016-present by Pouya Kary <pouya@kary.us>
//


//
// ─── GET FILE NAME ──────────────────────────────────────────────────────────────
//

    export function getFileName ( address: string ) {
        return address.replace( /^.*\//g, '' )
    }

//
// ─── GET FOLDER NAME ────────────────────────────────────────────────────────────
//

    export function getFolderName ( address: string ) {
        return address.replace( /\/(?:[^(\/)\\]|\\.)*$/, '' )
    }

// ────────────────────────────────────────────────────────────────────────────────