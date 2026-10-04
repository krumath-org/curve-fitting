/**
 * Merge babel/*-strings_km.json into babel/_generated_development_strings/*_all.json
 * so unbuilt/dev-server mode can load Khmer without regenerating via grunt.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const workspaceRoot = path.resolve( __dirname, '../..' );
const genDir = path.join( workspaceRoot, 'babel', '_generated_development_strings' );

const repos = [ 'curve-fitting', 'joist', 'scenery-phet' ];

for ( const repo of repos ) {
  const kmPath = path.join( workspaceRoot, 'babel', repo, `${repo}-strings_km.json` );
  const allPath = path.join( genDir, `${repo}_all.json` );

  if ( !fs.existsSync( kmPath ) ) {
    throw new Error( `Missing ${kmPath}` );
  }
  if ( !fs.existsSync( allPath ) ) {
    throw new Error( `Missing ${allPath}` );
  }

  const km = JSON.parse( fs.readFileSync( kmPath, 'utf8' ) );
  const all = JSON.parse( fs.readFileSync( allPath, 'utf8' ) );

  // Conglomerate stores locale -> flat key -> { value }
  // For scenery-phet, merge onto any existing upstream km entries.
  const existingKm = all.km && typeof all.km === 'object' ? all.km : {};
  const nextKm = { ...existingKm };
  for ( const [ key, entry ] of Object.entries( km ) ) {
    nextKm[ key ] = { value: entry.value };
  }
  all.km = nextKm;

  fs.writeFileSync( allPath, `${JSON.stringify( all, null, 2 )}\n`, 'utf8' );
  console.log( `Patched ${repo}_all.json km keys=${Object.keys( nextKm ).length}` );
}
