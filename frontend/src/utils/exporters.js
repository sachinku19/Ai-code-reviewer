export const copyText = async (text) => {
  await navigator.clipboard.writeText(text || "");
};

export const downloadFile = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportReviewAsPdf = (title, html) => {
  const printWindow = window.open("", "_blank", "width=960,height=720");
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body{font-family:Inter,Arial,sans-serif;color:#111827;padding:32px;line-height:1.6}
          pre{background:#111827;color:#f8fafc;padding:16px;border-radius:12px;white-space:pre-wrap}
          h1,h2,h3{color:#0f172a}
        </style>
      </head>
      <body><h1>${title}</h1>${html}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
