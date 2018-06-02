//
// Copyright 2016-present by Pouya Kary <pouya@kary.us>
//

//
// ─── INCLUDES ───────────────────────────────────────────────────────────────────
//

    import * as legend from './legend'
    import * as marked from 'marked'

//
// ─── ENUMS ──────────────────────────────────────────────────────────────────────
//

    enum language {
        html, markdown, legend
    }

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

    interface part {
        kind: language
        value: string
    }

    interface pagemanOptions {
        legendNoLinking?: boolean
    }

//
// ─── GLOBAL SETTINGS ────────────────────────────────────────────────────────────
//

    var currentLegendNumber = 1
    var resetLegendAtPart = false
    var legendNoLinking = false

//
// ─── START ──────────────────────────────────────────────────────────────────────
//

    export function compile ( pageText: string , options: pagemanOptions ) {
        currentLegendNumber = 1
        if ( options.legendNoLinking != undefined )
            legendNoLinking = options.legendNoLinking
        const parsedParts =
            parseParts( pageText )
        return compileParts( parsedParts )
    }

//
// ─── PARSE PARTS ────────────────────────────────────────────────────────────────
//

    /**
     * Parses the text file and detects the ***language parts***.
     */
    export function parseParts ( pageText: string ): part[ ] {
        // defs
        const result =
            new Array<part> ( )
        let currentLanguage: language =
            language.html
        let currentValueLines =
            new Array<string>( )

        // functions
        function pushCleanReset( ) {
            if ( currentValueLines.length > 0 ) {
                result.push({
                    kind: currentLanguage,
                    value: currentValueLines.join('\n')
                })
                currentLanguage =
                    language.html
                currentValueLines =
                    [ ]
            }
        }

        // body
        pageText.split( '\n' ).forEach( line => {
            // if not comment
            if ( !line.match( /^\s*\/\/.*$/gi ) ) {

                // starting markdown part
                if ( line.match( /^\s*---\s*(md|mdown|markdown)\s*$/i ) ) {
                    pushCleanReset( )
                    currentLanguage =
                        language.markdown

                // starting legend part
                } else if ( line.match( /^\s*---\s*legend\s*$/i ) ) {
                    pushCleanReset( )
                    currentLanguage =
                        language.legend

                // ending part
                } else if ( line.match( /^\s*---\s*(e|end)\s*$/i ) ) {
                    pushCleanReset( )

                // adding new lines to the part
                } else {
                    currentValueLines.push( line )
                }
            }
        })

        // Adding last results
        pushCleanReset( )

        // done
        return result
    }

//
// ─── COMPILE PARTS ──────────────────────────────────────────────────────────────
//

    /**
     * Compiles different page parts
     */
    function compileParts( parts: part[ ] ): string {
        const lines =
            new Array<string> ( )

        parts.forEach( part => {
            switch ( part.kind ) {
                case language.legend:
                    const legendResult =
                        legend.compile( part.value, {
                            startingIndex: currentLegendNumber,
                            noLinking: legendNoLinking
                        })

                    if ( !resetLegendAtPart )
                        currentLegendNumber = legendResult.currentLegendNumber

                    lines.push( legendResult.compiledSource )
                    break

                case language.markdown:
                    lines.push( marked( part.value ) )
                    break

                default:
                    lines.push( part.value )
                    break
            }
        })

        // and done...
        return lines.join( '\n' )
    }

// ────────────────────────────────────────────────────────────────────────────────