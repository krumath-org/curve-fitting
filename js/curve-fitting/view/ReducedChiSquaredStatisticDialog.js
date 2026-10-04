// Copyright 2016-2026, University of Colorado Boulder

/**
 * Dialog that provides information about the reduced chi-squared statistic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Saurabh Totey
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FormulaNode from '../../../../scenery-phet/js/FormulaNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CurveFittingStrings from '../../CurveFittingStrings.js';
import CurveFittingConstants from '../CurveFittingConstants.js';

// constants
const TEXT_OPTIONS = {
  font: CurveFittingConstants.INFO_DIALOG_NORMAL_FONT
};

class ReducedChiSquaredStatisticDialog extends Dialog {

  constructor() {

    // Pattern for styling a symbol with the PhET standard math font
    const symbolPattern = `<i style='font-family:${CurveFittingConstants.INFO_DIALOG_SYMBOL_FONT.family}'>{{symbol}}</i>`;

    // Use StringProperties so dynamic locale (Khmer ↔ English) updates this dialog.
    // Older code captured plain string values at module-import time (still English).
    const nSymbolHtmlProperty = new DerivedProperty(
      [ CurveFittingStrings.nSymbolStringProperty ],
      nSymbol => StringUtils.fillIn( symbolPattern, { symbol: nSymbol } ),
      { tandem: Tandem.OPT_OUT }
    );

    const fSymbolHtmlProperty = new DerivedProperty(
      [ CurveFittingStrings.fSymbolStringProperty ],
      fSymbol => StringUtils.fillIn( symbolPattern, { symbol: fSymbol } ),
      { tandem: Tandem.OPT_OUT }
    );

    const numberOfDataPointsStringProperty = new PatternStringProperty(
      CurveFittingStrings.nEqualsNumberOfDataPointsPatternStringProperty,
      { nSymbol: nSymbolHtmlProperty },
      { tandem: Tandem.OPT_OUT }
    );

    const numberOfParametersStringProperty = new PatternStringProperty(
      CurveFittingStrings.fEqualsNumberOfParametersPatternStringProperty,
      { fSymbol: fSymbolHtmlProperty },
      { tandem: Tandem.OPT_OUT }
    );

    // Formula uses Latin math symbols that are the same in en/km.
    const formulaString = `${CurveFittingStrings.chiSymbolStringProperty.value}_r^2 = ` +
                          `\\frac{1}{${CurveFittingStrings.nSymbolStringProperty.value} - ${CurveFittingStrings.fSymbolStringProperty.value}} ` +
                          '\\sum_i ' +
                          `\\frac{[${CurveFittingStrings.ySymbolStringProperty.value}(${CurveFittingStrings.xSymbolStringProperty.value}_i) - ${CurveFittingStrings.ySymbolStringProperty.value}_i]^2}{\\sigma_i^2}`;

    const contentNode = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        new Text( CurveFittingStrings.theReducedChiSquaredStatisticIsStringProperty, TEXT_OPTIONS ),
        new HBox( {
          children: [
            new HStrut( 20 ),
            new FormulaNode( formulaString )
          ]
        } ),
        new RichText( numberOfDataPointsStringProperty, TEXT_OPTIONS ),
        new RichText( numberOfParametersStringProperty, TEXT_OPTIONS )
      ],
      maxWidth: 500 // determined empirically
    } );

    super( contentNode );
  }
}

export default ReducedChiSquaredStatisticDialog;
