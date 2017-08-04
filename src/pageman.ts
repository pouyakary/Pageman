//
// Pageman - HTML, Markdown and Legend mixer that Loves Jekyll and Kary Comments.
//    Copyright 2016 by Pouya Kary <k@karyfoundation.org>
//

//
// ─── INCLUDES ───────────────────────────────────────────────────────────────────
//

    import * as legend from './legend';
    import * as marked from 'marked';

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
        kind: language;
        value: string;
    }

    interface pagemanOptions {
        legendNoLinking?: boolean;
    }

//
// ─── GLOBAL SETTINGS ────────────────────────────────────────────────────────────
//

    var currentLegendNumber = 1;
    var resetLegendAtPart = false;
    var legendNoLinking = false;

//
// ─── START ──────────────────────────────────────────────────────────────────────
//

    export function compile ( pageText: string , options: pagemanOptions ) { 
        if ( options.legendNoLinking != undefined ) {
            legendNoLinking = options.legendNoLinking;
        }
        let parsedParts = parseParts( pageText );
        return compileParts( parsedParts );
    }

//
// ─── PARSE PARTS ────────────────────────────────────────────────────────────────
//

    /**
     * Parses the text file and detects the ***language parts***.
     */
    export function parseParts ( pageText: string ): part[ ] {
        // defs
        var result = new Array<part> ( );
        var currentLanguage: language = language.html;
        var currentValueLines = new Array<string>( );

        // functions
        function pushCleanReset( ) {
            if ( currentValueLines.length > 0 ) {
                result.push({ 
                    kind: currentLanguage,
                    value: currentValueLines.join('\n')
                });
                currentLanguage = language.html;
                currentValueLines = [ ];
            }
        }

        // body
        pageText.split('\n').forEach( line => {

            // if not comment
            if ( !line.match( /^\s*\/\/.*$/gi ) ) {

                // starting markdown part
                if ( line.match( /^\s*---\s*(md|mdown|markdown)\s*$/i ) ) {
                    pushCleanReset( );
                    currentLanguage = language.markdown;

                // starting legend part
                } else if ( line.match( /^\s*---\s*legend\s*$/i ) ) {
                    pushCleanReset( );
                    currentLanguage = language.legend;

                // ending part
                } else if ( line.match( /^\s*---\s*(e|end)\s*$/i ) ) {
                    pushCleanReset( );

                // adding new lines to the part
                } else {
                    currentValueLines.push( line );
                }
            }
        });

        // Adding last results
        pushCleanReset( );

        // done
        return result;
    }

//
// ─── COMPILE PARTS ──────────────────────────────────────────────────────────────
//

    /**
     * Compiles different page parts
     */
    function compileParts( parts: part[ ] ): string {
        let lines = new Array<string> ( );
        parts.forEach( part => {
            switch ( part.kind ) {
                case language.legend:
                    let legendResult = legend.compile( part.value, {
                        startingIndex: currentLegendNumber,
                        noLinking: legendNoLinking
                    });
                    if ( !resetLegendAtPart ) {
                        currentLegendNumber = legendResult.currentLegendNumber;
                    }
                    lines.push( legendResult.compiledSource );
                    break;

                case language.markdown:
                    lines.push( marked( part.value ) );
                    break;

                default:
                    lines.push( part.value );
                    break;
            }
        });

        // and done...
        return lines.join('\n');
    }

// ────────────────────────────────────────────────────────────────────────────────