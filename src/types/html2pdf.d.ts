declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | string;
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number };
    jsPDF?: { unit: string; format: string; orientation: string };
    pagebreak?: { mode: string; before?: string[]; after?: string[] };
  }

  function html2pdf(): {
    from(element: HTMLElement): {
      save(filename?: string): Promise<void>;
      options(options: Html2PdfOptions): void;
    };
  };

  export default html2pdf;
}
declare module "html2pdf.js" {
  function html2pdf(): {
    from(element: HTMLElement): {
      options(options: any): void;
      save(filename?: string): Promise<void>;
    };
  };
  export = html2pdf;
}
