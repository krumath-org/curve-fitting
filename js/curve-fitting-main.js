// Copyright 2015-2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

// Must be first: sets Kantumruy Pro before any PhetFont is constructed at import time.
import './applyKantumruyFontFamily.js';

import localeProperty from '../../joist/js/i18n/localeProperty.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import CurveFittingConstants from './curve-fitting/CurveFittingConstants.js';
import CurveFittingScreen from './curve-fitting/CurveFittingScreen.js';
import createLanguageSwitch from './createLanguageSwitch.js';
import CurveFittingStrings from './CurveFittingStrings.js';

const curveFittingTitleStringProperty = CurveFittingStrings[ 'curve-fitting' ].titleStringProperty;

const simOptions = {
  credits: {
    leadDesign: 'Michael Dubson, Amanda McGarry',
    softwareDevelopment: 'Michael Dubson, Chris Malley, Jonathan Olson, Saurabh Totey, Martin Veillette',
    team: 'Trish Loeblein, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Jaspe Arias, Logan Bray, Megan Lai, Liam Mulhall, Kathryn Woessner',
    graphicArts: '',
    thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
  }
};

const launchSimulation = () => {

  // Khmer is the default locale for this KruMath fork.
  localeProperty.value = 'km';

  const screen = new CurveFittingScreen();
  const sim = new Sim( curveFittingTitleStringProperty, [ screen ], simOptions );

  // Single-screen sims have no HomeScreen. Attach the CAV-style switch after views exist.
  sim.isConstructionCompleteProperty.lazyLink( isComplete => {
    if ( isComplete ) {
      const languageSwitch = createLanguageSwitch();
      const screenView = screen.view;
      screenView.addChild( languageSwitch );
      languageSwitch.left = screenView.layoutBounds.minX + CurveFittingConstants.SCREEN_VIEW_X_MARGIN;
      languageSwitch.bottom = screenView.layoutBounds.maxY - CurveFittingConstants.SCREEN_VIEW_Y_MARGIN;
      languageSwitch.moveToFront();
    }
  } );

  sim.start();
};

const kantumruyFont = new FontFace(
  'Kantumruy Pro',
  `url(${new URL( 'images/KantumruyProKhmer.woff2', window.location.href )})`,
  { weight: '100 900' }
);

kantumruyFont.load().then( loadedFont => {
  document.fonts.add( loadedFont );
  simLauncher.launch( launchSimulation );
} ).catch( error => {
  console.error( 'Unable to load Kantumruy Pro; using the default font.', error );
  simLauncher.launch( launchSimulation );
} );
