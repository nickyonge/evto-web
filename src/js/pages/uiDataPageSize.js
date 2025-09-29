import * as ui from "../ui";
import * as txt from '../text';
import * as cost from '../costs';
import * as cmp from '../components';
import { canvasDisplayAspectRatio } from "../components/canvassize";
import { SelectSize } from "../contentData";

/** Multioption List for selecting canvas size @type {cmp.MutliOptionList} */
export let moSizeSelector;
export function CreatePageSize(page) {
    // ----------------------------- CREATE SIZE PAGE -----
    let sizeGrid = ui.CreateDivWithClass('grid');
    let txInfo = new cmp.TextField(txt.LIPSUM);
    let cs = new cmp.CanvasSize("Canvas Size");

    ui.AddElementAttribute(sizeGrid, 'maxGridAspect', canvasDisplayAspectRatio);
    moSizeSelector = new cmp.MutliOptionList('Size', SelectSize,
        [ // sizing and labels 
            `${txt.PG_SIZE_SM}, <i>${txt.DATA_SIZE_SM}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_SMP}, <i>${txt.DATA_SIZE_SMP}</i>`,
            `${txt.PG_SIZE_MD}, <i>${txt.DATA_SIZE_MD}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_MDP}, <i>${txt.DATA_SIZE_MDP}</i>`,
            `${txt.PG_SIZE_LG}, <i>${txt.DATA_SIZE_LG}</i>`,
            `&nbsp;&nbsp;${txt.PG_SIZE_LGP}, <i>${txt.DATA_SIZE_LGP}</i>`,
        ], cost.SIZE_CANVAS);

    page.appendChild(txInfo.div); // add to page directly, not grid
    sizeGrid.appendChild(cs.div);
    sizeGrid.appendChild(moSizeSelector.div);
    page.appendChild(sizeGrid);
}