// Type definitions for Hound
// Project: https://github.com/beefsack/node-hound
// Definitions by: Pouya Kary <https://github.com/pmkary>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="node.d.ts" />

declare module "hound" {

    import fs = require('fs');

    export class watcher {
        public on ( event: string, func: ( file: string, stats: fs.Stats ) => void ): void;
        public unwatch ( path: string ): void;
        public clear ( ): void;
    }

    export function watch ( path: string ): watcher;
}