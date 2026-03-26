import { Buffer } from "node:buffer";

import { ZipFile } from "yazl";

export type WorkbookCell = {
  hyperlink?: string;
  value: string;
};

type CreateWorkbookInput = {
  columnWidth?: number;
  rows: WorkbookCell[][];
  sheetName: string;
};

type HyperlinkCell = {
  cellRef: string;
  target: string;
};

const HEADER_STYLE_ID = 1;
const HYPERLINK_STYLE_ID = 2;
const DEFAULT_COLUMN_WIDTH = 26;
const ZIP_ENTRY_OPTIONS = { compress: false };
const RELATIONSHIP_NAMESPACE =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const WORKSHEET_NAMESPACE =
  "http://schemas.openxmlformats.org/spreadsheetml/2006/main";

function escapeXmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXmlAttribute(value: string) {
  return escapeXmlText(value)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function shouldPreserveSpace(value: string) {
  return /^\s|\s$|[\n\r\t]/.test(value);
}

function columnNumberToName(index: number) {
  let current = index + 1;
  let output = "";

  while (current > 0) {
    const remainder = (current - 1) % 26;
    output = String.fromCharCode(65 + remainder) + output;
    current = Math.floor((current - 1) / 26);
  }

  return output;
}

function buildCellXml(input: {
  cell: WorkbookCell;
  columnIndex: number;
  hyperlinkStyleId: number;
  rowIndex: number;
}) {
  const cellRef = `${columnNumberToName(input.columnIndex)}${input.rowIndex + 1}`;
  const styleId =
    input.rowIndex === 0
      ? HEADER_STYLE_ID
      : input.cell.hyperlink
        ? input.hyperlinkStyleId
        : 0;
  const escapedValue = escapeXmlText(input.cell.value);
  const spaceAttribute = shouldPreserveSpace(input.cell.value)
    ? ' xml:space="preserve"'
    : "";

  return {
    cellRef,
    xml: `<c r="${cellRef}" t="inlineStr" s="${styleId}"><is><t${spaceAttribute}>${escapedValue}</t></is></c>`,
  };
}

function buildWorksheetXml(rows: WorkbookCell[][], columnWidth: number) {
  const hyperlinks: HyperlinkCell[] = [];
  const maxColumns = Math.max(...rows.map((row) => row.length), 0);
  const colsXml =
    maxColumns > 0
      ? `<cols>${Array.from({ length: maxColumns }, (_, index) => `<col min="${index + 1}" max="${index + 1}" width="${columnWidth}" customWidth="1"/>`).join("")}</cols>`
      : "";

  const rowsXml = rows
    .map((row, rowIndex) => {
      const cellsXml = row
        .map((cell, columnIndex) => {
          const builtCell = buildCellXml({
            cell,
            columnIndex,
            hyperlinkStyleId: HYPERLINK_STYLE_ID,
            rowIndex,
          });

          if (cell.hyperlink) {
            hyperlinks.push({
              cellRef: builtCell.cellRef,
              target: cell.hyperlink,
            });
          }

          return builtCell.xml;
        })
        .join("");

      return `<row r="${rowIndex + 1}">${cellsXml}</row>`;
    })
    .join("");

  const hyperlinksXml =
    hyperlinks.length > 0
      ? `<hyperlinks>${hyperlinks
          .map(
            (hyperlink, index) =>
              `<hyperlink ref="${hyperlink.cellRef}" r:id="rId${index + 1}"/>`,
          )
          .join("")}</hyperlinks>`
      : "";

  const relationshipsXml =
    hyperlinks.length > 0
      ? `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${hyperlinks
          .map(
            (hyperlink, index) =>
              `<Relationship Id="rId${index + 1}" Type="${RELATIONSHIP_NAMESPACE}/hyperlink" Target="${escapeXmlAttribute(hyperlink.target)}" TargetMode="External"/>`,
          )
          .join("")}</Relationships>`
      : null;

  const worksheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="${WORKSHEET_NAMESPACE}" xmlns:r="${RELATIONSHIP_NAMESPACE}">
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  ${colsXml}
  <sheetData>${rowsXml}</sheetData>
  ${hyperlinksXml}
  <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
</worksheet>`;

  return {
    relationshipsXml,
    worksheetXml,
  };
}

function buildStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="${WORKSHEET_NAMESPACE}">
  <fonts count="3">
    <font><sz val="11"/><color rgb="FF000000"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
    <font><u/><sz val="11"/><color rgb="FF0563C1"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF667EEA"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`;
}

function buildWorkbookXml(sheetName: string) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="${WORKSHEET_NAMESPACE}" xmlns:r="${RELATIONSHIP_NAMESPACE}">
  <bookViews><workbookView xWindow="0" yWindow="0" windowWidth="28800" windowHeight="15360"/></bookViews>
  <sheets><sheet name="${escapeXmlAttribute(sheetName)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;
}

function buildWorkbookRelationshipsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="${RELATIONSHIP_NAMESPACE}/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="${RELATIONSHIP_NAMESPACE}/styles" Target="styles.xml"/>
</Relationships>`;
}

function buildRootRelationshipsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="${RELATIONSHIP_NAMESPACE}/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function buildAppXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
</Properties>`;
}

function buildCoreXml(at: Date) {
  const timestamp = at.toISOString();

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${timestamp}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${timestamp}</dcterms:modified>
</cp:coreProperties>`;
}

function buildContentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

async function zipToBuffer(zipFile: ZipFile) {
  const chunks: Buffer[] = [];

  for await (const chunk of zipFile.outputStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function createWorkbookBuffer(input: CreateWorkbookInput) {
  const zipFile = new ZipFile();
  const now = new Date();
  const { worksheetXml, relationshipsXml } = buildWorksheetXml(
    input.rows,
    input.columnWidth ?? DEFAULT_COLUMN_WIDTH,
  );

  zipFile.addBuffer(
    Buffer.from(buildContentTypesXml(), "utf8"),
    "[Content_Types].xml",
    ZIP_ENTRY_OPTIONS,
  );
  zipFile.addBuffer(
    Buffer.from(buildRootRelationshipsXml(), "utf8"),
    "_rels/.rels",
    ZIP_ENTRY_OPTIONS,
  );
  zipFile.addBuffer(
    Buffer.from(buildAppXml(), "utf8"),
    "docProps/app.xml",
    ZIP_ENTRY_OPTIONS,
  );
  zipFile.addBuffer(
    Buffer.from(buildCoreXml(now), "utf8"),
    "docProps/core.xml",
    ZIP_ENTRY_OPTIONS,
  );
  zipFile.addBuffer(
    Buffer.from(buildWorkbookXml(input.sheetName), "utf8"),
    "xl/workbook.xml",
    ZIP_ENTRY_OPTIONS,
  );
  zipFile.addBuffer(
    Buffer.from(buildWorkbookRelationshipsXml(), "utf8"),
    "xl/_rels/workbook.xml.rels",
    ZIP_ENTRY_OPTIONS,
  );
  zipFile.addBuffer(
    Buffer.from(buildStylesXml(), "utf8"),
    "xl/styles.xml",
    ZIP_ENTRY_OPTIONS,
  );
  zipFile.addBuffer(
    Buffer.from(worksheetXml, "utf8"),
    "xl/worksheets/sheet1.xml",
    ZIP_ENTRY_OPTIONS,
  );

  if (relationshipsXml) {
    zipFile.addBuffer(
      Buffer.from(relationshipsXml, "utf8"),
      "xl/worksheets/_rels/sheet1.xml.rels",
      ZIP_ENTRY_OPTIONS,
    );
  }

  zipFile.end();

  return zipToBuffer(zipFile);
}
