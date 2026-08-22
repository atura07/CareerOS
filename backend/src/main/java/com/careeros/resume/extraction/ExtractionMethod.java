package com.careeros.resume.extraction;

/**
 * Identifies the extraction technique successfully used to parse the resume.
 */
public enum ExtractionMethod {
    PDFBOX_DIRECT,
    OCR_FALLBACK,
    POI_DOCX,
    HYBRID,
    NONE
}
