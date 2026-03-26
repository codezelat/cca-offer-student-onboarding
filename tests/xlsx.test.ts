import { describe, expect, it } from "vitest";

import { createWorkbookBuffer } from "@/lib/xlsx";

describe("createWorkbookBuffer", () => {
  it("creates an xlsx archive with worksheet XML, styles, and hyperlinks", async () => {
    const buffer = await createWorkbookBuffer({
      rows: [
        [{ value: "Registration ID" }, { value: "Payment Slip URL" }],
        [
          { value: "CCA/12345678" },
          {
            value: "https://example.com/slip?student=1&diploma=cca",
            hyperlink: "https://example.com/slip?student=1&diploma=cca",
          },
        ],
        [{ value: " Name With Spaces " }, { value: "A&B <C>" }],
      ],
      sheetName: "Students",
    });

    const zipText = buffer.toString("utf8");

    expect(buffer.subarray(0, 2).toString("utf8")).toBe("PK");
    expect(zipText).toContain("[Content_Types].xml");
    expect(zipText).toContain("xl/workbook.xml");
    expect(zipText).toContain('sheet name="Students"');
    expect(zipText).toContain('<hyperlink ref="B2" r:id="rId1"/>');
    expect(zipText).toContain(
      'Target="https://example.com/slip?student=1&amp;diploma=cca"',
    );
    expect(zipText).toContain('c r="A1" t="inlineStr" s="1"');
    expect(zipText).toContain('c r="B2" t="inlineStr" s="2"');
    expect(zipText).toContain('<t xml:space="preserve"> Name With Spaces </t>');
    expect(zipText).toContain("<t>A&amp;B &lt;C&gt;</t>");
  });
});
