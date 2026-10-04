/**
 * One-shot: apply khmer-translation-review.json into babel *-strings_km.json files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const simRoot = path.resolve( __dirname, '..' );
const workspaceRoot = path.resolve( simRoot, '..' );
const reviewPath = path.join( simRoot, 'khmer-translation-review.json' );

const review = JSON.parse( fs.readFileSync( reviewPath, 'utf8' ) );

function toBabel( section ) {
  const out = {};
  for ( const [ key, entry ] of Object.entries( section ) ) {
    if ( !entry || typeof entry.khmer !== 'string' || entry.khmer === '' ) {
      throw new Error( `Missing khmer for ${key}` );
    }
    out[ key ] = { value: entry.khmer };
  }
  return out;
}

const sim = toBabel( review.sim_visible_ui );
const joist = toBabel( review.shared_joist_chrome );
const sceneryExtra = toBabel( review.shared_scenery_phet_chrome );

const simPath = path.join( workspaceRoot, 'babel', 'curve-fitting', 'curve-fitting-strings_km.json' );
const joistPath = path.join( workspaceRoot, 'babel', 'joist', 'joist-strings_km.json' );
const sceneryPath = path.join( workspaceRoot, 'babel', 'scenery-phet', 'scenery-phet-strings_km.json' );

fs.mkdirSync( path.dirname( simPath ), { recursive: true } );
fs.mkdirSync( path.dirname( joistPath ), { recursive: true } );
fs.mkdirSync( path.dirname( sceneryPath ), { recursive: true } );

fs.writeFileSync( simPath, `${JSON.stringify( sim, null, 2 )}\n`, 'utf8' );
fs.writeFileSync( joistPath, `${JSON.stringify( joist, null, 2 )}\n`, 'utf8' );

let scenery = {};
if ( fs.existsSync( sceneryPath ) ) {
  scenery = JSON.parse( fs.readFileSync( sceneryPath, 'utf8' ) );
}
Object.assign( scenery, sceneryExtra );
fs.writeFileSync( sceneryPath, `${JSON.stringify( scenery, null, 2 )}\n`, 'utf8' );

let empty = 0;
for ( const section of [ review.sim_visible_ui, review.shared_joist_chrome, review.shared_scenery_phet_chrome ] ) {
  for ( const e of Object.values( section ) ) {
    if ( !e.khmer ) { empty++; }
  }
}
review.meta.counts.empty_khmer_needing_translation = empty;
review.meta.applied = '2026-10-04';
if ( !review.meta.how_to_fill.some( s => s.startsWith( 'Applied into babel' ) ) ) {
  review.meta.how_to_fill.push(
    'Applied into babel: curve-fitting-strings_km.json, joist-strings_km.json, scenery-phet-strings_km.json (chrome keys merged).'
  );
}
fs.writeFileSync( reviewPath, `${JSON.stringify( review, null, 2 )}\n`, 'utf8' );

// Also patch unbuilt-mode conglomerates (dev server reads these, not per-locale files).
const { spawnSync } = await import( 'child_process' );
const patch = spawnSync( process.execPath, [ path.join( __dirname, 'patch-generated-strings-km.mjs' ) ], {
  stdio: 'inherit'
} );
if ( patch.status !== 0 ) {
  throw new Error( 'patch-generated-strings-km.mjs failed' );
}

console.log( 'Wrote', simPath );
console.log( 'Wrote', joistPath );
console.log( 'Updated', sceneryPath );
console.log( {
  sim: Object.keys( sim ).length,
  joist: Object.keys( joist ).length,
  scenery: Object.keys( scenery ).length,
  title: sim[ 'curve-fitting.title' ].value,
  done: joist.done.value,
  resetAll: scenery[ 'ResetAllButton.name' ].value
} );
