"use client";

import React from "react";

interface ProcessingOptionsProps {
  extractTextFromImages?: boolean;
  splitLargeDocuments?: boolean;
  removeHeadersFooters?: boolean;
  onExtractTextChange?: (checked: boolean) => void;
  onSplitDocumentsChange?: (checked: boolean) => void;
  onRemoveHeadersChange?: (checked: boolean) => void;
}

export const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  extractTextFromImages = true,
  splitLargeDocuments = true,
  removeHeadersFooters = false,
  onExtractTextChange,
  onSplitDocumentsChange,
  onRemoveHeadersChange,
}) => {
  return (
    <div className="mt-6 p-4 bg-muted rounded-lg">
      <h4 className="text-sm font-medium text-foreground mb-2">
        Processing Options
      </h4>
      <div className="space-y-2">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={extractTextFromImages}
            onChange={(e) => onExtractTextChange?.(e.target.checked)}
          />
          <span className="text-sm text-foreground">
            Extract text from images (OCR)
          </span>
        </label>
        <label className="flex items-center">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={splitLargeDocuments}
            onChange={(e) => onSplitDocumentsChange?.(e.target.checked)}
          />
          <span className="text-sm text-foreground">
            Split large documents into chunks
          </span>
        </label>
        <label className="flex items-center">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={removeHeadersFooters}
            onChange={(e) => onRemoveHeadersChange?.(e.target.checked)}
          />
          <span className="text-sm text-foreground">
            Remove headers and footers
          </span>
        </label>
      </div>
    </div>
  );
};
