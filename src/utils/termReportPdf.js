const PDF_PAGE_WIDTH = 595;
const PDF_PAGE_HEIGHT = 842;

const CANVAS_PAGE_WIDTH = 1240;
const CANVAS_PAGE_HEIGHT = 1754;
const PAGE_MARGIN = 80;
const PAGE_FOOTER_HEIGHT = 72;
const PAGE_CONTENT_BOTTOM =
  CANVAS_PAGE_HEIGHT - PAGE_MARGIN - PAGE_FOOTER_HEIGHT;

const logoCache = new Map();
const encoder = new TextEncoder();
const crcTable = new Uint32Array(256).map((_, index) => {
  let current = index;
  for (let bit = 0; bit < 8; bit += 1) {
    current = current & 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
  }
  return current >>> 0;
});

function sanitizeText(value) {
  return String(value ?? "").trim();
}

function sanitizeFileName(value) {
  return sanitizeText(value)
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function roundToOneDecimal(value) {
  return Math.round(Number(value || 0) * 10) / 10;
}

function bytesToPdfString(bytes) {
  let output = "";
  for (let index = 0; index < bytes.length; index += 1) {
    output += String.fromCharCode(bytes[index]);
  }
  return output;
}

function createPdfBytes(value) {
  if (value instanceof Uint8Array) return value;
  return encoder.encode(String(value));
}

function computeCrc32(bytes) {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function numberToLittleEndianBytes(value, byteLength) {
  const bytes = new Uint8Array(byteLength);
  let remaining = Number(value >>> 0);
  for (let index = 0; index < byteLength; index += 1) {
    bytes[index] = remaining & 0xff;
    remaining >>>= 8;
  }
  return bytes;
}

function appendBytes(parts, bytes) {
  parts.push(bytes instanceof Uint8Array ? bytes : createPdfBytes(bytes));
}

function getDosDateTimeParts(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date(date);
  const year = Math.max(safeDate.getFullYear(), 1980);
  const month = safeDate.getMonth() + 1;
  const day = safeDate.getDate();
  const hours = safeDate.getHours();
  const minutes = safeDate.getMinutes();
  const seconds = Math.floor(safeDate.getSeconds() / 2);

  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  const dosDate = ((year - 1980) << 9) | (month << 5) | day;

  return { dosDate, dosTime };
}

function decodeBase64(value) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function loadLogoImage(logoUrl) {
  const normalizedUrl = sanitizeText(logoUrl);
  if (!normalizedUrl) return null;
  if (logoCache.has(normalizedUrl)) return logoCache.get(normalizedUrl);

  const imagePromise = new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = normalizedUrl;
  });

  logoCache.set(normalizedUrl, imagePromise);
  return imagePromise;
}

function createCanvasPage() {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_PAGE_WIDTH;
  canvas.height = CANVAS_PAGE_HEIGHT;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textBaseline = "top";

  return { canvas, ctx };
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
  const value = sanitizeText(text);
  if (!value) return { y, lines: [] };

  const segments = value.split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  for (const segment of segments) {
    const nextLine = currentLine ? `${currentLine} ${segment}` : segment;
    if (ctx.measureText(nextLine).width <= maxWidth || !currentLine) {
      currentLine = nextLine;
      continue;
    }
    lines.push(currentLine);
    currentLine = segment;
  }

  if (currentLine) lines.push(currentLine);

  ctx.fillStyle = options.color || "#111827";
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return {
    y: y + lines.length * lineHeight,
    lines,
  };
}

function drawSectionTitle(ctx, title, y) {
  ctx.fillStyle = "#111827";
  ctx.font = "700 30px Inter, Arial, sans-serif";
  ctx.fillText(title, PAGE_MARGIN, y);
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAGE_MARGIN, y + 40);
  ctx.lineTo(CANVAS_PAGE_WIDTH - PAGE_MARGIN, y + 40);
  ctx.stroke();
  return y + 56;
}

function drawLabelValue(ctx, label, value, x, y, width) {
  ctx.fillStyle = "#6b7280";
  ctx.font = "600 18px Inter, Arial, sans-serif";
  ctx.fillText(label, x, y);
  ctx.fillStyle = "#111827";
  ctx.font = "500 22px Inter, Arial, sans-serif";
  const wrapped = drawWrappedText(ctx, value || "-", x, y + 26, width, 28);
  return wrapped.y;
}

function drawSummaryCard(ctx, x, y, width, height, label, value, accent) {
  ctx.fillStyle = "#f9fafb";
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = "700 34px Inter, Arial, sans-serif";
  ctx.fillText(value, x + 24, y + 24);

  ctx.fillStyle = "#4b5563";
  ctx.font = "600 18px Inter, Arial, sans-serif";
  ctx.fillText(label, x + 24, y + 76);
}

function drawTableHeader(ctx, y) {
  ctx.fillStyle = "#eef2ff";
  ctx.fillRect(PAGE_MARGIN, y, CANVAS_PAGE_WIDTH - PAGE_MARGIN * 2, 42);

  ctx.fillStyle = "#1f2937";
  ctx.font = "700 18px Inter, Arial, sans-serif";
  ctx.fillText("Subject", PAGE_MARGIN + 18, y + 12);
  ctx.fillText("Exam Avg", 620, y + 12);
  ctx.fillText("Assignment Avg", 790, y + 12);
  ctx.fillText("Final", 1048, y + 12);

  return y + 42;
}

function drawTableRow(ctx, y, row) {
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAGE_MARGIN, y + 42);
  ctx.lineTo(CANVAS_PAGE_WIDTH - PAGE_MARGIN, y + 42);
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.font = "500 18px Inter, Arial, sans-serif";
  const subject = sanitizeText(row.name) || "General";
  const subjectLines = drawWrappedText(
    ctx,
    subject,
    PAGE_MARGIN + 18,
    y + 10,
    470,
    22,
  );

  ctx.fillText(row.examAverageLabel, 638, y + 10);
  ctx.fillText(row.assignmentAverageLabel, 840, y + 10);
  ctx.font = "700 18px Inter, Arial, sans-serif";
  ctx.fillText(row.finalScoreLabel, 1074, y + 10);

  const rowHeight = Math.max(42, subjectLines.lines.length * 22 + 16);
  return y + rowHeight;
}

function buildPageImageBytes(canvas) {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  return decodeBase64(dataUrl.split(",")[1]);
}

function addFooter(ctx, pageNumber, totalPages) {
  const footerTop = CANVAS_PAGE_HEIGHT - PAGE_MARGIN - 24;
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAGE_MARGIN, footerTop - 18);
  ctx.lineTo(CANVAS_PAGE_WIDTH - PAGE_MARGIN, footerTop - 18);
  ctx.stroke();

  ctx.fillStyle = "#6b7280";
  ctx.font = "500 16px Inter, Arial, sans-serif";
  ctx.fillText(
    "Generated from existing EduHub academic records",
    PAGE_MARGIN,
    footerTop,
  );

  const pageLabel = `Page ${pageNumber} of ${totalPages}`;
  const labelWidth = ctx.measureText(pageLabel).width;
  ctx.fillText(
    pageLabel,
    CANVAS_PAGE_WIDTH - PAGE_MARGIN - labelWidth,
    footerTop,
  );
}

function buildPdfFromImages(pages) {
  const objects = [];
  const pageObjectIds = [];
  const fontObjectId = 3;
  let nextObjectId = 4;

  pages.forEach((page) => {
    const imageObjectId = nextObjectId;
    const pageObjectId = nextObjectId + 1;
    const contentObjectId = nextObjectId + 2;
    nextObjectId += 3;

    pageObjectIds.push(pageObjectId);

    const imageStream = bytesToPdfString(page.bytes);
    objects.push(
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.length} >>\nstream\n${imageStream}\nendstream`,
    );

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> /XObject << /Im${pageObjectId} ${imageObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    );

    const contentStream = [
      "q",
      `${PDF_PAGE_WIDTH} 0 0 ${PDF_PAGE_HEIGHT} 0 0 cm`,
      `/Im${pageObjectId} Do`,
      "Q",
    ].join("\n");
    objects.push(
      `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`,
    );
  });

  const chunks = [];
  const offsets = [0];
  let currentOffset = 0;

  const appendChunk = (value) => {
    const bytes = createPdfBytes(value);
    chunks.push(bytes);
    currentOffset += bytes.length;
  };

  appendChunk("%PDF-1.4\n");

  const rootObjects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  [...rootObjects, ...objects].forEach((object, index) => {
    offsets.push(currentOffset);
    appendChunk(`${index + 1} 0 obj\n`);
    appendChunk(object);
    appendChunk("\nendobj\n");
  });

  const xrefStart = currentOffset;
  appendChunk(`xref\n0 ${rootObjects.length + objects.length + 1}\n`);
  appendChunk("0000000000 65535 f \n");
  offsets.slice(1).forEach((offset) => {
    appendChunk(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  appendChunk(
    `trailer\n<< /Size ${rootObjects.length + objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`,
  );

  return new Blob(chunks, { type: "application/pdf" });
}

async function renderReportPages(report) {
  const logo = await loadLogoImage(report?.school?.logoUrl);
  const renderedPages = [];

  const startPage = () => {
    const page = createCanvasPage();
    const { ctx } = page;

    let headerBottom = PAGE_MARGIN;
    if (logo) {
      const maxWidth = 160;
      const maxHeight = 90;
      const scale = Math.min(maxWidth / logo.width, maxHeight / logo.height, 1);
      const drawWidth = logo.width * scale;
      const drawHeight = logo.height * scale;
      ctx.drawImage(logo, PAGE_MARGIN, PAGE_MARGIN, drawWidth, drawHeight);
      headerBottom = PAGE_MARGIN + drawHeight;
    }

    ctx.fillStyle = "#111827";
    ctx.font = "700 42px Inter, Arial, sans-serif";
    ctx.fillText(
      sanitizeText(report?.school?.name) || "School Report",
      280,
      PAGE_MARGIN,
    );

    ctx.fillStyle = "#4b5563";
    ctx.font = "600 22px Inter, Arial, sans-serif";
    ctx.fillText("Term Academic Report", 280, PAGE_MARGIN + 56);
    ctx.fillText(
      `${sanitizeText(report.termLabel)} • ${sanitizeText(report.academicPeriod)}`,
      280,
      PAGE_MARGIN + 90,
    );

    if (report?.school?.address) {
      ctx.font = "500 18px Inter, Arial, sans-serif";
      drawWrappedText(
        ctx,
        report.school.address,
        280,
        PAGE_MARGIN + 126,
        860,
        24,
        { color: "#6b7280" },
      );
    }

    ctx.strokeStyle = "#c7d2fe";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(PAGE_MARGIN, Math.max(headerBottom, PAGE_MARGIN + 160) + 24);
    ctx.lineTo(
      CANVAS_PAGE_WIDTH - PAGE_MARGIN,
      Math.max(headerBottom, PAGE_MARGIN + 160) + 24,
    );
    ctx.stroke();

    return {
      ...page,
      y: Math.max(headerBottom, PAGE_MARGIN + 160) + 52,
    };
  };

  let current = startPage();

  const pushCurrentPage = () => {
    renderedPages.push({
      width: current.canvas.width,
      height: current.canvas.height,
      canvas: current.canvas,
      bytes: buildPageImageBytes(current.canvas),
    });
  };

  const ensureSpace = (heightNeeded) => {
    if (current.y + heightNeeded <= PAGE_CONTENT_BOTTOM) return;
    pushCurrentPage();
    current = startPage();
  };

  current.y = drawSectionTitle(current.ctx, "Student Details", current.y);
  const leftColumnX = PAGE_MARGIN;
  const rightColumnX = 650;
  const columnWidth = 430;

  const detailBottomLeft = Math.max(
    drawLabelValue(
      current.ctx,
      "Student Name",
      report.studentName,
      leftColumnX,
      current.y,
      columnWidth,
    ),
    drawLabelValue(
      current.ctx,
      "Student ID",
      report.studentId,
      rightColumnX,
      current.y,
      columnWidth,
    ),
  );
  current.y = detailBottomLeft + 18;

  const detailBottomRight = Math.max(
    drawLabelValue(
      current.ctx,
      "Class",
      report.className,
      leftColumnX,
      current.y,
      columnWidth,
    ),
    drawLabelValue(
      current.ctx,
      "Generated",
      report.generatedAtLabel,
      rightColumnX,
      current.y,
      columnWidth,
    ),
  );
  current.y = detailBottomRight + 34;

  ensureSpace(170);
  current.y = drawSectionTitle(current.ctx, "Performance Summary", current.y);
  drawSummaryCard(
    current.ctx,
    PAGE_MARGIN,
    current.y,
    250,
    120,
    "Overall Average",
    report.overallAverageLabel,
    "#4f46e5",
  );
  drawSummaryCard(
    current.ctx,
    PAGE_MARGIN + 274,
    current.y,
    250,
    120,
    "Attendance",
    report.attendanceRateLabel,
    "#0f766e",
  );
  drawSummaryCard(
    current.ctx,
    PAGE_MARGIN + 548,
    current.y,
    250,
    120,
    "Subjects",
    String(report.subjects.length),
    "#b45309",
  );
  drawSummaryCard(
    current.ctx,
    PAGE_MARGIN + 822,
    current.y,
    250,
    120,
    "Position",
    report?.ranking?.position
      ? `${report.ranking.position}/${report.ranking.totalStudents}`
      : `-/${report?.ranking?.totalStudents || 0}`,
    "#be123c",
  );
  current.y += 156;

  ensureSpace(120);
  current.y = drawSectionTitle(current.ctx, "Subject Grades", current.y);
  current.y = drawTableHeader(current.ctx, current.y);

  if (!report.subjects.length) {
    current.ctx.fillStyle = "#6b7280";
    current.ctx.font = "500 18px Inter, Arial, sans-serif";
    current.ctx.fillText(
      "No subject grades were recorded for this student in the selected term.",
      PAGE_MARGIN + 10,
      current.y + 18,
    );
    current.y += 54;
  } else {
    report.subjects.forEach((subject) => {
      ensureSpace(70);
      if (current.y + 70 > PAGE_CONTENT_BOTTOM) {
        current.y = drawTableHeader(current.ctx, current.y);
      }
      current.y = drawTableRow(current.ctx, current.y, subject);
    });
  }

  ensureSpace(190);
  current.y += 18;
  current.y = drawSectionTitle(current.ctx, "Teacher Remarks", current.y);

  const remarks =
    Array.isArray(report.teacherRemarks) && report.teacherRemarks.length
      ? report.teacherRemarks
      : ["No teacher comments were recorded for this term."];

  remarks.forEach((remark) => {
    ensureSpace(56);
    current.ctx.fillStyle = "#4f46e5";
    current.ctx.font = "700 18px Inter, Arial, sans-serif";
    current.ctx.fillText("-", PAGE_MARGIN + 8, current.y);
    current.ctx.fillStyle = "#111827";
    current.ctx.font = "500 18px Inter, Arial, sans-serif";
    const wrapped = drawWrappedText(
      current.ctx,
      remark,
      PAGE_MARGIN + 34,
      current.y,
      CANVAS_PAGE_WIDTH - PAGE_MARGIN * 2 - 44,
      24,
    );
    current.y = wrapped.y + 14;
  });

  ensureSpace(110);
  current.y = drawSectionTitle(current.ctx, "Attendance Snapshot", current.y);
  current.ctx.fillStyle = "#111827";
  current.ctx.font = "500 20px Inter, Arial, sans-serif";
  current.ctx.fillText(
    `Present sessions: ${report.attendance.present}`,
    PAGE_MARGIN,
    current.y,
  );
  current.ctx.fillText(
    `Absent sessions: ${report.attendance.absent}`,
    PAGE_MARGIN,
    current.y + 34,
  );
  current.ctx.fillText(
    `Attendance percentage: ${report.attendanceRateLabel}`,
    PAGE_MARGIN,
    current.y + 68,
  );

  pushCurrentPage();

  renderedPages.forEach((page, index) => {
    const footerContext = page.canvas.getContext("2d");
    addFooter(footerContext, index + 1, renderedPages.length);
    page.bytes = buildPageImageBytes(page.canvas);
  });

  return renderedPages;
}

export async function buildTermReportPdfBlob(report) {
  const pages = await renderReportPages(report);
  return buildPdfFromImages(pages);
}

export async function downloadTermReportPdf(report) {
  const pdfBlob = await buildTermReportPdfBlob(report);
  const objectUrl = URL.createObjectURL(pdfBlob);
  const fileNameParts = [
    sanitizeFileName(report.studentName || "student"),
    sanitizeFileName(report.termLabel || report.term || "term"),
    sanitizeFileName(report.academicPeriod || "report"),
  ].filter(Boolean);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${fileNameParts.join(" - ")}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

export async function downloadZipArchive(files, zipFileName = "reports.zip") {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  let centralDirectorySize = 0;

  for (const file of files) {
    const safeName =
      sanitizeFileName(file?.name || "report.pdf") || "report.pdf";
    const fileNameBytes = createPdfBytes(safeName);
    const blobBytes = new Uint8Array(await file.blob.arrayBuffer());
    const crc32 = computeCrc32(blobBytes);
    const { dosDate, dosTime } = getDosDateTimeParts(new Date());

    const localHeaderParts = [];
    appendBytes(localHeaderParts, numberToLittleEndianBytes(0x04034b50, 4));
    appendBytes(localHeaderParts, numberToLittleEndianBytes(20, 2));
    appendBytes(localHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(localHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(localHeaderParts, numberToLittleEndianBytes(dosTime, 2));
    appendBytes(localHeaderParts, numberToLittleEndianBytes(dosDate, 2));
    appendBytes(localHeaderParts, numberToLittleEndianBytes(crc32, 4));
    appendBytes(
      localHeaderParts,
      numberToLittleEndianBytes(blobBytes.length, 4),
    );
    appendBytes(
      localHeaderParts,
      numberToLittleEndianBytes(blobBytes.length, 4),
    );
    appendBytes(
      localHeaderParts,
      numberToLittleEndianBytes(fileNameBytes.length, 2),
    );
    appendBytes(localHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(localHeaderParts, fileNameBytes);
    appendBytes(localHeaderParts, blobBytes);

    localHeaderParts.forEach((part) => appendBytes(localParts, part));

    const centralHeaderParts = [];
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0x02014b50, 4));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(20, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(20, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(dosTime, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(dosDate, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(crc32, 4));
    appendBytes(
      centralHeaderParts,
      numberToLittleEndianBytes(blobBytes.length, 4),
    );
    appendBytes(
      centralHeaderParts,
      numberToLittleEndianBytes(blobBytes.length, 4),
    );
    appendBytes(
      centralHeaderParts,
      numberToLittleEndianBytes(fileNameBytes.length, 2),
    );
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0, 2));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(0, 4));
    appendBytes(centralHeaderParts, numberToLittleEndianBytes(offset, 4));
    appendBytes(centralHeaderParts, fileNameBytes);

    centralHeaderParts.forEach((part) => appendBytes(centralParts, part));

    const localSize = localHeaderParts.reduce(
      (sum, part) => sum + part.length,
      0,
    );
    const centralSize = centralHeaderParts.reduce(
      (sum, part) => sum + part.length,
      0,
    );
    offset += localSize;
    centralDirectorySize += centralSize;
  }

  const endParts = [];
  appendBytes(endParts, numberToLittleEndianBytes(0x06054b50, 4));
  appendBytes(endParts, numberToLittleEndianBytes(0, 2));
  appendBytes(endParts, numberToLittleEndianBytes(0, 2));
  appendBytes(endParts, numberToLittleEndianBytes(files.length, 2));
  appendBytes(endParts, numberToLittleEndianBytes(files.length, 2));
  appendBytes(endParts, numberToLittleEndianBytes(centralDirectorySize, 4));
  appendBytes(endParts, numberToLittleEndianBytes(offset, 4));
  appendBytes(endParts, numberToLittleEndianBytes(0, 2));

  const zipBlob = new Blob([...localParts, ...centralParts, ...endParts], {
    type: "application/zip",
  });
  const objectUrl = URL.createObjectURL(zipBlob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = sanitizeFileName(zipFileName) || "reports.zip";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

export function formatScoreLabel(value) {
  if (!Number.isFinite(Number(value))) return "N/A";
  return `${roundToOneDecimal(value)}%`;
}
