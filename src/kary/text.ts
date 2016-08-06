 
//
// Kary Framework for NodeJS
// Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

//
// ─── GET FILE NAME ──────────────────────────────────────────────────────────────
//

    export function getFileName ( address: string ) {
        return address.replace( /^.*\//g, '' );
    }

//
// ─── GET FOLDER NAME ────────────────────────────────────────────────────────────
//

    export function getFolderName ( address: string ) {
        return address.replace( /\/(?:[^(\/)\\]|\\.)*$/, '' );
    }

// ────────────────────────────────────────────────────────────────────────────────