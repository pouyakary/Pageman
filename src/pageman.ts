//
// Pageman - HTML, Markdown and Legend mixer that Loves Jekyll and Kary Comments.
//    Copyright 2016 by Pouya Kary <k@karyfoundation.org>
//

module Pageman {

    //
    // ─── ENUMS ──────────────────────────────────────────────────────────────────────
    //

        enum Language {
            HTML, Markdown, Legend
        }

    //
    // ─── INTERFACES ─────────────────────────────────────────────────────────────────
    //

        interface Part {
            Kind: Language;
            Value: string;
        }

    //
    // ─── START ──────────────────────────────────────────────────────────────────────
    //

        export function Compile ( pageText: string ) {

        }

    //
    // ─── PARSE PARTS ────────────────────────────────────────────────────────────────
    //

        /**
         * Parses the text file and detects the ***language parts***.
         */
        function ParseParts ( pageText: string ): Array<Part> {
            // defs
            var result = new Array<Part> ( );
            var currentLanguage: Language = Language.HTML;
            var currentValueLines = new Array<string>( );

            // body
            pageText.split('\n').forEach( line => {

                // if not comment
                if ( !line.match( /^ *\/\/.*$/gi ) ) {

                    // starting markdown part
                    if ( line === '---md' ) {
                        currentLanguage = Language.Markdown;

                    // starting legend part
                    } else if ( line === '---legend' ) {
                        currentLanguage = Language.Legend;

                    // ending part
                    } else if ( line === '---end' ) {
                        result.push({ 
                            Kind: currentLanguage,
                            Value: currentValueLines.join('\n')
                        });
                        currentLanguage = Language.HTML;

                    // adding new lines to the part
                    } else {
                        currentValueLines.push( line );
                    }
                }
            });

            // Adding last results
            result.push({
                Kind: currentLanguage,
                Value: currentValueLines.join('\n')
            });

            // done
            return result;
        }

    // ────────────────────────────────────────────────────────────────────────────────

}