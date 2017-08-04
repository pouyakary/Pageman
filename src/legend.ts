
//
// Pageman - HTML, Markdown and Legend mixer that Loves Jekyll...
//    Copyright 2016 by Pouya Kary <k@karyfoundation.org>
//

//
// ──────────────────────────────────────────────── I ──────────
//  :::::: M A I N : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

//
// ─── INCLUDES ───────────────────────────────────────────────────────────────────
//

    import * as marked from 'marked'

//
// ─── DECELERATIONS ──────────────────────────────────────────────────────────────
//

    interface paragraphTableRow {
        paragraph: string
        legends: Array<string>
    }

    interface legendCompiledResult {
        compiledSource: string
        currentLegendNumber: number
    }

    interface legendOptions {
        startingIndex?: number
        noLinking?: boolean
    }

    interface legendIdTable {
        [ key: string ]: boolean
    }

//
// ─── GLOBAL STORAGE ─────────────────────────────────────────────────────────────
//

    var resultParagraphs = new Array<paragraphTableRow> ( )
    var currentLegend: number = 1
    var noLinking = false
    var ids: legendIdTable = { }

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    /**
     * The grammar fo the legend 
     */
    const legendGrammar = /\^([^\^])+\^/gi

//
// ─── COMPILE ────────────────────────────────────────────────────────────────────
//

    /**
     * Compiles a legend string code into HTML
     */
    export function compile ( code: string,
                           options: legendOptions ): legendCompiledResult {
        // init
        resultParagraphs = new Array<paragraphTableRow> ( )
        if ( options.startingIndex != undefined )
            currentLegend = options.startingIndex

        if ( options.noLinking != undefined )
            noLinking = options.noLinking

        // compile
        for ( const paragraph of getParagraphs( code ) )
            resultParagraphs.push( compileParagraph( paragraph ) )

        // render 
        let renderedCode = renderParagraphTableRowArray( )

        // done
        return {
            compiledSource: renderedCode,
            currentLegendNumber: currentLegend
        }
    }

//
// ─── LOADING RESOURCES ──────────────────────────────────────────────────────────
//

    export function completeHTML ( code: string ) {
        return '<link rel="stylesheet" href="legend.css">\n' + code
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────── II ──────────
//  :::::: C O M P I L E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
//

//
// ─── COMPILE PARAGRAPH ──────────────────────────────────────────────────────────
//

    /**
     * Compiles the legend part of the code as well as the markdown paragraphs
     */
    function compileParagraph ( paragraphCode: string ): paragraphTableRow {
        // our result
        var result: paragraphTableRow = {
            paragraph: '',
            legends: new Array<string> ( )
        }

        // compiling
        result.paragraph = paragraphCode.replace( legendGrammar , ( match: any ) => {
            // creating the id
            let id = createUniqueId( )

            // adding the legend
            let legendContent = <string> marked(
                match.substring( 1 , match.length - 1 ) )

            // removing <p> ... </p>
            legendContent = legendContent.substring( 3, legendContent.length - 5 )

            // adding it...
            result.legends.push(
                 renderBulletin( id, currentLegend, legendContent )
            )

            //returning the id
            let insiderTextOrLink: string
            if ( !noLinking ) {
                // insiderTextOrLink = `<a href="#${ id }">&dagger;${ currentLegend++ }</a>`;
                insiderTextOrLink = '&dagger;' + currentLegend++
            } else {
                insiderTextOrLink = ( currentLegend++ ).toString( );
            }

            return `<sup class="legend-sup">${ insiderTextOrLink }</sup>`
        })

        // compiling markdown
        result.paragraph = marked( result.paragraph )

        // done
        return result
    }

//
// ─── GENERATE RANDOM IDS ────────────────────────────────────────────────────────
//

    function createUniqueId( ): string {
        while ( true ) {
            const id = 'legend' + Math.random( )
                                    .toString( 16 )
                                    .slice( 2 )
            if ( ids[ id ] === undefined ) {
                ids[ id ] = true
                return id
            }
        }
    }

//
// ─── GET PARAGRAPHS ─────────────────────────────────────────────────────────────
//

    function getParagraphs( code: string ): string[ ] {
        return code.split( '\n\n' )
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────── III ──────────
//  :::::: R E N D E R E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
//

//
// ─── RENDERING THE TEXT ─────────────────────────────────────────────────────────
//

    /**
     * Renders the **`paragraphTableRow[ ]`**
     */
    function renderParagraphTableRowArray( ): string {
        var result = new Array<string> ( )
        for ( const row of resultParagraphs )
            result.push( renderParagraph ( row ) )
        return result.join( '\n\n' )
    }

//
// ─── RENDER BULLETIN ────────────────────────────────────────────────────────────
//

    function renderBulletin ( id: string, currentLegend: number, legendContent: string ) {
        return  `<div class="legend-bullet" id="${ id }">
                    <div class="legend-bullet-number">${ currentLegend }</div>
                    <div class="legend-bullet-content">${ legendContent }</div>
                </div>`
    }

//
// ─── RENDER PARAGRAPH ───────────────────────────────────────────────────────────
//

    function renderParagraph( row: paragraphTableRow ): string {
        return `<div class="legend-section">
                    <div class="legend-paragraph">${ row.paragraph }</div>
                    <div class="legend-sidebar"><ul>${ row.legends.join('\n') }</ul></div>
                </div>`
    }

// ────────────────────────────────────────────────────────────────────────────────

