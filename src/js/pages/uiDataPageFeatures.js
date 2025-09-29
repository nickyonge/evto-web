import * as ui from "../ui";
import * as txt from '../text';
import * as cost from '../costs';
import * as cmp from '../components';

/** show the languauges dropdown? */
const languageDropdown = false;// TODO: Languages in language dropdown
// Issue URL: https://github.com/nickyonge/evto-web/issues/1


export function CreatePageFeatures(page) {
    // ----------------------------- CREATE FEATURES PAGE -----

    let featuresGrid = ui.CreateDivWithClass('grid');
    page.appendChild(featuresGrid);

    let moLandDetail = new cmp.MutliOptionList(
        txt.PG_FEAT_LANDDETAIL, null,
        txt.PG_FEAT_LANDDETAIL_OPTIONS,
        cost.FEAT_LANDDETAIL,
        null, 0
    );
    let moGCSLines = new cmp.MutliOptionList(
        txt.PG_FEAT_GCSLINES, null,
        txt.PG_FEAT_GCSLINES_OPTIONS,
        cost.FEAT_GCSLINES,
        null, 0
    );
    let moLabelling = new cmp.MutliOptionList(
        txt.PG_FEAT_LABELLING, null,
        txt.PG_FEAT_LABELLING_OPTIONS,
        cost.FEAT_LABELLING,
        null, 0
    );
    let moTitleBox = new cmp.MutliOptionList(
        txt.PG_FEAT_TITLEBOX, null,
        txt.PG_FEAT_TITLEBOX_OPTIONS,
        cost.FEAT_TITLEBOX,
        null, 0
    );
    let moLandLines = new cmp.MutliOptionList(
        txt.PG_FEAT_LANDLINES, null,
        txt.PG_FEAT_LANDLINES_OPTIONS,
        cost.FEAT_LANDLINES,
        null, 0
    );

    featuresGrid.appendChild(moLandDetail.div);
    featuresGrid.appendChild(moGCSLines.div);
    featuresGrid.appendChild(moLabelling.div);
    featuresGrid.appendChild(moTitleBox.div);
    featuresGrid.appendChild(moLandLines.div);

    if (languageDropdown) {
        let ddLanguage = new cmp.DropdownList(
            txt.PG_FEAT_LANGUAGE, null,
            txt.PG_FEAT_LANGUAGE_OPTIONS,
            null, null, 0
        );
        featuresGrid.appendChild(ddLanguage.div);
    }
}